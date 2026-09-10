import React, { useState } from 'react';
import TradeModal from '../components/TradeModal';

export default function Portfolio({
  stocks = [],
  holdings = [],
  cashBalance = 0,
  onExecuteTrade
}) {
  const [tradeModalData, setTradeModalData] = useState(null);

  // Map user holdings with live stock prices and calculated profit/loss
  const portfolioItems = holdings.map((item) => {
    const stock = stocks.find((s) => s.symbol === item.symbol) || {
      price: item.avgPrice,
      symbol: item.symbol,
      name: item.symbol,
      sector: 'UNKNOWN'
    };
    const totalValue = item.shares * stock.price;
    const totalCost = item.shares * item.avgPrice;
    const profitLoss = totalValue - totalCost;
    const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

    return {
      ...item,
      stock,
      currentPrice: stock.price,
      totalValue,
      profitLoss,
      profitLossPercent
    };
  });

  const totalPortfolioValue = portfolioItems.reduce(
    (acc, item) => acc + item.totalValue,
    0
  );

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
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Your Portfolio</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Total Value: <strong style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>${totalPortfolioValue.toFixed(2)}</strong>
        </p>
      </div>

      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th>ASSET</th>
              <th>SHARES</th>
              <th>AVG BUY PRICE</th>
              <th>CURRENT PRICE</th>
              <th>TOTAL VALUE</th>
              <th>PROFIT / LOSS</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {portfolioItems.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No open positions in your portfolio.
                </td>
              </tr>
            ) : (
              portfolioItems.map((item) => (
                <tr key={item.symbol} className="market-row">
                  <td>
                    <strong style={{ color: 'var(--accent-blue)' }}>{item.symbol}</strong>
                  </td>
                  <td>{item.shares}</td>
                  <td>${item.avgPrice.toFixed(2)}</td>
                  <td>${item.currentPrice.toFixed(2)}</td>
                  <td><strong>${item.totalValue.toFixed(2)}</strong></td>
                  <td>
                    <span className={item.profitLoss >= 0 ? 'text-green' : 'text-red'}>
                      {item.profitLoss >= 0 ? '+' : ''}${item.profitLoss.toFixed(2)} ({item.profitLoss >= 0 ? '+' : ''}{item.profitLossPercent.toFixed(2)}%)
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-red"
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() =>
                        setTradeModalData({
                          stock: item.stock,
                          type: 'SELL',
                          shares: item.shares
                        })
                      }
                    >
                      Sell Shares
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {tradeModalData && (
        <TradeModal
          stock={tradeModalData.stock}
          tradeType={tradeModalData.type}
          initialShares={tradeModalData.shares}
          cashBalance={cashBalance}
          portfolio={holdings}
          onClose={() => setTradeModalData(null)}
          onConfirmTrade={handleConfirmTrade}
        />
      )}
    </div>
  );
}