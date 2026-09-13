import { useCurrency } from './CurrencyContext';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function TradeModal({
  stock,
  tradeType = 'BUY',
  initialShares = 1,
  cashBalance = 0,
  portfolio = [],
  onClose,
  onConfirmTrade
}) {
  const [shares, setShares] = useState(initialShares);
  const { formatPrice, formatMoney } = useCurrency();

  if (!stock) return null;

  const currentHolding = portfolio.find((item) => item.symbol === stock.symbol);
  const ownedShares = currentHolding ? currentHolding.shares : 0;
  const totalCost = shares * stock.price;
  const canAfford = tradeType === 'BUY' ? totalCost <= cashBalance : ownedShares >= shares;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canAfford) return;

    onConfirmTrade({
      symbol: stock.symbol,
      type: tradeType,
      qty: parseInt(shares, 10),
      price: stock.price
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="stock-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {tradeType} {stock.symbol}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Market Price: <strong>{formatPrice(stock.price)}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Number of Shares:
            </label>
            <input
              type="number"
              min="1"
              max={tradeType === 'SELL' ? ownedShares : undefined}
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-main)',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ backgroundColor: 'var(--bg-dark)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Value:</span>
              <strong>{formatMoney(totalCost)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Available Cash:</span>
              <span>{formatMoney(cashBalance)}</span>
            </div>
            {tradeType === 'SELL' && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Owned Shares:</span>
                <span>{ownedShares}</span>
              </div>
            )}
          </div>

          {!canAfford && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>
              {tradeType === 'BUY'
                ? 'Insufficient cash balance for this order.'
                : `You only own ${ownedShares} shares of ${stock.symbol}.`}
            </p>
          )}

          <button
            type="submit"
            disabled={!canAfford}
            className={`btn ${tradeType === 'BUY' ? 'btn-green' : 'btn-red'}`}
            style={{ width: '100%', padding: '0.75rem', opacity: canAfford ? 1 : 0.5 }}
          >
            Confirm {tradeType} Order
          </button>
        </form>
      </div>
    </div>
  );
}
