export default function Sidebar({
  activeTab = 'Market',
  onTabChange = () => {},
  onLogout = () => {},
}) {
  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'Market', label: 'Market', icon: '📈' },
    { id: 'Portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'Watchlist', label: 'Watchlist', icon: '⭐' },
    { id: 'History', label: 'History', icon: '📜' },
    { id: 'Settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        📈 Cribly
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`nav-item ${
              activeTab === item.id ? 'active' : ''
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        className="nav-item"
        onClick={onLogout}
        style={{
          color: 'var(--accent-red)',
          marginTop: 'auto',
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}
