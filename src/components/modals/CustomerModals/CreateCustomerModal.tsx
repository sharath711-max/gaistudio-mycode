import React, { useState } from 'react';
import { FormModal } from '../FormModal';
import { FormContainer } from '../../forms/FormContainer';
import { FormInput } from '../../forms/FormInput';
import { FormTextarea } from '../../forms/FormTextarea';
import { customerService } from '../../../services/customerService';
import { useCustomers } from '../../../hooks/useCustomers';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCustomerModal = ({ isOpen, onClose }: CreateCustomerModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { loadCustomers } = useCustomers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await customerService.create({ name, phone, notes });
      loadCustomers();
      onClose();
      setName('');
      setPhone('');
      setNotes('');
    } catch (error) {
      console.error('Failed to create customer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add New Customer"
      formId="create-customer-form"
      loading={loading}
      submitLabel="Create Customer"
    >
      <FormContainer id="create-customer-form" onSubmit={handleSubmit}>
        <FormInput
          label="Full Name"
          name="name"
          value={name}
          onChange={setName}
          required
          autoFocus
        />
        <FormInput
          label="Phone Number"
          name="phone"
          value={phone}
          onChange={setPhone}
        />
        <FormTextarea
          label="Notes"
          name="notes"
          value={notes}
          onChange={setNotes}
        />
      </FormContainer>
    </FormModal>
  );
};
