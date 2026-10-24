import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, ChevronDown, ChevronUp, ExternalLink, RefreshCw, Wallet, X } from 'lucide-react';
import { useCurrency } from '../components/CurrencyContext';
import { fetchMarketNews } from '../services/marketApi';

const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra Bank', 'Demo Bank'];

function FundsModal({ cashBalance, onClose, onSubmit, formatMoney }) {
  const [mode, setMode] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState(banks[0]);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return setError('Enter an amount greater than zero.');
    if (mode === 'withdraw' && value > cashBalance) return setError('You cannot withdraw more than your available demo cash balance.');
    if (!accountName.trim() || accountNumber.replace(/\s/g, '').length < 6 || !ifsc.trim()) return setError('Enter the account holder, account number and IFSC code.');
    const result = onSubmit({ mode, amount: value, bank, accountName: accountName.trim(), accountNumber: accountNumber.trim(), ifsc: ifsc.trim() });
    if (result) { setError(''); setDone(true); }
  };

  return <div className="funds-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="funds-modal" role="dialog" aria-modal="true" aria-labelledby="funds-title">
      <header className="funds-modal-header"><div><span className="funds-icon"><Wallet size={20} /></span><div><h2 id="funds-title">Wallet & funds</h2><p>Manage your simulated Cribly cash balance</p></div></div><button className="icon-button" onClick={onClose} aria-label="Close funds dialog"><X size={20} /></button></header>
      {done ? <div className="funds-success"><div className="funds-success-mark">✓</div><h3>{mode === 'deposit' ? 'Demo deposit recorded' : 'Demo withdrawal recorded'}</h3><p>{formatMoney(Number(amount))} {mode === 'deposit' ? 'was added to' : 'was deducted from'} your simulated wallet.</p><p className="funds-demo-note">No real bank transfer or payment was made.</p><button className="btn btn-primary" onClick={onClose}>Done</button></div> : <>
        <div className="wallet-balance"><span>Available demo balance</span><strong>{formatMoney(cashBalance)}</strong><small>For coursework only · no real money is moved</small></div>
        <div className="funds-mode-switch"><button className={mode === 'deposit' ? 'active' : ''} onClick={() => { setMode('deposit'); setError(''); }}><ArrowDownToLine size={16} /> Add funds</button><button className={mode === 'withdraw' ? 'active' : ''} onClick={() => { setMode('withdraw'); setError(''); }}><ArrowUpFromLine size={16} /> Withdraw</button></div>
        <form onSubmit={submit} className="funds-form">
          <label>Amount (USD)<input type="number" min="0.01" step="0.01" placeholder="Enter amount" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
          <label>Bank<select value={bank} onChange={(event) => setBank(event.target.value)}>{banks.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Account holder name<input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Name on account" autoComplete="name" required /></label>
          <label>Account number<input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} placeholder="Demo account number" inputMode="numeric" autoComplete="off" required /></label>
          <label>IFSC / bank code<input value={ifsc} onChange={(event) => setIfsc(event.target.value)} placeholder="e.g. SBIN0000001" autoComplete="off" required /></label>
          {error && <p className="funds-error" role="alert">{error}</p>}
          <button className="btn btn-primary funds-submit" type="submit">{mode === 'deposit' ? 'Add demo funds' : 'Withdraw demo funds'}</button>
          <p className="funds-demo-note">Demo only: bank details are not verified or sent to a bank. Do not enter real banking credentials.</p>
        </form>
      </>}
    </section>
  </div>;
}

