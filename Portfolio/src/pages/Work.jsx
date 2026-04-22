import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReveal } from '../hooks';
import Blobs from '../components/Blobs';
import { getWork } from '../api/work';
import { API_BASE } from '../api/client';

const CATS = ['All', 'Dish', 'Restaurant', 'Review'];
const TYPE_LABEL = { dish: 'Dishes', restaurant: 'Restaurants', review: 'Reviews' };
const HEIGHTS = [520, 480, 420, 500, 460, 440, 510, 430, 470];

export default function Work({ go }) {
  useReveal();
  const [filter, setFilter] = useState('All');
  const [hover, setHover] = useState(null);

  const { data: workItems = [], isLoading } = useQuery({
    queryKey: ['work'],
    queryFn: () => getWork(),
  });

  const filtered = filter === 'All'
    ? workItems
    : workItems.filter(w => w.type === filter.toLowerCase());

  const coverOf = (w) => {
    const img = w.images?.[0]?.image_url;
    if (!img) return null;
    return img.startsWith('http') ? img : `${API_BASE}${img}`;
  };

  return (
    <div className="page" style={{ overflow: 'hidden' }}>
      <section className="container" style={{ paddingTop: 40, paddingBottom: 60, position: 'relative' }}>
        <Blobs variant="a" />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'end' }}>
          <div>
            <div className="reveal" style={{ color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20 }}>
              — Selected Work
            </div>
            <h1 className="reveal d1" style={{ fontSize: 'clamp(56px,9vw,160px)', lineHeight: .95, letterSpacing: '-0.02em' }}>
              Food I've been <em>making</em>
            </h1>
          </div>
          <p className="reveal d2" style={{ fontSize: 17, paddingBottom: 24 }}>
            A collection of dishes I've made and places I've enjoyed eating.
          </p>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 40 }}>
        <div className="reveal" style={{ display: 'flex', gap: 8, marginBottom: 40, borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '16px 0' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ background: filter === c ? 'var(--ink)' : 'transparent', color: filter === c ? 'var(--bg)' : 'var(--ink-2)', border: 'none', padding: '10px 20px', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13, letterSpacing: '.05em', transition: 'all .25s' }}>
              {TYPE_LABEL[c.toLowerCase()] || c}{' '}
              <span style={{ opacity: .5, marginLeft: 6, fontSize: 11 }}>
                {c === 'All' ? workItems.length : workItems.filter(w => w.type === c.toLowerCase()).length}
              </span>
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ alignSelf: 'center', color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase' }}>
            {filtered.length} results
          </div>
        </div>

        {isLoading && (
          <div style={{ columnCount: 3, columnGap: 24 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ breakInside: 'avoid', marginBottom: 24, borderRadius: 18, height: HEIGHTS[i % HEIGHTS.length], background: 'var(--bg-2)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-3)' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 28, marginBottom: 12 }}>Nothing here yet</div>
            <p style={{ fontSize: 15 }}>Check back soon — new work is always in progress.</p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div style={{ columnCount: 3, columnGap: 24 }}>
            {filtered.map((w, i) => {
              const src = coverOf(w);
              const h = HEIGHTS[i % HEIGHTS.length];
              return (
                <div key={w.id} className={`reveal d${(i % 4) + 1}`}
                  onMouseEnter={() => setHover(w.id)} onMouseLeave={() => setHover(null)}
                  style={{ breakInside: 'avoid', marginBottom: 24, borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'relative', height: h, background: 'var(--bg-2)' }}>
                    {src
                      ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s', transform: hover === w.id ? 'scale(1.05)' : 'scale(1)' }} alt={w.title} />
                      : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,var(--accent-soft),var(--bg-2))' }} />
                    }
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(42,36,39,.7))', opacity: hover === w.id ? 1 : 0, transition: 'opacity .3s' }} />
                    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, color: '#fff', transform: hover === w.id ? 'translateY(0)' : 'translateY(10px)', opacity: hover === w.id ? 1 : 0, transition: 'all .35s' }}>
                      <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', opacity: .8 }}>{TYPE_LABEL[w.type] || w.type}</div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 22, marginTop: 4 }}>{w.title}</div>
                      {w.location && <div style={{ fontSize: 12, marginTop: 4, opacity: .8 }}>{w.location}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
