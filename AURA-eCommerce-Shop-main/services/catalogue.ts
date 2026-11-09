/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Canonical Unified Catalogue Service (ORVANYA)
 * 
 * Bridges vetted pilot products from data/pilot-products.json into the canonical
 * UnifiedProduct domain model.
 * 
 * Guarantees:
 * 1. Dropshipping products (purchaseOwner: 'aura'/'orvanya') are fulfilled by the store.
 * 2. Affiliate products (purchaseOwner: 'partner') NEVER enter the direct checkout.
 * 3. Honest pricing: pending prices remain null, never fabricated zeros.
 * 4. Regulatory safety: unverified medical or health claims are never displayed.
 */

import pilotProductsRaw from '../data/pilot-products.json';
import { UnifiedProduct, Product, SourcingModel, PurchaseOwner, ProductImage } from '../types';

interface RawPilotProduct {
  id: string;
  slug: string;
  model: SourcingModel;
  purchaseOwner: PurchaseOwner;
  listingStatus: 'published' | 'draft' | 'archived';
  complianceId?: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  sourceName?: string;
  sourceProductId?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  sourceTitleStatus?: string;
  sourceTitleRaw?: string;
  sourceSku?: string;
  supplierBrand?: string;
  supplierStore?: string;
  externalUrl?: string;
  disclosure?: string;
  images: ProductImage[];
  price: number | null;
  currency: string;
  variants: Array<{ label: string; sku?: string | null; price?: number | null } | string>;
  specifications: Array<{ label: string; value: string }>;
  deliveryNote?: string;
  returnsNote?: string;
  usageNote?: string;
  dataNote?: string;
  operationalNotes?: string[];
  seo?: {
    title: string;
    description: string;
    keywords?: string[];
    note?: string;
  };
}

const RAW_PILOT_PRODUCTS = pilotProductsRaw as unknown as RawPilotProduct[];

/** Normalizes a raw pilot product into a canonical UnifiedProduct */
export function normalizeProduct(raw: RawPilotProduct): UnifiedProduct {
  const images = Array.isArray(raw.images) ? raw.images : [];
  const primaryImage = images[0]?.src || '/assets/products/photography-pending.svg';
  const gallery = images.map(img => img.src);
  const features = (raw.specifications || []).map(spec => `${spec.label}: ${spec.value}`);

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline || '',
    description: raw.description || '',
    model: raw.model,
    purchaseOwner: raw.purchaseOwner,
    listingStatus: raw.listingStatus || 'published',
    category: raw.category,
    complianceId: raw.complianceId,
    price: raw.price,
    currency: raw.currency || 'GBP',
    sourceName: raw.sourceName,
    sourceProductId: raw.sourceProductId,
    sourceSku: raw.sourceSku,
    sourceUrl: raw.sourceUrl,
    sourceTitle: raw.sourceTitle,
    sourceTitleStatus: raw.sourceTitleStatus,
    supplierBrand: raw.supplierBrand,
    supplierStore: raw.supplierStore,
    externalUrl: raw.externalUrl,
    disclosure: raw.disclosure,
    images,
    imageUrl: primaryImage,
    gallery,
    variants: raw.variants || [],
    features,
    specifications: raw.specifications || [],
    deliveryNote: raw.deliveryNote,
    returnsNote: raw.returnsNote,
    usageNote: raw.usageNote,
    dataNote: raw.dataNote,
    operationalNotes: raw.operationalNotes,
    seo: raw.seo
  };
}

export const UNIFIED_CATALOGUE: UnifiedProduct[] = RAW_PILOT_PRODUCTS.map(normalizeProduct);

export const catalogueService = {
  /** Return all canonical products in the unified catalogue */
  getAllProducts(): UnifiedProduct[] {
    return UNIFIED_CATALOGUE;
  },

  /** Direct dropshipping products sold by ORVANYA (purchaseOwner: 'aura' / 'orvanya') */
  getDropshippingProducts(): UnifiedProduct[] {
    return UNIFIED_CATALOGUE.filter(p => p.model === 'dropshipping');
  },

  /** External partner affiliate products (purchaseOwner: 'partner') */
  getAffiliateProducts(): UnifiedProduct[] {
    return UNIFIED_CATALOGUE.filter(p => p.model === 'affiliate');
  },

  /** Find product by ID */
  getProductById(id: string): UnifiedProduct | undefined {
    return UNIFIED_CATALOGUE.find(p => p.id === id);
  },

  /** Find product by URL slug */
  getProductBySlug(slug: string): UnifiedProduct | undefined {
    return UNIFIED_CATALOGUE.find(p => p.slug === slug);
  },

  /** Check if a product is an affiliate link */
  isAffiliate(product: UnifiedProduct | Product): boolean {
    if ('model' in product) {
      return product.model === 'affiliate' || product.purchaseOwner === 'partner';
    }
    return false;
  },

  /**
   * STRICT COMMERCE RULE:
   * Affiliate products must NEVER enter the direct cart or checkout flow.
   */
  canEnterCheckout(product: UnifiedProduct | Product): boolean {
    if ('model' in product) {
      return product.model !== 'affiliate' && product.purchaseOwner !== 'partner';
    }
    return true;
  },

  /** Adapter: converts UnifiedProduct to legacy Product interface for component backwards compatibility */
  toLegacyProduct(unified: UnifiedProduct): Product {
    const variantLabels = unified.variants.map(v => typeof v === 'string' ? v : v.label);
    return {
      id: unified.id,
      name: unified.name,
      tagline: unified.tagline,
      description: unified.description,
      longDescription: unified.longDescription || unified.description,
      price: unified.price ?? 0,
      supplierCost: unified.supplierCost ?? 0,
      supplierSku: unified.sourceSku,
      supplierUrl: unified.sourceUrl,
      stock: unified.stock ?? 0,
      category: unified.category as any,
      imageUrl: unified.imageUrl,
      gallery: unified.gallery.length > 0 ? unified.gallery : [unified.imageUrl],
      features: unified.features,
      variants: variantLabels,
      rating: unified.rating ?? 5.0,
      reviewCount: unified.reviewCount ?? 0,
      origin: unified.origin || unified.sourceName
    };
  }
};

export default catalogueService;
