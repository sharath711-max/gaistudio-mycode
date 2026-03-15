import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CustomerPage } from './pages/customers/CustomerPage';
import { TestingPage } from './pages/testing/TestingPage';
import { FinancePage } from './pages/finance/FinancePage';
import { AuditPage } from './pages/audit/AuditPage';
import { AdminPage } from './pages/admin/AdminPage';
import VerificationPage from './pages/VerificationPage';
import LoginPage from './pages/LoginPage';
import { Card } from './components/common/Card';
import { useStats } from './hooks/useStats';
import { useModal } from './context/ModalContext';
import { ModalManager } from './components/modals/ModalManager';
import { AppProviders } from './context/AppProviders';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { stats } = useStats();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { openModal } = useModal();
  const [verificationRoute, setVerificationRoute] = useState<{type: string, id: string} | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/verify/')) {
      const parts = path.split('/');
      if (parts.length === 4) {
        setVerificationRoute({ type: parts[2], id: parts[3] });
      }
    }
  }, []);

  if (verificationRoute) {
    return <VerificationPage />;
  }

  if (!user) {
    return <LoginPage />;
  }


  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <DashboardPage 
          stats={stats} 
          onAddCustomer={() => openModal('CREATE_CUSTOMER')} 
          onNewTest={() => openModal('CREATE_TEST', { type: 'gold' })} 
        />;
      case 'customers': 
        return <CustomerPage onAdd={() => openModal('CREATE_CUSTOMER')} />;
      case 'gold': 
        return <TestingPage 
          type="gold" 
          onManage={(id) => openModal('MANAGE_TEST', { testId: id, type: 'gold' })} 
          onNew={() => openModal('CREATE_TEST', { type: 'gold' })}
        />;
      case 'silver': 
        return <TestingPage 
          type="silver" 
          onManage={(id) => openModal('MANAGE_TEST', { testId: id, type: 'silver' })} 
          onNew={() => openModal('CREATE_TEST', { type: 'silver' })}
        />;
      case 'certificates': return <Card title="Certificates"><p className="text-zinc-500">Certificate management coming soon...</p></Card>;
      case 'finance': return <FinancePage />;
      case 'reports': return <Card title="Reports"><p className="text-zinc-500">Detailed reports coming soon...</p></Card>;
      case 'audit': return <AuditPage />;
      case 'admin': return <AdminPage />;
      default: return <DashboardPage stats={stats} onAddCustomer={() => openModal('CREATE_CUSTOMER')} onNewTest={() => openModal('CREATE_TEST', { type: 'gold' })} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isSidebarOpen={isSidebarOpen} 
      setIsSidebarOpen={setIsSidebarOpen}
    >
      {renderContent()}
      <ModalManager />
    </Layout>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
