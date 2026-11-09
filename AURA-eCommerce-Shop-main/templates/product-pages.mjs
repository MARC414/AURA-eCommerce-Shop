/**
 * AURA's dependency-free HTML templates.
 *
 * One shell for the whole static storefront: one header, one footer, one set of
 * design tokens. Product pages, category pages, the checkout, the account and
 * the content pages are all generated from the JSON in data/.
 *
 * The public pages do not render the internal compliance register. That record
 * stays in data/compliance.json for review; it is not a customer-facing badge
 * and it is not used as marketing.
 */

import { readFileSync } from 'node:fs';

const site = JSON.parse(readFileSync(new URL('../data/site.json', import.meta.url), 'utf8'));
const collections = JSON.parse(readFileSync(new URL('../data/collections.json', import.meta.url), 'utf8'));

/**
 * Launch switch: generated pages are noindex until a real domain and absolute
 * canonical URLs exist. This is technical, not editorial. Flip it at go-live.
 */
const INDEXABLE = false;

export const MODELS = {
  dropshipping: {
    path: '/shop/',
    label: 'Shop',
    badge: 'AURA shop',
    heading: 'The AURA shop',
    description: 'Objects chosen for use, not display: herbs, everyday care, sound, practice and craft.'
  },
  affiliate: {
    path: '/discover/',
    label: 'Partner offers',
    badge: 'Partner offer',
    heading: 'Found elsewhere, chosen here.',
    description: 'Pieces AURA introduces but does not fulfil. The purchase, delivery and returns belong to the merchant.'
  }
};

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

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

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const external = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 5h5v5m0-5L9 15M10 5H5v14h14v-5"/></svg>';

/** Variants may be a plain label or an object with label/SKU/price. */
export function variantLabel(variant) {
  if (typeof variant === 'string') return variant;
  if (!variant || typeof variant.label !== 'string') throw new Error('Every variant needs a label.');
  return variant.price === null || variant.price === undefined
    ? `${variant.label} — price on request`
    : variant.label;
}

const icons = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.4-3.6 4-5.4 7-5.4s5.6 1.8 7 5.4"/></svg>'
};

const chevron = '<span class="nav-chevron" aria-hidden="true"></span>';
const isPublished = item => Boolean(item) && item.published !== false;

/** Group a nav panel's children by their optional `group` label. */
function navGroups(children) {
  const groups = new Map();
  children.forEach(child => {
    const key = child.group || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(child);
  });
  return [...groups.entries()];
}

