import { useQuery } from '@tanstack/react-query';
import { useReveal, fmtDate } from '../hooks';
import { POST_DETAIL } from '../data';
import { getPost, getPosts } from '../api/posts';
import { API_BASE } from '../api/client';

export default function Post({ go, slug }) {
  useReveal();

  const { data: apiPost, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPost(slug),
    enabled: !!slug,
  });

  const { data: allPostsData } = useQuery({
    queryKey: ['posts', 'All', 1],
    queryFn: () => getPosts({ per_page: 20, page: 1 }),
  });

  const morePosts = (allPostsData?.items ?? []).filter(p2 => p2.slug !== slug).slice(0, 3);

  const p = apiPost || POST_DETAIL;

  if (isError && !apiPost) {
    return (
      <div className="page" style={{ overflow: 'hidden' }}>
        <div className="container" style={{ paddingTop: 20 }}>
          <a onClick={() => go('journal')} style={{ color: 'var(--ink-3)', fontSize: 13, cursor: 'pointer' }}>← Back to Journal</a>
        </div>
        <div style={{ maxWidth: 720, margin: '120px auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 64, color: 'var(--accent)' }}>oh.</div>
          <h2 style={{ fontSize: 28, marginTop: 16 }}>Post not found.</h2>
          <p style={{ marginTop: 12, color: 'var(--ink-2)' }}>It may have moved or been unpublished.</p>
          <button className="btn btn-ghost" style={{ marginTop: 32 }} onClick={() => go('journal')}>Back to Journal</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page" style={{ overflow: 'hidden' }}>
        <div className="container" style={{ paddingTop: 20 }}>
          <a onClick={() => go('journal')} style={{ color: 'var(--ink-3)', fontSize: 13, cursor: 'pointer' }}>← Back to Journal</a>
        </div>
        <div style={{ maxWidth: 720, margin: '80px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[1, 2, 3].map(i => <div key={i} style={{ height: 24, borderRadius: 8, background: 'var(--bg-2)', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
        </div>
      </div>
    );
  }

  const coverSrc = p.cover_image_url
    ? (p.cover_image_url.startsWith('http') ? p.cover_image_url : `${API_BASE}${p.cover_image_url}`)
    : p.cover || p.img || null;

  return (
    <div className="page" style={{ overflow: 'hidden' }}>
      <div className="container" style={{ paddingTop: 20 }}>
        <a onClick={() => go('journal')} style={{ color: 'var(--ink-3)', fontSize: 13, cursor: 'pointer' }}>← Back to Journal</a>
      </div>

      <section className="container" style={{ paddingTop: 40, paddingBottom: 48, textAlign: 'center', maxWidth: 880, margin: '0 auto' }}>
        <div className="reveal" style={{ color: 'var(--accent-ink)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20 }}>
          — {p.category || p.cat}
        </div>
        <h1 className="reveal d1" style={{ fontSize: 'clamp(44px,6vw,92px)', lineHeight: 1.05, letterSpacing: '-0.015em' }}>{p.title}</h1>
        <div className="reveal d2" style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 16, color: 'var(--ink-3)', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase' }}>
          <span>{fmtDate(p.date || p.created_at)}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-3)', alignSelf: 'center' }} />
          <span>by <span style={{ fontFamily: 'var(--script)', textTransform: 'none', fontSize: 18, color: 'var(--accent)', verticalAlign: 'middle' }}>July</span></span>
        </div>
      </section>

      {coverSrc && (
        <div className="reveal container-wide" style={{ padding: 0 }}>
          <div className="post-cover">
            <img src={coverSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.title} />
          </div>
        </div>
      )}

      <article style={{ maxWidth: 720, margin: '80px auto 0', padding: '0 24px' }}>
        {p.intro && (
          <p className="reveal" style={{ fontFamily: 'var(--serif)', fontSize: 26, lineHeight: 1.5, color: 'var(--ink)', fontStyle: 'italic' }}>{p.intro}</p>
        )}

        <div style={{ margin: '48px 0' }}>
          {/* API content */}
          {p.content && !p.body && (
            <div className="reveal" style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.7, color: 'var(--ink)' }}>
              {p.content.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: 28 }}>{para}</p>
              ))}
            </div>
          )}

          {/* Static rich body blocks */}
          {p.body && p.body.map((b, i) => {
            if (b.type === 'p') return (
              <p key={i} className="reveal" style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.7, color: 'var(--ink)', marginBottom: 28 }}>{b.text}</p>
            );
            if (b.type === 'pull') return (
              <blockquote key={i} className="reveal" style={{ margin: '56px 0', padding: '32px 40px', borderLeft: '3px solid var(--accent)', background: 'var(--bg-2)', fontFamily: 'var(--serif)', fontSize: 30, lineHeight: 1.3, color: 'var(--ink)', fontStyle: 'italic' }}>{b.text}</blockquote>
            );
            if (b.type === 'img') return (
              <figure key={i} className="reveal" style={{ margin: '48px -120px' }}>
                <div style={{ borderRadius: 16, overflow: 'hidden' }}>
                  <img src={b.src} style={{ width: '100%', display: 'block' }} alt={b.caption || ''} />
                </div>
                {b.caption && <figcaption style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 12, textAlign: 'center' }}>{b.caption}</figcaption>}
              </figure>
            );
            if (b.type === 'two') return (
              <div key={i} className="reveal grid-2 post-two-col" style={{ margin: '48px -60px' }}>
                <div style={{ borderRadius: 12, overflow: 'hidden', height: 420 }}><img src={b.a} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /></div>
                <div style={{ borderRadius: 12, overflow: 'hidden', height: 420 }}><img src={b.b} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /></div>
              </div>
            );
            return null;
          })}
        </div>

        {/* Post photos gallery */}
        {p.images?.length > 0 && (
          <div className="reveal" style={{ margin: '60px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: p.images.length === 1 ? '1fr' : p.images.length === 2 ? '1fr 1fr' : 'repeat(3,1fr)', gap: 12 }}>
              {p.images.map(img => (
                <div key={img.id} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: p.images.length === 1 ? '16/9' : '4/3' }}>
                  <img
                    src={img.image_url.startsWith('http') ? img.image_url : `${API_BASE}${img.image_url}`}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="reveal" style={{ textAlign: 'center', margin: '80px 0 40px', fontFamily: 'var(--script)', fontSize: 32, color: 'var(--accent)' }}>— July —</div>
      </article>

      {morePosts.length > 0 && (
        <section className="container section-lg">
          <div className="reveal" style={{ color: 'var(--ink-3)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 32 }}>— Keep reading</div>
          <div className="grid-3">
            {morePosts.map((j, i) => {
              const src = j.cover_image_url
                ? (j.cover_image_url.startsWith('http') ? j.cover_image_url : `${API_BASE}${j.cover_image_url}`)
                : null;
              return (
                <article key={j.id} className={`reveal d${i + 1}`} onClick={() => go('post', j.slug)} style={{ cursor: 'pointer' }}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', height: 280, background: 'var(--bg-2)' }}>
                    {src
                      ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .8s' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                          alt={j.title} />
                      : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,var(--accent-soft),var(--bg-2))' }} />
                    }
                  </div>
                  <div style={{ marginTop: 16, fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--accent-ink)' }}>{j.category}</div>
                  <h3 style={{ fontSize: 24, marginTop: 8, lineHeight: 1.15 }}>{j.title}</h3>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
