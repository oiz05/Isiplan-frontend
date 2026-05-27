import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, Calendar, Wallet, ChevronRight } from 'lucide-react';

const slides = [
  {
    icon: Sparkles,
    title: 'Descubre con IA',
    description: 'Recomendaciones personalizadas basadas en tus preferencias, presupuesto y estilo de viaje',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: MapPin,
    title: 'Explora Destinos',
    description: 'Miles de lugares increíbles, actividades únicas y experiencias auténticas',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Calendar,
    title: 'Planifica Inteligente',
    description: 'Itinerarios optimizados automáticamente con rutas, horarios y tiempo estimado',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Wallet,
    title: 'Controla tu Presupuesto',
    description: 'Estimaciones precisas de costos y seguimiento en tiempo real de tus gastos',
    gradient: 'from-orange-500 to-pink-600',
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/auth');
    }
  };

  const handleSkip = () => {
    navigate('/auth');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Saltar
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-12"
            >
              <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${slide.gradient} rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-${slide.gradient.split(' ')[1]}/30`}>
                <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              {slide.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto"
            >
              {slide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="p-8">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-gradient-to-r from-cyan-500 to-blue-600'
                  : 'w-2 bg-gray-300'
              }`}
              animate={{
                scale: index === currentSlide ? 1 : 0.8,
              }}
            />
          ))}
        </div>

        {/* Next button */}
        <motion.button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
          whileTap={{ scale: 0.98 }}
        >
          {currentSlide === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