/** Two-row header: identity + search + utility, then the section menu. */
function header(active = null) {
  const utility = site.utility || {};
  const search = isPublished(utility.search) ? `
        <form class="site-search" role="search" action="${escapeHtml(utility.search.action)}" method="get">
          <label class="sr-only" for="site-search-input">${escapeHtml(utility.search.placeholder)}</label>
          <input id="site-search-input" type="search" name="q" placeholder="${escapeHtml(utility.search.placeholder)}" autocomplete="off">
          <button type="submit" aria-label="${escapeHtml(utility.search.label)}">${icons.search}</button>
        </form>` : '';
  const utilityLink = (item, icon, extra = '') => isPublished(item)
    ? `<a class="utility-link" href="${escapeHtml(item.href)}">${icon}<span class="utility-label">${escapeHtml(item.label)}</span>${extra}</a>`
    : '';
  const status = site.status?.preview
    ? `<span class="header-status"><span aria-hidden="true"></span>${escapeHtml(site.status.label)}</span>`
    : '';
  const navItem = item => {
    const children = (item.children || []).filter(isPublished);
    const current = item.id === active ? ' aria-current="page"' : '';
    if (!children.length) {
      return `<a href="${escapeHtml(item.href)}"${current}>${escapeHtml(item.label)}</a>`;
    }
    const groups = navGroups(children);
    const panel = groups.length > 1
      ? `<div class="nav-panel nav-panel-grouped">${groups.map(([group, links]) => `
            <div class="nav-column">
              ${group ? `<span class="nav-group-label">${escapeHtml(group)}</span>` : ''}
              ${links.map(child => `<a href="${escapeHtml(child.href)}"><span>${escapeHtml(child.label)}</span>${child.note ? `<span class="nav-note">${escapeHtml(child.note)}</span>` : ''}</a>`).join('')}
            </div>`).join('')}
          </div>`
      : `<div class="nav-panel">${children.map(child => `
            <a href="${escapeHtml(child.href)}"><span>${escapeHtml(child.label)}</span>${child.note ? `<span class="nav-note">${escapeHtml(child.note)}</span>` : ''}</a>`).join('')}
          </div>`;
    return `<details class="nav-group"${item.id === active ? ' data-current="true"' : ''}>
          <summary${current}><span>${escapeHtml(item.label)}</span>${chevron}</summary>
          ${panel}
        </details>`;
  };

  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="header-top">
        <a class="wordmark" href="${escapeHtml(site.brand.homeHref)}" aria-label="${escapeHtml(site.brand.name)} home">${escapeHtml(site.brand.wordmark)}<span class="wordmark-note">${escapeHtml(site.brand.note)}</span></a>${search}
        <div class="header-utility">
          ${utilityLink(utility.account, icons.user)}
          ${utilityLink(utility.wishlist, icons.heart, '<span class="utility-count" data-wishlist-count hidden></span>')}
          ${utilityLink(utility.cart, icons.bag, '<span class="utility-count" data-cart-count hidden></span>')}
        </div>
      </div>
      <div class="header-bottom">
        <nav class="primary-nav" aria-label="Primary navigation">
          ${site.nav.filter(isPublished).map(navItem).join('\n          ')}
        </nav>
        ${status}
      </div>
    </header>`;
}

/** Footer: real URLs only. No modal links, no dead sections. */
function footer() {
  const columns = site.footer.columns.map(column => {
    const id = `footer-${column.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return `
        <nav class="footer-column" aria-labelledby="${id}">
          <h2 class="footer-heading" id="${id}">${escapeHtml(column.heading)}</h2>
          ${column.links.map(link => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join('')}
        </nav>`;
  }).join('');
  return `
    <footer class="site-footer">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="wordmark" href="${escapeHtml(site.brand.homeHref)}" aria-label="${escapeHtml(site.brand.name)} home">${escapeHtml(site.brand.wordmark)}</a>
          <p>${escapeHtml(site.brand.description)}<br>${escapeHtml(site.brand.tagline)}</p>
        </div>
        <div class="footer-columns">${columns}
        </div>
      </div>
      <div class="footer-legal">
        <p>${escapeHtml(site.footer.note)}</p>
        <p class="footer-signature">${escapeHtml(site.footer.signature)}</p>
      </div>
    </footer>`;
}

function collectionFor(product) {
  return collections.find(collection => (collection.matches || []).includes(product.category)) || null;
}

