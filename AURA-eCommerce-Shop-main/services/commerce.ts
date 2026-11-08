/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Cart, wishlist-independent commerce state, and newsletter capture.
 *
 * Everything here is browser-local. That is stated in the UI rather than
 * hidden, because a cart that lives only in one browser is a preview of a
 * cart, not a cart. The function signatures are the contract a backend
 * will implement later, so no component needs rewriting when it arrives.
 */

import { CartItem, NewsletterSubscriber, Product } from '../types';

const KEYS = {
  CART: 'aura_cart_v1',
  NEWSLETTER: 'aura_newsletter_v1'
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key}`, error);
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not write ${key}`, error);
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Number(null) is 0, so a missing price needs its own check. */
function priceOf(value: number | null | undefined): number {
  if (value === null || value === undefined) return NaN;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

export interface SubscribeResult {
  ok: boolean;
  message: string;
  subscriber?: NewsletterSubscriber;
}

export const commerce = {
  /* ----------------------------- cart ----------------------------- */

  getCart(): CartItem[] {
    const items = read<CartItem[]>(KEYS.CART, []);
    return Array.isArray(items) ? items.filter(item => item?.product?.id) : [];
  },

  saveCart(items: CartItem[]): CartItem[] {
    write(KEYS.CART, items);
    return items;
  },

  addToCart(items: CartItem[], product: Product, quantity = 1, variant?: string): CartItem[] {
    const existing = items.findIndex(
      item => item.product.id === product.id && item.selectedVariant === variant
    );
    if (existing >= 0) {
      const next = items.map((item, index) =>
        index === existing ? { ...item, quantity: item.quantity + quantity } : item
      );
      return commerce.saveCart(next);
    }
    return commerce.saveCart([...items, { product, quantity, selectedVariant: variant }]);
  },

  updateQuantity(items: CartItem[], index: number, quantity: number): CartItem[] {
    if (quantity <= 0) return commerce.removeAt(items, index);
    const next = items.map((item, position) =>
      position === index ? { ...item, quantity } : item
    );
    return commerce.saveCart(next);
  },

  removeAt(items: CartItem[], index: number): CartItem[] {
    return commerce.saveCart(items.filter((_, position) => position !== index));
  },

  clearCart(): CartItem[] {
    return commerce.saveCart([]);
  },

  cartCount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  cartSubtotal(items: CartItem[]): number {
    // A product whose price is still being prepared contributes nothing rather
    // than becoming a fake zero. The UI must show "price pending" alongside it.
    return items.reduce((total, item) => {
      const price = priceOf(item.product.price);
      return total + (Number.isFinite(price) ? price * item.quantity : 0);
    }, 0);
  },

  /* -------------------------- newsletter -------------------------- */

  getSubscribers(): NewsletterSubscriber[] {
    const list = read<NewsletterSubscriber[]>(KEYS.NEWSLETTER, []);
    return Array.isArray(list) ? list : [];
  },

  /**
   * Records consent locally. No mailing provider is connected, so the
   * subscriber is stored as `queued`, not `sent`. The UI must not claim
   * an email was delivered.
   */
  subscribe(email: string, source = 'footer'): SubscribeResult {
    const clean = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(clean)) {
      return { ok: false, message: 'That email address does not look complete.' };
    }

    const subscribers = commerce.getSubscribers();
    if (subscribers.some(entry => entry.email === clean && entry.status !== 'unsubscribed')) {
      return { ok: false, message: 'This address is already on the list.' };
    }

    const subscriber: NewsletterSubscriber = {
      email: clean,
      consentAt: new Date().toISOString(),
      source,
      status: 'pending-confirmation',
      delivery: 'queued'
    };

    write(KEYS.NEWSLETTER, [...subscribers, subscriber]);
    return {
      ok: true,
      message: 'Saved on this device. A confirmation email will be sent once a mailing provider is connected.',
      subscriber
    };
  },

  unsubscribe(email: string): void {
    const clean = email.trim().toLowerCase();
    const next = commerce.getSubscribers().map(entry =>
      entry.email === clean ? { ...entry, status: 'unsubscribed' as const } : entry
    );
    write(KEYS.NEWSLETTER, next);
  },

  exportSubscribersCSV(): void {
    const subscribers = commerce.getSubscribers();
    if (subscribers.length === 0) return;
    const headers = ['Email', 'Consent At', 'Source', 'Status', 'Delivery'];
    const rows = subscribers.map(entry => [
      entry.email,
      entry.consentAt,
      entry.source,
      entry.status,
      entry.delivery
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `aura-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
