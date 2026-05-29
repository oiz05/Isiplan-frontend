import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ChevronLeft,
  MapPin,
  Star,
  Calendar,
  TrendingUp,
  Filter,
  X,
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

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
    activities: ['Buceo', 'Snorkel', 'Spa'],
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
    activities: ['Museos', 'Gastronomía', 'Arquitectura'],
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
    activities: ['Senderismo', 'Esquí', 'Montañismo'],
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
    activities: ['Templos', 'Surf', 'Yoga'],
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
    activities: ['Historia', 'Arte', 'Gastronomía'],
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
    activities: ['Auroras', 'Glaciares', 'Geisers'],
  },
];

const filters = ['Todos', 'Playa', 'Ciudad', 'Aventura', 'Cultural'];

export function SearchDestinations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const filteredDestinations = allDestinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedFilter === 'Todos' || dest.category === selectedFilter;
    const matchesPrice = dest.price >= priceRange[0] && dest.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 pt-6 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold flex-1">Buscar Destinos</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30"
          >
            <Filter className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar destinos, países, ciudades..."
            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 border-b border-gray-200 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Rango de precio (USD)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-900 min-w-[80px]">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filters */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedFilter === filter
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {filteredDestinations.length} destinos encontrados
          </p>
          <button className="flex items-center gap-1 text-sm text-cyan-600 font-semibold">
            <TrendingUp className="w-4 h-4" />
            Popular
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-6">
          {filteredDestinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/destination/${dest.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="relative h-36">
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                    <span className="text-xs font-semibold text-gray-900">
                      {dest.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-900 mb-1 truncate">{dest.name}</h3>
                <div className="flex items-center gap-1 text-gray-600 text-xs mb-2">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{dest.country}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{dest.days}d</span>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-600 font-bold text-sm">
                      ${dest.price}
                    </span>
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
