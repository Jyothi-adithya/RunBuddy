import React from 'react';

const variantClasses = {
  primary: 'bg-coral-600 text-white shadow-glow hover:bg-coral-700',
  secondary: 'bg-white/70 text-ink-800 border border-white/60 hover:bg-white',
  ghost: 'bg-transparent text-ink-700 hover:bg-white/70',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizeClasses = {
  sm: 'px-4 py-2.5 text-sm',
  md: 'px-5 py-3 text-sm md:text-base',
  lg: 'px-6 py-3.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`rb-focus-ring inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-65 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-r-transparent"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
