import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "react-router"
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Compass } from "lucide-react"
import { ImageWithFallback } from "../components/figma/ImageWithFallback"

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    if (token) {
      localStorage.setItem("auth_token", token)
      window.history.replaceState({}, document.title, window.location.pathname)
      navigate("/home")
    }
  }, [navigate])

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/home")
  }

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden relative">
      {/* Background Graphic elements for mobile */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 lg:hidden" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 lg:hidden" />

      {/* Left Column - Form */}
      <div className="w-full lg:w-[480px] xl:w-[540px] flex flex-col px-8 sm:px-12 lg:px-16 py-8 sm:py-12 relative z-10 overflow-y-auto custom-scrollbar">
        
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">Isiplan.</span>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-[500px]">
          <div className="w-full max-w-sm mx-auto space-y-8 py-12">
            
            <div className="space-y-2 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.h1 
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-3xl font-black text-slate-900 tracking-tight"
              >
                {isLogin ? "Te damos la bienvenida" : "Comienza tu viaje"}
              </motion.h1>
            </AnimatePresence>
            <p className="text-slate-500 font-medium">
              {isLogin ? "Ingresa tus datos para continuar planeando." : "Únete a miles de viajeros descubriendo el mundo."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-bold text-slate-700 ml-1">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Ej. Ana García" 
                      required
                      className="w-full bg-slate-50 border border-slate-200/60 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-sm placeholder:font-medium placeholder:text-slate-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="tu@email.com" 
                  required
                  className="w-full bg-slate-50 border border-slate-200/60 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-sm placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-slate-700">Contraseña</label>
                {isLogin && (
                  <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required
                  className="w-full bg-slate-50 border border-slate-200/60 pl-12 pr-12 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-sm placeholder:font-black placeholder:text-slate-400 tracking-wide"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl mt-6 hover:bg-blue-600 shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              {isLogin ? "Iniciar sesión" : "Crear cuenta"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              o continúa con
            </div>
          </div>

          <button 
            type="button"
            onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
            className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 39.869 -11.514 38.739 -14.754 38.739 C -19.444 38.739 -23.494 41.439 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Continuar con Google
          </button>

          <p className="text-center text-sm font-medium text-slate-500 pt-4">
            {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)} 
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>

        </div>
        </div>
      </div>

      {/* Right Column - Image (Desktop Only) */}
      <div className="hidden lg:block lg:flex-1 relative bg-slate-100 m-4 rounded-[2rem] overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
          alt="Viaje inspiracional" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        
        {/* Floating Card UI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white"
        >
          <div className="flex gap-4 items-center mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50">
               <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=face&fit=crop&w=100&h=100" alt="Avatar" className="w-full h-full object-cover"/>
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">"La mejor forma de planear mi viaje a Bali."</p>
              <p className="text-sm text-white/70">Sofia R. • Viajera experta</p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  )
}