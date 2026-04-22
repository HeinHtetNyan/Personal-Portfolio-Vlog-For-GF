import { useState } from 'react';
import { login } from '../api/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('july-token', data.access_token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card card">
        <div className="login-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="var(--accent)" />
            <text x="18" y="23" textAnchor="middle" fontSize="18" fontFamily="Fraunces, serif" fill="var(--accent-ink)" fontStyle="italic">j</text>
          </svg>
          <span className="login-brand">July Studio</span>
        </div>
        <h1 className="login-title">Welcome back</h1>
        <p className="text-dim" style={{ marginBottom: 24, fontSize: 13 }}>Sign in to manage your portfolio</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              type="email"
              className="field-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-accent" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
