/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product, Order, Review, StoreSettings, CartItem, CustomerDetails, PaymentMethod } from '../types';
import { PRODUCTS } from '../constants';

const STORAGE_KEYS = {
  PRODUCTS: 'aura_products_v9',
  ORDERS: 'aura_orders_v8',
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

export const INITIAL_ORDERS: Order[] = [];

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

  // ORDERS
  getOrders(): Order[] {
    return getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  createOrder(params: {
    customer: CustomerDetails;
    cartItems: CartItem[];
    paymentMethod: PaymentMethod;
    customerNote?: string;
  }): Order {
    const settings = this.getSettings();
    const items = params.cartItems.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      // Never invent a supplier cost. Unknown is recorded as zero and flagged.
      supplierCost: item.product.supplierCost ?? 0,
      quantity: item.quantity,
      selectedVariant: item.selectedVariant,
      imageUrl: item.product.imageUrl
    }));

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Shipping is quoted on the invoice, so the request carries no shipping charge.
    const shipping = 0;
    const discount = 0;
    const total = subtotal;
    const supplierCostTotal = items.reduce((sum, item) => sum + (item.supplierCost * item.quantity), 0);
    const estimatedProfit = total - supplierCostTotal;

    const randomId = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `AUR-${randomId}`,
      date: new Date().toISOString(),
      customer: params.customer,
      items,
      subtotal,
      shipping,
      discount,
      total,
      supplierCostTotal,
      estimatedProfit,
      paymentMethod: params.paymentMethod,
      // Only a server-side provider callback may change this to 'paid'.
      paymentStatus: 'awaiting_payment',
      fulfillmentStatus: 'unfulfilled',
      customerNote: params.customerNote
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    setStoredItem(STORAGE_KEYS.ORDERS, orders);

    // Stock is not reserved by an unpaid request. Nothing is decremented here.
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['fulfillmentStatus'], trackingNumber?: string, carrier?: string): void {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.fulfillmentStatus = status;
      if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
      if (carrier !== undefined) order.carrier = carrier;
      setStoredItem(STORAGE_KEYS.ORDERS, orders);
    }
  },

  exportOrdersCSV(): void {
    const orders = this.getOrders();
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Email',
      'Phone',
      'Street Address',
      'Apartment',
      'City',
      'State/Province',
      'Postal Code',
      'Country',
      'Product Name',
      'Supplier SKU',
      'Variant',
      'Quantity',
      'Unit Wholesale Cost',
      'Retail Total Paid',
      'Fulfillment Status',
      'Tracking Number'
    ];

    const rows: string[] = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = this.getProductById(item.productId);
        const row = [
          order.id,
          new Date(order.date).toLocaleDateString(),
          `"${order.customer.fullName.replace(/"/g, '""')}"`,
          order.customer.email,
          `"${order.customer.phone || ''}"`,
          `"${order.customer.address.replace(/"/g, '""')}"`,
          `"${(order.customer.apartment || '').replace(/"/g, '""')}"`,
          `"${order.customer.city.replace(/"/g, '""')}"`,
          `"${order.customer.stateProvince || ''}"`,
          order.customer.postalCode,
          order.customer.country,
          `"${item.name.replace(/"/g, '""')}"`,
          product?.supplierSku || 'N/A',
          `"${(item.selectedVariant || 'Standard').replace(/"/g, '""')}"`,
          item.quantity,
          item.supplierCost,
          order.total,
          order.fulfillmentStatus,
          order.trackingNumber || ''
        ];
        rows.push(row.join(','));
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_dropship_orders_${new Date().toISOString().split('T')[0]}.csv`);
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
