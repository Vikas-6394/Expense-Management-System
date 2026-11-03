import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowRight, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import Logo from '../components/common/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: request token, 2: enter token and new password, 3: success
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success && res.data.resetToken) {
        setMessage(res.data.message || 'Reset code generated.');
        setToken(res.data.resetToken);
        setStep(2);
      } else {
        setError(res.data.message || 'This email is not registered. Please enter your registered email address.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'This email is not registered. Password reset is only available for registered email addresses.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      setMessage(res.data.message || 'Password successfully reset!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#160408] text-[#24050D] dark:text-[#FFFDF9] flex flex-col items-center justify-center p-4 relative">
      {/* Return to Home link */}
      <div className="max-w-md w-full mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#801E35] dark:text-[#E09CA9] hover:underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-2">
            <Logo size="lg" to="/" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#24050D] dark:text-[#FFFDF9]">
            Reset Password
          </h1>
          <p className="text-xs text-[#614D3C] dark:text-[#B59D85] font-semibold">
            {step === 1 && 'Enter your email to receive recovery instructions'}
            {step === 2 && 'Enter the reset code and your new password'}
            {step === 3 && 'Your password has been successfully updated'}
          </p>
        </div>

        {message && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-2xl border border-emerald-200 dark:border-emerald-900 text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-dustypink-50 dark:bg-burgundy-900/50 text-[#801E35] dark:text-[#F5D7DE] text-xs font-bold rounded-2xl border border-[#F5D7DE] dark:border-[#520B1C] text-center">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B59D85]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-burgundy w-full py-3.5 rounded-2xl font-bold text-sm"
            >
              <span>{loading ? 'Sending...' : 'Send Recovery Code'}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                Reset Token / Code
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                New Password (Min 6 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B59D85]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#B59D85] hover:text-[#801E35]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B59D85]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-burgundy w-full py-3.5 rounded-2xl font-bold text-sm"
            >
              {loading ? 'Resetting...' : 'Confirm New Password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center pt-2 space-y-4">
            <Link
              to="/login"
              className="btn-burgundy w-full py-3.5 rounded-2xl font-bold text-sm"
            >
              Return to Login
            </Link>
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-xs font-bold text-[#801E35] dark:text-[#E09CA9] hover:underline"
          >
            &larr; Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
