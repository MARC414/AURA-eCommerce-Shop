/**
 * The piece: one product page, its actions, its gallery, its JSON-LD, and the
 * cards that list it elsewhere. Prices are only printed when the data carries
 * one; availability is only printed when it is verified.
 */

import { BRAND, collections, escapeHtml, arrow, external, icons, documentPage } from './chrome.mjs';

export const MODELS = {
  dropshipping: {
    path: '/shop/',
    label: 'Shop',
    badge: `${BRAND} shop`,
    heading: `The ${BRAND} shop`,
    description: 'Objects chosen for use, not display: herbs, everyday care, sound, practice and craft.'
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

function collectionFor(product) {
  return collections.find(collection => (collection.matches || []).includes(product.category)) || null;
}

export function categoryPath(collection) {
  return `/shop/${collection.slug}/`;
}

/** JSON-LD Product schema. Offers are only emitted when a real price exists. */
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
  const photograph = product.images.find(image => !image.isPlaceholder && !image.src.endsWith('.svg'));
  if (photograph) schema.image = photograph.src;
  if (product.supplierBrand) schema.brand = { '@type': 'Brand', name: product.supplierBrand };
  if (product.sourceSku) schema.sku = product.sourceSku;
  if (product.price !== null && product.price !== undefined) {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: product.currency || 'GBP',
      price: String(product.price),
      availability: 'https://schema.org/OutOfStock'
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
  return [schema, breadcrumb];
}

function gallery(product) {
  const first = product.images[0];
  return `
    <div class="product-gallery" data-gallery>
      <figure class="main-image">
        <span class="image-corner-label">${product.model === 'affiliate' ? 'Partner offer' : `${BRAND} shop`}</span>
        <img data-main-image src="${escapeHtml(first.src)}" alt="${escapeHtml(first.alt)}" width="1000" height="1000" fetchpriority="high" decoding="async" data-fallback="/assets/products/photography-pending.svg">
      </figure>
      <div class="gallery-thumbnails" role="group" aria-label="Product gallery">
        ${product.images.map((image, index) => `
          <button type="button" class="thumbnail" aria-label="Show image ${index + 1}: ${escapeHtml(image.alt)}" aria-pressed="${index === 0}" data-gallery-src="${escapeHtml(image.src)}" data-gallery-alt="${escapeHtml(image.alt)}" data-gallery-caption="${escapeHtml(image.caption)}">
            <img src="${escapeHtml(image.src)}" alt="" width="80" height="80" loading="lazy" decoding="async" data-fallback="/assets/products/photography-pending.svg">
          </button>`).join('')}
        <span class="gallery-note">A closer look,<br>without the noise.</span>
      </div>
      <p class="image-caption" data-gallery-caption aria-live="polite">${escapeHtml(first.caption)}</p>
    </div>`;
}

function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP' }).format(amount);
  } catch (error) {
    return `${Number(amount).toFixed(2)} ${currency || ''}`.trim();
  }
}

function priceLabel(product) {
  if (product.price === null || product.price === undefined) {
    return '<span class="price-value price-request">Price on request</span>';
  }
  const price = formatMoney(product.price, product.currency);
  return `<span class="price-value">${escapeHtml(price)} <span class="currency">${escapeHtml(product.currency)}</span></span>`;
}

function wishlistToggle(product) {
  return `
    <button type="button" class="wishlist-toggle" data-wishlist-toggle="${escapeHtml(product.id)}" aria-pressed="false">
      ${icons.heart}<span data-wishlist-label>Save to wishlist</span>
    </button>`;
}

function cartAttributes(product) {
  const image = product.images.find(item => !item.isPlaceholder)?.src || product.images[0].src;
  return [
    ['data-product-id', product.id],
    ['data-product-name', product.name],
    ['data-product-slug', product.slug],
    ['data-product-tagline', product.tagline],
    ['data-product-price', product.price === null || product.price === undefined ? '' : String(product.price)],
    ['data-product-currency', product.currency || 'GBP'],
    ['data-product-category', product.category],
    ['data-product-image', image]
  ].map(([name, value]) => `${name}="${escapeHtml(value)}"`).join(' ');
}

