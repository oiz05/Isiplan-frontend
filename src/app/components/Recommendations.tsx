import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  Star,
  MapPin,
  DollarSign,
  Clock,
  Heart,
  Sparkles,
  Utensils,
  Coffee,
  Wine,
  Activity,
  Compass,
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const tabs = [
  { id: 'all', label: 'Todo', icon: Compass },
  { id: 'restaurants', label: 'Restaurantes', icon: Utensils },
  { id: 'cafes', label: 'Cafés', icon: Coffee },
  { id: 'bars', label: 'Bares', icon: Wine },
  { id: 'activities', label: 'Actividades', icon: Activity },
];

const recommendations = [
  {
    id: 1,
    type: 'restaurants',
    name: 'Sunset Beach Restaurant',
    category: 'Mariscos • Cocina Internacional',
    image: 'https://images.unsplash.com/photo-1515784638688-3f7e90ebb446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    rating: 4.9,
    reviews: 342,
    price: '$$$',
    distance: '1.2 km',
    aiMatch: 95,
    openNow: true,
    featured: true,
  },
  {
    id: 2,
    type: 'activities',
    name: 'Buceo en Arrecife de Coral',
    category: 'Deportes acuáticos',
    image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    rating: 5.0,
    reviews: 128,
    price: '$120',
    duration: '3 horas',
    aiMatch: 98,
    featured: true,
  },
  {
    id: 3,
    type: 'cafes',
    name: 'Island Coffee House',
    category: 'Café • Desayuno',
    image: 'https://images.unsplash.com/photo-1570698473651-b2de99bae12f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    rating: 4.7,
    reviews: 256,
    price: '$$',
    distance: '0.8 km',
    aiMatch: 88,
    openNow: true,
  },
  {
    id: 4,
    type: 'bars',
    name: 'Ocean Breeze Lounge',
    category: 'Bar • Cócteles',
    image: 'https://images.unsplash.com/photo-1612352891598-639786f98b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    rating: 4.8,
    reviews: 189,
    price: '$$$',
    distance: '2.1 km',
    aiMatch: 91,
    openNow: false,
  },
  {
    id: 5,
    type: 'restaurants',
    name: 'Spice Garden',
    category: 'Cocina Local • Asiática',
    image: 'https://images.unsplash.com/photo-1616036902568-fa623d8f0c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    rating: 4.6,
    reviews: 412,
    price: '$$',
    distance: '1.5 km',
    aiMatch: 85,
    openNow: true,
  },
  {
    id: 6,
    type: 'activities',
    name: 'Tour de Snorkel Privado',
    category: 'Deportes acuáticos',
    image: 'https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    rating: 4.9,
    reviews: 95,
    price: '$85',
    duration: '2 horas',
    aiMatch: 93,
  },
];

export function Recommendations() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredRecs =
    activeTab === 'all'
      ? recommendations
      : recommendations.filter((rec) => rec.type === activeTab);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-rose-600 px-6 pt-6 pb-6 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">Recomendaciones</h1>
            <p className="text-white/80 text-sm">Personalizadas para ti</p>
          </div>
        </div>

        {/* AI Badge */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <p className="text-white text-sm flex-1">
              Basado en tus preferencias y ubicación actual
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommendations List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4 pb-6">
          {filteredRecs.map((rec, idx) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              {rec.featured && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2">
                  <div className="flex items-center gap-2 text-white text-sm font-semibold">
                    <Sparkles className="w-4 h-4" fill="currentColor" />
                    Top Pick IA • {rec.aiMatch}% match
                  </div>
                </div>
              )}

              <div className="flex gap-4 p-4">
                <div className="relative flex-shrink-0">
                  <ImageWithFallback
                    src={rec.image}
                    alt={rec.name}
                    className="w-28 h-28 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => toggleFavorite(rec.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(rec.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 truncate">
                    {rec.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {rec.category}
                  </p>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                      <span className="font-semibold text-gray-900 text-sm">
                        {rec.rating}
                      </span>
                      <span className="text-gray-500 text-sm">({rec.reviews})</span>
                    </div>
                    {rec.distance && (
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{rec.distance}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {rec.duration ? (
                        <div className="flex items-center gap-1 text-gray-700 text-sm">
                          <Clock className="w-3 h-3" />
                          <span>{rec.duration}</span>
                        </div>
                      ) : (
                        rec.openNow !== undefined && (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                rec.openNow ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                rec.openNow ? 'text-green-700' : 'text-red-700'
                              }`}
                            >
                              {rec.openNow ? 'Abierto' : 'Cerrado'}
                            </span>
                          </div>
                        )
                      )}
                      <div className="flex items-center gap-1 text-gray-900 font-semibold text-sm">
                        <DollarSign className="w-3 h-3" />
                        <span>{rec.price}</span>
                      </div>
                    </div>

                    <button className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-shadow">
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
