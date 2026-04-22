import client from './client';

export const getPosts = (params) =>
  client.get('/api/posts', { params }).then(r => r.data);

export const getPost = (slug) =>
  client.get(`/api/posts/${slug}`).then(r => r.data);
