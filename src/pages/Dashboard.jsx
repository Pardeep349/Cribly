import React from 'react';

export default function Dashboard({ user }) {
  const username = user?.identifier?.split('@')[0] || 'trader';

  return (
    <div>
      {/* Top Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
            Welcome back, <span style={{ color: 'var(--accent-blue)' }}>{username}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Market is currently <span className="text-green" style={{ fontWeight: '600' }}>Open</span>
          </p>
        </div>
        <div>
          <button className="btn" style={{ border: '1px solid var(--border-color)' }}>Manage Funds</button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        {/* Left Metrics Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>PORTFOLIO</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0' }}>$190.35</div>
            <span className="text-green" style={{ fontSize: '0.8rem' }}>↗ +2.4% Market Value</span>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>CASH</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0' }}>$4,810.81</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available Balance</span>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>P&L</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0' }}>$1.16</div>
            <span className="text-green" style={{ fontSize: '0.8rem' }}>↗ +0.61%</span>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>TOTAL NET ASSETS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0' }}>$5,001.16</div>
          </div>
        </div>

        {/* Right Insights Panel */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', letterSpacing: '1px', marginBottom: '1rem' }}>MARKET INSIGHTS</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SENTIMENT</span>
                <h2 className="text-red" style={{ marginTop: '0.2rem' }}>BEARISH</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>INSIGHT SCORE</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>53%</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem', fontStyle: 'italic' }}>
              "The market is currently in a bearish phase. (Note: Simulated live analytical data stream active)."
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span className="text-green" style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>🌐 ALPHA OPS</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>AI Integration operational</p>
            </div>
            <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span className="text-red" style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>⚠️ RISK VECTORS</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Inflation volatility concerns</p>
            </div>
          </div>

          <div style={{ flex: 1, background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ℹ️ Live Asset News Stream Connecting...</span>
          </div>
        </div>
      </div>
    </div>
  );
}