import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const BillModal = ({ isOpen, onClose, onSuccess, editBill = null }) => {
  const [name, setName] = useState('');
  const [expectedAmount, setExpectedAmount] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [frequency, setFrequency] = useState('monthly');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [notes, setNotes] = useState('');

  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        const [catRes, accRes] = await Promise.all([
          api.get('/categories?type=expense'),
          api.get('/accounts'),
        ]);
        setCategories(catRes.data.categories || []);
        const accs = accRes.data.accounts || [];
        setAccounts(accs);
        if (accs.length > 0 && !account) {
          setAccount(accs[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();

    if (editBill) {
      setName(editBill.name || '');
      setExpectedAmount(String(editBill.expectedAmount || ''));
      setDueDate(editBill.dueDate ? new Date(editBill.dueDate).toISOString().slice(0, 10) : '');
      setFrequency(editBill.frequency || 'monthly');
      setCategory(editBill.category?._id || editBill.category || '');
      setAccount(editBill.account?._id || editBill.account || '');
      setNotes(editBill.notes || '');
    } else {
      setName('');
      setExpectedAmount('');
      setDueDate(new Date().toISOString().slice(0, 10));
      setFrequency('monthly');
      setCategory('');
      setNotes('');
    }
  }, [editBill, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(expectedAmount);
    if (!name.trim() || !numAmount || numAmount <= 0 || !dueDate) {
      setError('Please provide bill name, amount, and due date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const selectedCat = categories.find((c) => c._id === category);

      const payload = {
        name: name.trim(),
        expectedAmount: numAmount,
        dueDate,
        frequency,
        category: category || null,
        categoryName: selectedCat ? selectedCat.name : 'Utilities',
        account: account || null,
        notes: notes.trim(),
      };

      if (editBill) {
        await api.put(`/bills/${editBill._id}`, payload);
      } else {
        await api.post('/bills', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editBill ? 'Edit Bill Reminder' : 'Add Recurring Bill Reminder'}
      subtitle="Track upcoming electricity, wifi, subscriptions, EMI, and rent"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Bill Provider / Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Airtel Fiber, Electricity Board, Netflix"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Expected Amount (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="0.01"
              placeholder="0.00"
              value={expectedAmount}
              onChange={(e) => setExpectedAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Due Date *
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Recurrence
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="daily">Daily</option>
              <option value="once">Once (Non-recurring)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Default (Utilities)</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Default Payment Account
          </label>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">None specified</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} (Bal: ₹{a.currentBalance})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Notes / Account Number
          </label>
          <input
            type="text"
            placeholder="e.g. Account No: 12093848, Meter ID: 442"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/25 active:scale-95 transition-all"
          >
            {loading ? 'Saving...' : editBill ? 'Update Bill' : 'Save Bill'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BillModal;