export default function Dashboard({ portfolio = [], stocks = [], cashBalance = 0, onFundsTransaction, marketDataStatus }) {
  const { formatMoney } = useCurrency();
  const [fundsOpen, setFundsOpen] = useState(false);
  const [news, setNews] = useState({ articles: [], source: 'loading', message: 'Loading latest market headlines…' });
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState('');
  const [newsExpanded, setNewsExpanded] = useState(false);
  const newsSymbols = stocks.map((stock) => stock.symbol).join(',');

  const portfolioValue = portfolio.reduce((total, holding) => {
    const stock = stocks.find((item) => item.symbol === holding.symbol);
    return total + holding.shares * (stock?.price ?? holding.avgPrice);
  }, 0);
  const investedCost = portfolio.reduce((total, holding) => total + holding.shares * holding.avgPrice, 0);
  const profitLoss = portfolioValue - investedCost;
  const netAssets = cashBalance + portfolioValue;
  const profitLossPercent = investedCost > 0 ? (profitLoss / investedCost) * 100 : 0;

  const sentiment = useMemo(() => {
    const valid = stocks.filter((stock) => Number.isFinite(stock.change));
    if (!valid.length) return { label: 'UNAVAILABLE', tone: 'neutral', score: 0, positive: 0, negative: 0, total: 0 };
    const positive = valid.filter((stock) => stock.change > 0).length;
    const negative = valid.filter((stock) => stock.change < 0).length;
    const bullishPercent = Math.round((positive / valid.length) * 100);
    const bearishPercent = Math.round((negative / valid.length) * 100);
    const label = bullishPercent >= 55 ? 'BULLISH' : bearishPercent >= 55 ? 'BEARISH' : 'MIXED';
    return { label, tone: label === 'BULLISH' ? 'positive' : label === 'BEARISH' ? 'negative' : 'neutral', score: Math.max(bullishPercent, bearishPercent), positive, negative, total: valid.length };
  }, [stocks]);

  const loadNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError('');
    try { setNews(await fetchMarketNews(newsSymbols ? newsSymbols.split(',').map((symbol) => ({ symbol })) : [])); }
    catch (error) { setNewsError(error instanceof Error ? error.message : 'Could not load market news.'); setNews((prev) => ({ ...prev, message: 'Could not refresh live headlines.' })); }
    finally { setNewsLoading(false); }
  }, [newsSymbols]);
  useEffect(() => {
    const initialTimer = window.setTimeout(loadNews, 0);
    const interval = window.setInterval(loadNews, 5 * 60 * 1000);
    return () => { window.clearTimeout(initialTimer); window.clearInterval(interval); };
  }, [loadNews]);

  const handleFunds = (transaction) => {
    const ok = onFundsTransaction?.(transaction);
    return Boolean(ok);
  };

  return <div className="dashboard-page">
    <div className="dashboard-heading"><div><h2>Welcome back</h2><p>Market data: <span className={marketDataStatus?.source === 'live' ? 'text-green' : 'text-muted'}>{marketDataStatus?.source === 'live' ? 'Live' : marketDataStatus?.source === 'partial' ? 'Partially live' : 'Demo / fallback'}</span></p></div><button className="btn manage-funds-btn" onClick={() => setFundsOpen(true)}><Wallet size={16} /> Manage Funds</button></div>

    <div className="dashboard-layout"><div className="dashboard-stat-stack">
      <div className="card dashboard-stat"><span>PORTFOLIO</span><strong>{formatMoney(portfolioValue)}</strong><small className={profitLoss >= 0 ? 'text-green' : 'text-red'}>{profitLoss >= 0 ? '↗ +' : '↘ '}{profitLossPercent.toFixed(2)}% P&amp;L</small></div>
      <div className="card dashboard-stat"><span>CASH</span><strong>{formatMoney(cashBalance)}</strong><small>Available demo balance</small></div>
      <div className="card dashboard-stat"><span>P&amp;L</span><strong className={profitLoss >= 0 ? 'text-green' : 'text-red'}>{profitLoss >= 0 ? '+' : '-'}{formatMoney(Math.abs(profitLoss))}</strong><small className={profitLoss >= 0 ? 'text-green' : 'text-red'}>{profitLoss >= 0 ? '↗ +' : '↘ '}{Math.abs(profitLossPercent).toFixed(2)}%</small></div>
      <div className="card dashboard-stat"><span>TOTAL NET ASSETS</span><strong>{formatMoney(netAssets)}</strong></div>
    </div>

    <section className="card dashboard-insights"><div className="insights-heading"><h3>MARKET INSIGHTS</h3><span className="live-pill"><i /> Based on quote data</span></div>
      <div className="sentiment-row"><div><span className="eyebrow">MARKET SENTIMENT</span><h2 className={`sentiment-${sentiment.tone}`}>{sentiment.label}</h2></div><div className="sentiment-score"><span className="eyebrow">BREADTH SCORE</span><strong>{sentiment.score}%</strong></div></div>
      <p className="sentiment-description">{sentiment.total ? `${sentiment.positive} of ${sentiment.total} tracked stocks are up today and ${sentiment.negative} are down. Sentiment recalculates whenever market quotes refresh; it is a simple market-breadth indicator, not investment advice.` : 'Market sentiment will appear when quote data is available.'}</p>
      <div className="sentiment-meter"><span style={{ width: `${sentiment.total ? (sentiment.positive / sentiment.total) * 100 : 0}%` }} /></div>
      <div className="sentiment-legend"><span className="text-green">● Up {sentiment.positive}</span><span className="text-red">● Down {sentiment.negative}</span><span>Updated with market quotes</span></div>

      <section className={`news-panel ${newsExpanded ? 'news-panel-expanded' : 'news-panel-collapsed'}`}>
        <div className="news-header">
          <div><h3>STOCK-RELATED NEWS</h3><p>{news.source === 'live' ? 'Company headlines for tracked stocks' : news.message}</p></div>
          <div className="news-header-actions">
            <button className="icon-button news-refresh" onClick={loadNews} disabled={newsLoading} aria-label="Refresh stock news" title="Refresh news"><RefreshCw size={16} className={newsLoading ? 'spin' : ''} /></button>
            {news.articles.length > 2 && <button className="news-expand-btn" onClick={() => setNewsExpanded((expanded) => !expanded)} aria-expanded={newsExpanded}>{newsExpanded ? <>Collapse <ChevronUp size={15} /></> : <>Expand <ChevronDown size={15} /></>}</button>}
          </div>
        </div>
        {newsLoading && news.articles.length === 0 ? <div className="news-empty">Loading stock-related headlines…</div> : news.articles.length ? <div className="news-list">{news.articles.slice(0, newsExpanded ? 12 : 2).map((article) => <article className="news-item" key={article.id}><div className="news-item-main"><span className="news-source">{article.related ? `${article.related} · ` : ''}{article.source}{article.datetime ? ` · ${new Date(article.datetime).toLocaleString()}` : ''}</span><a href={article.url} target="_blank" rel="noreferrer">{article.headline} <ExternalLink size={13} /></a>{article.summary && <p>{article.summary.length > 150 ? `${article.summary.slice(0, 150)}…` : article.summary}</p>}</div>{article.image && <img src={article.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}</article>)}</div> : <div className="news-empty">{newsError || news.message || 'No stock-specific headlines are available right now.'}{news.source !== 'unavailable' && <button className="text-button" onClick={loadNews}>Try again</button>}</div>}
        {news.articles.length > 0 && <div className="news-footnote">Stock-specific headlines only · Refreshes every 5 minutes · Open the publisher for the full story.</div>}
      </section>
    </section></div>
    {fundsOpen && <FundsModal cashBalance={cashBalance} formatMoney={formatMoney} onClose={() => setFundsOpen(false)} onSubmit={handleFunds} />}
  </div>;
}
