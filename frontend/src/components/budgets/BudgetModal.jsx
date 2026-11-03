import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const BudgetModal = ({ isOpen, onClose, onSuccess, editBudget = null }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const loadCategories = async () => {
      try {
        const res = await api.get('/categories?type=expense');
        const list = res.data.categories || res.data.data || [
          { _id: 'c-1', name: 'Food & Dining' },
          { _id: 'c-2', name: 'Transport' },
          { _id: 'c-3', name: 'Bills & Utilities' },
          { _id: 'c-4', name: 'Shopping' },
        ];
        setCategories(list);
      } catch (err) {
        setCategories([
          { _id: 'c-1', name: 'Food & Dining' },
          { _id: 'c-2', name: 'Transport' },
          { _id: 'c-3', name: 'Bills & Utilities' },
          { _id: 'c-4', name: 'Shopping' },
        ]);
      }
    };

    loadCategories();

    if (editBudget) {
      setCategory(editBudget.category?._id || editBudget.category || '');
      setAmount(String(editBudget.amount || ''));
      setMonth(editBudget.month || new Date().getMonth() + 1);
      setYear(editBudget.year || new Date().getFullYear());
    } else {
      setCategory('');
      setAmount('');
      setMonth(new Date().getMonth() + 1);
      setYear(new Date().getFullYear());
    }
  }, [isOpen, editBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please provide a valid budget limit');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        category: category || null,
        amount: numAmount,
        month: Number(month),
        year: Number(year),
      };

      if (editBudget) {
        await api.put(`/budgets/${editBudget._id}`, payload);
      } else {
        await api.post('/budgets', payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editBudget ? 'Edit Budget' : 'Create Budget'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-dustypink-50 dark:bg-burgundy-900/40 text-dustypink-700 dark:text-dustypink-300 text-xs font-bold rounded-2xl border border-dustypink-200 text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1E050B] border border-sand-200 dark:border-burgundy-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100"
          >
            <option value="">Overall Budget (All Categories)</option>
            {categories.map((c) => (
              <option key={c._id || c.name} value={c._id || c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Monthly Limit (₹)
          </label>
          <input
            type="number"
            required
            min="1"
            placeholder="e.g. 12000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1E050B] border border-sand-200 dark:border-burgundy-900 text-sm font-black focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-sand px-5 py-2.5 rounded-2xl text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-burgundy px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editBudget ? 'Update Budget' : 'Save Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;
