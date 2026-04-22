import { useQuery } from '@tanstack/react-query';
import Icon from '../components/Icon.jsx';
import { getPosts } from '../api/posts.js';
import { getWork } from '../api/work.js';
import { getMedia } from '../api/media.js';
import { getMessages } from '../api/messages.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Dashboard({ variant, setRoute }) {
  if (variant === 'grid') return <DashboardGrid setRoute={setRoute} />;
  return <DashboardEditorial setRoute={setRoute} />;
}

function useStats() {
  const posts    = useQuery({ queryKey: ['admin-posts'],    queryFn: () => getPosts() });
  const work     = useQuery({ queryKey: ['admin-work'],     queryFn: () => getWork() });
  const media    = useQuery({ queryKey: ['admin-media'],    queryFn: () => getMedia() });
  const messages = useQuery({ queryKey: ['admin-messages'], queryFn: () => getMessages() });
  return { posts, work, media, messages };
}

function DashboardEditorial({ setRoute }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  const { posts, work, media, messages } = useStats();

  const allPosts   = posts.data    || [];
  const allWork    = work.data     || [];
  const allMedia   = media.data    || [];
  const allMsgs    = messages.data || [];

  const published  = allPosts.filter(p => p.status === 'published');
  const drafts     = allPosts.filter(p => p.status === 'draft');
  const unread     = allMsgs.filter(m => !m.is_read);
  const recentMedia = allMedia.slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">{today}</div>
        <h1 className="page-title">Good {greet}, <em>July</em>.</h1>
        <p className="page-sub">
          {drafts.length > 0 ? `${drafts.length} draft${drafts.length > 1 ? 's' : ''} waiting.` : 'All caught up.'}
          {unread.length > 0 ? ` ${unread.length} unread message${unread.length > 1 ? 's' : ''}.` : ''}
        </p>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gap: 16, marginBottom: 40 }}>
        <StatTile label="Posts published" value={posts.isLoading ? '…' : published.length} hint={`${allPosts.length} total`}      accent="var(--accent)" />
        <StatTile label="Work entries"    value={work.isLoading    ? '…' : allWork.length}  hint="dishes · reviews"                accent="var(--sage,#A8B5A0)" />
        <StatTile label="Media files"     value={media.isLoading   ? '…' : allMedia.length} hint={`${allMedia.filter(m=>m.file_type==='video').length} videos`} accent="var(--ochre,#D4B07A)" />
        <StatTile label="Unread notes"    value={messages.isLoading? '…' : unread.length}   hint={`${allMsgs.length} total`}       accent="var(--plum,#B8A4CE)" />
      </div>

      <div className="dashboard-main" style={{ display: 'grid', gap: 24, marginBottom: 40 }}>
        {/* Latest published post */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {published[0]?.cover_image_url ? (
            <div style={{ height: 220, overflow: 'hidden' }}>
              <img src={`${API_BASE}${published[0].cover_image_url}`} alt={published[0].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ height: 220, background: 'linear-gradient(135deg,var(--accent-soft),var(--surface-sunk))', display: 'grid', placeItems: 'center' }}>
              <Icon name="journal" size={40} style={{ opacity: 0.2 }} />
            </div>
          )}
          <div style={{ padding: '24px 28px 28px' }}>
            {published[0] ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span className={`chip ${published[0].category?.toLowerCase()}`}><span className="chip-dot" />{published[0].category}</span>
                  <span className="text-faint" style={{ fontSize: 12 }}>{new Date(published[0].created_at).toLocaleDateString()}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 24, fontWeight: 400, margin: '0 0 8px', lineHeight: 1.2 }}>{published[0].title}</h3>
                <p className="text-dim" style={{ fontSize: 14, margin: 0, lineHeight: 1.55, fontStyle: 'italic', fontWeight: 300 }}>{published[0].excerpt}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn-soft" onClick={() => setRoute('journal/edit/' + published[0].id)}>
                    <Icon name="edit" /> Edit post
                  </button>
                </div>
              </>
            ) : (
              <p className="text-dim" style={{ fontSize: 14 }}>No published posts yet.</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Drafts */}
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 18, fontWeight: 400 }}>In progress</div>
                <div className="text-dim" style={{ fontSize: 12, marginTop: 2 }}>
                  {drafts.length > 0 ? `${drafts.length} draft${drafts.length > 1 ? 's' : ''} · pick up where you left off` : 'No drafts'}
                </div>
              </div>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setRoute('journal')}>
                All <Icon name="arrowRight" size={12} />
              </button>
            </div>
            {drafts.length === 0 && (
              <div className="text-faint" style={{ fontSize: 12, padding: '8px 0' }}>All posts are published.</div>
            )}
            {drafts.slice(0, 3).map(p => (
              <div key={p.id} onClick={() => setRoute('journal/edit/' + p.id)}
                style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--surface-sunk)', flexShrink: 0, overflow: 'hidden' }}>
                  {p.cover_image_url && <img src={`${API_BASE}${p.cover_image_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }} className="truncate">{p.title}</div>
                  <div className="text-faint" style={{ fontSize: 11 }}>{p.category} · {new Date(p.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Unread messages */}
          <div className="card card-pad" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 18, fontWeight: 400 }}>Recent messages</div>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setRoute('messages')}>
                All <Icon name="arrowRight" size={12} />
              </button>
            </div>
            {allMsgs.length === 0 && <div className="text-faint" style={{ fontSize: 12 }}>No messages yet.</div>}
            {allMsgs.slice(0, 3).map((m, i) => (
              <div key={m.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: m.is_read ? 'var(--surface-sunk)' : 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent-ink)', flexShrink: 0, fontSize: 12, fontWeight: 600 }}>
                  {m.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, lineHeight: 1.5 }}>
                  <div style={{ fontWeight: m.is_read ? 400 : 600 }} className="truncate">{m.name} — {m.subject || m.category}</div>
                  <div className="text-faint" style={{ fontSize: 11, marginTop: 2 }}>{new Date(m.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent media */}
      {recentMedia.length > 0 && (
        <>
          <div className="section-label">Recently uploaded</div>
          <div className="media-recent-grid">
            {recentMedia.map(m => (
              <div key={m.id} style={{ aspectRatio: '1', borderRadius: 'var(--r-md)', background: 'var(--surface-sunk)', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
>
                {m.file_type === 'image'
                  ? <img src={`${API_BASE}${m.file_url}`} alt={m.file_name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}><Icon name="video" size={24} /></div>
                }
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatTile({ label, value, hint, accent }) {
  return (
    <div className="card card-pad" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: accent, opacity: 0.8 }} />
      <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 500, marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: 38, fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      <div className="text-faint" style={{ fontSize: 11.5, marginTop: 6 }}>{hint}</div>
    </div>
  );
}

function DashboardGrid({ setRoute }) {
  const { posts, work, media, messages } = useStats();

  const allPosts = posts.data    || [];
  const allWork  = work.data     || [];
  const allMedia = media.data    || [];
  const allMsgs  = messages.data || [];

  const published = allPosts.filter(p => p.status === 'published');
  const unread    = allMsgs.filter(m => !m.is_read);

  return (
    <div className="page">
      <div className="page-header page-header-row">
        <div>
          <div className="page-eyebrow">Studio overview</div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Everything at a glance.</p>
        </div>
        <button className="btn btn-accent" onClick={() => setRoute('journal/new')}>
          <Icon name="plus" /> New post
        </button>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
        <KPI title="Posts published" value={posts.isLoading   ? '…' : published.length}  delta={`${allPosts.length} total`}   icon="journal" />
        <KPI title="Work items"      value={work.isLoading    ? '…' : allWork.length}     delta="entries"                      icon="work" />
        <KPI title="Media files"     value={media.isLoading   ? '…' : allMedia.length}    delta={`${allMedia.filter(m=>m.file_type==='video').length} videos`} icon="media" />
        <KPI title="Unread messages" value={messages.isLoading? '…' : unread.length}      delta="unread"                       icon="message" accent />
      </div>

      <div className="dashboard-main" style={{ display: 'grid', gap: 16 }}>
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 22, margin: 0, fontWeight: 400 }}>Recent posts</h3>
            <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setRoute('journal')}>
              View all <Icon name="arrowRight" size={12} />
            </button>
          </div>
          {allPosts.length === 0 && <p className="text-dim" style={{ fontSize: 13 }}>No posts yet.</p>}
          {allPosts.slice(0, 5).map(p => (
            <div key={p.id} onClick={() => setRoute('journal/edit/' + p.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderTop: '1px solid var(--border)', cursor: 'pointer' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--surface-sunk)', flexShrink: 0, overflow: 'hidden' }}>
                {p.cover_image_url && <img src={`${API_BASE}${p.cover_image_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }} className="truncate">{p.title}</div>
                <div className="text-faint" style={{ fontSize: 11, marginTop: 2 }}>{new Date(p.created_at).toLocaleDateString()} · {p.views} views</div>
              </div>
              <span className={'chip ' + p.category?.toLowerCase()}>{p.category}</span>
              <span className={'chip ' + p.status?.toLowerCase()}>{p.status}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 22, margin: 0, fontWeight: 400 }}>Messages</h3>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setRoute('messages')}>
                All <Icon name="arrowRight" size={12} />
              </button>
            </div>
            {allMsgs.length === 0 && <p className="text-dim" style={{ fontSize: 12 }}>No messages yet.</p>}
            {allMsgs.slice(0, 4).map((m, i) => (
              <div key={m.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: m.is_read ? 'var(--surface-sunk)' : 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent-ink)', flexShrink: 0, fontSize: 11, fontWeight: 600 }}>
                  {m.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5, minWidth: 0 }}>
                  <div style={{ fontWeight: m.is_read ? 400 : 600 }} className="truncate">{m.name}</div>
                  <div className="text-faint" style={{ fontSize: 11, marginTop: 2 }}>{m.subject || m.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ title, value, delta, icon, accent }) {
  return (
    <div className="card card-pad" style={{ position: 'relative', overflow: 'hidden', background: accent ? 'linear-gradient(135deg, var(--accent-soft), var(--surface))' : undefined }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-sunk)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>
          <Icon name={icon} size={15} />
        </div>
        <span className="chip" style={{ background: 'var(--surface-sunk)', color: 'var(--ink-3)', fontSize: 10 }}>{delta}</span>
      </div>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: 34, fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      <div className="text-dim" style={{ fontSize: 12, marginTop: 6 }}>{title}</div>
    </div>
  );
}
