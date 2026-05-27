import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Sparkles, MapPin, Calendar, Wallet, 
  ArrowRight, ChevronLeft, Bot, Plane, Coffee, 
  Hotel, Clock, Navigation, CheckCircle2, ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type MessageNode = {
  id: string;
  sender: "ai" | "user";
  text: string;
  quickReplies?: string[];
  widget?: "destination-cards" | "itinerary-summary" | "loader" | "activity-recommendations";
};

export function AiPlanner() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessageNode[]>([
    {
      id: "1",
      sender: "ai",
      text: "¡Hola! Soy tu asistente inteligente de Isiplan. Para armar tu viaje ideal, ¿ya tienes un destino en mente o prefieres que te recomiende opciones increíbles?",
      quickReplies: ["Ya sé a dónde ir", "¡Recomiéndame destinos!"]
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [planStage, setPlanStage] = useState<"init" | "knowing-destination" | "exploring-destinations" | "showing-destination-options" | "asking-days-budget" | "asking-activities" | "recommending-activities" | "generating" | "finished">("init");

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;
    
    const userMsg: MessageNode = { id: Date.now().toString(), sender: "user", text };
    setMessages(prev => [...prev.map(m => ({...m, quickReplies: undefined})), userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      processNextStep(text);
    }, 1500);
  };

  const processNextStep = (userText: string) => {
    const textLower = userText.toLowerCase();
    
    if (planStage === "init" && textLower.includes("ya sé")) {
      setPlanStage("knowing-destination");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "¡Excelente! ¿A qué parte del mundo viajamos?",
      }]);
    } 
    else if (planStage === "init" && textLower.includes("recomi")) {
      setPlanStage("exploring-destinations");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "¿Qué tipo de ambiente buscas? ¿Playa, montaña, cultura de ciudad, o aventura exótica?",
        quickReplies: ["Playa y relax", "Cultura y ciudad", "Naturaleza salvaje"]
      }]);
    }
    else if (planStage === "knowing-destination") {
      setPlanStage("asking-days-budget");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "¡Me encanta ese destino! ¿Por cuántos días planeas ir y qué presupuesto tienes en mente?",
        quickReplies: ["3 días, económico", "7 días, medio", "14 días, lujo"]
      }]);
    }
    else if (planStage === "exploring-destinations") {
      setPlanStage("showing-destination-options");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "Analizando opciones basadas en tus gustos...",
        widget: "loader"
      }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev.filter(m => m.widget !== "loader"), {
          id: Date.now().toString(),
          sender: "ai",
          text: "Estas son mis mejores recomendaciones para ti. ¡Elige la que más te inspire y armaremos el itinerario!",
          widget: "destination-cards"
        }]);
      }, 2500);
    }
    else if (planStage === "showing-destination-options") {
      setPlanStage("asking-days-budget");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "¡Excelente elección! Para armar el mejor plan, ¿por cuántos días tienes pensado viajar y cuál es tu presupuesto aproximado?",
        quickReplies: ["Fin de semana, económico", "Una semana, medio", "10 días, sin límite"]
      }]);
    }
    else if (planStage === "asking-days-budget") {
      setPlanStage("asking-activities");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "Entendido. Ahora, cuéntame ¿qué tipo de actividades te gustaría hacer allí? (Ej: Gastronomía, museos, vida nocturna, senderismo...)",
        quickReplies: ["Gastronomía y cultura", "Aventura y naturaleza", "Relax y compras", "De todo un poco"]
      }]);
    }
    else if (planStage === "asking-activities") {
      setPlanStage("recommending-activities");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "Buscando las mejores actividades para tu perfil...",
        widget: "loader"
      }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev.filter(m => m.widget !== "loader"), {
          id: Date.now().toString(),
          sender: "ai",
          text: "Basado en lo que me cuentas, te recomiendo estas experiencias imprescindibles. ¿Te gustaría incluirlas en el itinerario final?",
          widget: "activity-recommendations",
          quickReplies: ["¡Sí, inclúyelas todas!", "Solo algunas", "Prefiero otras opciones"]
        }]);
      }, 3000);
    }
    else if (planStage === "recommending-activities") {
      setPlanStage("generating");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "¡Perfecto! Estoy procesando toda la información para armar el mejor itinerario posible para ti...",
        widget: "loader"
      }]);
      
      setTimeout(() => {
        setPlanStage("finished");
        setMessages(prev => [...prev.filter(m => m.widget !== "loader"), {
          id: Date.now().toString(),
          sender: "ai",
          text: "¡Listo! Aquí tienes un resumen de tu viaje optimizado. He incluido sugerencias de transporte, alojamiento y actividades diarias que se ajustan a tu perfil.",
          widget: "itinerary-summary"
        }]);
      }, 4000);
    }
    else {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "¿Hay algo específico que te gustaría ajustar del plan o alguna actividad especial que quieras agregar?"
      }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden rounded-[2rem]">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 z-10 shrink-0 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </div>
          <span className="font-bold text-slate-800 tracking-tight">Isiplan AI</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 p-0.5 shadow-md">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Chat Area */}
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
                  
                  {/* Avatar */}
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mb-1 shadow-md shadow-blue-600/20">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`px-5 py-4 rounded-3xl shadow-sm text-[15px] leading-relaxed relative ${
                    msg.sender === "user" 
                      ? "bg-slate-900 text-white rounded-br-sm" 
                      : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>

                {/* Widgets inside AI messages */}
                {msg.widget === "loader" && (
                  <div className="ml-11 mt-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm w-full max-w-sm flex flex-col items-center justify-center gap-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-teal-500 animate-pulse" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 animate-pulse">Buscando las mejores opciones...</p>
                  </div>
                )}

                {msg.widget === "itinerary-summary" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="ml-11 mt-4 w-full max-w-2xl bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-slate-200/40"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-black text-2xl text-slate-800 tracking-tight">Tu viaje a Japón</h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4" /> 7 Días • 14 - 21 Nov
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Presupuesto est.</p>
                        <p className="text-xl font-black text-emerald-600">$2,450</p>
                      </div>
                    </div>

                    {/* Compact Timeline */}
                    <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-6 before:w-px before:bg-slate-100">
                      
                      {/* Vuelo */}
                      <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center z-10 shadow-sm border border-white shrink-0">
                          <Plane className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">Vuelo Directo</p>
                            <p className="text-xs font-semibold text-slate-500">14h 30m • Llegada 08:45 AM</p>
                          </div>
                          <span className="text-sm font-bold text-slate-700">$850</span>
                        </div>
                      </div>

                      {/* Hotel */}
                      <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center z-10 shadow-sm border border-white shrink-0">
                          <Hotel className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-3 flex gap-3 items-center">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                            <ImageWithFallback src="https://images.unsplash.com/photo-1542051842920-c7c1341c2c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" alt="Hotel" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-slate-800 text-sm">Shinjuku Prince Hotel</p>
                            <p className="text-xs font-semibold text-slate-500">4 Estrellas • Centro</p>
                          </div>
                          <span className="text-sm font-bold text-slate-700">$900</span>
                        </div>
                      </div>

                      {/* Actividades */}
                      <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center z-10 shadow-sm border border-white shrink-0">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">12 Actividades + Gastronomía</p>
                            <p className="text-xs font-semibold text-slate-500">Tours, Museos, Restaurantes</p>
                          </div>
                          <span className="text-sm font-bold text-slate-700">$700</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                      <button onClick={() => navigate('/itinerary')} className="flex-1 bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-blue-600 transition-colors">
                        Ver Itinerario Completo
                      </button>
                      <button className="px-6 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors">
                        Editar
                      </button>
                    </div>
                  </motion.div>
                )}

                {msg.widget === "destination-cards" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="ml-11 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl"
                  >
                    {[
                      { name: "Kioto, Japón", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", desc: "Cultura milenaria y templos" },
                      { name: "Roma, Italia", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", desc: "Historia, arte y gastronomía" }
                    ].map((dest, i) => (
                      <div key={i} className="bg-white border border-slate-100 rounded-[1.5rem] p-3 shadow-md hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => handleSend(`Quiero ir a ${dest.name}`)}>
                        <div className="w-full h-32 rounded-2xl overflow-hidden mb-3 relative">
                          <ImageWithFallback src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                          <h4 className="absolute bottom-3 left-3 text-white font-black text-lg">{dest.name}</h4>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 px-1">{dest.desc}</p>
                        <div className="mt-3 flex items-center justify-between px-1">
                          <span className="text-xs font-bold text-blue-600">Elegir destino</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {msg.widget === "activity-recommendations" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="ml-11 mt-4 space-y-3 w-full max-w-2xl"
                  >
                    {[
                      { title: "Tour Gastronómico Local", time: "3 horas", price: "$45", icon: Coffee, color: "text-amber-600", bg: "bg-amber-50" },
                      { title: "Visita Guiada de Historia", time: "Medio día", price: "$30", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
                      { title: "Aventura al Aire Libre", time: "Día completo", price: "$85", icon: Navigation, color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((act, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${act.bg}`}>
                          <act.icon className={`w-6 h-6 ${act.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">{act.title}</p>
                          <p className="text-xs font-semibold text-slate-500">{act.time}</p>
                        </div>
                        <div className="text-right px-2">
                          <span className="text-sm font-black text-slate-700">{act.price}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Quick Replies */}
                {msg.quickReplies && (
                  <div className="ml-11 mt-3 flex flex-wrap gap-2">
                    {msg.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(reply)}
                        className="bg-white border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-xl text-sm hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
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

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 z-10 shrink-0">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe aquí tus ideas..."
            className="w-full bg-white border border-slate-200 rounded-[2rem] pl-6 pr-16 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="absolute right-2 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="text-center text-xs font-semibold text-slate-400 mt-3">
          La IA de Isiplan puede cometer errores. Verifica la información importante.
        </p>
      </div>
    </div>
  );
}
