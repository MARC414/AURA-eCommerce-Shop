/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Accessible Breadcrumb Navigation
 */

import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`py-4 md:py-6 text-[11px] font-sans ${className}`}>
      <ol className="flex flex-wrap items-center gap-2 list-none p-0 m-0 text-[#5D5A53]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent;
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-[#C5AD70] select-none" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className="text-[#101B12] font-medium"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-[#101B12] underline underline-offset-4 decoration-[#D6D1C7] hover:decoration-[#101B12] transition-colors"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
