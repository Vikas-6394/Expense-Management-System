import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const TripModal = ({ isOpen, onClose, onSuccess, editTrip = null }) => {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [budget, setBudget] = useState('0');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editTrip) {
      setName(editTrip.name || '');
      setDestination(editTrip.destination || '');
      setStartDate(editTrip.startDate ? new Date(editTrip.startDate).toISOString().slice(0, 10) : '');
      setEndDate(editTrip.endDate ? new Date(editTrip.endDate).toISOString().slice(0, 10) : '');
      setBudget(String(editTrip.budget || 0));
      setPurpose(editTrip.purpose || '');
      setNotes(editTrip.notes || '');
      setStatus(editTrip.status || 'ongoing');
    } else {
      setName('');
      setDestination('');
      setStartDate(new Date().toISOString().slice(0, 10));
      const d = new Date();
      d.setDate(d.getDate() + 3);
      setEndDate(d.toISOString().slice(0, 10));
      setBudget('0');
      setPurpose('');
      setNotes('');
      setStatus('ongoing');
    }
  }, [editTrip, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !destination.trim() || !startDate || !endDate) {
      setError('Please provide trip name, destination, and dates');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: name.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        budget: Number(budget) || 0,
        purpose: purpose.trim(),
        notes: notes.trim(),
        status,
      };

      if (editTrip) {
        await api.put(`/trips/${editTrip._id}`, payload);
      } else {
        await api.post('/trips', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTrip ? 'Edit Trip' : 'Plan Trip or Outing'}
      subtitle="Track travel spending, places visited, and daily averages"
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
            Trip Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Lucknow Visit, Goa Beach Vacation"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Destination / Location *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Lucknow, Goa, Manali, Dubai"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Start Date *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              End Date *
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Planned Budget (₹)
            </label>
            <input
              type="number"
              step="100"
              placeholder="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ongoing">Ongoing</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Purpose / Objective
          </label>
          <input
            type="text"
            placeholder="e.g. Wedding attendance, Client meeting, Family vacation"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Hotel booked, tickets reserved"
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
            {loading ? 'Saving...' : editTrip ? 'Update Trip' : 'Create Trip'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TripModal;
