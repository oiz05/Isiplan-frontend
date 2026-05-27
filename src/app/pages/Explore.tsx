import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Star, Calendar, TrendingUp, Filter, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const allDestinations = [
  {
    id: 1,
    name: 'Maldivas',
    country: 'Océano Índico',
    image: 'https://images.unsplash.com/photo-1535262412227-85541e910204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 1200,
    days: 7,
    rating: 4.9,
    category: 'Playa',
  },
  {
    id: 2,
    name: 'París',
    country: 'Francia',
    image: 'https://images.unsplash.com/photo-1461838239441-4475121c0b7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 980,
    days: 5,
    rating: 4.8,
    category: 'Ciudad',
  },
  {
    id: 3,
    name: 'Alpes Suizos',
    country: 'Suiza',
    image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 1450,
    days: 6,
    rating: 5.0,
    category: 'Aventura',
  },
  {
    id: 4,
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 890,
    days: 8,
    rating: 4.7,
    category: 'Playa',
  },
  {
    id: 5,
    name: 'Roma',
    country: 'Italia',
    image: 'https://images.unsplash.com/photo-1677690489325-e6a4d2594d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 850,
    days: 5,
    rating: 4.8,
    category: 'Cultural',
  },
  {
    id: 6,
    name: 'Islandia',
    country: 'Europa del Norte',
    image: 'https://images.unsplash.com/photo-1501554728187-ce583db33af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    price: 1680,
    days: 7,
    rating: 4.9,
    category: 'Aventura',
  },
];

const filters = ['Todos', 'Playa', 'Ciudad', 'Aventura', 'Cultural'];

export function Explore() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filteredDestinations = allDestinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilter === 'Todos' || dest.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-32 md:pb-10 h-full">
      <div className="p-6 md:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-blue-600" />
              Explorar destinos
            </h1>
            <p className="text-slate-500 mt-2">Encuentra tu próximo lugar favorito en el mundo</p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca por país, ciudad o continente..."
            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar-mobile">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedFilter === filter
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 font-medium">
              {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destino encontrado' : 'destinos encontrados'}
            </p>
            <button className="flex items-center gap-2 text-sm text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl">
              <TrendingUp className="w-4 h-4" />
              Más populares
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDestinations.map((dest, idx) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/explore/${dest.id}`)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
                      <span className="text-xs font-black text-slate-800">{dest.rating}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-black text-xl mb-1">{dest.name}</h3>
                      <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{dest.country}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                      <Calendar className="w-4 h-4" />
                      <span>{dest.days} días</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-bold uppercase block">Desde</span>
                      <span className="text-blue-600 font-black text-lg">${dest.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}