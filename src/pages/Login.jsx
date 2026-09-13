import { useState } from 'react';

export default function Login({ onLogin }) {
  const [authType, setAuthType] = useState('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return '';
    if (pass.length > 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return 'strong';
    }
    if (pass.length >= 6) return 'fair';
    return 'weak';
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (identifier.trim()) {
      onLogin({ identifier: identifier.trim() });
    }
  };

  const switchAuthType = (type) => {
    setAuthType(type);
    setOtpSent(false);
    setIdentifier('');
    setPassword('');
  };

  const toggleSignUp = () => {
    setIsSignUp((current) => !current);
    setIdentifier('');
    setPassword('');
    setOtpSent(false);
  };

  return (
    <main className="login-bg-container">
      <section className="login-glass-card">
        <div className="login-brand">
          <div className="login-logo">C</div>
          <span>Cribly</span>
        </div>

        <div className="login-heading">
          <h1>{isSignUp ? 'Create account' : 'Welcome back'}</h1>
          <p>
            {isSignUp
              ? 'Create your Cribly trading account'
              : 'Log in to continue trading'}
          </p>
        </div>

        <div className="form-tab-group">
          <button
            type="button"
            className={`tab-btn ${authType === 'email' ? 'active' : ''}`}
            onClick={() => switchAuthType('email')}
          >
            Email
          </button>

          <button
            type="button"
            className={`tab-btn ${authType === 'phone' ? 'active' : ''}`}
            onClick={() => switchAuthType('phone')}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {authType === 'email' ? (
            <>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  placeholder="student@chitkara.edu.in"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password">Password</label>

                  {!isSignUp && (
                    <button
                      type="button"
                      className="forgot-password"
                      onClick={() => {}}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                />

                {password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div className={`strength-fill ${strength}`} />
                    </div>

                    <span className={`strength-text ${strength}`}>
                      {strength === 'strong'
                        ? 'Strong password'
                        : strength === 'fair'
                          ? 'Fair password'
                          : 'Weak password'}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  className="btn btn-primary login-action-btn"
                  onClick={() => setOtpSent(true)}
                >
                  Send OTP
                </button>
              ) : (
                <div className="form-group">
                  <label htmlFor="otp">Verification Code</label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Enter 6-digit code"
                    required
                  />

                  <span className="input-help">
                    We've sent a verification code to your phone.
                  </span>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary login-action-btn"
          >
            {isSignUp ? 'Create Account' : 'Continue'}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={() => onLogin({ identifier: 'google_user@gmail.com' })}
        >
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <p className="login-switch">
          {isSignUp
            ? 'Already have an account?'
            : "Don't have an account?"}

          <button
            type="button"
            onClick={toggleSignUp}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </p>

        <p className="login-disclaimer">
          By continuing, you agree to the Cribly terms and privacy policy.
        </p>
      </section>
    </main>
  );
}
