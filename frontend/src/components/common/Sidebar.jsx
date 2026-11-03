import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  ArrowLeftRight,
  PieChart,
  Tag,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
    { name: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
    { name: 'Budgets', to: '/budgets', icon: PieChart },
    { name: 'Categories', to: '/categories', icon: Tag },
    { name: 'Reports', to: '/reports', icon: BarChart3 },
    { name: 'Goals', to: '/goals', icon: Target },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-burgundy-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#1C050B] border-r border-sand-200/80 dark:border-burgundy-900/80 p-5 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto pr-1">
          {/* Logo brand (Panel 4) */}
          <div className="px-2 py-2 mb-6">
            <Logo size="sm" to="/dashboard" />
          </div>

          {/* Quick link to Landing Home */}
          <div className="mb-4 px-1">
            <NavLink
              to="/"
              onClick={handleNavClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-sand-700 dark:text-sand-300 hover:text-burgundy-600 hover:bg-sand-100/70 dark:hover:bg-burgundy-900/40 transition-colors border border-sand-200/60 dark:border-burgundy-900/60"
            >
              <Home className="w-3.5 h-3.5 text-dustypink-600" />
              <span>Back to Home</span>
            </NavLink>
          </div>

          {/* Navigation Items (Panel 4) */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-[#801E35] text-white shadow-md shadow-[#801E35]/25'
                        : 'text-sand-700 hover:text-burgundy-950 hover:bg-sand-100/70 dark:text-sand-300 dark:hover:text-cream-100 dark:hover:bg-burgundy-900/40'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout (Panel 4) */}
        <div className="pt-4 border-t border-sand-200/80 dark:border-burgundy-900/80">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-bold text-sm text-dustypink-700 hover:text-dustypink-800 hover:bg-dustypink-50 dark:text-dustypink-400 dark:hover:bg-burgundy-900/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
