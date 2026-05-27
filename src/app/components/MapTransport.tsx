import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Car,
  Bus,
  Bike,
  Ship,
  Plane,
  Clock,
  DollarSign,
  Info,
  ChevronRight,
} from 'lucide-react';

const transportModes = [
  { id: 'car', name: 'Auto', icon: Car, color: 'from-blue-500 to-cyan-500' },
  { id: 'bus', name: 'Bus', icon: Bus, color: 'from-green-500 to-emerald-500' },
  { id: 'bike', name: 'Bici', icon: Bike, color: 'from-orange-500 to-red-500' },
  { id: 'boat', name: 'Barco', icon: Ship, color: 'from-cyan-500 to-blue-500' },
];

const routes = [
  {
    id: 1,
    from: 'Resort Paradise Island',
    to: 'Banana Reef',
    mode: 'boat',
    distance: '5.2 km',
    duration: '25 min',
    cost: 45,
    departure: '08:00',
    isRecommended: true,
  },
  {
    id: 2,
    from: 'Resort Paradise Island',
    to: 'Malé Centro',
    mode: 'boat',
    distance: '8.5 km',
    duration: '45 min',
    cost: 35,
    departure: '09:00',
  },
  {
    id: 3,
    from: 'Malé Centro',
    to: 'Aeropuerto Internacional',
    mode: 'bus',
    distance: '3.2 km',
    duration: '15 min',
    cost: 5,
    departure: 'Cada 20 min',
  },
];

const upcomingTrips = [
  {
    date: 'Hoy, 16 Jun',
    trips: [
      {
        time: '08:00',
        from: 'Resort',
        to: 'Banana Reef',
        mode: 'boat',
        status: 'En camino',
      },
      {
        time: '14:00',
        from: 'Banana Reef',
        to: 'Resort',
        mode: 'boat',
        status: 'Próximo',
      },
    ],
  },
];

export function MapTransport() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Map Header */}
      <div className="relative h-72 bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100">
        {/* Simulated map with markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full shadow-lg"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-blue-500 rounded-full shadow-lg"
            />
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' }}
            >
              <path
                d="M 64 64 Q 96 32 128 64 T 192 128"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>

        {/* Map overlay controls */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </button>
          <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Navigation className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Tu ubicación</span>
              </div>
              <span className="text-sm text-gray-600">Resort Paradise</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transport modes */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900 mb-3">Medio de transporte</h2>
        <div className="grid grid-cols-4 gap-3">
          {transportModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(isSelected ? null : mode.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  isSelected ? 'shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${mode.color} rounded-xl flex items-center justify-center ${
                    isSelected ? 'scale-110' : ''
                  } transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{mode.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming trips */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900 mb-3">Próximos viajes</h2>
        {upcomingTrips.map((day, dayIdx) => (
          <div key={dayIdx} className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">{day.date}</p>
            <div className="space-y-2">
              {day.trips.map((trip, tripIdx) => {
                const ModeIcon = trip.mode === 'boat' ? Ship : Car;
                return (
                  <div
                    key={tripIdx}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <ModeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          {trip.from} → {trip.to}
                        </p>
                        <p className="text-xs text-gray-600">{trip.time}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            trip.status === 'En camino'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {trip.status}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Available routes */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Rutas disponibles</h2>
          <button className="text-blue-600 text-sm font-semibold">Ver todas</button>
        </div>

        <div className="space-y-3 pb-6">
          {routes
            .filter((route) => !selectedMode || route.mode === selectedMode)
            .map((route, idx) => {
              const ModeIcon =
                route.mode === 'boat'
                  ? Ship
                  : route.mode === 'bus'
                  ? Bus
                  : route.mode === 'bike'
                  ? Bike
                  : Car;

              return (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white rounded-2xl p-4 border ${
                    route.isRecommended
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'border-gray-200 shadow-md'
                  } hover:shadow-xl transition-all`}
                >
                  {route.isRecommended && (
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                      Recomendado por IA
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ModeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {route.from}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {route.to}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-xl p-2">
                      <p className="text-xs text-gray-600 mb-1">Distancia</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {route.distance}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                      <p className="text-xs text-gray-600 mb-1">Duración</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-700" />
                        <p className="font-semibold text-gray-900 text-sm">
                          {route.duration}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                      <p className="text-xs text-gray-600 mb-1">Costo</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-gray-700" />
                        <p className="font-semibold text-gray-900 text-sm">
                          ${route.cost}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Info className="w-4 h-4" />
                      <span>Sale a las {route.departure}</span>
                    </div>
                    <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-shadow">
                      Reservar
                    </button>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
