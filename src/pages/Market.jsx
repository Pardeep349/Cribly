import { useCurrency } from '../components/CurrencyContext';
import { useState } from 'react';
import { Search, Star, Filter } from 'lucide-react';
import StockModal from '../components/StockModal';
import TradeModal from '../components/TradeModal';

export default function Market({
  stocks = [],
  watchlist = [],
  onToggleWatchlist,
  onExecuteTrade,
  portfolio = [],
  cashBalance = 25000
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeModalData, setTradeModalData] = useState(null);
  const { formatPrice, formatMarketCap } = useCurrency();

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Market Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Live market coverage and trading pairs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Search Bar */}
          <div className="compact-search-bar">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search symbol or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort / Filter Sector Dropdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-card)',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}
          >
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              <option value="ALL" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
                All Sectors
              </option>
              <option value="TECHNOLOGY" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
                Technology
              </option>
              <option value="CONSUMER" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
                Consumer
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>TICKER</th>
              <th>NAME</th>
              <th>SECTOR</th>
              <th>PRICE</th>
              <th>24H CHANGE</th>
              <th>MARKET CAP</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => {
              const isWatchlisted = watchlist.includes(stock.symbol);

              return (
                <tr
                  key={stock.symbol}
                  className="market-row"
                  onClick={() => setSelectedStock(stock)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleWatchlist(stock.symbol)}
                      style={{ color: isWatchlisted ? '#f59e0b' : 'var(--text-muted)' }}
                    >
                      <Star size={16} fill={isWatchlisted ? '#f59e0b' : 'none'} />
                    </button>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-blue)' }}>{stock.symbol}</strong>
                  </td>
                  <td>{stock.name}</td>
                  <td>
                    <span className="sector-badge">{stock.sector}</span>
                  </td>
                  <td>
                    <strong>{formatPrice(stock.price)}</strong>
                  </td>
                  <td>
                    <span className={stock.change >= 0 ? 'text-green' : 'text-red'}>
                      {stock.change >= 0 ? '+' : ''}{stock.change}%
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatMarketCap(stock.marketCap)}</td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-green"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => setTradeModalData({ stock, type: 'BUY', shares: 1 })}
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
