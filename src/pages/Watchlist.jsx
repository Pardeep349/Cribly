import { useCurrency } from '../components/CurrencyContext';
import { useState } from 'react';
import StockModal from '../components/StockModal';
import TradeModal from '../components/TradeModal';

export default function Watchlist({
  stocks = [],
  watchlist = [],
  onToggleWatchlist = () => {},
  onExecuteTrade,
  cashBalance = 0,
  portfolio = []
}) {
  const { formatPrice } = useCurrency();
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeModalData, setTradeModalData] = useState(null);

  const handleOpenTradeFromModal = (stock, type, shares = 1) => {
    setSelectedStock(null);
    setTradeModalData({ stock, type, shares });
  };

  const handleConfirmTrade = (tradePayload) => {
    if (onExecuteTrade) {
      const success = onExecuteTrade(tradePayload);
      if (success !== false) {
        setTradeModalData(null);
      }
    }
  };

  const watchlistStocks = stocks.filter((s) => watchlist.includes(s.symbol));

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Starred Watchlist</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Track your favorite tickers in real time
        </p>
      </div>

      {watchlistStocks.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No stocks added to your watchlist yet. Click the ⭐ icon on any stock in the Market page!</p>
        </div>
      ) : (
        <div className="table-container card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ width: '40px' }}></th>
                <th>TICKER</th>
                <th>NAME</th>
                <th>SECTOR</th>
                <th>PRICE</th>
                <th style={{ textAlign: 'right' }}>CHANGE</th>
              </tr>
            </thead>
            <tbody>
              {watchlistStocks.map((stock) => {
                const isPositive = stock.change >= 0;
                return (
                  <tr
                    key={stock.symbol}
                    className="market-row"
                    onClick={() => setSelectedStock(stock)}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleWatchlist(stock.symbol)}
                        style={{ fontSize: '1.1rem', cursor: 'pointer' }}
                        title="Remove from Watchlist"
                      >
                        ⭐
                      </button>
                    </td>
                    <td><strong style={{ color: 'var(--accent-blue)' }}>{stock.symbol}</strong></td>
                    <td>{stock.name}</td>
                    <td><span className="sector-badge">{stock.sector}</span></td>
                    <td><strong>{formatPrice(stock.price)}</strong></td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={isPositive ? 'text-green' : 'text-red'} style={{ fontWeight: '600' }}>
                        {isPositive ? '↗ +' : '↘ '}{stock.change}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedStock && (
        <StockModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onOpenTrade={handleOpenTradeFromModal}
        />
      )}

      {tradeModalData && (
        <TradeModal
          stock={tradeModalData.stock}
          tradeType={tradeModalData.type}
          initialShares={tradeModalData.shares}
          cashBalance={cashBalance}
          portfolio={portfolio}
          onClose={() => setTradeModalData(null)}
          onConfirmTrade={handleConfirmTrade}
        />
      )}
    </div>
  );
}
