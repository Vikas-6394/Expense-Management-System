import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const DebtModal = ({ isOpen, onClose, onSuccess, editDebt = null }) => {
  const [type, setType] = useState('lent'); // 'lent' (owed to me) or 'borrowed' (I owe)
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editDebt) {
      setType(editDebt.type || 'lent');
      setPersonName(editDebt.personName || '');
      setAmount(String(editDebt.amount || ''));
      setDate(editDebt.date ? new Date(editDebt.date).toISOString().slice(0, 10) : '');
      setDueDate(editDebt.dueDate ? new Date(editDebt.dueDate).toISOString().slice(0, 10) : '');
      setNotes(editDebt.notes || '');
    } else {
      setType('lent');
      setPersonName('');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
      setDueDate('');
      setNotes('');
    }
  }, [editDebt, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!personName.trim() || !numAmount || numAmount <= 0) {
      setError('Please provide person name and valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        type,
        personName: personName.trim(),
        amount: numAmount,
        date,
        dueDate: dueDate || null,
        notes: notes.trim(),
      };

      if (editDebt) {
        await api.put(`/debts/${editDebt._id}`, payload);
      } else {
        await api.post('/debts', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save loan record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editDebt ? 'Edit Debt Record' : 'Record Money Lent or Borrowed'}
      subtitle="Keep private tabs on peer lending and borrowing without polluting income/expense totals"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        {/* Lent vs Borrowed selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setType('lent')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              type === 'lent'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Money Lent (Owed to Me)
          </button>
          <button
            type="button"
            onClick={() => setType('borrowed')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              type === 'borrowed'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Money Borrowed (I Owe)
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Person / Entity Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rohan Sharma, Amit Verma"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Total Amount (₹) *
          </label>
          <input
            type="number"
            step="1"
            required
            min="1"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Date Given/Received
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Expected Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Notes / Purpose
          </label>
          <input
            type="text"
            placeholder="e.g. Shared group vacation tickets, medical loan"
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
            {loading ? 'Saving...' : editDebt ? 'Update Record' : 'Save Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DebtModal;
