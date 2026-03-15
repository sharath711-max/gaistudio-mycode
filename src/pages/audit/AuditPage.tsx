import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { DataTable, Column } from '../../components/tables/DataTable';
import { AuditLog } from '../../types';

export const AuditPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit')
      .then(res => res.json())
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<AuditLog>[] = [
    {
      key: 'user_name',
      label: 'User',
      render: (log) => <span className="font-medium text-zinc-300">{log.user_name || 'System'}</span>
    },
    {
      key: 'action',
      label: 'Action',
      className: 'text-zinc-400'
    },
    {
      key: 'entity',
      label: 'Entity',
      render: (log) => <span className="text-zinc-400 font-mono">{log.entity} #{log.entity_id}</span>
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      className: 'text-zinc-500',
      render: (log) => new Date(log.timestamp).toLocaleString()
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">System Audit Logs</h1>
      {loading ? (
        <div className="p-12 text-center text-zinc-500 text-sm font-bold uppercase tracking-widest">Loading logs...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={logs} 
          keyExtractor={(row) => row.id} 
          emptyMessage="No audit logs found."
        />
      )}
    </div>
  );
};
