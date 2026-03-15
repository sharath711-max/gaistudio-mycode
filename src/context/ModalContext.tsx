import React, { createContext, useContext, useState, useCallback } from 'react';

type ModalType = 
  | 'CREATE_CUSTOMER' 
  | 'EDIT_CUSTOMER' 
  | 'CUSTOMER_DETAILS'
  | 'CREATE_TEST'
  | 'MANAGE_TEST'
  | 'CONFIRM_DELETE'
  | 'PRINT_PREVIEW'
  | 'UPLOAD_PHOTO'
  | 'LEDGER_ENTRY';

interface ModalState {
  type: ModalType;
  props?: any;
}

interface ModalContextType {
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
  modal: ModalState | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalState | null>(null);

  const openModal = useCallback((type: ModalType, props?: any) => {
    setModal({ type, props });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
