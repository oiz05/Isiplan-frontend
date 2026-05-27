import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useLocation } from "react-router"
import { CalendarDays, MapPin, Clock, Coffee, Camera, Utensils, Info, Plus, Plane, Train, Bus, Car, Ticket, ArrowRight, Briefcase, ChevronRight } from "lucide-react"

const TRAVEL_PLANS = [
  {
    id: 1,
    title: "Escapada a París",
    destination: "París, Francia",
    dates: "12 Oct - 18 Oct",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Verano en Tokio",
    destination: "Tokio, Japón",
    dates: "05 Jul - 20 Jul",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    status: "planning"
  }
]

const ITINERARY_DATA = [
  {
    day: 1,
    date: "12 Oct",
    title: "Llegada y Torre Eiffel",
    events: [
      { id: 1, time: "10:00 AM", type: "transport", title: "Llegada a CDG", desc: "Vuelo AF1234", icon: Clock },
      { id: 2, time: "01:00 PM", type: "food", title: "Almuerzo en Le Café", desc: "Comida típica parisina", icon: Coffee },
      { id: 3, time: "04:00 PM", type: "activity", title: "Torre Eiffel", desc: "Entradas reservadas (Acceso prioritario)", icon: Camera },
    ]
  },
  {
    day: 2,
    date: "13 Oct",
    title: "Arte y Cultura",
    events: [
      { id: 4, time: "09:00 AM", type: "activity", title: "Museo del Louvre", desc: "Tour guiado de 3 horas", icon: Camera },
      { id: 5, time: "01:30 PM", type: "food", title: "Almuerzo cerca del Louvre", desc: "Reserva pendiente", icon: Utensils },
      { id: 6, time: "04:00 PM", type: "activity", title: "Jardines de las Tullerías", desc: "Paseo libre", icon: MapPin },
    ]
  }
]

const TRANSPORT_DATA = [
  {
    id: 1,
    type: "flight",
    provider: "Air France",
    reference: "AF1234",
    departure: { city: "Madrid", time: "08:00 AM", date: "12 Oct", station: "MAD Terminal 4" },
    arrival: { city: "París", time: "10:00 AM", date: "12 Oct", station: "CDG Terminal 2F" },
    duration: "2h 00m",
    status: "Confirmado",
    seat: "12A",
    icon: Plane
  },
  {
    id: 2,
    type: "transfer",
    provider: "Uber",
    reference: "Reserva automática",
    departure: { city: "Aeropuerto CDG", time: "10:45 AM", date: "12 Oct", station: "Punto de encuentro T2" },
    arrival: { city: "Hotel Le Marais", time: "11:30 AM", date: "12 Oct", station: "Centro de París" },
    duration: "45m",
    status: "Pendiente",
    seat: "Premium",
    icon: Car
  },
  {
    id: 3,
    type: "train",
    provider: "Eurostar",
    reference: "ES9012",
    departure: { city: "París", time: "09:00 AM", date: "15 Oct", station: "Gare du Nord" },
    arrival: { city: "Londres", time: "10:30 AM", date: "15 Oct", station: "St Pancras" },
    duration: "2h 30m",
    status: "Confirmado",
    seat: "Coche 4, 22A",
    icon: Train
  }
]

