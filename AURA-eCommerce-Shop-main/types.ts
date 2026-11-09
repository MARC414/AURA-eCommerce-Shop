/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export type ProductCategory = 
  | 'Ayurvedic Botanicals' 
  | 'Sufi Mysticism & Marifat' 
  | 'Yoga & Eastern Wisdom' 
  | 'Philosophy & Existentialism' 
  | 'Sacred Sound & Music' 
  | 'Organic Quiet Tech'
  | 'Yoga & Sacred Materials';

export interface Product {
  id: string;
  name: string;
  authenticScript?: string;    // Contextual original lineage script (Sanskrit, Arabic, Farsi, TCM Chinese, German, Latin, or Bengali for Bengali authors)
  scriptLanguage?: string;     // 'Sanskrit' | 'Arabic' | 'Farsi' | 'TCM / Chinese' | 'German' | 'Latin' | 'Bengali'
  botanicalLatin?: string;     // Scientific botanical binomial (e.g., Syzygium aromaticum, Azadirachta indica, Bombax ceiba)
  traditionalTcm?: string;     // Traditional Chinese Medicine name and Hanzi (e.g., 丁香 Ding Xiang)
  bengaliName?: string;        // Preserved for backwards compatibility with regional works
  tagline: string;
  description: string;
  longDescription?: string;
  price: number;
  supplierCost: number;        // Wholesale cost for dropship margin calculation
  supplierSku?: string;        // Supplier identifier
  supplierUrl?: string;        // Direct supplier reference link
  stock: number;               // Current inventory count
  category: ProductCategory;
  imageUrl: string;
  gallery: string[];
  features: string[];
  variants?: string[];         // e.g. "Clothbound Heirloom", "Bengali Edition", "Digital PDF & Audio"
  rating: number;
  reviewCount: number;
  origin?: string;             // Sourcing transparency
  format?: 'Physical' | 'Digital Download' | 'Heirloom Edition';
  language?: string;           // Language(s) available
}

export interface ProductImage {
  src: string;
  alt: string;
  caption?: string;
  sourceImageUrl?: string;
  isPlaceholder?: boolean;
}

export interface ProductVariantItem {
  label: string;
  sku?: string | null;
  price?: number | null;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords?: string[];
  note?: string;
}

/**
 * Canonical Unified Product Model (ORVANYA)
 * Unifies vetted pilot products, dropshipping, affiliate external offers,
 * and future own-stock inventory with honest pricing and zero fake claims.
 */
export interface UnifiedProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;

  // Commercial model & ownership
  model: SourcingModel;            // 'dropshipping' | 'affiliate' | 'own-stock'
  purchaseOwner: PurchaseOwner;    // 'aura' | 'partner'
  listingStatus: 'published' | 'draft' | 'archived';
  category: string;
  complianceId?: string;

  // Pricing & Currency (honest: null = pending)
  price: number | null;
  currency: string;
  supplierCost?: number | null;
  stock?: number;

  // Supplier & Origin Provenance
  sourceName?: string;
  sourceProductId?: string;
  sourceSku?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  sourceTitleStatus?: string;
  supplierBrand?: string;
  supplierStore?: string;

  // Affiliate Outbound Link
  externalUrl?: string;
  disclosure?: string;

  // Media
  images: ProductImage[];
  imageUrl: string;
  gallery: string[];

  // Variants & Specifications
  variants: (ProductVariantItem | string)[];
  features: string[];
  specifications: ProductSpecification[];

  // Contextual Lineage & Language
  authenticScript?: string;
  scriptLanguage?: string;
  botanicalLatin?: string;
  traditionalTcm?: string;
  origin?: string;
  format?: 'Physical' | 'Digital Download' | 'Heirloom Edition';
  language?: string;

  // Notes & Guidance
  deliveryNote?: string;
  returnsNote?: string;
  usageNote?: string;
  dataNote?: string;
  operationalNotes?: string[];

  // SEO & Social Proof
  seo?: ProductSEO;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  supplierCost: number;
  quantity: number;
  selectedVariant?: string;
  imageUrl: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  stateProvince?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  total: number;
  supplierCostTotal: number;
  estimatedProfit: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered';
  /** Free-text note the customer added to the order request. */
  customerNote?: string;
  /** Set only by a server when the provider confirms settlement. */
  paidAt?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  adminPin: string;
  supportEmail: string;
}

export interface JournalArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  authorSage?: string;
  youtubeId?: string;          // YouTube video ID for sacred discourses
  videoTitle?: string;
  content: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export type LegalPolicyType = 
  | 'shipping' 
  | 'refund' 
  | 'privacy' 
  | 'terms' 
  | 'faq';

