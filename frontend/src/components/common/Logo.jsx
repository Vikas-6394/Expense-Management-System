import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md', to = '/', showText = true }) => {
  const iconBoxSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const svgSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Brand Icon (Ultra-high contrast, visible in Light & Dark modes) */}
      <div
        className={`${iconBoxSizes[size] || iconBoxSizes.md} bg-gradient-to-br from-[#9E223E] to-[#681327] flex items-center justify-center shadow-md shadow-[#801E35]/30 group-hover:scale-105 transition-transform shrink-0 border border-white/20`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={svgSizes[size] || svgSizes.md}
        >
          {/* Card peeking out */}
          <rect
            x="8"
            y="6"
            width="16"
            height="8"
            rx="2"
            fill="#FAECF0"
          />
          <rect x="11" y="8" width="4" height="2" rx="0.5" fill="#801E35" opacity="0.8" />

          {/* Main Wallet Body - Crisp high-contrast White/Cream */}
          <rect
            x="5"
            y="10"
            width="22"
            height="16"
            rx="3.5"
            fill="#FFFDF9"
          />

          {/* Wallet flap / interior pocket */}
          <path
            d="M5 14C5 12.3431 6.34315 11 8 11H24C25.6569 11 27 12.3431 27 14V22.5C27 24.433 25.433 26 23.5 26H8.5C6.567 26 5 24.433 5 22.5V14Z"
            fill="#F6E7EB"
          />

          {/* Wallet Clasp in Burgundy */}
          <rect x="18" y="15" width="9" height="7.5" rx="2" fill="#801E35" />
          <circle cx="22" cy="18.75" r="1.4" fill="#FFFDF9" />
        </svg>
      </div>

      {showText && (
        <span
          className={`${textSizes[size] || textSizes.md} font-black tracking-tight text-[#24050D] dark:text-[#FFFDF9]`}
        >
          Expense<span className="text-[#801E35] dark:text-[#E09CA9]">Manager</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="inline-block">{content}</Link>;
  }

  return content;
};

export default Logo;
