import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Search,
  MapPin,
  Calendar,
  MessageCircle,
  User,
  Sparkles,
  TrendingUp,
  Heart,
  Star,
  ChevronRight,
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const destinations = [
  {
    id: 1,
    name: 'Maldivas',
    country: 'Océano Índico',
    image: 'https://images.unsplash.com/photo-1535262412227-85541e910204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: '$1,200',
    days: '7 días',
    rating: 4.9,
    category: 'Playa',
  },
  {
    id: 2,
    name: 'París',
    country: 'Francia',
    image: 'https://images.unsplash.com/photo-1461838239441-4475121c0b7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: '$980',
    days: '5 días',
    rating: 4.8,
    category: 'Ciudad',
  },
  {
    id: 3,
    name: 'Alpes Suizos',
    country: 'Suiza',
    image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: '$1,450',
    days: '6 días',
    rating: 5.0,
    category: 'Aventura',
  },
];

const aiRecommendations = [
  {
    title: 'Playa Tropical en Phuket',
    location: 'Tailandia',
    match: 95,
    image: 'https://images.unsplash.com/photo-1672841828459-bc913fdcd995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: 'Arquitectura Europea',
    location: 'Praga, República Checa',
    match: 92,
    image: 'https://images.unsplash.com/photo-1677690489325-e6a4d2594d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

const categories = [
  { name: 'Playa', icon: '🏖️', color: 'from-cyan-500 to-blue-500' },
  { name: 'Ciudad', icon: '🏙️', color: 'from-purple-500 to-pink-500' },
  { name: 'Aventura', icon: '⛰️', color: 'from-green-500 to-emerald-500' },
  { name: 'Cultural', icon: '🏛️', color: 'from-orange-500 to-red-500' },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-b-[2rem] shadow-xl">
        <div className="p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm">¡Hola de nuevo!</p>
              <h1 className="text-white text-2xl font-bold">María González</h1>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30"
            >
              <User className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Search bar */}
          <button
            onClick={() => navigate('/search')}
            className="w-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/30 transition-all"
          >
            <Search className="w-5 h-5 text-white" />
            <span className="text-white/90 flex-1 text-left">¿A dónde quieres viajar?</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" fill="currentColor" />
              <h2 className="font-bold text-gray-900">Recomendaciones IA</h2>
            </div>
            <button className="text-cyan-600 text-sm font-semibold">Ver más</button>
          </div>

          <div className="space-y-3">
            {aiRecommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate('/destination/1')}
                className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex gap-3 p-3">
                  <ImageWithFallback
                    src={rec.image}
                    alt={rec.title}
                    className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{rec.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{rec.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${rec.match}%` }}
                        />
                      </div>
                      <span className="text-purple-600 text-sm font-semibold">{rec.match}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <div>
          <h2 className="font-bold text-gray-900 mb-4">Categorías</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-full aspect-square bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg hover:scale-105 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="text-xs text-gray-700 font-medium">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h2 className="font-bold text-gray-900">Destinos Populares</h2>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-cyan-600 text-sm font-semibold"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-4">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/destination/${dest.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 text-white text-sm mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>{dest.country}</span>
                    </div>
                    <h3 className="text-white text-xl font-bold">{dest.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                        <span className="font-semibold text-gray-900">{dest.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{dest.days}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Desde</p>
                      <p className="text-lg font-bold text-cyan-600">{dest.price}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 safe-area-bottom">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-cyan-600">Inicio</span>
          </button>
          <button
            onClick={() => navigate('/itinerary')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-xs text-gray-500">Itinerario</span>
          </button>
          <button
            onClick={() => navigate('/map')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-xs text-gray-500">Mapa</span>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="flex flex-col items-center gap-1 relative"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-xs text-gray-500">Chat IA</span>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
