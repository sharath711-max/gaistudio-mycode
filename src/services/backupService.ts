import apiClient from './apiClient';

export interface Backup {
  filename: string;
  size: number;
  createdAt: string;
}

export const backupService = {
  getAll: () => apiClient.get<Backup[]>('/backup'),
  
  create: () => apiClient.post<{ success: boolean; filename: string }>('/backup'),
};
