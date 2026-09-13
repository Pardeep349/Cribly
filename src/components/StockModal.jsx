import { useMemo, useState } from 'react';
import { X, Maximize2, Settings2 } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

const TIMEFRAMES = [
  ['1D', 24],
  ['3D', 30],
  ['5D', 36],
  ['1M', 42],
  ['1Y', 52],
  ['ALL', 64]
];

function buildCandles(stock, count) {
  const seed = [...stock.symbol].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  let close = Number(stock.price) || 100;
  const candles = [];

  for (let i = 0; i < count; i += 1) {
    const wave = Math.sin((i + seed) * 0.62) * 0.012;
    const drift = ((seed % 7) - 3) * 0.0008;
    const open = close;
    const move = wave + drift + Math.sin((i + seed) * 1.71) * 0.008;
    close = Math.max(0.5, open * (1 + move));
    const high = Math.max(open, close) * (1 + 0.004 + ((i + seed) % 5) * 0.0015);
    const low = Math.min(open, close) * (1 - 0.004 - ((i + seed) % 4) * 0.0012);
    const volume = 500000 + ((i * 7919 + seed * 104729) % 1800000);
    candles.push({ open, high, low, close, volume });
  }

  return candles;
}

export default function StockModal({ stock, onClose, onOpenTrade }) {
  const [timeframe, setTimeframe] = useState('5D');
  const [shares, setShares] = useState(1);
  const { formatPrice, currency } = useCurrency();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const candleCount = TIMEFRAMES.find(([tf]) => tf === timeframe)?.[1] || 36;
  const candles = useMemo(() => buildCandles(stock, candleCount), [stock, candleCount]);

  if (!stock) return null;

  const prices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.08 || 1;
  const chartMin = minPrice - padding;
  const chartMax = maxPrice + padding;
  const priceRange = chartMax - chartMin || 1;
  const maxVolume = Math.max(...candles.map((c) => c.volume));

  const width = 760;
  const height = 350;
  const chartTop = 20;
  const chartBottom = 275;
  const chartHeight = chartBottom - chartTop;
  const left = 12;
  const right = 70;
  const plotWidth = width - left - right;
  const step = plotWidth / candles.length;
  const candleWidth = Math.max(4, Math.min(12, step * 0.58));

  const yForPrice = (price) => chartTop + ((chartMax - price) / priceRange) * chartHeight;

  const hovered = hoveredIndex === null ? null : candles[hoveredIndex];
  const hoveredX = hoveredIndex === null ? null : left + step * hoveredIndex + step / 2;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="stock-modal stock-modal-pro" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="stock-title-row">
              <h2>{stock.symbol}</h2>
              <span className="sector-badge">{stock.sector}</span>
              <span className="chart-status">MARKET</span>
            </div>
            <p className="stock-name">{stock.name}</p>
          </div>
          <div className="chart-header-actions">
            <button title="Chart settings" aria-label="Chart settings"><Settings2 size={17} /></button>
            <button title="Fullscreen" aria-label="Fullscreen"><Maximize2 size={17} /></button>
            <button onClick={onClose} title="Close" aria-label="Close"><X size={20} /></button>
          </div>
        </div>

        <div className="quote-row">
          <div>
            <span className="quote-price">{formatPrice(stock.price)}</span>
            <span className={stock.change >= 0 ? 'text-green quote-change' : 'text-red quote-change'}>
              {stock.change >= 0 ? '+' : ''}{stock.change}%
            </span>
          </div>
          <div className="quote-meta">
            <span>O {formatPrice(candles.at(-1).open)}</span>
            <span>H {formatPrice(candles.at(-1).high)}</span>
            <span>L {formatPrice(candles.at(-1).low)}</span>
            <span>C {formatPrice(candles.at(-1).close)}</span>
          </div>
        </div>

        <div className="trading-toolbar">
          <div className="chart-type-label"><span className="candle-icon" /> Candles</div>
          <div className="timeframe-selector">
            {TIMEFRAMES.map(([tf]) => (
              <button
                key={tf}
                className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
          <span className="indicator-label">Indicators</span>
        </div>

        <div className="real-chart">
          <svg
            className="trading-svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <rect width={width} height={height} fill="#0b1220" />

            {[0, 1, 2, 3, 4, 5].map((i) => {
              const y = chartTop + (chartHeight / 5) * i;
              const price = chartMax - (priceRange / 5) * i;
              return (
                <g key={`grid-${i}`}>
                  <line x1={left} y1={y} x2={width - right} y2={y} className="chart-grid" />
                  <text x={width - right + 8} y={y + 4} className="price-axis">
                    {formatPrice(price)}
                  </text>
                </g>
              );
            })}

            {[0, 1, 2, 3, 4].map((i) => {
              const x = left + (plotWidth / 4) * i;
              return <line key={`vgrid-${i}`} x1={x} y1={chartTop} x2={x} y2={chartBottom} className="chart-grid vertical" />;
            })}

            <line x1={left} y1={chartBottom} x2={width - right} y2={chartBottom} className="volume-divider" />
            <text x={left + 4} y={chartBottom + 17} className="volume-label">VOL</text>

            {candles.map((c, i) => {
              const x = left + step * i + step / 2;
              const yHigh = yForPrice(c.high);
              const yLow = yForPrice(c.low);
              const yOpen = yForPrice(c.open);
              const yClose = yForPrice(c.close);
              const up = c.close >= c.open;
              const color = up ? '#22c55e' : '#ef4444';
              const bodyY = Math.min(yOpen, yClose);
              const bodyH = Math.max(1.5, Math.abs(yClose - yOpen));
              const volH = (c.volume / maxVolume) * 52;

              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className="candle-group"
                >
                  <rect x={x - step / 2} y={chartTop} width={step} height={chartBottom - chartTop} fill="transparent" />
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.2" />
                  <rect x={x - candleWidth / 2} y={bodyY} width={candleWidth} height={bodyH} fill={up ? '#22c55e' : '#ef4444'} />
                  <rect x={x - candleWidth / 2} y={chartBottom + 8 + (52 - volH)} width={candleWidth} height={volH} fill={up ? 'rgba(34,197,94,.38)' : 'rgba(239,68,68,.38)'} />
                </g>
              );
            })}

            <line x1={left} y1={yForPrice(stock.price)} x2={width - right} y2={yForPrice(stock.price)} className="current-price-line" />
            <rect x={width - right + 3} y={yForPrice(stock.price) - 10} width={right - 6} height="20" rx="3" className="current-price-tag" />
            <text x={width - right + 8} y={yForPrice(stock.price) + 4} className="current-price-text">{formatPrice(stock.price)}</text>

            {hovered && hoveredX !== null && (
              <>
                <line x1={hoveredX} y1={chartTop} x2={hoveredX} y2={chartBottom} className="crosshair" />
                <rect x={Math.min(hoveredX + 8, width - 180)} y="10" width="165" height="58" rx="5" className="ohlc-box" />
                <text x={Math.min(hoveredX + 18, width - 170)} y="28" className="ohlc-text">O {formatPrice(hovered.open)}  H {formatPrice(hovered.high)}</text>
                <text x={Math.min(hoveredX + 18, width - 170)} y="47" className="ohlc-text">L {formatPrice(hovered.low)}  C {formatPrice(hovered.close)}</text>
              </>
            )}
          </svg>
          <div className="chart-watermark">LOCAL MARKET DATA</div>
        </div>

        <div className="chart-footer-row">
          <span>{currency.code}</span>
          <span>Volume</span>
          <span>• Candlestick</span>
          <span className="chart-footer-spacer" />
          <span>Hover candles for OHLC</span>
        </div>

        <div className="trading-footer">
          <div className="shares-control">
            <span>Shares</span>
            <input
              type="number"
              min="1"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
          </div>
          <button className="btn btn-green" style={{ flex: 1 }} onClick={() => onOpenTrade && onOpenTrade(stock, 'BUY', shares)}>
            Buy {stock.symbol}
          </button>
          <button className="btn btn-red" style={{ flex: 1 }} onClick={() => onOpenTrade && onOpenTrade(stock, 'SELL', shares)}>
            Sell {stock.symbol}
          </button>
        </div>
      </div>
    </div>
  );
}
