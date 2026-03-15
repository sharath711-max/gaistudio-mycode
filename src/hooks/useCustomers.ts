import { useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';

export const useCustomers = () => {
  return useContext(CustomerContext);
};