export function Itinerary() {
  const location = useLocation()
  
  // Set initial view and plan based on location state, if available
  const initialPlanId = location.state?.planId || null
  const [activeView, setActiveView] = useState<"plans" | "details">(initialPlanId ? "details" : "plans")
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(initialPlanId)
  
  const [activeTab, setActiveTab] = useState<"timeline" | "transport">("timeline")
  const [selectedDay, setSelectedDay] = useState(1)

  const handleSelectPlan = (id: number) => {
    setSelectedPlanId(id)
    setActiveView("details")
  }

  const selectedPlan = TRAVEL_PLANS.find(p => p.id === selectedPlanId)

  if (activeView === "plans") {
    return (
      <div className="p-6 md:p-10 w-full max-w-5xl mx-auto space-y-8 pb-32 md:pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-blue-600" />
              Mis Viajes
            </h1>
            <p className="text-slate-500 mt-2">Gestiona todos tus planes de aventura</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-semibold shadow-md">
            <Plus className="w-4 h-4" />
            Crear nuevo viaje
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRAVEL_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSelectPlan(plan.id)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group flex flex-col"
            >
              <div className="h-48 relative overflow-hidden">
                <img src={plan.image} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                  plan.status === 'upcoming' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {plan.status === 'upcoming' ? 'Próximo' : 'Planificando'}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{plan.title}</h3>
                  <p className="text-sm font-medium opacity-90 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {plan.destination}
                  </p>
                </div>
              </div>
              <div className="p-5 flex justify-between items-center bg-white flex-1">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                  <CalendarDays className="w-4 h-4" />
                  {plan.dates}
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 w-full max-w-5xl mx-auto space-y-8 pb-32 md:pb-10">
      
      <button 
        onClick={() => setActiveView("plans")}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-4"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Volver a mis viajes
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-blue-600" />
            {selectedPlan?.title || "Itinerario"}
          </h1>
          <p className="text-slate-500 mt-2">{selectedPlan?.destination} • {selectedPlan?.dates}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-semibold shadow-md">
          <Plus className="w-4 h-4" />
          Añadir {activeTab === "timeline" ? "evento" : "transporte"}
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-fit backdrop-blur-sm">
        <button 
          onClick={() => setActiveTab("timeline")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "timeline" 
              ? "bg-white text-slate-800 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Cronograma
        </button>
        <button 
          onClick={() => setActiveTab("transport")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "transport" 
              ? "bg-white text-blue-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Ticket className="w-4 h-4" />
          Transporte
        </button>
      </div>

      {activeTab === "timeline" ? (
        <>
          {/* Days Tabs */}
          <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar hide-scrollbar-mobile">
        {ITINERARY_DATA.map((day) => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(day.day)}
            className={`flex flex-col items-center min-w-[80px] p-3 rounded-2xl transition-all ${
              selectedDay === day.day 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="text-xs font-bold uppercase opacity-80">Día {day.day}</span>
            <span className="text-lg font-bold">{day.date}</span>
          </button>
        ))}
        <button className="flex flex-col items-center justify-center min-w-[80px] p-3 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors bg-white/50">
          <Plus className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold">Añadir</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="relative mt-8">
        <AnimatePresence mode="wait">
          {ITINERARY_DATA.map((day) => day.day === selectedDay && (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 relative"
            >
              {/* Vertical Timeline Line */}
              <div className="absolute left-[27px] top-4 bottom-4 w-px bg-slate-200" />

              {day.events.map((event, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={event.id} 
                  className="flex gap-6 relative group"
                >
                  <div className="w-14 shrink-0 text-right text-sm font-bold text-slate-500 pt-3">
                    {event.time.split(" ")[0]}
                    <span className="text-[10px] block text-slate-400">{event.time.split(" ")[1]}</span>
                  </div>
                  
                  <div className="relative flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group-hover:border-blue-100">
                    {/* Timeline Node */}
                    <div className={`absolute -left-[35px] top-4 w-5 h-5 rounded-full border-4 border-slate-50 shadow-sm z-10 flex items-center justify-center
                      ${event.type === 'food' ? 'bg-orange-400' : event.type === 'activity' ? 'bg-blue-500' : 'bg-teal-400'}
                    `} />
                    
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <event.icon className={`w-4 h-4 ${event.type === 'food' ? 'text-orange-500' : event.type === 'activity' ? 'text-blue-500' : 'text-teal-500'}`} />
                          <h4 className="font-bold text-slate-800">{event.title}</h4>
                        </div>
                        <p className="text-sm text-slate-500">{event.desc}</p>
                      </div>
                      
                      <button className="text-slate-300 hover:text-slate-600 transition-colors">
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRANSPORT_DATA.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group"
              >
                {/* Decorative bg element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />

                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{item.provider}</h3>
                      <p className="text-xs font-semibold text-slate-500">{item.reference}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                    item.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">{item.departure.time.split(" ")[0]}</p>
                    <p className="text-sm font-bold text-slate-400 mb-1">{item.departure.city}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[80px]" title={item.departure.station}>{item.departure.station}</p>
                  </div>

                  <div className="flex flex-col items-center px-4 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 mb-2">{item.duration}</p>
                    <div className="w-full relative flex items-center justify-center">
                      <div className="h-px w-full bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
                      <div className="bg-white relative z-10 px-2 text-slate-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">{item.departure.date}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">{item.arrival.time.split(" ")[0]}</p>
                    <p className="text-sm font-bold text-slate-400 mb-1">{item.arrival.city}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[80px]" title={item.arrival.station}>{item.arrival.station}</p>
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-slate-100 border-dashed flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Asiento</p>
                    <p className="text-sm font-bold text-slate-800">{item.seat}</p>
                  </div>
                  <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                    Ver billete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  )
}