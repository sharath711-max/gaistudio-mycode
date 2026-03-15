import api from './apiClient';
import { Customer } from '../types';

export const customerService = {
  getAll() {
    return api.get<Customer[]>('/customers');
  },

  getById(id: number) {
    return api.get<Customer>(`/customers/${id}`);
  },

  create(data: Partial<Customer>) {
    return api.post<Customer>('/customers', data);
  },

  update(id: number, data: Partial<Customer>) {
    return api.put<Customer>(`/customers/${id}`, data);
  },

  delete(id: number) {
    return api.delete(`/customers/${id}`);
  }
};
