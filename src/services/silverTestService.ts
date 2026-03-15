import api from './apiClient';
import { GoldTest } from '../types';

export const silverTestService = {
  getAll() {
    return api.get<GoldTest[]>('/silver-tests');
  },

  getById(id: number) {
    return api.get<GoldTest>(`/silver-tests/${id}`);
  },

  create(data: Partial<GoldTest>) {
    return api.post<GoldTest>('/silver-tests', data);
  },

  update(id: number, data: Partial<GoldTest>) {
    return api.put<GoldTest>(`/silver-tests/${id}`, data);
  },

  updateStatus(id: number, status: string) {
    return api.patch<GoldTest>(`/silver-tests/${id}/status`, { status });
  },

  delete(id: number) {
    return api.delete(`/silver-tests/${id}`);
  }
};
