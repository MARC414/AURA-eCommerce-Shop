/**
 * The piece: one product page, its actions, its rich details & cross-links,
 * collapsible E-E-A-T compliance accordions, AEO Q&A, JSON-LD, and shared cards.
 */

import { readFileSync } from 'node:fs';
import {
  BRAND,
  collections,
  escapeHtml,
  arrow,
  external,
  icons,
  documentPage,
  whatsappLink,
  whatsappDisclosure,
  medallionPictureMarkup
} from './chrome.mjs';

const complianceRegister = JSON.parse(readFileSync(new URL('../data/compliance.json', import.meta.url), 'utf8'));

export const MODELS = {
  dropshipping: {
    path: '/shop/',
    label: 'Shop',
    badge: `${BRAND} shop`,
    heading: `The ${BRAND} shop`,
    description: 'Objects chosen for use, not display: herbs, everyday care, showpieces, practice and craft.'
  },
  affiliate: {
    path: '/discover/',
    label: 'Partner offers',
    badge: 'Partner offer',
    heading: 'Found elsewhere, chosen here.',
    description: `Pieces ${BRAND} introduces but does not fulfil. The purchase, delivery and returns belong to the merchant.`
  }
};

function httpsUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Supplier and referral URLs must use HTTPS without embedded credentials.');
  }
  return value;
}

function imageUrl(value) {
  if (/^\/assets\/products\/[a-z0-9-]+\.(?:svg|jpg|jpeg|png|webp|avif)$/.test(value)) return value;
  return httpsUrl(value);
}

const FORBIDDEN_CLAIM_PATTERNS = [
  /\banti[-\s]?acne\b/i,
  /\bclinically\s+proven\b/i,
  /\bcures?\b/i,
  /\btreats?\s+(?:acne|anxiety|depression|disease|illness|insomnia)\b/i,
  /\bverified\s+buyer\b/i,
  /\b5[-\s]?star\b/i
];

