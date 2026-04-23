import { useState, useEffect } from 'react';

export default function Nav({ route, go, mode, setMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const items = [
    { k: 'about',   label: 'About' },
    { k: 'work',    label: 'Work' },
    { k: 'journal', label: 'Journal' },
    { k: 'contact', label: 'Contact' },
  ];

  const navigate = (k) => { go(k); setMenuOpen(false); };

  const MoonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
  const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="logo" onClick={() => { go('home'); setMenuOpen(false); }}>
          July<span className="dot" />
        </div>
        <div className="nav-right">
          <div className="nav-links">
            {items.map((it) => (
              <a key={it.k}
                className={(route === it.k || (route === 'post' && it.k === 'journal')) ? 'active' : ''}
                onClick={() => go(it.k)}>
                {it.label}
              </a>
            ))}
          </div>
          <button className="mode-toggle" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} aria-label="Toggle mode">
            {mode === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button className="nav-mobile-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {menuOpen ? (
                <><line x1="3" y1="3" x2="15" y2="15" /><line x1="15" y1="3" x2="3" y2="15" /></>
              ) : (
                <><line x1="2" y1="5" x2="16" y2="5" /><line x1="2" y1="9" x2="16" y2="9" /><line x1="2" y1="13" x2="16" y2="13" /></>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        {items.map((it) => (
          <a key={it.k}
            className={(route === it.k || (route === 'post' && it.k === 'journal')) ? 'active' : ''}
            onClick={() => navigate(it.k)}>
            {it.label}
          </a>
        ))}
        <div className="mobile-nav-footer">
          <button className="mode-toggle" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} aria-label="Toggle mode">
            {mode === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
          <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>
            {mode === 'dark' ? 'Light mode' : 'Dark mode'}
          </span>
        </div>
      </div>
    </>
  );
}