function dropshippingActions(product) {
  const canPurchase = product.purchaseOwner === 'aura';
  const action = canPurchase
    ? `<button type="button" class="button button-primary" data-add-to-cart ${cartAttributes(product)} aria-describedby="ordering-note">Add to cart ${arrow}</button>
      <p class="action-note" id="ordering-note">Price, delivery and payment are confirmed on your invoice before anything is paid.</p>`
    : `<a class="button button-secondary" href="/contact/" aria-describedby="ordering-note">Ask about this piece ${arrow}</a>
      <p class="action-note" id="ordering-note">This piece is not sold through ${BRAND}’s cart. Contact the house for availability.</p>`;
  return `
    <section class="purchase-panel" aria-labelledby="purchase-heading">
      <h2 class="eyebrow" id="purchase-heading">${BRAND} shop</h2>
      <div class="price-row">${priceLabel(product)}<span class="small-note">Confirmed on invoice · no payment on this page</span></div>
      <div class="variant-field">
        <label class="field-label" for="product-variant">Options</label>
        <select id="product-variant" data-variant${product.variants.length ? '' : ' disabled'}>
          ${product.variants.length ? product.variants.map(variant => `<option>${escapeHtml(variantLabel(variant))}</option>`).join('') : '<option>One edition</option>'}
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
    </section>`;
}

function affiliateActions(product) {
  return `
    <section class="purchase-panel external-panel" aria-labelledby="offer-heading">
      <h2 class="eyebrow" id="offer-heading">Partner offer</h2>
      <div class="price-row"><span class="price-value price-request">Price on ${escapeHtml(product.sourceName)}</span><span class="small-note">Options and availability are confirmed there.</span></div>
      <p class="merchant-note">This page introduces the listing. If you continue, you will leave ${BRAND} and view it on ${escapeHtml(product.sourceName)}.</p>
      <a class="button button-primary external-cta" href="${escapeHtml(product.externalUrl)}" target="_blank" rel="sponsored noopener noreferrer" aria-describedby="offer-disclosure">View offer on ${escapeHtml(product.sourceName)} ${external}<span class="sr-only"> (opens in a new tab)</span></a>
      <p class="action-note">Purchase, delivery and returns are handled by ${escapeHtml(product.sourceName)}. No ${BRAND} cart or checkout is used.</p>
      <aside class="disclosure" id="offer-disclosure"><strong>Referral disclosure</strong><p>${escapeHtml(product.disclosure)}</p></aside>
    </section>`;
}

function details(product) {
  return `
    <section class="details-section" aria-labelledby="details-heading">
      <div class="section-heading"><span class="eyebrow">The piece</span><h2 id="details-heading">Details worth knowing</h2></div>
      <div class="details-layout">
        <div class="details-copy"><h3>About this piece</h3><p>${escapeHtml(product.description)}</p>
          <a class="text-link" href="${escapeHtml(product.model === 'affiliate' ? product.externalUrl : product.sourceUrl)}" target="_blank" rel="${product.model === 'affiliate' ? 'sponsored ' : ''}noopener noreferrer">View the original ${escapeHtml(product.sourceName)} listing ${external}<span class="sr-only"> (opens in a new tab)</span></a>
          <div class="source-note"><span class="eyebrow">Listing reference</span><p>${escapeHtml(product.sourceTitle)}</p><p class="small-note">${escapeHtml(product.sourceTitleStatus)}</p></div>
        </div>
        <dl class="specifications">${product.specifications.map(specification => `<div><dt>${escapeHtml(specification.label)}</dt><dd>${escapeHtml(specification.value)}</dd></div>`).join('')}</dl>
      </div>
    </section>
    <section class="practical-section" aria-labelledby="practical-heading">
      <div class="section-heading"><span class="eyebrow">Before you decide</span><h2 id="practical-heading">Delivery, returns and use</h2></div>
      <div class="practical-grid">
        <details open><summary>Delivery and fulfilment</summary><p>${escapeHtml(product.deliveryNote)}</p></details>
        <details><summary>Returns and support</summary><p>${escapeHtml(product.returnsNote)}</p></details>
        <details><summary>Directions and product information</summary><p>${escapeHtml(product.usageNote)}</p></details>
      </div>
    </section>`;
}

function cardPrice(product) {
  if (product.model === 'affiliate') return `View with ${escapeHtml(product.sourceName)}`;
  if (product.price === null || product.price === undefined) return 'Price on request';
  return formatMoney(product.price, product.currency);
}

