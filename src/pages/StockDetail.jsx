import React from 'react';
import { useParams } from 'react';

export default function StockDetail({ stocks }) {
  const { symbol } = useParams();
  const stock = stocks.find((s) => s.symbol === symbol);

  if (!stock) return <h3>Stock not found.</h3>;

  return (
    <div className="card">
      <h2>{stock.name} ({stock.symbol})</h2>
      <h3 style={{ marginTop: '0.5rem' }}>${stock.price.toFixed(2)}</h3>
      <p className={stock.change >= 0 ? 'text-green' : 'text-red'} style={{ margin: '0.5rem 0' }}>
        {stock.change >= 0 ? '▲' : '▼'} {stock.change}%
      </p>
      <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
      <p>Sector: {stock.sector}</p>
      <p>Market Cap: {stock.marketCap}</p>
      <p>Trading Volume: {stock.volume}</p>
    </div>
  );
}