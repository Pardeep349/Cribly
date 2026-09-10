import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Login({ onLogin }) {
  const [authType, setAuthType] = useState('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (pass) => {
    if (!pass) return '';
    if (pass.length > 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 'strong';
    if (pass.length >= 6) return 'fair';
    return 'weak';
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (identifier) {
      onLogin({ identifier });
      navigate('/');
    }
  };

  return (
    <div className="login-bg-container">
      <div className="login-glass-card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
          {isSignUp ? 'Create Account' : 'Welcome back'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {isSignUp ? 'Join Cribly Trading Platform' : 'Log in to continue trading'}
        </p>

        <div className="form-tab-group">
          <button
            className={`tab-btn ${authType === 'email' ? 'active' : ''}`}
            onClick={() => { setAuthType('email'); setOtpSent(false); }}
          >
            Email
          </button>
          <button
            className={`tab-btn ${authType === 'phone' ? 'active' : ''}`}
            onClick={() => { setAuthType('phone'); setOtpSent(false); }}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {authType === 'email' ? (
            <>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="student@chitkara.edu.in"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {password && (
                  <div>
                    <div className="strength-bar">
                      <div className={`strength-fill ${strength}`} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Strength: {strength}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
              {otpSent ? (
                <div className="form-group">
                  <label>Enter OTP</label>
                  <input type="text" placeholder="6-digit code" required />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '1rem' }}
                >
                  Send OTP
                </button>
              )}
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isSignUp ? 'Sign Up' : 'Continue'}
          </button>
        </form>

        <button className="google-btn" onClick={() => onLogin({ identifier: 'google_user@gmail.com' })}>
          🌐 Continue with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}