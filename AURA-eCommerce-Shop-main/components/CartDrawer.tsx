/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { CartItem } from '../types';
import { storeService } from '../services/storeService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity,
  onRemoveItem, 
  onCheckout 
}) => {
  const settings = storeService.getSettings();
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const amountToFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / settings.freeShippingThreshold) * 100);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#2C2A26]/40 backdrop-blur-sm z-[80] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#F5F2EB] z-[90] shadow-2xl transform transition-transform duration-500 ease-in-out border-l border-[#D6D1C7] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D6D1C7] bg-[#EBE7DE]/30">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-medium block">Sanctuary Cart</span>
            <h2 className="text-xl font-serif text-[#2C2A26]">Your Selections ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-[#A8A29E] hover:text-[#2C2A26] transition-colors"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="p-4 bg-white border-b border-[#D6D1C7] text-xs">
          {amountToFreeShipping === 0 ? (
            <div className="flex items-center gap-2 text-emerald-800 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>You have unlocked complimentary insured worldwide delivery!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-[#5D5A53] mb-1.5">
                <span>Add <strong>${amountToFreeShipping}</strong> more for Free Shipping</span>
                <span className="font-mono">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#EBE7DE] overflow-hidden">
                <div 
                  className="h-full bg-[#8C7355] transition-all duration-500" 
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
              <div className="w-16 h-16 bg-[#EBE7DE] flex items-center justify-center text-[#A8A29E]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="font-serif text-lg text-[#2C2A26]">Your Sanctuary cart is empty</p>
              <p className="font-light text-xs text-[#5D5A53] max-w-xs">
                Explore our organic adaptogens, cork mats, or ambient stone diffusers.
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product.id}-${idx}`} className="flex gap-4 p-3 bg-white border border-[#D6D1C7] animate-fade-in-up">
                <div className="w-20 h-24 bg-[#EBE7DE] flex-shrink-0">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-[#2C2A26] text-base leading-snug">{item.product.name}</h3>
                      <span className="font-serif text-[#2C2A26] text-sm tabular-nums">${item.product.price * item.quantity}</span>
                    </div>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-[#8C7355] font-medium mt-0.5">{item.selectedVariant}</p>
                    )}
                    <p className="text-[10px] text-[#A8A29E] uppercase tracking-wider mt-0.5">{item.product.category}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#D6D1C7] bg-[#F5F2EB] text-xs">
                      <button 
                        onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                        className="px-2.5 py-1 text-[#5D5A53] hover:text-[#2C2A26]"
                      >
                        −
                      </button>
                      <span className="px-2 py-1 font-mono">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="px-2.5 py-1 text-[#5D5A53] hover:text-[#2C2A26]"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemoveItem(idx)}
                      className="text-[11px] text-[#A8A29E] hover:text-rose-700 transition-colors underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#D6D1C7] bg-[#EBE7DE]/40 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="uppercase tracking-widest text-[#5D5A53] text-xs font-medium">Subtotal</span>
            <span className="text-2xl font-serif text-[#2C2A26] tabular-nums">${subtotal} USD</span>
          </div>

          <p className="text-[11px] text-[#A8A29E] text-center">
            {subtotal >= settings.freeShippingThreshold 
              ? '✓ Free Insured Worldwide Delivery applied'
              : `Flat $${settings.standardShippingFee} shipping calculated at next step`}
          </p>

          <button 
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full py-4 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-xs font-medium hover:bg-[#433E38] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
