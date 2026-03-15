import React from 'react';
import { GoldTest } from '../../types';
import { cn, formatWeight } from '../../utils';
import { Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface KanbanBoardProps {
  tests: GoldTest[];
  onManage: (id: number) => void;
  type: 'gold' | 'silver';
}

export const KanbanBoard = ({ tests, onManage, type }: KanbanBoardProps) => {
  const columns = [
    { id: 'TODO', title: 'TODO', icon: <AlertCircle size={18} />, color: 'zinc' },
    { id: 'IN_PROGRESS', title: 'IN_PROGRESS', icon: <Clock size={18} />, color: 'amber' },
    { id: 'DONE', title: 'DONE', icon: <CheckCircle2 size={18} />, color: 'emerald' },
  ];

  const getTestsByStatus = (status: string) => tests.filter(t => t.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col bg-zinc-900/30 rounded-2xl border border-zinc-800/50 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                column.color === 'amber' ? "bg-amber-500/10 text-amber-500" :
                column.color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" :
                "bg-zinc-800 text-zinc-400"
              )}>
                {column.icon}
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase text-zinc-300">{column.title}</h3>
            </div>
            <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-[10px] font-bold text-zinc-500">
              {getTestsByStatus(column.id).length}
            </span>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
            {getTestsByStatus(column.id).map((test) => (
              <div 
                key={test.id}
                onClick={() => onManage(test.id)}
                className="group p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-zinc-500 tracking-wider">
                    {test.test_number || `${type === 'gold' ? 'GT' : 'ST'}-${test.id.toString().padStart(4, '0')}`}
                  </span>
                  <ArrowRight size={14} className="text-zinc-600 group-hover:text-amber-500 transition-colors" />
                </div>
                
                <h4 className="font-bold text-zinc-100 mb-1 truncate">{test.customer_name}</h4>
                
                <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    {test.item_count} items
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    {formatWeight(test.total_weight)}
                  </span>
                </div>

                {test.status === 'DONE' && (
                  <div className="mt-3 pt-3 border-t border-zinc-800/50">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                      <CheckCircle2 size={12} />
                      Ready for Certificate
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {getTestsByStatus(column.id).length === 0 && (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-zinc-800/50 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No Tests</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
