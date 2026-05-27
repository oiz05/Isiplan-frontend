import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Bike, Car, Bus, Train, Footprints, Ship, X, ArrowDownUp, Clock, DollarSign, ArrowRight, Camera, Coffee, Filter, LocateFixed, Plus, CalendarPlus, Check, ChevronDown } from "lucide-react"

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});


const TRANSPORT_OPTIONS = [
  {
    category: "Recomendado",
    items: [
      { id: 't1', mode: 'Metro', provider: 'Línea 1 + Línea 6', icon: Train, time: '15 min', price: '$2.10', eco: true },
      { id: 't2', mode: 'Bicicleta', provider: 'Vélib', icon: Bike, time: '12 min', price: '$1.00', eco: true }
    ]
  },
  {
    category: "Privado",
    items: [
      { id: 't3', mode: 'Auto', provider: 'UberX', icon: Car, time: '20 min', price: '$15.50', eco: false },
      { id: 't4', mode: 'Taxi', provider: 'G7', icon: Car, time: '22 min', price: '$18.00', eco: false }
    ]
  },
  {
    category: "Superficie",
    items: [
      { id: 't5', mode: 'Bus', provider: 'Línea 72', icon: Bus, time: '25 min', price: '$2.10', eco: true },
      { id: 't6', mode: 'Caminando', provider: 'Ruta panorámica', icon: Footprints, time: '45 min', price: 'Gratis', eco: true },
      { id: 't7', mode: 'Barco', provider: 'Batobus', icon: Ship, time: '30 min', price: '$5.00', eco: false }
    ]
  }
]

const MOCK_PLANS = ["Escapada a París", "Verano en Tokio"];

