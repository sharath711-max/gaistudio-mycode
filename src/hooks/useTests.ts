import { useContext } from 'react';
import { GoldTestContext } from '../context/GoldTestContext';
import { SilverTestContext } from '../context/SilverTestContext';

export const useTests = (type: 'gold' | 'silver') => {
  const goldContext = useContext(GoldTestContext);
  const silverContext = useContext(SilverTestContext);
  
  return type === 'gold' ? goldContext : silverContext;
};
