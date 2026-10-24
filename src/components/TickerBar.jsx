import { useCurrency } from './CurrencyContext';

export default function TickerBar({ stocks = [], marketDataStatus = { source: 'demo' } }) {
  const tickerItems = [...stocks, ...stocks, ...stocks];
  const { formatPrice } = useCurrency();

  return (
    <div className="ticker-bar-container" title={marketDataStatus.source === 'live' ? 'Prices from market API' : 'Demo/fallback prices'}>
      <div className="ticker-track">
        {tickerItems.map((stock, idx) => (
          <div key={`${stock.symbol}-${idx}`} className="ticker-item">
            <span>{stock.symbol}</span>
            <span>{formatPrice(stock.price)}</span>
            <span className={stock.change >= 0 ? 'text-green' : 'text-red'}>
              {stock.change >= 0 ? '+' : ''}{stock.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
