import React from 'react';
import { FormField } from './FormField';

interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange: (value: string) => void;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ 
  label, 
  error, 
  required, 
  className = '', 
  onChange,
  rows = 3,
  ...props 
}) => {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <textarea
        {...props}
        rows={rows}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2.5 bg-zinc-900 border ${error ? 'border-rose-500' : 'border-zinc-800'} rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
      />
    </FormField>
  );
};