const DESTINATION_INFO = {
  louvre: {
    desc: 'El museo de arte más grande del mundo y un monumento histórico en París. Famoso por albergar la Mona Lisa y la Venus de Milo.',
    activities: ['Tour VIP sin filas', 'Fotografía de arquitectura', 'Audioguía completa'],
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600'
  },
  eiffel: {
    desc: 'Símbolo icónico de París y Francia, esta torre de hierro forjado ofrece vistas panorámicas incomparables.',
    activities: ['Cena en restaurante Jules Verne', 'Ascenso al 3er piso en ascensor', 'Picnic en los Campos de Marte'],
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=600'
  },
  default: {
    desc: 'Un destino increíble lleno de cultura, gastronomía y experiencias únicas. Perfecto para tu próximo viaje.',
    activities: ['Tour guiado por la zona', 'Degustación local', 'Recorrido histórico'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e90761613e1?auto=format&fit=crop&q=80&w=600'
  }
}

export function MapView() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)
  const [addedPlan, setAddedPlan] = useState<string | null>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [48.8566, 2.3522],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer('https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=96d3fdfdd8e84bd6b3959f52012ac15e', {
        maxZoom: 20,
        attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>',
      }).addTo(map)

      mapInstanceRef.current = map
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => mapInstanceRef.current?.invalidateSize())
  }, [isSidebarOpen])

  const swapLocations = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const handleSearchRoute = () => {
    if (origin.trim() && destination.trim()) {
      setIsSidebarOpen(true)
      setShowPlanDropdown(false)
      setAddedPlan(null)
    }
  }

  const getDestInfo = () => {
    const dest = destination.toLowerCase()
    if (dest.includes('louvre')) return DESTINATION_INFO.louvre
    if (dest.includes('eiffel')) return DESTINATION_INFO.eiffel
    return DESTINATION_INFO.default
  }
  
  const destInfo = getDestInfo()

  const handleAddToPlan = (planName: string) => {
    setAddedPlan(planName)
    setShowPlanDropdown(false)
    setTimeout(() => setAddedPlan(null), 3000) // Reset after 3s
  }

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-4 overflow-hidden">
      {/* Map Section */}
      <div className="relative flex-1 rounded-3xl overflow-hidden bg-slate-200 shadow-sm">
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Floating Header: Origin and Destination Selection */}
      <div className="absolute top-6 left-6 right-6 flex flex-col md:flex-row gap-4 z-20 pointer-events-none">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full md:w-[420px] pointer-events-auto bg-white/95 backdrop-blur-xl rounded-[2rem] p-4 shadow-2xl border border-white/50"
        >
          <div className="flex items-center gap-3 relative">
            {/* Visual connected path line */}
            <div className="flex flex-col items-center justify-center gap-1 absolute left-4 top-5 bottom-5 w-4 z-10">
               <div className="w-2.5 h-2.5 rounded-full border-[3px] border-slate-300 bg-white"></div>
               <div className="flex-1 w-px bg-transparent border-dashed border-l-2 border-slate-300 my-1"></div>
               <MapPin className="w-4 h-4 text-blue-600" />
            </div>

            <div className="w-full pl-12 pr-10 space-y-2 relative">
               <div className="relative">
                  <input 
                     type="text"
                     value={origin}
                     onChange={(e) => setOrigin(e.target.value)}
                     placeholder="Origen (Ej. Louvre)"
                     className="w-full bg-slate-100/70 px-4 py-3 pr-10 rounded-2xl border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-semibold"
                  />
                  <button 
                     onClick={() => setOrigin("Mi ubicación actual")}
                     title="Usar mi ubicación actual"
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500/70 hover:text-blue-600 transition-colors p-1"
                  >
                     <LocateFixed className="w-4 h-4" />
                  </button>
               </div>
               <input 
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destino (Ej. Torre Eiffel)"
                  className="w-full bg-slate-100/70 px-4 py-3 rounded-2xl border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-semibold"
               />
               
               {/* Swap Button */}
               <button 
                  onClick={swapLocations} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors z-10 hover:shadow-md"
               >
                  <ArrowDownUp className="w-4 h-4" />
               </button>
            </div>
          </div>
          
          <AnimatePresence>
            {origin.trim() && destination.trim() && (
               <motion.button
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  onClick={handleSearchRoute}
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
               >
                  <Navigation className="w-4 h-4" />
                  Calcular Ruta
               </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 pointer-events-auto h-fit"
        >
          <button className="bg-white/95 backdrop-blur-md px-4 py-3.5 rounded-2xl shadow-xl font-bold text-slate-700 flex items-center gap-2 hover:bg-white transition-colors text-sm border border-white/50">
            <Coffee className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Cafés</span>
          </button>
          <button className="bg-white/95 backdrop-blur-md px-4 py-3.5 rounded-2xl shadow-xl font-bold text-slate-700 flex items-center gap-2 hover:bg-white transition-colors text-sm border border-white/50">
            <Camera className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">Turismo</span>
          </button>
        </motion.div>
      </div>

      {/* Map Markers */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.4 }}
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
        onClick={() => { setDestination("Museo del Louvre"); if (origin) setIsSidebarOpen(true); }}
      >
        <div className="relative">
          <div className="absolute -inset-2 bg-blue-500/20 rounded-full animate-ping" />
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-600/40 relative z-10 border-2 border-white hover:scale-110 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100">
            <p className="font-bold text-slate-800">Museo del Louvre</p>
            <p className="text-xs font-semibold text-slate-500">Haz clic para seleccionar</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white" />
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
        className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
        onClick={() => { setOrigin("Torre Eiffel"); if (destination) setIsSidebarOpen(true); }}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-teal-500/40 relative z-10 border-2 border-white hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100">
            <p className="font-bold text-slate-800">Torre Eiffel</p>
            <p className="text-xs font-semibold text-slate-500">Haz clic para seleccionar</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white" />
          </div>
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <button className="absolute bottom-6 right-6 w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-600 transition-colors pointer-events-auto z-10">
        <Navigation className="w-6 h-6" />
      </button>
      </div>

      {/* Right Sidebar Section */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, x: "100%", width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: "100%", width: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:relative inset-y-0 right-0 lg:inset-auto w-full max-w-md lg:w-[420px] bg-white lg:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border-l lg:border border-slate-100 shrink-0"
            >
              {/* Header Image */}
              <div className="h-48 relative shrink-0">
                 <img src={destInfo.image} alt={destination} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                 <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors text-white"
                 >
                    <X className="w-5 h-5" />
                 </button>
                 <div className="absolute bottom-4 left-6 right-6">
                    <h2 className="text-2xl font-black text-white">{destination}</h2>
                    {origin && (
                      <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-white/80">
                         <span>Desde {origin}</span>
                      </div>
                    )}
                 </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50/50">
                 
                 {/* Desc */}
                 <div>
                    <p className="text-slate-600 text-sm leading-relaxed">{destInfo.desc}</p>
                 </div>

                 {/* Add to Itinerary Button */}
                 <div className="relative">
                    <button 
                       onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                       className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-sm ${addedPlan ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/20'}`}
                    >
                       {addedPlan ? (
                         <><Check className="w-5 h-5" /> ¡Añadido a {addedPlan}!</>
                       ) : (
                         <><Plus className="w-5 h-5" /> Agregar al itinerario</>
                       )}
                    </button>

                    <AnimatePresence>
                       {showPlanDropdown && !addedPlan && (
                         <>
                           <div className="fixed inset-0 z-10" onClick={() => setShowPlanDropdown(false)} />
                           <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-20"
                           >
                              <div className="p-2">
                                <p className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Tus viajes</p>
                                {MOCK_PLANS.map(plan => (
                                  <button 
                                    key={plan}
                                    onClick={() => handleAddToPlan(plan)}
                                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700 flex items-center justify-between group"
                                  >
                                    {plan}
                                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                                  </button>
                                ))}
                                <div className="h-px bg-slate-100 my-2" />
                                <button 
                                  onClick={() => handleAddToPlan("Nuevo viaje")}
                                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm font-bold text-blue-600 flex items-center gap-2"
                                >
                                  <CalendarPlus className="w-4 h-4" />
                                  Crear nuevo itinerario
                                </button>
                              </div>
                           </motion.div>
                         </>
                       )}
                    </AnimatePresence>
                 </div>

                 {/* Activities */}
                 <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       Actividades destacadas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {destInfo.activities.map((act, i) => (
                         <span key={i} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 shadow-sm">
                           {act}
                         </span>
                       ))}
                    </div>
                 </div>

                 {/* Transports (Only show if Origin is set) */}
                 {origin && (
                   <div className="space-y-6">
                      {TRANSPORT_OPTIONS.map((cat, idx) => (
                         <div key={idx}>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                               {cat.category}
                               <div className="flex-1 h-px bg-slate-200"></div>
                            </h3>
                            <div className="space-y-3">
                               {cat.items.map(item => (
                                  <div 
                                     key={item.id} 
                                     className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-200 group relative overflow-hidden"
                                  >
                                     <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                     <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10 border border-slate-100 group-hover:border-blue-600 group-hover:scale-105">
                                        <item.icon className="w-5 h-5" />
                                     </div>
                                     <div className="flex-1 min-w-0 relative z-10">
                                        <div className="flex items-center gap-2 mb-1">
                                           <h4 className="font-bold text-slate-800">{item.mode}</h4>
                                           {item.eco && (
                                              <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md tracking-wider uppercase">Eco</span>
                                           )}
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 truncate">{item.provider}</p>
                                     </div>
                                     <div className="text-right shrink-0 relative z-10">
                                        <p className="font-black text-slate-800">{item.time}</p>
                                        <p className="text-xs font-bold text-slate-400 mt-0.5">{item.price}</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      ))}
                   </div>
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}