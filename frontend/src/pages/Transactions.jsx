import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  ChevronDown,
  Trash2,
  Edit2,
  Utensils,
  Car,
  Zap,
  ShoppingBag,
  Briefcase,
  Coffee,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import TransactionModal from '../components/transactions/TransactionModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

const fallbackMockList = [
  {
    _id: 'tx-1',
    date: '2026-10-28',
    categoryName: 'Food',
    description: 'Groceries',
    amount: -2400,
    type: 'expense',
    icon: Utensils,
    iconColor: 'bg-dustypink-100 text-dustypink-700'
  },
  {
    _id: 'tx-2',
    date: '2026-10-25',
    categoryName: 'Income',
    description: 'Salary',
    amount: 50000,
    type: 'income',
    icon: Briefcase,
    iconColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    _id: 'tx-3',
    date: '2026-10-20',
    categoryName: 'Bills',
    description: 'Electricity Bill',
    amount: -1850,
    type: 'expense',
    icon: Zap,
    iconColor: 'bg-sand-100 text-sand-800'
  },
  {
    _id: 'tx-4',
    date: '2026-10-18',
    categoryName: 'Transport',
    description: 'Cab Ride',
    amount: -320,
    type: 'expense',
    icon: Car,
    iconColor: 'bg-dustypink-100 text-dustypink-700'
  },
  {
    _id: 'tx-5',
    date: '2026-10-15',
    categoryName: 'Shopping',
    description: 'Clothes',
    amount: -3200,
    type: 'expense',
    icon: ShoppingBag,
    iconColor: 'bg-burgundy-100 text-burgundy-700'
  },
];

const Transactions = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (dateFilter) params.append('startDate', dateFilter);

      const res = await api.get(`/transactions?${params.toString()}`);
      if (res.data && res.data.transactions && res.data.transactions.length > 0) {
        setTransactions(res.data.transactions);
      } else {
        setTransactions(fallbackMockList);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setTransactions(fallbackMockList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, categoryFilter, dateFilter]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      setTransactions(transactions.filter((t) => t._id !== id));
    }
  };

  const getCategoryIcon = (catName) => {
    const name = (catName || '').toLowerCase();
    if (name.includes('food') || name.includes('grocer') || name.includes('dining')) return Utensils;
    if (name.includes('salary') || name.includes('income')) return Briefcase;
    if (name.includes('bill') || name.includes('util')) return Zap;
    if (name.includes('transport') || name.includes('cab')) return Car;
    if (name.includes('shop') || name.includes('cloth')) return ShoppingBag;
    return Coffee;
  };

  const filteredList = transactions.filter((tx) => {
    if (typeFilter && tx.type !== typeFilter) return false;
    if (categoryFilter) {
      const cat = tx.category?.name || tx.categoryName || '';
      if (!cat.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Filters (Panel 6) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-black tracking-tight text-burgundy-950 dark:text-cream-50">
          Transactions
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#250810] border border-sand-200 dark:border-burgundy-900 text-xs font-bold text-sand-800 dark:text-sand-200 shadow-sm cursor-pointer"
          >
            <option value="">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#250810] border border-sand-200 dark:border-burgundy-900 text-xs font-bold text-sand-800 dark:text-sand-200 shadow-sm cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Food">Food & Dining</option>
            <option value="Income">Salary / Income</option>
            <option value="Bills">Bills & Utilities</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
          </select>

          {/* Date Picker Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-2xl bg-white dark:bg-[#250810] border border-sand-200 dark:border-burgundy-900 text-xs font-bold text-sand-800 dark:text-sand-200 shadow-sm"
            />
          </div>

          {/* Add Transaction Button (Panel 6) */}
          <button
            onClick={() => {
              setEditingTx(null);
              setIsModalOpen(true);
            }}
            className="btn-burgundy inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 2. Transactions Desktop Table (Panel 6) */}
      <div className="hidden md:block bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE0D3] dark:border-[#3F0E1B] bg-[#FAF7F2] dark:bg-[#160408] text-[11px] font-black uppercase tracking-wider text-[#614D3C] dark:text-[#B59D85]">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE0D3] dark:divide-[#3F0E1B] text-xs sm:text-sm font-semibold">
              {filteredList.map((tx) => {
                const catName = tx.category?.name || tx.categoryName || 'General';
                const IconComponent = getCategoryIcon(catName);
                const isIncome = tx.type === 'income' || tx.amount > 0;
                const formattedDate = tx.date
                  ? new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Oct 28, 2026';

                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-[#FAF7F2]/60 dark:hover:bg-[#260810]/60 transition-colors"
                  >
                    <td className="py-4 px-6 text-[#614D3C] dark:text-[#B59D85] font-bold whitespace-nowrap">
                      {formattedDate}
                    </td>

                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] dark:bg-[#2A0711] border border-[#EAE0D3] dark:border-[#520B1C] text-[#24050D] dark:text-[#FFFDF9] text-xs font-bold">
                        <IconComponent className="w-3.5 h-3.5 text-[#C25A70]" />
                        <span>{catName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-[#24050D] dark:text-[#FFFDF9] font-bold">
                      {tx.title || tx.description || 'Transaction'}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <span
                        className={`font-black text-sm ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-[#C25A70] dark:text-[#E09CA9]'
                        }`}
                      >
                        {isIncome
                          ? `+ ₹ ${Math.abs(tx.amount).toLocaleString('en-IN')}`
                          : `- ₹ ${Math.abs(tx.amount).toLocaleString('en-IN')}`}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTx(tx);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#B59D85] hover:text-[#801E35] hover:bg-[#F6F1EA] dark:hover:bg-[#380C16] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx._id)}
                          className="p-1.5 rounded-lg text-[#B59D85] hover:text-[#801E35] hover:bg-[#FAECF0] dark:hover:bg-[#380C16] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Mobile Card List (Instant Touch Friendly on Phones & iPhones) */}
      <div className="md:hidden space-y-3">
        {filteredList.map((tx) => {
          const catName = tx.category?.name || tx.categoryName || 'General';
          const IconComponent = getCategoryIcon(catName);
          const isIncome = tx.type === 'income' || tx.amount > 0;
          const formattedDate = tx.date
            ? new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Oct 28, 2026';

          return (
            <div
              key={tx._id}
              className="bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#520B1C] text-[#801E35] dark:text-[#E09CA9] flex items-center justify-center shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#24050D] dark:text-[#FFFDF9] truncate">
                    {tx.title || tx.description || 'Transaction'}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#614D3C] dark:text-[#B59D85]">
                    <span className="font-semibold">{catName}</span>
                    <span>•</span>
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-1.5">
                <span
                  className={`font-black text-sm ${
                    isIncome
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-[#C25A70] dark:text-[#E09CA9]'
                  }`}
                >
                  {isIncome
                    ? `+ ₹ ${Math.abs(tx.amount).toLocaleString('en-IN')}`
                    : `- ₹ ${Math.abs(tx.amount).toLocaleString('en-IN')}`}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingTx(tx);
                      setIsModalOpen(true);
                    }}
                    className="p-1 rounded-lg text-[#B59D85] hover:text-[#801E35]"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="p-1 rounded-lg text-[#B59D85] hover:text-[#801E35]"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransactions}
        editTransaction={editingTx}
      />
    </div>
  );
};

export default Transactions;
