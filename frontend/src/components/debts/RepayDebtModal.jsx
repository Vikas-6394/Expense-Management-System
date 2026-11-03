import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const RepayDebtModal = ({ isOpen, onClose, onSuccess, debt }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (debt && isOpen) {
      const remaining = Math.max(0, debt.amount - debt.settledAmount);
      setAmount(String(remaining));
      setNote('');
    }
  }, [debt, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!debt) return;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please provide a valid repayment amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post(`/debts/${debt._id}/repay`, {
        amount: numAmount,
        note: note.trim(),
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record repayment');
    } finally {
      setLoading(false);
    }
  };

  if (!debt) return null;

  const remaining = Math.max(0, debt.amount - debt.settledAmount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Repayment: ${debt.personName}`}
      subtitle={`${debt.type === 'lent' ? 'Money returned by' : 'Payment made to'} ${debt.personName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-slate-500">Remaining Balance:</span>
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            ₹{remaining}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Settlement / Repayment Amount (₹) *
          </label>
          <input
            type="number"
            step="1"
            required
            min="1"
            max={remaining}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Note / Payment Reference
          </label>
          <input
            type="text"
            placeholder="e.g. UPI transfer, Cash handoff"
            value={note}
            onChange={(e) => setNote(e.target.value)}
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
            {loading ? 'Recording...' : 'Record Settlement'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RepayDebtModal;
