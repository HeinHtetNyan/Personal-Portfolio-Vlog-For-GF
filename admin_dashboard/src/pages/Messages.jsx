import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../components/Icon.jsx';
import { getMessages, markRead, deleteMessage } from '../api/messages.js';

export default function Messages() {
  const [active, setActive] = useState(null);
  const [catFilter, setCatFilter] = useState('All');
  const [showDetail, setShowDetail] = useState(false);
  const [reply, setReply] = useState('');
  const qc = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => getMessages(),
    refetchInterval: 5000,
  });

  const markMut = useMutation({
    mutationFn: markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      setActive(null);
      qc.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  const cats = ['All', ...Array.from(new Set(messages.map(m => m.category).filter(Boolean)))];
  const filtered = messages.filter(m => catFilter === 'All' || m.category === catFilter);
  const msg = messages.find(m => m.id === active);

  const handleSelect = (id) => {
    setActive(id);
    setShowDetail(true);
    setReply('');
    const m = messages.find(x => x.id === id);
    if (m && !m.is_read) markMut.mutate(id);
  };

  return (
    <div className="messages-layout">
      <div className={'messages-list' + (showDetail ? ' mobile-hide' : '')}>
        <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 22, fontWeight: 400, marginBottom: 12 }}>Messages</div>
          <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
            <div className="seg-control">
              {cats.map(c => <button key={c} className={catFilter === c ? 'active' : ''} onClick={() => setCatFilter(c)}>{c}</button>)}
            </div>
          </div>
        </div>

        {isLoading && (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 64 }} />)}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>No messages</div>
        )}

        {filtered.map(m => (
          <div key={m.id}
            className={'message-item' + (active === m.id ? ' active' : '') + (!m.is_read ? ' unread' : '')}
            onClick={() => handleSelect(m.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <div style={{ fontWeight: m.is_read ? 500 : 600, fontSize: 13.5 }}>{m.name}</div>
              <div className="text-faint" style={{ fontSize: 11 }}>{new Date(m.created_at).toLocaleDateString()}</div>
            </div>
            <div className="text-dim" style={{ fontSize: 12, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.message.slice(0, 80)}
            </div>
            <span className="chip" style={{ fontSize: 10, background: 'var(--surface-sunk)', color: 'var(--ink-3)' }}>{m.category}</span>
          </div>
        ))}
      </div>

      <div className={'messages-detail' + (!showDetail ? ' mobile-hide' : '')}>
        {!msg ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ink-3)', fontSize: 13 }}>
            Select a message
          </div>
        ) : (
          <>
            <button className="btn btn-ghost mobile-back-btn" onClick={() => setShowDetail(false)}>
              ← Back
            </button>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 26, fontWeight: 400, margin: '0 0 6px' }}>{msg.name}</h2>
                <div className="text-dim" style={{ fontSize: 13 }}>
                  {msg.email} · <span className="chip" style={{ fontSize: 10, background: 'var(--surface-sunk)', color: 'var(--ink-3)' }}>{msg.category}</span>
                </div>
                {msg.subject && <div style={{ fontSize: 13, marginTop: 4, fontStyle: 'italic' }}>{msg.subject}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost"
                  onClick={() => { if (confirm('Delete this message?')) deleteMut.mutate(msg.id); }}
                  disabled={deleteMut.isPending}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>

            <div className="card card-pad" style={{ marginBottom: 24, fontFamily: 'var(--f-display)', fontSize: 16, lineHeight: 1.75, fontWeight: 300, whiteSpace: 'pre-wrap' }}>
              {msg.message}
            </div>

            <div className="card card-pad">
              <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 16, marginBottom: 12 }}>Reply</div>
              <textarea
                className="textarea"
                rows={5}
                placeholder="Write a thoughtful reply…"
                style={{ marginBottom: 12 }}
                value={reply}
                onChange={e => setReply(e.target.value)}
              />
              <a
                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || msg.category || '')}&body=${encodeURIComponent(reply)}`}
                className="btn btn-accent"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: reply.trim() ? 1 : 0.5, pointerEvents: reply.trim() ? 'auto' : 'none' }}
              >
                <Icon name="arrowRight" size={14} /> Reply via email
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
