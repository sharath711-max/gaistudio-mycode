import React, { createContext, useState, useEffect, useCallback } from 'react';
import { goldTestService } from '../services/goldTestService';
import { GoldTest } from '../types';

interface GoldTestContextType {
  tests: GoldTest[];
  loading: boolean;
  loadTests: () => Promise<void>;
}

export const GoldTestContext = createContext<GoldTestContextType>({} as GoldTestContextType);

export const GoldTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<GoldTest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await goldTestService.getAll();
      setTests(data as GoldTest[]);
    } catch (error) {
      console.error('Failed to load gold tests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  return (
    <GoldTestContext.Provider value={{ tests, loading, loadTests }}>
      {children}
    </GoldTestContext.Provider>
  );
};
