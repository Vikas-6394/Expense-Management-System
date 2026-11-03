import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password, currency: 'INR' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#160408] text-[#24050D] dark:text-[#FFFDF9] flex flex-col items-center justify-center p-4">
      {/* Top Back to Home Navigation */}
      <div className="max-w-md w-full mb-3 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#801E35] dark:text-[#E09CA9] hover:underline transition-colors px-3 py-1.5 rounded-xl bg-white dark:bg-[#20050B] border border-[#EAE0D3] dark:border-[#3F0E1B] shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85] hover:text-[#801E35] transition-colors"
        >
          Explore without signup →
        </Link>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-7 sm:p-10 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Logo & Title (Panel 2 in Mockup) */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-2">
            <Logo size="lg" to="/" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#24050D] dark:text-[#FFFDF9]">
            Create Your Account
          </h1>
          <p className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85]">
            Start managing your expenses today.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-dustypink-50 dark:bg-burgundy-900/50 text-dustypink-700 dark:text-dustypink-300 text-xs font-bold rounded-2xl border border-dustypink-200 dark:border-burgundy-800 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-sand-500" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1F050B] border border-sand-200 dark:border-burgundy-900 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600 font-semibold text-burgundy-900 dark:text-cream-100 placeholder:text-sand-400"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-sand-500" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-50 dark:bg-[#1F050B] border border-sand-200 dark:border-burgundy-900 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600 font-semibold text-burgundy-900 dark:text-cream-100 placeholder:text-sand-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-sand-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-cream-50 dark:bg-[#1F050B] border border-sand-200 dark:border-burgundy-900 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600 font-semibold text-burgundy-900 dark:text-cream-100 placeholder:text-sand-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-sand-400 hover:text-burgundy-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-sand-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-cream-50 dark:bg-[#1F050B] border border-sand-200 dark:border-burgundy-900 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600 font-semibold text-burgundy-900 dark:text-cream-100 placeholder:text-sand-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-sand-400 hover:text-burgundy-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-burgundy w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#801E35]/25 active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-[#614D3C] dark:text-[#B59D85] pt-2">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-[#801E35] dark:text-[#E09CA9] hover:underline"
          >
            Login
          </Link>
        </p>

        {/* Return to home option */}
        <div className="pt-3 border-t border-[#EAE0D3] dark:border-[#3F0E1B] text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#614D3C] dark:text-[#B59D85] hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Clicked by mistake? Return to Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
