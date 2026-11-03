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
      {/* Brand Icon (Always vibrant & visible in both Light and Dark modes) */}
      <div
        className={`${iconBoxSizes[size] || iconBoxSizes.md} bg-[#801E35] flex items-center justify-center shadow-md shadow-[#801E35]/30 group-hover:scale-105 transition-transform shrink-0 border border-[#FAF7F2]/20`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={svgSizes[size] || svgSizes.md}
        >
          {/* Card peeking out */}
          <rect
            x="6"
            y="5"
            width="20"
            height="11"
            rx="2.5"
            fill="#F5D7DE"
            stroke="#FFFDF9"
            strokeWidth="1.2"
          />
          {/* Card chip */}
          <rect x="9" y="8" width="5" height="4" rx="1" fill="#801E35" opacity="0.9" />

          {/* Wallet main body */}
          <rect
            x="3"
            y="10"
            width="26"
            height="17"
            rx="4"
            fill="#681327"
            stroke="#FFFDF9"
            strokeWidth="1.4"
          />

          {/* Wallet flap / pocket */}
          <path
            d="M3 15C3 13.3431 4.34315 12 6 12H26C27.6569 12 29 13.3431 29 15V23C29 25.2091 27.2091 27 25 27H7C4.79086 27 3 25.2091 3 23V15Z"
            fill="#801E35"
          />

          {/* Golden / Cream Clasp */}
          <circle cx="23.5" cy="19.5" r="2.8" fill="#FFFDF9" />
          <circle cx="23.5" cy="19.5" r="1.6" fill="#D27F8F" />
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
