/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Section Heading Component
 * Features Cormorant Garamond display typography, balanced text-wrapping, and optional eyebrow kicker.
 */

import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  theme = 'light',
  as: Component = 'h2',
  className = ''
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`space-y-3 ${
        align === 'center' ? 'text-center mx-auto' : 'text-left'
      } max-w-3xl ${className}`}
    >
      {eyebrow && (
        <span
          className={`block text-[11px] font-sans font-medium uppercase tracking-[0.16em] ${
            isDark ? 'text-[#C5AD70]' : 'text-[#82915B]'
          }`}
        >
          {eyebrow}
        </span>
      )}

      <Component
        className={`font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.15] ${
          isDark ? 'text-[#F1EBDD]' : 'text-[#101B12]'
        }`}
        style={{ textWrap: 'balance' }}
      >
        {title}
      </Component>

      {description && (
        <p
          className={`font-sans text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-[#B8BEAA]' : 'text-[#5D5A53]'
          } max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
