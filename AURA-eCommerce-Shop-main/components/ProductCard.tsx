/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Reusable Product Card Component
 * Brand: OPAR — A World of Conscious Living
 * 
 * Supports:
 * - Direct dropshipping pieces and external affiliate partner offers (clearly distinguished).
 * - Verified price formatting ($XX.XX USD) vs honest "Price on request" (never fabricated).
 * - Fixed 4/5 aspect ratio with zero CLS and graceful fallback.
 * - Zero-pill discipline: unboxed clean metadata and hairline tags.
 * - Accessible wishlist toggle with smooth micro-interactions.
 */

import React, { useState } from 'react';
import { Product, UnifiedProduct } from '../types';
import { Badge } from './ui/Badge';

interface ProductCardProps {
  product: Product | UnifiedProduct;
  onClick: (product: Product | UnifiedProduct) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  isWishlisted = false,
  onToggleWishlist
}) => {
  const [imageError, setImageError] = useState(false);

  // Identify sourcing model & affiliate status
  const isAffiliate =
    ('model' in product && product.model === 'affiliate') ||
    ('purchaseOwner' in product && product.purchaseOwner === 'partner') ||
    product.id.startsWith('cj-');

  // Honest price representation
  const hasConfirmedPrice =
    typeof product.price === 'number' && product.price > 0;

  // Format check
  const isDigital = 'format' in product && product.format === 'Digital Download';

  // Verified stock check (never fabricated)
  const isLimitedStock =
    typeof product.stock === 'number' && product.stock > 0 && product.stock <= 15;

  return (
    <article
      tabIndex={0}
      role="region"
      aria-label={product.name}
      onClick={() => onClick(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(product);
        }
      }}
      className="group flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C5AD70] focus-visible:outline-offset-4 transition-all duration-300"
    >
      {/* Media container with fixed 4/5 aspect ratio to guarantee 0 CLS */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EBE7DE] mb-5 border border-[#D6D1C7]/50">
        {!imageError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F1EBDD]">
            <svg
              className="w-10 h-10 text-[#C5AD70] mb-3"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
            >
              <ellipse cx="50" cy="50" rx="42" ry="22" strokeWidth="2" transform="rotate(-28 50 50)" />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
            </svg>
            <span className="font-serif text-sm text-[#101B12] line-clamp-2">{product.name}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#82915B] mt-1">OPAR Archive</span>
          </div>
        )}

        {/* Top Badges / Sourcing Indicators */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
          {isAffiliate ? (
            <Badge variant="affiliate" size="sm">
              Partner Offer
            </Badge>
          ) : isLimitedStock ? (
            <Badge variant="hairline" size="sm">
              Limited Run
            </Badge>
          ) : null}
        </div>

        {/* Wishlist Heart Toggle */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full transition-all duration-200 ${
              isWishlisted
                ? 'bg-[#101B12] text-[#F1EBDD] shadow-sm'
                : 'bg-[#F1EBDD]/90 text-[#101B12] hover:bg-[#F1EBDD] hover:scale-110 shadow-sm'
            } focus-visible:outline-2 focus-visible:outline-[#C5AD70]`}
            title={isWishlisted ? 'Remove from saved wishlist' : 'Save to wishlist'}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isWishlisted ? 0 : 1.5}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        )}

        {/* Editorial Action Overlay */}
        <div className="absolute inset-0 bg-[#101B12]/0 group-hover:bg-[#101B12]/15 transition-colors duration-300 flex items-end justify-center p-4">
          <div className="w-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="w-full block text-center py-2.5 px-4 bg-[#F1EBDD]/95 backdrop-blur-sm text-[#101B12] border border-[#D6D1C7] text-[11px] uppercase tracking-[0.14em] font-sans font-medium shadow-sm hover:border-[#101B12]">
              {isAffiliate ? (
                <span className="inline-flex items-center justify-center gap-1.5">
                  View Partner Offer
                  <svg className="w-3 h-3 text-[#C5AD70]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              ) : (
                'View Piece Details'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Typography & Metadata */}
      <div className="text-center space-y-1.5 px-1">
        {/* Category Unboxed Metadata */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#82915B]">
          <span>{product.category}</span>
          {isDigital && (
            <>
              <span aria-hidden="true" className="text-[#C5AD70]">·</span>
              <span className="text-[#5D5A53]">Digital</span>
            </>
          )}
        </div>

        {/* Product Title in Cormorant Garamond */}
        <h3 className="font-serif text-xl sm:text-2xl text-[#101B12] group-hover:text-[#1D3020] transition-colors leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Lineage Script & Botanical Latin */}
        {product.authenticScript ? (
          <p className="text-xs font-serif text-[#C5AD70] tracking-wide">
            <span>{product.authenticScript}</span>
            {product.botanicalLatin && (
              <span className="text-[10px] text-[#5D5A53] font-sans italic ml-1.5">
                ({product.botanicalLatin})
              </span>
            )}
          </p>
        ) : product.bengaliName ? (
          <p className="text-xs font-serif text-[#C5AD70] italic">
            {product.bengaliName}
          </p>
        ) : null}

        {/* Tagline */}
        {product.tagline && (
          <p className="text-xs font-sans text-[#5D5A53] italic line-clamp-1 max-w-[280px] mx-auto">
            {product.tagline}
          </p>
        )}

        {/* Pricing Area: Honest Price vs Price on request */}
        <div className="pt-1 flex items-center justify-center gap-2">
          {hasConfirmedPrice ? (
            <span className="text-sm font-sans font-medium text-[#101B12] tabular-nums tracking-wide">
              ${product.price} USD
            </span>
          ) : (
            <span className="text-xs font-serif italic text-[#C5AD70]">
              Price on request
            </span>
          )}

          {isAffiliate && (
            <span className="text-[10px] text-[#5D5A53] font-sans">
              (External offer)
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
