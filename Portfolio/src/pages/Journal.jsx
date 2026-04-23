import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReveal, fmtDate } from '../hooks';
import { IMG } from '../data';
import Blobs from '../components/Blobs';
import { getPosts } from '../api/posts';
import { API_BASE } from '../api/client';

const CATS = ['All', 'Travel', 'Food', 'Vlog', 'Personal'];
const PER_PAGE = 12;

export default function Journal({ go }) {
  useReveal();
  const [cat, setCat] = useState('All');
  const [page, setPage] = useState(1);

  const params = {
    per_page: PER_PAGE,
    page,
    ...(cat !== 'All' ? { category: cat.toLowerCase() } : {}),
  };

  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: ['posts', cat, page],
    queryFn: () => getPosts(params),
    keepPreviousData: true,
  });

  // Reset to page 1 when category changes
  const handleCatChange = (c) => { setCat(c); setPage(1); };

  const posts = apiData?.items ?? null;
  const totalPages = apiData?.pages ?? 1;

  // Fall back to static data while API loads or on error
  const staticPosts = cat === 'All' ? IMG.journal : IMG.journal.filter(j => j.cat === cat);

  const isApiReady = !isLoading && !isError && posts !== null;
  const featured = page === 1 ? (isApiReady ? posts[0] : staticPosts[0]) : null;
  const rest = isApiReady
    ? (page === 1 ? posts.slice(1) : posts)
    : staticPosts.slice(1);

  const handleClick = (item) => {
    go('post', item?.slug || null);
  };

  return (
    <div className="page" style={{ overflow: 'hidden' }}>
      <section className="container" style={{ paddingTop: 40, paddingBottom: 60, position: 'relative' }}>
        <Blobs variant="b" />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div className="reveal" style={{ color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20 }}>— Journal</div>
          <h1 className="reveal d1" style={{ fontSize: 'clamp(56px,10vw,180px)', lineHeight: .95, letterSpacing: '-0.025em' }}>
            Notes from <br />
            <em>here</em> & <span style={{ fontFamily: 'var(--script)', color: 'var(--accent)', fontSize: '1.1em', fontStyle: 'normal' }}>elsewhere</span>
          </h1>
          <p className="reveal d2" style={{ fontSize: 18, maxWidth: 560, margin: '32px auto 0' }}>Moments from places I visit and food I discover along the way.</p>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 40 }}>
        <div className="reveal" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 48, justifyContent: 'center', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '16px 0' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => handleCatChange(c)} style={{ background: cat === c ? 'var(--accent)' : 'transparent', color: cat === c ? '#fff' : 'var(--ink-2)', border: 'none', padding: '10px 22px', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13, letterSpacing: '.05em', transition: 'all .25s' }}>{c}</button>
          ))}
        </div>

        {isLoading && (
          <div className="grid-3" style={{ marginBottom: 96 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ borderRadius: 16, height: 320, background: 'var(--line)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {isError && (
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 32, textAlign: 'center' }}>
            Showing cached posts — live data temporarily unavailable.
          </p>
        )}

        {/* Featured post — first page only; static fallback shows immediately while API loads */}
        {featured && (
          <article className="reveal grid-featured" onClick={() => handleClick(featured)} style={{ cursor: 'pointer', marginBottom: 96 }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', height: 560, boxShadow: 'var(--shadow)' }}>
              {featured.cover_image_url
                ? <img src={`${API_BASE}${featured.cover_image_url}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .8s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} alt={featured.title} />
                : featured.img
                  ? <img src={featured.img} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .8s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} alt={featured.title} />
                  : <div style={{ width: '100%', height: '100%', background: 'var(--bg-2)' }} />
              }
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--bg-2)', color: 'var(--accent-ink)', padding: '8px 16px', borderRadius: 999, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase' }}>
                <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />
                Featured · {featured.category || featured.cat}
              </div>
              <h2 style={{ fontSize: 'clamp(36px,4.5vw,64px)', lineHeight: 1.05, marginTop: 24 }}>{featured.title}</h2>
              <p style={{ fontSize: 18, marginTop: 20 }}>{featured.excerpt || ''}</p>
              <div style={{ marginTop: 28, color: 'var(--ink-3)', fontSize: 13 }}>
                {fmtDate(featured.date || featured.created_at)}
              </div>
              <button className="btn btn-ghost" style={{ marginTop: 32 }}>Read story <span className="arrow">→</span></button>
            </div>
          </article>
        )}

        {/* Grid */}
        <div className="grid-3">
          {rest.map((j, i) => (
            <article key={j.id} className={`reveal d${(i % 3) + 1}`} onClick={() => handleClick(j)} style={{ cursor: 'pointer' }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', height: 320, position: 'relative' }}>
                {j.cover_image_url
                  ? <img src={`${API_BASE}${j.cover_image_url}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .8s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} alt={j.title} />
                  : j.img
                    ? <img src={j.img} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .8s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} alt={j.title} />
                    : <div style={{ width: '100%', height: '100%', background: 'var(--bg-2)' }} />
                }
                <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,.9)', color: 'var(--ink)', padding: '6px 12px', borderRadius: 999, fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase' }}>{j.category || j.cat}</div>
              </div>
              <h3 style={{ fontSize: 26, marginTop: 18, lineHeight: 1.15 }}>{j.title}</h3>
              <p style={{ marginTop: 10, fontSize: 15 }}>{j.excerpt || ''}</p>
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                {fmtDate(j.date || j.created_at)}
              </div>
            </article>
          ))}
        </div>

        {/* Pagination — only shown when API is connected and has multiple pages */}
        {isApiReady && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 72 }}>
            <button className="btn btn-ghost"
              disabled={page === 1}
              onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              ← Previous
            </button>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              Page {page} of {totalPages}
            </span>
            <button className="btn btn-ghost"
              disabled={page === totalPages}
              onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              Next →
            </button>
          </div>
        )}

      </section>
    </div>
  );
}
