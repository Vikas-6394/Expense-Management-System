import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const GoalModal = ({ isOpen, onClose, onSuccess, editGoal = null }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState('#801E35');
  const [icon, setIcon] = useState('Target');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name || '');
      setTargetAmount(String(editGoal.targetAmount || ''));
      setCurrentAmount(String(editGoal.currentAmount || 0));
      setTargetDate(editGoal.targetDate ? new Date(editGoal.targetDate).toISOString().slice(0, 10) : '');
      setColor(editGoal.color || '#801E35');
      setIcon(editGoal.icon || 'Target');
      setNotes(editGoal.notes || '');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setTargetDate('');
      setColor('#801E35');
      setIcon('Target');
      setNotes('');
    }
  }, [editGoal, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numTarget = Number(targetAmount);
    if (!name.trim() || !numTarget || numTarget <= 0) {
      setError('Please provide goal name and valid target amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: name.trim(),
        targetAmount: numTarget,
        currentAmount: Number(currentAmount) || 0,
        targetDate: targetDate || null,
        color,
        icon,
        notes: notes.trim(),
      };

      if (editGoal) {
        await api.put(`/goals/${editGoal._id}`, payload);
      } else {
        await api.post('/goals', payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editGoal ? 'Edit Goal' : 'Create Financial Goal'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-dustypink-50 dark:bg-burgundy-900/40 text-dustypink-700 dark:text-dustypink-300 text-xs font-bold rounded-2xl border border-dustypink-200 text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Goal Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Buy a Laptop"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1E050B] border border-sand-200 dark:border-burgundy-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
              Target (₹)
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="60000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1E050B] border border-sand-200 dark:border-burgundy-900 text-sm font-black focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
              Initial Saved (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="40000"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1E050B] border border-sand-200 dark:border-burgundy-900 text-sm font-black focus:outline-none focus:ring-2 focus:ring-burgundy-600 text-burgundy-950 dark:text-cream-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-burgundy-900 dark:text-cream-200 uppercase tracking-wider mb-1.5">
            Color Accent
          </label>
          <div className="flex items-center gap-3">
            {['#801E35', '#D27F8F', '#B59D85', '#681327', '#46372B'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full border-2 transition-transform"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? '#FAF7F2' : 'transparent',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-sand-700 hover:bg-sand-100 dark:text-sand-300 dark:hover:bg-burgundy-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editGoal ? 'Update Goal' : 'Save Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalModal;
