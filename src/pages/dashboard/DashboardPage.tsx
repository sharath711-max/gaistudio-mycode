import React from 'react';
import { Users, Beaker, Clock, User, ChevronRight, Plus } from 'lucide-react';
import { Card, StatCard } from '../../components/common/Card';
import { Stats } from '../../types';

interface DashboardPageProps {
  stats: Stats | null;
  onAddCustomer: () => void;
  onNewTest: () => void;
}

export const DashboardPage = ({ stats, onAddCustomer, onNewTest }: DashboardPageProps) => {
  if (!stats) return null;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Customers" value={stats.customerCount} icon={Users} color="bg-blue-500" />
        <StatCard label="Gold Tests" value={stats.goldTestCount} icon={Beaker} color="bg-amber-500" />
        <StatCard label="Silver Tests" value={stats.silverTestCount} icon={Beaker} color="bg-slate-300" />
        <StatCard label="Pending Tests" value={stats.pendingGold + stats.pendingSilver} icon={Clock} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200">New Gold Test created for Customer #{100 + i}</p>
                  <p className="text-xs text-zinc-500">2 hours ago</p>
                </div>
                <ChevronRight size={16} className="text-zinc-600" />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onNewTest}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
            >
              <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <span className="text-sm font-medium text-zinc-300">New Gold Test</span>
            </button>
            <button 
              onClick={onAddCustomer}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
            >
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <span className="text-sm font-medium text-zinc-300">Add Customer</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
