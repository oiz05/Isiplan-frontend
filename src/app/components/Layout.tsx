import { NavLink, Outlet, useLocation } from "react-router"
import { motion } from "motion/react"
import { 
  Home, 
  Map, 
  CalendarDays, 
  Wallet, 
  MessageSquare, 
  Settings,
  LogOut,
  Compass
} from "lucide-react"
import { cn } from "../../lib/utils"

const NAV_ITEMS = [
  { icon: Home, label: "Inicio", path: "/home" },
  { icon: Compass, label: "Explorar", path: "/explore" },
  { icon: CalendarDays, label: "Itinerario", path: "/itinerary" },
  { icon: Map, label: "Mapa", path: "/map" },
  { icon: Wallet, label: "Presupuesto", path: "/budget" },
  { icon: MessageSquare, label: "AI Planner", path: "/ai-chat" },
]

export function Layout() {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden w-full max-w-[1600px] mx-auto">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-full p-6 relative z-50 bg-white md:bg-transparent">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Isiplan</span>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 relative group text-sm font-medium",
                  isActive ? "text-blue-700" : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white shadow-sm border border-white/50 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-200/50 space-y-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-white/50 w-full transition-colors text-sm font-medium">
            <Settings className="w-5 h-5 text-slate-400" />
            Configuración
          </button>
          <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-white/50 w-full transition-colors text-sm font-medium">
            <LogOut className="w-5 h-5 text-rose-400" />
            Cerrar sesión
          </NavLink>
          <div className="flex items-center gap-3 px-4 py-3 mt-2">
            <img 
              src="https://images.unsplash.com/photo-1763713513119-51d0c4bb200f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGhhcHB5JTIwd29tYW4lMjBwcm9maWxlfGVufDF8fHx8MTc3OTY4NjI2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="User profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-slate-800">Ana Silva</span>
              <span className="text-xs text-slate-500">Pro Member</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full flex flex-col min-w-0 px-4 pt-4 pb-24 md:px-6 md:py-6 relative">
        <div className="glass-panel w-full h-full overflow-y-auto overflow-x-hidden flex flex-col relative z-10 custom-scrollbar">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel rounded-none rounded-t-3xl border-b-0 pb-safe z-50 px-4 py-4 flex justify-between items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-blue-50/50")} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
