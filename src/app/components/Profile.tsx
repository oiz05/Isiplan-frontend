import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  User,
  Settings,
  Heart,
  MapPin,
  Calendar,
  Award,
  CreditCard,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
  Plane,
  Star,
} from 'lucide-react';

const stats = [
  { label: 'Viajes', value: '12', icon: Plane },
  { label: 'Países', value: '8', icon: MapPin },
  { label: 'Reseñas', value: '24', icon: Star },
];

const menuItems = [
  {
    section: 'Cuenta',
    items: [
      { icon: User, label: 'Editar perfil', path: '/profile/edit' },
      { icon: Heart, label: 'Mis favoritos', path: '/favorites', badge: '15' },
      { icon: Calendar, label: 'Mis viajes', path: '/trips' },
      { icon: Award, label: 'Logros y badges', path: '/achievements', badge: 'New' },
    ],
  },
  {
    section: 'Preferencias',
    items: [
      { icon: CreditCard, label: 'Métodos de pago', path: '/payment' },
      { icon: Bell, label: 'Notificaciones', path: '/notifications' },
      { icon: Lock, label: 'Privacidad y seguridad', path: '/privacy' },
      { icon: Settings, label: 'Configuración', path: '/settings' },
    ],
  },
  {
    section: 'Soporte',
    items: [
      { icon: HelpCircle, label: 'Centro de ayuda', path: '/help' },
    ],
  },
];

export function Profile() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-600 to-rose-600 px-6 pt-6 pb-32 rounded-b-[3rem] shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">Mi Perfil</h1>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-24 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white"
        >
          {/* Avatar and info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-purple-500">
                <Camera className="w-4 h-4 text-purple-600" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">María González</h2>
              <p className="text-gray-600 text-sm">maria.gonzalez@email.com</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Exploradora Gold
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-6">
          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                {section.section}
              </h3>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => item.path && navigate(item.path)}
                      className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                        itemIdx < section.items.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <span className="flex-1 text-left font-medium text-gray-900">
                        {item.label}
                      </span>
                      {item.badge && (
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.badge}
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout */}
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-white border border-red-200 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-red-600 font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>

          <p className="text-center text-sm text-gray-500 py-4">
            TravelAI v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
