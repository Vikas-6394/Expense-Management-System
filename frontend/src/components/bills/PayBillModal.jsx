import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const PayBillModal = ({ isOpen, onClose, onSuccess, bill }) => {
  const [paidAmount, setPaidAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [createExpenseRecord, setCreateExpenseRecord] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bill || !isOpen) return;
    setPaidAmount(String(bill.expectedAmount || ''));

    const loadAccounts = async () => {
      try {
        const res = await api.get('/accounts');
        const list = res.data.accounts || [];
        setAccounts(list);
        if (bill.account) {
          setAccountId(bill.account._id || bill.account);
        } else if (list.length > 0) {
          setAccountId(list[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadAccounts();
  }, [bill, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bill) return;

    const numAmount = Number(paidAmount);
    if (!numAmount || numAmount <= 0) {
      setError('Please provide a valid paid amount');
      return;
    }
    if (createExpenseRecord && !accountId) {
      setError('Please select an account to pay from');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post(`/bills/${bill._id}/pay`, {
        paidAmount: numAmount,
        accountId,
        paymentMethod,
        createExpenseRecord,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark bill as paid');
    } finally {
      setLoading(false);
    }
  };

  if (!bill) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pay Bill: ${bill.name}`}
      subtitle="Mark this bill as settled and record the expense entry"
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
            Amount Paid (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Pay From Account *
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} (Bal: ₹{a.currentBalance})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Net Banking / Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Wallet">Wallet</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="createTxCheck"
            checked={createExpenseRecord}
            onChange={(e) => setCreateExpenseRecord(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="createTxCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Automatically create an expense transaction & deduct account balance
          </label>
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
            className="px-6 py-2.5 rounded-2xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
          >
            {loading ? 'Recording...' : 'Confirm Paid'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PayBillModal;
