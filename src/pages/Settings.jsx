import { Check, Globe2 } from 'lucide-react';
import { useCurrency } from '../components/CurrencyContext';

export default function Settings() {
  const { currencies, currencyCode, setCurrency, currency } = useCurrency();

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <h2>Settings</h2>
          <p>Customize how Cribly displays your trading values.</p>
        </div>
      </div>

      <div className="settings-card card">
        <div className="settings-card-title">
          <div className="settings-icon"><Globe2 size={20} /></div>
          <div>
            <h3>Trading Currency</h3>
            <p>Choose the currency used throughout your dashboard, market, portfolio and history.</p>
          </div>
        </div>

        <div className="currency-grid">
          {Object.values(currencies).map((item) => (
            <button
              key={item.code}
              className={`currency-option ${currencyCode === item.code ? 'selected' : ''}`}
              onClick={() => setCurrency(item.code)}
            >
              <span className="currency-flag">{item.flag}</span>
              <span className="currency-info">
                <strong>{item.code}</strong>
                <small>{item.name}</small>
              </span>
              <span className="currency-symbol">{item.symbol}</span>
              {currencyCode === item.code && <Check size={17} className="currency-check" />}
            </button>
          ))}
        </div>

        <div className="currency-note">
          <strong>Selected:</strong> {currency.flag} {currency.name} ({currency.code})
          <span> • All displayed values update instantly.</span>
        </div>
      </div>
    </div>
  );
}
