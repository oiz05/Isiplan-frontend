import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plane,
  Hotel,
  Utensils,
  ShoppingBag,
  Activity,
  Plus,
  AlertCircle,
} from 'lucide-react';

const budgetData = {
  total: 3500,
  spent: 1245,
  remaining: 2255,
  currency: 'USD',
  categories: [
    {
      name: 'Transporte',
      icon: Plane,
      budgeted: 800,
      spent: 350,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { name: 'Vuelos', amount: 250, date: '15 Jun' },
        { name: 'Traslados', amount: 100, date: '15 Jun' },
      ],
    },
    {
      name: 'Alojamiento',
      icon: Hotel,
      budgeted: 1200,
      spent: 600,
      color: 'from-purple-500 to-pink-500',
      items: [
        { name: 'Resort 3 noches', amount: 600, date: '15 Jun' },
      ],
    },
    {
      name: 'Comida',
      icon: Utensils,
      budgeted: 600,
      spent: 215,
      color: 'from-orange-500 to-red-500',
      items: [
        { name: 'Cena playa', amount: 85, date: '15 Jun' },
        { name: 'Almuerzo buffet', amount: 45, date: '16 Jun' },
        { name: 'Desayunos', amount: 85, date: '15-16 Jun' },
      ],
    },
    {
      name: 'Actividades',
      icon: Activity,
      budgeted: 500,
      spent: 80,
      color: 'from-green-500 to-emerald-500',
      items: [
        { name: 'Tour en barco', amount: 80, date: '16 Jun' },
      ],
    },
    {
      name: 'Compras',
      icon: ShoppingBag,
      budgeted: 400,
      spent: 0,
      color: 'from-yellow-500 to-orange-500',
      items: [],
    },
  ],
};

export function BudgetTracker() {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const spentPercentage = (budgetData.spent / budgetData.total) * 100;
  const isOverBudget = budgetData.spent > budgetData.total;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-600 to-rose-600 px-6 pt-6 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/itinerary')}
            className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold flex-1">Presupuesto</h1>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Budget overview */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Presupuesto Total</p>
              <p className="text-white text-3xl font-bold">
                ${budgetData.total.toLocaleString()}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-white/90 mb-2">
              <span>Gastado</span>
              <span>{spentPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${spentPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  isOverBudget
                    ? 'bg-red-500'
                    : spentPercentage > 75
                    ? 'bg-yellow-500'
                    : 'bg-white'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/70 text-xs mb-1">Gastado</p>
              <p className="text-white text-lg font-bold">
                ${budgetData.spent.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">Restante</p>
              <p className="text-white text-lg font-bold">
                ${budgetData.remaining.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      {spentPercentage > 50 && (
        <div className="px-6 py-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Alerta de gasto</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Has gastado el {spentPercentage.toFixed(0)}% de tu presupuesto. Te sugiero ajustar gastos en Comida y Actividades para los próximos días.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-lg">Por categoría</h2>
          <button className="text-purple-600 text-sm font-semibold">Personalizar</button>
        </div>

        <div className="space-y-3">
          {budgetData.categories.map((category, idx) => {
            const percentage = (category.spent / category.budgeted) * 100;
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.name;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : category.name)
                  }
                  className="w-full p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">
                        ${category.spent} / ${category.budgeted}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          percentage > 100
                            ? 'text-red-600'
                            : percentage > 75
                            ? 'text-amber-600'
                            : 'text-green-600'
                        }`}
                      >
                        {percentage.toFixed(0)}%
                      </p>
                      {percentage > 100 ? (
                        <TrendingUp className="w-4 h-4 text-red-600 ml-auto" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-600 ml-auto" />
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </button>

                {isExpanded && category.items.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-gray-100 px-4 py-3 bg-gray-50"
                  >
                    <div className="space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-center justify-between py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">{item.date}</p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${item.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <button className="w-full mt-4 py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-medium hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Agregar categoría
        </button>
      </div>
    </div>
  );
}
