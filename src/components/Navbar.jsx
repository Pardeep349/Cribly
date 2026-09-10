

export default function Navbar({ user, theme, onToggleTheme }) {
  const username = user?.identifier ? user.identifier.split('@')[0] : 'Trader';

  return (
    <header className="header">
      <div className="header-right">
        <button onClick={onToggleTheme} title="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button title="Notifications">🔔</button>
        <div className="funds-badge">
          💰 $12,450.00
        </div>
        <div className="user-badge">
          👤 {username}
        </div>
      </div>
    </header>
  );
}
