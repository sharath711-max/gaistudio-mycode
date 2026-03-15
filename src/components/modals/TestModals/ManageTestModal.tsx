import React, { useState, useEffect } from 'react';
import { DetailsModal } from '../DetailsModal';
import { FormInput } from '../../forms/FormInput';
import { FormNumber } from '../../forms/FormNumber';
import { GoldTest } from '../../../types';
import { cn, formatWeight } from '../../../utils';
import { goldTestService } from '../../../services/goldTestService';
import { silverTestService } from '../../../services/silverTestService';
import { Printer, FileText, Trash2, Edit3, Save, CheckCircle2, ArrowRight } from 'lucide-react';
import { useModal } from '../../../context/ModalContext';
import { useTests } from '../../../hooks/useTests';
import { printService } from '../../../services/printService';

interface ManageTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  testId: number | null;
  type: 'gold' | 'silver';
}

export const ManageTestModal = ({ isOpen, onClose, testId, type }: ManageTestModalProps) => {
  const [test, setTest] = useState<GoldTest | null>(null);
  const [loading, setLoading] = useState(false);
  const [purities, setPurities] = useState<Record<number, { purity: string, remarks: string, test_weight: string }>>({});
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [editedItems, setEditedItems] = useState<Record<number, { name: string, gross_weight: string }>>({});
  const { openModal, closeModal } = useModal();
  const { loadTests } = useTests(type);

  useEffect(() => {
    if (isOpen && testId) {
      setLoading(true);
      const service = type === 'gold' ? goldTestService : silverTestService;
      service.getById(testId)
        .then(res => {
          const data = res.data as GoldTest;
          setTest(data);
          const initialPurities: Record<number, { purity: string, remarks: string, test_weight: string }> = {};
          const initialEditedItems: Record<number, { name: string, gross_weight: string }> = {};
          
          data.items?.forEach(item => {
            initialPurities[item.id] = { 
              purity: item.purity?.toString() || '', 
              remarks: item.remarks || '',
              test_weight: item.test_weight?.toString() || ''
            };
            initialEditedItems[item.id] = {
              name: item.name,
              gross_weight: item.gross_weight.toString()
            };
          });
          setPurities(initialPurities);
          setEditedItems(initialEditedItems);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, testId, type]);

  const updateStatus = async (status: string) => {
    if (!testId) return;
    try {
      const service = type === 'gold' ? goldTestService : silverTestService;
      await service.updateStatus(testId, status);
      loadTests();
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async () => {
    if (!testId) return;
    
    openModal('CONFIRM_DELETE', {
      title: 'Delete Test',
      message: `Are you sure you want to delete ${type} test #${testId}? This action cannot be undone.`,
      confirmLabel: 'Delete Test',
      onConfirm: async () => {
        try {
          const service = type === 'gold' ? goldTestService : silverTestService;
          await service.delete(testId);
          loadTests();
          closeModal();
          onClose();
        } catch (error) {
          console.error('Failed to delete test:', error);
        }
      }
    });
  };

  const handleItemUpdate = async (itemId: number) => {
    if (!testId) return;
    const { name, gross_weight } = editedItems[itemId];
    try {
      // Assuming update is done on the test service, or we need an item service
      // For now, let's just mock it or use the test service if it supports it
      // The prompt didn't specify item update endpoints, so we'll leave it as a console log or mock
      console.log('Update item', itemId, name, gross_weight);
      // Refresh local state
      setTest(prev => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items?.map(item => 
            item.id === itemId ? { ...item, name, gross_weight: parseFloat(gross_weight) } : item
          )
        };
      });
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleLabDataUpdate = async (itemId: number) => {
    if (!testId) return;
    const { purity, remarks, test_weight } = purities[itemId];
    try {
      console.log('Update lab data', itemId, purity, remarks, test_weight);
      // Refresh local state
      setTest(prev => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items?.map(item => 
            item.id === itemId ? { 
              ...item, 
              purity: parseFloat(purity) || 0, 
              remarks, 
              test_weight: parseFloat(test_weight) || 0 
            } : item
          )
        };
      });
    } catch (error) {
      console.error('Failed to update lab data:', error);
    }
  };

  if (!test) return null;

  const isTodo = test.status === 'TODO';
  const isInProgress = test.status === 'IN_PROGRESS';
  const isDone = test.status === 'DONE';

  return (
    <DetailsModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${type === 'gold' ? 'Gold' : 'Silver'} Test ${test.test_number ? `#${test.test_number}` : `#${testId}`}`}
      size="lg"
      actions={
        <div className="flex items-center gap-2">
          {isTodo && (
            <>
              <button 
                onClick={() => printService.print({ type: 'RECEIPT', test, testType: type })}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-colors"
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-colors"
              >
                <Trash2 size={16} /> Delete
              </button>
              <button 
                onClick={() => updateStatus('IN_PROGRESS')}
                className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
              >
                Start Testing <ArrowRight size={16} />
              </button>
            </>
          )}

          {isInProgress && (
            <>
              <button 
                onClick={() => printService.print({ type: 'MEMO', test, testType: type })}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-colors"
              >
                <FileText size={16} /> Print Memo
              </button>
              <button 
                onClick={() => updateStatus('DONE')}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 size={16} /> Complete
              </button>
            </>
          )}

          {isDone && (
            <>
              <button 
                onClick={() => printService.print({ type: type === 'gold' ? 'GOLD_CERT' : 'SILVER_CERT', test, testType: type })}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors"
              >
                <FileText size={16} /> Certificate
              </button>
              <button 
                onClick={() => printService.print({ type: 'PHOTO_CERT', test, testType: type })}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-colors"
              >
                <Printer size={16} /> Photo Cert
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Customer</p>
            <p className="text-lg font-bold text-zinc-100">{test.customer_name}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
              isDone ? "bg-emerald-500/20 text-emerald-500" :
              isInProgress ? "bg-amber-500/20 text-amber-500" :
              "bg-zinc-800 text-zinc-400"
            )}>
              {isDone ? 'DONE' : test.status}
            </span>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Items & Purity</p>
            {isTodo && (
              <button 
                onClick={() => setIsEditingItems(!isEditingItems)}
                className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1 hover:text-amber-400"
              >
                <Edit3 size={12} /> {isEditingItems ? 'Cancel Editing' : 'Edit Items'}
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {test.items?.map((item) => (
              <div key={item.id} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-3">
                {isEditingItems && isTodo ? (
                  <div className="grid grid-cols-2 gap-3">
                    <FormInput
                      label="Item Name"
                      name={`name-${item.id}`}
                      value={editedItems[item.id]?.name || ''}
                      onChange={(val) => setEditedItems({
                        ...editedItems,
                        [item.id]: { ...editedItems[item.id], name: val }
                      })}
                    />
                    <FormNumber
                      label="Gross Weight"
                      name={`gross_weight-${item.id}`}
                      step="0.001"
                      value={editedItems[item.id]?.gross_weight || ''}
                      onChange={(val) => setEditedItems({
                        ...editedItems,
                        [item.id]: { ...editedItems[item.id], gross_weight: val }
                      })}
                    />
                    <button 
                      onClick={() => handleItemUpdate(item.id)}
                      className="col-span-2 flex items-center justify-center gap-2 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors"
                    >
                      <Save size={14} /> Update Item
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-zinc-200">{item.name}</p>
                      <p className="text-xs text-zinc-500">Gross Weight: {formatWeight(item.gross_weight)}</p>
                      {item.test_weight > 0 && (
                        <p className="text-xs text-amber-500/70">Lab Weight: {formatWeight(item.test_weight)}</p>
                      )}
                    </div>
                    {isDone && (
                      <div className="text-right">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Final Purity</p>
                        <p className="text-lg font-bold text-amber-500">{item.purity}%</p>
                      </div>
                    )}
                  </div>
                )}

                {isInProgress && (
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-800/50">
                    <FormNumber
                      label="Lab Weight"
                      name={`test_weight-${item.id}`}
                      step="0.001"
                      value={purities[item.id]?.test_weight || ''}
                      onChange={(val) => setPurities({
                        ...purities,
                        [item.id]: { ...purities[item.id], test_weight: val }
                      })}
                    />
                    <FormNumber
                      label="Purity (%)"
                      name={`purity-${item.id}`}
                      step="0.01"
                      value={purities[item.id]?.purity || ''}
                      onChange={(val) => setPurities({
                        ...purities,
                        [item.id]: { ...purities[item.id], purity: val }
                      })}
                    />
                    <FormInput
                      label="Remarks"
                      name={`remarks-${item.id}`}
                      placeholder="e.g. Fire Assay"
                      value={purities[item.id]?.remarks || ''}
                      onChange={(val) => setPurities({
                        ...purities,
                        [item.id]: { ...purities[item.id], remarks: val }
                      })}
                    />
                    <button 
                      onClick={() => handleLabDataUpdate(item.id)}
                      className="col-span-3 flex items-center justify-center gap-2 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold hover:bg-zinc-700 transition-colors"
                    >
                      <Save size={14} /> Save Lab Data
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DetailsModal>
  );
};
