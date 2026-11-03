import React, { useState, useEffect } from 'react';
import { Zap, Coffee, Bus, Utensils, Fuel, ShoppingBag } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';

const quickChips = [
  { title: 'Coffee / Tea', amount: 30, category: 'Food & Dining', icon: Coffee },
  { title: 'Breakfast', amount: 60, category: 'Food & Dining', icon: Utensils },
  { title: 'Lunch', amount: 120, category: 'Food & Dining', icon: Utensils },
  { title: 'Bus Fare', amount: 40, category: 'Transport', icon: Bus },
  { title: 'Vehicle Fuel', amount: 500, category: 'Transport', icon: Fuel },
  { title: 'Quick Groceries', amount: 250, category: 'Food & Dining', icon: ShoppingBag },
];

const QuickAddModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        const [accRes, catRes] = await Promise.all([
          api.get('/accounts'),
          api.get('/categories?type=expense'),
        ]);
        const accs = accRes.data.accounts || [];
        setAccounts(accs);
        setCategories(catRes.data.categories || catRes.data.data || []);

        if (accs.length > 0) {
          const preferred =
            accs.find((a) => a.type === 'Cash') ||
            accs.find((a) => a.type === 'UPI') ||
            accs[0];
          setAccount(preferred._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [isOpen]);

  const handleChipClick = (chip) => {
    setTitle(chip.title);
    setAmount(String(chip.amount));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!title.trim() || !numAmount || numAmount <= 0) {
      setError('Please provide title and amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let categoryId = null;
      const matched = categories.find((c) =>
        title.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
      );
      if (matched) {
        categoryId = matched._id;
      }

      await api.post('/transactions', {
        title: title.trim(),
        amount: numAmount,
        type: 'expense',
        date: new Date().toISOString(),
        category: categoryId || undefined,
        account: account || undefined,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="1-Tap Quick Expense"
      subtitle="Instantly log routine micro-spends"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-dustypink-50 dark:bg-burgundy-900/40 text-dustypink-700 dark:text-dustypink-300 text-xs font-bold rounded-2xl border border-dustypink-200 text-center">
            {error}
          </div>
        )}

        {/* Quick Presets */}
        <div>
          <span className="block text-xs font-bold text-sand-500 uppercase tracking-wider mb-2">
            Instant Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="p-2.5 rounded-2xl bg-cream-50 dark:bg-[#1E050B] border border-sand-200/80 dark:border-burgundy-900 text-left hover:border-burgundy-500 hover:bg-sand-100 transition-all flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-dustypink-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-burgundy-950 dark:text-cream-100 truncate">
                      {chip.title}
                    </p>
                    <p className="text-[11px] font-black text-dustypink-600">
                      ₹{chip.amount}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Expense Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Morning Coffee"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1E050B] border border-sand-200 dark:border-burgundy-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Amount (₹)
          </label>
          <input
            type="number"
            required
            min="1"
            placeholder="e.g. 20"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1E050B] border border-sand-200 dark:border-burgundy-900 text-sm font-black focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100"
          />
        </div>

        {/* Action Buttons */}
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
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickAddModal;
