import React, { useState, useEffect } from 'react';
import { Plus, Coffee, Car, Zap, ShoppingBag, Utensils, Edit2, Trash2 } from 'lucide-react';
import BudgetModal from '../components/budgets/BudgetModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const defaultMockBudgets = [
  {
    _id: 'b-1',
    categoryName: 'Food & Dining',
    spent: 10400,
    amount: 12000,
    percentage: 87,
    icon: Utensils,
    color: 'bg-burgundy-600',
    iconColor: 'bg-burgundy-100 text-burgundy-700 dark:bg-burgundy-900 dark:text-cream-200'
  },
  {
    _id: 'b-2',
    categoryName: 'Transport',
    spent: 5800,
    amount: 8000,
    percentage: 73,
    icon: Car,
    color: 'bg-dustypink-500',
    iconColor: 'bg-dustypink-100 text-dustypink-700 dark:bg-burgundy-900 dark:text-dustypink-300'
  },
  {
    _id: 'b-3',
    categoryName: 'Bills & Utilities',
    spent: 5200,
    amount: 6000,
    percentage: 87,
    icon: Zap,
    color: 'bg-sand-500',
    iconColor: 'bg-sand-100 text-sand-800 dark:bg-burgundy-900 dark:text-sand-300'
  },
  {
    _id: 'b-4',
    categoryName: 'Shopping',
    spent: 3200,
    amount: 5000,
    percentage: 64,
    icon: ShoppingBag,
    color: 'bg-burgundy-800',
    iconColor: 'bg-burgundy-200 text-burgundy-900 dark:bg-burgundy-900 dark:text-cream-200'
  },
];

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/budgets');
      if (res.data && res.data.budgets && res.data.budgets.length > 0) {
        setBudgets(res.data.budgets);
      } else {
        setBudgets(defaultMockBudgets);
      }
    } catch (err) {
      setBudgets(defaultMockBudgets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      setBudgets(budgets.filter((b) => b._id !== id));
    }
  };

  const getIcon = (catName) => {
    const name = (catName || '').toLowerCase();
    if (name.includes('food') || name.includes('dining')) return Utensils;
    if (name.includes('transport') || name.includes('car')) return Car;
    if (name.includes('bill') || name.includes('util')) return Zap;
    if (name.includes('shop')) return ShoppingBag;
    return Coffee;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header (Panel 7) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-burgundy-950 dark:text-cream-50">
            Budgets
          </h1>
          <p className="text-xs font-semibold text-sand-600 dark:text-sand-400">
            Monitor expenditure and stay strictly under monthly caps
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBudget(null);
            setIsModalOpen(true);
          }}
          className="btn-burgundy inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* 2. Budget Cards Grid (Panel 7) */}
      <div className="space-y-4">
        {budgets.map((b) => {
          const catName = b.category?.name || b.categoryName || 'General';
          const IconComponent = getIcon(catName);
          const spent = b.spent || 0;
          const total = b.amount || 1;
          const pct = Math.min(100, Math.round((spent / total) * 100)) || b.percentage || 0;
          const colorClass = b.color || (pct >= 85 ? 'bg-burgundy-600' : pct >= 70 ? 'bg-dustypink-500' : 'bg-sand-500');

          return (
            <div
              key={b._id}
              className="bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sand-100 dark:bg-burgundy-900 text-burgundy-700 dark:text-dustypink-300 flex items-center justify-center font-bold">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-burgundy-950 dark:text-cream-50">
                      {catName}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-semibold text-sand-600 dark:text-sand-300">
                      ₹ {spent.toLocaleString('en-IN')} / ₹ {total.toLocaleString('en-IN')}
                    </span>
                    <span className="ml-2 font-black text-sm text-burgundy-900 dark:text-cream-100">
                      {pct}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-1.5 rounded-lg text-sand-400 hover:text-dustypink-600 hover:bg-sand-100 dark:hover:bg-burgundy-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar matching Panel 7 */}
              <div className="w-full bg-sand-100 dark:bg-burgundy-950 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBudgets}
        editBudget={editingBudget}
      />
    </div>
  );
};

export default Budgets;
