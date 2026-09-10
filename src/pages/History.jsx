import React from 'react';

export default function History({ transactions = [] }) {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Transaction History</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Log of executed trades and orders
        </p>
      </div>

      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>SYMBOL</th>
              <th>TYPE</th>
              <th>QUANTITY</th>
              <th>EXECUTED PRICE</th>
              <th>TIMESTAMP</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No trade transactions recorded yet.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="market-row">
                  <td style={{ fontWeight: 600 }}>{tx.id}</td>
                  <td>
                    <strong style={{ color: 'var(--accent-blue)' }}>{tx.symbol}</strong>
                  </td>
                  <td>
                    <span className={tx.type === 'BUY' ? 'text-green' : 'text-red'} style={{ fontWeight: 700 }}>
                      {tx.type}
                    </span>
                  </td>
                  <td>{tx.qty}</td>
                  <td>${tx.price.toFixed(2)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{tx.time}</td>
                  <td>
                    <span className="text-green" style={{ fontWeight: 600 }}>
                      {tx.status || 'Completed'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}