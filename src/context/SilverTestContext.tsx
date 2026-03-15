import React, { createContext, useState, useEffect, useCallback } from 'react';
import { silverTestService } from '../services/silverTestService';
import { GoldTest } from '../types';

interface SilverTestContextType {
  tests: GoldTest[];
  loading: boolean;
  loadTests: () => Promise<void>;
}

export const SilverTestContext = createContext<SilverTestContextType>({} as SilverTestContextType);

export const SilverTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<GoldTest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await silverTestService.getAll();
      setTests(data as GoldTest[]);
    } catch (error) {
      console.error('Failed to load silver tests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  return (
    <SilverTestContext.Provider value={{ tests, loading, loadTests }}>
      {children}
    </SilverTestContext.Provider>
  );
};
