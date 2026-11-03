import React, { useState, useEffect } from 'react';
import { Plus, CalendarClock, CheckCircle2, AlertCircle, Clock, Edit2, Trash2 } from 'lucide-react';
import BillModal from '../components/bills/BillModal';
import PayBillModal from '../components/bills/PayBillModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const Bills = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [statusFilter, setStatusFilter] = useState('unpaid');
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [payingBill, setPayingBill] = useState(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bills${statusFilter ? `?status=${statusFilter}` : ''}`);
      setBills(res.data.bills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bill reminder?')) return;
    try {
      await api.delete(`/bills/${id}`);
      fetchBills();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete bill');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Recurring Bills & Reminders
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stay on top of electricity, rent, wifi, EMI, insurance, and recharge deadlines
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Tabs */}
          <div className="flex p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold shadow-sm">
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                statusFilter === 'unpaid'
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Upcoming Due
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                statusFilter === 'paid'
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Paid Archive
            </button>
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                statusFilter === ''
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          <button
            onClick={() => {
              setEditingBill(null);
              setIsBillModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bill</span>
          </button>
        </div>
      </div>

      {/* Bills Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading bills...</div>
      ) : bills.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <CalendarClock className="w-10 h-10 text-brand-500 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">
            {statusFilter === 'unpaid'
              ? 'No upcoming bills due right now! All caught up.'
              : 'No bill records found.'}
          </p>
          <button
            onClick={() => setIsBillModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold"
          >
            Create Bill Reminder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill) => {
            return (
              <div
                key={bill._id}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-200 ${
                  bill.isOverdue
                    ? 'border-rose-300 dark:border-rose-900/60 ring-2 ring-rose-500/10'
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {bill.name}
                      </h3>
                      <p className="text-xs text-slate-400 capitalize">
                        {bill.frequency} recurrence • {bill.categoryName || 'Utilities'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingBill(bill);
                          setIsBillModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bill._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {bill.isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid on {formatDate(bill.paidAt || bill.dueDate)}
                      </span>
                    ) : bill.isOverdue ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5" /> Overdue since {formatDate(bill.dueDate)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" /> Due {formatDate(bill.dueDate)} ({bill.daysUntilDue} days left)
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400">Amount Due</span>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(bill.expectedAmount, currency)}
                    </p>
                  </div>

                  {!bill.isPaid && (
                    <button
                      onClick={() => setPayingBill(bill)}
                      className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bill Modals */}
      <BillModal
        isOpen={isBillModalOpen}
        onClose={() => {
          setIsBillModalOpen(false);
          setEditingBill(null);
        }}
        onSuccess={fetchBills}
        editBill={editingBill}
      />

      <PayBillModal
        isOpen={!!payingBill}
        onClose={() => setPayingBill(null)}
        onSuccess={fetchBills}
        bill={payingBill}
      />
    </div>
  );
};

export default Bills;
