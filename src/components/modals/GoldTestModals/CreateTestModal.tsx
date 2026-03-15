import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { FormModal } from '../FormModal';
import { FormContainer } from '../../forms/FormContainer';
import { FormSelect } from '../../forms/FormSelect';
import { Customer } from '../../../types';
import { customerService } from '../../../services/customerService';
import { goldTestService } from '../../../services/goldTestService';
import { silverTestService } from '../../../services/silverTestService';
import { useTests } from '../../../hooks/useTests';

interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'gold' | 'silver';
}

export const CreateTestModal = ({ isOpen, onClose, type }: CreateTestModalProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [items, setItems] = useState<{ name: string, gross_weight: string }[]>([{ name: '', gross_weight: '' }]);
  const [loading, setLoading] = useState(false);
  const { loadTests } = useTests(type);

  useEffect(() => {
    if (isOpen) {
      customerService.getAll().then(res => setCustomers(res.data));
    }
  }, [isOpen]);

  const addItem = () => setItems([...items, { name: '', gross_weight: '' }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || items.some(i => !i.name || !i.gross_weight)) return;
    
    setLoading(true);
    try {
      const service = type === 'gold' ? goldTestService : silverTestService;
      await service.create({ 
        customer_id: parseInt(customerId), 
        items: items.map(i => ({ name: i.name, gross_weight: parseFloat(i.gross_weight) }))
      } as any);
      loadTests();
      onClose();
      setCustomerId('');
      setItems([{ name: '', gross_weight: '' }]);
    } catch (error) {
      console.error('Failed to create test:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`New ${type === 'gold' ? 'Gold' : 'Silver'} Test`}
      formId="create-test-form"
      loading={loading}
      submitLabel="Create Test"
    >
      <FormContainer id="create-test-form" onSubmit={handleSubmit}>
        <FormSelect
          label="Select Customer"
          name="customerId"
          value={customerId}
          onChange={setCustomerId}
          required
          placeholder="Choose a customer..."
          options={customers.map(c => ({ value: c.id, label: `${c.name} (${c.phone})` }))}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Items</label>
            <button 
              type="button" 
              onClick={addItem} 
              className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <input
                  required
                  placeholder="Item Name"
                  className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                />
                <input
                  required
                  type="number"
                  step="0.001"
                  placeholder="Gross Wt."
                  className="w-24 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500"
                  value={item.gross_weight}
                  onChange={(e) => updateItem(index, 'gross_weight', e.target.value)}
                />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="p-1.5 text-zinc-600 hover:text-rose-500 transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </FormContainer>
    </FormModal>
  );
};
