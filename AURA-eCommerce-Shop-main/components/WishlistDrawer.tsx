/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onProductClick: (product: Product) => void;
  onExploreShop: () => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveItem,
  onAddToCart,
  onProductClick,
  onExploreShop,
}) => {
  if (!isOpen) return null;

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  const handleMoveToCart = (product: Product) => {
    onAddToCart(product, 1);
    onRemoveItem(product.id);
  };

  const handleMoveAllToCart = () => {
    products.forEach((product) => {
      onAddToCart(product, 1);
      onRemoveItem(product.id);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1A231C]/40 backdrop-blur-sm transition-opacity duration-500 ease-out"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#EFF1E7] shadow-2xl flex flex-col border-l border-[#D4D8C6]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#D4D8C6] flex items-center justify-between bg-[#EFF1E7]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D5C2E]">
                  Sacred Collection
                </span>
                <span className="text-xs px-2 py-0.5 bg-[#E7EADF] text-[#1A231C] font-mono border border-[#D4D8C6]">
                  {products.length} {products.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <h2 className="text-2xl font-serif text-[#1A231C] mt-1">
                Your Saved Wishlist
              </h2>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 text-[#3E463C] hover:text-[#1A231C] transition-colors rounded-full hover:bg-[#E7EADF]"
              aria-label="Close wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* List or Empty State */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#D4D8C6]/60">
            {products.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#E7EADF] flex items-center justify-center text-[#6D5C2E] border border-[#D4D8C6]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <div className="space-y-2 max-w-xs">
                  <h3 className="font-serif text-xl text-[#1A231C]">Your Sanctuary List is Empty</h3>
                  <p className="text-xs text-[#3E463C] font-light leading-relaxed">
                    Bookmark authentic herbs, Sufi treatises, and sacred instruments to revisit on your spiritual path.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onExploreShop();
                  }}
                  className="px-6 py-3 bg-[#1A231C] text-[#EFF1E7] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="pt-6 first:pt-0 flex gap-4 group">
                  {/* Thumbnail */}
                  <div 
                    onClick={() => {
                      onClose();
                      onProductClick(product);
                    }}
                    className="w-20 h-24 bg-[#E7EADF] overflow-hidden shrink-0 cursor-pointer border border-[#D4D8C6]"
                  >
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D5C2E] truncate">
                          {product.category}
                        </span>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-[#6D5C2E] hover:text-[#1A231C] text-xs transition-colors p-1"
                          title="Remove from saved items"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <h4 
                        onClick={() => {
                          onClose();
                          onProductClick(product);
                        }}
                        className="font-serif text-base text-[#1A231C] hover:text-[#6D5C2E] transition-colors cursor-pointer truncate mt-0.5"
                      >
                        {product.name}
                      </h4>

                      {product.bengaliName && (
                        <p className="text-[11px] font-serif text-[#6D5C2E] italic truncate">
                          {product.bengaliName}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-serif text-[#1A231C] font-medium tabular-nums">
                          ${product.price} USD
                        </span>
                        <span className={`text-[10px] font-mono ${product.stock > 10 ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Move to Cart button */}
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="w-full py-2 px-3 bg-white hover:bg-[#1A231C] text-[#1A231C] hover:text-[#EFF1E7] border border-[#D4D8C6] hover:border-[#1A231C] text-[11px] uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Move All action */}
          {products.length > 0 && (
            <div className="p-6 border-t border-[#D4D8C6] bg-[#E7EADF]/40 space-y-4">
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-serif text-[#3E463C]">Total Wishlist Value</span>
                <span className="font-serif text-lg font-medium text-[#1A231C] tabular-nums">
                  ${totalValue} USD
                </span>
              </div>
              
              <button
                onClick={handleMoveAllToCart}
                className="w-full py-4 bg-[#1A231C] text-[#EFF1E7] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Move All to Sanctuary Cart</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
