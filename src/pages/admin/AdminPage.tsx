import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { DataTable } from '../../components/tables/DataTable';
import { backupService, Backup } from '../../services/backupService';
import { logService, SystemLog } from '../../services/logService';
import { Database, Download, AlertTriangle, Info, AlertCircle, RefreshCw, Users, Settings, ShieldAlert } from 'lucide-react';
import { formatBytes } from '../../utils';

type AdminTab = 'users' | 'settings' | 'backups' | 'logs';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('backups');
  const [backups, setBackups] = useState<Backup[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);

  const loadBackups = async () => {
    setLoadingBackups(true);
    try {
      const res = await backupService.getAll();
      setBackups(res.data);
    } catch (error) {
      console.error('Failed to load backups:', error);
    } finally {
      setLoadingBackups(false);
    }
  };

  const loadLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await logService.getAll();
      setLogs(res.data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'backups') loadBackups();
    if (activeTab === 'logs') loadLogs();
  }, [activeTab]);

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      await backupService.create();
      await loadBackups();
    } catch (error) {
      console.error('Failed to create backup:', error);
    } finally {
      setCreatingBackup(false);
    }
  };

  const backupColumns = [
    { key: 'filename', label: 'Filename' },
    { 
      key: 'size',
      label: 'Size', 
      render: (b: Backup) => formatBytes(b.size)
    },
    { 
      key: 'createdAt',
      label: 'Created At', 
      render: (b: Backup) => new Date(b.createdAt).toLocaleString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (b: Backup) => (
        <button 
          onClick={() => window.open(`/api/backup/download/${b.filename}`, '_blank')}
          className="p-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
          title="Download Backup"
        >
          <Download size={16} />
        </button>
      )
    }
  ];

  const logColumns = [
    { 
      key: 'level',
      label: 'Level', 
      render: (l: SystemLog) => (
        <div className="flex items-center gap-2">
          {l.level === 'INFO' && <Info size={16} className="text-blue-500" />}
          {l.level === 'WARN' && <AlertTriangle size={16} className="text-amber-500" />}
          {l.level === 'ERROR' && <AlertCircle size={16} className="text-rose-500" />}
          <span className={
            l.level === 'INFO' ? 'text-blue-500' :
            l.level === 'WARN' ? 'text-amber-500' :
            'text-rose-500'
          }>{l.level}</span>
        </div>
      )
    },
    { key: 'source', label: 'Source' },
    { key: 'message', label: 'Message' },
    { 
      key: 'route', 
      label: 'Route',
      render: (l: SystemLog) => l.route ? <span className="text-zinc-400 text-xs font-mono">{l.route}</span> : '-'
    },
    { 
      key: 'ip_address', 
      label: 'IP',
      render: (l: SystemLog) => l.ip_address ? <span className="text-zinc-400 text-xs font-mono">{l.ip_address}</span> : '-'
    },
    { 
      key: 'timestamp',
      label: 'Timestamp', 
      render: (l: SystemLog) => new Date(l.timestamp).toLocaleString()
    }
  ];

  const tabs = [
    { id: 'users', label: 'Users & Roles', icon: <Users size={18} /> },
    { id: 'settings', label: 'System Settings', icon: <Settings size={18} /> },
    { id: 'backups', label: 'Database Backups', icon: <Database size={18} /> },
    { id: 'logs', label: 'System Logs', icon: <ShieldAlert size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-100">Admin Settings</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-zinc-800 text-emerald-400 border-b-2 border-emerald-500' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'users' && (
          <Card title="Users & Roles" icon={<Users size={20} className="text-blue-500" />}>
            <div className="p-8 text-center text-zinc-500">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p>User management and role-based access control coming soon.</p>
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card title="System Settings" icon={<Settings size={20} className="text-purple-500" />}>
            <div className="p-8 text-center text-zinc-500">
              <Settings size={48} className="mx-auto mb-4 opacity-20" />
              <p>Global system configuration and preferences coming soon.</p>
            </div>
          </Card>
        )}

        {activeTab === 'backups' && (
          <Card 
            title="Database Backups" 
            icon={<Database size={20} className="text-emerald-500" />}
            action={
              <button 
                onClick={handleCreateBackup}
                disabled={creatingBackup}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {creatingBackup ? <RefreshCw size={16} className="animate-spin" /> : <Database size={16} />}
                Create Backup
              </button>
            }
          >
            <div className="mt-4">
              <DataTable 
                columns={backupColumns} 
                data={backups} 
                keyExtractor={(b) => b.filename}
                emptyMessage="No backups found."
              />
            </div>
          </Card>
        )}

        {activeTab === 'logs' && (
          <Card 
            title="System Logs" 
            icon={<AlertCircle size={20} className="text-amber-500" />}
            action={
              <button 
                onClick={loadLogs}
                disabled={loadingLogs}
                className="p-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loadingLogs ? "animate-spin" : ""} />
              </button>
            }
          >
            <div className="mt-4">
              <DataTable 
                columns={logColumns} 
                data={logs} 
                keyExtractor={(l) => l.id}
                emptyMessage="No system logs found."
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
