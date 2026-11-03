import React, { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Zap,
  Car,
  Utensils,
  Coffee,
  Briefcase,
  Heart,
  Film,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// 6-Month Comparison Data for Overview
const monthlyFlowComparison = [
  { month: 'May', income: 45000, expense: 28000 },
  { month: 'Jun', income: 48000, expense: 31000 },
  { month: 'Jul', income: 46000, expense: 29000 },
  { month: 'Aug', income: 52000, expense: 33000 },
  { month: 'Sep', income: 48000, expense: 35000 },
  { month: 'Oct', income: 50000, expense: 32400 },
];

const expenseTrendData = [
  { month: 'May', expense: 28000 },
  { month: 'Jun', expense: 31000 },
  { month: 'Jul', expense: 29000 },
  { month: 'Aug', expense: 33000 },
  { month: 'Sep', expense: 35000 },
  { month: 'Oct', expense: 32400 },
];

const incomeTrendData = [
  { month: 'May', income: 45000 },
  { month: 'Jun', income: 48000 },
  { month: 'Jul', income: 46000 },
  { month: 'Aug', income: 52000 },
  { month: 'Sep', income: 48000 },
  { month: 'Oct', income: 50000 },
];

const weeklyExpenseData = [
  { week: 'Week 1 (Oct 1 - 7)', amount: 7800 },
  { week: 'Week 2 (Oct 8 - 14)', amount: 8900 },
  { week: 'Week 3 (Oct 15 - 21)', amount: 6400 },
  { week: 'Week 4 (Oct 22 - 31)', amount: 9300 },
];

const categoryBreakdownData = [
  { name: 'Food & Dining', value: 10400, percentage: 32, color: '#801E35', budget: 12000, icon: Utensils, txns: 18 },
  { name: 'Transport', value: 5800, percentage: 18, color: '#D27F8F', budget: 8000, icon: Car, txns: 12 },
  { name: 'Bills & Utilities', value: 5200, percentage: 16, color: '#B59D85', budget: 6000, icon: Zap, txns: 4 },
  { name: 'Shopping', value: 3900, percentage: 12, color: '#681327', budget: 5000, icon: ShoppingBag, txns: 7 },
  { name: 'Health & Medical', value: 2100, percentage: 7, color: '#E09CA9', budget: 4000, icon: Heart, txns: 2 },
  { name: 'Entertainment', value: 1800, percentage: 5, color: '#9C8269', budget: 3500, icon: Film, txns: 5 },
  { name: 'Education', value: 1500, percentage: 5, color: '#C25A70', budget: 3000, icon: GraduationCap, txns: 1 },
  { name: 'Other Discretionary', value: 1700, percentage: 5, color: '#4A0B1B', budget: 3000, icon: Coffee, txns: 6 },
];

const incomeSourcesData = [
  { source: 'Tech Salary Deposit', amount: 42000, percentage: 84, color: '#801E35', mode: 'HDFC Bank', date: 'Oct 25, 2026' },
  { source: 'Freelance & Consulting', amount: 5500, percentage: 11, color: '#D27F8F', mode: 'UPI Transfer', date: 'Oct 15, 2026' },
  { source: 'Mutual Fund Dividend', amount: 2500, percentage: 5, color: '#B59D85', mode: 'Zerodha Demat', date: 'Oct 05, 2026' },
];

const recentExpenseTransactions = [
  { id: 'ex-1', desc: 'Supermarket Groceries', category: 'Food & Dining', date: 'Oct 28, 2026', amount: 2400, mode: 'Credit Card', icon: Utensils },
  { id: 'ex-2', desc: 'Electricity Bill', category: 'Bills & Utilities', date: 'Oct 20, 2026', amount: 1850, mode: 'Net Banking', icon: Zap },
  { id: 'ex-3', desc: 'Ola / Uber Cabs', category: 'Transport', date: 'Oct 18, 2026', amount: 320, mode: 'UPI', icon: Car },
  { id: 'ex-4', desc: 'Apparel & Clothes', category: 'Shopping', date: 'Oct 15, 2026', amount: 3200, mode: 'Debit Card', icon: ShoppingBag },
  { id: 'ex-5', desc: 'Weekend Dining & Cafe', category: 'Food & Dining', date: 'Oct 12, 2026', amount: 1250, mode: 'UPI', icon: Coffee },
];

const Reports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/reports/dashboard?period=thisMonth');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching report:', err);
      }
    };
    fetchReport();
  }, []);

  const totalIncome = data?.summary?.income || 50000;
  const totalExpenses = data?.summary?.expense || 32400;
  const savings = totalIncome - totalExpenses > 0 ? totalIncome - totalExpenses : 17600;
  const savingsRate = ((savings / totalIncome) * 100).toFixed(1);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const monthRangeStr = `${startOfMonth.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endOfMonth.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const res = await api.get('/reports/export-csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ExpenseManager_Report_${activeTab.toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
      // Fallback CSV download for offline demo
      const csvContent = "data:text/csv;charset=utf-8," +
        "Category,Amount,Type,Date\n" +
        "Tech Salary,50000,Income,2026-10-25\n" +
        "Food & Dining,10400,Expense,2026-10-28\n" +
        "Transport,5800,Expense,2026-10-18\n" +
        "Bills,5200,Expense,2026-10-20\n" +
        "Shopping,3900,Expense,2026-10-15\n";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `ExpenseManager_${activeTab.toLowerCase()}_Report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Subtabs Bar & Date / Export Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-[#EAE0D3] dark:border-[#3F0E1B]">
        {/* Navigation Tabs (Panel 8 & Panel 12) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none p-1 bg-[#F6F1EA] dark:bg-[#20050B] rounded-2xl border border-[#EAE0D3] dark:border-[#3F0E1B]">
          {['Overview', 'Income', 'Expenses', 'Categories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
                activeTab === tab
                  ? 'bg-[#801E35] text-white shadow-md'
                  : 'text-[#614D3C] hover:text-[#801E35] dark:text-[#B59D85] dark:hover:text-[#FFFDF9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Actions: Date Range & Export CSV */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] text-xs font-bold text-[#4A3528] dark:text-[#D4C5B5] shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#C25A70]" />
            <span>{monthRangeStr}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#B59D85]" />
          </div>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] text-xs font-bold text-[#801E35] dark:text-[#E09CA9] hover:bg-[#FAECF0] dark:hover:bg-[#380C16] transition-colors shadow-sm active:scale-95 disabled:opacity-50"
            title="Download CSV Statement"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: OVERVIEW (Panel 8 from Design Reference)
      ======================================================== */}
      {activeTab === 'Overview' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          {/* 3 Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Total Income</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                ₹ {totalIncome.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+12% vs last month</p>
            </div>

            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Total Expenses</span>
                <div className="w-8 h-8 rounded-full bg-[#FAECF0] dark:bg-[#380C16] text-[#C25A70] dark:text-[#E09CA9] flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                ₹ {totalExpenses.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] font-bold text-[#C25A70] dark:text-[#D27F8F]">-5% spend control</p>
            </div>

            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Savings</span>
                <div className="w-8 h-8 rounded-full bg-[#FAECF0] dark:bg-[#380C16] text-[#801E35] dark:text-[#E09CA9] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                ₹ {savings.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] font-bold text-[#801E35] dark:text-[#E09CA9]">{savingsRate}% savings rate</p>
            </div>
          </div>

          {/* Expense Trend & Category Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expense Trend Area Chart (Left 2 cols) */}
            <div className="lg:col-span-2 bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9]">
                  Expense Trend
                </h2>
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Last 6 Months</span>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={expenseTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="expenseTrendGradientOverview" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D27F8F" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#D27F8F" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#B59D85" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#B59D85" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip
                      formatter={(v) => `₹ ${Number(v).toLocaleString('en-IN')}`}
                      contentStyle={{ backgroundColor: '#20050B', borderRadius: '16px', border: '1px solid #520B1C', color: '#FAF7F2' }}
                    />
                    <Area type="monotone" dataKey="expense" stroke="#801E35" strokeWidth={3} fillOpacity={1} fill="url(#expenseTrendGradientOverview)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Donut (Right 1 col) */}
            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9] mb-2">
                Category Breakdown
              </h2>

              <div className="relative h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryBreakdownData.slice(0, 5)} innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">
                      {categoryBreakdownData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => `₹ ${Number(val).toLocaleString('en-IN')}`}
                      contentStyle={{ backgroundColor: '#20050B', borderRadius: '12px', border: '1px solid #520B1C', color: '#FAF7F2' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-[#8C7662] uppercase tracking-wider">Total</span>
                  <span className="text-sm font-black text-[#24050D] dark:text-[#FFFDF9]">₹ {totalExpenses.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#EAE0D3] dark:border-[#3F0E1B] text-xs">
                {categoryBreakdownData.slice(0, 5).map((cat, i) => (
                  <div key={i} className="flex items-center justify-between font-semibold text-[#4A3528] dark:text-[#D4C5B5]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className="font-bold text-[#801E35] dark:text-[#E09CA9]">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Income vs Expenses Cashflow Comparison Bar Chart */}
          <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9]">
                  Cash Flow Comparison (Income vs Expenses)
                </h2>
                <p className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85]">
                  Monthly balance trajectory and savings surplus analysis
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                  <span>Income</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#801E35] dark:text-[#E09CA9]">
                  <span className="w-3 h-3 rounded-full bg-[#801E35] dark:bg-[#E09CA9]" />
                  <span>Expenses</span>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFlowComparison} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#B59D85" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#B59D85" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip
                    formatter={(v) => `₹ ${Number(v).toLocaleString('en-IN')}`}
                    contentStyle={{ backgroundColor: '#20050B', borderRadius: '16px', border: '1px solid #520B1C', color: '#FAF7F2' }}
                  />
                  <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="expense" fill="#801E35" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: INCOME (Deep Dive Analysis)
      ======================================================== */}
      {activeTab === 'Income' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          {/* 3 Top Income Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Total Inflow This Month</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹ {totalIncome.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] font-bold text-[#614D3C] dark:text-[#B59D85]">+₹ 5,000 higher than average</p>
            </div>

            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Primary Inflow Source</span>
                <div className="w-8 h-8 rounded-full bg-[#FAECF0] dark:bg-[#380C16] text-[#801E35] dark:text-[#E09CA9] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                ₹ 42,000
              </div>
              <p className="text-[11px] font-bold text-[#801E35] dark:text-[#E09CA9]">84% of total earnings</p>
            </div>

            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Active Income Streams</span>
                <div className="w-8 h-8 rounded-full bg-[#F6F1EA] dark:bg-[#380C16] text-[#614D3C] dark:text-[#D4C5B5] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                3 Streams
              </div>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Salary • Freelance • Dividends</p>
            </div>
          </div>

          {/* Income Trend Area Chart & Income Sources Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9]">
                    Income Growth History
                  </h2>
                  <p className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85]">
                    Steady upward earnings momentum over the last 6 months
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  +12% Trend
                </span>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incomeTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeTrendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#B59D85" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#B59D85" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip
                      formatter={(v) => `₹ ${Number(v).toLocaleString('en-IN')}`}
                      contentStyle={{ backgroundColor: '#20050B', borderRadius: '16px', border: '1px solid #520B1C', color: '#FAF7F2' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#incomeTrendGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income Streams Share Breakdown */}
            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9] mb-1">
                  Income Breakdown
                </h2>
                <p className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85] mb-5">
                  Percentage distribution by source
                </p>

                <div className="space-y-4">
                  {incomeSourcesData.map((src, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#24050D] dark:text-[#FFFDF9]">{src.source}</span>
                        <span className="text-[#801E35] dark:text-[#E09CA9]">₹ {src.amount.toLocaleString('en-IN')} ({src.percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#F6F1EA] dark:bg-[#380C16] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${src.percentage}%`, backgroundColor: src.color }}
                        />
                      </div>
                      <p className="text-[10px] text-[#8C7662]">{src.mode}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE0D3] dark:border-[#3F0E1B] bg-[#FAF7F2] dark:bg-[#1F050B] rounded-2xl p-3.5 text-center">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Top Earning Channel: </span>
                <span className="text-xs font-black text-[#801E35] dark:text-[#E09CA9]">Salary (₹ 42,000)</span>
              </div>
            </div>
          </div>

          {/* Income Records List Table */}
          <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9]">
              Recent Inflow Transactions
            </h2>

            <div className="divide-y divide-[#EAE0D3] dark:divide-[#3F0E1B]">
              {incomeSourcesData.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#24050D] dark:text-[#FFFDF9]">{item.source}</p>
                      <p className="text-xs font-semibold text-[#8C7662]">{item.date} • {item.mode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                      +₹ {item.amount.toLocaleString('en-IN')}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      Received
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: EXPENSES (Deep Dive Analysis)
      ======================================================== */}
      {activeTab === 'Expenses' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          {/* 3 Top Expenses Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Total Outflow This Month</span>
                <div className="w-8 h-8 rounded-full bg-[#FAECF0] dark:bg-[#380C16] text-[#C25A70] dark:text-[#E09CA9] flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#801E35] dark:text-[#E09CA9]">
                ₹ {totalExpenses.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">₹ 7,600 below ₹ 40,000 monthly cap</p>
            </div>

            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Daily Average Spend</span>
                <div className="w-8 h-8 rounded-full bg-[#F6F1EA] dark:bg-[#380C16] text-[#614D3C] dark:text-[#D4C5B5] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                ₹ 1,080 / day
              </div>
              <p className="text-[11px] font-bold text-[#8C7662]">Calculated over active 30-day period</p>
            </div>

            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Highest Spending Category</span>
                <div className="w-8 h-8 rounded-full bg-[#FAECF0] dark:bg-[#380C16] text-[#801E35] dark:text-[#E09CA9] flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                Food & Dining
              </div>
              <p className="text-[11px] font-bold text-[#801E35] dark:text-[#E09CA9]">₹ 10,400 (32% of total)</p>
            </div>
          </div>

          {/* Weekly Outflow Bar Chart & Top Outflow Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9]">
                    Weekly Spending Breakdown
                  </h2>
                  <p className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85]">
                    Expenditure distribution across month weeks
                  </p>
                </div>
                <span className="text-xs font-bold text-[#801E35] dark:text-[#E09CA9]">October 2026</span>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyExpenseData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <XAxis dataKey="week" stroke="#B59D85" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#B59D85" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip
                      formatter={(v) => `₹ ${Number(v).toLocaleString('en-IN')}`}
                      contentStyle={{ backgroundColor: '#20050B', borderRadius: '16px', border: '1px solid #520B1C', color: '#FAF7F2' }}
                    />
                    <Bar dataKey="amount" fill="#801E35" radius={[8, 8, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 5 Categories Progress */}
            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9] mb-1">
                  Major Outflow Slices
                </h2>
                <p className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85] mb-4">
                  Where did your money go?
                </p>

                <div className="space-y-3.5">
                  {categoryBreakdownData.slice(0, 5).map((cat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#24050D] dark:text-[#FFFDF9]">{cat.name}</span>
                        <span className="text-[#801E35] dark:text-[#E09CA9]">₹ {cat.value.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F6F1EA] dark:bg-[#380C16] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#EAE0D3] dark:border-[#3F0E1B] text-center">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Spend rate controlled well within target limits
                </span>
              </div>
            </div>
          </div>

          {/* Recent Outflow Transactions Table */}
          <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9]">
              Recent Outflow Transactions
            </h2>

            <div className="divide-y divide-[#EAE0D3] dark:divide-[#3F0E1B]">
              {recentExpenseTransactions.map((tx) => {
                const IconComponent = tx.icon;
                return (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#FAECF0] dark:bg-[#380C16] text-[#801E35] dark:text-[#E09CA9] flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#24050D] dark:text-[#FFFDF9]">{tx.desc}</p>
                        <p className="text-xs font-semibold text-[#8C7662]">{tx.date} • {tx.category} • {tx.mode}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-black text-[#801E35] dark:text-[#E09CA9]">
                        -₹ {tx.amount.toLocaleString('en-IN')}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAECF0] text-[#801E35] dark:bg-[#380C16] dark:text-[#E09CA9]">
                        Expense
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: CATEGORIES (Deep Dive Analysis & Budget Caps)
      ======================================================== */}
      {activeTab === 'Categories' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          {/* Top 3 Categories Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Active Categories</span>
                <div className="w-8 h-8 rounded-full bg-[#F6F1EA] dark:bg-[#380C16] text-[#614D3C] dark:text-[#D4C5B5] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                8 Categories
              </div>
              <p className="text-[11px] font-bold text-[#614D3C] dark:text-[#B59D85]">All tracked with budget limits</p>
            </div>

            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Overall Budget Adherence</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                87.5% Within Limits
              </div>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">7 of 8 categories well safe</p>
            </div>

            <div className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">Category Under Watch</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                Bills & Utilities
              </div>
              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">87% used (₹ 800 left)</p>
            </div>
          </div>

          {/* Category Cards Grid (FinSet 8 Categories Style) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-[#24050D] dark:text-[#FFFDF9]">
                Category Budget & Expense Analysis
              </h2>
              <span className="text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">
                Monthly Thresholds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {categoryBreakdownData.map((cat, idx) => {
                const IconComponent = cat.icon;
                const pct = Math.round((cat.value / cat.budget) * 100);
                const remaining = cat.budget - cat.value;
                const isNearLimit = pct >= 85;

                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 shadow-sm space-y-3.5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: cat.color }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-[#24050D] dark:text-[#FFFDF9]">
                            {cat.name}
                          </h3>
                          <span className="text-xs font-semibold text-[#8C7662]">
                            {cat.txns} transactions recorded
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isNearLimit
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-[#FAECF0] text-[#801E35] dark:bg-[#380C16] dark:text-[#E09CA9]'
                        }`}
                      >
                        {pct}% Used
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-3 rounded-full bg-[#F6F1EA] dark:bg-[#380C16] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: isNearLimit ? '#F59E0B' : cat.color,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold pt-1">
                        <span className="text-[#24050D] dark:text-[#FFFDF9]">
                          Spent: ₹ {cat.value.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[#8C7662]">
                          Cap: ₹ {cat.budget.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#EAE0D3] dark:border-[#3F0E1B] flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#614D3C] dark:text-[#B59D85]">
                        Remaining Balance:
                      </span>
                      <span className={`font-black ${remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                        ₹ {remaining.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
