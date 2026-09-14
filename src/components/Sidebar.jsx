import { NavLink } from 'react-router-dom';

export default function Sidebar({ onLogout = () => {} }) {
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/market',
      label: 'Market',
      icon: '📈',
    },
    {
      path: '/portfolio',
      label: 'Portfolio',
      icon: '💼',
    },
    {
      path: '/watchlist',
      label: 'Watchlist',
      icon: '⭐',
    },
    {
      path: '/history',
      label: 'History',
      icon: '📜',
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: '⚙️',
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        📈 Cribly
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
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
