import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import TweaksPanel from './components/TweaksPanel.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Journal from './pages/Journal.jsx';
import Work from './pages/Work.jsx';
import Messages from './pages/Messages.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const ACCENTS = {
  blush:    { accent: '#E8A5A0', soft: '#F4D4D0', ink: '#8C4A46' },
  coral:    { accent: '#E88A7A', soft: '#F7D7CE', ink: '#9B4A37' },
  sage:     { accent: '#A8B5A0', soft: '#E0E8D8', ink: '#566148' },
  lavender: { accent: '#B8A4CE', soft: '#E5DCEC', ink: '#5A4A70' },
  ochre:    { accent: '#D4B07A', soft: '#EFE0C4', ink: '#8C6A30' },
};

const DEFAULT_TWEAKS = { accent: 'blush', dashboard: 'editorial', editor: 'medium', radius: 16 };

function pathToAdminRoute(pathname) {
  const p = pathname.replace(/^\//, '') || 'dashboard';
  return p;
}

function AdminApp() {
  const [route, setRouteState] = useState(() => pathToAdminRoute(window.location.pathname));
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweaks, setTweaks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('july-admin-tweaks')) || DEFAULT_TWEAKS; }
    catch { return DEFAULT_TWEAKS; }
  });

  // Replace initial history entry with state
  useEffect(() => {
    window.history.replaceState({ route }, '', `/${route === 'dashboard' ? '' : route}`);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle browser back/forward (including mouse side buttons)
  useEffect(() => {
    const onPop = (e) => {
      const r = e.state?.route || pathToAdminRoute(window.location.pathname);
      setRouteState(r);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setRoute = (r) => {
    window.history.pushState({ route: r }, '', `/${r === 'dashboard' ? '' : r}`);
    setRouteState(r);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('july-theme', theme);
  }, [theme]);

  useEffect(() => {
    const a = ACCENTS[tweaks.accent] || ACCENTS.blush;
    const root = document.documentElement.style;
    root.setProperty('--accent', a.accent);
    root.setProperty('--accent-soft', a.soft);
    root.setProperty('--accent-ink', a.ink);
    root.setProperty('--r-lg', tweaks.radius + 'px');
    root.setProperty('--r-md', Math.max(8, tweaks.radius - 4) + 'px');
    root.setProperty('--r-xl', Math.min(32, tweaks.radius + 8) + 'px');
    localStorage.setItem('july-admin-tweaks', JSON.stringify(tweaks));
  }, [tweaks]);

  const setTweak = (k, v) => setTweaks(prev => ({ ...prev, [k]: v }));

  const handleLogout = () => {
    localStorage.removeItem('july-token');
    window.location.reload();
  };

  let content;
  if (route.startsWith('journal')) content = <Journal route={route} setRoute={setRoute} editorStyle={tweaks.editor} />;
  else if (route.startsWith('work')) content = <Work route={route} setRoute={setRoute} />;
  else if (route === 'messages') content = <Messages />;
  else if (route === 'settings') content = <Settings onLogout={handleLogout} />;
  else content = <Dashboard variant={tweaks.dashboard} setRoute={setRoute} />;

  return (
    <div className={'app' + (collapsed ? ' sidebar-collapsed' : '')}>
      <Sidebar route={route} setRoute={setRoute} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <div className="main">
        <Topbar
          route={route}
          setRoute={setRoute}
          theme={theme}
          setTheme={setTheme}
          onNewPost={() => setRoute('journal/new')}
          onToggleTweaks={() => setTweaksOpen(o => !o)}
          onMenuToggle={() => setMobileMenuOpen(o => !o)}
        />
        <div key={route}>{content}</div>
      </div>
      <TweaksPanel
        open={tweaksOpen}
        close={() => setTweaksOpen(false)}
        tweaks={tweaks}
        setTweak={setTweak}
        theme={theme}
        setTheme={setTheme}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('july-token'));

  return (
    <QueryClientProvider client={queryClient}>
      {authed ? <AdminApp /> : <Login onLogin={() => setAuthed(true)} />}
    </QueryClientProvider>
  );
}
