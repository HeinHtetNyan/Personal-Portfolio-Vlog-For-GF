import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Icon from '../components/Icon.jsx';
import { changePassword } from '../api/auth.js';

export default function Settings({ onLogout }) {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">Studio</div>
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">Manage your account and password.</p>
      </div>
      <ProfileTab onLogout={onLogout} />
    </div>
  );
}

function ProfileTab({ onLogout }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState(null);

  const pwMut = useMutation({
    mutationFn: () => changePassword(current, next),
    onSuccess: () => {
      setMsg({ ok: true, text: 'Password updated successfully.' });
      setCurrent(''); setNext(''); setConfirm('');
    },
    onError: (err) => {
      setMsg({ ok: false, text: err.response?.data?.detail || 'Failed to update password.' });
    },
  });

  const handlePwSubmit = (e) => {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) return setMsg({ ok: false, text: 'New password must be at least 8 characters.' });
    if (next !== confirm) return setMsg({ ok: false, text: 'Passwords do not match.' });
    pwMut.mutate();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
      <div className="card card-pad">
        <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 20, marginBottom: 24 }}>Change password</div>
        <form onSubmit={handlePwSubmit}>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="field-label">Current password</label>
            <input className="input" type="password" value={current} onChange={e => setCurrent(e.target.value)} required autoComplete="current-password" />
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="field-label">New password</label>
            <input className="input" type="password" value={next} onChange={e => setNext(e.target.value)} required autoComplete="new-password" placeholder="Min 8 characters" />
          </div>
          <div className="field" style={{ marginBottom: 20 }}>
            <label className="field-label">Confirm new password</label>
            <input className="input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" />
          </div>
          {msg && (
            <p style={{ fontSize: 13, marginBottom: 16, padding: '10px 14px', borderRadius: 8,
              color: msg.ok ? '#2d6a2d' : '#c0392b',
              background: msg.ok ? '#edf7ed' : '#fdf0ef' }}>
              {msg.text}
            </p>
          )}
          <button type="submit" className="btn btn-accent" disabled={pwMut.isPending}>
            <Icon name="check" size={14} /> {pwMut.isPending ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>

      <div className="card card-pad">
        <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 20, marginBottom: 16 }}>Session</div>
        <p className="text-dim" style={{ fontSize: 13, marginBottom: 16 }}>You are currently signed in as admin.</p>
        <button className="btn btn-ghost" style={{ color: 'var(--ink-3)' }} onClick={onLogout}>
          <Icon name="logout" size={14} /> Sign out
        </button>
      </div>
    </div>
  );
}
