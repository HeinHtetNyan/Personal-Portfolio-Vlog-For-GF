import { useState, useEffect } from 'react';

export default function Nav({ route, go, mode, setMode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);

  const items = [
    { k: 'about',   label: 'About' },
    { k: 'work',    label: 'Work' },
    { k: 'journal', label: 'Journal' },
    { k: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="logo" onClick={() => go('home')}>
        July<span className="dot" />
      </div>
      <div className="nav-right">
        <div className="nav-links">
          {items.map((it) => (
            <a key={it.k} className={(route === it.k || (route === 'post' && it.k === 'journal')) ? 'active' : ''} onClick={() => go(it.k)}>
              {it.label}
            </a>
          ))}
        </div>
        <button className="mode-toggle" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} aria-label="Toggle mode">
          {mode === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
