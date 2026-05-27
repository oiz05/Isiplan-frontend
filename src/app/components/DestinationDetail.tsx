import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Calendar,
  Sparkles,
  Clock,
  DollarSign,
  ChevronRight,
  Utensils,
  Hotel,
  Activity,
  Flame,
  Plus,
  X,
  PlusCircle,
  FolderPlus
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const destinationData = {
  name: 'Maldivas',
  country: 'Océano Índico',
  rating: 4.9,
  reviews: 2847,
  image: 'https://images.unsplash.com/photo-1535262412227-85541e910204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  gallery: [
    'https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1541417904950-b855846fe074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1672841828459-bc913fdcd995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ],
  description:
    'Las Maldivas son un paraíso tropical con playas de arena blanca, aguas cristalinas color turquesa y una vida marina espectacular. Perfecto para luna de miel, buceo y relajación total.',
  highlights: [
    'Buceo en arrecifes de coral',
    'Villas sobre el agua',
    'Cenas románticas en la playa',
    'Snorkel con mantarrayas',
  ],
  bestTime: 'Noviembre - Abril',
  duration: '7 días',
  priceFrom: 1200,
  activities: [
    {
      id: 1,
      name: 'Buceo en Arrecife de Coral',
      icon: '🤿',
      price: 120,
      duration: '3 horas',
      popular: true,
      rating: 4.9
    },
    {
      id: 2,
      name: 'Snorkel con Mantarrayas',
      icon: '🐠',
      price: 85,
      duration: '2.5 horas',
      popular: true,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Tour en Barco al Atardecer',
      icon: '⛵',
      price: 95,
      duration: '4 horas',
      popular: false,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Clase de Surf para Principiantes',
      icon: '🏄',
      price: 60,
      duration: '2 horas',
      popular: false,
      rating: 4.5
    },
  ],
  restaurants: [
    {
      id: 1,
      name: 'Ithaa Undersea Restaurant',
      cuisine: 'Fusión Contemporánea',
      priceRange: '$$$$',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      popular: true
    },
    {
      id: 2,
      name: 'Sea Fire Salt',
      cuisine: 'Parrilla y Mariscos',
      priceRange: '$$$',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      popular: false
    },
    {
      id: 3,
      name: 'Muraka',
      cuisine: 'Cocina Local Maldiva',
      priceRange: '$$',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1590846406792-0adc7f928a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      popular: true
    }
  ],
  hotels: [
    {
      id: 1,
      name: 'Soneva Jani',
      type: 'Resort 5 Estrellas',
      price: 1800,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      popular: true
    },
    {
      id: 2,
      name: 'Gili Lankanfushi',
      type: 'Villas sobre el agua',
      price: 1500,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1580541743555-7d433b5cdafb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      popular: true
    },
    {
      id: 3,
      name: 'Kurumba Maldives',
      type: 'Resort Boutique',
      price: 850,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      popular: false
    }
  ]
};

