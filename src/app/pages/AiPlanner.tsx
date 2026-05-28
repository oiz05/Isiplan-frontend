import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Hotel,
  MapPin,
  Navigation,
  Plane,
  Send,
  Sparkles,
  Utensils,
  Wallet,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  generateTravelPlan,
  getDestinationRecommendations,
  type DestinationRecommendation,
  type GeminiTravelPlan,
} from "../../services/geminiPlannerService";

type MessageNode = {
  id: string;
  sender: "ai" | "user";
  text: string;
  quickReplies?: string[];
  widget?: "destination-cards" | "itinerary-summary" | "loader" | "activity-recommendations";
};

type PlanStage =
  | "init"
  | "knowing-destination"
  | "exploring-destinations"
  | "showing-destination-options"
  | "asking-days-budget"
  | "asking-activities"
  | "recommending-activities"
  | "finished";

const FALLBACK_DESTINATION_IMAGES = [
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
];

const HOTEL_IMAGE = "https://images.unsplash.com/photo-1542051842920-c7c1341c2c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function AiPlanner() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessageNode[]>([
    {
      id: "1",
      sender: "ai",
      text: "¡Hola! Soy tu asistente inteligente de Isiplan con Gemini. Para armar tu viaje ideal, ¿ya tienes un destino en mente o prefieres que te recomiende opciones increíbles?",
      quickReplies: ["Ya sé a dónde ir", "¡Recomiéndame destinos!"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [planStage, setPlanStage] = useState<PlanStage>("init");
  const [destinationOptions, setDestinationOptions] = useState<DestinationRecommendation[]>([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [durationBudget, setDurationBudget] = useState("");
  const [travelPlan, setTravelPlan] = useState<GeminiTravelPlan | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    const cleanText = text.trim();

    if (!cleanText || isTyping) return;

    const userMsg: MessageNode = { id: createId(), sender: "user", text: cleanText };
    setMessages(prev => [...prev.map(m => ({ ...m, quickReplies: undefined })), userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      await processNextStep(cleanText);
    } catch (error) {
      console.error("Gemini planner request failed", error);
      setMessages(prev => [...prev, {
        id: createId(),
        sender: "ai",
        text: getGeminiErrorMessage(error),
        quickReplies: ["Intentar de nuevo", "Cambiar preferencias"],
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const processNextStep = async (userText: string) => {
    const textLower = userText.toLowerCase();

    if (planStage === "init" && textLower.includes("ya sé")) {
      setPlanStage("knowing-destination");
      addAiMessage("¡Excelente! ¿A qué lugar o ciudad quieres viajar?");
      return;
    }

    if (planStage === "init" && textLower.includes("recomi")) {
      setPlanStage("exploring-destinations");
      addAiMessage(
        "¿Qué tipo de ambiente buscas? Puedo recomendarte lugares de interés para playa, montaña, cultura, gastronomía, aventura o descanso.",
        ["Playa y relax", "Cultura y ciudad", "Naturaleza salvaje", "Gastronomía local"],
      );
      return;
    }

    if (planStage === "knowing-destination") {
      setSelectedDestination(userText);
      setPlanStage("asking-days-budget");
      addAiMessage("¡Me encanta ese destino! ¿Por cuántos días planeas ir y qué presupuesto tienes en mente?", ["3 días, económico", "7 días, medio", "14 días, lujo"]);
      return;
    }

    if (planStage === "exploring-destinations") {
      const destinations = await getDestinationRecommendations({ preference: userText });
      setDestinationOptions(destinations);
      setPlanStage("showing-destination-options");
      addAiMessage("Gemini encontró estas opciones según tus gustos. Elige la que más te inspire y armamos el plan completo.", undefined, "destination-cards");
      return;
    }

    if (planStage === "showing-destination-options") {
      const destination = userText.replace(/^quiero ir a\s+/i, "");
      setSelectedDestination(destination);
      setPlanStage("asking-days-budget");
      addAiMessage("¡Excelente elección! Para armar el mejor plan, ¿por cuántos días tienes pensado viajar y cuál es tu presupuesto aproximado?", ["Fin de semana, económico", "Una semana, medio", "10 días, sin límite"]);
      return;
    }

    if (planStage === "asking-days-budget") {
      setDurationBudget(userText);
      setPlanStage("asking-activities");
      addAiMessage("Entendido. Ahora cuéntame qué tipo de actividades te gustaría hacer allí. Por ejemplo: gastronomía, museos, vida nocturna, senderismo, compras o relax.", ["Gastronomía y cultura", "Aventura y naturaleza", "Relax y compras", "De todo un poco"]);
      return;
    }

    if (planStage === "asking-activities") {
      const plan = await generateTravelPlan({
        destination: selectedDestination || "el destino elegido",
        durationBudget,
        activityPreferences: userText,
      });

      setTravelPlan(plan);
      setPlanStage("recommending-activities");
      addAiMessage("Basado en lo que me contaste, Gemini recomienda estas actividades principales. También preparé hoteles, restaurantes e itinerario para el siguiente paso.", ["Ver plan completo", "Ajustar preferencias"], "activity-recommendations");
      return;
    }

    if (planStage === "recommending-activities") {
      if (textLower.includes("ajustar")) {
        setPlanStage("asking-activities");
        addAiMessage("Claro. ¿Qué quieres cambiar del estilo de actividades, hoteles o restaurantes?", ["Más económico", "Más aventura", "Más gastronomía", "Más lujo"]);
        return;
      }

      setPlanStage("finished");
      addAiMessage("¡Listo! Aquí tienes un resumen optimizado por Gemini con lugares de interés, actividades, hoteles, restaurantes y una ruta diaria sugerida.", undefined, "itinerary-summary");
      return;
    }

    addAiMessage("Puedo ajustar el plan si quieres cambiar destino, presupuesto, hoteles, restaurantes o actividades. ¿Qué te gustaría modificar?");
  };

  const addAiMessage = (text: string, quickReplies?: string[], widget?: MessageNode["widget"]) => {
    setMessages(prev => [...prev, { id: createId(), sender: "ai", text, quickReplies, widget }]);
  };

  const getGeminiErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);

    if (message === "Gemini API key is not configured") {
      return "No encuentro la clave de Gemini. Revisa que `GEMINI_API_KEY` esté configurada en Vercel o en `vercel dev`.";
    }

    if (message.includes("429") || message.toLowerCase().includes("quota")) {
      return "Gemini alcanzó el límite de cuota o rate limit de tu API key. Espera un momento o revisa el plan/cuotas en Google AI Studio.";
    }

    if (message.includes("503") || message.toLowerCase().includes("high demand") || message.toLowerCase().includes("unavailable")) {
      return "Gemini está con alta demanda temporal. Intenta de nuevo en unos minutos; el planificador ya usa un modelo estable y fallback sin búsqueda.";
    }

    if (message.includes("400") || message.toLowerCase().includes("invalid_argument")) {
      return "Gemini rechazó la solicitud por formato. Intenta de nuevo con preferencias más simples o reinicia el servidor para cargar la última configuración.";
    }

    return "Gemini no pudo generar recomendaciones en este momento. Intenta de nuevo con más detalles o cambia las preferencias.";
  };

  const getActivityIcon = (category: string) => {
    const normalized = category.toLowerCase();

    if (normalized.includes("gastr") || normalized.includes("comida")) return Coffee;
    if (normalized.includes("restaurante")) return Utensils;
    if (normalized.includes("avent") || normalized.includes("natur")) return Navigation;
    if (normalized.includes("hotel") || normalized.includes("aloj")) return Hotel;

    return MapPin;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden rounded-[2rem]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 z-10 shrink-0 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">Isiplan AI + Gemini</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 p-0.5 shadow-md">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 z-10 hide-scrollbar-mobile custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div className={`flex items-end gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mb-1 shadow-md shadow-blue-600/20">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className={`px-5 py-4 rounded-3xl shadow-sm text-[15px] leading-relaxed relative whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white rounded-br-sm"
                      : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>

                {msg.widget === "loader" && (
                  <div className="ml-11 mt-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm w-full max-w-sm flex flex-col items-center justify-center gap-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-teal-500 animate-pulse" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 animate-pulse">Buscando las mejores opciones...</p>
                  </div>
                )}

                {msg.widget === "destination-cards" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="ml-11 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl"
                  >
                    {destinationOptions.map((dest, i) => (
                      <button
                        key={`${dest.name}-${dest.country}`}
                        className="text-left bg-white border border-slate-100 rounded-[1.5rem] p-3 shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
                        onClick={() => handleSend(`Quiero ir a ${dest.name}, ${dest.country}`)}
                        disabled={isTyping}
                      >
                        <div className="w-full h-32 rounded-2xl overflow-hidden mb-3 relative">
                          <ImageWithFallback src={FALLBACK_DESTINATION_IMAGES[i % FALLBACK_DESTINATION_IMAGES.length]} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                          <h4 className="absolute bottom-3 left-3 text-white font-black text-lg">{dest.name}</h4>
                        </div>
                        <p className="text-sm font-bold text-slate-700 px-1">{dest.country}</p>
                        <p className="text-sm font-semibold text-slate-500 px-1 mt-1">{dest.summary}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3 px-1">
                          {[dest.bestFor, ...dest.highlights.slice(0, 2)].map(tag => (
                            <span key={tag} className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between px-1">
                          <span className="text-xs font-bold text-blue-600">Elegir destino</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {msg.widget === "activity-recommendations" && travelPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="ml-11 mt-4 space-y-3 w-full max-w-2xl"
                  >
                    {travelPlan.activities.slice(0, 5).map((activity) => {
                      const ActivityIcon = getActivityIcon(activity.category);

                      return (
                        <div key={activity.title} className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-50">
                            <ActivityIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800">{activity.title}</p>
                            <p className="text-xs font-semibold text-slate-500">{activity.category} • {activity.duration}</p>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{activity.description}</p>
                          </div>
                          <div className="text-right px-2 shrink-0">
                            <span className="text-sm font-black text-slate-700">{activity.estimatedCost}</span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {msg.widget === "itinerary-summary" && travelPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="ml-11 mt-4 w-full max-w-2xl bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 space-y-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="font-black text-2xl text-slate-800 tracking-tight">{travelPlan.tripTitle}</h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4" /> {travelPlan.destination} • {travelPlan.duration}
                        </p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Presupuesto est.</p>
                        <p className="text-xl font-black text-emerald-600">{travelPlan.estimatedTotal}</p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl p-4">{travelPlan.overview}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <section className="space-y-3">
                        <h4 className="font-black text-slate-800 flex items-center gap-2"><Hotel className="w-5 h-5 text-amber-600" /> Hoteles</h4>
                        {travelPlan.hotels.slice(0, 3).map(hotel => (
                          <div key={hotel.name} className="flex gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                              <ImageWithFallback src={HOTEL_IMAGE} alt={hotel.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 text-sm">{hotel.name}</p>
                              <p className="text-xs font-semibold text-slate-500">{hotel.area} • {hotel.priceRange}</p>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{hotel.reason}</p>
                            </div>
                          </div>
                        ))}
                      </section>

                      <section className="space-y-3">
                        <h4 className="font-black text-slate-800 flex items-center gap-2"><Utensils className="w-5 h-5 text-rose-600" /> Restaurantes</h4>
                        {travelPlan.restaurants.slice(0, 3).map(restaurant => (
                          <div key={restaurant.name} className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                            <p className="font-bold text-slate-800 text-sm">{restaurant.name}</p>
                            <p className="text-xs font-semibold text-slate-500">{restaurant.cuisine} • {restaurant.priceRange}</p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{restaurant.reason}</p>
                          </div>
                        ))}
                      </section>
                    </div>

                    <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-6 before:w-px before:bg-slate-100">
                      {travelPlan.dailyPlan.slice(0, 4).map(day => (
                        <div key={day.day} className="flex items-start gap-4 relative">
                          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center z-10 shadow-sm border border-white shrink-0">
                            <Plane className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                            <p className="font-bold text-slate-800 text-sm">Día {day.day}: {day.title}</p>
                            <div className="mt-3 space-y-2">
                              {day.items.slice(0, 3).map(item => (
                                <div key={`${day.day}-${item.time}-${item.title}`} className="flex gap-2 text-xs text-slate-600">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                  <span><strong>{item.time}</strong> {item.title}: {item.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-3">
                      <button onClick={() => navigate('/itinerary', { state: { aiPlan: travelPlan } })} className="flex-1 bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-blue-600 transition-colors">
                        Ver Itinerario Completo
                      </button>
                      <button onClick={() => setPlanStage("asking-activities")} className="px-6 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors">
                        Editar preferencias
                      </button>
                    </div>
                  </motion.div>
                )}

                {msg.quickReplies && (
                  <div className="ml-11 mt-3 flex flex-wrap gap-2">
                    {msg.quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleSend(reply)}
                        disabled={isTyping}
                        className="bg-white border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-xl text-sm hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-3 ml-1">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mb-1 shadow-md shadow-blue-600/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-100 px-5 py-4 rounded-3xl rounded-bl-sm shadow-sm flex gap-1.5 items-center h-[52px]">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 z-10 shrink-0">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <Wallet className="absolute left-5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe destino, gustos, presupuesto o ajustes..."
            disabled={isTyping}
            className="w-full bg-white border border-slate-200 rounded-[2rem] pl-12 pr-16 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="text-center text-xs font-semibold text-slate-400 mt-3">
          Gemini puede cometer errores. Verifica horarios, precios, disponibilidad y requisitos de viaje.
        </p>
      </div>
    </div>
  );
}
