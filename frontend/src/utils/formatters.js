export const currencySymbols = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  JPY: '¥',
  AED: 'AED',
};

export const formatCurrency = (amount, currency = 'INR') => {
  const num = Number(amount) || 0;
  const symbol = currencySymbols[currency] || '₹';

  const localeMap = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    CAD: 'en-CA',
    AUD: 'en-AU',
    JPY: 'ja-JP',
    AED: 'ar-AE',
  };

  const locale = localeMap[currency] || 'en-IN';

  try {
    const formattedNum = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(num));

    const sign = num < 0 ? '-' : '';
    const safeSymbol = symbol === '₹' ? '₹ ' : symbol;
    return `${sign}${safeSymbol}${formattedNum}`;
  } catch (err) {
    const safeSymbol = symbol === '₹' ? '₹ ' : symbol;
    return `${safeSymbol}${num.toFixed(2)}`;
  }
};

export const formatDate = (dateInput, format = 'DD/MM/YYYY') => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  } else if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }

  // Default DD/MM/YYYY
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const dateStr = formatDate(d);
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} ${timeStr}`;
};
