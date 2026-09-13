import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TickerBar from './components/TickerBar';
import Market from './pages/Market';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import History from './pages/History';
import Login from './pages/Login';
import { INITIAL_STOCKS } from './data/initialStocks';
import Settings from './pages/Settings';
import { CurrencyProvider } from './components/CurrencyContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [watchlist, setWatchlist] = useState(['AAPL', 'NVDA']);
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [cashBalance, setCashBalance] = useState(12450.00);
  const [portfolio, setPortfolio] = useState([
    { symbol: 'AAPL', shares: 10, avgPrice: 175.00 },
    { symbol: 'NVDA', shares: 5, avgPrice: 820.00 },
    { symbol: 'GOOGL', shares: 12, avgPrice: 145.00 },
  ]);
  const [transactions, setTransactions] = useState([]);

  const handleToggleWatchlist = (symbol) => {
    setWatchlist((prev) =>
      prev.includes(symbol)
        ? prev.filter((item) => item !== symbol)
        : [...prev, symbol]
    );
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setActiveTab('Dashboard');
  };

  // Logout and return to Login page
  const handleLogout = () => {
    setUser(null);
    setActiveTab('Dashboard');
  };

  const handleExecuteTrade = ({ symbol, type, qty, price }) => {
    const totalCost = qty * price;

    if (type === 'BUY' && totalCost > cashBalance) {
      alert('Insufficient cash balance!');
      return false;
    }

    const existingHolding = portfolio.find((item) => item.symbol === symbol);

    if (type === 'SELL' && (!existingHolding || existingHolding.shares < qty)) {
      alert('Insufficient shares owned to sell!');
      return false;
    }

    setCashBalance((prev) =>
      type === 'BUY' ? prev - totalCost : prev + totalCost
    );

    setPortfolio((prev) => {
      if (type === 'BUY') {
        if (existingHolding) {
          const newShares = existingHolding.shares + qty;
          const newAvgPrice =
            ((existingHolding.shares * existingHolding.avgPrice) + totalCost) /
            newShares;

          return prev.map((item) =>
            item.symbol === symbol
              ? { ...item, shares: newShares, avgPrice: newAvgPrice }
              : item
          );
        }

        return [...prev, { symbol, shares: qty, avgPrice: price }];
      }

      const remainingShares = existingHolding.shares - qty;

      if (remainingShares === 0) {
        return prev.filter((item) => item.symbol !== symbol);
      }

      return prev.map((item) =>
        item.symbol === symbol
          ? { ...item, shares: remainingShares }
          : item
      );
    });

    const now = new Date();

    const formattedTimestamp =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ` +
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTransactions((prev) => [
      {
        id: `TX${Math.floor(1000 + Math.random() * 9000)}`,
        symbol,
        type,
        qty,
        price,
        time: formattedTimestamp,
        status: 'Completed',
      },
      ...prev,
    ]);

    return true;
  };

  // If user is logged out, show Login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <CurrencyProvider>
      <div className={`app-container ${theme}`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        <div className="main-content">
          <Navbar
            user={user}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            cashBalance={cashBalance}
          />

          <TickerBar stocks={INITIAL_STOCKS} />

          <main className="page-container">
            {activeTab === 'Dashboard' && (
              <Dashboard
                user={user}
                portfolio={portfolio}
                stocks={INITIAL_STOCKS}
                cashBalance={cashBalance}
              />
            )}

            {activeTab === 'Market' && (
              <Market
                stocks={INITIAL_STOCKS}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onExecuteTrade={handleExecuteTrade}
                portfolio={portfolio}
                cashBalance={cashBalance}
              />
            )}

            {activeTab === 'Portfolio' && (
              <Portfolio
                stocks={INITIAL_STOCKS}
                holdings={portfolio}
                cashBalance={cashBalance}
                onExecuteTrade={handleExecuteTrade}
              />
            )}

            {activeTab === 'Watchlist' && (
              <Watchlist
                stocks={INITIAL_STOCKS}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onExecuteTrade={handleExecuteTrade}
                cashBalance={cashBalance}
                portfolio={portfolio}
              />
            )}

            {activeTab === 'History' && (
              <History transactions={transactions} />
            )}

            {activeTab === 'Settings' && <Settings />}
          </main>
        </div>
      </div>
    </CurrencyProvider>
  );
}
