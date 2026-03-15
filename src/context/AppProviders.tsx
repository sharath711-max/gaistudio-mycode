import React from 'react';
import { CustomerProvider } from './CustomerContext';
import { GoldTestProvider } from './GoldTestContext';
import { SilverTestProvider } from './SilverTestContext';
import { StatsProvider } from './StatsContext';
import { AuditProvider } from './AuditContext';
import { ModalProvider } from './ModalContext';
import { AuthProvider } from './AuthContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <StatsProvider>
        <CustomerProvider>
          <GoldTestProvider>
            <SilverTestProvider>
              <AuditProvider>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </AuditProvider>
            </SilverTestProvider>
          </GoldTestProvider>
        </CustomerProvider>
      </StatsProvider>
    </AuthProvider>
  );
};
