import React, { forwardRef } from 'react';

export const inputClasses =
  'min-h-11 w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-ink shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint disabled:cursor-not-allowed disabled:bg-slate-100';

export const labelClasses = 'mb-2 block text-sm font-semibold text-body';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const inputId =
      props.id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`${inputClasses} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
