import React from 'react';

export default function TickerBar({ stocks = [] }) {
  const tickerItems = [...stocks, ...stocks, ...stocks];

  return (
    <div className="ticker-bar-container">
      <div className="ticker-track">
        {tickerItems.map((stock, idx) => (
          <div key={`${stock.symbol}-${idx}`} className="ticker-item">
            <span>{stock.symbol}</span>
            <span>${stock.price.toFixed(2)}</span>
            <span className={stock.change >= 0 ? 'text-green' : 'text-red'}>
              {stock.change >= 0 ? '+' : ''}{stock.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}