function categoryPath(collection) {
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

function documentPage({ title, description, active = null, content, canonical = null, jsonLd = null, keywords = null, image = null, scripts = [] }) {
  const jsonLdTag = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/<\//g, '<\\/')}</script>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<!-- Generated by scripts/generate-product-pages.mjs. Edit the data or shared templates, not this file. -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — ORVANYA</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">\n  ` : ''}${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">\n  ` : ''}<meta name="robots" content="${INDEXABLE ? 'index, follow' : 'noindex, follow'}">
  <meta property="og:type" content="${jsonLd ? 'product' : 'website'}">
  <meta property="og:title" content="${escapeHtml(title)} — ORVANYA">
  <meta property="og:description" content="${escapeHtml(description)}">
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">\n  ` : ''}${canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">\n  ` : ''}<meta name="theme-color" content="#F1EBDD">${jsonLdTag}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;family=Manrope:wght@300;400;500;600;700&amp;family=Inter:wght@400;500;600&amp;family=Playfair+Display:ital,wght@0,400;0,500;1,400&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/product-pages.css">
  ${['/assets/cart.js', '/assets/site.js', ...scripts].map(src => `<script src="${escapeHtml(src)}" defer></script>`).join('\n  ')}
</head>
<body>
  ${header(active)}
  <main id="main-content" tabindex="-1">${content}</main>
  ${footer()}
</body>
</html>
`.replace(/[\t ]+$/gm, '');
}

function gallery(product) {
  const first = product.images[0];
  return `
    <div class="product-gallery" data-gallery>
      <figure class="main-image">
        <span class="image-corner-label">${product.model === 'affiliate' ? 'Partner offer' : 'AURA shop'}</span>
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
    : `<a class="button button-primary" href="/contact/" aria-describedby="ordering-note">Ask about this piece ${arrow}</a>
      <p class="action-note" id="ordering-note">This piece is not sold through AURA’s cart. Contact the house for availability.</p>`;
  return `
    <section class="purchase-panel" aria-labelledby="purchase-heading">
      <h2 class="eyebrow" id="purchase-heading">AURA shop</h2>
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
      <p class="merchant-note">This page introduces the listing. If you continue, you will leave AURA and view it on ${escapeHtml(product.sourceName)}.</p>
      <a class="button button-primary external-cta" href="${escapeHtml(product.externalUrl)}" target="_blank" rel="sponsored noopener noreferrer" aria-describedby="offer-disclosure">View offer on ${escapeHtml(product.sourceName)} ${external}<span class="sr-only"> (opens in a new tab)</span></a>
      <p class="action-note">Purchase, delivery and returns are handled by ${escapeHtml(product.sourceName)}. No AURA cart or checkout is used.</p>
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

function card(product) {
  const first = product.images[0];
  const collection = collectionFor(product);
  const eyebrow = collection && product.model === 'dropshipping'
    ? `<a href="${categoryPath(collection)}">${escapeHtml(product.category)}</a>`
    : escapeHtml(product.category);
  return `<article class="product-card">
    <a class="card-image" href="${productPath(product)}" tabindex="-1" aria-hidden="true"><img src="${escapeHtml(first.src)}" alt="" width="640" height="640" loading="lazy" decoding="async" data-fallback="/assets/products/photography-pending.svg"><span class="badge">${MODELS[product.model].badge}</span></a>
    <div class="card-copy"><span class="eyebrow">${eyebrow}</span><h3><a href="${productPath(product)}">${escapeHtml(product.name)} ${arrow}</a></h3><p>${escapeHtml(product.tagline)}</p><span class="card-price">${cardPrice(product)}</span></div>
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

const categoryCount = (collection, products) => products.filter(product =>
  product.model === 'dropshipping' && (collection.matches || []).includes(product.category)
).length;

function categoryStrip(products) {
  return `<nav class="category-strip" aria-label="Shop categories">
    ${collections.map(collection => {
      const count = categoryCount(collection, products);
      return `<a class="category-tile" href="${categoryPath(collection)}">
      <span class="eyebrow">${escapeHtml(collection.eyebrow)}</span>
      <strong>${escapeHtml(collection.label)}</strong>
      <span class="category-count">${count} ${count === 1 ? 'piece' : 'pieces'}</span>
    </a>`;
    }).join('')}
  </nav>`;
}

export function renderCollection(modelName, products) {
  if (!Object.hasOwn(MODELS, modelName)) throw new Error('Unknown collection.');
  const model = MODELS[modelName];
  const list = products.filter(product => product.model === modelName);
  const isShop = modelName === 'dropshipping';
  return documentPage({
    title: isShop ? 'Shop' : 'Partner offers',
    description: model.description,
    active: 'shop',
    content: `<div class="page-shell collection-page"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">${model.label}</li></ol></nav>
      <div class="collection-heading"><span class="eyebrow">${isShop ? 'AURA shop' : 'A different way to discover'}</span><h1>${isShop ? 'Objects for a slower life.' : model.heading}</h1><p>${model.description}</p></div>
      ${isShop ? categoryStrip(products) : `<div class="hub-explainer"><span class="badge">${model.badge}</span><p>You browse here; the purchase, delivery and returns take place on the linked merchant’s website.</p></div>`}
      <div class="product-cards">${list.map(card).join('') || '<p>Pieces will be added as the collection develops.</p>'}</div>
    </div>`
  });
}

export function renderCategoryPage(collection, products) {
  if (!collection || !collection.slug) throw new Error('A category needs a slug.');
  const list = products.filter(product =>
    product.model === 'dropshipping' && (collection.matches || []).includes(product.category)
  );
  return documentPage({
    title: collection.heading,
    description: collection.description,
    active: 'shop',
    content: `<div class="page-shell collection-page">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/shop/">Shop</a></li><li aria-current="page">${escapeHtml(collection.label)}</li></ol></nav>
      <div class="collection-heading"><span class="eyebrow">${escapeHtml(collection.eyebrow)}</span><h1>${escapeHtml(collection.heading)}</h1><p>${escapeHtml(collection.intro)}</p></div>
      <div class="category-toolbar"><span class="small-note">${list.length} ${list.length === 1 ? 'piece' : 'pieces'} in this room</span><a class="text-link" href="/shop/">All pieces ${arrow}</a></div>
      <div class="product-cards">${list.map(card).join('') || `<div class="empty-collection"><p>Pieces are being selected for this room.</p><a class="text-link" href="/shop/">Browse everything in the shop ${arrow}</a></div>`}</div>
    </div>`
  });
}

/** Sections that turn a content page into an application page. */
function checkoutSection() {
  const countries = ['United Kingdom', 'Ireland', 'France', 'Germany', 'Netherlands', 'Belgium', 'Spain', 'Italy', 'Portugal', 'Sweden', 'Denmark', 'Norway', 'Switzerland', 'United States', 'Canada', 'Australia', 'New Zealand', 'India', 'Bangladesh', 'Japan', 'Singapore', 'United Arab Emirates', 'Other'];
  return `
      <section class="checkout-block" aria-labelledby="checkout-heading">
        <div class="checkout-layout">
          <div class="checkout-main">
            <p class="commerce-status" data-checkout-status role="status" aria-live="polite">Reading your cart…</p>
            <form class="checkout-form" data-checkout-form>
              <fieldset>
                <legend>Contact</legend>
                <div class="field-grid">
                  <label class="field"><span>Full name</span><input name="name" autocomplete="name" required></label>
                  <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Delivery</legend>
                <div class="field-grid">
                  <label class="field"><span>Country</span><select name="country" autocomplete="country-name" required>${countries.map(country => `<option>${escapeHtml(country)}</option>`).join('')}</select></label>
                  <label class="field"><span>City</span><input name="city" autocomplete="address-level2" required></label>
                  <label class="field field-wide"><span>Address</span><input name="address" autocomplete="street-address" required></label>
                  <label class="field"><span>Postcode</span><input name="postcode" autocomplete="postal-code"></label>
                  <label class="field"><span>Phone (optional)</span><input name="phone" type="tel" autocomplete="tel"></label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Notes</legend>
                <label class="field field-wide"><span>Anything AURA should know about this request</span><textarea name="notes" rows="4"></textarea></label>
                <label class="check-field"><input type="checkbox" name="consent" required><span>I understand this is an invoice request, not a payment, and that price and delivery are confirmed in writing first.</span></label>
              </fieldset>
              <button class="button button-primary" type="submit" data-checkout-submit>Request invoice ${arrow}</button>
              <p class="action-note">No card details are collected. The request is saved in this browser until a server is connected.</p>
            </form>
            <div class="checkout-confirmation" data-checkout-confirmation hidden tabindex="-1">
              <span class="eyebrow">Request recorded</span>
              <h2>Reference <span data-checkout-reference>—</span></h2>
              <p data-checkout-confirmation-copy>Your request is saved in this browser. AURA replies with a written invoice before anything is paid.</p>
              <div class="content-links">
                <a class="text-link" href="/account/">View saved requests ${arrow}</a>
                <a class="text-link" href="/shop/">Continue browsing ${arrow}</a>
              </div>
            </div>
            <noscript><p class="page-note">Checkout needs JavaScript to read the cart and save the request in this browser. Nothing has been sent anywhere.</p></noscript>
          </div>
          <aside class="checkout-summary" aria-labelledby="checkout-summary-heading">
            <div class="section-heading"><span class="eyebrow">Your selection</span><h2 id="checkout-summary-heading">Invoice summary</h2></div>
            <ul class="commerce-list" data-checkout-items></ul>
            <div class="empty-state" data-checkout-empty>
              <p>Nothing is in the cart yet.</p>
              <p class="small-note">Add a piece from the shop to request an invoice.</p>
              <a class="text-link" href="/shop/">Browse the shop ${arrow}</a>
            </div>
            <div class="commerce-summary" data-checkout-summary hidden>
              <div class="commerce-total"><span class="eyebrow">Subtotal</span><strong data-checkout-subtotal>—</strong></div>
              <p class="commerce-price-note" data-checkout-price-note hidden>Some prices are on request. AURA sets the full amount on your invoice.</p>
              <p class="action-note">Delivery and any import charges are added to the written invoice.</p>
            </div>
          </aside>
        </div>
      </section>`;
}

function accountSection() {
  return `
      <section class="content-block commerce-block" aria-labelledby="account-heading">
        <h2 id="account-heading">Invoice requests in this browser</h2>
        <p class="commerce-status" data-account-status role="status" aria-live="polite">Reading requests…</p>
        <div class="empty-state" data-account-empty>
          <p>No request is saved yet.</p>
          <p class="small-note">Requests made on this device appear here with their reference.</p>
          <a class="text-link" href="/shop/">Browse the shop ${arrow}</a>
        </div>
        <ul class="order-list" data-account-orders hidden></ul>
        <noscript><p class="page-note">This list needs JavaScript to read this browser’s storage. Nothing has been sent anywhere.</p></noscript>
      </section>`;
}

function newsletterSection() {
  return `
      <section class="content-block newsletter-block" aria-labelledby="newsletter-heading">
        <h2 id="newsletter-heading">Join the letter</h2>
        <form class="newsletter-form" data-newsletter-form>
          <label class="field" for="newsletter-email"><span>Email address</span>
            <input id="newsletter-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com">
          </label>
          <button class="button button-primary" type="submit">Subscribe</button>
        </form>
        <p class="commerce-status" data-newsletter-status role="status" aria-live="polite"></p>
        <button class="text-link newsletter-remove" type="button" data-newsletter-remove hidden>Remove my preference from this browser</button>
        <noscript><p class="page-note">This form needs JavaScript to save the preference in this browser. Nothing has been sent anywhere.</p></noscript>
      </section>`;
}

/** Plain content pages plus the checkout, account and newsletter applications. */
export function renderStaticPage(page) {
  if (!/^\/[a-z0-9/-]*\/$/.test(page.path)) throw new Error(`Invalid static page path: ${page.path}`);
  if (!page.title || !page.description || !page.label || !page.heading || !page.intro) {
    throw new Error(`Static page ${page.path} needs a title, description, label, heading, and intro.`);
  }
  const parent = page.parent
    ? `<li><a href="${escapeHtml(page.parent.href)}">${escapeHtml(page.parent.label)}</a></li>`
    : '';
  const block = section => `
      <section class="content-block">
        ${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}
        ${(section.paragraphs || []).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('\n        ')}
        ${section.links ? `<div class="content-links">${section.links.map(link => `<a class="text-link" href="${escapeHtml(link.href)}">${escapeHtml(link.label)} ${arrow}</a>`).join('')}</div>` : ''}
      </section>`;
  const blocks = (page.blocks || []).map(block).join('');
  const links = page.links
    ? `<div class="content-links content-links-wide">${page.links.map(link => `<a class="text-link" href="${escapeHtml(link.href)}">${escapeHtml(link.label)} ${arrow}</a>`).join('')}</div>`
    : '';
  const faq = page.faq ? `
      <section class="content-block">
        <h2>Common questions</h2>
        <div class="faq-list">${page.faq.map(item => `
          <details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}
        </div>
      </section>` : '';
  const search = page.search ? `
      <form class="search-form" role="search" action="/search/" method="get">
        <label class="sr-only" for="search-input">Search AURA</label>
        <input id="search-input" type="search" name="q" data-search-input placeholder="Search pieces, books, music…" autocomplete="off">
        <button type="submit" class="button button-primary">Search</button>
      </form>
      <p class="search-status" data-search-status role="status" aria-live="polite"></p>
      <ul class="search-results" data-search-results></ul>` : '';
  const cart = page.cart ? `
      <section class="content-block commerce-block" aria-labelledby="cart-items-heading">
        <h2 id="cart-items-heading">Items in this browser</h2>
        <p class="commerce-status" data-cart-status role="status" aria-live="polite">Reading the cart…</p>
        <div class="empty-state" data-cart-empty>
          <p>Nothing is in the cart yet.</p>
          <p class="small-note">The cart is kept in this browser only.</p>
          <a class="text-link" href="/shop/">Browse the shop ${arrow}</a>
        </div>
        <ul class="commerce-list" data-cart-items></ul>
        <div class="commerce-summary" data-cart-summary hidden>
          <div class="commerce-total"><span class="eyebrow">Subtotal</span><strong data-cart-subtotal>—</strong></div>
          <p class="commerce-price-note" data-cart-price-note hidden>Some pieces are priced on request, so the full amount is set on your invoice.</p>
          <a class="button button-primary" href="/checkout/">Continue to request invoice ${arrow}</a>
          <p class="action-note">Nothing is charged on this site. Price, delivery and payment are confirmed in writing first.</p>
        </div>
        <noscript><p class="page-note">The cart needs JavaScript to read this browser’s storage. Nothing has been sent anywhere.</p></noscript>
      </section>` : '';
  const wishlist = page.wishlist ? `
      <section class="content-block commerce-block" aria-labelledby="wishlist-items-heading">
        <h2 id="wishlist-items-heading">Saved items</h2>
        <p class="commerce-status" data-wishlist-status role="status" aria-live="polite">Reading the wishlist…</p>
        <div class="empty-state" data-wishlist-empty>
          <p>Nothing is saved yet.</p>
          <p class="small-note">Use “Save to wishlist” on a product page. It is kept in this browser only.</p>
          <a class="text-link" href="/shop/">Browse the shop ${arrow}</a>
        </div>
        <ul class="commerce-list" data-wishlist-items hidden></ul>
        <noscript><p class="page-note">The wishlist needs JavaScript to read this browser’s storage. Nothing has been sent anywhere.</p></noscript>
      </section>` : '';
  const checkout = page.checkout ? checkoutSection() : '';
  const account = page.account ? accountSection() : '';
  const newsletter = page.newsletter ? newsletterSection() : '';
  const pageScripts = [
    ...(page.search ? ['/assets/search.js'] : []),
    ...(page.cart ? ['/assets/cart-page.js'] : []),
    ...(page.wishlist ? ['/assets/wishlist-page.js'] : []),
    ...(page.checkout ? ['/assets/checkout-page.js'] : []),
    ...(page.account ? ['/assets/account-page.js'] : []),
    ...(page.newsletter ? ['/assets/newsletter-page.js'] : [])
  ];
  return documentPage({
    title: page.title,
    description: page.description,
    active: page.section || null,
    scripts: pageScripts,
    content: `<div class="page-shell static-page">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${parent}<li aria-current="page">${escapeHtml(page.label)}</li></ol></nav>
      <div class="collection-heading"><span class="eyebrow">${escapeHtml(page.eyebrow)}</span><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.intro)}</p></div>
      ${search}${cart}${wishlist}${checkout}${account}${newsletter}${blocks}${links}${faq}
      ${page.note ? `<p class="page-note">${escapeHtml(page.note)}</p>` : ''}
    </div>`
  });
}
