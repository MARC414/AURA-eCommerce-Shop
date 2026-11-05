/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, isWishlisted = false, onToggleWishlist }) => {
  return (
    <div className="group flex flex-col cursor-pointer" onClick={() => onClick(product)}>
      {/* Media container with fixed 4/5 aspect ratio to guarantee 0 CLS */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EBE7DE] mb-6">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
        />

        {/* Wishlist Heart Button */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-4 right-4 z-20 p-2.5 rounded-full transition-all duration-300 shadow-sm ${
              isWishlisted
                ? 'bg-[#2C2A26] text-[#F5F2EB]'
                : 'bg-[#F5F2EB]/85 text-[#2C2A26] hover:bg-[#F5F2EB] hover:scale-110'
            }`}
            title={isWishlisted ? 'Remove from saved wishlist' : 'Save to wishlist'}
            aria-label={isWishlisted ? 'Remove from saved wishlist' : 'Save to wishlist'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill={isWishlisted ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              strokeWidth={isWishlisted ? 0 : 1.5} 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        )}
        
        {/* Hover overlay with minimal editorial button */}
        <div className="absolute inset-0 bg-[#2C2A26]/0 group-hover:bg-[#2C2A26]/10 transition-colors duration-500 flex items-center justify-center p-6">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
            <span className="bg-[#F5F2EB]/95 backdrop-blur-sm text-[#2C2A26] px-6 py-3 border border-[#D6D1C7] text-xs uppercase tracking-widest font-medium shadow-sm">
              Discover Ritual
            </span>
          </div>
        </div>

        {/* Low Stock Badge */}
        {product.stock <= 15 && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#2C2A26]/80 backdrop-blur-sm text-[#F5F2EB] px-3 py-1 text-[10px] uppercase tracking-widest font-mono">
              Limited Run
            </span>
          </div>
        )}
      </div>
      
      {/* Metadata */}
      <div className="text-center space-y-1">
        <span className="text-[11px] uppercase tracking-widest text-[#8C7355] block font-medium">
          {product.category}
        </span>
        <h3 className="text-xl md:text-2xl font-serif text-[#2C2A26] group-hover:opacity-70 transition-opacity">
          {product.name}
        </h3>
        {product.authenticScript ? (
          <p className="text-xs font-serif text-[#8C7355] tracking-wide font-normal">
            <span>{product.authenticScript}</span>
            {product.botanicalLatin && (
              <span className="text-[10px] text-[#A8A29E] font-sans italic ml-1.5">
                ({product.botanicalLatin})
              </span>
            )}
          </p>
        ) : product.bengaliName ? (
          <p className="text-xs font-serif text-[#8C7355] italic font-normal">
            {product.bengaliName}
          </p>
        ) : null}
        <p className="text-xs font-light text-[#5D5A53] italic line-clamp-1">
          {product.tagline}
        </p>
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-sm font-serif text-[#2C2A26] tabular-nums font-medium">
            ${product.price} USD
          </span>
          {product.format === 'Digital Download' && (
            <span className="text-[9px] tracking-widest uppercase px-1.5 py-0.5 bg-[#EBE7DE] text-[#8C7355] font-mono border border-[#D6D1C7]">
              Audio / Digital
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
