import React, { useState, useEffect } from 'react';
import { Plus, HandCoins, ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, Edit2, Trash2 } from 'lucide-react';
import DebtModal from '../components/debts/DebtModal';
import RepayDebtModal from '../components/debts/RepayDebtModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const Debts = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [debts, setDebts] = useState([]);
  const [summary, setSummary] = useState({ totalOwedToMe: 0, totalIOwe: 0 });
  const [filterType, setFilterType] = useState('all'); // 'all', 'lent', 'borrowed'
  const [loading, setLoading] = useState(true);

  // Modals
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [repayingDebt, setRepayingDebt] = useState(null);

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/debts');
      setDebts(res.data.debts || []);
      setSummary(res.data.summary || { totalOwedToMe: 0, totalIOwe: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this debt record?')) return;
    try {
      await api.delete(`/debts/${id}`);
      fetchDebts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete debt record');
    }
  };

  const filteredDebts = debts.filter((d) => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Loans & Peer Lending
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Privately track money lent to friends or borrowed without confusing everyday income and expenses
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDebt(null);
            setIsDebtModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Record Loan / Lent</span>
        </button>
      </div>

      {/* Debt Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowDownRight className="w-4 h-4" />
              <span>Money Owed to Me (Lent Out)</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(summary.totalOwedToMe, currency)}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 rounded-full">
            Receivable
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
              <span>Money I Owe to Others (Borrowed)</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(summary.totalIOwe, currency)}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 rounded-full">
            Payable
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            filterType === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All ({debts.length})
        </button>
        <button
          onClick={() => setFilterType('lent')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            filterType === 'lent'
              ? 'bg-emerald-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Owed to Me
        </button>
        <button
          onClick={() => setFilterType('borrowed')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            filterType === 'borrowed'
              ? 'bg-rose-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          I Owe
        </button>
      </div>

      {/* Debts Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading records...</div>
      ) : filteredDebts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <HandCoins className="w-10 h-10 text-brand-500 mx-auto" />
          <p className="text-slate-500 text-sm">No lending or borrowing records found.</p>
          <button
            onClick={() => setIsDebtModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold"
          >
            Record First Loan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDebts.map((d) => {
            const isLent = d.type === 'lent';
            const isSettled = d.status === 'settled';

            return (
              <div
                key={d._id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isLent ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {d.personName}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isLent ? 'Lent out (You will receive)' : 'Borrowed (You must pay back)'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingDebt(d);
                          setIsDebtModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Total Original:</span>
                      <p className="font-bold text-slate-800 dark:text-white">
                        {formatCurrency(d.amount, currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Settled So Far:</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(d.settledAmount, currency)}
                      </p>
                    </div>
                  </div>

                  {d.notes && (
                    <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl mt-3">
                      "{d.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400">Remaining</span>
                    <p
                      className={`text-lg font-extrabold ${
                        isSettled
                          ? 'text-slate-400 line-through'
                          : isLent
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {formatCurrency(d.remainingBalance, currency)}
                    </p>
                  </div>

                  {!isSettled ? (
                    <button
                      onClick={() => setRepayingDebt(d)}
                      className="px-4 py-2 rounded-2xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs font-bold transition-colors"
                    >
                      Record Settlement
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Fully Settled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Debt Modal */}
      <DebtModal
        isOpen={isDebtModalOpen}
        onClose={() => {
          setIsDebtModalOpen(false);
          setEditingDebt(null);
        }}
        onSuccess={fetchDebts}
        editDebt={editingDebt}
      />

      {/* Repay Modal */}
      <RepayDebtModal
        isOpen={!!repayingDebt}
        onClose={() => setRepayingDebt(null)}
        onSuccess={fetchDebts}
        debt={repayingDebt}
      />
    </div>
  );
};

export default Debts;
