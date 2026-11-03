import React from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const StatCard = ({
  title,
  amount,
  currency = 'INR',
  change = null,
  changePeriod = 'vs last month',
  isPositiveGood = true,
  icon: Icon,
  subtitle,
  onClick,
}) => {
  const isPositive = change !== null ? change >= 0 : null;
  // If expense increased, it's typically red (not good)
  const isGood = isPositiveGood ? isPositive : !isPositive;

  const formatted = formatCurrency(amount, currency);
  // Split dollars/rupees and cents/paise for modern design
  const parts = formatted.split('.');
  const mainPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative group ${
        onClick ? 'cursor-pointer hover:border-brand-200 dark:hover:border-brand-800' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {mainPart}
        </span>
        <span className="text-2xl font-semibold text-slate-400 dark:text-slate-500">
          {decimalPart}
        </span>
      </div>

      {change !== null && (
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isGood
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {changePeriod}
          </span>
        </div>
      )}

      {subtitle && (
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
