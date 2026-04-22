import { useMemo, Fragment } from 'react';
import Icon from './Icon.jsx';

export default function Topbar({ route, setRoute, theme, setTheme, onNewPost, onToggleTweaks, onMenuToggle }) {
  const crumbs = useMemo(() => {
    const map = {
      dashboard:     ['Studio', 'Dashboard'],
      journal:       ['Content', 'Journal'],
      'journal/new': ['Content', 'Journal', 'New post'],
      'journal/edit':['Content', 'Journal', 'Editing'],
      work:          ['Content', 'Work'],
      'work/new':    ['Content', 'Work', 'New entry'],
      media:         ['Library', 'Media'],
      messages:      ['Inbox', 'Messages'],
      settings:      ['Studio', 'Settings'],
    };
    return map[route] || ['Studio', route];
  }, [route]);

  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu-btn" onClick={onMenuToggle} title="Menu">
        <Icon name="menu" />
      </button>
      <div className="topbar-crumb">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="topbar-crumb-sep">/</span>}
            {i === crumbs.length - 1
              ? <span className="topbar-crumb-page">{c}</span>
              : <span>{c}</span>}
          </Fragment>
        ))}
      </div>

      <div className="topbar-search">
        <Icon name="search" />
        <input placeholder="Search posts, work, media…" />
        <span className="topbar-search-kbd">⌘K</span>
      </div>

      <div className="topbar-actions">
        <button className="btn btn-accent" onClick={onNewPost}>
          <Icon name="plus" size={15} /> New post
        </button>
        <button className="icon-btn" onClick={onToggleTweaks} title="Tweaks">
          <Icon name="sparkles" />
        </button>
        <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button className="icon-btn" title="Notifications"><Icon name="bell" /></button>
        <div className="avatar" title="July">j</div>
      </div>
    </header>
  );
}
