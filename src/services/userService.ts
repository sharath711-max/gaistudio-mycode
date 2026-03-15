import api from './apiClient';

export const userService = {
  getAll() {
    return api.get('/users');
  },

  getById(id: number) {
    return api.get(`/users/${id}`);
  },

  create(data: any) {
    return api.post('/users', data);
  },

  update(id: number, data: any) {
    return api.put(`/users/${id}`, data);
  },

  delete(id: number) {
    return api.delete(`/users/${id}`);
  }
};
