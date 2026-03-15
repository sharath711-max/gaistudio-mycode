import React from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const Card = ({ children, className, title, icon, action }: CardProps) => (
  <div className={cn("bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden", className)}>
    {(title || icon || action) && (
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          {title && <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">{title}</h3>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

export const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <Card className="relative overflow-hidden group">
    <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-110", color)} />
    <div className="flex items-center gap-4">
      <div className={cn("p-3 rounded-lg", color.replace('bg-', 'bg-opacity-20 text-'))}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-zinc-100 mt-1">{value}</p>
      </div>
    </div>
  </Card>
);
