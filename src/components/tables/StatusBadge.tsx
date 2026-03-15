import React from 'react';
import { cn } from '../../utils';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isDone = status === 'DONE' || status === 'COMPLETED';
  const isInProgress = status === 'IN_PROGRESS';

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center justify-center",
      isDone ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
      isInProgress ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
      "bg-zinc-800 text-zinc-400 border border-zinc-700"
    )}>
      {isDone ? 'COMPLETED' : isInProgress ? 'IN PROGRESS' : status}
    </span>
  );
};
