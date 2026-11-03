import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Modal from '../common/Modal';
import api from '../../services/api';

const ContributeGoalModal = ({ isOpen, onClose, onSuccess, goal }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit'); // 'deposit' or 'withdrawal'
  const [accountId, setAccountId] = useState('');
  const [note, setNote] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !goal) return;

    const loadAccounts = async () => {
      try {
        const res = await api.get('/accounts');
        const list = res.data.accounts || [];
        setAccounts(list);
        if (list.length > 0) setAccountId(list[0]._id);
      } catch (err) {
        console.error(err);
      }
    };

    loadAccounts();
    setAmount('');
    setType('deposit');
    setNote('');
  }, [isOpen, goal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal) return;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please provide a valid contribution amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post(`/goals/${goal._id}/contribute`, {
        amount: numAmount,
        type,
        accountId: accountId || null,
        note: note.trim(),
      });

      // If goal reached 100%, trigger celebratory confetti!
      const updatedGoal = res.data.goal;
      if (updatedGoal.isCompleted) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (!goal) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${type === 'deposit' ? 'Add Deposit to' : 'Withdraw from'} ${goal.name}`}
      subtitle={`Current Saved: ₹${goal.currentAmount} / Target: ₹${goal.targetAmount}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        {/* Toggle Deposit / Withdrawal */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setType('deposit')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              type === 'deposit'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Deposit (+ Funds)
          </button>
          <button
            type="button"
            onClick={() => setType('withdrawal')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              type === 'withdrawal'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Withdraw (- Funds)
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Amount (₹) *
          </label>
          <input
            type="number"
            step="1"
            required
            min="1"
            placeholder="e.g. 5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            {type === 'deposit' ? 'Transfer From Account' : 'Transfer Into Account'}
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">No account link (Manual cash tracker)</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} (Bal: ₹{a.currentBalance})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 mt-1">
            {type === 'deposit'
              ? 'Deducts from available balance without counting as an expense'
              : 'Adds back to your account balance'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Note
          </label>
          <input
            type="text"
            placeholder="e.g. Monthly salary savings portion"
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
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-all ${
              type === 'deposit'
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25'
                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25'
            }`}
          >
            {loading ? 'Processing...' : type === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContributeGoalModal;
