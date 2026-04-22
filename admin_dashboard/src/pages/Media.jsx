import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../components/Icon.jsx';
import { getMedia, uploadMedia, deleteMedia } from '../api/media.js';

export default function Media() {
  const [selected, setSelected] = useState(new Set());
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const qc = useQueryClient();

  const { data: mediaList = [], isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: getMedia,
  });

  const deleteMut = useMutation({
    mutationFn: (id) => deleteMedia(id),
    onSuccess: () => {
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ['admin-media'] });
    },
  });

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleFiles = async (files) => {
    setUploading(true);
    for (const file of files) {
      try { await uploadMedia(file); } catch (e) { alert(`Failed: ${file.name}`); }
    }
    setUploading(false);
    qc.invalidateQueries({ queryKey: ['admin-media'] });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles([...e.dataTransfer.files]);
  };

  const deleteSelected = () => {
    if (!confirm(`Delete ${selected.size} file(s)?`)) return;
    selected.forEach(id => deleteMut.mutate(id));
  };

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  return (
    <div className="page">
      <div className="page-header page-header-row">
        <div>
          <div className="page-eyebrow">Library</div>
          <h1 className="page-title">Media</h1>
          <p className="page-sub">{mediaList.length} files · {mediaList.filter(m => m.file_type === 'video').length} videos</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {selected.size > 0 && (
            <button className="btn btn-danger" onClick={deleteSelected} disabled={deleteMut.isPending}>
              <Icon name="trash" size={14} /> Delete ({selected.size})
            </button>
          )}
          <button className="btn btn-accent" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Icon name="upload" size={14} /> {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: 'none' }}
            onChange={e => handleFiles([...e.target.files])} />
        </div>
      </div>

      <div
        className={'upload-zone' + (dragging ? ' dragging' : '')}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        <Icon name="upload" size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
        <div style={{ fontWeight: 500, marginBottom: 4 }}>
          {uploading ? 'Uploading…' : 'Drop files here or click to upload'}
        </div>
        <div className="text-faint" style={{ fontSize: 12 }}>JPG, PNG, MP4, WebP · max 10 MB</div>
      </div>

      {isLoading ? (
        <div className="media-grid">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton media-tile" />)}
        </div>
      ) : (
        <div className="media-grid">
          {mediaList.map(m => (
            <div key={m.id} className={'media-tile' + (selected.has(m.id) ? ' selected' : '')}
              onClick={() => toggle(m.id)}>
              {m.file_type === 'image'
                ? <img src={`${API_BASE}${m.file_url}`} alt={m.file_name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, borderRadius: 'inherit' }} />
                : <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-sunk)', display: 'grid', placeItems: 'center' }}><Icon name="video" size={32} /></div>
              }
              {m.file_type === 'video' && (
                <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.55)', color: 'white', borderRadius: 4, padding: '3px 7px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="video" size={11} /> Video
                </div>
              )}
              <div className="media-tile-overlay">
                <div style={{ fontWeight: 500, fontSize: 11, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.file_name}</div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>{m.file_size ? (m.file_size / 1024).toFixed(0) + ' KB' : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
