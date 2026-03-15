import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTests } from '../../hooks/useTests';
import { KanbanBoard } from '../../components/testing/KanbanBoard';

interface TestingPageProps {
  type: 'gold' | 'silver';
  onManage: (id: number) => void;
  onNew: () => void;
}

export const TestingPage = ({ type, onManage, onNew }: TestingPageProps) => {
  const { tests, loading } = useTests(type);
  const [search, setSearch] = useState('');

  const filtered = tests.filter(t => 
    t.customer_name.toLowerCase().includes(search.toLowerCase()) || 
    t.id.toString().includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder={`Search ${type} tests...`}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={onNew}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} />
          <span>New {type === 'gold' ? 'Gold' : 'Silver'} Test</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Tests...</p>
        </div>
      ) : (
        <KanbanBoard tests={filtered} onManage={onManage} type={type} />
      )}
    </div>
  );
};
