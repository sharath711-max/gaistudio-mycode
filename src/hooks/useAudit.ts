import { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

export const useAudit = () => {
  return useContext(AuditContext);
};
