import Icon from './Icon.jsx';

export default function Sidebar({ route, setRoute, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const items = [
    { key: 'dashboard', icon: 'home',     label: 'Dashboard' },
    { key: 'journal',   icon: 'journal',  label: 'Journal' },
    { key: 'work',      icon: 'work',     label: 'Work' },
    { key: 'messages',  icon: 'message',  label: 'Messages' },
    { key: 'settings',  icon: 'settings', label: 'Settings' },
  ];
  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 199 }}
        />
      )}
      <aside className={'sidebar' + (mobileOpen ? ' mobile-open' : '')}>
        <div className="sidebar-logo" onClick={() => setRoute('dashboard')}>
          <div className="sidebar-logo-mark">j</div>
          <div className="sidebar-logo-text">July<em>Studio</em></div>
        </div>

        <div className="sidebar-section-label">Manage</div>
        <nav className="sidebar-nav">
          {items.map(it => (
            <div
              key={it.key}
              className={'sidebar-item' + (route.startsWith(it.key) ? ' active' : '')}
              onClick={() => setRoute(it.key)}
            >
              <Icon name={it.icon} />
              <span className="sidebar-item-label">{it.label}</span>
              {it.count != null && <span className="sidebar-item-count">{it.count}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            <Icon name="chevronL" size={16} />
            <span className="sidebar-collapse-btn-label">Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}
