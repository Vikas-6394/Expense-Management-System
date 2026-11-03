import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const AccountModal = ({ isOpen, onClose, onSuccess, editAccount = null }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Bank Account');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [currentBalance, setCurrentBalance] = useState('0');
  const [accountNumberLast4, setAccountNumberLast4] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [isDefault, setIsDefault] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editAccount) {
      setName(editAccount.name || '');
      setType(editAccount.type || 'Bank Account');
      setOpeningBalance(String(editAccount.openingBalance || 0));
      setCurrentBalance(String(editAccount.currentBalance || 0));
      setAccountNumberLast4(editAccount.accountNumberLast4 || '');
      setColor(editAccount.color || '#8b5cf6');
      setIsDefault(Boolean(editAccount.isDefault));
      setNotes(editAccount.notes || '');
    } else {
      setName('');
      setType('Bank Account');
      setOpeningBalance('0');
      setCurrentBalance('0');
      setAccountNumberLast4('');
      setColor('#8b5cf6');
      setIsDefault(false);
      setNotes('');
    }
  }, [editAccount, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an account name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: name.trim(),
        type,
        openingBalance: Number(openingBalance) || 0,
        currentBalance: editAccount ? Number(currentBalance) || 0 : Number(openingBalance) || 0,
        accountNumberLast4: accountNumberLast4.trim(),
        color,
        isDefault,
        notes: notes.trim(),
      };

      if (editAccount) {
        await api.put(`/accounts/${editAccount._id}`, payload);
      } else {
        await api.post('/accounts', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAccount ? 'Edit Account' : 'Add Financial Account'}
      subtitle="Maintain separate records for Cash, Bank accounts, Cards, or UPI"
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
            Account Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. HDFC Salary, Cash in Pocket, GPay"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Account Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Bank Account">Bank Account</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Wallet">Wallet</option>
              <option value="Savings">Savings</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Last 4 Digits
            </label>
            <input
              type="text"
              maxLength={4}
              placeholder="e.g. 3254"
              value={accountNumberLast4}
              onChange={(e) => setAccountNumberLast4(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {editAccount ? 'Current Balance (₹)' : 'Opening Balance (₹)'}
            </label>
            <input
              type="number"
              step="0.01"
              value={editAccount ? currentBalance : openingBalance}
              onChange={(e) =>
                editAccount ? setCurrentBalance(e.target.value) : setOpeningBalance(e.target.value)
              }
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Color Tag
            </label>
            <div className="flex items-center gap-2 pt-1">
              {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#64748b'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-brand-500' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isDefaultAccount"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="isDefaultAccount" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Set as primary default account
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
            className="px-6 py-2.5 rounded-2xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/25 active:scale-95 transition-all"
          >
            {loading ? 'Saving...' : editAccount ? 'Update Account' : 'Create Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AccountModal;
