import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TickerBar from './components/TickerBar';
import Market from './pages/Market';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import History from './pages/History';

const INITIAL_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'TECHNOLOGY', price: 189.65, buyPrice: 182.00, change: 1.39, marketCap: '$2.94T' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'TECHNOLOGY', price: 395.36, buyPrice: 410.00, change: -3.56, marketCap: '$3.08T' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'TECHNOLOGY', price: 157.75, buyPrice: 150.00, change: 2.87, marketCap: '$1.92T' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'CONSUMER', price: 183.80, buyPrice: 180.00, change: 0.56, marketCap: '$1.91T' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'TECHNOLOGY', price: 895.89, buyPrice: 850.00, change: 4.09, marketCap: '$2.18T' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'CONSUMER', price: 174.80, buyPrice: 190.00, change: -2.40, marketCap: '$550B' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Market');
  const [stocks] = useState(INITIAL_STOCKS);
  const [watchlist, setWatchlist] = useState(['AAPL', 'NVDA']);
  const [theme, setTheme] = useState('dark');
  const [user] = useState({ identifier: 'trader@cribly.com' });

  // Live Financial State
  const [cashBalance, setCashBalance] = useState(12450.00);
  const [portfolio, setPortfolio] = useState([
    { symbol: 'AAPL', shares: 10, avgPrice: 175.00 },
    { symbol: 'NVDA', shares: 5, avgPrice: 820.00 },
    { symbol: 'GOOGL', shares: 12, avgPrice: 145.00 },
  ]);
  const [transactions, setTransactions] = useState([]);

  const handleToggleWatchlist = (symbol) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
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

    // 1. Update Cash Balance
    setCashBalance((prev) => (type === 'BUY' ? prev - totalCost : prev + totalCost));

    // 2. Update Portfolio Holdings
    setPortfolio((prev) => {
      if (type === 'BUY') {
        if (existingHolding) {
          const newShares = existingHolding.shares + qty;
          const newAvgPrice = ((existingHolding.shares * existingHolding.avgPrice) + totalCost) / newShares;
          return prev.map((item) =>
            item.symbol === symbol ? { ...item, shares: newShares, avgPrice: newAvgPrice } : item
          );
        }
        return [...prev, { symbol, shares: qty, avgPrice: price }];
      } else {
        const remainingShares = existingHolding.shares - qty;
        if (remainingShares === 0) {
          return prev.filter((item) => item.symbol !== symbol);
        }
        return prev.map((item) =>
          item.symbol === symbol ? { ...item, shares: remainingShares } : item
        );
      }
    });

    // 3. Append New Transaction to History
    const now = new Date();
    const formattedTimestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTx = {
      id: `TX${Math.floor(1000 + Math.random() * 9000)}`,
      symbol,
      type,
      qty,
      price,
      time: formattedTimestamp,
      status: 'Completed'
    };

    setTransactions((prev) => [newTx, ...prev]);

    return true;
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="main-content">
        <Navbar user={user} theme={theme} onToggleTheme={handleToggleTheme} cashBalance={cashBalance} />
        <TickerBar stocks={stocks} />

        <main className="page-container">
          {activeTab === 'Dashboard' && (
            <Dashboard user={user} portfolio={portfolio} stocks={stocks} cashBalance={cashBalance} />
          )}
          {activeTab === 'Market' && (
            <Market
              stocks={stocks}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onExecuteTrade={handleExecuteTrade}
              portfolio={portfolio}
              cashBalance={cashBalance}
            />
          )}
          {activeTab === 'Portfolio' && (
            <Portfolio
              stocks={stocks}
              holdings={portfolio}
              cashBalance={cashBalance}
              onExecuteTrade={handleExecuteTrade}
            />
          )}
          {activeTab === 'Watchlist' && (
            <Watchlist
              stocks={stocks}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
            />
          )}
          {activeTab === 'History' && <History transactions={transactions} />}

          {activeTab === 'Settings' && (
            <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>
              <h3>Settings View</h3>
              <p style={{ marginTop: '0.5rem' }}>This section is currently under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}