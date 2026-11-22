/**
 * The rooms: /shop/, /discover/ and the six category pages.
 * Shop (/shop/) opens with a calm studio table hero band followed by an
 * editorial left filter sidebar and multi-column product grid backed by
 * public/assets/shop-page.js. Discover (/discover/) and room pages stay clean
 * and cutout-free.
 */

import { BRAND, collections, escapeHtml, arrow, documentPage } from './chrome.mjs';
import { MODELS, card, categoryPath } from './product-page.mjs';
import { renderReferenceHero } from './reference-layouts.mjs';

const SHOP_HERO = {
  avif: '/assets/brand/hero-shop.avif',
  webp: '/assets/brand/hero-shop.webp',
  jpg: '/assets/brand/hero-shop.jpg',
  width: 1600,
  height: 900,
  alt: 'Matte stoneware vessel, walnut mortar with whole cardamom and dried herbs, washed flax linen, and river basalt stone arranged quietly on a dark studio table'
};

const categoryCount = (collection, products) => products.filter(product =>
  product.model === 'dropshipping' && (collection.matches || []).includes(product.category)
).length;

const referenceRooms = selected => `<nav class="reference-room-links" aria-label="Browse rooms"><a href="/shop/">All pieces</a>${collections.map(c => `<a href="${categoryPath(c)}"${c.slug === selected ? ' aria-current="page"' : ''}>${escapeHtml(c.label)}</a>`).join('')}</nav>`;

function shopHero(list) {
  const sampleCount = list.filter(item => item.isPlaceholder).length;
  const previewCount = list.length - sampleCount;
  return `<section class="shop-hero" aria-labelledby="shop-hero-heading">
      <div class="shop-hero__media" aria-hidden="true">
        <picture>
          <source type="image/avif" srcset="${SHOP_HERO.avif}" sizes="100vw">
          <source type="image/webp" srcset="${SHOP_HERO.webp}" sizes="100vw">
          <img src="${SHOP_HERO.jpg}" alt="" width="${SHOP_HERO.width}" height="${SHOP_HERO.height}" fetchpriority="high" decoding="async">
        </picture>
        <div class="shop-hero__grade"></div>
        <div class="grain"></div>
        <div class="shop-hero__scrim"></div>
      </div>
      <div class="shop-hero__inner">
        <nav class="breadcrumbs breadcrumbs--hero" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Shop</li></ol></nav>
        <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(BRAND)} collection</span>
        <h1 id="shop-hero-heading" class="shop-hero__title">Objects for a slower life.</h1>
        <p class="shop-hero__lede">Herbs, everyday cleansing bars, studio miscellany, practice goods and craft — chosen one by one, described plainly without theatre.</p>
        <p class="shop-hero__meta">${list.length} curated pieces · ${collections.length} rooms · ${previewCount} preview · ${sampleCount} construction samples</p>
      </div>
    </section>`;
}

