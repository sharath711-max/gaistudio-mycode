import React from 'react';
import { FormField } from './FormField';

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
  label, 
  error, 
  required, 
  className = '', 
  options,
  onChange,
  placeholder,
  ...props 
}) => {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <select
        {...props}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2.5 bg-zinc-900 border ${error ? 'border-rose-500' : 'border-zinc-800'} rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};
