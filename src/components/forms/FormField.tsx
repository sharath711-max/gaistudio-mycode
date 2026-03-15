import React from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, required, children, className = '' }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
};
