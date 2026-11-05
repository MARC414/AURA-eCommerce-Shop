/**
 * AURA's dependency-free HTML templates.
 * Product data is separate from the supplier and the selling model.
 * The dropshipping template intentionally has no checkout or order submission.
 */

export const MODELS = {
  dropshipping: {
    path: '/shop/',
    label: 'Shop',
    badge: 'Dropshipping · Preview',
    heading: 'The AURA shop',
    description: 'A small, considered collection taking shape. These products are not yet available to order from AURA.'
  },
  affiliate: {
    path: '/discover/',
    label: 'Discover',
    badge: 'Affiliate / referral',
    heading: 'Discover elsewhere',
    description: 'Selected external listings, with a clear distinction between browsing on AURA and purchasing with a merchant.'
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
  if (product.price !== null && (!Number.isFinite(product.price) || product.price < 0)) {
    throw new Error('A preview price must be null or a non-negative number.');
  }
  return product;
}

export function productPath(product) {
  validateProduct(product);
  return `${MODELS[product.model].path}${product.slug}/`;
}

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const external = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 5h5v5m0-5L9 15M10 5H5v14h14v-5"/></svg>';

const STATUS_LABELS = {
  verified: 'Verified',
  pending: 'Pending',
  'not-provided': 'Not provided',
  'not-applicable': 'Not applicable'
};

/** Variants may be a plain label or an object with label/SKU/price. */
export function variantLabel(variant) {
  if (typeof variant === 'string') return variant;
  if (!variant || typeof variant.label !== 'string') throw new Error('Every variant needs a label.');
  return variant.price === null || variant.price === undefined
    ? `${variant.label} — price pending`
    : variant.label;
}

function header(active) {
  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <a class="wordmark" href="/" aria-label="Aura home">Aura<span class="wordmark-note">Quiet Living</span></a>
      <nav class="primary-nav" aria-label="Primary navigation">
        <a href="/shop/"${active === 'dropshipping' ? ' aria-current="page"' : ''}>Shop</a>
        <a href="/discover/"${active === 'affiliate' ? ' aria-current="page"' : ''}>Discover</a>
        <a href="/templates/"${active === 'templates' ? ' aria-current="page"' : ''}>Preview index</a>
      </nav>
      <span class="header-status"><span aria-hidden="true"></span>Development preview</span>
    </header>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div><a class="wordmark" href="/">Aura</a><p>Objects and knowledge for quiet living.<br>A collection in progress.</p></div>
      <nav aria-label="Footer navigation"><a href="/shop/">Shop preview</a><a href="/discover/">External offers</a><a href="/templates/">Both templates</a></nav>
      <p class="footer-note">No orders or payments are collected by these preview pages.<br>Product information and selling terms are being prepared.</p>
    </footer>`;
}

/** JSON-LD Product schema. Offers are only emitted when a real price exists. */
export function productJsonLd(product, canonicalPath) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.images[0].src,
    url: canonicalPath,
    keywords: product.seo?.keywords?.join(', ') || '',
    brand: { '@type': 'Brand', name: product.supplierBrand || 'AURA (preview)' }
  };
  if (product.price !== null && product.price !== undefined) {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: product.currency || 'GBP',
      price: String(product.price),
      availability: 'https://schema.org/OutOfStock'
    };
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: MODELS[product.model].label, item: MODELS[product.model].path },
      { '@type': 'ListItem', position: 3, name: product.name, item: canonicalPath }
    ]
  };
  return [schema, breadcrumb];
}

function documentPage({ title, description, active, content, canonical = null, jsonLd = null, keywords = null, image = null }) {
  const jsonLdTag = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/<\//g, '<\\/')}</script>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<!-- Generated by scripts/generate-product-pages.mjs. Edit the data or shared templates, not this file. -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — AURA</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">\n  ` : ''}${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">\n  ` : ''}<meta name="robots" content="noindex, follow">
  <meta property="og:type" content="product">
  <meta property="og:title" content="${escapeHtml(title)} — AURA">
  <meta property="og:description" content="${escapeHtml(description)}">
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">\n  ` : ''}${canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">\n  ` : ''}<meta name="theme-color" content="#F5F2EB">${jsonLdTag}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Playfair+Display:ital,wght@0,400;0,500;1,400&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/product-pages.css">
  <script src="/assets/product-pages.js" defer></script>
</head>
<body>
  ${header(active)}
  <main id="main-content" tabindex="-1">${content}</main>
  ${footer()}
</body>
</html>
`;
}

function gallery(product) {
  const first = product.images[0];
  return `
    <div class="product-gallery" data-gallery>
      <figure class="main-image">
        <span class="image-corner-label">${product.model === 'affiliate' ? 'External listing' : 'Shop preview'}</span>
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

function priceLabel(product) {
  if (product.price === null) return '<span class="price-value price-pending">Price being prepared</span>';
  const price = new Intl.NumberFormat('en', { style: 'currency', currency: product.currency }).format(product.price);
  return `<span class="price-value">${escapeHtml(price)} <span class="currency">${escapeHtml(product.currency)}</span></span>`;
}

function dropshippingActions(product) {
  return `
    <section class="purchase-panel" aria-labelledby="purchase-heading">
      <h2 class="eyebrow" id="purchase-heading">AURA shop · Not yet for sale</h2>
      <div class="price-row">${priceLabel(product)}<span class="small-note">Display only · not a live offer</span></div>
      <div class="variant-field">
        <label class="field-label" for="product-variant">Product options</label>
        <select id="product-variant" data-variant${product.variants.length ? '' : ' disabled'}>
          ${product.variants.length ? product.variants.map(variant => `<option>${escapeHtml(variantLabel(variant))}</option>`).join('') : '<option>Options awaiting confirmation</option>'}
        </select>
      </div>
      <div class="quantity-row">
        <span class="field-label" id="quantity-label">Quantity <span class="small-note">(preview)</span></span>
        <div class="quantity-control" role="group" aria-labelledby="quantity-label">
          <button type="button" aria-label="Decrease quantity" data-quantity-change="-1" disabled>−</button>
          <output data-quantity aria-label="Selected quantity">1</output>
          <button type="button" aria-label="Increase quantity" data-quantity-change="1">+</button>
        </div>
      </div>
      <button type="button" class="button button-primary button-closed" disabled aria-describedby="ordering-note">Coming soon <span aria-hidden="true">—</span> Ordering closed</button>
      <p class="action-note" id="ordering-note">You can explore this layout, but it cannot place an order or collect a payment.</p>
      <output class="selection-status" data-selection-status aria-live="polite">Preview quantity: 1. Ordering remains closed.</output>
    </section>`;
}

function affiliateActions(product) {
  return `
    <section class="purchase-panel external-panel" aria-labelledby="offer-heading">
      <h2 class="eyebrow" id="offer-heading">External offer · Not sold by AURA</h2>
      <div class="price-row"><span class="price-value price-pending">Check the current price on ${escapeHtml(product.sourceName)}</span><span class="small-note">Options and availability are confirmed there.</span></div>
      <p class="merchant-note">This page introduces the listing. If you choose to continue, you will leave AURA and view it on ${escapeHtml(product.sourceName)}.</p>
      <a class="button button-primary external-cta" href="${escapeHtml(product.externalUrl)}" target="_blank" rel="sponsored noopener noreferrer" aria-describedby="offer-disclosure">View offer on ${escapeHtml(product.sourceName)} ${external}<span class="sr-only"> (opens in a new tab)</span></a>
      <p class="action-note">No AURA cart or checkout is used for this item.</p>
      <aside class="disclosure" id="offer-disclosure"><strong>Referral disclosure</strong><p>${escapeHtml(product.disclosure)}</p></aside>
    </section>`;
}

function details(product) {
  return `
    <section class="details-section" aria-labelledby="details-heading">
      <div class="section-heading"><span class="eyebrow">A considered introduction</span><h2 id="details-heading">Details worth knowing</h2></div>
      <div class="details-layout">
        <div class="details-copy"><h3>The selected listing</h3><p>${escapeHtml(product.description)}</p>
          <a class="text-link" href="${escapeHtml(product.model === 'affiliate' ? product.externalUrl : product.sourceUrl)}" target="_blank" rel="${product.model === 'affiliate' ? 'sponsored ' : ''}noopener noreferrer">View the original ${escapeHtml(product.sourceName)} listing ${external}<span class="sr-only"> (opens in a new tab)</span></a>
          <div class="source-note"><span class="eyebrow">Source reference</span><p>${escapeHtml(product.sourceTitle)}</p><p class="small-note">${escapeHtml(product.sourceTitleStatus)}</p></div>
        </div>
        <dl class="specifications">${product.specifications.map(specification => `<div><dt>${escapeHtml(specification.label)}</dt><dd>${escapeHtml(specification.value)}</dd></div>`).join('')}</dl>
      </div>
    </section>
    <section class="practical-section" aria-labelledby="practical-heading">
      <div class="section-heading"><span class="eyebrow">Clear expectations</span><h2 id="practical-heading">Before you decide</h2></div>
      <div class="practical-grid">
        <details open><summary>Delivery and fulfilment</summary><p>${escapeHtml(product.deliveryNote)}</p></details>
        <details><summary>Returns and support</summary><p>${escapeHtml(product.returnsNote)}</p></details>
        <details><summary>Directions and product information</summary><p>${escapeHtml(product.usageNote)}</p></details>
      </div>
    </section>`;
}

function complianceSection(product, compliance) {
  if (!compliance) return '';
  const tier = compliance.riskTier === 'regulated'
    ? 'Regulated category'
    : compliance.riskTier === 'elevated' ? 'Elevated scrutiny' : 'Standard checks';
  const counts = compliance.items.reduce((totals, item) => {
    totals[item.status] = (totals[item.status] || 0) + 1;
    return totals;
  }, {});
  const outstanding = (counts.pending || 0) + (counts['not-provided'] || 0);
  return `
    <section class="compliance-section" aria-labelledby="compliance-heading">
      <div class="section-heading">
        <span class="eyebrow">Verification register</span>
        <h2 id="compliance-heading">What has been checked</h2>
        <p class="section-intro">${escapeHtml(compliance.publicSummary)}</p>
      </div>
      <div class="compliance-layout">
        <div class="compliance-evidence">
          <div class="compliance-meta">
            <span class="badge">${escapeHtml(tier)}</span>
            <span class="small-note">${counts.verified || 0} verified · ${outstanding} outstanding</span>
          </div>
          ${compliance.responsiblePerson ? `
          <div class="rp-note">
            <span class="eyebrow">Responsible person</span>
            <p>${escapeHtml(compliance.responsiblePerson.name)} · ${escapeHtml(compliance.responsiblePerson.country)}</p>
            <p class="small-note">${escapeHtml(compliance.responsiblePerson.note)}</p>
          </div>` : ''}
          <ul class="verification-list">
            ${compliance.items.map(item => `
              <li class="verification-item" data-status="${escapeHtml(item.status)}">
                <span class="status-pill status-${escapeHtml(item.status)}">${escapeHtml(STATUS_LABELS[item.status] || item.status)}</span>
                <span class="verification-copy"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.note)}</span></span>
              </li>`).join('')}
          </ul>
        </div>
        <aside class="claims-panel" aria-labelledby="claims-heading">
          <h3 id="claims-heading">Claims we will not make</h3>
          <p>These words appear on the supplier listing. AURA does not repeat them, because no evidence has been provided for them.</p>
          <ul>${compliance.blockedClaims.map(claim => `<li>${escapeHtml(claim)}</li>`).join('')}</ul>
          <p class="small-note">A claim leaves this list only when matching evidence is verified and recorded.</p>
        </aside>
      </div>
    </section>`;
}

function card(product) {
  const first = product.images[0];
  return `<article class="product-card">
    <a class="card-image" href="${productPath(product)}" tabindex="-1" aria-hidden="true"><img src="${escapeHtml(first.src)}" alt="" width="640" height="640" loading="lazy" decoding="async" data-fallback="/assets/products/photography-pending.svg"><span class="badge">${MODELS[product.model].badge}</span></a>
    <div class="card-copy"><span class="eyebrow">${escapeHtml(product.category)}</span><h3><a href="${productPath(product)}">${escapeHtml(product.name)} ${arrow}</a></h3><p>${escapeHtml(product.tagline)}</p><span class="card-price">${product.model === 'affiliate' ? `View with ${escapeHtml(product.sourceName)}` : 'Coming soon · Price being prepared'}</span></div>
  </article>`;
}

function related(product, products) {
  const sameModel = products.filter(item => item.model === product.model && item.id !== product.id);
  const otherModel = product.model === 'affiliate' ? 'dropshipping' : 'affiliate';
  return `<section class="related-section" aria-labelledby="related-heading"><div class="section-heading"><span class="eyebrow">A collection taking shape</span><h2 id="related-heading">More to explore</h2></div>
    ${sameModel.length ? `<div class="product-cards">${sameModel.slice(0, 3).map(card).join('')}</div>` : `<div class="empty-collection"><p>More ${product.model === 'affiliate' ? 'external discoveries' : 'shop pieces'} will appear here as the collection grows.</p><a class="text-link" href="${MODELS[otherModel].path}">Explore the ${MODELS[otherModel].label.toLowerCase()} preview ${arrow}</a></div>`}
  </section>`;
}

function productDocument(product, products, actions, compliance = null) {
  validateProduct(product);
  const model = MODELS[product.model];
  const canonical = productPath(product);
  const seoTitle = product.seo?.title || `${product.name} · ${model.label} preview`;
  const seoDescription = product.seo?.description || product.description;
  return documentPage({
    title: seoTitle,
    description: seoDescription,
    active: product.model,
    canonical,
    jsonLd: productJsonLd(product, canonical),
    keywords: product.seo?.keywords?.join(', ') || null,
    image: product.images[0]?.src || null,
    content: `
      <div class="page-shell">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="${model.path}">${model.label}</a></li><li aria-current="page">${escapeHtml(product.name)}</li></ol></nav>
        <div class="preview-notice"><span class="eyebrow">AURA · Work in progress</span><p>${product.model === 'affiliate' ? 'External-link preview. Listing details and referral eligibility still need verification.' : 'Display-only preview. AURA is not accepting orders for this product.'}</p></div>
        <article class="product-layout" data-product-model="${product.model}">
          ${gallery(product)}
          <div class="product-information">
            <div class="product-kicker"><span class="eyebrow">${escapeHtml(product.category)}</span><span class="badge">${model.badge}</span></div>
            <h1>${escapeHtml(product.name)}</h1><p class="tagline">${escapeHtml(product.tagline)}</p>
            <p class="product-description">${escapeHtml(product.description)}</p>
            ${actions(product)}
            <div class="sourcing-note"><span class="eyebrow">Selected source · ${escapeHtml(product.sourceName)}</span><p>${escapeHtml(product.dataNote)}</p></div>
          </div>
        </article>
        ${details(product)}
        ${complianceSection(product, compliance)}
        ${related(product, products)}
      </div>`
  });
}

export function renderDropshippingPage(product, products = [], compliance = null) {
  if (product.model !== 'dropshipping') throw new Error('Use the dropshipping template for shop products.');
  return productDocument(product, products, dropshippingActions, compliance);
}

export function renderAffiliatePage(product, products = [], compliance = null) {
  if (product.model !== 'affiliate') throw new Error('Use the affiliate template for external offers.');
  return productDocument(product, products, affiliateActions, compliance);
}

export function renderCollection(modelName, products) {
  if (!Object.hasOwn(MODELS, modelName)) throw new Error('Unknown collection.');
  const model = MODELS[modelName];
  return documentPage({
    title: model.heading,
    description: model.description,
    active: modelName,
    content: `<div class="page-shell collection-page"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">${model.label}</li></ol></nav>
      <div class="collection-heading"><span class="eyebrow">${modelName === 'affiliate' ? 'A different way to discover' : 'The first chapter'}</span><h1>${model.heading}</h1><p>${model.description}</p></div>
      <div class="hub-explainer"><span class="badge">${model.badge}</span><p>${modelName === 'affiliate' ? 'You browse here; any purchase takes place on the linked merchant’s website.' : 'Shop products will use AURA’s checkout when selling arrangements are ready. Ordering is currently closed.'}</p></div>
      <div class="product-cards">${products.filter(product => product.model === modelName).map(card).join('') || '<p>Products will be added as this collection develops.</p>'}</div>
    </div>`
  });
}

export function renderPreviewIndex(products) {
  return documentPage({
    title: 'Two ways to discover · Product-page previews',
    description: 'Explore AURA’s separate dropshipping and external-offer layouts, before checkout and fulfilment are connected.',
    active: 'templates',
    content: `<div class="page-shell collection-page"><div class="collection-heading"><span class="eyebrow">AURA · Product-page previews</span><h1>Two ways to discover.</h1><p>One visual identity, two clear purchase paths. Explore the first shop page and the first external-offer page.</p></div>
      <div class="preview-notice"><span class="eyebrow">Presentation, not transactions</span><p>These layouts do not collect orders or payments. Supplier details and publication permissions are still being checked.</p></div>
      <div class="product-cards preview-cards">${products.map(card).join('')}</div>
      <div class="preview-hubs"><a class="text-link" href="/shop/">Browse the shop preview ${arrow}</a><a class="text-link" href="/discover/">Browse external offers ${arrow}</a></div>
    </div>`
  });
}
