/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Accessible Search Input Component
 */

import React from 'react';

export interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search by intention, title, or botanicals...',
  className = ''
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`relative flex items-center border-b border-[#D6D1C7] focus-within:border-[#101B12] transition-colors ${className}`}
    >
      <span className="text-[#5D5A53] pl-1 pr-3" aria-hidden="true">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </span>

      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full min-h-[44px] bg-transparent text-[#101B12] placeholder-[#8B857B] text-sm font-sans focus:outline-none"
        aria-label="Search catalogue"
      />

      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="p-2 text-[#5D5A53] hover:text-[#101B12] transition-colors focus-visible:outline-2 focus-visible:outline-[#C5AD70]"
          aria-label="Clear search input"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  );
};

export default SearchInput;
