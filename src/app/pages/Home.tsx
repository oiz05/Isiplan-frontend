import { motion } from "motion/react"
import { useState } from "react"
import { Search, MapPin, Calendar, ArrowRight, Star, Clock, LocateFixed, Loader2 } from "lucide-react"
import { useNavigate } from "react-router"
import { fetchNearbyPlaces, type NearbyPlace } from "../../services/geoapifyPlacesService"

interface DestinationCard {
  id: number | string
  name: string
  image: string
  rating: number
  price: string
  tags: string[]
  distance?: number | null
}

const DESTINATIONS: DestinationCard[] = [
  {
    id: 1,
    name: "París, Francia",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMHRyYXZlbHxlbnwxfHx8fDE3Nzk1MTQzNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    price: "$$$",
    tags: ["Cultura", "Romántico"]
  },
  {
    id: 2,
    name: "Tokio, Japón",
    image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHl8ZW58MXx8fHwxNzc5Njg2MjU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    price: "$$$$",
    tags: ["Tecnología", "Gastronomía"]
  },
  {
    id: 3,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwdHJvcGljYWx8ZW58MXx8fHwxNzc5Njg2MjU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    price: "$$",
    tags: ["Naturaleza", "Relax"]
  }
]

export function Home() {
  const navigate = useNavigate()
  const [nearbyDestinations, setNearbyDestinations] = useState<DestinationCard[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null)

  const recommendations = nearbyDestinations.length > 0 ? nearbyDestinations : DESTINATIONS

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setRecommendationsError('Tu navegador no soporta geolocalización. Te mostramos recomendaciones populares.')
      return
    }

    setIsLoadingRecommendations(true)
    setRecommendationsError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const places = await fetchNearbyPlaces({ lat: latitude, lng: longitude })

          if (places.length === 0) {
            setRecommendationsError('No encontramos lugares cercanos. Te mostramos recomendaciones populares.')
            setNearbyDestinations([])
            return
          }

          setNearbyDestinations(places.map(mapNearbyPlaceToDestination))
        } catch {
          setRecommendationsError('No pudimos cargar lugares cercanos. Te mostramos recomendaciones populares.')
          setNearbyDestinations([])
        } finally {
          setIsLoadingRecommendations(false)
        }
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? 'Activa el permiso de ubicación para ver recomendaciones cercanas.'
          : 'No pudimos obtener tu ubicación. Intenta de nuevo.'

        setRecommendationsError(message)
        setIsLoadingRecommendations(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  return (
    <div className="p-6 md:p-10 pb-32 md:pb-10 w-full max-w-7xl mx-auto space-y-12">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-slate-800"
          >
            ¿A dónde vamos, <span className="text-gradient">Ana</span>?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium"
          >
            Tu próximo viaje inteligente te espera
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full md:w-80 group"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 bg-white/80 border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all backdrop-blur-sm placeholder:text-slate-400"
            placeholder="Busca destinos, actividades..."
          />
        </motion.div>
      </div>

      {/* AI Quick Planner Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-teal-500 p-1"
      >
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <MapPin className="w-48 h-48 text-white rotate-12" />
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-white max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
              Gemini AI + Travel
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">Genera tu itinerario perfecto en segundos</h2>
            <p className="text-blue-50">Dinos qué te gusta, tu presupuesto y nosotros armamos el viaje completo con IA.</p>
          </div>
          <button 
            onClick={() => navigate('/ai-chat')}
            className="w-full md:w-auto px-6 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-lg shadow-black/10 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
          >
            Comenzar plan
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Upcoming Trip */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-500" />
          Próximo Viaje
        </h3>
        
        <div 
          onClick={() => navigate("/itinerary", { state: { planId: 1 } })}
          className="glass-card p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center cursor-pointer hover:shadow-xl hover:border-blue-100 transition-all group"
        >
          <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden relative shrink-0">
            <img src={DESTINATIONS[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Paris" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="font-bold">París</p>
              <p className="text-xs text-white/80">En 14 días</p>
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Escapada Romántica a París</h4>
                <p className="text-slate-500 text-sm">12 Oct - 18 Oct • 2 Personas</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                Planeado
              </span>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-xs text-slate-400 mb-1">Vuelo</div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  10:30 AM
                </div>
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-xs text-slate-400 mb-1">Hotel</div>
                <div className="font-semibold text-sm truncate">Le Meurice</div>
              </div>
              <button className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-xl group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-600/20 transition-all">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Destinations */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6 text-teal-500" />
              Recomendados para ti
            </h3>
            {recommendationsError && (
              <p className="text-sm text-slate-500">{recommendationsError}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleUseLocation}
              disabled={isLoadingRecommendations}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingRecommendations ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LocateFixed className="w-4 h-4" />
              )}
              {isLoadingRecommendations ? 'Buscando cerca de ti...' : nearbyDestinations.length > 0 ? 'Actualizar ubicación' : 'Usar mi ubicación'}
            </button>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Ver todos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-card group overflow-hidden cursor-pointer"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-1 text-sm font-bold shadow-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {dest.rating}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg text-slate-800">{dest.name}</h4>
                  <span className="text-slate-500 text-sm font-medium">{dest.price}</span>
                </div>
                {dest.distance != null && (
                  <div className="flex items-center gap-1 text-sm font-medium text-teal-600">
                    <LocateFixed className="w-4 h-4" />
                    A {formatDistance(dest.distance)}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {(dest.tags.length > 0 ? dest.tags : ['Cerca de ti']).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}

function mapNearbyPlaceToDestination(place: NearbyPlace): DestinationCard {
  return {
    id: place.id,
    name: place.name,
    image: place.image,
    rating: place.rating,
    price: place.price,
    tags: place.tags,
    distance: place.distance,
  }
}

function formatDistance(distance: number): string {
  if (distance < 1000) {
    return `${Math.round(distance)} m`
  }

  return `${(distance / 1000).toFixed(1)} km`
}
