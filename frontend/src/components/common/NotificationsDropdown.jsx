import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-dustypink-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-burgundy-600 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-white dark:bg-[#250810] border border-sand-200 dark:border-burgundy-900 flex items-center justify-center text-sand-700 dark:text-sand-300 hover:text-burgundy-600 hover:border-burgundy-400 transition-colors shadow-sm"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-burgundy-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#250810]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#250810] border border-sand-200/90 dark:border-burgundy-900 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-4 border-b border-sand-100 dark:border-burgundy-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-burgundy-950 dark:text-cream-50">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-xs bg-dustypink-100 text-dustypink-800 dark:bg-burgundy-900/60 dark:text-dustypink-300 px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-burgundy-600 hover:text-burgundy-700 dark:text-dustypink-400 flex items-center gap-1 font-bold"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-sand-100 dark:divide-burgundy-900/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sand-400 text-sm">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && handleMarkRead(n._id)}
                  className={`p-4 transition-colors cursor-pointer flex gap-3 ${
                    n.isRead
                      ? 'bg-transparent'
                      : 'bg-sand-50/60 dark:bg-burgundy-950/40 hover:bg-sand-100/60'
                  }`}
                >
                  {getIcon(n.type)}
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-burgundy-950 dark:text-cream-100">
                      {n.title}
                    </h5>
                    <p className="text-xs text-sand-600 dark:text-sand-400 mt-0.5">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
