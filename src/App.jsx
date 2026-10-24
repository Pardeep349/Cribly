import { useEffect, useReducer, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TickerBar from './components/TickerBar';
import { CurrencyProvider } from './components/CurrencyContext';

import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';

import { INITIAL_STOCKS } from './data/initialStocks';
import { fetchMarketStocks } from './services/marketApi';
import { financialReducer, INITIAL_FINANCIAL_STATE } from './reducers/financialReducer';
import { createTransactionId, formatTransactionTimestamp } from './utils/transactions';

export default function App() {
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState(['AAPL', 'NVDA']);
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);

  const [financialState, dispatchFinancialAction] = useReducer(
    financialReducer,
    INITIAL_FINANCIAL_STATE,
  );
  const { cashBalance, portfolio, transactions } = financialState;
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [marketDataStatus, setMarketDataStatus] = useState({
    source: 'demo', loading: true, error: '', message: 'Loading market quotes…', lastUpdated: null,
  });

  // Load quotes on entry and refresh them periodically. Finnhub REST calls are
  // deliberately throttled to once per minute to avoid exhausting free-tier limits.
  useEffect(() => {
    let cancelled = false;
    const loadQuotes = async () => {
      if (cancelled) return;
      setMarketDataStatus((prev) => ({ ...prev, loading: true, error: '' }));
      try {
        const result = await fetchMarketStocks();
        if (cancelled) return;
        setStocks(result.stocks);
        setMarketDataStatus({
          source: result.source, loading: false, error: '', message: result.message, lastUpdated: new Date(),
        });
      } catch (error) {
        if (cancelled) return;
        setMarketDataStatus((prev) => ({
          ...prev, loading: false, error: error instanceof Error ? error.message : 'Unable to load market data.',
          message: 'Showing the last available prices.',
        }));
      }
    };

    const handleManualRefresh = () => loadQuotes();
    window.addEventListener('cribly-refresh-market-data', handleManualRefresh);
    loadQuotes();
    const intervalId = window.setInterval(loadQuotes, 60_000);
    return () => { cancelled = true; window.clearInterval(intervalId); window.removeEventListener('cribly-refresh-market-data', handleManualRefresh); };
  }, []);

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
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login', { replace: true });
  };

  const handleFundsTransaction = ({ mode, amount, bank, accountName }) => {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    if (mode === 'withdraw' && amount > cashBalance) return false;

    const transaction = {
      id: createTransactionId('WAL'),
      symbol: 'WALLET',
      type: mode === 'deposit' ? 'DEPOSIT' : 'WITHDRAWAL',
      qty: 1,
      price: amount,
      time: formatTransactionTimestamp(),
      status: 'Demo',
      note: `${bank} · ${accountName}`,
    };

    dispatchFinancialAction({
      type: 'RECORD_FUNDS_TRANSACTION',
      payload: { mode, amount, transaction },
    });
    return true;
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

    const transaction = {
      id: createTransactionId('TX'),
      symbol,
      type,
      qty,
      price,
      time: formatTransactionTimestamp(),
      status: 'Completed',
    };

    dispatchFinancialAction({
      type: 'EXECUTE_TRADE',
      payload: { symbol, type, qty, price, transaction },
    });
    return true;
  };

  /*
   * Login is outside the authenticated application.
   */
  if (!user) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    );
  }

  return (
    <CurrencyProvider>
      <div className={`app-container ${theme}`}>
        <Sidebar onLogout={handleLogout} />

        <div className="main-content">
          <Navbar
            user={user}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            cashBalance={cashBalance}
          />

          <TickerBar stocks={stocks} marketDataStatus={marketDataStatus} />

          <main className="page-container">
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    user={user}
                    portfolio={portfolio}
                    stocks={stocks}
                    cashBalance={cashBalance}
                    onFundsTransaction={handleFundsTransaction}
                    marketDataStatus={marketDataStatus}
                  />
                }
              />

              <Route
                path="/market"
                element={
                  <Market
                    stocks={stocks}
                    marketDataStatus={marketDataStatus}
                    onRefreshMarketData={() => window.dispatchEvent(new CustomEvent('cribly-refresh-market-data'))}
                    watchlist={watchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                    onExecuteTrade={handleExecuteTrade}
                    portfolio={portfolio}
                    cashBalance={cashBalance}
                  />
                }
              />

              <Route
                path="/portfolio"
                element={
                  <Portfolio
                    stocks={stocks}
                    holdings={portfolio}
                    cashBalance={cashBalance}
                    onExecuteTrade={handleExecuteTrade}
                  />
                }
              />

              <Route
                path="/watchlist"
                element={
                  <Watchlist
                    stocks={stocks}
                    watchlist={watchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                    onExecuteTrade={handleExecuteTrade}
                    cashBalance={cashBalance}
                    portfolio={portfolio}
                  />
                }
              />

              <Route
                path="/history"
                element={
                  <History
                    transactions={transactions}
                  />
                }
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

              <Route
                path="/login"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </CurrencyProvider>
  );
}
