import React, { forwardRef } from 'react';

export const inputClasses =
  'min-h-11 w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-ink shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint disabled:cursor-not-allowed disabled:bg-surface-muted';

export const labelClasses = 'mb-2 block text-sm font-semibold text-body';

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  placeholder?: string;
  error?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, placeholder, error, className = '', ...props }, ref) => {
    const selectId =
      props.id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        <label htmlFor={selectId} className={labelClasses}>
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`${inputClasses} ${className}`}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
