import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  Plus,
  ChevronDown,
  Sparkles,
  Navigation,
  DollarSign,
  Users,
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const itineraryDays = [
  {
    day: 1,
    date: 'Lun, 15 Jun',
    activities: [
      {
        time: '09:00',
        title: 'Llegada a Malé',
        location: 'Aeropuerto Internacional Velana',
        duration: '2h',
        type: 'Transporte',
        icon: '✈️',
        cost: 0,
      },
      {
        time: '11:00',
        title: 'Traslado en lancha al resort',
        location: 'Resort Paradise Island',
        duration: '45min',
        type: 'Transporte',
        icon: '⛵',
        cost: 120,
      },
      {
        time: '14:00',
        title: 'Check-in y almuerzo',
        location: 'Ocean Villa Resort',
        duration: '2h',
        type: 'Alojamiento',
        icon: '🏨',
        cost: 0,
      },
      {
        time: '18:00',
        title: 'Cena en la playa',
        location: 'Sunset Beach Restaurant',
        duration: '1.5h',
        type: 'Comida',
        icon: '🍽️',
        cost: 85,
      },
    ],
  },
  {
    day: 2,
    date: 'Mar, 16 Jun',
    activities: [
      {
        time: '08:00',
        title: 'Buceo en arrecife de coral',
        location: 'Banana Reef',
        duration: '3h',
        type: 'Actividad',
        icon: '🤿',
        cost: 120,
      },
      {
        time: '13:00',
        title: 'Almuerzo buffet',
        location: 'Ocean Villa Resort',
        duration: '1h',
        type: 'Comida',
        icon: '🍴',
        cost: 45,
      },
      {
        time: '16:00',
        title: 'Spa y masajes',
        location: 'Serenity Spa',
        duration: '2h',
        type: 'Actividad',
        icon: '💆',
        cost: 180,
      },
    ],
  },
];

export function ItineraryPlanner() {
  const navigate = useNavigate();
  const [expandedDay, setExpandedDay] = useState(1);

  const totalCost = itineraryDays.reduce(
    (sum, day) => sum + day.activities.reduce((daySum, act) => daySum + act.cost, 0),
    0
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 px-6 pt-6 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">Mi Itinerario</h1>
            <p className="text-white/80 text-sm">Maldivas • 7 días</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3">
            <Calendar className="w-5 h-5 text-white mb-1" />
            <p className="text-white/80 text-xs">Duración</p>
            <p className="text-white font-bold">7 días</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3">
            <MapPin className="w-5 h-5 text-white mb-1" />
            <p className="text-white/80 text-xs">Actividades</p>
            <p className="text-white font-bold">24</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3">
            <DollarSign className="w-5 h-5 text-white mb-1" />
            <p className="text-white/80 text-xs">Total</p>
            <p className="text-white font-bold">${totalCost}</p>
          </div>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 mb-1">Sugerencia IA</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Optimicé tu ruta para reducir tiempos de traslado en un 30%. ¿Quieres ver restaurantes cerca de tus actividades?
              </p>
              <button className="mt-3 text-purple-600 text-sm font-semibold">
                Ver optimización →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="space-y-4">
          {itineraryDays.map((dayData) => (
            <motion.div
              key={dayData.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
              <button
                onClick={() =>
                  setExpandedDay(expandedDay === dayData.day ? 0 : dayData.day)
                }
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold">Día {dayData.day}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">{dayData.date}</p>
                    <p className="text-sm text-gray-600">
                      {dayData.activities.length} actividades
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedDay === dayData.day ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedDay === dayData.day && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-4 space-y-3">
                    {dayData.activities.map((activity, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                            {activity.icon}
                          </div>
                          {idx < dayData.activities.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{activity.title}</p>
                              <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                <Clock className="w-3 h-3" />
                                <span>{activity.time}</span>
                                <span>•</span>
                                <span>{activity.duration}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>{activity.location}</span>
                              </div>
                            </div>
                            {activity.cost > 0 && (
                              <div className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                                <span className="text-emerald-700 text-sm font-semibold">
                                  ${activity.cost}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Agregar actividad
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-2xl">
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/budget')}
            className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Ver Presupuesto
          </button>
          <button
            onClick={() => navigate('/map')}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Ver en Mapa
          </button>
        </div>
      </div>
    </div>
  );
}
