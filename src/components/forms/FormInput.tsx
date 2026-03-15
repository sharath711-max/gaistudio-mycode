import React from 'react';
import { FormField } from './FormField';

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange: (value: string) => void;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  error, 
  required, 
  className = '', 
  onChange,
  ...props 
}) => {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <input
        {...props}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2.5 bg-zinc-900 border ${error ? 'border-rose-500' : 'border-zinc-800'} rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      />
    </FormField>
  );
};
