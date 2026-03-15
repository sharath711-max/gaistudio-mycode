import api from './apiClient';
import { Stats } from '../types';

export const statsService = {
  getStats() {
    return api.get<Stats>('/stats');
  }
};
