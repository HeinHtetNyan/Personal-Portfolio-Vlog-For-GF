import client from './client';

export const getWork = (params) =>
  client.get('/api/work', { params }).then(r => r.data);
