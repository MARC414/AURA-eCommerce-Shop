import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  escapeHtml,
  validateProduct,
  productPath,
  variantLabel,
  renderDropshippingPage,
  renderAffiliatePage,
  renderCollection,
  renderCategoryPage,
  renderStaticPage
} from '../templates/product-pages.mjs';

const products = JSON.parse(await readFile(new URL('../data/pilot-products.json', import.meta.url), 'utf8'));
const site = JSON.parse(await readFile(new URL('../data/site.json', import.meta.url), 'utf8'));
const sitePages = JSON.parse(await readFile(new URL('../data/pages.json', import.meta.url), 'utf8'));
const collections = JSON.parse(await readFile(new URL('../data/collections.json', import.meta.url), 'utf8'));

const shopProduct = products.find(product => product.model === 'dropshipping');
const affiliateProduct = products.find(product => product.model === 'affiliate');
const aloeProduct = products.find(product => product.slug === 'aloe-vera-soap');
const ashwagandhaProduct = products.find(product => product.sourceProductId === '1898627038642925570');
const shopPage = renderDropshippingPage(shopProduct, products);
const affiliatePage = renderAffiliatePage(affiliateProduct, products);
const aloePage = renderDropshippingPage(aloeProduct, products);
const ashwagandhaPage = renderDropshippingPage(ashwagandhaProduct, products);
const productPages = new Map([[shopProduct, shopPage], [affiliateProduct, affiliatePage], [aloeProduct, aloePage], [ashwagandhaProduct, ashwagandhaPage]]);
const pageAt = path => sitePages.find(page => page.path === path);
const checkoutPage = renderStaticPage(pageAt('/checkout/'));
const accountPage = renderStaticPage(pageAt('/account/'));
const newsletterPage = renderStaticPage(pageAt('/newsletter/'));
const cartPage = renderStaticPage(pageAt('/cart/'));
const clone = product => structuredClone(product);

/** The header search is a GET form. Remove it before purchase-form assertions. */
const withoutHeaderSearch = page => page.replace(/<form class="site-search"[\s\S]*?<\/form>/g, '');

test('the catalogue contains four listings with unique routes and valid data', () => {
  assert.equal(products.length, 4);
  assert.equal(shopProduct.sourceProductId, '1005007532901889');
  assert.equal(affiliateProduct.sourceProductId, '2114448810729783298');
  assert.equal(aloeProduct.sourceProductId, '1005008143754192');
  assert.equal(ashwagandhaProduct.sourceSku, 'CJHP232030301AZ');
  assert.equal(new Set(products.map(productPath)).size, products.length);
  products.forEach(product => assert.doesNotThrow(() => validateProduct(product)));
});

test('the public product shell carries no preview or compliance theatre', () => {
  for (const page of productPages.values()) {
    assert.doesNotMatch(page, /preview|Preview/);
    assert.doesNotMatch(page, /Verification register|Claims we will not make|compliance-section|status-verified/);
  }
});

test('the aloe listing publishes no medicinal or skin-tone claim in its own copy', () => {
  const forbidden = [/anti[-\s]?acne/i, /brighten/i, /whitening/i, /melanin/i, /oil control/i, /reduces spots/i];
  const ownCopy = [
    aloePage.match(/<title>([\s\S]*?)<\/title>/)[1],
    aloePage.match(/<h1>([\s\S]*?)<\/h1>/)[1],
    aloePage.match(/<meta name="description" content="([^"]*)"/)[1],
    aloePage.match(/<p class="tagline">([\s\S]*?)<\/p>/)[1]
  ].join(' ');
  for (const pattern of forbidden) {
    assert.doesNotMatch(ownCopy, pattern, `aloe page copy leaks a blocked claim: ${pattern}`);
  }
  assert.doesNotMatch(aloePage, /Anti Acne/);
});

test('the aloe page keeps real supplier facts and an honest price state', () => {
  assert.match(aloePage, /100 g \/ 3\.5 oz/);
  assert.match(aloePage, /12 months/);
  assert.match(aloePage, /36 months/);
  assert.match(aloePage, /12000043973353662-WK-aloe-vera-soapX1/);
  assert.match(aloePage, /Price on request/);
  assert.doesNotMatch(aloePage, /£28\.30|£20\.73|save £/i);
});

