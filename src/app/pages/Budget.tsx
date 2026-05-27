import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ChevronDown, MapPin } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const BUDGET_PLANS = [
  {
    id: 1,
    title: "Escapada a París",
    destination: "París, Francia",
    totalBudget: 3500,
    expenses: [
      { name: "Vuelos", value: 850, color: "#3b82f6" },
      { name: "Alojamiento", value: 1200, color: "#14b8a6" },
      { name: "Comida", value: 450, color: "#f59e0b" },
      { name: "Actividades", value: 300, color: "#8b5cf6" },
      { name: "Transporte", value: 150, color: "#ec4899" },
    ],
    dailySpend: [
      { day: "12 Oct", amount: 120 },
      { day: "13 Oct", amount: 250 },
      { day: "14 Oct", amount: 180 },
      { day: "15 Oct", amount: 300 },
      { day: "16 Oct", amount: 150 },
    ],
    avgDaily: 185,
    trend: "+12%",
    isTrendUp: true,
    savings: 450,
  },
  {
    id: 2,
    title: "Verano en Tokio",
    destination: "Tokio, Japón",
    totalBudget: 5000,
    expenses: [
      { name: "Vuelos", value: 1500, color: "#3b82f6" },
      { name: "Alojamiento", value: 1800, color: "#14b8a6" },
      { name: "Comida", value: 600, color: "#f59e0b" },
      { name: "Actividades", value: 400, color: "#8b5cf6" },
      { name: "Transporte", value: 300, color: "#ec4899" },
    ],
    dailySpend: [
      { day: "05 Jul", amount: 150 },
      { day: "06 Jul", amount: 320 },
      { day: "07 Jul", amount: 210 },
      { day: "08 Jul", amount: 400 },
      { day: "09 Jul", amount: 190 },
    ],
    avgDaily: 254,
    trend: "-5%",
    isTrendUp: false,
    savings: 600,
  }
]

export function Budget() {
  const [selectedPlanId, setSelectedPlanId] = useState(1)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const activePlan = BUDGET_PLANS.find(p => p.id === selectedPlanId) || BUDGET_PLANS[0]
  const currentSpend = activePlan.expenses.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="p-6 md:p-10 w-full max-w-6xl mx-auto space-y-8 pb-32 md:pb-10">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-teal-500" />
            Presupuesto
          </h1>
          
          <div className="relative mt-4">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors w-full md:w-auto"
            >
              <MapPin className="w-4 h-4 text-slate-500" />
              <div className="text-left text-sm flex-1 min-w-[150px]">
                <p className="font-bold text-slate-800 leading-tight">{activePlan.title}</p>
                <p className="text-xs text-slate-500">{activePlan.destination}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-full md:w-64 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-20"
                  >
                    {BUDGET_PLANS.map(plan => (
                      <button 
                        key={plan.id}
                        onClick={() => { setSelectedPlanId(plan.id); setIsDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors ${plan.id === activePlan.id ? 'bg-blue-50/50' : ''}`}
                      >
                        <div>
                          <p className={`font-bold text-sm ${plan.id === activePlan.id ? 'text-blue-700' : 'text-slate-800'}`}>{plan.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{plan.destination}</p>
                        </div>
                        {plan.id === activePlan.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activePlan.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
              <p className="text-slate-300 font-medium mb-1">Gasto Total</p>
              <div className="text-4xl font-bold mb-4">${currentSpend}</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-teal-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${(currentSpend / activePlan.totalBudget) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-3">
                ${activePlan.totalBudget - currentSpend} restantes de ${activePlan.totalBudget}
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium mb-1">Gasto Diario Promedio</p>
                  <div className="text-3xl font-bold text-slate-800">${activePlan.avgDaily}</div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activePlan.isTrendUp ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                  {activePlan.isTrendUp ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4 flex items-center gap-1">
                <span className={`font-semibold ${activePlan.isTrendUp ? 'text-red-500' : 'text-green-500'}`}>
                  {activePlan.trend}
                </span> vs ayer
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium mb-1">Ahorro Estimado</p>
                  <div className="text-3xl font-bold text-slate-800">${activePlan.savings}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4 flex items-center gap-1">
                Basado en tus reservas de IA
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expenses Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Distribución de Gastos</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart id={`pie-${activePlan.id}`}>
                    <Pie
                      key="pie-component"
                      data={activePlan.expenses}
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {activePlan.expenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      key="tooltip-component"
                      formatter={(value: number) => `$${value}`}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {activePlan.expenses.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600 flex-1 truncate">{item.name}</span>
                    <span className="text-sm font-bold shrink-0">${item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Spend */}
            <div className="glass-card p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Gasto por Día</h3>
                <button className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-800">
                  Ver detalles <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart id={`bar-${activePlan.id}`} data={activePlan.dailySpend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid key="grid-component" strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis key="xaxis-component" dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis key="yaxis-component" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      key="tooltip-component"
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      formatter={(value: number) => [`$${value}`, 'Gasto']}
                    />
                    <Bar key="bar-component" dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  )
}