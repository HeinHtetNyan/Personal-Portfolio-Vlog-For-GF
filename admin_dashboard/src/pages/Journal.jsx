import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../components/Icon.jsx';
import { getPosts, createPost, updatePost, deletePost, getPost, addPostImage, deletePostImage } from '../api/posts.js';
import { uploadMedia } from '../api/media.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Journal({ route, setRoute, editorStyle }) {
  const editId = route.startsWith('journal/edit/') ? Number(route.split('/')[2]) : null;

  if (route === 'journal/new') {
    return <JournalEditor setRoute={setRoute} editorStyle={editorStyle} postId={null} />;
  }
  if (editId) {
    return <JournalEditor setRoute={setRoute} editorStyle={editorStyle} postId={editId} />;
  }
  return <JournalList setRoute={setRoute} />;
}

function JournalList({ setRoute }) {
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const qc = useQueryClient();

  const params = {};
  if (catFilter !== 'All') params.category = catFilter.toLowerCase();
  if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['admin-posts', catFilter, statusFilter],
    queryFn: () => getPosts(params),
  });

  const deleteMut = useMutation({
    mutationFn: deletePost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  const cats = ['All', 'Travel', 'Food', 'Vlog', 'Personal'];
  const statuses = ['All', 'Published', 'Draft'];

  return (
    <div className="page">
      <div className="page-header page-header-row">
        <div>
          <div className="page-eyebrow">Content</div>
          <h1 className="page-title">Journal</h1>
          <p className="page-sub">
            {posts.length} entries · {posts.filter(p => p.status?.toLowerCase() === 'draft').length} drafts
          </p>
        </div>
        <button className="btn btn-accent" onClick={() => setRoute('journal/new')}>
          <Icon name="plus" /> New post
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="seg-control">
          {cats.map(c => <button key={c} className={catFilter === c ? 'active' : ''} onClick={() => setCatFilter(c)}>{c}</button>)}
        </div>
        <div className="seg-control">
          {statuses.map(s => <button key={s} className={statusFilter === s ? 'active' : ''} onClick={() => setStatusFilter(s)}>{s}</button>)}
        </div>
      </div>

      {error && <p className="api-error-msg">{error.message}</p>}

      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 48 }} />)}
          </div>
        ) : (
          <div className="journal-table-wrap">
            <table className="journal-table">
              <thead>
                <tr>
                  <th style={{ width: 52 }}>Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--ink-3)' }}>No posts yet</td></tr>
                )}
                {posts.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.cover_image_url
                        ? <img src={p.cover_image_url.startsWith('http') ? p.cover_image_url : `${API_BASE}${p.cover_image_url}`} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} alt="" />
                        : <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--surface-sunk)' }} />}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13.5, marginBottom: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      <div className="text-faint" style={{ fontSize: 11, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>/{p.slug}</div>
                    </td>
                    <td><span className={'chip ' + p.category?.toLowerCase()}>{p.category}</span></td>
                    <td className="text-dim" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                      {p.date ? p.date : new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-dim" style={{ fontSize: 12 }}>{p.views?.toLocaleString() || '—'}</td>
                    <td><span className={'chip ' + p.status?.toLowerCase()}>{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="icon-btn" style={{ width: 30, height: 30 }} title="Edit"
                          onClick={() => setRoute(`journal/edit/${p.id}`)}>
                          <Icon name="edit" size={14} />
                        </button>
                        <button className="icon-btn" style={{ width: 30, height: 30, color: 'var(--ink-faint)' }} title="Delete"
                          onClick={() => { if (confirm('Delete this post?')) deleteMut.mutate(p.id); }}>
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function JournalEditor({ setRoute, editorStyle, postId }) {
  const style = editorStyle || 'medium';
  if (style === 'notion') return <EditorNotion setRoute={setRoute} postId={postId} />;
  return <EditorMedium setRoute={setRoute} postId={postId} />;
}

function EditorMedium({ setRoute, postId }) {
  const qc = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('travel');
  const [coverUrl, setCoverUrl] = useState('');
  const [postDate, setPostDate] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgError, setImgError] = useState('');
  const coverInputRef = useRef();
  const imgInputRef = useRef();

  if (existing && !initialized) {
    setTitle(existing.title);
    setBody(existing.content || '');
    setCategory(existing.category);
    setCoverUrl(existing.cover_image_url || '');
    setPostDate(existing.date || '');
    setInitialized(true);
  }

  const images = existing?.images || [];

  const saveMut = useMutation({
    mutationFn: (newStatus) => {
      const data = { title, content: body, category, status: newStatus, cover_image_url: coverUrl || undefined, date: postDate || undefined };
      return postId ? updatePost(postId, data) : createPost(data);
    },
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: ['admin-posts'] });
      if (!postId) setRoute('journal/edit/' + saved.id);
      else setRoute('journal');
    },
  });

  const addImgMut = useMutation({
    mutationFn: (url) => addPostImage(postId, url),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', postId] });
      setImgError('');
    },
    onError: () => setImgError('Failed to add image.'),
  });

  const delImgMut = useMutation({
    mutationFn: (imgId) => deletePostImage(postId, imgId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['post', postId] }),
  });

  const handleImgFiles = async (files) => {
    setImgError('');
    setImgUploading(true);
    for (const file of Array.from(files)) {
      if (images.length + 1 > 5) { setImgError('Maximum 5 photos per post.'); break; }
      try {
        const res = await uploadMedia(file);
        await addImgMut.mutateAsync(res.file_url);
      } catch {
        setImgError('Upload failed for one or more files.');
      }
    }
    setImgUploading(false);
  };

  const cats = ['travel', 'food', 'vlog', 'personal'];

  return (
    <div>
      <div className="editor-toolbar">
        <button className="btn btn-ghost editor-back-btn" onClick={() => setRoute('journal')}>
          <Icon name="chevronL" size={15} /> Back
        </button>
        <div className="editor-toolbar-actions">
          {saveMut.isError && <span style={{ fontSize: 11, color: '#c0392b' }}>Save failed</span>}
          <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}
            onClick={() => saveMut.mutate('draft')} disabled={saveMut.isPending || !title}>
            {saveMut.isPending ? 'Saving…' : 'Save draft'}
          </button>
          <button className="btn btn-accent" style={{ padding: '5px 14px', fontSize: 12 }}
            onClick={() => saveMut.mutate('published')} disabled={saveMut.isPending || !title}>
            Publish
          </button>
        </div>
      </div>

      <div className="editor-wrap">
        <div className="editor-cover" style={{ background: 'linear-gradient(135deg, #F4C4A0, #E89880)', cursor: 'pointer' }}
          onClick={() => !coverUploading && coverInputRef.current?.click()}>
          {coverUrl && <img src={coverUrl.startsWith('http') ? coverUrl : `${API_BASE}${coverUrl}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} alt="" />}
          <div className="editor-cover-overlay">
            {coverUploading
              ? <div style={{ background: 'rgba(0,0,0,.5)', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13 }}>Uploading…</div>
              : <button className="btn btn-soft" style={{ fontSize: 13 }}>
                  <Icon name="image" /> {coverUrl ? 'Change cover' : 'Add cover photo'}
                </button>
            }
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setCoverUploading(true);
              try { const res = await uploadMedia(file); setCoverUrl(res.file_url); } catch {}
              setCoverUploading(false);
              e.target.value = '';
            }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button key={c} className={'chip ' + c}
              style={{ cursor: 'pointer', opacity: category === c ? 1 : 0.5 }}
              onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        <div className="field" style={{ marginBottom: 16 }}>
          <label className="field-label">Post date</label>
          <input type="date" className="input" value={postDate} onChange={e => setPostDate(e.target.value)}
            style={{ maxWidth: 200 }} />
        </div>

        <textarea className="editor-title" rows={2} placeholder="Give this post a title…"
          value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="editor-body" rows={16} placeholder="Start writing. Your voice is enough…"
          value={body} onChange={e => setBody(e.target.value)} />

        {/* Photos section */}
        <div className="card card-pad" style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 16 }}>
              Photos <span style={{ fontSize: 12, color: 'var(--ink-3)', fontStyle: 'normal', fontFamily: 'var(--f-ui)' }}>({images.length}/5)</span>
            </div>
          </div>
          {!postId ? (
            <div style={{ textAlign: 'center', padding: '20px 16px', border: '2px dashed var(--border-strong)', borderRadius: 'var(--r-md)', color: 'var(--ink-3)' }}>
              <div style={{ fontSize: 13, marginBottom: 12 }}>Save the post first to add photos</div>
              <button className="btn btn-accent" disabled={!title || saveMut.isPending} onClick={() => saveMut.mutate('draft')}>
                <Icon name="save" size={14} /> {saveMut.isPending ? 'Saving…' : 'Save & add photos'}
              </button>
            </div>
          ) : (
            <>
              <input id="post-img-input" ref={imgInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => { handleImgFiles(e.target.files); e.target.value = ''; }} />
              {images.length < 5 && (
                <label htmlFor="post-img-input"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleImgFiles(e.dataTransfer.files); }}
                  style={{ display: 'block', border: '2px dashed var(--border-strong)', borderRadius: 'var(--r-md)', padding: '16px', textAlign: 'center', cursor: 'pointer', marginBottom: 14, transition: 'border-color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}>
                  <Icon name="upload" size={18} style={{ opacity: .4, marginBottom: 4, display: 'block', margin: '0 auto 4px' }} />
                  <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{imgUploading ? 'Uploading…' : 'Click or drag photos here'}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 3 }}>JPG, PNG, WebP · max 5</div>
                </label>
              )}
              {imgError && <p style={{ fontSize: 12, color: '#c0392b', marginBottom: 10 }}>{imgError}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {images.map(img => (
                  <div key={img.id} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden' }}>
                    <img src={img.image_url.startsWith('http') ? img.image_url : `${API_BASE}${img.image_url}`}
                      alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => delImgMut.mutate(img.id)}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 4, width: 22, height: 22, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                      <Icon name="trash" size={11} />
                    </button>
                  </div>
                ))}
                {images.length === 0 && <div style={{ gridColumn: '1/-1', color: 'var(--ink-3)', fontSize: 12, padding: '8px 0' }}>No photos yet</div>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EditorNotion({ setRoute, postId }) {
  const qc = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });

  const [blocks, setBlocks] = useState([
    { id: 'b1', type: 'h1', text: '' },
    { id: 'b2', type: 'p', text: '' },
  ]);
  const [category, setCategory] = useState('travel');
  const [initialized, setInitialized] = useState(false);

  if (existing && !initialized) {
    setBlocks([
      { id: 'b1', type: 'h1', text: existing.title },
      { id: 'b2', type: 'p', text: existing.content || '' },
    ]);
    setCategory(existing.category);
    setInitialized(true);
  }

  const saveMut = useMutation({
    mutationFn: (newStatus) => {
      const title = blocks.find(b => b.type === 'h1')?.text || 'Untitled';
      const content = blocks.filter(b => b.type !== 'h1').map(b => b.text).join('\n\n');
      const data = { title, content, category, status: newStatus };
      return postId ? updatePost(postId, data) : createPost(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-posts'] });
      setRoute('journal');
    },
  });

  const addBlock = (afterId, type = 'p') => {
    const idx = blocks.findIndex(b => b.id === afterId);
    const newBlock = { id: Date.now().toString(), type, text: '' };
    const next = [...blocks];
    next.splice(idx + 1, 0, newBlock);
    setBlocks(next);
  };
  const updateBlock = (id, text) => setBlocks(blocks.map(b => b.id === id ? { ...b, text } : b));
  const removeBlock = (id) => setBlocks(blocks.filter(b => b.id !== id));

  return (
    <div>
      <div className="editor-toolbar">
        <button title="Back" onClick={() => setRoute('journal')}
          style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)' }}>
          <Icon name="chevronL" size={16} />
        </button>
        <div className="editor-toolbar-sep" />
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Notion-style editor</span>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }}
          onClick={() => saveMut.mutate('draft')} disabled={saveMut.isPending}>
          {saveMut.isPending ? 'Saving…' : 'Save draft'}
        </button>
        <button className="btn btn-accent" style={{ padding: '5px 14px', fontSize: 12 }}
          onClick={() => saveMut.mutate('published')} disabled={saveMut.isPending}>
          Publish
        </button>
      </div>

      <div className="editor-wrap">
        {blocks.map(block => (
          <NotionBlock key={block.id} block={block}
            onChange={text => updateBlock(block.id, text)}
            onAddBelow={type => addBlock(block.id, type)}
            onRemove={() => removeBlock(block.id)} />
        ))}
        <button className="block-add-btn" onClick={() => addBlock(blocks[blocks.length - 1]?.id)}>
          <Icon name="plus" size={14} /> Add block
        </button>
      </div>
    </div>
  );
}

function NotionBlock({ block, onChange, onAddBelow, onRemove }) {
  const typeClass = { h1: 'block-h1', h2: 'block-h2', p: 'block-p', quote: 'block-quote' }[block.type] || 'block-p';
  const placeholder = { h1: 'Heading 1', h2: 'Heading 2', p: 'Write something…', quote: 'A quote…' }[block.type] || '';

  return (
    <div className="notion-block">
      <div className="block-actions">
        <button title="Drag"><Icon name="drag" size={14} /></button>
        <button title="Add below" onClick={() => onAddBelow('p')}><Icon name="plus" size={14} /></button>
      </div>
      <textarea
        className={`block-input ${typeClass}`}
        value={block.text}
        placeholder={placeholder}
        rows={1}
        onChange={e => {
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
          onChange(e.target.value);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onAddBelow('p'); }
          if (e.key === 'Backspace' && block.text === '') { e.preventDefault(); onRemove(); }
        }}
      />
    </div>
  );
}
