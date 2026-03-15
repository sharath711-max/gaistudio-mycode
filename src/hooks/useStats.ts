import { useContext } from 'react';
import { StatsContext } from '../context/StatsContext';

export const useStats = () => {
  return useContext(StatsContext);
};