export function validateProduct(product) {
  if (!Object.hasOwn(MODELS, product.model)) throw new Error('Unknown product model.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) throw new Error('Invalid product slug.');
  if (!product.id || !product.name || !product.description || !product.sourceName) {
    throw new Error('A product needs its ID, name, description, and source name.');
  }
  httpsUrl(product.sourceUrl);
  if (product.model === 'affiliate') {
    httpsUrl(product.externalUrl);
    if (!product.disclosure) throw new Error('External offers need a disclosure.');
  }
  if (!product.images?.length || !Array.isArray(product.variants) || !Array.isArray(product.specifications)) {
    throw new Error('A product needs images, variants, and specifications arrays.');
  }
  product.images.forEach(image => {
    imageUrl(image.src);
    if (!image.alt || !image.caption) throw new Error('Every image needs alt text and a caption.');
  });
  if (product.price !== null && product.price !== undefined && (!Number.isFinite(product.price) || product.price < 0)) {
    throw new Error('A price must be null or a non-negative number.');
  }
  if (Object.hasOwn(product, 'rating') || Object.hasOwn(product, 'aggregateRating') || Object.hasOwn(product, 'reviewCount')) {
    throw new Error(`Product ${product.slug} cannot carry fabricated rating/review fields.`);
  }
  const publicText = [
    product.name,
    product.tagline,
    product.cardLine,
    product.description,
    ...(product.longDescription || []),
    product.seo?.title,
    product.seo?.description
  ].filter(Boolean).join(' ');
  for (const pattern of FORBIDDEN_CLAIM_PATTERNS) {
    if (pattern.test(publicText)) {
      throw new Error(`Product ${product.slug} contains prohibited claim wording (${pattern}).`);
    }
  }
  return product;
}

export function productPath(product) {
  validateProduct(product);
  return `${MODELS[product.model].path}${product.slug}/`;
}

/** Variants may be a plain label or an object with label/SKU/price. */
export function variantLabel(variant) {
  if (typeof variant === 'string') return variant;
  if (!variant || typeof variant.label !== 'string') throw new Error('Every variant needs a label.');
  return variant.price === null || variant.price === undefined
    ? `${variant.label} — price on request`
    : variant.label;
}

export function collectionFor(product) {
  return collections.find(collection => (collection.matches || []).includes(product.category)) || null;
}

export function categoryPath(collection) {
  return `/shop/${collection.slug}/`;
}

/**
 * Unit 1.4: Drawn stroke-only botanical silhouette mark for empty mounts.
 * Accent stroke at 18% opacity via `.empty-mount__mark` — never crops an image.
 */
export function roomBotanicalMark(category = '') {
  const key = String(category).toLowerCase();
  if (key.includes('herbal')) {
    return `<svg class="empty-mount__mark" viewBox="0 0 120 140" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M60 124V46"/><path d="M60 98c-14-4-24-16-24-30 13 3 22 12 24 25Z"/><path d="M60 80c15-5 25-17 24-32-13 4-22 14-24 27Z"/><path d="M60 56c-11-9-15-22-9-34 9 8 13 20 9 34Z"/><path d="M60 48c10-8 16-18 14-29-8 6-13 15-14 29Z"/><circle cx="60" cy="24" r="2.5"/></svg>`;
  }
  if (key.includes('everyday') || key.includes('care')) {
    return `<svg class="empty-mount__mark" viewBox="0 0 120 140" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M60 122C60 84 60 56 60 22"/><path d="M60 96c-20-6-32-24-28-46 18 6 28 24 28 46Z"/><path d="M60 72c18-7 28-23 24-43-17 7-24 22-24 43Z"/></svg>`;
  }
  if (key.includes('showpiece')) {
    return `<svg class="empty-mount__mark" viewBox="0 0 120 140" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M36 92c0 16 11 26 24 26s24-10 24-26"/><ellipse cx="60" cy="70" rx="28" ry="12"/><path d="M32 70c2 22 11 40 28 40s26-18 28-40"/><path d="M60 58V28m-10 14 10-14 10 14"/></svg>`;
  }
  if (key.includes('yoga')) {
    return `<svg class="empty-mount__mark" viewBox="0 0 120 140" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M60 30c9 14 12 28 0 46-12-18-9-32 0-46Z"/><path d="M60 76c-18-6-30-2-36 12 14 6 28 2 36-12Z"/><path d="M60 76c18-6 30-2 36 12-14 6-28 2-36-12Z"/><path d="M28 106h64"/></svg>`;
  }
  if (key.includes('art') || key.includes('craft')) {
    return `<svg class="empty-mount__mark" viewBox="0 0 120 140" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M44 40h32l-4 12c12 10 16 26 12 42-4 14-12 22-24 22s-20-8-24-22c-4-16 0-32 12-42l-4-12Z"/><path d="M40 76h40"/></svg>`;
  }
  return `<svg class="empty-mount__mark" viewBox="0 0 120 140" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="60" cy="96" rx="28" ry="14"/><path d="M60 82V28"/><path d="M60 56c12-12 24-12 28-4-10 10-20 10-28 4Z"/><path d="M60 44c-11-11-22-10-26-2 9 8 18 8 26 2Z"/></svg>`;
}

export function botanicalBinomial(product) {
  const s = `${product.slug} ${product.name}`.toLowerCase();
  if (s.includes('ashwagandha')) return 'Withania somnifera';
  if (s.includes('turmeric') && s.includes('pad')) return 'Curcuma longa · Partner Specimen';
  if (s.includes('turmeric')) return 'Curcuma longa · Solid Bar';
  if (s.includes('aloe')) return 'Aloe barbadensis · Cold Form';
  return product.category;
}

export function specimenPlateMarkup(product, index = 0) {
  const code = product.sourceSku || `OPAR-${String(index + 1).padStart(2, '0')}`;
  const latin = botanicalBinomial(product);
  const sub = product.format || product.cardLine || product.tagline;
  const origin = product.specifications?.find(s => /origin|manufacturing|country/i.test(s.label))?.value || product.sourceName;
  return `<div class="v2-specimen-plate" aria-hidden="true">
    <img class="v2-specimen-plate__orbit" src="/assets/brand/web/opar-mark-green.svg" alt="" width="180" height="180" loading="lazy" decoding="async">
    <div class="v2-specimen-plate__top">
      <span>Specimen No. ${String(index + 1).padStart(2, '0')}</span>
      <span>${escapeHtml(code)}</span>
    </div>
    <div class="v2-specimen-plate__body">
      <span class="v2-specimen-plate__latin">${escapeHtml(latin)}</span>
      <span class="v2-specimen-plate__sub">${escapeHtml(sub)}</span>
    </div>
    <div class="v2-specimen-plate__foot">
      <span>${escapeHtml(product.category)}</span>
      <span>${escapeHtml(origin)}</span>
    </div>
  </div>`;
}

function emptyMountMarkup(category, { compact = false, hidden = false, product = null, index = 0 } = {}) {
  if (product) {
    return `<div class="empty-mount${compact ? ' empty-mount--card' : ''} v2-empty-mount" data-empty-mount${hidden ? ' hidden' : ''} aria-hidden="true">
      ${specimenPlateMarkup(product, index)}
      <span class="sr-only">Photograph in preparation</span>
    </div>`;
  }
  return `<div class="empty-mount${compact ? ' empty-mount--card' : ''}" data-empty-mount${hidden ? ' hidden' : ''} aria-hidden="true">
    <span class="empty-mount__corner empty-mount__corner--tl"></span>
    <span class="empty-mount__corner empty-mount__corner--tr"></span>
    <span class="empty-mount__corner empty-mount__corner--bl"></span>
    <span class="empty-mount__corner empty-mount__corner--br"></span>
    <img class="empty-mount__orbit" src="/assets/brand/web/opar-mark-green.svg" alt="" width="220" height="220" loading="lazy" decoding="async">
    ${roomBotanicalMark(category)}
    <span class="empty-mount__label">Photograph in preparation</span>
  </div>`;
}

function pictureMarkup(image, { width = 1200, height = 1200, alt = '', lazy = false, attrs = '' } = {}) {
  const loadAttr = lazy ? 'loading="lazy"' : 'fetchpriority="high"';
  const imgTag = `<img ${attrs ? `${attrs} ` : ''}src="${escapeHtml(image.src)}" alt="${escapeHtml(alt)}" width="${Number(image.width) || width}" height="${Number(image.height) || height}" ${loadAttr} decoding="async" data-fallback-empty="true">`;
  if (image.srcAvif || image.srcWebp) {
    const fullWidth = Number(image.width) || 1200;
    const avifSrcset = image.src800Avif && image.srcAvif
      ? `${escapeHtml(image.src800Avif)} 800w, ${escapeHtml(image.srcAvif)} ${fullWidth}w`
      : escapeHtml(image.srcAvif || '');
    const webpSrcset = image.src800Webp && image.srcWebp
      ? `${escapeHtml(image.src800Webp)} 800w, ${escapeHtml(image.srcWebp)} ${fullWidth}w`
      : escapeHtml(image.srcWebp || '');
    const sizes = lazy ? '(min-width: 1101px) 360px, (min-width: 761px) 44vw, 90vw' : '(min-width: 1025px) 520px, (min-width: 761px) 46vw, 92vw';
    return `<picture>
      ${avifSrcset ? `<source type="image/avif" srcset="${avifSrcset}" sizes="${sizes}">` : ''}
      ${webpSrcset ? `<source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">` : ''}
      ${imgTag}
    </picture>`;
  }
  return imgTag;
}

/**
 * JSON-LD: Product (+ Offer only when numeric price exists, never invented reviews)
 * + BreadcrumbList + FAQPage (when faq items exist).
 */
export function productJsonLd(product, canonicalPath) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    url: canonicalPath,
    keywords: product.seo?.keywords?.join(', ') || ''
  };
  const photograph = product.images.find(image => !image.isEmptyMount && !image.isPlaceholder && !image.src.endsWith('.svg'))
    || product.images.find(image => !image.isEmptyMount && !image.src.endsWith('.svg'));
  if (photograph) schema.image = photograph.src;
  if (product.supplierBrand) schema.brand = { '@type': 'Brand', name: product.supplierBrand };
  if (product.sourceSku) schema.sku = product.sourceSku;
  if (Number.isFinite(product.price)) {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: product.currency || 'GBP',
      price: Number(product.price).toFixed(2),
      availability: product.isPlaceholder
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/OutOfStock'
    };
  }
  const crumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: MODELS[product.model].label, item: MODELS[product.model].path }
  ];
  const collection = collectionFor(product);
  if (collection && product.model === 'dropshipping') {
    crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: collection.label, item: categoryPath(collection) });
  }
  crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: product.name, item: canonicalPath });
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs
  };
  const graph = [schema, breadcrumb];
  if (Array.isArray(product.faq) && product.faq.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: product.faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });
  }
  return graph;
}

function gallery(product, { useSpecimenMount = true } = {}) {
  const first = product.images[0];
  const thumbnails = product.images.slice(0, 3);
  const mainBlendAttr = first.blend === 'none' ? ' data-blend="none"' : '';
  const isFirstEmpty = Boolean(first.isEmptyMount);
  return `
    <div class="product-gallery" data-gallery>
      <figure class="main-image product-mount"${mainBlendAttr} data-main-mount>
        <span class="image-corner-label">${product.model === 'affiliate' ? 'Partner offer' : `${BRAND} folio`}</span>
        ${pictureMarkup(first, {
          width: 1200,
          height: 1200,
          alt: isFirstEmpty ? '' : first.alt,
          lazy: isFirstEmpty,
          attrs: `data-main-image${isFirstEmpty ? ' hidden' : ''}`
        })}
        ${emptyMountMarkup(product.category, { hidden: !isFirstEmpty, product: useSpecimenMount ? product : null })}
      </figure>
      ${product.images.length ? `<div class="gallery-thumbnails" role="group" aria-label="Product gallery">
        ${thumbnails.map((image, index) => {
          const thumbEmpty = Boolean(image.isEmptyMount);
          const thumbContent = thumbEmpty
            ? `<span class="thumbnail__empty-mark" aria-hidden="true">${roomBotanicalMark(product.category)}</span>`
            : `<img src="${escapeHtml(image.src800Jpg || image.src)}" alt="" width="80" height="80" loading="lazy" decoding="async">`;
          return `
          <button type="button" class="thumbnail product-mount product-mount--square"${image.blend === 'none' ? ' data-blend="none"' : ''} aria-label="Show image ${index + 1}: ${escapeHtml(image.alt)}" aria-pressed="${index === 0}" data-gallery-src="${escapeHtml(image.src)}" data-gallery-alt="${escapeHtml(image.alt)}" data-gallery-caption="${escapeHtml(image.caption)}"${thumbEmpty ? ' data-gallery-empty="true"' : ''}${image.blend === 'none' ? ' data-gallery-blend="none"' : ''}>
            ${thumbContent}
          </button>`;
        }).join('')}
        <span class="gallery-note">A closer look,<br>without the noise.</span>
      </div>` : ''}
      <p class="image-caption" data-gallery-caption aria-live="polite">${escapeHtml(first.caption)}</p>
    </div>`;
}

export function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP' }).format(amount);
  } catch {
    return `${Number(amount).toFixed(2)} ${currency || ''}`.trim();
  }
}

function priceLabel(product) {
  if (!Number.isFinite(product.price)) {
    return '<span class="price-value price-request" data-price-value>Price on request</span>';
  }
  const price = formatMoney(product.price, product.currency);
  return `<span class="price-value" data-price-value>${escapeHtml(price)} <span class="currency">${escapeHtml(product.currency)}</span></span>`;
}

function wishlistToggle(product) {
  return `
    <button type="button" class="wishlist-toggle" data-wishlist-toggle="${escapeHtml(product.id)}" aria-pressed="false">
      ${icons.heart}<span data-wishlist-label>Save to wishlist</span>
    </button>`;
}

function cartAttributes(product) {
  const realImage = product.images.find(item => !item.isEmptyMount && !item.isPlaceholder)?.src
    || product.images.find(item => !item.isEmptyMount)?.src
    || product.images[0].src;
  return [
    ['data-product-id', product.id],
    ['data-product-name', product.name],
    ['data-product-slug', product.slug],
    ['data-product-tagline', product.tagline],
    ['data-product-price', product.price === null || product.price === undefined ? '' : String(product.price)],
    ['data-product-currency', product.currency || 'GBP'],
    ['data-product-category', product.category],
    ['data-product-model', product.model],
    ['data-product-path', productPath(product)],
    ['data-product-image', realImage]
  ].map(([name, value]) => `${name}="${escapeHtml(value)}"`).join(' ');
}

function primarySkuFor(product) {
  const firstVariantObj = product.variants.find(v => typeof v === 'object' && v !== null) || null;
  return firstVariantObj?.sku || product.sourceSku || product.sourceProductId || product.id;
}

function folioActionsCopyControl() {
  return `<button type="button" class="text-link v2-copy-folio" data-v2-copy-folio>Copy folio link</button><output class="small-note" data-v2-copy-folio-status aria-live="polite"></output>`;
}

function dropshippingActions(product) {
  const canPurchase = product.purchaseOwner === 'aura';
  const initialSku = primarySkuFor(product);
  const waHref = whatsappLink(`Hello ${BRAND}, enquiry regarding ${product.name} (${initialSku}).`);
  const action = canPurchase
    ? `<button type="button" class="button button-primary" data-add-to-cart ${cartAttributes(product)} aria-describedby="ordering-note">Add to bag ${arrow}</button>
      <p class="action-note" id="ordering-note">Price, delivery and payment preference are confirmed on your written invoice before anything is paid.</p>`
    : `<a class="button button-secondary" href="/contact/" aria-describedby="ordering-note">Ask about this piece ${arrow}</a>
      <p class="action-note" id="ordering-note">This piece is not sold through ${BRAND}’s cart. Contact the house for availability.</p>`;
  const bagBridge = canPurchase
    ? `<div class="v2-bag-bridge" data-v2-bag-bridge hidden>
        <span class="v2-bag-bridge__note">Saved to inquiry bag</span>
        <div class="v2-bag-bridge__links">
          <a class="text-link" href="/cart/">Review Bag ${arrow}</a>
          <a class="text-link" href="/checkout/">Issue Proforma ${arrow}</a>
        </div>
      </div>`
    : '';
  const priceNote = product.samplePricing
    ? 'Construction sample pricing · confirmed on invoice before settlement'
    : 'Confirmed on invoice · no payment on this page';
  return `
    <section class="purchase-panel" aria-labelledby="purchase-heading">
      <h2 class="eyebrow" id="purchase-heading">${escapeHtml(BRAND)} folio inquiry</h2>
      <div class="price-row">
        ${priceLabel(product)}
        <span class="small-note">${escapeHtml(priceNote)}</span>
        ${product.dispatchNote ? `<span class="dispatch-tag">${escapeHtml(product.dispatchNote)}</span>` : ''}
      </div>
      <div class="variant-field">
        <label class="field-label" for="product-variant">Options</label>
        <select id="product-variant" data-variant${product.variants.length ? '' : ' disabled'}>
          ${product.variants.length
            ? product.variants.map(variant => {
                const isObj = typeof variant === 'object' && variant !== null;
                const val = isObj && typeof variant.label === 'string' ? variant.label : String(variant);
                const priceAttr = isObj && Number.isFinite(variant.price) ? ` data-variant-price="${escapeHtml(String(variant.price))}"` : '';
                const skuAttr = isObj && variant.sku ? ` data-variant-sku="${escapeHtml(variant.sku)}"` : '';
                return `<option value="${escapeHtml(val)}"${priceAttr}${skuAttr}>${escapeHtml(variantLabel(variant))}</option>`;
              }).join('')
            : '<option>One edition</option>'}
        </select>
      </div>
      <div class="quantity-row">
        <span class="field-label" id="quantity-label">Quantity</span>
        <div class="quantity-control" role="group" aria-labelledby="quantity-label">
          <button type="button" aria-label="Decrease quantity" data-quantity-change="-1" disabled>−</button>
          <output data-quantity aria-label="Selected quantity">1</output>
          <button type="button" aria-label="Increase quantity" data-quantity-change="1">+</button>
        </div>
      </div>
      ${action}
      <output class="selection-status" data-selection-status aria-live="polite">1 selected.</output>
      ${bagBridge}
      <div class="whatsapp-inquiry">
        <div class="v2-folio-actions">
          <a class="text-link" href="${escapeHtml(waHref)}" target="_blank" rel="noopener noreferrer">Enquire via WhatsApp ${external}</a>
          ${folioActionsCopyControl()}
        </div>
        <p class="small-note">${escapeHtml(whatsappDisclosure())}</p>
      </div>
    </section>`;
}

function affiliateActions(product) {
  return `
    <section class="purchase-panel external-panel" aria-labelledby="offer-heading">
      <h2 class="eyebrow" id="offer-heading">Partner offer</h2>
      <div class="price-row">
        <span class="price-value price-request">Price on ${escapeHtml(product.sourceName)}</span>
        <span class="small-note">Options, currency and live availability are confirmed there.</span>
        ${product.dispatchNote ? `<span class="dispatch-tag">${escapeHtml(product.dispatchNote)}</span>` : ''}
      </div>
      <p class="merchant-note">This page introduces the listing. If you continue, you will leave ${BRAND} and view it on ${escapeHtml(product.sourceName)}.</p>
      <a class="button button-primary external-cta" href="${escapeHtml(product.externalUrl)}" target="_blank" rel="sponsored noopener noreferrer" aria-describedby="offer-disclosure">View offer on ${escapeHtml(product.sourceName)} ${external}<span class="sr-only"> (opens in a new tab)</span></a>
      <p class="action-note">Purchase, delivery and returns are handled by ${escapeHtml(product.sourceName)}. No ${BRAND} cart or checkout is used.</p>
      <div class="v2-folio-actions">${folioActionsCopyControl()}</div>
      <aside class="disclosure" id="offer-disclosure"><strong>Referral disclosure</strong><p>${escapeHtml(product.disclosure)}</p></aside>
    </section>`;
}

function habitatContextFor(product) {
  const s = `${product.slug} ${product.name}`.toLowerCase();
  if (s.includes('ashwagandha')) {
    return {
      quote: '“The sovereign root of classical Ayurveda, recorded without stress or cure claims.”',
      title: 'Withania somnifera · Habitat Plate',
      text: 'Grown in dry sub-Himalayan soils; here presented strictly by label weight (1,300 mg per serving) while laboratory reports remain requested.',
      avif: '/assets/botanicals/ashwagandha-env-forest.avif',
      webp: '/assets/botanicals/ashwagandha-env-forest.webp',
      jpg: '/assets/botanicals/ashwagandha-env-forest.jpg',
      alt: 'Misty sub-Himalayan forest understory'
    };
  }
  if (s.includes('turmeric')) {
    return {
      quote: '“Rooted in domestic ritual — separated clearly from medicinal or brightening claims.”',
      title: 'Curcuma longa · Plantation Plate',
      text: 'Fresh rhizome colour paired with a plain solid cleansing formulation; therapeutic wording is withheld prior to full safety review.',
      avif: '/assets/botanicals/turmeric-plantation-env.avif',
      webp: '/assets/botanicals/turmeric-plantation-env.webp',
      jpg: '/assets/botanicals/turmeric-plantation-env.jpg',
      alt: 'Tropical turmeric leaf canopy'
    };
  }
  return null;
}

function folioReferenceSection(product, complianceRecord) {
  const isAffiliate = product.model === 'affiliate';
  const firstVariantObj = product.variants.find(v => typeof v === 'object' && v !== null) || null;
  const initialSku = firstVariantObj?.sku || product.sourceSku || product.sourceProductId || product.id;
  const initialPrice = Number.isFinite(firstVariantObj?.price) ? firstVariantObj.price : product.price;
  const initialRateText = isAffiliate
    ? `Price on ${product.sourceName}`
    : Number.isFinite(initialPrice)
    ? `${formatMoney(initialPrice, product.currency)} ${product.currency}`
    : 'Price on request';
  const verifiedChecks = complianceRecord ? complianceRecord.items.filter(i => i.status === 'verified').length : 0;
  const totalChecks = complianceRecord ? complianceRecord.items.length : 0;
  const verificationCountLabel = complianceRecord
    ? `${verifiedChecks} of ${totalChecks} checks verified`
    : 'Construction sample';
  const verificationRows = complianceRecord
    ? [
        ['Source listing', complianceRecord.items.find(i => i.category === 'origin')?.status || 'pending'],
        ['Label / INCI', complianceRecord.items.find(i => i.category === 'labelling')?.status || 'not-provided'],
        ['Laboratory report', complianceRecord.items.find(i => i.category === 'lab-test')?.status || 'not-provided']
      ]
    : [
        ['Source listing', 'Construction sample'],
        ['Label / INCI', 'Pending intake'],
        ['Laboratory report', 'Not required yet']
      ];

  return `
    <section class="v2-folio-ref" aria-label="Folio reference and verification status">
      <div class="v2-folio-ref__head">
        <span class="v2-verify-meter__title">Folio Reference</span>
        <span class="v2-folio-ref__tally">${escapeHtml(verificationCountLabel)}</span>
      </div>
      <dl class="v2-folio-ref__grid">
        <div><dt>SKU</dt><dd data-v2-folio-sku data-base-sku="${escapeHtml(initialSku)}">${escapeHtml(initialSku)}</dd></div>
        <div><dt>Format</dt><dd>${escapeHtml(product.format || '—')}</dd></div>
        <div><dt>Source</dt><dd>${escapeHtml(product.sourceName)}</dd></div>
        <div><dt>Rate</dt><dd data-v2-folio-rate data-base-rate="${escapeHtml(initialRateText)}" data-currency="${escapeHtml(product.currency || 'GBP')}">${escapeHtml(initialRateText)}</dd></div>
      </dl>
      <div class="v2-verify-meter" aria-label="Verification status summary">
        ${verificationRows.map(([lbl, st]) => `<div class="v2-verify-row"><span>${escapeHtml(lbl)}</span><span class="status-pill status-${escapeHtml(st === 'verified' ? 'verified' : st === 'pending' ? 'pending' : 'not-provided')}">${escapeHtml(st)}</span></div>`).join('')}
      </div>
    </section>`;
}

function complianceAccordions(product, complianceRecord) {
  const items = complianceRecord?.items || [];
  const verifiedCount = items.filter(item => item.status === 'verified').length;
  const blocked = complianceRecord?.blockedClaims || [];
  const summaryText = complianceRecord
    ? `Full verification file (${verifiedCount} of ${items.length} checks verified)`
    : 'Construction sample status & sourcing standards';
  const lastUpdated = product.lastUpdated || complianceRegister.lastReviewed || '2026-11-21';
  const sourceHref = product.model === 'affiliate' ? product.externalUrl : product.sourceUrl;
  const rp = complianceRecord?.responsiblePerson;

  return `
    <section class="compliance-details-section v2-audit-section" id="compliance-section" aria-labelledby="compliance-heading">
      <div class="section-heading">
        <span class="eyebrow">Provenance &amp; verification</span>
        <h2 id="compliance-heading">Verification file &amp; buying terms</h2>
      </div>
      <div class="compliance-accordion">
        <details>
          <summary>${escapeHtml(summaryText)}</summary>
          <div class="compliance-accordion__body">
            ${complianceRecord
              ? `<p class="small-note">${escapeHtml(complianceRecord.riskReason || complianceRecord.publicSummary)}</p>
                 <p class="small-note">${escapeHtml(complianceRecord.publicSummary)}</p>
                 ${rp ? `<p class="small-note"><strong>Supplier-stated representative:</strong> ${escapeHtml(rp.name)} (${escapeHtml(rp.country)}) — ${escapeHtml(rp.note)}</p>` : ''}
                 <ul class="verification-list">
                   ${items.map(item => `
                     <li class="verification-item">
                       <span class="status-pill status-${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>
                       <span class="verification-copy">
                         <strong>${escapeHtml(item.label)}</strong>
                         <span>${escapeHtml(item.note)}</span>
                       </span>
                     </li>`).join('')}
                 </ul>`
              : `<p class="small-note">This construction sample holds placeholder room attributes while maker intake, batch traceability, and laboratory certificates are assembled. Read <a class="text-link" href="/about/sourcing/">Sourcing &amp; makers</a> for live verification standards.</p>`}
          </div>
        </details>
        <details>
          <summary>Excluded supplier claims, review audit &amp; original source</summary>
          <div class="compliance-accordion__body">
            ${blocked.length
              ? `<div class="claims-panel claims-panel--compact">
                   <p>Excluded supplier wording and unverified claims:</p>
                   <ul>${blocked.map(claim => `<li>${escapeHtml(claim)}</li>`).join('')}</ul>
                 </div>`
              : `<p class="small-note">${escapeHtml(BRAND)} publishes no unverified treatment, cure, or certification claims on any room piece.</p>`}
            ${!product.isPlaceholder
              ? `<p class="small-note"><strong>Listing reference:</strong> ${escapeHtml(product.sourceTitle)} — ${escapeHtml(product.sourceTitleStatus)} <a class="text-link" href="${escapeHtml(sourceHref)}" target="_blank" rel="${product.model === 'affiliate' ? 'sponsored ' : ''}noopener noreferrer">View the original ${escapeHtml(product.sourceName)} listing ${external}<span class="sr-only"> (opens in a new tab)</span></a></p>`
              : ''}
            <p class="small-note"><strong>Reviewed by:</strong> Not yet reviewed by a named person · <strong>Last updated:</strong> <time datetime="${escapeHtml(lastUpdated)}">${escapeHtml(lastUpdated)}</time></p>
            <div class="content-links">
              <a class="text-link" href="/help/#compliance-faq">Compliance &amp; FAQ ${arrow}</a>
              <a class="text-link" href="/about/sourcing/">Read sourcing standards ${arrow}</a>
              <a class="text-link" href="/policies/health-disclaimer/">Health disclaimer ${arrow}</a>
              <a class="text-link" href="/contact/">Report a question ${arrow}</a>
            </div>
          </div>
        </details>
        <details>
          <summary>Delivery, returns &amp; directions before ordering</summary>
          <div class="compliance-accordion__body">
            <p class="small-note"><strong>Delivery &amp; fulfilment:</strong> ${escapeHtml(product.deliveryNote)} <a class="text-link" href="/policies/shipping/">Shipping policy ${arrow}</a></p>
            <p class="small-note"><strong>Returns &amp; support:</strong> ${escapeHtml(product.returnsNote)} <a class="text-link" href="/policies/returns/">Returns policy ${arrow}</a></p>
            <p class="small-note"><strong>Directions &amp; invoicing:</strong> ${escapeHtml(product.usageNote)} <a class="text-link" href="/policies/payment/">Payment &amp; invoicing ${arrow}</a></p>
          </div>
        </details>
      </div>
    </section>`;
}

function folioDetails(product, complianceRecord) {
  const habitat = habitatContextFor(product);
  const paragraphs = Array.isArray(product.longDescription) && product.longDescription.length
    ? product.longDescription
    : [product.description];
  const links = Array.isArray(product.crossLinks) ? product.crossLinks : [];
  const faqItems = Array.isArray(product.faq) ? product.faq : [];

  const monographTopHtml = habitat ? `
        <div class="v2-monograph-top">
          <blockquote class="v2-monograph-quote">${escapeHtml(habitat.quote)}</blockquote>
          <div class="v2-habitat-plate">
            <picture>
              <source type="image/avif" srcset="${escapeHtml(habitat.avif)}">
              <source type="image/webp" srcset="${escapeHtml(habitat.webp)}">
              <img src="${escapeHtml(habitat.jpg)}" alt="${escapeHtml(habitat.alt)}" width="140" height="96" loading="lazy" decoding="async">
            </picture>
            <div><strong>${escapeHtml(habitat.title)}</strong><p>${escapeHtml(habitat.text)}</p></div>
          </div>
        </div>` : '';

  return `
      <section class="v2-monograph-band" id="description-section" aria-labelledby="v2-monograph-title">
        <div class="v2-monograph-head">
          <div>
            <span class="eyebrow">Factual record &amp; care</span>
            <h2 id="v2-monograph-title">Material provenance monograph</h2>
          </div>
          <span class="small-note">${escapeHtml(product.category)} · ${escapeHtml(product.sourceName)}</span>
        </div>
        ${monographTopHtml}
        <div class="v2-monograph-columns details-story">
          <div class="v2-monograph-prose">
            ${paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
          </div>
          <div class="v2-monograph-aside">
            ${product.careGuide ? `<div class="care-callout"><span class="eyebrow">Care &amp; handling</span><p>${escapeHtml(product.careGuide)}</p></div>` : ''}
            <div class="v2-censor-stamp">
              <span class="v2-censor-stamp__seal">What OPAR Will Not Claim</span>
              <p>${escapeHtml(complianceRecord?.publicSummary || 'Unverified treatment, brightening, cure, or unsubstantiated certification copy is stripped from this folio.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="v2-claims-ledger" aria-labelledby="v2-ledger-heading">
        <div class="section-heading">
          <span class="eyebrow">Radical transparency · Verified record</span>
          <h2 id="v2-ledger-heading">Known &amp; Documented</h2>
        </div>
        <div class="v2-ledger-col">
          <ul class="v2-ledger-list v2-ledger-list--specs">
            ${product.specifications.map(spec => `<li><span><strong>${escapeHtml(spec.label)}</strong></span><span>${escapeHtml(spec.value)}</span></li>`).join('')}
          </ul>
        </div>
      </section>

      ${complianceAccordions(product, complianceRecord)}

      ${faqItems.length ? `
      <section class="product-faq-section" id="faq-section" aria-labelledby="faq-heading">
        <div class="section-heading">
          <span class="eyebrow">Common questions</span>
          <h2 id="faq-heading">Questions about this piece</h2>
        </div>
        <div class="faq-list">
          ${faqItems.map((item, idx) => `<details${idx === 0 ? ' open' : ''}><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}
        </div>
      </section>` : ''}

      ${links.length ? `
      <section class="cross-links-section" aria-labelledby="cross-links-heading">
        <div class="section-heading">
          <span class="eyebrow">Connect across ${escapeHtml(BRAND)}</span>
          <h2 id="cross-links-heading">Related rooms, notes &amp; standards</h2>
        </div>
        <nav class="cross-links" aria-label="Cross-links for ${escapeHtml(product.name)}">
          ${links.map(link => `<a class="cross-link-tile" href="${escapeHtml(link.href)}"><span>${escapeHtml(link.label)}</span>${arrow}</a>`).join('')}
        </nav>
      </section>` : ''}`;
}

function cardPrice(product) {
  if (product.model === 'affiliate') return `View with ${escapeHtml(product.sourceName)}`;
  if (!Number.isFinite(product.price)) return 'Price on request';
  return `${formatMoney(product.price, product.currency)}${product.isPlaceholder || product.samplePricing ? ' · Construction sample' : ''}`;
}

function cardAvailability(product) {
  const availability = product.availability;
  if (!availability || availability.verified !== true || !availability.label) return '';
  return `<span class="card-availability">${escapeHtml(availability.label)}</span>`;
}

export function card(product, index = 0) {
  const first = product.images[0];
  const collection = collectionFor(product);
  const isAffiliate = product.model === 'affiliate';
  const eyebrow = collection && !isAffiliate
    ? `<a href="${categoryPath(collection)}">${escapeHtml(product.category)}</a>`
    : escapeHtml(product.category);
  const badge = `<span class="badge${isAffiliate ? ' badge-partner' : ''}">${MODELS[product.model].badge}</span>`;
  const cta = isAffiliate ? 'View the offer' : 'Open folio';
  const blendAttr = first.blend === 'none' ? ' data-blend="none"' : '';
  const cardMedia = first.isEmptyMount
    ? emptyMountMarkup(product.category, { compact: true, product, index })
    : pictureMarkup(first, {
        width: 800,
        height: 800,
        alt: '',
        lazy: true,
        attrs: ''
      });
  const roomSlug = collection ? collection.slug : '';
  const priceAttr = Number.isFinite(product.price) ? String(product.price) : '';
  const sampleState = product.isPlaceholder
    ? '<span class="v2-card-state">Construction sample</span>'
    : '';
  return `<article class="product-card" data-model="${product.model}" data-room="${escapeHtml(roomSlug)}" data-price="${escapeHtml(priceAttr)}" data-sample="${product.isPlaceholder ? 'true' : 'false'}" data-name="${escapeHtml(product.name)}" data-index="${index}">
    <a class="card-image product-mount"${blendAttr} href="${productPath(product)}" tabindex="-1" aria-hidden="true">${cardMedia}${badge}</a>
    <div class="card-copy"><span class="eyebrow">${eyebrow}</span><h3><a href="${productPath(product)}">${escapeHtml(product.name)} ${arrow}</a></h3><p>${escapeHtml(product.tagline)}</p>${sampleState}${cardAvailability(product)}<span class="card-price">${cardPrice(product)}</span><a class="text-link card-cta" href="${productPath(product)}">${cta} ${arrow}<span class="sr-only"> about ${escapeHtml(product.name)}</span></a></div>
  </article>`;
}

function related(product, products) {
  const sameModel = products.filter(item => item.model === product.model && item.id !== product.id);
  const sameRoom = sameModel.filter(item => item.category === product.category);
  const otherRooms = sameModel.filter(item => item.category !== product.category);
  const ordered = [...sameRoom, ...otherRooms].slice(0, 3);
  const otherModel = product.model === 'affiliate' ? 'dropshipping' : 'affiliate';
  return `<section class="related-section" aria-labelledby="related-heading"><div class="section-heading"><span class="eyebrow">Continue through the herbarium</span><h2 id="related-heading">Related folios from ${escapeHtml(MODELS[product.model].label)}</h2></div>
    ${ordered.length ? `<div class="product-cards">${ordered.map((item, i) => card(item, i)).join('')}</div>` : `<div class="empty-collection"><p>More ${product.model === 'affiliate' ? 'partner pieces' : 'shop pieces'} will appear here as the collection grows.</p><a class="text-link" href="${MODELS[otherModel].path}">Explore ${MODELS[otherModel].label.toLowerCase()} ${arrow}</a></div>`}
  </section>`;
}

function productBreadcrumbs(product) {
  const model = MODELS[product.model];
  const collection = product.model === 'dropshipping' ? collectionFor(product) : null;
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>
    <li><a href="/">Home</a></li>
    <li><a href="${model.path}">${model.label}</a></li>
    ${collection ? `<li><a href="${categoryPath(collection)}">${escapeHtml(collection.label)}</a></li>` : ''}
    <li aria-current="page">${escapeHtml(product.name)}</li>
  </ol></nav>`;
}

function productDocument(product, products, actions, documentOptions = {}) {
  validateProduct(product);
  const { referenceLayout = null, ...shellOptions } = documentOptions;
  if (referenceLayout && referenceLayout !== 'featured-product') throw new Error(`Unsupported reference layout for ${product.slug}`);
  const model = MODELS[product.model];
  const collection = product.model === 'dropshipping' ? collectionFor(product) : null;
  const canonical = productPath(product);
  const seoTitle = product.seo?.title || product.name;
  const seoDescription = product.seo?.description || product.description;
  const photograph = product.images.find(image => !image.isEmptyMount && !image.isPlaceholder && !image.src.endsWith('.svg'))
    || product.images.find(image => !image.isEmptyMount && !image.src.endsWith('.svg'));
  const complianceRecord = complianceRegister.records.find(
    record => record.id === product.complianceId || record.productId === product.id
  ) || null;
  const roomKicker = collection && product.model === 'dropshipping'
    ? `<a class="eyebrow" href="${categoryPath(collection)}">${escapeHtml(product.category)}</a>`
    : `<span class="eyebrow">${escapeHtml(product.category)}</span>`;
  const sampleBanner = product.isPlaceholder
    ? `<div class="sample-banner" role="note"><span class="eyebrow">Construction sample</span><p>Pre-launch demonstration listing — studio sample photography, placeholder specifications, and dummy test pricing used to verify the room layout and invoice workflow.</p></div>`
    : '';
  const layoutClass = referenceLayout ? 'product-layout reference-product' : 'product-layout v2-folio-layout';
  const infoClass = referenceLayout ? 'product-information reference-product__details' : 'product-information v2-folio-sheet';

  const verifiedCount = complianceRecord
    ? (complianceRecord.items || []).filter(item => item.status === 'verified').length
    : 0;
  const totalChecks = complianceRecord ? (complianceRecord.items || []).length : 0;
  const productContext = product.model === 'affiliate'
    ? `${product.category} partner offer via ${product.sourceName} with transparent provenance.`
    : `${product.category} folio at ${BRAND}${totalChecks ? ` (${verifiedCount} of ${totalChecks} checks verified)` : ''} with invoice-first inquiry.`;

  return documentPage({
    title: seoTitle,
    description: seoDescription,
    active: 'shop',
    canonical,
    theme: 'theme-paper',
    jsonLd: productJsonLd(product, canonical),
    keywords: product.seo?.keywords?.join(', ') || null,
    image: photograph?.src || null,
    scripts: ['/assets/product-pages.js'],
    seo: {
      type: 'product',
      ogType: 'product',
      context: productContext
    },
    ...shellOptions,
    content: `
      <div class="page-shell${referenceLayout ? ' reference-product-shell' : ''}">
        ${productBreadcrumbs(product)}
        ${sampleBanner}
        <article class="${layoutClass}" data-product-model="${product.model}">
          ${referenceLayout
            ? `<div class="reference-product__visual">${gallery(product, { useSpecimenMount: false })}<img class="reference-product__mark" src="/assets/brand/web/opar-mark-green.svg" alt="" aria-hidden="true" width="130" height="130"></div>`
            : gallery(product, { useSpecimenMount: true })}
          <div class="${infoClass}">
            <div class="product-kicker">${roomKicker}<span class="badge${product.model === 'affiliate' ? ' badge-partner' : ''}">${model.badge}</span></div>
            <h1>${escapeHtml(product.name)}</h1>
            <p class="tagline">${escapeHtml(product.tagline)}</p>
            ${wishlistToggle(product)}
            <p class="product-description">${escapeHtml(product.description)}</p>
            ${folioReferenceSection(product, complianceRecord)}
            ${actions(product)}
            <nav class="pdp-jumps" aria-label="On this page">
              <a class="text-link" href="#description-section">Monograph &amp; specs ${arrow}</a>
              <a class="text-link" href="#compliance-section">Verification file ${arrow}</a>
              ${Array.isArray(product.faq) && product.faq.length ? `<a class="text-link" href="#faq-section">Q&amp;A ${arrow}</a>` : ''}
            </nav>
            <div class="source-note"><span class="eyebrow">Sourcing note · ${escapeHtml(product.sourceName)}</span><p>${escapeHtml(product.dataNote)}</p></div>
          </div>
        </article>
        ${folioDetails(product, complianceRecord)}
        ${referenceLayout ? '<div class="page-shell reference-product__following">' : `<div class="paper-pause" aria-hidden="true">${medallionPictureMarkup('paper', { width: 72, height: 72 })}</div>`}
        ${related(product, products)}${referenceLayout ? '</div>' : ''}
      </div>`
  });
}

export function renderDropshippingPage(product, products = [], documentOptions = {}) {
  if (product.model !== 'dropshipping') throw new Error('Use the dropshipping template for shop products.');
  return productDocument(product, products, dropshippingActions, documentOptions);
}

export function renderAffiliatePage(product, products = [], documentOptions = {}) {
  if (product.model !== 'affiliate') throw new Error('Use the affiliate template for external offers.');
  return productDocument(product, products, affiliateActions, documentOptions);
}