/**
 * Availability may only be shown when the product data itself carries a
 * verified label. Nothing is inferred: an absent field renders nothing.
 */
function cardAvailability(product) {
  const availability = product.availability;
  if (!availability || availability.verified !== true || !availability.label) return '';
  return `<span class="card-availability">${escapeHtml(availability.label)}</span>`;
}

export function card(product) {
  const first = product.images[0];
  const collection = collectionFor(product);
  const isAffiliate = product.model === 'affiliate';
  const eyebrow = collection && !isAffiliate
    ? `<a href="${categoryPath(collection)}">${escapeHtml(product.category)}</a>`
    : escapeHtml(product.category);
  const badge = `<span class="badge${isAffiliate ? ' badge-partner' : ''}">${MODELS[product.model].badge}</span>`;
  const cta = isAffiliate ? 'View the offer' : 'View the piece';
  return `<article class="product-card" data-model="${product.model}">
    <a class="card-image" href="${productPath(product)}" tabindex="-1" aria-hidden="true"><img src="${escapeHtml(first.src)}" alt="" width="640" height="640" loading="lazy" decoding="async" data-fallback="/assets/products/photography-pending.svg">${badge}</a>
    <div class="card-copy"><span class="eyebrow">${eyebrow}</span><h3><a href="${productPath(product)}">${escapeHtml(product.name)} ${arrow}</a></h3><p>${escapeHtml(product.tagline)}</p>${cardAvailability(product)}<span class="card-price">${cardPrice(product)}</span><a class="text-link card-cta" href="${productPath(product)}">${cta} ${arrow}<span class="sr-only"> about ${escapeHtml(product.name)}</span></a></div>
  </article>`;
}

function related(product, products) {
  const sameModel = products.filter(item => item.model === product.model && item.id !== product.id);
  const otherModel = product.model === 'affiliate' ? 'dropshipping' : 'affiliate';
  return `<section class="related-section" aria-labelledby="related-heading"><div class="section-heading"><span class="eyebrow">In the same room</span><h2 id="related-heading">More to explore</h2></div>
    ${sameModel.length ? `<div class="product-cards">${sameModel.slice(0, 3).map(card).join('')}</div>` : `<div class="empty-collection"><p>More ${product.model === 'affiliate' ? 'partner pieces' : 'shop pieces'} will appear here as the collection grows.</p><a class="text-link" href="${MODELS[otherModel].path}">Explore ${MODELS[otherModel].label.toLowerCase()} ${arrow}</a></div>`}
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

function productDocument(product, products, actions) {
  validateProduct(product);
  const model = MODELS[product.model];
  const canonical = productPath(product);
  const seoTitle = product.seo?.title || product.name;
  const seoDescription = product.seo?.description || product.description;
  const photograph = product.images.find(image => !image.isPlaceholder && !image.src.endsWith('.svg'));
  return documentPage({
    title: seoTitle,
    description: seoDescription,
    active: 'shop',
    canonical,
    jsonLd: productJsonLd(product, canonical),
    keywords: product.seo?.keywords?.join(', ') || null,
    image: photograph?.src || null,
    scripts: ['/assets/product-pages.js'],
    content: `
      <div class="page-shell">
        ${productBreadcrumbs(product)}
        <article class="product-layout" data-product-model="${product.model}">
          ${gallery(product)}
          <div class="product-information">
            <div class="product-kicker"><span class="eyebrow">${escapeHtml(product.category)}</span><span class="badge">${model.badge}</span></div>
            <h1>${escapeHtml(product.name)}</h1><p class="tagline">${escapeHtml(product.tagline)}</p>
            ${wishlistToggle(product)}
            <p class="product-description">${escapeHtml(product.description)}</p>
            ${actions(product)}
            <div class="sourcing-note"><span class="eyebrow">Selected source · ${escapeHtml(product.sourceName)}</span><p>${escapeHtml(product.dataNote)}</p></div>
          </div>
        </article>
        ${details(product)}
        ${related(product, products)}
      </div>`
  });
}

export function renderDropshippingPage(product, products = []) {
  if (product.model !== 'dropshipping') throw new Error('Use the dropshipping template for shop products.');
  return productDocument(product, products, dropshippingActions);
}

export function renderAffiliatePage(product, products = []) {
  if (product.model !== 'affiliate') throw new Error('Use the affiliate template for external offers.');
  return productDocument(product, products, affiliateActions);
}
