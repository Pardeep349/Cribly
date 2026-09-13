import { useCurrency } from '../CurrencyContext';

export default function Navbar({ user, theme, onToggleTheme, cashBalance = 0 }) {
  const username = user?.identifier ? user.identifier.split('@')[0] : 'Trader';
  const { formatMoney } = useCurrency();

  return (
    <header className="header">
      <div className="header-right">
        <button onClick={onToggleTheme} title="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button title="Notifications">🔔</button>
        <div className="funds-badge">
          💰 {formatMoney(cashBalance)}
        </div>
        <div className="user-badge">
          👤 {username}
        </div>
      </div>
    </header>
  );
}
