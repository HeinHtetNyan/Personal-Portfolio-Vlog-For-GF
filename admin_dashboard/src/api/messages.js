import client from './client';

export const getMessages = (params) =>
  client.get('/api/admin/messages', { params }).then(r => r.data);

export const markRead = (id) =>
  client.patch(`/api/admin/messages/${id}`).then(r => r.data);

export const deleteMessage = (id) =>
  client.delete(`/api/admin/messages/${id}`);
