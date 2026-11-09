/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ORVANYA Design System — Form Controls & Search Input
 * Minimalist editorial aesthetic, clear contrast, accessible focus ring.
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  ...rest
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-sans uppercase tracking-[0.14em] font-medium text-[#34382D]"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full min-h-[46px] px-4 py-2.5 bg-transparent border border-[#B8BEAA] text-[#101B12] text-sm placeholder:text-[#82915B] placeholder:font-light transition-colors focus:border-[#C5AD70] focus:outline-none focus:ring-1 focus:ring-[#C5AD70] disabled:bg-[#EBE5D6] disabled:cursor-not-allowed ${
          error ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : ''
        } ${className}`.trim()}
        {...rest}
      />
      {error && <span className="text-xs text-red-600 font-sans">{error}</span>}
      {helperText && !error && <span className="text-xs text-[#626857] font-sans">{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(({
  value,
  onClear,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className="relative w-full flex items-center border-b border-[#B8BEAA] focus-within:border-[#101B12] transition-colors">
      <svg
        className="w-4 h-4 text-[#82915B] ml-1 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        ref={ref}
        type="search"
        value={value}
        className={`w-full min-h-[44px] px-3 py-2 bg-transparent text-sm text-[#101B12] placeholder:text-[#82915B] focus:outline-none ${className}`.trim()}
        {...rest}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search query"
          className="p-1 mr-1 text-[#82915B] hover:text-[#101B12] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default Input;
