import React, { useState, useEffect } from 'react';
import { Plus, ArrowRightLeft, Wallet, Building2, Smartphone, CreditCard, Edit2, Trash2 } from 'lucide-react';
import AccountModal from '../components/accounts/AccountModal';
import TransferModal from '../components/accounts/TransferModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

const Accounts = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/accounts');
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      await api.delete(`/accounts/${id}`);
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'Bank Account':
        return <Building2 className="w-5 h-5" />;
      case 'Cash':
        return <Wallet className="w-5 h-5" />;
      case 'UPI':
        return <Smartphone className="w-5 h-5" />;
      case 'Credit Card':
      case 'Debit Card':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Wallets & Accounts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain accounts, track opening vs current balances, and execute internal transfers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4 text-brand-500" />
            <span>Transfer Funds</span>
          </button>

          <button
            onClick={() => {
              setEditingAccount(null);
              setIsAccountModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Total Liquidity Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xl shadow-brand-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-100">
            Total Net Balance (All Accounts)
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            {formatCurrency(totalBalance, currency)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-brand-200">Active Accounts:</span>
          <p className="text-xl font-bold">{accounts.length}</p>
        </div>
      </div>

      {/* Accounts Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <p className="text-slate-500 text-sm">No accounts found. Create your primary wallet or bank account.</p>
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold"
          >
            Add First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accounts.map((acc) => (
            <div
              key={acc._id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: acc.color || '#8b1e2d' }}
                  >
                    {getAccountIcon(acc.type)}
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditingAccount(acc);
                        setIsAccountModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(acc._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                      {acc.name}
                    </h3>
                    {acc.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 text-[10px] font-bold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {acc.type} {acc.accountNumberLast4 ? `• **** ${acc.accountNumberLast4}` : ''}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400">Current Balance</span>
                  <p
                    className={`text-xl font-extrabold ${
                      acc.currentBalance < 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {formatCurrency(acc.currentBalance, currency)}
                  </p>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <span>Opening:</span>
                  <p className="font-semibold text-slate-600 dark:text-slate-400">
                    {formatCurrency(acc.openingBalance, currency)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
          setEditingAccount(null);
        }}
        onSuccess={fetchAccounts}
        editAccount={editingAccount}
      />

      {/* Transfer Modal */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={fetchAccounts}
      />
    </div>
  );
};

export default Accounts;
