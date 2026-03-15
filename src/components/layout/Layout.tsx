import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Layout = ({ children, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-black text-zinc-300 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
          
          <footer className="mt-12 pt-8 border-t border-zinc-800 text-center pb-8">
            <p className="text-zinc-500 text-sm">
              &copy; {new Date().getFullYear()} Swastik Gold & Silver Testing Lab. All rights reserved.
            </p>
            <p className="text-zinc-600 text-[10px] mt-1 uppercase tracking-widest">
              Precision • Integrity • Trust
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
