import client from './client';

export const getWork = (params) =>
  client.get('/api/work', { params }).then(r => r.data);

export const getWorkItem = (id) =>
  client.get(`/api/work/${id}`).then(r => r.data);

export const createWork = (data) =>
  client.post('/api/admin/work', data).then(r => r.data);

export const updateWork = (id, data) =>
  client.put(`/api/admin/work/${id}`, data).then(r => r.data);

export const deleteWork = (id) =>
  client.delete(`/api/admin/work/${id}`);

export const addWorkImage = (id, imageUrl) =>
  client.post(`/api/admin/work/${id}/images`, { image_url: imageUrl }).then(r => r.data);

export const deleteWorkImage = (workId, imgId) =>
  client.delete(`/api/admin/work/${workId}/images/${imgId}`);
