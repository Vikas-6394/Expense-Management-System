import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || (typeof err.response?.data === 'string' && err.response.data.length < 200 ? err.response.data : null);
      setError(serverMsg || err.message || 'Login failed. Please verify credentials.');
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
          Explore without login →
        </Link>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-7 sm:p-10 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header (Panel 3 in Mockup) */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-2">
            <Logo size="lg" to="/" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#24050D] dark:text-[#FFFDF9]">
            Welcome Back
          </h1>
          <p className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85]">
            Login to your account.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-dustypink-50 dark:bg-burgundy-900/50 text-dustypink-700 dark:text-dustypink-300 text-xs font-bold rounded-2xl border border-dustypink-200 dark:border-burgundy-800 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="flex items-center gap-2 cursor-pointer text-sand-700 dark:text-sand-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-burgundy-600 focus:ring-burgundy-500 border-sand-300"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-burgundy-600 dark:text-dustypink-400 font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-burgundy w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#801E35]/25 active:scale-95 transition-all disabled:opacity-50 mt-1"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-[#614D3C] dark:text-[#B59D85] pt-1">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-[#801E35] dark:text-[#E09CA9] hover:underline"
          >
            Sign Up
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

export default Login;
