import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../components/Icon.jsx';
import { getWork, getWorkItem, createWork, updateWork, deleteWork, addWorkImage, deleteWorkImage } from '../api/work.js';
import { uploadMedia } from '../api/media.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Work({ route, setRoute }) {
  const editId = route.startsWith('work/edit/') ? Number(route.split('/')[2]) : null;
  if (route === 'work/new') return <WorkEditor setRoute={setRoute} workId={null} />;
  if (editId) return <WorkEditor setRoute={setRoute} workId={editId} />;
  return <WorkGrid setRoute={setRoute} />;
}

function WorkGrid({ setRoute }) {
  const [typeFilter, setTypeFilter] = useState('All');
  const types = ['All', 'Dish', 'Restaurant', 'Review'];

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['admin-work', typeFilter],
    queryFn: () => getWork(typeFilter !== 'All' ? { type: typeFilter.toLowerCase() } : {}),
  });

  const swatches = {
    dish: 'linear-gradient(135deg,#F4C4A0,#E89880)',
    restaurant: 'linear-gradient(135deg,#D4B07A,#A67F48)',
    review: 'linear-gradient(135deg,#A8B5A0,#7A8C6E)',
  };

  return (
    <div className="page">
      <div className="page-header page-header-row">
        <div>
          <div className="page-eyebrow">Content</div>
          <h1 className="page-title">Work</h1>
          <p className="page-sub">{items.length} entries</p>
        </div>
        <button className="btn btn-accent" onClick={() => setRoute('work/new')}>
          <Icon name="plus" /> New entry
        </button>
      </div>

      <div className="seg-control" style={{ marginBottom: 24 }}>
        {types.map(t => (
          <button key={t} className={typeFilter === t ? 'active' : ''} onClick={() => setTypeFilter(t)}>{t}</button>
        ))}
      </div>

      {error && <p className="api-error-msg">{error.message}</p>}

      {isLoading ? (
        <div className="work-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="work-card">
              <div className="work-card-swatch skeleton" />
              <div className="work-card-body">
                <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: '50%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="work-grid">
          {items.length === 0 && (
            <div style={{ gridColumn: '1/-1', padding: 48, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
              No work entries yet
            </div>
          )}
          {items.map(w => (
            <div key={w.id} className="work-card" onClick={() => setRoute('work/edit/' + w.id)}>
              <div className="work-card-swatch" style={{ background: swatches[w.type] || swatches.dish, position: 'relative' }}>
                {w.images?.[0] && (
                  <img
                    src={w.images[0].image_url.startsWith('http') ? w.images[0].image_url : `${API_BASE}${w.images[0].image_url}`}
                    alt={w.title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                  />
                )}
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <span className={'chip ' + w.type?.toLowerCase()}>{w.type}</span>
                </div>
              </div>
              <div className="work-card-body">
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{w.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-3)', fontSize: 12 }}>
                  <Icon name="mapPin" size={12} /> {w.location || '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkEditor({ setRoute, workId }) {
  const qc = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ['work-item', workId],
    queryFn: () => getWorkItem(workId),
    enabled: !!workId,
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('dish');
  const [location, setLocation] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgError, setImgError] = useState('');
  const [titleError, setTitleError] = useState(false);
  const imgInputRef = useRef();
  const titleRef = useRef();

  if (existing && !initialized) {
    setTitle(existing.title);
    setDescription(existing.description || '');
    setNotes(existing.notes || '');
    setType(existing.type || 'dish');
    setLocation(existing.location || '');
    setInitialized(true);
  }

  const saveMut = useMutation({
    mutationFn: () => {
      const data = { title, description: description || undefined, notes: notes || undefined, type, location: location || undefined };
      return workId ? updateWork(workId, data) : createWork(data);
    },
    onSuccess: (saved) => {
      qc.invalidateQueries({ queryKey: ['admin-work'] });
      if (!workId) {
        setRoute('work/edit/' + saved.id);
      } else {
        setRoute('work');
      }
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteWork(workId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-work'] });
      setRoute('work');
    },
  });

  const addImgMut = useMutation({
    mutationFn: (url) => addWorkImage(workId, url),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-item', workId] });
      qc.invalidateQueries({ queryKey: ['admin-work'] });
      setImgError('');
    },
    onError: () => setImgError('Failed to add image.'),
  });

  const handleImgFiles = async (files) => {
    const file = Array.from(files)[0];
    if (!file) return;

    let currentId = workId;

    if (!currentId) {
      if (!title) {
        setTitleError(true);
        titleRef.current?.focus();
        titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      try {
        const data = { title, description: description || undefined, notes: notes || undefined, type, location: location || undefined };
        const saved = await createWork(data);
        currentId = saved.id;
        qc.invalidateQueries({ queryKey: ['admin-work'] });
      } catch {
        setImgError('Could not save entry. Try again.');
        return;
      }
    }

    setImgError('');
    setImgUploading(true);
    try {
      // "Change" flow: delete existing image before uploading the replacement
      if (images.length > 0) {
        await deleteWorkImage(currentId, images[0].id);
      }
      const res = await uploadMedia(file);
      await addWorkImage(currentId, res.file_url);
    } catch {
      setImgError('Upload failed. Try again.');
    }
    setImgUploading(false);
    qc.invalidateQueries({ queryKey: ['work-item', currentId] });
    qc.invalidateQueries({ queryKey: ['admin-work'] });

    if (!workId) setRoute('work/edit/' + currentId);
  };

  const delImgMut = useMutation({
    mutationFn: (imgId) => deleteWorkImage(workId, imgId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-item', workId] });
      qc.invalidateQueries({ queryKey: ['admin-work'] });
    },
  });

  const images = existing?.images || [];

  return (
    <div>
      <div className="editor-toolbar">
        <button className="btn btn-ghost editor-back-btn" onClick={() => setRoute('work')}>
          <Icon name="chevronL" size={15} /> Back
        </button>
        <div className="editor-toolbar-actions">
          {saveMut.isError && <span style={{ fontSize: 11, color: '#c0392b' }}>Save failed</span>}
          {workId && (
            <button className="btn btn-soft" style={{ padding: '5px 12px', fontSize: 12 }} disabled={deleteMut.isPending}
              onClick={() => { if (confirm('Delete this work entry?')) deleteMut.mutate(); }}>
              <Icon name="trash" size={14} /> Delete
            </button>
          )}
          <button className="btn btn-accent" style={{ padding: '5px 14px', fontSize: 12 }} disabled={saveMut.isPending}
            onClick={() => {
              if (!title) { setTitleError(true); titleRef.current?.focus(); titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
              saveMut.mutate();
            }}>
            <Icon name="save" size={14} /> {saveMut.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="page">
        <div className="work-editor-grid" style={{ display: 'grid', gap: 24 }}>
          <div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label className="field-label">Title *</label>
              <input ref={titleRef} className="input" value={title}
                onChange={e => { setTitle(e.target.value); if (e.target.value) setTitleError(false); }}
                placeholder="Work title…"
                style={titleError ? { borderColor: '#c0392b', boxShadow: '0 0 0 3px rgba(192,57,43,0.15)' } : {}} />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label className="field-label">Description</label>
              <textarea className="textarea" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="A short description of this work…" />
            </div>
            <div className="field" style={{ marginBottom: 24 }}>
              <label className="field-label">Process notes</label>
              <textarea className="textarea" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Behind-the-scenes notes, technique details…" />
            </div>

            <div className="card card-pad">
              <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 16, marginBottom: 16 }}>Photos</div>
              <input id="work-img-input" ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { handleImgFiles(e.target.files); e.target.value = ''; }} />
              {images.length === 0 ? (
                <label htmlFor="work-img-input"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleImgFiles(e.dataTransfer.files); }}
                  style={{ display: 'block', border: '2px dashed var(--border-strong)', borderRadius: 'var(--r-md)', padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: 14, transition: 'border-color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}>
                  <Icon name="upload" size={20} style={{ opacity: .4, display: 'block', margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                    {imgUploading ? 'Uploading…' : 'Click or drag a photo here'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4 }}>JPG, PNG, WebP</div>
                </label>
              ) : (
                <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
                  <img src={images[0].image_url.startsWith('http') ? images[0].image_url : `${API_BASE}${images[0].image_url}`}
                    alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 8, alignItems: 'flex-end', justifyContent: 'flex-end', padding: 10, background: 'linear-gradient(to top, rgba(0,0,0,.4) 0%, transparent 50%)' }}>
                    <label htmlFor="work-img-input" style={{ background: 'rgba(255,255,255,.9)', color: 'var(--ink)', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--f-ui)' }}>
                      Change
                    </label>
                    <button onClick={() => delImgMut.mutate(images[0].id)}
                      style={{ background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>
                      Remove
                    </button>
                  </div>
                </div>
              )}
              {imgError && <p style={{ fontSize: 12, color: '#c0392b', marginBottom: 8 }}>{imgError}</p>}
              {titleError && <p style={{ fontSize: 12, color: '#c0392b', marginBottom: 8 }}>Enter a title first, then add a photo.</p>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card card-pad">
              <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 16, marginBottom: 16 }}>Details</div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label className="field-label">Type</label>
                <select className="select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="dish">Dish</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="review">Review</option>
                </select>
              </div>
              <div className="field">
                <label className="field-label">Location</label>
                <input className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Paris, Tokyo…" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
