/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product, Review, StoreSettings, InvoiceRequest } from '../types';
import { PRODUCTS } from '../constants';

const STORAGE_KEYS = {
  PRODUCTS: 'aura_products_v9',
  /**
   * Written by `public/assets/checkout-page.js`, read here (T6). It replaced
   * `aura_orders_v8`, which only the retired React checkout ever wrote — the
   * panel and the storefront have to name the same key or the panel shows an
   * empty list while a request sits in the browser.
   */
  INVOICE_REQUESTS: 'aura_order_requests_v1',
  REVIEWS: 'aura_reviews_v8',
  SETTINGS: 'aura_settings_v8',
  WISHLIST: 'aura_wishlist_v1',
};

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'OPAR',
  currency: '$',
  freeShippingThreshold: 75,
  standardShippingFee: 9,
  adminPin: '', // Deprecated: AdminGate/auth.ts passphrase is the only lock. Never ship a default PIN.
  supportEmail: 'hello@opar.example'
};

export const INITIAL_PRODUCTS: Product[] = PRODUCTS;

export const INITIAL_REVIEWS: Review[] = [];

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed to read ${key} from storage:`, err);
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save ${key} to storage:`, err);
  }
}

export const storeService = {
  // PRODUCTS
  getProducts(): Product[] {
    const stored = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const storedMap = new Map(stored.map(p => [p.id, p]));
    let updated = false;
    for (const initP of INITIAL_PRODUCTS) {
      if (!storedMap.has(initP.id)) {
        stored.push(initP);
        updated = true;
      }
    }
    if (updated) {
      setStoredItem(STORAGE_KEYS.PRODUCTS, stored);
    }
    return stored;
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    setStoredItem(STORAGE_KEYS.PRODUCTS, products);
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    setStoredItem(STORAGE_KEYS.PRODUCTS, products);
  },

  resetProducts(): void {
    setStoredItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  // INVOICE REQUESTS (the static checkout's output; read-only here)
  getInvoiceRequests(): InvoiceRequest[] {
    const stored = getStoredItem<InvoiceRequest[]>(STORAGE_KEYS.INVOICE_REQUESTS, []);
    if (!Array.isArray(stored)) return [];
    // Newest first, and never trust a shape written by an older build.
    return stored
      .filter(request => request && typeof request.reference === 'string')
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  },

  removeInvoiceRequest(reference: string): void {
    const kept = this.getInvoiceRequests().filter(request => request.reference !== reference);
    setStoredItem(STORAGE_KEYS.INVOICE_REQUESTS, kept);
  },

  exportInvoiceRequestsCSV(): void {
    const requests = this.getInvoiceRequests();
    const headers = [
      'Reference',
      'Date',
      'Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'Postcode',
      'Country',
      'Notes',
      'Piece',
      'Variant',
      'Quantity',
      'Unit Price (blank = on request)',
      'Line Total',
      'Request Subtotal',
    ];

    const rows: string[] = [];
    const quote = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

    requests.forEach(request => {
      const customer = request.customer || ({} as InvoiceRequest['customer']);
      const items = Array.isArray(request.items) ? request.items : [];
      const subtotal = request.priceOnRequest || request.subtotal === null ? 'on request' : request.subtotal;
      if (!items.length) {
        rows.push([
          request.reference,
          new Date(request.createdAt).toLocaleDateString('en-GB'),
          quote(customer.name), customer.email || '', quote(customer.phone),
          quote(customer.address), quote(customer.city), quote(customer.postcode),
          quote(customer.country), quote(customer.notes),
          'no items recorded', '', '', '', '', subtotal
        ].join(','));
        return;
      }
      items.forEach(item => {
        const priced = typeof item.price === 'number' && Number.isFinite(item.price);
        rows.push([
          request.reference,
          new Date(request.createdAt).toLocaleDateString('en-GB'),
          quote(customer.name), customer.email || '', quote(customer.phone),
          quote(customer.address), quote(customer.city), quote(customer.postcode),
          quote(customer.country), quote(customer.notes),
          quote(item.name), quote(item.selectedVariant || ''), item.quantity,
          priced ? item.price : '',
          priced ? (item.price as number) * item.quantity : 'on request',
          subtotal
        ].join(','));
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `opar_invoice_requests_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // REVIEWS
  getReviews(productId?: string): Review[] {
    const reviews = getStoredItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (!productId) return reviews;
    return reviews.filter(r => r.productId === productId);
  },

  addReview(review: Omit<Review, 'id' | 'date' | 'verified'>): Review {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verified: true
    };
    const reviews = this.getReviews();
    reviews.unshift(newReview);
    setStoredItem(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
  },

  // SETTINGS
  getSettings(): StoreSettings {
    return getStoredItem<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings(settings: StoreSettings): void {
    setStoredItem(STORAGE_KEYS.SETTINGS, settings);
  },

  // WISHLIST
  getWishlist(): string[] {
    return getStoredItem<string[]>(STORAGE_KEYS.WISHLIST, []);
  },

  toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const index = list.indexOf(productId);
    let isAdded = false;
    if (index > -1) {
      list.splice(index, 1);
      isAdded = false;
    } else {
      list.unshift(productId);
      isAdded = true;
    }
    setStoredItem(STORAGE_KEYS.WISHLIST, list);
    window.dispatchEvent(new CustomEvent('aura_wishlist_updated', { detail: { list } }));
    return isAdded;
  },

  isWishlisted(productId: string): boolean {
    const list = this.getWishlist();
    return list.includes(productId);
  },

  removeFromWishlist(productId: string): void {
    const list = this.getWishlist().filter(id => id !== productId);
    setStoredItem(STORAGE_KEYS.WISHLIST, list);
    window.dispatchEvent(new CustomEvent('aura_wishlist_updated', { detail: { list } }));
  },

  clearWishlist(): void {
    setStoredItem(STORAGE_KEYS.WISHLIST, []);
    window.dispatchEvent(new CustomEvent('aura_wishlist_updated', { detail: { list: [] } }));
  }
};
