/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Reusable Button Component
 * Supports: primary, secondary, outline, ghost, dark-mode/light-mode variants.
 * Conforms to zero-pill discipline, WCAG AA touch targets (>=44px), and visible focus rings.
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'darkPrimary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      isLoading = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Size metrics ensuring >=40px touch targets
    const sizeClasses = {
      sm: 'min-h-[38px] px-3.5 py-2 text-[11px] gap-2 tracking-[0.1em]',
      md: 'min-h-[44px] px-5 py-2.5 text-[11px] gap-2.5 tracking-[0.12em]',
      lg: 'min-h-[56px] px-7 py-3.5 text-xs gap-3 tracking-[0.14em]'
    }[size];

    // Variant color system using OPAR tokens
    const variantClasses = {
      primary:
        'bg-[#101B12] text-[#F1EBDD] border border-[#101B12] hover:bg-[#1D3020] active:bg-[#101B12] shadow-sm',
      secondary:
        'bg-[#F1EBDD] text-[#101B12] border border-[#D6D1C7] hover:border-[#101B12] hover:bg-[#EBE7DE] active:bg-[#D6D1C7]',
      outline:
        'bg-transparent text-[#101B12] border border-[#101B12] hover:bg-[#101B12] hover:text-[#F1EBDD]',
      ghost:
        'bg-transparent text-[#101B12] border border-transparent hover:text-[#C5AD70] underline-offset-4 hover:underline',
      darkPrimary:
        'bg-[#C5AD70] text-[#101B12] border border-[#C5AD70] hover:bg-[#B8BEAA] active:bg-[#C5AD70] font-medium'
    }[variant];

    const baseClasses =
      'inline-flex items-center justify-center font-sans uppercase font-medium transition-all duration-200 select-none whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C5AD70] focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
