import { createContext, useContext, useMemo, useState } from 'react';

const CURRENCIES = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 83 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.78 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 148 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.36 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.52 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', rate: 0.88 },
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(() => {
    try { return localStorage.getItem('cribly-currency') || 'USD'; } catch { return 'USD'; }
  });

  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;

  const setCurrency = (code) => {
    if (!CURRENCIES[code]) return;
    setCurrencyCode(code);
    try { localStorage.setItem('cribly-currency', code); } catch { /* ignore */ }
  };

  const formatMoney = (usdAmount = 0, options = {}) => {
    const converted = Number(usdAmount || 0) * currency.rate;
    const decimals = options.decimals ?? (currency.code === 'JPY' ? 0 : 2);
    return `${currency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  const formatPrice = (usdAmount = 0) => formatMoney(usdAmount);

  const formatMarketCap = (value = '') => {
    const match = String(value).replace(/[$,]/g, '').match(/^([0-9.]+)([TMBK])?$/i);
    if (!match) return value;
    const suffix = (match[2] || '').toUpperCase();
    const convertedMantissa = (Number(match[1]) * currency.rate);
    const decimals = convertedMantissa >= 100 ? 0 : 2;
    return `${currency.symbol}${convertedMantissa.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  };

  const value = useMemo(() => ({
    currencies: CURRENCIES,
    currency,
    currencyCode,
    setCurrency,
    formatMoney,
    formatPrice,
    formatMarketCap,
  }), [currencyCode, currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used inside CurrencyProvider');
  return context;
}
