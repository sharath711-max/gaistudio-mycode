import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auditService } from '../services/auditService';
import { AuditLog } from '../types';

interface AuditContextType {
  logs: AuditLog[];
  loading: boolean;
  loadLogs: () => Promise<void>;
}

export const AuditContext = createContext<AuditContextType>({} as AuditContextType);

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await auditService.getLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <AuditContext.Provider value={{ logs, loading, loadLogs }}>
      {children}
    </AuditContext.Provider>
  );
};