export type ViewState = 
  | { type: 'home'; initialCategory?: ProductCategory | 'All' }
  | { type: 'category'; categorySlug: string }
  | { type: 'product'; product: Product }
  | { type: 'journal'; article: JournalArticle }
  | { type: 'checkout' }
  | { type: 'order_success'; order: Order }
  | { type: 'admin' };

export interface CategoryInfo {
  slug: string;
  title: string;
  tagline: string;
  quote: string;
  quoteAuthor: string;
  quoteOriginalScript?: string;
  description: string;
  bgAtmosphere?: string;
  subcategories: string[];
  matchesProduct: (product: Product) => boolean;
}

/* ------------------------------------------------------------------
 * Commerce core
 *
 * The single distinction that drives every UI rule is `purchaseOwner`.
 * A customer never needs to know whether an item is dropshipped,
 * held in stock, or sourced from a partner. They only need to know
 * whether they are buying from AURA or being sent elsewhere.
 * ------------------------------------------------------------------ */

export type PurchaseOwner = 'aura' | 'partner';
export type SourcingModel = 'dropshipping' | 'affiliate' | 'own-stock';

export type PaymentStatus = 'awaiting_payment' | 'paid' | 'refunded' | 'cancelled';

/** Card data is never handled by AURA. 'card-hosted' means a redirect to the provider. */
export type PaymentMethod =
  | 'invoice'
  | 'bank-transfer'
  | 'card-hosted'
  | 'wallet'
  | 'payoneer'
  | 'card';

export interface PaymentProvider {
  id: PaymentMethod;
  name: string;
  kind: 'manual' | 'hosted';
  enabled: boolean;
  /** Shown to the customer when `enabled` is false. Never a vague placeholder. */
  unavailableReason?: string;
  settlementCountries: string[];
  note: string;
}

/* ------------------------------------------------------------------
 * Verification and compliance
 *
 * A claim may only be published when its record is 'verified'.
 * Nothing on the site may render an assurance badge from an
 * unverified record.
 * ------------------------------------------------------------------ */

export type VerificationStatus = 'verified' | 'pending' | 'not-provided' | 'not-applicable';

export type VerificationCategory =
  | 'product-safety'
  | 'labelling'
  | 'claims'
  | 'lab-test'
  | 'accreditation'
  | 'medical-report'
  | 'origin'
  | 'ethical'
  | 'food-safety'
  | 'image-rights';

export interface VerificationItem {
  id: string;
  category: VerificationCategory;
  label: string;
  status: VerificationStatus;
  issuer?: string;
  reference?: string;
  issuedAt?: string;
  expiresAt?: string;
  documentUrl?: string;
  note: string;
}

export interface ResponsiblePerson {
  name: string;
  country: string;
  role: string;
  status: 'verified' | 'supplier-stated';
  note: string;
}

export interface ProductComplianceRecord {
  id: string;
  productId: string;
  productName: string;
  riskTier: 'standard' | 'elevated' | 'regulated';
  riskReason: string;
  responsiblePerson: ResponsiblePerson | null;
  items: VerificationItem[];
  blockedClaims: string[];
  publicSummary: string;
}

export interface ComplianceRegister {
  schemaVersion: number;
  lastReviewed: string;
  purpose: string;
  statusMeaning: Record<VerificationStatus, string>;
  categories: Record<VerificationCategory, string>;
  records: ProductComplianceRecord[];
  storeLevel: VerificationItem[];
}

/* ------------------------------------------------------------------
 * Team access
 *
 * The browser cannot enforce authorisation. These types describe the
 * contract the server must implement. Until a backend exists the
 * session is local and the panel says so.
 * ------------------------------------------------------------------ */

export type AdminRole = 'owner' | 'manager' | 'fulfilment' | 'support' | 'viewer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'active' | 'invited' | 'suspended';
  createdAt: string;
  lastActiveAt: string | null;
}

export interface AdminSession {
  userId: string;
  role: AdminRole;
  startedAt: string;
  mode: 'local-preview' | 'server';
}

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  owner: ['orders:read', 'orders:write', 'catalogue:read', 'catalogue:write', 'team:read', 'team:write', 'compliance:read', 'compliance:write', 'settings:write', 'newsletter:read'],
  manager: ['orders:read', 'orders:write', 'catalogue:read', 'catalogue:write', 'team:read', 'compliance:read', 'newsletter:read'],
  fulfilment: ['orders:read', 'orders:write', 'catalogue:read'],
  support: ['orders:read', 'catalogue:read', 'newsletter:read'],
  viewer: ['orders:read', 'catalogue:read', 'compliance:read']
};

/* ------------------------------------------------------------------
 * Newsletter
 * ------------------------------------------------------------------ */

export interface NewsletterSubscriber {
  email: string;
  consentAt: string;
  source: string;
  status: 'pending-confirmation' | 'confirmed' | 'unsubscribed';
  /** No provider is connected yet, so delivery is queued locally. */
  delivery: 'queued' | 'sent';
}
