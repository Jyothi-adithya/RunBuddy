import React from 'react';

const Select = ({ id, label, error, className = '', required = false, children, ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-ink-700">
          {label}
          {required && <span className="ml-1 text-coral-600">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`rb-focus-ring w-full rounded-soft border bg-white/85 px-4 py-3 text-ink-900 transition ${error ? 'border-red-300 focus:ring-red-200' : 'border-white/70'} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
