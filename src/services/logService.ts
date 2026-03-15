import apiClient from './apiClient';

export interface SystemLog {
  id: number;
  level: 'INFO' | 'WARN' | 'ERROR';
  source: string;
  message: string;
  details?: string;
  route?: string;
  user_id?: number;
  ip_address?: string;
  timestamp: string;
}

export const logService = {
  getAll: () => apiClient.get<SystemLog[]>('/logs'),
  
  log: (level: 'INFO' | 'WARN' | 'ERROR', source: string, message: string, details?: string, route?: string, user_id?: number) => 
    apiClient.post('/logs', { level, source, message, details, route, user_id }),
    
  info: (source: string, message: string, details?: string, route?: string, user_id?: number) => 
    logService.log('INFO', source, message, details, route, user_id),
    
  warn: (source: string, message: string, details?: string, route?: string, user_id?: number) => 
    logService.log('WARN', source, message, details, route, user_id),
    
  error: (source: string, message: string, details?: string, route?: string, user_id?: number) => 
    logService.log('ERROR', source, message, details, route, user_id),
};