function shopSidebar(products, list) {
  const sampleCount = list.filter(item => item.isPlaceholder).length;
  const previewCount = list.length - sampleCount;
  const priced = list.filter(item => Number.isFinite(item.price));
  const under20Count = priced.filter(item => item.price < 20).length;
  const midCount = priced.filter(item => item.price >= 20 && item.price <= 45).length;
  const upperCount = priced.filter(item => item.price > 45).length;
  const requestCount = list.length - priced.length;

  return `<aside class="shop-sidebar" aria-label="Filter and sort collection">
      <details class="shop-filter-disclosure" data-shop-disclosure open>
        <summary class="shop-filter-summary">
          <span>Filter &amp; sort</span>
          <span class="shop-filter-summary__state" data-shop-active-summary>All rooms · Curated order</span>
        </summary>
        <form class="shop-filter-form" data-shop-form>
          <div class="shop-filter-head">
            <span class="eyebrow">Refine archive</span>
            <button type="button" class="text-link shop-reset-btn" data-shop-reset hidden>Clear all</button>
          </div>

          <fieldset class="filter-group">
            <legend>Room</legend>
            <label class="filter-option">
              <input type="radio" name="room" value="all" data-label="All rooms" checked>
              <span class="filter-option__label">All rooms</span>
              <span class="filter-option__count">${list.length}</span>
            </label>
            ${collections.map(collection => {
              const count = categoryCount(collection, products);
              return `<label class="filter-option">
              <input type="radio" name="room" value="${escapeHtml(collection.slug)}" data-label="${escapeHtml(collection.label)}">
              <span class="filter-option__label">${escapeHtml(collection.label)}</span>
              <span class="filter-option__count">${count}</span>
            </label>`;
            }).join('')}
          </fieldset>

          <fieldset class="filter-group">
            <legend>Listing state</legend>
            <label class="filter-option">
              <input type="radio" name="status" value="all" data-label="All states" checked>
              <span class="filter-option__label">All states</span>
              <span class="filter-option__count">${list.length}</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="status" value="preview" data-label="Owner preview">
              <span class="filter-option__label">Owner preview</span>
              <span class="filter-option__count">${previewCount}</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="status" value="sample" data-label="Construction sample">
              <span class="filter-option__label">Construction sample</span>
              <span class="filter-option__count">${sampleCount}</span>
            </label>
          </fieldset>

          <fieldset class="filter-group">
            <legend>Price guide</legend>
            <label class="filter-option">
              <input type="radio" name="tier" value="all" data-label="Any price" checked>
              <span class="filter-option__label">Any price</span>
              <span class="filter-option__count">${list.length}</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="tier" value="under-20" data-label="Under £20">
              <span class="filter-option__label">Under £20</span>
              <span class="filter-option__count">${under20Count}</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="tier" value="20-45" data-label="£20 – £45">
              <span class="filter-option__label">£20 – £45</span>
              <span class="filter-option__count">${midCount}</span>
            </label>
            <label class="filter-option">
              <input type="radio" name="tier" value="45-plus" data-label="Over £45">
              <span class="filter-option__label">Over £45</span>
              <span class="filter-option__count">${upperCount}</span>
            </label>
            ${requestCount > 0 ? `<label class="filter-option">
              <input type="radio" name="tier" value="request" data-label="Price on request">
              <span class="filter-option__label">Price on request</span>
              <span class="filter-option__count">${requestCount}</span>
            </label>` : ''}
          </fieldset>

          <div class="filter-group filter-group--sort">
            <label class="filter-sort-label" for="shop-sort-select">Sort order</label>
            <select id="shop-sort-select" class="filter-sort-select" name="sort">
              <option value="curated">Curated order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name-asc">Title: A to Z</option>
            </select>
          </div>

          <nav class="shop-sidebar__rooms" aria-label="Dedicated room pages">
            <span class="eyebrow">Room pages</span>
            <ul>
              ${collections.map(collection => `<li><a href="${categoryPath(collection)}">${escapeHtml(collection.label)}</a></li>`).join('')}
              <li><a href="/discover/">Partner offers ${arrow}</a></li>
            </ul>
          </nav>
        </form>
      </details>
    </aside>`;
}

