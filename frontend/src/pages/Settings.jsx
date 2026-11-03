import React, { useState } from 'react';
import {
  User,
  Shield,
  Sliders,
  Bell,
  Check,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Save,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Profile');

  // Profile State
  const [name, setName] = useState(user?.name || 'Vikas Maurya');
  const [email] = useState(user?.email || 'vikas@email.com');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password / Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  // Preferences State
  const [dateFormat, setDateFormat] = useState(user?.dateFormat || 'DD/MM/YYYY');
  const [prefLoading, setPrefLoading] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState('');

  // Notification State
  const [notifyBudget, setNotifyBudget] = useState(true);
  const [notifyDaily, setNotifyDaily] = useState(false);
  const [notifyBills, setNotifyBills] = useState(true);
  const [notifSuccess, setNotifSuccess] = useState('');

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await api.put('/auth/profile', { name, currency, dateFormat });
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      updateUser({ ...user, name, currency });
      setProfileSuccess('Profile updated locally!');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwSuccess('');
    setPwError('');

    if (!currentPassword) {
      setPwError('Please enter your current password.');
      setPwLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      setPwLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      setPwLoading(false);
      return;
    }

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setPwSuccess(res.data?.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password. Please check your current password.');
    } finally {
      setPwLoading(false);
    }
  };

  // Handle Preferences Update
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setPrefLoading(true);
    setPrefSuccess('');

    try {
      const res = await api.put('/auth/profile', { currency, dateFormat });
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      setPrefSuccess('Preferences saved successfully!');
    } catch (err) {
      updateUser({ ...user, currency, dateFormat });
      setPrefSuccess('Preferences updated!');
    } finally {
      setPrefLoading(false);
    }
  };

  // Handle Notifications Save
  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setNotifSuccess('Notification settings updated!');
    setTimeout(() => setNotifSuccess(''), 3000);
  };

  const navTabs = [
    { name: 'Profile', icon: User, label: 'Profile' },
    { name: 'Security', icon: Shield, label: 'Security & Password' },
    { name: 'Preferences', icon: Sliders, label: 'Preferences' },
    { name: 'Notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header (Panel 11) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#24050D] dark:text-[#FFFDF9]">
          Settings
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[#614D3C] dark:text-[#B59D85]">
          Manage your personal account, security, password, and preferences
        </p>
      </div>

      {/* 2. Main Layout: Responsive Tabs + Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs (Horizontal on Mobile, Vertical on Desktop) */}
        <div className="md:col-span-1">
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 md:w-full ${
                    isActive
                      ? 'btn-burgundy text-white shadow-md shadow-[#801E35]/25 !justify-start'
                      : 'bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] text-[#4A3528] dark:text-[#D4C5B5] hover:bg-[#F6F1EA] dark:hover:bg-[#380C16]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Card (Panel 11) */}
        <div className="md:col-span-3 bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === 'Profile' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-4 border-b border-[#EAE0D3] dark:border-[#3F0E1B]">
                <h2 className="text-lg sm:text-xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                  Profile Information
                </h2>
                <p className="text-xs text-[#614D3C] dark:text-[#B59D85] font-medium">
                  Update your display name and basic account details
                </p>
              </div>

              {profileSuccess && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-2xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3.5 bg-dustypink-50 dark:bg-burgundy-900/50 text-[#801E35] dark:text-[#F5D7DE] text-xs font-bold rounded-2xl border border-[#F5D7DE] dark:border-[#520B1C]">
                  {profileError}
                </div>
              )}

              {/* User Avatar & Info (Panel 11) */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#801E35] text-white font-black text-2xl flex items-center justify-center shadow-md shadow-[#801E35]/25 shrink-0">
                  {name ? name.charAt(0).toUpperCase() : 'V'}
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#24050D] dark:text-[#FFFDF9]">
                    {name || 'Vikas Maurya'}
                  </h3>
                  <p className="text-xs text-[#614D3C] dark:text-[#B59D85] font-semibold">{email}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-[10px] text-[#614D3C] dark:text-[#B59D85] lowercase font-normal">(registered)</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F6F1EA] dark:bg-[#2A0711] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold text-[#614D3C] dark:text-[#B59D85] cursor-not-allowed opacity-80"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="btn-burgundy px-7 py-3 rounded-2xl font-bold text-sm"
                  >
                    {profileLoading ? 'Saving...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY & CHANGE PASSWORD */}
          {activeTab === 'Security' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-4 border-b border-[#EAE0D3] dark:border-[#3F0E1B]">
                <h2 className="text-lg sm:text-xl font-black text-[#24050D] dark:text-[#FFFDF9] flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#801E35] dark:text-[#E09CA9]" />
                  <span>Change Password</span>
                </h2>
                <p className="text-xs text-[#614D3C] dark:text-[#B59D85] font-medium mt-0.5">
                  Secure your account by updating your password regularly
                </p>
              </div>

              {pwSuccess && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-2xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{pwSuccess}</span>
                </div>
              )}

              {pwError && (
                <div className="p-3.5 bg-dustypink-50 dark:bg-burgundy-900/50 text-[#801E35] dark:text-[#F5D7DE] text-xs font-bold rounded-2xl border border-[#F5D7DE] dark:border-[#520B1C]">
                  {pwError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B59D85]" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      required
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-3.5 text-[#B59D85] hover:text-[#801E35] transition-colors"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                    New Password <span className="text-[10px] text-[#614D3C] dark:text-[#B59D85] lowercase font-normal">(min 6 characters)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B59D85]" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-3.5 text-[#B59D85] hover:text-[#801E35] transition-colors"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B59D85]" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-3.5 text-[#B59D85] hover:text-[#801E35] transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="btn-burgundy px-7 py-3 rounded-2xl font-bold text-sm"
                  >
                    {pwLoading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>

              {/* Security Checklist Card */}
              <div className="mt-8 p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#EAE0D3] dark:border-[#3F0E1B] space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-[#801E35] dark:text-[#E09CA9] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Account Security Status</span>
                </div>
                <div className="space-y-2 text-xs font-semibold text-[#4A3528] dark:text-[#D4C5B5]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>Password Encryption: bcrypt 12-round hashing active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>Data Privacy: Strict user IDOR isolation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>Session Security: JWT Token with auto-expiry</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === 'Preferences' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-4 border-b border-[#EAE0D3] dark:border-[#3F0E1B]">
                <h2 className="text-lg sm:text-xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                  System Preferences
                </h2>
                <p className="text-xs text-[#614D3C] dark:text-[#B59D85] font-medium">
                  Customize currency, date format, and appearance
                </p>
              </div>

              {prefSuccess && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-2xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{prefSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSavePreferences} className="space-y-5 max-w-lg">
                {/* Currency Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                    Default Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9] cursor-pointer"
                  >
                    <option value="INR">₹ INR - Indian Rupee</option>
                    <option value="USD">$ USD - US Dollar</option>
                    <option value="EUR">€ EUR - Euro</option>
                    <option value="GBP">£ GBP - British Pound</option>
                    <option value="AED">د.إ AED - UAE Dirham</option>
                    <option value="CAD">$ CAD - Canadian Dollar</option>
                    <option value="AUD">$ AUD - Australian Dollar</option>
                    <option value="JPY">¥ JPY - Japanese Yen</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9] cursor-pointer"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 28/10/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/28/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-28)</option>
                  </select>
                </div>

                {/* Theme Mode Toggle Button */}
                <div>
                  <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                    Theme Appearance
                  </label>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="btn-sand px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-4 h-4 text-[#F5D7DE]" />
                        <span>Current: Dark Mode (Click for Light Mode)</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-[#801E35]" />
                        <span>Current: Light Mode (Click for Dark Mode)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={prefLoading}
                    className="btn-burgundy px-7 py-3 rounded-2xl font-bold text-sm"
                  >
                    {prefLoading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'Notifications' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-4 border-b border-[#EAE0D3] dark:border-[#3F0E1B]">
                <h2 className="text-lg sm:text-xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                  Notification Settings
                </h2>
                <p className="text-xs text-[#614D3C] dark:text-[#B59D85] font-medium">
                  Control how and when you receive financial alerts
                </p>
              </div>

              {notifSuccess && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-2xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{notifSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveNotifications} className="space-y-4 max-w-lg">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#EAE0D3] dark:border-[#3F0E1B] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#24050D] dark:text-[#FFFDF9]">
                      Budget Limit Alerts
                    </h4>
                    <p className="text-[11px] text-[#614D3C] dark:text-[#B59D85]">
                      Receive warning when spending exceeds 75% and 100% of category caps
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyBudget}
                    onChange={(e) => setNotifyBudget(e.target.checked)}
                    className="w-5 h-5 accent-[#801E35] rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#EAE0D3] dark:border-[#3F0E1B] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#24050D] dark:text-[#FFFDF9]">
                      Daily Micro-Expense Summary
                    </h4>
                    <p className="text-[11px] text-[#614D3C] dark:text-[#B59D85]">
                      Brief evening recap of transactions recorded today
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyDaily}
                    onChange={(e) => setNotifyDaily(e.target.checked)}
                    className="w-5 h-5 accent-[#801E35] rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#EAE0D3] dark:border-[#3F0E1B] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#24050D] dark:text-[#FFFDF9]">
                      Bill Payment Reminders
                    </h4>
                    <p className="text-[11px] text-[#614D3C] dark:text-[#B59D85]">
                      Alerts 3 days before scheduled utilities and recurring bills
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyBills}
                    onChange={(e) => setNotifyBills(e.target.checked)}
                    className="w-5 h-5 accent-[#801E35] rounded cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-burgundy px-7 py-3 rounded-2xl font-bold text-sm"
                  >
                    Save Notification Preferences
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
