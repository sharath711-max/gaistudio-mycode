import React from 'react';

interface TableActionsProps {
  children: React.ReactNode;
}

export const TableActions: React.FC<TableActionsProps> = ({ children }) => {
  return (
    <div className="flex items-center gap-2">
      {children}
    </div>
  );
};