export function renderCollection(modelName, products, documentOptions = {}) {
  if (!Object.hasOwn(MODELS, modelName)) throw new Error('Unknown collection.');
  const model = MODELS[modelName];
  const list = products.filter(product => product.model === modelName);
  const isShop = modelName === 'dropshipping';
  const route = model.path;
  const { referenceLayout = null, ...shellOptions } = documentOptions;
  if (referenceLayout && referenceLayout !== (isShop ? 'paper-hero' : 'paper-grid')) throw new Error(`Unsupported reference layout for ${route}`);

  if (isShop) {
    return documentPage({
      title: 'Shop',
      description: model.description,
      canonical: route,
      active: 'shop',
      scripts: ['/assets/shop-page.js'],
      ...shellOptions,
      content: `<div class="shop-hub-page">
      ${referenceLayout ? renderReferenceHero({ surface: 'paper', eyebrow: `${BRAND} collection`, heading: 'Objects for a slower life.', intro: 'Herbs, everyday cleansing bars, studio miscellany, practice goods and craft — chosen one by one, described plainly without theatre.', action: { href: '#shop-reference-results', label: 'Explore the collection' }, meta: `${list.length} curated pieces · ${collections.length} rooms · ${list.filter(p => !p.isPlaceholder).length} preview · ${list.filter(p => p.isPlaceholder).length} construction samples` }) : shopHero(list)}
      <div class="page-shell collection-page shop-collection-shell"${referenceLayout ? ' id="shop-reference-results"' : ''}>
        <div class="shop-workspace">
          ${shopSidebar(products, list)}
          <div class="shop-results">
            <div class="shop-toolbar">
              <p class="shop-toolbar__count" data-shop-count aria-live="polite">Showing ${list.length} of ${list.length} ${list.length === 1 ? 'piece' : 'pieces'}</p>
              <button type="button" class="text-link shop-toolbar__reset" data-shop-reset hidden>Reset filters</button>
            </div>
            <div class="product-cards${referenceLayout ? ' reference-card-grid' : ''}" data-shop-grid>${list.map((product, index) => card(product, index)).join('') || '<p>Pieces will be added as the collection develops.</p>'}</div>
            <div class="shop-empty" data-shop-empty hidden>
              <span class="eyebrow">No match in current selection</span>
              <h2>No pieces match those filters.</h2>
              <p>Try widening the room or price bracket, or reset to read the full collection.</p>
              <button type="button" class="button button-secondary button-small" data-shop-reset>Clear all filters</button>
            </div>
          </div>
        </div>
      </div>
    </div>`
    });
  }

  return documentPage({
    title: 'Partner offers',
    description: model.description,
    canonical: route,
    active: 'shop',
    ...shellOptions,
    content: `<div class="page-shell collection-page">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">${model.label}</li></ol></nav>
      <div class="collection-heading">
        <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>A different way to discover</span>
        <h1>${model.heading}</h1>
        <p>${model.description}</p>
      </div>
      <div class="hub-explainer"><span class="badge badge-partner">${model.badge}</span><p>You browse here; the purchase, delivery and returns take place on the linked merchant’s website.</p></div>
      ${referenceLayout ? referenceRooms(null) : ''}<div class="product-cards${referenceLayout ? ' reference-card-grid' : ''}">${list.map((product, index) => card(product, index)).join('') || '<p>Pieces will be added as the collection develops.</p>'}</div>
    </div>`
  });
}

export function renderCategoryPage(collection, products, documentOptions = {}) {
  if (!collection || !collection.slug) throw new Error('A category needs a slug.');
  const route = categoryPath(collection);
  const { referenceLayout = null, ...shellOptions } = documentOptions;
  if (referenceLayout && referenceLayout !== 'paper-hero') throw new Error(`Unsupported reference layout for ${route}`);
  const list = products.filter(product =>
    product.model === 'dropshipping' && (collection.matches || []).includes(product.category)
  );
  return documentPage({
    title: collection.heading,
    description: collection.description,
    canonical: route,
    active: 'shop',
    ...shellOptions,
    content: `${referenceLayout ? renderReferenceHero({ surface: 'paper', eyebrow: collection.eyebrow, heading: collection.heading, intro: collection.intro, action: { href: '#category-reference-results', label: 'Explore this room' } }) : ''}<div class="page-shell collection-page room-page"${referenceLayout ? ' id="category-reference-results"' : ''}>
      ${referenceLayout ? '' : `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/shop/">Shop</a></li><li aria-current="page">${escapeHtml(collection.label)}</li></ol></nav>
      <div class="collection-heading">
        <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(collection.eyebrow)}</span>
        <h1>${escapeHtml(collection.heading)}</h1>
        <p>${escapeHtml(collection.intro)}</p>
      </div>`}
      <div class="category-toolbar"><span class="small-note">${list.length} ${list.length === 1 ? 'piece' : 'pieces'} in this room</span><a class="text-link" href="/shop/">All pieces ${arrow}</a></div>
      ${referenceLayout ? referenceRooms(collection.slug) : ''}<div class="product-cards${referenceLayout ? ' reference-card-grid' : ''}">${list.map((product, index) => card(product, index)).join('') || `<div class="empty-collection"><p>Pieces are being selected for this room.</p><a class="text-link" href="/shop/">Browse everything in the shop ${arrow}</a></div>`}</div>
    </div>`
  });
}
