import api from './apiClient';
import { AuditLog } from '../types';

export const auditService = {
  getLogs() {
    return api.get<AuditLog[]>('/audit');
  }
};
