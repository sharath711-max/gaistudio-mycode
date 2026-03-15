import React from 'react';
import { useModal } from '../../context/ModalContext';
import { CreateCustomerModal } from './CustomerModals/CreateCustomerModal';
import { ManageTestModal } from './TestModals/ManageTestModal';
import { CreateTestModal } from './TestModals/CreateTestModal';
import { ConfirmModal } from './ConfirmModal';

export const ModalManager: React.FC = () => {
  const { modal, closeModal } = useModal();

  if (!modal) return null;

  switch (modal.type) {
    case 'CREATE_CUSTOMER':
      return (
        <CreateCustomerModal
          isOpen={true}
          onClose={closeModal}
        />
      );
    case 'CREATE_TEST':
      return (
        <CreateTestModal
          isOpen={true}
          onClose={closeModal}
          type={modal.props?.type}
        />
      );
    case 'MANAGE_TEST':
      return (
        <ManageTestModal
          isOpen={true}
          onClose={closeModal}
          testId={modal.props?.testId}
          type={modal.props?.type}
        />
      );
    case 'CONFIRM_DELETE':
      return (
        <ConfirmModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={modal.props?.onConfirm}
          title={modal.props?.title}
          message={modal.props?.message}
          confirmLabel={modal.props?.confirmLabel}
          loading={modal.props?.loading}
        />
      );
    default:
      return null;
  }
};