test('variant labels use price on request rather than a fabricated amount', () => {
  assert.equal(variantLabel({ label: 'Pack of 1', price: null }), 'Pack of 1 — price on request');
  assert.equal(variantLabel({ label: 'Pack of 1', price: 12 }), 'Pack of 1');
  assert.equal(variantLabel('Plain label'), 'Plain label');
  assert.throws(() => variantLabel({ sku: 'x' }), /needs a label/);
  assert.match(aloePage, /Pack of 1 — price on request/);
});

test('products have individual, model-specific routes', () => {
  assert.equal(productPath(shopProduct), '/shop/turmeric-cleansing-soap/');
  assert.equal(productPath(affiliateProduct), '/discover/turmeric-cleansing-pads/');
  assert.equal(productPath(ashwagandhaProduct), '/shop/ashwagandha-with-black-pepper/');
});

test('the AURA cart button stores a browser-local item without an order form', () => {
  const button = shopPage.match(/<button[^>]+data-add-to-cart[^>]*>/)?.[0];
  assert.ok(button, 'the AURA shop page needs an add-to-cart button');
  assert.doesNotMatch(button, /\bdisabled\b/);
  assert.match(button, /data-product-id="aliexpress-1005007532901889"/);
  assert.match(button, /data-product-price=""/);
  assert.match(shopPage, /Price on request/);
  assert.doesNotMatch(withoutHeaderSearch(shopPage), /<form\b|paymentIntent|stripe|paypal/i);
  assert.doesNotMatch(shopPage, /data-product-model="affiliate"/);
});

test('the affiliate action preserves the exact referral token and opens externally', () => {
  const action = affiliatePage.match(/<a class="button button-primary external-cta"[^>]+>/)?.[0];
  assert.ok(action);
  assert.ok(action.includes(`href="${escapeHtml(affiliateProduct.externalUrl)}"`));
  assert.match(action, /target="_blank"/);
  assert.match(action, /rel="sponsored noopener noreferrer"/);
  assert.match(action, /aria-describedby="offer-disclosure"/);
  assert.match(affiliatePage, /OPAR may earn a commission if you buy through this link/);
});

test('affiliate pages never contain AURA purchase or quantity controls', () => {
  assert.doesNotMatch(withoutHeaderSearch(affiliatePage), /data-quantity-change|data-variant|button-closed|<form\b|\/checkout/);
  assert.match(affiliatePage, /Partner offer/);
  assert.match(affiliatePage, /No OPAR cart or checkout/);
});

test('missing prices are shown as price on request, never as a zero-price offer', () => {
  assert.match(shopPage, /Price on request/);
  assert.match(affiliatePage, /Price on CJ/);
  for (const page of [shopPage, affiliatePage, ashwagandhaPage]) {
    assert.doesNotMatch(page, /\$0\b|schema.org\/InStock|"price"|Limited Run|Verified Buyer|\d+ Reviews/);
  }
});

test('the template can render a confirmed price without breaking the invoice model', () => {
  const product = { ...clone(shopProduct), price: 12.5, currency: 'GBP' };
  const page = renderDropshippingPage(product);
  assert.match(page, /£12\.50/);
  assert.match(page, /Confirmed on invoice/);
  assert.match(page, /data-product-price="12\.5"/);
});

test('unknown supplier variants are disabled rather than invented', () => {
  assert.match(shopPage, /<select id="product-variant" data-variant disabled>/);
  assert.match(shopPage, /One edition/);
});

test('the shared template accepts confirmed variants for future products', () => {
  const product = { ...clone(shopProduct), variants: ['Small & simple', 'Large'] };
  const page = renderDropshippingPage(product);
  assert.match(page, /<select id="product-variant" data-variant>/);
  assert.match(page, /<option>Small &amp; simple<\/option>/);
  assert.match(page, /<option>Large<\/option>/);
});

test('use the correct template for each selling model', () => {
  assert.throws(() => renderAffiliatePage(shopProduct), /affiliate template/);
  assert.throws(() => renderDropshippingPage(affiliateProduct), /dropshipping template/);
});

