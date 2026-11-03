import React, { useState, useEffect } from 'react';
import { Plus, Target, Laptop, MapPin, ShieldCheck, Trash2, Edit2 } from 'lucide-react';
import GoalModal from '../components/goals/GoalModal';
import ContributeGoalModal from '../components/goals/ContributeGoalModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const defaultMockGoals = [
  {
    _id: 'goal-1',
    name: 'Buy a Laptop',
    currentAmount: 40000,
    targetAmount: 60000,
    percentage: 67,
    icon: Laptop,
    color: 'bg-burgundy-600',
    iconColor: 'bg-burgundy-100 text-burgundy-700 dark:bg-burgundy-900 dark:text-cream-200'
  },
  {
    _id: 'goal-2',
    name: 'Trip to Ayodhya',
    currentAmount: 12000,
    targetAmount: 20000,
    percentage: 60,
    icon: MapPin,
    color: 'bg-dustypink-500',
    iconColor: 'bg-dustypink-100 text-dustypink-700 dark:bg-burgundy-900 dark:text-dustypink-300'
  },
  {
    _id: 'goal-3',
    name: 'Emergency Fund',
    currentAmount: 25000,
    targetAmount: 50000,
    percentage: 50,
    icon: ShieldCheck,
    color: 'bg-sand-500',
    iconColor: 'bg-sand-100 text-sand-800 dark:bg-burgundy-900 dark:text-sand-300'
  },
];

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/goals');
      if (res.data && res.data.goals && res.data.goals.length > 0) {
        setGoals(res.data.goals);
      } else {
        setGoals(defaultMockGoals);
      }
    } catch (err) {
      setGoals(defaultMockGoals);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      setGoals(goals.filter((g) => g._id !== id));
    }
  };

  const getIcon = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('laptop') || n.includes('tech') || n.includes('device')) return Laptop;
    if (n.includes('ayodhya') || n.includes('trip') || n.includes('travel')) return MapPin;
    if (n.includes('emergency') || n.includes('fund') || n.includes('safe')) return ShieldCheck;
    return Target;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header (Panel 9) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-burgundy-950 dark:text-cream-50">
            Financial Goals
          </h1>
          <p className="text-xs font-semibold text-sand-600 dark:text-sand-400">
            Save systematically towards your milestones and life aspirations
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-burgundy inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* 2. Goals List (Panel 9) */}
      <div className="space-y-4">
        {goals.map((g) => {
          const IconComponent = getIcon(g.name);
          const current = g.currentAmount || 0;
          const target = g.targetAmount || 1;
          const pct = Math.min(100, Math.round((current / target) * 100)) || g.percentage || 0;
          const colorClass = g.color || (pct >= 65 ? 'bg-burgundy-600' : pct >= 55 ? 'bg-dustypink-500' : 'bg-sand-500');

          return (
            <div
              key={g._id}
              className="bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sand-100 dark:bg-burgundy-900 text-burgundy-700 dark:text-dustypink-300 flex items-center justify-center font-bold">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-burgundy-950 dark:text-cream-50">
                      {g.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-semibold text-sand-600 dark:text-sand-300">
                      ₹ {current.toLocaleString('en-IN')} / ₹ {target.toLocaleString('en-IN')}
                    </span>
                    <span className="ml-2 font-black text-sm text-burgundy-900 dark:text-cream-100">
                      {pct}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(g._id)}
                    className="p-1.5 rounded-lg text-sand-400 hover:text-dustypink-600 hover:bg-sand-100 dark:hover:bg-burgundy-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar matching Panel 9 */}
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

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchGoals}
      />
    </div>
  );
};

export default Goals;
