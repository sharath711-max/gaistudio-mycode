import React, { createContext, useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customerService';
import { Customer } from '../types';

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  loadCustomers: () => Promise<void>;
}

export const CustomerContext = createContext<CustomerContextType>({} as CustomerContextType);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return (
    <CustomerContext.Provider value={{ customers, loading, loadCustomers }}>
      {children}
    </CustomerContext.Provider>
  );
};
