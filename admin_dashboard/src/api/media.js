import client from './client';

export const getMedia = () =>
  client.get('/api/admin/media').then(r => r.data);

export const uploadMedia = (file, onProgress) => {
  const form = new FormData();
  form.append('file', file);
  return client.post('/api/admin/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded / e.total) * 100)),
  }).then(r => r.data);
};

export const deleteMedia = (id) =>
  client.delete(`/api/admin/media/${id}`);
