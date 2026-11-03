import React, { useState, useEffect } from 'react';
import { Upload, X, ArrowDownRight, ArrowUpRight, Plus, Calendar, Tag, FileText } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';

const TransactionModal = ({ isOpen, onClose, onSuccess, editTransaction = null }) => {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [account, setAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load dropdown resources
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        const [catRes, accRes] = await Promise.all([
          api.get('/categories'),
          api.get('/accounts'),
        ]);

        const allCats = catRes.data.categories || catRes.data.data || [
          { _id: 'cat-1', name: 'Food & Dining', type: 'expense' },
          { _id: 'cat-2', name: 'Transport', type: 'expense' },
          { _id: 'cat-3', name: 'Bills & Utilities', type: 'expense' },
          { _id: 'cat-4', name: 'Shopping', type: 'expense' },
          { _id: 'cat-5', name: 'Salary', type: 'income' },
          { _id: 'cat-6', name: 'Freelance', type: 'income' },
        ];
        setCategories(allCats);

        const allAccs = accRes.data.accounts || [
          { _id: 'acc-1', name: 'Bank Account' },
          { _id: 'acc-2', name: 'Cash Wallet' },
        ];
        setAccounts(allAccs);

        if (allAccs.length > 0 && !account) {
          setAccount(allAccs[0]._id);
        }

        if (editTransaction) {
          setType(editTransaction.type || 'expense');
          setTitle(editTransaction.title || '');
          setAmount(editTransaction.amount ? String(Math.abs(editTransaction.amount)) : '');
          setDate(editTransaction.date ? new Date(editTransaction.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
          setCategory(editTransaction.category?._id || editTransaction.category || '');
          setNotes(editTransaction.notes || '');
          setAccount(editTransaction.account?._id || editTransaction.account || (allAccs[0]?._id || ''));
        } else {
          setTitle('');
          setAmount('');
          setNotes('');
        }
      } catch (err) {
        console.error('Error loading modal resources:', err);
      }
    };

    loadData();
  }, [isOpen, editTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please provide a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      title: title.trim() || (type === 'income' ? 'Income' : 'Expense'),
      amount: Number(amount),
      type,
      date,
      category: category || undefined,
      notes: notes.trim() || undefined,
      account: account || undefined,
    };

    try {
      if (editTransaction?._id) {
        await api.put(`/transactions/${editTransaction._id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => !c.type || c.type === type);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTransaction ? 'Edit Transaction' : 'Add Transaction'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-dustypink-50 dark:bg-burgundy-900/40 text-dustypink-700 dark:text-dustypink-300 text-xs font-bold rounded-2xl border border-dustypink-200 dark:border-burgundy-800 text-center">
            {error}
          </div>
        )}

        {/* 1. Toggle Tabs: Income vs Expense (Panel 5 in Mockup) */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-sand-100 dark:bg-[#1E050B] border border-sand-200 dark:border-burgundy-900">
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('');
            }}
            className={`py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-sand-700 dark:text-sand-300 hover:text-burgundy-950'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Income</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
            className={`py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              type === 'expense'
                ? 'bg-dustypink-600 text-white shadow-sm'
                : 'text-sand-700 dark:text-sand-300 hover:text-burgundy-950'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Expense</span>
          </button>
        </div>

        {/* 2. Amount Input (Panel 5) */}
        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-lg font-black text-sand-500">
              ₹
            </span>
            <input
              type="number"
              required
              step="any"
              min="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1F050B] border border-sand-200 dark:border-burgundy-900 text-base font-black focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100"
            />
          </div>
        </div>

        {/* 3. Category Dropdown (Panel 5) */}
        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1F050B] border border-sand-200 dark:border-burgundy-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100 cursor-pointer"
          >
            <option value="">Select category</option>
            {filteredCategories.map((c) => (
              <option key={c._id || c.name} value={c._id || c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Date Picker (Panel 5) */}
        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-sand-500 pointer-events-none" />
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1F050B] border border-sand-200 dark:border-burgundy-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100"
            />
          </div>
        </div>

        {/* 5. Note (Optional) (Panel 5) */}
        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Note (Optional)
          </label>
          <input
            type="text"
            placeholder="Add a note..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1F050B] border border-sand-200 dark:border-burgundy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100 placeholder:text-sand-400"
          />
        </div>

        {/* 6. Action Buttons (Cancel / Add Transaction) (Panel 5) */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-sand px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-burgundy px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-[#801E35]/25 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editTransaction ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