export function DestinationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'activities' | 'restaurants' | 'hotels'>('activities');
  
  const [selectedItemDetail, setSelectedItemDetail] = useState<any>(null);
  const [itemToAdd, setItemToAdd] = useState<any>(null);

  // Sorted activities: popular first
  const sortedActivities = [...destinationData.activities].sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1));
  const sortedRestaurants = [...destinationData.restaurants].sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1));
  const sortedHotels = [...destinationData.hotels].sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1));

  return (
    <div className="h-screen flex flex-col bg-slate-50 md:flex-row md:overflow-hidden w-full relative">
      {/* Mobile Header / Desktop Image Column */}
      <div className="relative h-80 md:h-full md:w-5/12 lg:w-4/12 shrink-0">
        <ImageWithFallback
          src={destinationData.image}
          alt={destinationData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-slate-900/30" />

        {/* Top controls */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
              />
            </button>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex items-center gap-2 text-white/90 text-sm mb-2 font-medium">
            <MapPin className="w-4 h-4" />
            <span>{destinationData.country}</span>
          </div>
          <h1 className="text-white text-4xl font-black mb-4 tracking-tight">
            {destinationData.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30">
              <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
              <span className="text-white font-bold">{destinationData.rating}</span>
              <span className="text-white/80 text-xs">({destinationData.reviews})</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30">
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">{destinationData.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Column */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-6 relative bg-slate-50 md:rounded-l-3xl md:-ml-6 z-10 custom-scrollbar shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
        
        <div className="max-w-3xl mx-auto">
          {/* Gallery */}
          <div className="p-6">
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar-mobile">
              {destinationData.gallery.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-sm"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Insights & Description */}
          <div className="px-6 pb-6 space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-5 border border-blue-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -z-0 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center shadow-inner">
                    <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">Isiplan IA</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Basado en tus preferencias de playas y relax, este destino tiene un{' '}
                  <span className="font-bold text-blue-600">95% de compatibilidad</span> contigo. La mejor época para tu viaje es: <span className="font-bold">{destinationData.bestTime}</span>.
                </p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed font-medium">
              {destinationData.description}
            </p>
          </div>

          {/* Interactive Sections (Activities, Restaurants, Hotels) */}
          <div className="px-6 pb-6">
            {/* Tabs */}
            <div className="flex bg-slate-200/60 p-1.5 rounded-2xl w-full mb-6 backdrop-blur-sm overflow-x-auto hide-scrollbar-mobile">
              <button 
                onClick={() => setActiveTab("activities")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === "activities" 
                    ? "bg-white text-slate-800 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Activity className="w-4 h-4" />
                Actividades
              </button>
              <button 
                onClick={() => setActiveTab("restaurants")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === "restaurants" 
                    ? "bg-white text-orange-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Utensils className="w-4 h-4" />
                Restaurantes
              </button>
              <button 
                onClick={() => setActiveTab("hotels")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === "hotels" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Hotel className="w-4 h-4" />
                Hoteles
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'activities' && (
                <motion.div
                  key="activities"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-slate-800 text-lg">Qué hacer en {destinationData.name}</h2>
                  </div>
                  {sortedActivities.map((activity, idx) => (
                    <div 
                      key={activity.id} 
                      onClick={() => setSelectedItemDetail({ ...activity, category: 'Actividad' })}
                      className="bg-white border border-slate-100 rounded-3xl p-4 hover:shadow-md transition-shadow flex items-center gap-4 relative overflow-hidden group cursor-pointer"
                    >
                      {activity.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1 shadow-sm">
                          <Flame className="w-3 h-3" fill="currentColor" /> Popular
                        </div>
                      )}
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 mb-1 truncate pr-16">{activity.name}</h3>
                        <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{activity.duration}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-700">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{activity.price} USD</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3" fill="currentColor" />
                            <span>{activity.rating}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setItemToAdd({ ...activity, category: 'Actividad' }); }}
                        className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shrink-0 shadow-sm"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'restaurants' && (
                <motion.div
                  key="restaurants"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-slate-800 text-lg">Dónde comer</h2>
                  </div>
                  {sortedRestaurants.map((restaurant, idx) => (
                    <div 
                      key={restaurant.id} 
                      onClick={() => setSelectedItemDetail({ ...restaurant, category: 'Restaurante' })}
                      className="bg-white border border-slate-100 rounded-3xl p-3 hover:shadow-md transition-shadow flex items-center gap-4 relative overflow-hidden group cursor-pointer"
                    >
                       {restaurant.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1 shadow-sm">
                          <Flame className="w-3 h-3" fill="currentColor" /> Imperdible
                        </div>
                      )}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                        <ImageWithFallback src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h3 className="font-bold text-slate-800 mb-1 truncate pr-16">{restaurant.name}</h3>
                        <p className="text-xs font-semibold text-slate-500 mb-2">{restaurant.cuisine}</p>
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <span className="text-emerald-600">{restaurant.priceRange}</span>
                          <span className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3" fill="currentColor" /> {restaurant.rating}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setItemToAdd({ ...restaurant, category: 'Restaurante' }); }}
                        className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors shrink-0 shadow-sm mr-1"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'hotels' && (
                <motion.div
                  key="hotels"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-slate-800 text-lg">Dónde alojarse</h2>
                  </div>
                  {sortedHotels.map((hotel, idx) => (
                    <div 
                      key={hotel.id} 
                      onClick={() => setSelectedItemDetail({ ...hotel, category: 'Hotel' })}
                      className="bg-white border border-slate-100 rounded-3xl p-3 hover:shadow-md transition-shadow flex items-center gap-4 relative overflow-hidden group cursor-pointer"
                    >
                       {hotel.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1 shadow-sm">
                          <Flame className="w-3 h-3" fill="currentColor" /> Destacado
                        </div>
                      )}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                        <ImageWithFallback src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h3 className="font-bold text-slate-800 mb-1 truncate pr-16">{hotel.name}</h3>
                        <p className="text-xs font-semibold text-slate-500 mb-2">{hotel.type}</p>
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <span className="text-blue-600">${hotel.price} <span className="text-slate-400 font-medium">/noche</span></span>
                          <span className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3" fill="currentColor" /> {hotel.rating}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setItemToAdd({ ...hotel, category: 'Hotel' }); }}
                        className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shrink-0 shadow-sm mr-1"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 md:left-auto md:w-[calc(100%-41.666667%)] lg:w-[calc(100%-33.333333%)] bg-white/80 backdrop-blur-xl border-t border-slate-200/50 px-6 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-6">
          <div className="hidden sm:block">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Precio desde</p>
            <p className="text-2xl font-black text-slate-800">
              ${destinationData.priceFrom} <span className="text-sm font-semibold text-slate-400 tracking-normal">/viaje</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/itinerary')}
            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:bg-blue-600 transition-colors flex justify-center items-center gap-2"
          >
            Planificar viaje
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedItemDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemDetail(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              {selectedItemDetail.image ? (
                <div className="h-48 w-full relative">
                  <ImageWithFallback src={selectedItemDetail.image} alt={selectedItemDetail.name} className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedItemDetail(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="h-24 bg-gradient-to-br from-blue-500 to-cyan-400 relative flex items-center justify-center">
                  <span className="text-5xl">{selectedItemDetail.icon}</span>
                  <button onClick={() => setSelectedItemDetail(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{selectedItemDetail.category}</span>
                  <span className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                    <Star className="w-4 h-4" fill="currentColor" /> {selectedItemDetail.rating}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-4">{selectedItemDetail.name}</h2>
                
                <p className="text-slate-600 mb-6 leading-relaxed font-medium">
                  Descubre la experiencia de disfrutar de {selectedItemDetail.name}. 
                  Este {selectedItemDetail.category.toLowerCase()} es una de las opciones más destacadas en tu viaje a {destinationData.name}.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedItemDetail.price && (
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Precio</p>
                      <p className="font-bold text-slate-800">${selectedItemDetail.price}</p>
                    </div>
                  )}
                  {selectedItemDetail.priceRange && (
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Rango</p>
                      <p className="font-bold text-emerald-600">{selectedItemDetail.priceRange}</p>
                    </div>
                  )}
                  {selectedItemDetail.duration && (
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Duración</p>
                      <p className="font-bold text-slate-800">{selectedItemDetail.duration}</p>
                    </div>
                  )}
                  {selectedItemDetail.cuisine && (
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Cocina</p>
                      <p className="font-bold text-slate-800">{selectedItemDetail.cuisine}</p>
                    </div>
                  )}
                  {selectedItemDetail.type && (
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Tipo</p>
                      <p className="font-bold text-slate-800">{selectedItemDetail.type}</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    setItemToAdd(selectedItemDetail);
                    setSelectedItemDetail(null);
                  }}
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30"
                >
                  <Plus className="w-5 h-5" /> Agregar al itinerario
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {itemToAdd && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemToAdd(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl text-slate-800">Agregar al itinerario</h3>
                <button onClick={() => setItemToAdd(null)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl mb-6 border border-slate-100">
                {itemToAdd.image ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                     <ImageWithFallback src={itemToAdd.image} alt={itemToAdd.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                    {itemToAdd.icon}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{itemToAdd.name}</p>
                  <p className="text-xs font-semibold text-slate-500">{itemToAdd.category}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setItemToAdd(null);
                    navigate('/itinerary');
                  }}
                  className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Viaje a Maldivas</p>
                    <p className="text-xs text-slate-500 font-medium">12 - 19 Noviembre</p>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setItemToAdd(null);
                    navigate('/itinerary');
                  }}
                  className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-2xl hover:border-slate-800 hover:bg-slate-50 transition-all group border-dashed text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors shrink-0">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Crear nuevo itinerario</p>
                    <p className="text-xs text-slate-500 font-medium">Comenzar un viaje nuevo</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
