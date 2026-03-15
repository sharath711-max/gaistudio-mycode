import React from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  loading
}) => {
  const variantClasses = {
    danger: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
    info: 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20'
  };

  const iconClasses = {
    danger: 'text-rose-500 bg-rose-500/10',
    warning: 'text-amber-500 bg-amber-500/10',
    info: 'text-indigo-500 bg-indigo-500/10'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2 text-white rounded-xl text-sm font-bold transition-all shadow-lg disabled:opacity-50 ${variantClasses[variant]}`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full ${iconClasses[variant]}`}>
          <AlertTriangle size={32} />
        </div>
        <p className="text-zinc-400 leading-relaxed">
          {message}
        </p>
      </div>
    </Modal>
  );
};
