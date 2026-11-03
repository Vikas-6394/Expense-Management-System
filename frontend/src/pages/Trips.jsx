import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Compass, ArrowUpRight, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import TripModal from '../components/trips/TripModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const Trips = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      setTrips(res.data.trips || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleSelectTrip = async (tripId) => {
    try {
      const res = await api.get(`/trips/${tripId}`);
      setSelectedTripDetails(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip? Associated transactions will be unlinked.')) return;
    try {
      await api.delete(`/trips/${id}`);
      if (selectedTripDetails?.trip?._id === id) setSelectedTripDetails(null);
      fetchTrips();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete trip');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Trips & Places
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize travel budgets, itinerary expenses, places visited, and daily averages
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTrip(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Plan Trip</span>
        </button>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Compass className="w-10 h-10 text-brand-500 mx-auto" />
          <p className="text-slate-500 text-sm">No trips logged yet. Plan a trip or outing to track travel expenses.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold"
          >
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((t) => (
            <div
              key={t._id}
              onClick={() => handleSelectTrip(t._id)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                        {t.name}
                      </h3>
                      <p className="text-xs text-slate-400">{t.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditingTrip(t);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 py-2 border-y border-slate-100 dark:border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(t.startDate)} - {formatDate(t.endDate)}
                  </span>
                  <span>•</span>
                  <span>{t.durationDays} days</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Spent:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {formatCurrency(t.totalSpent, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Daily Average:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {formatCurrency(t.dailyAverage, currency)}/day
                  </span>
                </div>
                {t.budget > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Remaining Budget:</span>
                    <span
                      className={`font-bold ${
                        t.remainingBudget < 0 ? 'text-rose-500' : 'text-emerald-500'
                      }`}
                    >
                      {formatCurrency(t.remainingBudget, currency)}
                    </span>
                  </div>
                )}
                <div className="pt-2 flex items-center justify-between text-[11px] text-brand-600 dark:text-brand-400 font-semibold">
                  <span>{t.placesCount} places recorded</span>
                  <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    View breakdown &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trip Details Modal / Drawer */}
      {selectedTripDetails && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs uppercase font-bold text-brand-600">Trip Breakdown</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {selectedTripDetails.trip.name} ({selectedTripDetails.trip.destination})
              </h2>
            </div>
            <button
              onClick={() => setSelectedTripDetails(null)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category breakdown */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Expense by Category
              </h3>
              <div className="space-y-2">
                {Object.entries(selectedTripDetails.categoryBreakdown || {}).map(([cat, amt]) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{cat}</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(amt, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Places breakdown */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Spending by Place / Location
              </h3>
              <div className="space-y-2">
                {Object.entries(selectedTripDetails.placeBreakdown || {}).length === 0 ? (
                  <p className="text-xs text-slate-400">No specific places recorded for this trip.</p>
                ) : (
                  Object.entries(selectedTripDetails.placeBreakdown).map(([plc, amt]) => (
                    <div
                      key={plc}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs"
                    >
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{plc}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(amt, currency)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip Modal */}
      <TripModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrip(null);
        }}
        onSuccess={fetchTrips}
        editTrip={editingTrip}
      />
    </div>
  );
};

export default Trips;
