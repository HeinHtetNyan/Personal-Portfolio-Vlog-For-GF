import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReveal, fmtDate } from '../hooks';
import { IMG } from '../data';
import Blobs from '../components/Blobs';
import { getPosts } from '../api/posts';
import { getWork } from '../api/work';
import { API_BASE } from '../api/client';

const WORK_SPANS   = [6, 6, 4, 4, 4, 6];
const WORK_HEIGHTS = [520, 520, 380, 380, 380, 520];

export default function Home({ go }) {
  useReveal();
  const [hover, setHover] = useState(null);

  const { data: postsData } = useQuery({
    queryKey: ['posts', 'All', 1],
    queryFn: () => getPosts({ per_page: 3, page: 1 }),
  });

  const { data: workItems = [] } = useQuery({
    queryKey: ['work'],
    queryFn: () => getWork(),
  });

  const latestPosts = postsData?.items ?? [];
  const featuredWork = workItems.slice(0, 6);

  const workCover = (w) => {
    const img = w.images?.[0]?.image_url;
    if (!img) return null;
    return img.startsWith('http') ? img : `${API_BASE}${img}`;
  };

  const postCover = (p) =>
    p.cover_image_url ? `${API_BASE}${p.cover_image_url}` : null;

  return (
    <div className="page home">
      {/* HERO */}
      <section style={{ position: 'relative', padding: '40px 0 80px', overflow: 'hidden' }}>
        <Blobs variant="a" />
        <div className="container-wide" style={{ position: 'relative' }}>
          <div className="grid-hero">
            <div>
              <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink-3)', fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 28 }}>
                <span style={{ width: 32, height: 1, background: 'var(--accent)' }} />
                JULY · 2026
              </div>
              <h1 className="reveal d1" style={{ fontSize: 'clamp(64px,9vw,168px)', lineHeight: .92, letterSpacing: '-0.025em' }}>
                Hello,<br />
                I'm <span style={{ fontFamily: 'var(--script)', color: 'var(--accent)', fontSize: '1.05em', fontStyle: 'normal' }}>July</span>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: 'var(--accent)', marginLeft: 8, verticalAlign: 'middle' }} />
              </h1>
              <p className="reveal d2" style={{ fontSize: 20, maxWidth: 480, margin: '28px 0 0', color: 'var(--ink-2)' }}>
                Chef and traveler.<br />
                I cook, explore and capture the moments I love.
              </p>
              <div className="reveal d3" style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                <button className="btn btn-primary" onClick={() => go('work')}>View Work <span className="arrow">→</span></button>
                <button className="btn btn-ghost" onClick={() => go('journal')}>Read Journal</button>
              </div>
              <div className="reveal d4" style={{ display: 'flex', gap: 40, marginTop: 72, color: 'var(--ink-3)', fontSize: 13 }}>
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>7</div>
                  <div style={{ marginTop: 6, letterSpacing: '.12em', textTransform: 'uppercase', fontSize: 11 }}>Countries explored</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>50<span style={{ color: 'var(--accent)' }}>+</span></div>
                  <div style={{ marginTop: 6, letterSpacing: '.12em', textTransform: 'uppercase', fontSize: 11 }}>Dishes created</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--script)', fontSize: 44, color: 'var(--ink)', lineHeight: .8 }}>Cooking since '2018</div>
                </div>
              </div>
            </div>

            {/* RIGHT collage — keeps decorative static image */}
            <div className="reveal d2 hero-collage" style={{ position: 'relative', height: 640 }}>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--blob-a)', borderRadius: '50% 42% 48% 52%', transform: 'translate(20px,-10px)' }} />
              <div style={{ position: 'absolute', top: 40, right: 40, left: 40, bottom: 40, overflow: 'hidden', borderRadius: '48% 52% 50% 50% / 60% 55% 45% 40%', boxShadow: 'var(--shadow)' }}>
                <img src={IMG.heroPortrait} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Chef portrait" />
              </div>
              <div className="reveal d4" style={{ position: 'absolute', bottom: -20, left: -20, width: 200, height: 240, borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow)', border: '6px solid var(--bg)' }}>
                {workCover(workItems[0] || {})
                  ? <img src={workCover(workItems[0])} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Dish" />
                  : <img src={IMG.work[2].img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Dish" />
                }
              </div>
              <div className="reveal d5" style={{ position: 'absolute', top: 20, right: -10, background: 'var(--ink)', color: 'var(--bg)', fontFamily: 'var(--script)', fontSize: 32, padding: '18px 28px', borderRadius: 999, transform: 'rotate(8deg)', boxShadow: 'var(--shadow)' }}>
                currently in France
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee reveal">
        <div className="marquee-track">
          <span>market mornings</span><span className="dot" />
          <span style={{ fontStyle: 'normal', fontFamily: 'var(--script)', color: 'var(--accent)' }}>Slow food</span><span className="dot" />
          <span>quiet travel</span><span className="dot" />
          <span style={{ fontStyle: 'normal', fontFamily: 'var(--script)', color: 'var(--accent)' }}>Seasonal cooking</span><span className="dot" />
          <span>local kitchens</span><span className="dot" />
          <span style={{ fontStyle: 'normal', fontFamily: 'var(--script)', color: 'var(--accent)' }}>simple plates</span><span className="dot" />
          <span>market mornings</span><span className="dot" />
          <span style={{ fontStyle: 'normal', fontFamily: 'var(--script)', color: 'var(--accent)' }}>Slow food</span><span className="dot" />
          <span>quiet travel</span><span className="dot" />
          <span style={{ fontStyle: 'normal', fontFamily: 'var(--script)', color: 'var(--accent)' }}>Seasonal cooking</span><span className="dot" />
          <span>local kitchens</span><span className="dot" />
          <span style={{ fontStyle: 'normal', fontFamily: 'var(--script)', color: 'var(--accent)' }}>simple plates</span><span className="dot" />
        </div>
      </div>

      {/* FEATURED WORK — only renders when there is work in the DB */}
      {featuredWork.length > 0 && (
        <section className="container" style={{ paddingTop: 140 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48 }}>
            <div>
              <div className="reveal" style={{ color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 12 }}>— Featured Work</div>
              <h2 className="reveal d1" style={{ fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1 }}>Things I've cooked <em>lately</em></h2>
            </div>
            <a className="reveal d2" onClick={() => go('work')} style={{ color: 'var(--ink-2)', fontSize: 14, cursor: 'pointer', borderBottom: '1px solid var(--line)', paddingBottom: 4 }}>See all work →</a>
          </div>
          <div className="grid-12">
            {featuredWork.map((w, i) => {
              const span = WORK_SPANS[i] || 4;
              const h    = WORK_HEIGHTS[i] || 420;
              const src  = workCover(w);
              return (
                <div key={w.id} className={`reveal d${(i % 4) + 1}`}
                  onMouseEnter={() => setHover(w.id)} onMouseLeave={() => setHover(null)}
                  onClick={() => go('work')}
                  style={{ gridColumn: `span ${span}`, position: 'relative', height: h, borderRadius: 20, overflow: 'hidden', cursor: 'pointer', background: 'var(--bg-2)', boxShadow: hover === w.id ? 'var(--shadow)' : 'none', transition: 'box-shadow .3s' }}>
                  {src
                    ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .8s cubic-bezier(.2,.7,.2,1)', transform: hover === w.id ? 'scale(1.05)' : 'scale(1)' }} alt={w.title} />
                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,var(--accent-soft),var(--bg-2))' }} />
                  }
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(42,36,39,.55))', opacity: hover === w.id ? 1 : 0.6, transition: 'opacity .4s' }} />
                  <div style={{ position: 'absolute', left: 24, right: 24, bottom: 24, color: '#fff' }}>
                    <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', opacity: .8 }}>{w.type} {w.location ? `· ${w.location}` : ''}</div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 28, marginTop: 4, lineHeight: 1.1 }}>{w.title}</div>
                  </div>
                  <div style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.9)', display: 'grid', placeItems: 'center', transform: hover === w.id ? 'scale(1)' : 'scale(.6)', opacity: hover === w.id ? 1 : 0, transition: 'all .3s', color: 'var(--ink)' }}>↗</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ABOUT PREVIEW */}
      <section className="container" style={{ paddingTop: 160, position: 'relative', overflow: 'hidden' }}>
        <div className="grid-about">
          <div className="reveal" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <img src={IMG.about} style={{ width: '100%', height: 560, objectFit: 'cover' }} alt="July" />
            </div>
            <div style={{ position: 'absolute', top: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', fontFamily: 'var(--script)', color: '#fff', fontSize: 22, textAlign: 'center', lineHeight: 1.1, transform: 'rotate(-8deg)' }}>
              since<br />2018
            </div>
          </div>
          <div>
            <div className="reveal d1" style={{ color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 12 }}>— The Chef</div>
            <h2 className="reveal d2" style={{ fontSize: 'clamp(36px,4.5vw,64px)', lineHeight: 1.05 }}>I cook the way I live — <em>simple, slow, and honest</em>.</h2>
            <p className="reveal d3" style={{ marginTop: 28, fontSize: 18 }}>
              I enjoy cooking simple food and exploring new places. From local markets to everyday kitchens, I learn through what I cook and what I taste. Here, I share the things I've been making and the places I've been.
            </p>
            <button className="btn btn-ghost reveal d4" style={{ marginTop: 32 }} onClick={() => go('about')}>Read my story <span className="arrow">→</span></button>
          </div>
        </div>
      </section>

      {/* LATEST JOURNAL — only renders when there are published posts */}
      {latestPosts.length > 0 && (
        <section className="container" style={{ paddingTop: 160 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48 }}>
            <div>
              <div className="reveal" style={{ color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 12 }}>— From the Journal</div>
              <h2 className="reveal d1" style={{ fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1 }}>Recent <em>notes</em></h2>
            </div>
            <a className="reveal d2" onClick={() => go('journal')} style={{ color: 'var(--ink-2)', fontSize: 14, cursor: 'pointer', borderBottom: '1px solid var(--line)', paddingBottom: 4 }}>Read all →</a>
          </div>
          <div className="grid-3">
            {latestPosts.map((p, i) => (
              <article key={p.id} className={`reveal d${i + 1}`} onClick={() => go('post', p.slug)} style={{ cursor: 'pointer' }}>
                <div style={{ borderRadius: 16, overflow: 'hidden', height: 320, background: 'var(--bg-2)' }}>
                  {postCover(p)
                    ? <img src={postCover(p)} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .8s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        alt={p.title} />
                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,var(--accent-soft),var(--bg-2))' }} />
                  }
                </div>
                <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                  <span style={{ color: 'var(--accent-ink)' }}>{p.category}</span>
                  <span>{fmtDate(p.date || p.created_at)}</span>
                </div>
                <h3 style={{ fontSize: 26, marginTop: 10, lineHeight: 1.15 }}>{p.title}</h3>
                <p style={{ marginTop: 10, fontSize: 15 }}>{p.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
