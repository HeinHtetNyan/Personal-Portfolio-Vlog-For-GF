import client from './client';

export const getPosts = (params) =>
  client.get('/api/admin/posts', { params }).then(r => r.data);

export const getPost = (id) =>
  client.get(`/api/admin/posts/preview/${id}`).then(r => r.data);

export const createPost = (data) =>
  client.post('/api/admin/posts', data).then(r => r.data);

export const updatePost = (id, data) =>
  client.put(`/api/admin/posts/${id}`, data).then(r => r.data);

export const deletePost = (id) =>
  client.delete(`/api/admin/posts/${id}`);

export const addPostImage = (postId, image_url) =>
  client.post(`/api/admin/posts/${postId}/images`, { image_url }).then(r => r.data);

export const deletePostImage = (postId, imgId) =>
  client.delete(`/api/admin/posts/${postId}/images/${imgId}`);
