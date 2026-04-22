import client from './client';

export const sendMessage = (data) =>
  client.post('/api/contact', data).then(r => r.data);
