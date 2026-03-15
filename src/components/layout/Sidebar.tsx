import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Beaker, 
  FileText, 
  IndianRupee, 
  BarChart3, 
  Settings,
  LogOut, 
  User 
} from 'lucide-react';
import { cn } from '../../utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg",
      active 
        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    )}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
}

export const Sidebar = ({ activeTab, setActiveTab, isOpen }: SidebarProps) => {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-900 transition-transform duration-300 transform lg:relative lg:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Beaker className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">SWASTIK</h1>
              <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">Lab System</p>
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={Users} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Testing</div>
            <SidebarItem icon={Beaker} label="Gold Testing" active={activeTab === 'gold'} onClick={() => setActiveTab('gold')} />
            <SidebarItem icon={Beaker} label="Silver Testing" active={activeTab === 'silver'} onClick={() => setActiveTab('silver')} />
            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">System</div>
            <SidebarItem icon={FileText} label="Certificates" active={activeTab === 'certificates'} onClick={() => setActiveTab('certificates')} />
            <SidebarItem icon={IndianRupee} label="Finance" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
            <SidebarItem icon={BarChart3} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
            <SidebarItem icon={Settings} label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-zinc-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">Admin User</p>
              <p className="text-xs text-zinc-500 truncate">Administrator</p>
            </div>
            <button className="text-zinc-500 hover:text-rose-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
