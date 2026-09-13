import { Download } from 'lucide-react';
import { useCurrency } from '../components/CurrencyContext';

export default function History({ transactions = [] }) {
  const { formatPrice } = useCurrency();

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h2>Transaction History</h2>
          <p className="history-subtitle">
            Log of executed trades and orders
          </p>
        </div>

        <button
          className="history-pdf-button"
          onClick={handleDownloadPDF}
        >
          <Download size={17} />
          Download PDF
        </button>
      </div>

      <div className="table-container card history-table">
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
                <td
                  colSpan="7"
                  style={{
                    textAlign: 'center',
                    padding: '2.5rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  No trade transactions recorded yet.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="market-row">
                  <td style={{ fontWeight: 600 }}>
                    {tx.id}
                  </td>

                  <td>
                    <strong style={{ color: 'var(--accent-blue)' }}>
                      {tx.symbol}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={
                        tx.type === 'BUY'
                          ? 'text-green'
                          : 'text-red'
                      }
                      style={{ fontWeight: 700 }}
                    >
                      {tx.type}
                    </span>
                  </td>

                  <td>{tx.qty}</td>

                  <td>{formatPrice(tx.price)}</td>

                  <td
                    className="history-timestamp"
                  >
                    {tx.time}
                  </td>

                  <td>
                    <span
                      className="text-green"
                      style={{ fontWeight: 600 }}
                    >
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
