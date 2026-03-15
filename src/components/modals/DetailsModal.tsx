import React from 'react';
import { Modal, ModalProps } from '../common/Modal';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
}

export const DetailsModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  actions
}: DetailsModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {actions}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-all"
          >
            Close
          </button>
        </div>
      }
    >
      {children}
    </Modal>
  );
};
