import React, { useState } from 'react';
import { X } from 'lucide-react';

const TIMEFRAME_DATA = {
  '1D': [
    { open: 187.5, high: 189.2, low: 186.8, close: 188.4, color: '#10b981' },
    { open: 188.4, high: 188.9, low: 187.2, close: 187.6, color: '#ef4444' },
    { open: 187.6, high: 189.8, low: 187.5, close: 189.65, color: '#10b981' }
  ],
  '3D': [
    { open: 182.0, high: 185.5, low: 181.2, close: 184.8, color: '#10b981' },
    { open: 184.8, high: 186.2, low: 183.9, close: 184.1, color: '#ef4444' },
    { open: 184.1, high: 188.0, low: 183.5, close: 187.2, color: '#10b981' },
    { open: 187.2, high: 189.8, low: 186.5, close: 189.65, color: '#10b981' }
  ],
  '5D': [
    { open: 182.0, high: 185.0, low: 180.0, close: 184.2, color: '#10b981' },
    { open: 184.2, high: 185.5, low: 182.1, close: 183.0, color: '#ef4444' },
    { open: 183.0, high: 187.8, low: 182.5, close: 186.9, color: '#10b981' },
    { open: 186.9, high: 187.5, low: 184.0, close: 185.1, color: '#ef4444' },
    { open: 185.1, high: 189.8, low: 184.9, close: 188.4, color: '#10b981' },
    { open: 188.4, high: 190.2, low: 188.0, close: 189.65, color: '#10b981' }
  ],
  '1M': [
    { open: 175.0, high: 179.0, low: 174.2, close: 178.5, color: '#10b981' },
    { open: 178.5, high: 182.0, low: 177.0, close: 181.2, color: '#10b981' },
    { open: 181.2, high: 183.5, low: 179.8, close: 180.5, color: '#ef4444' },
    { open: 180.5, high: 186.0, low: 180.0, close: 185.2, color: '#10b981' },
    { open: 185.2, high: 187.0, low: 183.5, close: 184.0, color: '#ef4444' },
    { open: 184.0, high: 190.5, low: 183.8, close: 189.65, color: '#10b981' }
  ],
  '1Y': [
    { open: 150.0, high: 165.0, low: 148.0, close: 162.0, color: '#10b981' },
    { open: 162.0, high: 175.0, low: 160.0, close: 170.5, color: '#10b981' },
    { open: 170.5, high: 174.0, low: 165.0, close: 168.0, color: '#ef4444' },
    { open: 168.0, high: 182.0, low: 167.0, close: 180.0, color: '#10b981' },
    { open: 180.0, high: 185.0, low: 176.0, close: 178.0, color: '#ef4444' },
    { open: 178.0, high: 192.0, low: 177.0, close: 189.65, color: '#10b981' }
  ],
  'ALL': [
    { open: 100.0, high: 135.0, low: 95.0, close: 130.0, color: '#10b981' },
    { open: 130.0, high: 155.0, low: 125.0, close: 150.0, color: '#10b981' },
    { open: 150.0, high: 160.0, low: 140.0, close: 145.0, color: '#ef4444' },
    { open: 145.0, high: 178.0, low: 142.0, close: 175.0, color: '#10b981' },
    { open: 175.0, high: 185.0, low: 168.0, close: 170.0, color: '#ef4444' },
    { open: 170.0, high: 195.0, low: 169.0, close: 189.65, color: '#10b981' }
  ]
};

export default function StockModal({ stock, onClose, onOpenTrade }) {
  const [timeframe, setTimeframe] = useState('5D');
  const [shares, setShares] = useState(1);

  if (!stock) return null;

  const currentCandles = TIMEFRAME_DATA[timeframe] || TIMEFRAME_DATA['5D'];

  // Dynamically normalize price ranges to map candles inside SVG boundaries
  const prices = currentCandles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="stock-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stock.symbol}</h2>
              <span className="sector-badge">{stock.sector}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.1rem' }}>
              {stock.name}
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>${stock.price.toFixed(2)}</span>
          <span className={stock.change >= 0 ? 'text-green' : 'text-red'} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {stock.change >= 0 ? '↗' : '↘'} {stock.change >= 0 ? '+' : ''}{stock.change}%
          </span>
        </div>

        {/* Timeframe Selector Buttons */}
        <div className="timeframe-selector">
          {['1D', '3D', '5D', '1M', '1Y', 'ALL'].map((tf) => (
            <button
              key={tf}
              className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Dynamic SVG Candlestick Chart */}
        <div className="chart-placeholder">
          <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none">
            {currentCandles.map((c, i) => {
              const xStep = 500 / (currentCandles.length + 1);
              const cx = xStep * (i + 1);

              const yHigh = 140 - ((c.high - minPrice) / priceRange) * 110 + 10;
              const yLow = 140 - ((c.low - minPrice) / priceRange) * 110 + 10;
              const yOpen = 140 - ((c.open - minPrice) / priceRange) * 110 + 10;
              const yClose = 140 - ((c.close - minPrice) / priceRange) * 110 + 10;

              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(Math.abs(yClose - yOpen), 4);

              return (
                <g key={i}>
                  {/* High/Low Wick Line */}
                  <line
                    x1={cx}
                    y1={yHigh}
                    x2={cx}
                    y2={yLow}
                    stroke={c.color}
                    strokeWidth="2"
                  />
                  {/* Open/Close Candle Body */}
                  <rect
                    x={cx - 12}
                    y={bodyTop}
                    width="24"
                    height={bodyHeight}
                    fill={c.color}
                    rx="3"
                  />
                </g>
              );
            })}
          </svg>

          <span
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}
          >
            Trading View ({timeframe})
          </span>
        </div>

        <div className="trading-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shares:</span>
            <input
              type="number"
              min="1"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '60px',
                padding: '0.4rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-main)',
                textAlign: 'center'
              }}
            />
          </div>

          <button
            className="btn btn-green"
            style={{ flex: 1 }}
            onClick={() => onOpenTrade && onOpenTrade(stock, 'BUY', shares)}
          >
            Buy {stock.symbol}
          </button>
          <button
            className="btn btn-red"
            style={{ flex: 1 }}
            onClick={() => onOpenTrade && onOpenTrade(stock, 'SELL', shares)}
          >
            Sell {stock.symbol}
          </button>
        </div>
      </div>
    </div>
  );
}