import React from 'react';
import { Modal } from '../common/Modal';
import { Printer, Download } from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onPrint,
  onDownload
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-all"
              >
                <Download size={16} /> Download PDF
              </button>
            )}
            {onPrint && (
              <button
                onClick={onPrint}
                className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
              >
                <Printer size={16} /> Print Now
              </button>
            )}
          </div>
        </>
      }
    >
      <div className="bg-white rounded-lg p-8 min-h-[800px] shadow-inner overflow-auto">
        {children}
      </div>
    </Modal>
  );
};
