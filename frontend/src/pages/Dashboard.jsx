import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Plus,
  ArrowRight,
  ShoppingBag,
  Zap,
  Coffee,
  Car,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import TransactionModal from '../components/transactions/TransactionModal';
import QuickAddModal from '../components/transactions/QuickAddModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/dashboard?period=thisMonth');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const currency = user?.currency || 'INR';

  // Fallback demo values matching Panel 4 in screenshot
  const totalIncome = data?.summary?.income || 50000;
  const totalExpenses = data?.summary?.expense || 32400;
  const balance = totalIncome - totalExpenses > 0 ? (totalIncome - totalExpenses) : 17600;
  const budgetLimit = 40000;

  // Monthly comparison chart matching Panel 4
  const barChartData = [
    { name: 'May', income: 42000, expense: 28000 },
    { name: 'Jun', income: 45000, expense: 31000 },
    { name: 'Jul', income: 48000, expense: 29000 },
    { name: 'Aug', income: 46000, expense: 33000 },
    { name: 'Sep', income: 52000, expense: 35000 },
    { name: 'Oct', income: totalIncome, expense: totalExpenses },
  ];

  // Category breakdown matching Panel 4
  const categoryData = [
    { name: 'Food & Dining', value: 10400, percentage: 32, color: '#801E35' },
    { name: 'Transport', value: 5800, percentage: 18, color: '#D27F8F' },
    { name: 'Bills & Utilities', value: 5200, percentage: 16, color: '#B59D85' },
    { name: 'Shopping', value: 3900, percentage: 12, color: '#681327' },
    { name: 'Other', value: 7100, percentage: 22, color: '#9C8269' },
  ];

  // Recent transactions list matching Panel 4
  const recentTransactions = [
    {
      id: 'tx-1',
      title: 'Groceries',
      category: 'Food',
      date: 'Oct 28, 2026',
      amount: -2400,
      icon: ShoppingBag,
      color: 'bg-dustypink-100 text-dustypink-700 dark:bg-burgundy-900 dark:text-dustypink-300'
    },
    {
      id: 'tx-2',
      title: 'Salary',
      category: 'Income',
      date: 'Oct 25, 2026',
      amount: 50000,
      icon: Briefcase,
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
    },
    {
      id: 'tx-3',
      title: 'Electricity Bill',
      category: 'Bills',
      date: 'Oct 20, 2026',
      amount: -1850,
      icon: Zap,
      color: 'bg-sand-100 text-sand-800 dark:bg-burgundy-900 dark:text-sand-300'
    },
  ];

  // Budget overview items matching Panel 4
  const budgetItems = [
    { name: 'Food & Dining', spent: 10400, total: 12000, pct: 87, color: 'bg-burgundy-600', icon: Coffee },
    { name: 'Transport', spent: 5800, total: 8000, pct: 73, color: 'bg-dustypink-500', icon: Car },
    { name: 'Bills & Utilities', spent: 5200, total: 6000, pct: 87, color: 'bg-sand-500', icon: Zap },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Top 4 Stat Cards (Panel 4 & Panel 12 Mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Total Income */}
        <div className="bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-sand-600 dark:text-sand-400">Total Income</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-burgundy-950 dark:text-cream-50">
              ₹ {totalIncome.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+12% vs last month</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-sand-600 dark:text-sand-400">Total Expenses</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-dustypink-100 dark:bg-burgundy-900/60 text-dustypink-600 dark:text-dustypink-300 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-burgundy-950 dark:text-cream-50">
              ₹ {totalExpenses.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-dustypink-600 dark:text-dustypink-400">-5% spend control</span>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-sand-600 dark:text-sand-400">Balance</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-burgundy-100 dark:bg-burgundy-900/60 text-burgundy-700 dark:text-cream-200 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-burgundy-950 dark:text-cream-50">
              ₹ {balance.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-burgundy-600 dark:text-dustypink-400">Current Net Balance</span>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-sand-600 dark:text-sand-400">Budget</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sand-100 dark:bg-burgundy-900/60 text-sand-700 dark:text-sand-300 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-burgundy-950 dark:text-cream-50">
              ₹ {budgetLimit.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-sand-600 dark:text-sand-400">Monthly Target Cap</span>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Income vs Expenses & Category Donut (Panel 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Bar Chart (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-base sm:text-lg font-black text-burgundy-950 dark:text-cream-50">
              Income vs Expenses
            </h2>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-sand-700 dark:text-sand-300">
                <span className="w-2.5 h-2.5 rounded-full bg-burgundy-600 inline-block" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-sand-700 dark:text-sand-300">
                <span className="w-2.5 h-2.5 rounded-full bg-dustypink-500 inline-block" />
                Expenses
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                barGap={6}
              >
                <XAxis
                  dataKey="name"
                  stroke="#B59D85"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#B59D85"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
                />
                <Tooltip
                  formatter={(value) => [`₹ ${Number(value).toLocaleString('en-IN')}`]}
                  contentStyle={{
                    backgroundColor: '#1F050B',
                    borderRadius: '16px',
                    border: '1px solid #520B1C',
                    color: '#FAF7F2',
                  }}
                />
                <Bar
                  dataKey="income"
                  fill="#801E35"
                  radius={[6, 6, 6, 6]}
                  barSize={14}
                />
                <Bar
                  dataKey="expense"
                  fill="#D27F8F"
                  radius={[6, 6, 6, 6]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense by Category Donut Chart (Right 1 col) */}
        <div className="bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-black text-burgundy-950 dark:text-cream-50">
              Expense by Category
            </h2>
          </div>

          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => `₹ ${Number(val).toLocaleString('en-IN')}`}
                  contentStyle={{
                    backgroundColor: '#1F050B',
                    borderRadius: '12px',
                    border: '1px solid #520B1C',
                    color: '#FAF7F2',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-sand-500 uppercase">Total</span>
              <span className="text-sm font-black text-burgundy-950 dark:text-cream-50">
                ₹ 32,400
              </span>
            </div>
          </div>

          {/* Category List & Percentages */}
          <div className="space-y-1.5 pt-2 border-t border-sand-100 dark:border-burgundy-900/80 text-xs">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between font-semibold text-sand-700 dark:text-sand-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </div>
                <span className="font-bold text-burgundy-900 dark:text-cream-100">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Recent Transactions & Budget Overview (Panel 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions List (Panel 4) */}
        <div className="bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-burgundy-950 dark:text-cream-50">
              Recent Transactions
            </h2>
            <Link
              to="/transactions"
              className="text-xs font-bold text-burgundy-600 dark:text-dustypink-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-sand-100 dark:divide-burgundy-900/60">
            {recentTransactions.map((tx) => {
              const Icon = tx.icon;
              const isIncome = tx.amount > 0;
              return (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${tx.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-burgundy-950 dark:text-cream-100">
                        {tx.title}
                      </h4>
                      <p className="text-[11px] text-sand-500">{tx.date}</p>
                    </div>
                  </div>

                  <span className={`text-xs sm:text-sm font-black ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-dustypink-600'}`}>
                    {isIncome ? `+ ₹ ${tx.amount.toLocaleString('en-IN')}` : `- ₹ ${Math.abs(tx.amount).toLocaleString('en-IN')}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Overview (Panel 4) */}
        <div className="bg-white dark:bg-[#250810] border border-sand-200/80 dark:border-burgundy-900/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-burgundy-950 dark:text-cream-50">
              Budget Overview
            </h2>
            <Link
              to="/budgets"
              className="text-xs font-bold text-burgundy-600 dark:text-dustypink-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {budgetItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 text-burgundy-950 dark:text-cream-100">
                      <Icon className="w-3.5 h-3.5 text-dustypink-600" />
                      <span>{item.name}</span>
                    </div>
                    <div className="text-sand-600 dark:text-sand-300">
                      ₹ {item.spent.toLocaleString('en-IN')} / ₹ {item.total.toLocaleString('en-IN')}{' '}
                      <span className="font-black text-burgundy-700 dark:text-dustypink-400">
                        {item.pct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-sand-100 dark:bg-burgundy-950 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Quick Add / Transaction Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={fetchDashboard}
      />
    </div>
  );
};

export default Dashboard;