test('supplier and selling model are independent', () => {
  const product = { ...clone(shopProduct), sourceName: 'Another supplier' };
  assert.match(renderDropshippingPage(product), /data-product-model="dropshipping"/);
  assert.match(renderDropshippingPage(product), /Another supplier/);
});

test('the gallery is labelled and has keyboard-operable thumbnail buttons', () => {
  for (const [product, page] of productPages) {
    assert.match(page, /role="group" aria-label="Product gallery"/);
    assert.equal((page.match(/data-gallery-src=/g) || []).length, product.images.length);
    assert.match(page, /aria-pressed="true"/);
    assert.match(page, /width="1000" height="1000"/);
    assert.match(page, /data-fallback="\/assets\/products\/photography-pending.svg"/);
    assert.match(page, /<p class="image-caption" data-gallery-caption aria-live="polite">/);
  }
});

test('static HTML contains meaningful content and unique metadata before JavaScript', () => {
  for (const [product, page] of productPages) {
    assert.equal((page.match(/<h1>/g) || []).length, 1);
    assert.match(page, /<meta name="robots" content="noindex, follow">/);
    assert.match(page, /<meta name="description"/);
    assert.ok(page.includes(`<h1>${product.name}</h1>`));
    assert.ok(page.includes(escapeHtml(product.description)));
    assert.doesNotMatch(page, /react|tailwindcss.com|type="module"|<div id="root"/i);
  }
  assert.notEqual(shopPage.match(/<title>(.*?)<\/title>/)?.[1], affiliatePage.match(/<title>(.*?)<\/title>/)?.[1]);
});

test('collection pages keep the selling models separate', () => {
  const shop = renderCollection('dropshipping', products);
  const discover = renderCollection('affiliate', products);
  assert.ok(shop.includes(shopProduct.name));
  assert.ok(!shop.includes(affiliateProduct.name));
  assert.ok(discover.includes(affiliateProduct.name));
  assert.ok(!discover.includes(shopProduct.name));
  assert.ok(shop.includes(productPath(ashwagandhaProduct)));
  assert.match(shop, /href="\/shop\/herbal-botanicals\/"/);
  assert.match(shop, /Objects for a slower life/);
});

test('category pages show only their own pieces and a real empty state', () => {
  const herbal = renderCategoryPage(collections.find(item => item.slug === 'herbal-botanicals'), products);
  const showpieces = renderCategoryPage(collections.find(item => item.slug === 'showpieces'), products);
  assert.match(herbal, /Ashwagandha with Black Pepper/);
  assert.doesNotMatch(herbal, /Turmeric Cleansing Soap/);
  assert.match(herbal, /1 piece in this room/);
  assert.match(showpieces, /Showpieces/);
  assert.match(showpieces, /Pieces are being selected for this room/);
  assert.match(showpieces, /0 pieces in this room/);
  assert.match(showpieces, /href="\/shop\/"/);
  assert.equal((herbal.match(/<h1>/g) || []).length, 1);
});

test('related product areas stay inside the same purchase model', () => {
  const section = shopPage.split('class="related-section"')[1];
  assert.match(section, new RegExp(aloeProduct.name));
  assert.doesNotMatch(section, new RegExp(affiliateProduct.name));
  const second = { ...clone(shopProduct), id: 'another-shop-item', slug: 'another-shop-item', name: 'Another shop piece' };
  const page = renderDropshippingPage(shopProduct, [...products, second]);
  const related = page.split('class="related-section"')[1];
  assert.match(related, /Another shop piece/);
  assert.doesNotMatch(related, new RegExp(affiliateProduct.name));
});

