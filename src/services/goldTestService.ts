import api from './apiClient';
import { GoldTest } from '../types';

export const goldTestService = {
  getAll() {
    return api.get<GoldTest[]>('/gold-tests');
  },

  getById(id: number) {
    return api.get<GoldTest>(`/gold-tests/${id}`);
  },

  create(data: Partial<GoldTest>) {
    return api.post<GoldTest>('/gold-tests', data);
  },

  update(id: number, data: Partial<GoldTest>) {
    return api.put<GoldTest>(`/gold-tests/${id}`, data);
  },

  updateStatus(id: number, status: string) {
    return api.patch<GoldTest>(`/gold-tests/${id}/status`, { status });
  },

  delete(id: number) {
    return api.delete(`/gold-tests/${id}`);
  }
};
