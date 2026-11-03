import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, ArrowLeftRight, Plus, PieChart, Settings } from 'lucide-react';

const BottomNav = ({ onOpenQuickAdd }) => {
  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
    { name: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
    { name: 'Add', isAction: true, icon: Plus },
    { name: 'Budgets', to: '/budgets', icon: PieChart },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#160408]/95 backdrop-blur-md border-t border-[#EAE0D3] dark:border-[#3F0E1B] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isAction) {
          return (
            <button
              key="quick-add-btn"
              onClick={onOpenQuickAdd}
              className="relative -top-4 w-12 h-12 rounded-full bg-[#801E35] text-white flex items-center justify-center shadow-lg shadow-[#801E35]/40 active:scale-90 transition-transform"
              title="Quick Add Transaction"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          );
        }

        return (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                isActive
                  ? 'text-[#801E35] dark:text-[#E09CA9] font-black'
                  : 'text-[#614D3C] dark:text-[#B59D85] hover:text-[#801E35] dark:hover:text-[#FFFDF9] font-semibold'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] tracking-tight">{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;