test('text and attributes are escaped instead of injected as HTML', () => {
  assert.equal(escapeHtml('<script>"hello" & \'bye\'</script>'), '&lt;script&gt;&quot;hello&quot; &amp; &#39;bye&#39;&lt;/script&gt;');
  const product = { ...clone(shopProduct), name: '<script>alert(1)</script>' };
  const page = renderDropshippingPage(product);
  assert.doesNotMatch(page, /<script>alert\(1\)<\/script>/);
  assert.match(page, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});

test('reject unsafe URL schemes, credentials, routes, and invalid prices', () => {
  for (const sourceUrl of ['javascript:alert(1)', 'http://example.com', 'https://user:password@example.com']) {
    assert.throws(() => validateProduct({ ...clone(shopProduct), sourceUrl }));
  }
  for (const slug of ['../checkout', 'x/y', 'Bad Slug', '<script>']) {
    assert.throws(() => validateProduct({ ...clone(shopProduct), slug }));
  }
  for (const price of [-1, NaN, Infinity]) {
    assert.throws(() => validateProduct({ ...clone(shopProduct), price }));
  }
  assert.throws(() => validateProduct({ ...clone(shopProduct), model: '__proto__' }));
});

test('external offers require a referral URL and a disclosure', () => {
  assert.throws(() => validateProduct({ ...clone(affiliateProduct), externalUrl: 'javascript:alert(1)' }));
  assert.throws(() => validateProduct({ ...clone(affiliateProduct), disclosure: '' }));
});

test('the product enhancement script uses the shared store and no network calls', async () => {
  const script = await readFile(new URL('../public/assets/product-pages.js', import.meta.url), 'utf8');
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|createOrder|\.submit\(/);
  assert.match(script, /window\.AuraStore\.addToCart/);
  assert.match(script, /selected/);
  assert.match(script, /Math\.max\(1, Math\.min\(10/);
  assert.doesNotMatch(script, /Ordering is not open/);
});

test('product pages emit canonical, JSON-LD, and no offer for an unpriced piece', () => {
  assert.match(shopPage, /<link rel="canonical" href="\/shop\/turmeric-cleansing-soap\/">/);
  assert.match(shopPage, /application\/ld\+json/);
  assert.match(shopPage, /"@type":"Product"/);
  assert.match(shopPage, /"@type":"BreadcrumbList"/);
  assert.match(shopPage, /Herbal Botanicals|Everyday Care/);
  assert.doesNotMatch(shopPage, /"@type":"Offer"/);
  assert.match(affiliatePage, /rel="sponsored noopener noreferrer"/);
  assert.match(shopPage, /property="og:image"/);
});

test('Ashwagandha preserves capsule identity and label amounts without inventing an offer', () => {
  assert.equal(ashwagandhaProduct.price, null);
  assert.equal(ashwagandhaProduct.purchaseOwner, 'aura');
  assert.match(ashwagandhaPage, /60 capsules/);
  assert.match(ashwagandhaPage, /1,300 mg Withania somnifera root per 2 capsules/);
  assert.match(ashwagandhaPage, /10 mg Piper nigrum fruit per 2 capsules/);
  assert.match(ashwagandhaPage, /113 g[^<]*gross|Gross package weight[\s\S]*113 g/);
  assert.match(ashwagandhaPage, /not net powder weight/);
  assert.match(ashwagandhaPage, /Powder[^<]*conflicts/);
  assert.match(ashwagandhaPage, /data-add-to-cart/);
  assert.match(ashwagandhaPage, /Price on request/);
  assert.doesNotMatch(ashwagandhaPage, /\$15\.00|Inventory: 999|500 mg|brand[^<]*NOW|external-cta/);
});

test('supplement structured data parses without an invented brand, photo, rating, or offer', () => {
  const script = ashwagandhaPage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const graph = JSON.parse(script);
  const product = graph.find(node => node['@type'] === 'Product');
  assert.equal(product.name, ashwagandhaProduct.name);
  assert.equal(product.sku, 'CJHP232030301AZ');
  assert.equal(product.url, '/shop/ashwagandha-with-black-pepper/');
  for (const key of ['brand', 'image', 'offers', 'aggregateRating', 'review']) {
    assert.equal(Object.hasOwn(product, key), false, `Unexpected ${key} in supplement schema`);
  }
  assert.doesNotMatch(ashwagandhaPage, /property="og:image"/);
  assert.match(ashwagandhaPage, /<meta name="robots" content="noindex, follow">/);
});

test('styles include visible focus, responsive layouts, checkout and reduced motion', async () => {
  const css = await readFile(new URL('../public/assets/product-pages.css', import.meta.url), 'utf8');
  assert.match(css, /:focus-visible/);
  assert.match(css, /max-width: 760px/);
  assert.match(css, /max-width: 480px/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.checkout-layout/);
  assert.match(css, /\.category-strip/);
  assert.match(css, /\.nav-panel-grouped/);
  assert.match(css, /\.header-bottom \{[^}]*justify-content: center/);
  assert.match(css, /\.primary-nav \{[^}]*justify-content: center/);
  assert.match(css, /\.nav-panel \{[^}]*left: 50%/);
  assert.doesNotMatch(css, /\.category-nav/);
});

test('the menu stays small and every published link has a generated page', () => {
  // Four sections only. Categories and Discover are not destinations in their
  // own right; their pages are reachable once, inside the Shop panel.
  assert.equal(site.nav.length, 4, 'the primary menu is not exactly four top-level items');
  assert.deepEqual(site.nav.map(item => item.label), ['Shop', 'Perennis', 'Journal', 'About']);
  assert.deepEqual(site.nav.map(item => item.id), ['shop', 'perennis', 'journal', 'about']);
  assert.doesNotMatch(site.nav.map(item => item.label).join(' '), /Categories|Discover/);

  // Shop carries the browse links and then the six rooms, in collection order.
  const shopItem = site.nav.find(item => item.id === 'shop');
  assert.deepEqual(
    shopItem.children.map(child => child.href),
    ['/shop/', '/discover/', ...collections.map(collection => `/shop/${collection.slug}/`)]
  );
  assert.deepEqual([...new Set(shopItem.children.map(child => child.group))], ['Browse', 'Rooms']);
  assert.deepEqual(
    shopItem.children.filter(child => child.group === 'Rooms').map(child => child.label),
    collections.map(collection => collection.heading)
  );
  // Only Shop is grouped; the other three panels stay a flat list.
  for (const item of site.nav.filter(item => item.id !== 'shop')) {
    assert.ok((item.children || []).every(child => child.group === undefined), `${item.id} should not use panel groups`);
  }
  const routes = new Set([
    ...products.map(productPath),
    '/shop/',
    '/discover/',
    ...collections.map(collection => `/shop/${collection.slug}/`),
    ...sitePages.map(page => page.path)
  ]);
  const links = [
    ...site.nav.flatMap(item => [item.href, ...(item.children || []).map(child => child.href)]),
    ...site.footer.columns.flatMap(column => column.links.map(link => link.href))
  ];
  for (const href of new Set(links)) {
    assert.ok(routes.has(href), `no page is generated for ${href}`);
  }
});

test('one header and one footer come from the site contract', () => {
  for (const page of [shopPage, affiliatePage, checkoutPage]) {
    assert.match(page, /<form class="site-search" role="search" action="\/search\/" method="get">/);
    assert.match(page, /aria-label="Primary navigation"/);
    assert.match(page, /href="\/perennis\/books\/"/);
    assert.match(page, /href="\/journal\/"/);
    assert.match(page, /href="\/policies\/privacy\/"/);
    assert.match(page, /data-cart-count/);
    assert.match(page, /href="\/account\/"/);
    assert.match(page, /class="nav-panel/);
    // The menu sits in the middle of the header. Every shop category is a
    // submenu item under Shop, in a "Rooms" column beside the browse links.
    for (const collection of collections) {
      assert.match(page, new RegExp(`href="\\/shop\\/${collection.slug}\\/">`));
    }
    assert.match(page, /<span>Shop<\/span>/);
    assert.match(page, /class="nav-panel nav-panel-grouped"/);
    assert.match(page, /<span class="nav-group-label">Browse<\/span>/);
    assert.match(page, /<span class="nav-group-label">Rooms<\/span>/);
    assert.equal((page.match(/<span>Categories<\/span>/g) || []).length, 0);
    // Four top-level groups: one summary per section, no orphaned Categories tab.
    assert.equal((page.match(/<summary[^>]*><span>/g) || []).length, 4);
    assert.doesNotMatch(page, /class="category-nav"/);
    assert.doesNotMatch(page, /shop\/sacred-sound\//);
    assert.match(page, /Sacred Sound/);
    assert.equal((page.match(/<header class="site-header">/g) || []).length, 1);
    assert.equal((page.match(/<footer class="site-footer">/g) || []).length, 1);
  }
});

test('every static page renders one heading and its own metadata', () => {
  for (const page of sitePages) {
    const html = renderStaticPage(page);
    assert.equal((html.match(/<h1>/g) || []).length, 1, `${page.path} needs exactly one h1`);
    assert.match(html, /<meta name="robots" content="noindex, follow">/);
    assert.ok(html.includes(escapeHtml(page.heading)));
    assert.ok(html.includes(escapeHtml(page.description)));
    assert.doesNotMatch(html, /href="\/templates\//);
  }
});

test('static page routes and required copy are validated', () => {
  assert.throws(() => renderStaticPage({ ...sitePages[0], path: '/Bad Path/' }), /Invalid static page path/);
  assert.throws(() => renderStaticPage({ ...sitePages[0], heading: '' }), /needs a title/);
});

test('only products owned by AURA receive an add-to-cart control', () => {
  assert.match(shopPage, /data-add-to-cart/);
  assert.doesNotMatch(affiliatePage, /data-add-to-cart/);
  const partnerOwned = { ...clone(shopProduct), purchaseOwner: 'partner' };
  assert.doesNotMatch(renderDropshippingPage(partnerOwned), /data-add-to-cart/);
  assert.match(renderDropshippingPage(partnerOwned), /Ask about this piece/);
});

test('both selling models can save an item to the wishlist without buying it', () => {
  for (const page of [shopPage, affiliatePage]) {
    assert.match(page, /data-wishlist-toggle="/);
    assert.match(page, /aria-pressed="false"/);
    assert.match(page, /Save to wishlist/);
  }
});

test('the shared store loads before the chrome, then the page island', () => {
  const scripts = page => [...page.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map(match => match[1]);
  assert.deepEqual(scripts(shopPage), ['/assets/cart.js', '/assets/site.js', '/assets/product-pages.js']);
  assert.deepEqual(scripts(cartPage), ['/assets/cart.js', '/assets/site.js', '/assets/cart-page.js']);
  assert.deepEqual(scripts(checkoutPage), ['/assets/cart.js', '/assets/site.js', '/assets/checkout-page.js']);
  assert.deepEqual(scripts(accountPage), ['/assets/cart.js', '/assets/site.js', '/assets/account-page.js']);
  assert.deepEqual(scripts(newsletterPage), ['/assets/cart.js', '/assets/site.js', '/assets/newsletter-page.js']);
});

test('the cart shell links to checkout and keeps no payment form', () => {
  assert.match(cartPage, /data-cart-items/);
  assert.match(cartPage, /data-cart-status role="status" aria-live="polite"/);
  assert.match(cartPage, /data-cart-subtotal/);
  assert.match(cartPage, /data-cart-price-note/);
  assert.match(cartPage, /href="\/checkout\/"/);
  assert.match(cartPage, /<noscript>/);
  assert.doesNotMatch(withoutHeaderSearch(cartPage), /<form\b|stripe|paypal|paymentIntent/i);
});

test('checkout renders an invoice form, not a card payment form', () => {
  assert.match(checkoutPage, /<form class="checkout-form" data-checkout-form>/);
  for (const field of ['name', 'email', 'country', 'city', 'address', 'postcode', 'notes', 'consent']) {
    assert.match(checkoutPage, new RegExp(`name="${field}"`));
  }
  assert.match(checkoutPage, /data-checkout-items/);
  assert.match(checkoutPage, /data-checkout-confirmation/);
  assert.match(checkoutPage, /Request invoice/);
  assert.doesNotMatch(checkoutPage, /<input[^>]*(?:cc-number|cvc|card_number|expiry|security.code|card number)[^>]*/i);
});

test('checkout script records a local request, clears the cart and never calls a network', async () => {
  const script = await readFile(new URL('../public/assets/checkout-page.js', import.meta.url), 'utf8');
  assert.match(script, /window\.AuraStore\.saveOrder/);
  assert.match(script, /window\.AuraStore\.clearCart/);
  assert.match(script, /preventDefault/);
  assert.match(script, /data-checkout-reference/);
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|stripe|paypal|paymentIntent|cc-number/i);
});

test('account renders local invoice requests and can remove them', async () => {
  const script = await readFile(new URL('../public/assets/account-page.js', import.meta.url), 'utf8');
  assert.match(accountPage, /data-account-orders/);
  assert.match(accountPage, /data-account-empty/);
  assert.match(script, /window\.AuraStore\.getOrders/);
  assert.match(script, /window\.AuraStore\.removeOrder/);
  assert.match(script, /Invoice requested/);
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|stripe|paypal/i);
});

test('newsletter stores a preference in the browser and explains that nothing is sent', async () => {
  const script = await readFile(new URL('../public/assets/newsletter-page.js', import.meta.url), 'utf8');
  assert.match(newsletterPage, /data-newsletter-form/);
  assert.match(newsletterPage, /data-newsletter-status/);
  assert.match(script, /window\.AuraStore\.saveNewsletter/);
  assert.match(script, /window\.AuraStore\.getNewsletter/);
  assert.match(script, /nothing has been sent/i);
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|stripe|paypal/i);
});

test('the static store writes exactly the keys and item shape the React app reads', async () => {
  const cart = await readFile(new URL('../public/assets/cart.js', import.meta.url), 'utf8');
  const commerce = await readFile(new URL('../services/commerce.ts', import.meta.url), 'utf8');
  const store = await readFile(new URL('../services/storeService.ts', import.meta.url), 'utf8');
  assert.match(commerce, /CART: 'aura_cart_v1'/);
  assert.match(store, /WISHLIST: 'aura_wishlist_v1'/);
  assert.ok(cart.includes("var CART_KEY = 'aura_cart_v1';"));
  assert.ok(cart.includes("var WISHLIST_KEY = 'aura_wishlist_v1';"));
  assert.ok(cart.includes("var ORDER_KEY = 'aura_order_requests_v1';"));
  assert.match(cart, /product: item\.product/);
  assert.match(cart, /quantity: clamp\(item\.quantity, 1, 99\)/);
  assert.match(cart, /selectedVariant: item\.selectedVariant/);
  assert.match(cart, /aura_wishlist_updated/);
  assert.match(store, /aura_wishlist_updated/);
  assert.doesNotMatch(cart, /fetch\(|XMLHttpRequest|stripe|paypal/i);
});

test('the wishlist page joins saved ids to a public catalogue and degrades honestly', async () => {
  const script = await readFile(new URL('../public/assets/wishlist-page.js', import.meta.url), 'utf8');
  assert.match(script, /\/assets\/catalogue\.json/);
  assert.match(script, /getWishlistIds/);
  assert.match(script, /No longer listed on this site/);
  assert.match(script, /Price on request/);
  assert.doesNotMatch(script, /createOrder|stripe|paypal/i);
});

test('the browser store treats a null price as pending, never as zero', async () => {
  const script = await readFile(new URL('../public/assets/cart.js', import.meta.url), 'utf8');
  const memory = new Map();
  const fakeWindow = {
    localStorage: {
      getItem: key => (memory.has(key) ? memory.get(key) : null),
      setItem: (key, value) => memory.set(key, String(value)),
      removeItem: key => memory.delete(key)
    },
    dispatchEvent: () => true
  };
  new Function('window', script)(fakeWindow);
  const store = fakeWindow.AuraStore;
  assert.ok(store, 'cart.js must expose AuraStore');

  const unpriced = { id: 'pending', name: 'Pending', slug: 'pending', price: null, currency: 'GBP', category: 'Test', imageUrl: '/assets/products/photography-pending.svg' };
  const priced = { id: 'priced', name: 'Priced', slug: 'priced', price: 10, currency: 'GBP', category: 'Test', imageUrl: '/assets/products/photography-pending.svg' };

  store.addToCart(unpriced, 2);
  assert.equal(store.cartCount(), 2);
  assert.equal(store.cartSubtotal(), 0);
  assert.equal(store.hasPendingPrice(), true);
  assert.deepEqual(Object.keys(JSON.parse(memory.get('aura_cart_v1'))[0]).sort(), ['product', 'quantity']);

  store.addToCart(priced, 1);
  assert.equal(store.cartSubtotal(), 10);
  assert.equal(store.hasPendingPrice(), true);

  store.clearCart();
  store.addToCart(priced, 1);
  assert.equal(store.cartSubtotal(), 10);
  assert.equal(store.hasPendingPrice(), false);

  assert.equal(store.toggleWishlist('priced'), true);
  assert.equal(store.isWishlisted('priced'), true);
  assert.deepEqual(JSON.parse(memory.get('aura_wishlist_v1')), ['priced']);
  store.removeFromWishlist('priced');
  assert.deepEqual(store.getWishlistIds(), []);
});

test('the browser store keeps invoice requests and newsletter preferences locally', async () => {
  const script = await readFile(new URL('../public/assets/cart.js', import.meta.url), 'utf8');
  const memory = new Map();
  const fakeWindow = {
    localStorage: {
      getItem: key => (memory.has(key) ? memory.get(key) : null),
      setItem: (key, value) => memory.set(key, String(value)),
      removeItem: key => memory.delete(key)
    },
    dispatchEvent: () => true
  };
  new Function('window', script)(fakeWindow);
  const store = fakeWindow.AuraStore;

  store.saveOrder({ reference: 'AURA-1', items: [], subtotal: null });
  assert.equal(store.getOrders().length, 1);
  assert.equal(store.getOrders()[0].reference, 'AURA-1');
  store.removeOrder('AURA-1');
  assert.equal(store.getOrders().length, 0);

  store.saveNewsletter('reader@example.com');
  assert.equal(store.getNewsletter().email, 'reader@example.com');
  store.removeNewsletter();
  assert.equal(store.getNewsletter(), null);
});

test('React cart and checkout never format a missing price as a number', async () => {
  for (const file of ['components/CartDrawer.tsx', 'components/Checkout.tsx']) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(source, /const hasPendingPrice = items\.some/);
    assert.match(source, /Number\.isFinite\(item\.product\.price\)/);
    assert.match(source, /Price pending/);
  }
  const commerce = await readFile(new URL('../services/commerce.ts', import.meta.url), 'utf8');
  assert.match(commerce, /function priceOf/);
  assert.match(commerce, /priceOf\(item\.product\.price\)/);
});

test('the React navbar reads the same site contract as the static header', async () => {
  const source = await readFile(new URL('../components/Navbar.tsx', import.meta.url), 'utf8');

  // One source of truth: the same JSON the static header renders.
  assert.match(source, /import siteData from '\.\.\/data\/site\.json';/);
  assert.match(source, /siteData\.nav/);
  assert.doesNotMatch(source, /SHOP_ROOMS/);
  assert.doesNotMatch(source, /from '\.\.\/constants'/);
  // No local menu array or hard-coded labels; a menu change is a data change.
  assert.doesNotMatch(source, /const (NAV_ITEMS|NAV|MENU|LINKS)\s*=\s*\[/);
  for (const label of ['Shop', 'Categories', 'Discover', 'Perennis', 'Journal', 'About']) {
    assert.doesNotMatch(source, new RegExp(`>\\s*${label}\\s*<`), `${label} is hard-coded rather than read from site.json`);
  }

  // Keyboard and focus behaviour, on the trigger and inside the panel.
  assert.match(source, /aria-expanded=\{open\}/);
  assert.match(source, /aria-controls=\{`nav-panel-\$\{item\.id\}`\}/);
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /event\.key === 'ArrowDown'/);
  assert.match(source, /ArrowUp/);
  assert.match(source, /focus-visible:outline/);
  // Escape closes the mobile overlay and returns focus to its toggle.
  assert.match(source, /toggleRef\.current\?\.focus\(\)/);

  // Cart and wishlist keep their callbacks and live counts.
  assert.match(source, /onOpenCart\(\)/);
  assert.match(source, /onOpenWishlist\(\)/);
  assert.match(source, /\{cartCount\}/);
  assert.match(source, /\{wishlistCount\}/);

  // Mobile parity: the overlay renders the same four sections and children.
  assert.match(source, /<details key=\{item\.id\}/);
  assert.equal((source.match(/NAV_ITEMS\.map/g) || []).length, 2, 'desktop and mobile should both map the one nav array');

  // Internal controls stay utilities, not customer navigation.
  assert.match(source, /aria-label="Team access"/);
  assert.match(source, /aria-label="Lineage and sources"/);

  // Palette only: no raw hex, no gradient fill.
  assert.doesNotMatch(source, /#[0-9a-fA-F]{6}/);
  assert.doesNotMatch(source, /bg-gradient|linearGradient/);
});
