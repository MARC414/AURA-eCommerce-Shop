/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Reusable Form Controls
 * Includes accessible Input, Textarea, Select, and Checkbox components with visible focus rings.
 */

import React from 'react';

// Common field wrapper
interface FieldWrapperProps {
  label?: string;
  id?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  id,
  error,
  hint,
  required,
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#5D5A53]"
        >
          {label}
          {required && <span className="text-[#C5AD70] ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <span className="text-[11px] text-[#5D5A53] font-sans">{hint}</span>
      )}
      {error && (
        <span className="text-[11px] text-[#82915B] font-sans font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

// Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, required, className = '', ...props }, ref) => {
    const inputElement = (
      <input
        ref={ref}
        id={id}
        required={required}
        aria-invalid={!!error}
        className={`w-full min-h-[48px] px-3.5 py-2.5 bg-[#F1EBDD] text-[#101B12] placeholder-[#8B857B] border ${
          error ? 'border-[#82915B]' : 'border-[#D6D1C7]'
        } text-sm font-sans focus:border-[#101B12] focus-visible:outline-2 focus-visible:outline-[#C5AD70] focus-visible:outline-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );

    if (label || error || hint) {
      return (
        <FieldWrapper label={label} id={id} error={error} hint={hint} required={required}>
          {inputElement}
        </FieldWrapper>
      );
    }

    return inputElement;
  }
);
Input.displayName = 'Input';

// Select
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, required, options, children, className = '', ...props }, ref) => {
    const selectElement = (
      <div className="relative">
        <select
          ref={ref}
          id={id}
          required={required}
          aria-invalid={!!error}
          className={`w-full min-h-[48px] px-3.5 py-2.5 bg-[#F1EBDD] text-[#101B12] border ${
            error ? 'border-[#82915B]' : 'border-[#D6D1C7]'
          } text-sm font-sans appearance-none pr-10 focus:border-[#101B12] focus-visible:outline-2 focus-visible:outline-[#C5AD70] focus-visible:outline-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#5D5A53]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );

    if (label || error || hint) {
      return (
        <FieldWrapper label={label} id={id} error={error} hint={hint} required={required}>
          {selectElement}
        </FieldWrapper>
      );
    }

    return selectElement;
  }
);
Select.displayName = 'Select';

// Textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, required, className = '', ...props }, ref) => {
    const textareaElement = (
      <textarea
        ref={ref}
        id={id}
        required={required}
        aria-invalid={!!error}
        className={`w-full min-h-[110px] p-3.5 bg-[#F1EBDD] text-[#101B12] placeholder-[#8B857B] border ${
          error ? 'border-[#82915B]' : 'border-[#D6D1C7]'
        } text-sm font-sans focus:border-[#101B12] focus-visible:outline-2 focus-visible:outline-[#C5AD70] focus-visible:outline-offset-1 transition-colors resize-y disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );

    if (label || error || hint) {
      return (
        <FieldWrapper label={label} id={id} error={error} hint={hint} required={required}>
          {textareaElement}
        </FieldWrapper>
      );
    }

    return textareaElement;
  }
);
Textarea.displayName = 'Textarea';

// Checkbox
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-start gap-3 cursor-pointer select-none ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className="mt-1 w-4 h-4 border border-[#D6D1C7] rounded-none accent-[#101B12] focus-visible:outline-2 focus-visible:outline-[#C5AD70]"
          {...props}
        />
        <span className="text-xs font-sans text-[#5D5A53] leading-relaxed">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
