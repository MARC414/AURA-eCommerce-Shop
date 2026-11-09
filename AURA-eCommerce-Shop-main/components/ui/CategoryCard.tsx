/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Category Card Component
 * Minimalist editorial presentation of conscious living collections.
 */

import React from 'react';

export interface CategoryCardProps {
  name: string;
  count?: number;
  description?: string;
  href: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  count,
  description,
  href,
  imageUrl,
  onClick,
  className = ''
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group block p-6 sm:p-8 bg-[#F1EBDD] border border-[#D6D1C7] hover:border-[#101B12] transition-all duration-300 ${className}`}
    >
      {imageUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#EBE7DE] mb-5">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-col h-full justify-between gap-4">
        <div>
          <span className="block text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#82915B] mb-2">
            Collection
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#101B12] group-hover:text-[#1D3020] transition-colors leading-tight">
            {name}
          </h3>
          {description && (
            <p className="mt-2 text-xs sm:text-sm font-sans text-[#5D5A53] leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#D6D1C7]/60 text-xs font-sans">
          {typeof count === 'number' ? (
            <span className="text-[#5D5A53] tracking-wide">
              {count} {count === 1 ? 'object' : 'objects'}
            </span>
          ) : (
            <span className="text-[#82915B]">Curated Selection</span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[#101B12] group-hover:text-[#C5AD70] transition-colors font-medium uppercase tracking-wider text-[11px]">
            Explore
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
};

export default CategoryCard;
