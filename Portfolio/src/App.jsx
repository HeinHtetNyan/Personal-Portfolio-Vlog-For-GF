import { useState, useEffect, useLayoutEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Nav from './components/Nav';
import Footer from './components/Footer';
import TweaksPanel, { ACCENTS } from './components/TweaksPanel';
import Home from './pages/Home';
import About from './pages/About';
import Work from './pages/Work';
import Journal from './pages/Journal';
import Post from './pages/Post';
import Contact from './pages/Contact';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
});

const DEFAULT_ACCENT = ACCENTS[0];

function pathToState(pathname) {
  const parts = pathname.replace(/^\//, '').split('/');
  const page = parts[0] || 'home';
  if (page === 'journal' && parts[1]) return { route: 'post', slug: parts[1] };
  const known = ['home', 'about', 'work', 'journal', 'contact'];
  return { route: known.includes(page) ? page : 'home', slug: null };
}

function stateToPath(route, slug) {
  if (route === 'post' && slug) return `/journal/${slug}`;
  if (route === 'home') return '/';
  return `/${route}`;
}

function PortfolioApp() {
  const initial = pathToState(window.location.pathname);
  const [route, setRoute] = useState(initial.route);
  const [postSlug, setPostSlug] = useState(initial.slug);
  const [mode, setMode] = useState('light');
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [tweaksOn, setTweaksOn] = useState(false);

  // Replace current history entry with proper state on first load
  useEffect(() => {
    window.history.replaceState(
      { route: initial.route, slug: initial.slug },
      '',
      stateToPath(initial.route, initial.slug)
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle browser back/forward buttons (including mouse side buttons)
  useEffect(() => {
    const onPop = (e) => {
      const { route: r = 'home', slug = null } = e.state || pathToState(window.location.pathname);
      setRoute(r);
      setPostSlug(slug);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--accent', accent.accent);
    r.setProperty('--accent-soft', accent.primary);
    r.setProperty('--accent-ink', accent.ink);
    r.setProperty('--blob-a', accent.soft);
  }, [accent]);

  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') setTweaksOn(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOn(false);
    };
    window.addEventListener('message', onMsg);
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  const go = (r, slug = null) => {
    const path = stateToPath(r, slug);
    window.history.pushState({ route: r, slug }, '', path);
    setRoute(r);
    setPostSlug(slug);
  };

  return (
    <div className="app">
      <Nav route={route} go={go} mode={mode} setMode={setMode} />
      {route === 'home'    && <Home    go={go} />}
      {route === 'about'   && <About   go={go} />}
      {route === 'work'    && <Work    go={go} />}
      {route === 'journal' && <Journal go={go} />}
      {route === 'post'    && <Post    go={go} slug={postSlug} />}
      {route === 'contact' && <Contact go={go} />}
      <Footer go={go} />
      <TweaksPanel enabled={tweaksOn} mode={mode} setMode={setMode} accent={accent} setAccent={setAccent} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioApp />
    </QueryClientProvider>
  );
}
