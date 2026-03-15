import React from 'react';

interface FormContainerProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({ onSubmit, children, className = '', ...props }) => {
  return (
    <form {...props} onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
};
