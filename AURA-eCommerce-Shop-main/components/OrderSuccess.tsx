/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Order confirmation screen.
 *
 * This screen previously said "Order Confirmed & Paid" and showed a delivery
 * window and a fake tracking number. None of that was true. It now says what
 * actually happened: a request was recorded, no money moved, and the next
 * step is a human reply with an invoice.
 */

import React from 'react';
import { Order } from '../types';
import { getProvider } from '../services/payments';
import { storeService } from '../services/storeService';

interface OrderSuccessProps {
  order: Order;
  onContinueShopping: () => void;
  onOpenAdmin: () => void;
}

const STEPS = [
  {
    title: 'Request received',
    detail: 'Recorded on this device. Nothing has been charged.',
    state: 'done' as const
  },
  {
    title: 'AURA checks supply',
    detail: 'We confirm the item, your destination, and the real shipping cost.',
    state: 'next' as const
  },
  {
    title: 'Invoice sent',
    detail: 'You receive a written total and a payment route by email.',
    state: 'later' as const
  },
  {
    title: 'Payment, then dispatch',
    detail: 'The order is only marked paid once the money has cleared.',
    state: 'later' as const
  }
];

const OrderSuccess: React.FC<OrderSuccessProps> = ({ order, onContinueShopping, onOpenAdmin }) => {
  const provider = getProvider(order.paymentMethod);
  const symbol = storeService.getSettings().currency || '£';

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 bg-[#EFF1E7] animate-fade-in-up">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-[#D4D8C6] p-8 md:p-14 shadow-sm">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#E7EADF] text-[#1A231C] flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <span className="text-xs uppercase tracking-widest text-[#6D5C2E] font-medium block mb-2">Request received — not paid</span>
            <h1 className="text-3xl md:text-4xl font-serif text-[#1A231C] mb-3">Thank you, {order.customer.fullName.split(' ')[0] || 'friend'}</h1>
            <p className="text-sm text-[#3E463C] max-w-lg mx-auto font-light leading-relaxed mb-4">
              Your order request <strong className="font-mono text-[#1A231C]">{order.id}</strong> is recorded. No payment
              has been taken and no card details were collected.
            </p>
            <p className="text-xs text-[#9AA094] max-w-md mx-auto leading-relaxed mb-10">
              Keep this reference. The request is stored in this browser only; it is not yet on a server, so clearing site
              data removes it.
            </p>
          </div>

          <div className="bg-[#EFF1E7] border border-[#D4D8C6] p-6 mb-10">
            <span className="text-xs uppercase tracking-widest text-[#1A231C] font-medium block mb-5">What happens next</span>
            <ol className="space-y-4">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4 items-start">
                  <span
                    className={`w-6 h-6 shrink-0 flex items-center justify-center text-[10px] font-mono rounded-full ${
                      step.state === 'done'
                        ? 'bg-[#1A231C] text-[#EFF1E7]'
                        : step.state === 'next'
                          ? 'bg-[#6D5C2E] text-white'
                          : 'bg-[#D4D8C6] text-[#3E463C]'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${step.state === 'later' ? 'text-[#3E463C]' : 'text-[#1A231C]'}`}>{step.title}</p>
                    <p className="text-xs text-[#3E463C] leading-relaxed mt-0.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-[#D4D8C6] pt-8 mb-8">
            <h3 className="font-serif text-[#1A231C] text-xl mb-6">Order details</h3>

            <div className="divide-y divide-[#D4D8C6]/60 mb-6">
              {order.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover bg-[#E7EADF]" />
                    <div>
                      <h4 className="font-serif text-[#1A231C] text-base">{item.name}</h4>
                      <p className="text-xs text-[#9AA094]">
                        Qty: {item.quantity} · {item.selectedVariant || 'Standard'}
                      </p>
                    </div>
                  </div>
                  <span className="font-serif text-[#1A231C] text-base tabular-nums">
                    {symbol}{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[#E7EADF]/40 p-6 space-y-2 text-sm text-[#3E463C]">
              <div className="flex justify-between">
                <span>Items total</span>
                <span className="tabular-nums">{symbol}{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Shipping</span>
                <span className="text-right text-[#9AA094]">Quoted on your invoice</span>
              </div>
              <div className="flex justify-between text-lg font-serif text-[#1A231C] pt-3 border-t border-[#D4D8C6]">
                <span>Due so far</span>
                <span className="tabular-nums">{symbol}0.00</span>
              </div>
              <p className="text-[11px] text-[#9AA094] pt-1 leading-relaxed">
                Requested route: {provider ? provider.name : order.paymentMethod}. Status:{' '}
                <strong className="text-[#3E463C] font-medium">awaiting payment</strong>. This changes only after AURA
                confirms the invoice and the payment clears.
              </p>
            </div>
          </div>

          <div className="border-t border-[#D4D8C6] pt-6 mb-10 text-xs text-[#3E463C] space-y-1">
            <span className="uppercase tracking-widest text-[#9AA094] block mb-2 font-medium">Delivery destination</span>
            <p className="font-medium text-[#1A231C] text-sm">{order.customer.fullName}</p>
            <p>{order.customer.address}{order.customer.apartment ? `, ${order.customer.apartment}` : ''}</p>
            <p>{order.customer.city}{order.customer.stateProvince ? `, ${order.customer.stateProvince}` : ''} {order.customer.postalCode}</p>
            <p>{order.customer.country}</p>
            <p className="pt-2">{order.customer.email}</p>
            {order.customerNote && (
              <p className="pt-3 italic text-[#6D5C2E]">&ldquo;{order.customerNote}&rdquo;</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onContinueShopping}
              className="px-8 py-4 bg-[#1A231C] text-[#EFF1E7] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors"
            >
              Continue browsing
            </button>
            <button
              onClick={onOpenAdmin}
              className="px-8 py-4 border border-[#D4D8C6] text-[#1A231C] text-xs uppercase tracking-widest font-medium hover:bg-[#E7EADF] transition-colors"
            >
              View request in admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
