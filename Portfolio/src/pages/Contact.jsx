import { useState } from 'react';
import { useReveal } from '../hooks';
import Blobs from '../components/Blobs';
import { sendMessage } from '../api/contact';

const lblS = { fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-3)', fontFamily: 'var(--sans)', display: 'block', marginBottom: 10 };
const inpS = { width: '100%', padding: '14px 0', border: 'none', borderBottom: '1px solid var(--line)', background: 'transparent', fontSize: 18, fontFamily: 'var(--serif)', color: 'var(--ink)', outline: 'none' };
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hello@julystudio.co';
const SITE_LOCATION = import.meta.env.VITE_SITE_LOCATION || 'Lisbon';
const KINDS = ['Just saying hi', 'Food', 'Travel', 'Something else'];
const SOCIAL = [
  ['Instagram', import.meta.env.VITE_SOCIAL_INSTAGRAM],
  ['Facebook',  import.meta.env.VITE_SOCIAL_FACEBOOK],
  ['Line',      import.meta.env.VITE_SOCIAL_LINE],
  ['TikTok',    import.meta.env.VITE_SOCIAL_TIKTOK],
  ['X (Twitter)', import.meta.env.VITE_SOCIAL_TWITTER],
].filter(([, url]) => url);

export default function Contact() {
  useReveal();
  const [form, setForm] = useState({ name: '', email: '', kind: 'Just saying hi', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError('');
    try {
      await sendMessage({
        name: form.name,
        email: form.email,
        message: form.message,
        category: form.kind.toLowerCase().replaceAll(' ', '_'),
        subject: form.kind,
      });
      setSent(true);
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many messages. Please wait a moment.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ overflow: 'hidden' }}>
      <section className="container" style={{ paddingTop: 40, paddingBottom: 40, position: 'relative' }}>
        <Blobs variant="a" />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 80, alignItems: 'end' }}>
          <div>
            <div className="reveal" style={{ color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20 }}>— Contact</div>
            <h1 className="reveal d1" style={{ fontSize: 'clamp(56px,9vw,160px)', lineHeight: .95, letterSpacing: '-0.02em' }}>
              Let's <em>connect</em>
              <span style={{ fontFamily: 'var(--script)', color: 'var(--accent)', display: 'block', fontSize: '.55em', marginTop: 8, fontStyle: 'normal' }}>or just say hi!</span>
            </h1>
          </div>
          <p className="reveal d2" style={{ fontSize: 17, paddingBottom: 24 }}>
            If you'd like to get in touch, feel free to send a message. About food, places, or anything in between — I'm always happy to connect.
          </p>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 60 }}>
          <div className="reveal" style={{ background: 'var(--surface)', borderRadius: 28, padding: 48, border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }}>
            {!sent ? (
              <form onSubmit={submit} style={{ display: 'grid', gap: 24 }}>
                <div>
                  <label style={lblS}>01 · What should I call you?</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="First name" style={inpS} />
                </div>
                <div>
                  <label style={lblS}>02 · Where can I reach you?</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@somewhere.com" style={inpS} />
                </div>
                <div>
                  <label style={lblS}>03 · What's this about?</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                    {KINDS.map(k => (
                      <button type="button" key={k} onClick={() => setForm({ ...form, kind: k })}
                        style={{ background: form.kind === k ? 'var(--accent)' : 'transparent', color: form.kind === k ? '#fff' : 'var(--ink-2)', border: `1px solid ${form.kind === k ? 'var(--accent)' : 'var(--line)'}`, padding: '8px 16px', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13, transition: 'all .25s' }}>{k}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={lblS}>04 · What's on your mind?</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="A few sentences about what you have in mind…" style={{ ...inpS, resize: 'vertical', fontFamily: 'var(--sans)' }} />
                </div>
                {error && <p style={{ fontSize: 13, color: '#c0392b', background: '#fdf0ef', padding: '10px 14px', borderRadius: 8 }}>{error}</p>}
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ justifySelf: 'start', padding: '16px 32px' }}>
                  {loading ? 'Sending…' : 'Send the note'} {!loading && <span className="arrow">→</span>}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontFamily: 'var(--script)', fontSize: 60, color: 'var(--accent)' }}>thank you!</div>
                <h3 style={{ fontSize: 32, marginTop: 12 }}>Your note is on its way.</h3>
                <p style={{ marginTop: 12, fontSize: 16 }}>I'll reply within a few days, {form.name}. Usually sooner.</p>
                <button className="btn btn-ghost" style={{ marginTop: 32 }} onClick={() => { setSent(false); setForm({ name: '', email: '', kind: 'Collaboration', message: '' }); }}>Send another</button>
              </div>
            )}
          </div>

          <div className="reveal d2" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ padding: 32, borderRadius: 20, background: 'var(--bg-2)' }}>
              <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Direct</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 26, marginTop: 10 }}>{CONTACT_EMAIL}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>Replies within 48 hours.</div>
            </div>
            <div style={{ padding: 32, borderRadius: 20, background: 'var(--bg-2)' }}>
              <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Currently</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 26, marginTop: 10 }}>Based in {SITE_LOCATION}</div>
            </div>
            <div style={{ padding: 32, borderRadius: 20, background: 'var(--bg-2)' }}>
              <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>Find me</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {SOCIAL.map(([k, url]) => (
                  <a key={k} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)', color: 'var(--ink)', textDecoration: 'none' }}>
                    <span>{k}</span>
                    <span style={{ color: 'var(--ink-3)', fontFamily: 'var(--script)', fontSize: 20 }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
