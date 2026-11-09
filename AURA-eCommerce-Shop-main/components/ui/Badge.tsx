/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Reusable Badge & Tag Component
 * Conforms to Zero-Pill & Metadata Discipline:
 * Uses clean unboxed text or minimal hairline rectangular tags, avoiding garish candy capsules.
 */

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'hairline' | 'text' | 'affiliate' | 'dropship' | 'verified' | 'pending';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'hairline',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1';

  const variantClasses = {
    hairline:
      'border border-[#D6D1C7] bg-[#F1EBDD] text-[#101B12] uppercase tracking-[0.1em] font-sans font-medium',
    text:
      'border-0 bg-transparent text-[#5D5A53] uppercase tracking-[0.12em] font-sans font-medium p-0',
    affiliate:
      'border border-[#82915B] bg-[#EBE7DE] text-[#101B12] uppercase tracking-[0.1em] font-sans font-medium',
    dropship:
      'border border-[#C5AD70] bg-[#F1EBDD] text-[#101B12] uppercase tracking-[0.1em] font-sans font-medium',
    verified:
      'border border-[#82915B] bg-[#E7EFE6] text-[#1D3020] uppercase tracking-[0.08em] font-sans font-medium',
    pending:
      'border border-[#C5AD70] bg-[#F6EFDD] text-[#5D5A53] uppercase tracking-[0.08em] font-sans font-medium'
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center leading-none ${variantClasses} ${
        variant !== 'text' ? sizeClasses : ''
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
