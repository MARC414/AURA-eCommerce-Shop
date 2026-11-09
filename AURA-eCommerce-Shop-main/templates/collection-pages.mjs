/**
 * The rooms: /shop/, /discover/ and the six category pages. Only the wrapper
 * differs from a product page; the cards come from product-page.mjs.
 */

import { BRAND, collections, escapeHtml, arrow, documentPage } from './chrome.mjs';
import { MODELS, card, categoryPath } from './product-page.mjs';

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
      <div class="collection-heading"><span class="eyebrow">${isShop ? `${BRAND} shop` : 'A different way to discover'}</span><h1>${isShop ? 'Objects for a slower life.' : model.heading}</h1><p>${model.description}</p></div>
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
