/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Checkout.
 *
 * Three rules govern this screen:
 *
 *  1. AURA never collects card numbers, expiry dates, or security codes.
 *     There is no card form here and there never should be. A card payment
 *     is a redirect to a provider-hosted page.
 *  2. The customer is placing an order *request*, not a payment. The order
 *     is recorded as `awaiting_payment` and stays that way until a server
 *     confirms money arrived.
 *  3. Nothing is promised that has not been agreed: no delivery date, no
 *     shipping price, no money-back guarantee.
 */

import React, { useState } from 'react';
import { CartItem, CustomerDetails, Order, PaymentMethod } from '../types';
import { storeService } from '../services/storeService';
import { PAYMENT_PROVIDERS, DEFAULT_PROVIDER } from '../services/payments';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onOrderComplete: (order: Order) => void;
}

const COUNTRIES = [
  'Bangladesh',
  'Belgium',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Spain',
  'Italy',
  'Japan',
  'India',
  'United Arab Emirates'
];

const Checkout: React.FC<CheckoutProps> = ({ items, onBack, onOrderComplete }) => {
  const settings = storeService.getSettings();
  const symbol = settings.currency || '£';

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'United Kingdom'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(DEFAULT_PROVIDER);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const hasPendingPrice = items.some(item => !Number.isFinite(item.product.price));
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.product.price);
    return sum + (Number.isFinite(price) ? price * item.quantity : 0);
  }, 0);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const missing = [
      ['full name', customer.fullName],
      ['email address', customer.email],
      ['street address', customer.address],
      ['city', customer.city],
      ['postal code', customer.postalCode],
      ['country', customer.country]
    ].filter(([, value]) => !String(value).trim());

    if (missing.length > 0) {
      setFormError(`Please complete: ${missing.map(([label]) => label).join(', ')}.`);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email.trim())) {
      setFormError('That email address does not look complete, and it is the only way an invoice can reach you.');
      return;
    }

    if (items.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }

    setIsProcessing(true);
    window.setTimeout(() => {
      const order = storeService.createOrder({
        customer,
        cartItems: items,
        paymentMethod,
        customerNote: note.trim() || undefined
      });
      setIsProcessing(false);
      onOrderComplete(order);
    }, 500);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 md:px-12 bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Return to Cart &amp; Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-widest text-[#8C7355] block mb-2 font-medium">Order request</span>
            <h1 className="text-3xl md:text-4xl font-serif text-[#2C2A26] mb-3">Ask for an invoice</h1>
            <p className="text-sm text-[#5D5A53] mb-8 font-light leading-relaxed max-w-xl">
              No payment is taken on this page. AURA reviews the request, confirms that the item can be supplied to your
              address, and replies with an invoice. Your order stays marked <em>awaiting payment</em> until then.
            </p>

            <div className="border border-[#D6D1C7] bg-white/60 p-4 mb-10 text-xs text-[#5D5A53] leading-relaxed">
              <strong className="text-[#2C2A26] font-medium">AURA will never ask for card details here.</strong> Card
              numbers and security codes are entered only on a payment provider&rsquo;s own secure page. If any page asks
              you to type a card number into its own form, stop.
            </div>

            {formError && (
              <div className="p-4 mb-8 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-12">
              <div>
                <h2 className="text-xl font-serif text-[#2C2A26] mb-6 flex items-center justify-between">
                  <span>1. Where the invoice should go</span>
                  <span className="text-xs uppercase tracking-widest text-[#A8A29E] font-sans">Step 1 of 3</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkout-email" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Email Address *</label>
                    <input
                      id="checkout-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@domain.com"
                      value={customer.email}
                      onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                      className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26]"
                    />
                    <span className="text-[11px] text-[#A8A29E] mt-1 block">This is where the invoice and any follow-up questions are sent.</span>
                  </div>

                  <div>
                    <label htmlFor="checkout-phone" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Phone Number</label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Optional, for delivery questions"
                      value={customer.phone}
                      onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                      className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2C2A26] mb-6 flex items-center justify-between">
                  <span>2. Delivery destination</span>
                  <span className="text-xs uppercase tracking-widest text-[#A8A29E] font-sans">Step 2 of 3</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkout-name" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Full Name *</label>
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="First and last name"
                      value={customer.fullName}
                      onChange={(event) => setCustomer({ ...customer, fullName: event.target.value })}
                      className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26]"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-address" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Street Address *</label>
                    <input
                      id="checkout-address"
                      type="text"
                      required
                      autoComplete="street-address"
                      placeholder="House number and street name"
                      value={customer.address}
                      onChange={(event) => setCustomer({ ...customer, address: event.target.value })}
                      className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkout-apartment" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Apartment, Suite, Unit</label>
                      <input
                        id="checkout-apartment"
                        type="text"
                        placeholder="Optional"
                        value={customer.apartment}
                        onChange={(event) => setCustomer({ ...customer, apartment: event.target.value })}
                        className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26]"
                      />
                    </div>

                    <div>
                      <label htmlFor="checkout-city" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">City *</label>
                      <input
                        id="checkout-city"
                        type="text"
                        required
                        autoComplete="address-level2"
                        placeholder="City"
                        value={customer.city}
                        onChange={(event) => setCustomer({ ...customer, city: event.target.value })}
                        className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="checkout-state" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">State / Province</label>
                      <input
                        id="checkout-state"
                        type="text"
                        autoComplete="address-level1"
                        placeholder="Region"
                        value={customer.stateProvince}
                        onChange={(event) => setCustomer({ ...customer, stateProvince: event.target.value })}
                        className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26]"
                      />
                    </div>

                    <div>
                      <label htmlFor="checkout-postal" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Postal Code *</label>
                      <input
                        id="checkout-postal"
                        type="text"
                        required
                        autoComplete="postal-code"
                        placeholder="Postcode"
                        value={customer.postalCode}
                        onChange={(event) => setCustomer({ ...customer, postalCode: event.target.value })}
                        className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26]"
                      />
                    </div>

                    <div>
                      <label htmlFor="checkout-country" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Country *</label>
                      <select
                        id="checkout-country"
                        value={customer.country}
                        onChange={(event) => setCustomer({ ...customer, country: event.target.value })}
                        className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                      >
                        {COUNTRIES.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#2C2A26] mb-6 flex items-center justify-between">
                  <span>3. How you would like to pay</span>
                  <span className="text-xs uppercase tracking-widest text-[#A8A29E] font-sans">Step 3 of 3</span>
                </h2>

                <div className="space-y-3">
                  {PAYMENT_PROVIDERS.map(provider => {
                    const isSelected = paymentMethod === provider.id;
                    return (
                      <label
                        key={provider.id}
                        className={`block p-4 border transition-all ${
                          !provider.enabled
                            ? 'bg-[#EBE7DE]/30 border-[#D6D1C7] opacity-70 cursor-not-allowed'
                            : isSelected
                              ? 'bg-white border-[#2C2A26] shadow-sm cursor-pointer'
                              : 'bg-[#EBE7DE]/40 border-[#D6D1C7] hover:border-[#2C2A26]/50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="payment-provider"
                            value={provider.id}
                            checked={isSelected}
                            disabled={!provider.enabled}
                            onChange={() => setPaymentMethod(provider.id)}
                            className="mt-1 accent-[#2C2A26]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <span className="font-serif text-[#2C2A26] text-base">{provider.name}</span>
                              <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-medium whitespace-nowrap">
                                {provider.enabled ? 'Available' : 'Not connected'}
                              </span>
                            </div>
                            <p className="text-xs text-[#5D5A53] leading-relaxed">{provider.note}</p>
                            {!provider.enabled && provider.unavailableReason && (
                              <p className="text-[11px] text-[#7A4038] mt-1">{provider.unavailableReason}</p>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <label htmlFor="checkout-note" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Anything we should know?</label>
                  <textarea
                    id="checkout-note"
                    rows={3}
                    placeholder="Optional. For example a delivery question or an item you would like us to check first."
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] resize-y"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isProcessing || items.length === 0}
                  className="w-full py-5 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Recording your request…</span>
                    </>
                  ) : (
                    <span>Request invoice — nothing is charged now</span>
                  )}
                </button>
                <p className="text-center text-[11px] text-[#A8A29E] mt-3 leading-relaxed">
                  Submitting creates an order request on this device. It is not a contract and no money moves.
                </p>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 lg:pl-8 lg:border-l border-[#D6D1C7]">
            <h2 className="text-xl font-serif text-[#2C2A26] mb-8">
              Summary ({items.reduce((count, item) => count + item.quantity, 0)} {items.reduce((count, item) => count + item.quantity, 0) === 1 ? 'item' : 'items'})
            </h2>

            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="flex gap-4">
                  <div className="w-16 h-20 bg-[#EBE7DE] relative flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#2C2A26] text-white text-[10px] flex items-center justify-center font-mono">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-[#2C2A26] text-base">{item.product.name}</h3>
                    <p className="text-xs text-[#A8A29E]">{item.selectedVariant || item.product.category}</p>
                    <span className="text-xs text-[#5D5A53] mt-1 block">{Number.isFinite(item.product.price) ? `${symbol}${item.product.price.toFixed(2)} each` : 'Price pending'}</span>
                  </div>
                  <span className="text-sm font-serif text-[#2C2A26] tabular-nums">
                    {Number.isFinite(item.product.price) ? `${symbol}${(item.product.price * item.quantity).toFixed(2)}` : '—'}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#D6D1C7] pt-6 space-y-3 text-sm text-[#5D5A53]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">{hasPendingPrice ? 'Price pending' : `${symbol}${subtotal.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Shipping</span>
                <span className="text-right text-[#A8A29E]">Quoted on your invoice</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Taxes and duties</span>
                <span className="text-right text-[#A8A29E]">Confirmed before payment</span>
              </div>
            </div>

            <div className="border-t border-[#D6D1C7] mt-6 pt-6 flex justify-between items-end">
              <div>
                <span className="font-serif text-2xl text-[#2C2A26] block">Items total</span>
                <span className="text-xs text-[#A8A29E]">Not a final amount</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#A8A29E] mr-1 font-mono">{settings.currency === '$' ? 'USD' : 'GBP'}</span>
                <span className="font-serif text-3xl text-[#2C2A26] tabular-nums">{hasPendingPrice ? 'Price pending' : `${symbol}${subtotal.toFixed(2)}`}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#A8A29E] mt-6 leading-relaxed">
              The final invoice will show the confirmed item price, shipping, and any duty. Nothing is charged until you
              agree to that invoice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
