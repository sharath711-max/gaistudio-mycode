import React, { createContext, useState, useEffect, useCallback } from 'react';
import { statsService } from '../services/statsService';
import { Stats } from '../types';

interface StatsContextType {
  stats: Stats | null;
  loading: boolean;
  loadStats: () => Promise<void>;
}

export const StatsContext = createContext<StatsContextType>({} as StatsContextType);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await statsService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <StatsContext.Provider value={{ stats, loading, loadStats }}>
      {children}
    </StatsContext.Provider>
  );
};
