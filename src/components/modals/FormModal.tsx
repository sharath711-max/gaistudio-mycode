import React from 'react';
import { Modal, ModalProps } from '../common/Modal';
import { FormSubmit } from '../forms/FormSubmit';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  formId?: string;
}

export const FormModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  loading,
  submitLabel = 'Save Changes',
  size = 'md',
  formId
}: FormModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Cancel
          </button>
          {onSubmit || formId ? (
            <FormSubmit
              type={formId ? "submit" : "button"}
              form={formId}
              onClick={!formId && onSubmit ? (e: any) => onSubmit(e) : undefined}
              loading={loading}
            >
              {submitLabel}
            </FormSubmit>
          ) : null}
        </>
      }
    >
      {children}
    </Modal>
  );
};
