import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Calendar, Clock, Bell, Plus, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationsDropdown from './NotificationsDropdown';

const routeDetails = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Track your income, expenses and budget in one place.',
  },
  '/transactions': {
    title: 'Transactions',
    subtitle: 'View, filter and record all your money entries.',
  },
  '/budgets': {
    title: 'Budgets',
    subtitle: 'Monitor expenditure and stay strictly under monthly caps.',
  },
  '/categories': {
    title: 'Categories',
    subtitle: 'Organize and classify your income and expense streams.',
  },
  '/reports': {
    title: 'Reports & Analytics',
    subtitle: 'Comprehensive financial breakdown, monthly trends, and allocations.',
  },
  '/goals': {
    title: 'Financial Goals',
    subtitle: 'Save systematically towards your milestones and life aspirations.',
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'Manage your personal account, security, password, and preferences.',
  },
};

const Navbar = ({ onOpenSidebar, onOpenQuickAdd }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const currentRoute = routeDetails[location.pathname] || {
    title: 'ExpenseManager',
    subtitle: 'Manage your finances smartly.',
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 dark:bg-[#1A0408]/95 backdrop-blur-md px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between transition-colors border-b border-[#EAE0D3] dark:border-[#3F0E1B]">
      {/* Left: Hamburger menu & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] text-[#801E35] dark:text-[#FAF7F2] shadow-sm shrink-0 active:scale-95"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[#24050D] dark:text-[#FFFDF9] truncate">
            {currentRoute.title}
          </h1>
          <p className="hidden md:block text-xs font-semibold text-[#614D3C] dark:text-[#B59D85] truncate">
            {currentRoute.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Date filter, Add button, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        {/* Live Real-Time Date & Clock Pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] text-xs font-bold text-[#24050D] dark:text-[#FAF7F2] shadow-sm select-none">
          <Calendar className="w-3.5 h-3.5 text-[#801E35] dark:text-[#E09CA9]" />
          <span>{formattedDate}</span>
          <span className="text-[#DCCEBD] dark:text-[#520B1C]">•</span>
          <Clock className="w-3.5 h-3.5 text-[#C25A70] dark:text-[#D27F8F]" />
          <span className="font-mono font-black text-[#801E35] dark:text-[#E09CA9]">{formattedTime}</span>
        </div>

        {/* Quick Add Button (Desktop only - Mobile uses the floating '+' button in bottom nav) */}
        <button
          onClick={onOpenQuickAdd}
          className="hidden lg:inline-flex btn-burgundy items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs sm:text-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-xl sm:rounded-full bg-white dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] text-[#24050D] dark:text-[#FFFDF9] hover:bg-[#F6F1EA] dark:hover:bg-[#380C16] transition-colors shadow-sm"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#F5D7DE]" />
          ) : (
            <Moon className="w-4 h-4 text-[#801E35]" />
          )}
        </button>

        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Pill (Panel 4: Vikas Maurya) */}
        <div className="flex items-center gap-2 pl-1 sm:pl-1.5 py-1 pr-1.5 sm:pr-3 bg-white dark:bg-[#250810] rounded-full border border-[#EAE0D3] dark:border-[#3F0E1B] shadow-sm">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#801E35] text-white font-black flex items-center justify-center text-xs overflow-hidden shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
          </div>
          <span className="hidden sm:inline text-xs font-bold text-[#24050D] dark:text-[#FFFDF9]">
            {user?.name || 'Vikas Maurya'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
