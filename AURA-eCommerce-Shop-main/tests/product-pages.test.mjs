import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import {
  escapeHtml,
  validateProduct,
  productPath,
  variantLabel,
  renderDropshippingPage,
  renderAffiliatePage,
  renderCollection,
  renderCategoryPage,
  renderStaticPage,
  renderHomePage
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
  assert.match(css, /\.primary-nav \{[^}]*justify-content: center/);
  assert.match(css, /\.nav-panel \{[^}]*left: 50%/);
  assert.doesNotMatch(css, /\.category-nav/);
});

test('the header is one row at every width, with one search control', async () => {
  const css = await readFile(new URL('../public/assets/product-pages.css', import.meta.url), 'utf8');
  const chrome = await readFile(new URL('../templates/chrome.mjs', import.meta.url), 'utf8');
  const page = cartPage;

  // One row. The two-row header it replaced is gone rather than hidden.
  // (Media queries only adjust the row's height and gap; the rule itself is
  // written once, before the first breakpoint.)
  const base = css.split('@media')[0];
  assert.equal((base.match(/\.header-row \{/g) || []).length, 1);
  assert.match(base, /\.header-row \{[^}]*min-height: 72px/);
  assert.doesNotMatch(css, /\.header-top\s*\{|\.header-bottom\s*\{/, 'a retired header row is still styled');
  assert.equal((page.match(/<div class="header-row">/g) || []).length, 1);
  assert.doesNotMatch(page, /header-top|header-bottom/);

  // Utilities are icons with a count chip; the label survives for the screen
  // reader once the row is too narrow to carry it.
  assert.match(css, /\.utility-icon \{[^}]*display: inline-flex/);
  assert.match(css, /@media \(max-width: 1279px\) \{[\s\S]*?\.utility-label \{[^}]*clip: rect\(0, 0, 0, 0\)/);

  // Exactly one search control is visible at any width: the field above 1279,
  // the icon that links to /search/ below it.
  assert.match(css, /\.utility-search \{ display: none; \}/);
  assert.match(css, /@media \(max-width: 1279px\) \{[\s\S]*?\.site-search \{ display: none; \}[\s\S]*?\.utility-search \{ display: inline-flex; \}/);
  assert.match(page, /<form class="site-search" role="search" action="\/search\/" method="get">/);
  assert.match(page, /<a class="utility-link utility-search" href="\/search\/" aria-label="Search">/);

  // Below 761 the sections live in a `<details>` panel: no duplicated nav
  // markup, no JavaScript needed to open it, no `:has()`.
  assert.match(chrome, /<details class="nav-toggle">\s*<summary aria-label="Menu">/);
  assert.match(css, /@media \(max-width: 760px\) \{[\s\S]*?\.nav-toggle \{ display: block; \}/);
  assert.match(css, /\.nav-toggle\[open\] ~ \.primary-nav \{ display: flex; \}/);
  assert.doesNotMatch(css, /:has\(/);
  assert.equal((page.match(/aria-label="Primary navigation"/g) || []).length, 1, 'the nav is duplicated for mobile');

  // 320px still fits: the wordmark drops its text, not its accessible name.
  assert.match(css, /@media \(max-width: 359px\) \{[\s\S]*?\.wordmark-text \{[^}]*clip: rect\(0, 0, 0, 0\)/);
  assert.match(page, /<span class="wordmark-text">OPAR<\/span>/);
  assert.match(page, /aria-label="OPAR home"/);
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

test('every room appears once in the footer, from one source', async () => {
  const shopColumn = site.footer.columns.find(column => column.heading === 'Shop');
  assert.ok(shopColumn, 'the footer needs a Shop column');

  const roomPaths = collections.map(collection => `/shop/${collection.slug}/`);
  const shopHrefs = shopColumn.links.map(link => link.href);

  // Every room once, in collection order, with the partner hub closing the column.
  assert.deepEqual(
    shopHrefs.filter(href => href.startsWith('/shop/') && href !== '/shop/'),
    roomPaths
  );
  assert.equal(new Set(shopHrefs).size, shopHrefs.length, 'a footer link is listed twice');
  assert.equal(shopHrefs[shopHrefs.length - 1], '/discover/', 'partner offers close the column');

  // The rendered footer carries all six, whichever template drew it.
  for (const page of [shopPage, affiliatePage, checkoutPage, aloePage]) {
    const footer = page.slice(page.lastIndexOf('<footer'));
    for (const collection of collections) {
      assert.ok(
        footer.includes(`href="/shop/${collection.slug}/"`),
        `${collection.slug} is missing from the rendered footer`
      );
    }
  }

  // No third copy can drift back in. Since T4 there is no React footer to
  // check: the one shell in templates/chrome.mjs draws it, and the test above
  // asserts the shell reads site.json.
  const constants = await readFile(new URL('../constants.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(constants, /export const SHOP_ROOMS/, 'the room list must not be exported from constants.ts');
  const chrome = await readFile(new URL('../templates/chrome.mjs', import.meta.url), 'utf8');
  assert.match(chrome, /site\.footer|siteData\.footer|footer\.columns/, 'the shell must render the footer from site.json');
  assert.doesNotMatch(chrome, /SHOP_ROOMS|shop\/herbal-botanicals/, 'the shell must read the contract, not a room list');
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

/**
 * Every TypeScript file still in the app: the root entries, `components/` and
 * `services/`. After T4 that is the local admin panel and the code it needs,
 * none of which renders a customer page.
 */
async function typescriptSources() {
  const files = (await readdir(new URL('../', import.meta.url))).filter(name => /\.(ts|tsx)$/.test(name));
  for (const dir of ['components', 'services']) {
    for (const name of await readdir(new URL(`../${dir}/`, import.meta.url))) {
      if (/\.(ts|tsx)$/.test(name)) files.push(`${dir}/${name}`);
    }
  }
  return files;
}

/** Comments explain what is gone; assertions are about code. */
const withoutComments = source => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

test('there is one cart store, and it is the static one', async () => {
  const cart = await readFile(new URL('../public/assets/cart.js', import.meta.url), 'utf8');

  // The keys and the item shape every generated page reads.
  assert.ok(cart.includes("var CART_KEY = 'aura_cart_v1';"));
  assert.ok(cart.includes("var WISHLIST_KEY = 'aura_wishlist_v1';"));
  assert.ok(cart.includes("var ORDER_KEY = 'aura_order_requests_v1';"));
  assert.match(cart, /product: item\.product/);
  assert.match(cart, /quantity: clamp\(item\.quantity, 1, 99\)/);
  assert.match(cart, /selectedVariant: item\.selectedVariant/);
  assert.match(cart, /aura_wishlist_updated/);
  assert.doesNotMatch(cart, /fetch\(|XMLHttpRequest|stripe|paypal/i);

  // T4 retired the React shell, which used to keep a second cart in
  // services/commerce.ts. Nothing left in TypeScript may own the cart key:
  // two writers on one key is how a cart silently loses an item.
  for (const file of await typescriptSources()) {
    const code = withoutComments(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'));
    assert.doesNotMatch(code, /aura_cart_v1|CART_KEY/, `${file} still owns a cart`);
  }

  // The wishlist contract stayed with the panel's store service, which is the
  // one place that still writes it besides cart.js.
  const store = await readFile(new URL('../services/storeService.ts', import.meta.url), 'utf8');
  assert.match(store, /WISHLIST: 'aura_wishlist_v1'/);
  assert.match(store, /aura_wishlist_updated/);

  // And the admin panel is not a page: no build, no route, nothing in public/.
  assert.equal(existsSync(new URL('../public/admin.html', import.meta.url)), false);
  assert.equal(existsSync(new URL('../public/assets/admin.js', import.meta.url)), false);

  // The scripts agree: one build, no storefront dev server, one admin entry.
  const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.match(pkg.scripts.build, /build:templates[\s\S]*copy-site\.mjs/, 'the build is generate-then-copy');
  assert.match(pkg.scripts['build:templates'], /generate-product-pages\.mjs/);
  assert.doesNotMatch(pkg.scripts.build, /vite build/, 'the storefront is not bundled');
  assert.match(pkg.scripts['dev:admin'], /vite/);
  /* The dev entry point may be the Vite static server (what AI Studio boots)
     or the Node preview; the shipped pages are built by copy-site either way.
     What must never come back is a bundled storefront: `build` stays generate-
     then-copy, so no React is compiled into the pages customers receive. */
  assert.match(pkg.scripts.dev, /preview-products\.mjs|vite/, 'dev serves the static site');
  assert.equal(pkg.scripts.preview, undefined, 'vite preview would serve a bundle that is not built');
  assert.equal(pkg.scripts.predev, undefined);
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

test('the cart and the invoice form never format a missing price as a number', async () => {
  // Three pages show a price, and all three use the same guard. `Number(null)`
  // is 0, so a missing price has to be tested for rather than coerced.
  const sources = {};
  for (const file of ['cart.js', 'cart-page.js', 'checkout-page.js']) {
    sources[file] = await readFile(new URL(`../public/assets/${file}`, import.meta.url), 'utf8');
    assert.match(sources[file], /function priceOf\(value\)/, `${file} must own a price guard`);
    assert.match(sources[file], /return Number\.isFinite\(number\) \? number : NaN;/, `${file} must return NaN, not 0`);
    assert.doesNotMatch(sources[file], /Number\(\s*(item\.)?product\.price\s*\)/, `${file} coerces the price instead of testing it`);
  }

  // The store answers the question the pages ask.
  assert.match(sources['cart.js'], /return !Number\.isFinite\(priceOf\(item\.product\.price\)\);/);

  // Rendering: an unpriced piece is "Price on request", and the invoice line
  // says what happens next instead of inventing a total.
  assert.match(sources['cart-page.js'], /: 'Price on request';/);
  assert.match(sources['checkout-page.js'], /: 'Price on request';/);
  assert.match(sources['checkout-page.js'], /subtotal: window\.AuraStore\.hasPendingPrice\(\) \? null : window\.AuraStore\.cartSubtotal\(\)/);
  assert.match(sources['checkout-page.js'], /priceOnRequest: window\.AuraStore\.hasPendingPrice\(\)/);

  // No currency is printed for a price that does not exist.
  for (const file of ['cart-page.js', 'checkout-page.js']) {
    assert.match(sources[file], /var priced = Number\.isFinite\(price\);/);
  }
});

test('the homepage room index lists every room once, from the shop data', async () => {
  const source = await readFile(new URL('../templates/home-page.mjs', import.meta.url), 'utf8');

  // One data source: the same file the generator builds the room pages from.
  assert.match(source, /collections/);
  assert.equal((source.match(/collections\.map/g) || []).length, 1, 'the room list should be mapped once');
  assert.doesNotMatch(source, /collections\.(filter|slice|splice)/, 'every room should appear, exactly once');
  // The destination is built from the same slug that generates the page.
  assert.match(source, /href="\/shop\/\$\{escapeHtml\(room\.slug\)\}\/"/);

  const page = renderHomePage(products);
  assert.equal((page.match(/class="room-index__item"/g) || []).length, collections.length);
  const roomPositions = collections.map(collection => page.indexOf(`href="/shop/${collection.slug}/"`));
  assert.ok(roomPositions.every(position => position > 0), 'a room is missing from the index');
  assert.deepEqual([...roomPositions].sort((a, b) => a - b), roomPositions, 'the index should follow collections.json order');

  // The whole card is the link, and the number is decoration rather than text.
  assert.match(page, /<a class="room-index__item" href="\/shop\/[^"]+\/">/);
  assert.match(page, /<span class="room-index__number" aria-hidden="true">01<\/span>/);

  // No invented commerce language or figures.
  assert.doesNotMatch(page, /rating|customer review|bestsell|best-sell|in stock|sold out|%\s*off/i);

  // The index lists the same rooms, in the same order, as the Shop menu.
  const shopItem = site.nav.find(item => item.id === 'shop');
  const navRoomPaths = shopItem.children.filter(child => child.group === 'Rooms').map(child => child.href);
  const roomPaths = collections.map(collection => `/shop/${collection.slug}/`);
  assert.deepEqual(roomPaths, navRoomPaths, 'the room index and the Shop menu should agree');
  assert.equal(new Set(roomPaths).size, roomPaths.length, 'two rooms share a destination');
});

/* The React navbar test is gone with Navbar.tsx: the generated header and the
   Shop menu both read data/site.json, and the contract test above already
   asserts that every room appears in the footer, the nav and collections.json
   in the same order. Re-asserting it against a retired component would only
   have kept the file alive. */

/* ── T3: the homepage, generated at / ──────────────────────────────────────── */

const homePage = renderHomePage(products);

test('the homepage is one static document, and its sections read in order', () => {
  assert.equal((homePage.match(/<h1/g) || []).length, 1, 'the homepage has exactly one h1');
  assert.match(homePage, /<h1 id="home-heading" class="home-hero__title">A world of<br><em><span class="gold">conscious<\/span> living\.<\/em><\/h1>/);

  // Hero, shelf, rooms, monograph (ending on the Journal plate), letter - in
  // that order. The letter is the last band before the footer (D-041).
  const order = ['class="home-hero"', 'id="featured"', 'id="rooms"', 'id="botanicals"', 'archipelago-block--journal', 'id="letter"'].map(marker => homePage.indexOf(marker));
  assert.ok(order.every(index => index > 0), 'a section is missing');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'the sections are out of order');

  // The neem belongs to the Materia Medica header now, not the Rooms band.
  const neem = homePage.indexOf('corner-foliage--neem-tl');
  assert.ok(neem > homePage.indexOf('id="botanicals"'), 'the neem is outside the monograph');
  assert.ok(neem < homePage.indexOf('class="botanical-monograph__header"'), 'the neem should sit above the header content');
  assert.doesNotMatch(homePage, /corner-foliage--neem-br/);

  // The letter is the same form contract as /newsletter/, loaded once, and it
  // stays quiet at rest so the band does not open on a status message.
  assert.equal((homePage.match(/<script src="\/assets\/newsletter-page\.js" defer><\/script>/g) || []).length, 1, 'the newsletter script should load once');
  assert.match(homePage, /<form class="newsletter-form" data-newsletter-form data-newsletter-quiet>/);
  assert.match(homePage, /<section id="letter" class="home-section home-letter" aria-labelledby="letter-heading">/);

  // Three pieces on the front shelf, not the whole catalogue: a fourth column
  // left a hole in the row. Every card must still resolve to a listed piece.
  assert.equal((homePage.match(/class="feature-card"/g) || []).length, 3, 'the front shelf holds three pieces');
  const listedPaths = new Set(products.map(product => `/${product.model === 'affiliate' ? 'discover' : 'shop'}/${product.slug}/`));
  for (const [, href] of homePage.matchAll(/class="feature-card__mount" href="([^"]+)"/g)) {
    assert.ok(listedPaths.has(href), `${href} is not a listed piece`);
  }

  // The standfirst counts the shelf and the catalogue, so neither can drift.
  const shelf = (homePage.match(/class="feature-card"/g) || []).length;
  assert.ok(homePage.includes(
    `${shelf} pieces on the front shelf, from ${products.length} listed.`
  ), 'the standfirst must agree with the shelf and the catalogue');

  // Each card states the piece: one factual line, one format, then the price.
  // The shop-state badge that used to sit here is gone (D-040).
  assert.equal((homePage.match(/class="feature-card__line"/g) || []).length, shelf);
  assert.equal((homePage.match(/class="feature-card__format"/g) || []).length, shelf);
  assert.doesNotMatch(homePage, /feature-card__meta|Preview &middot; ordering not open|referral pending/);
  const productByPath = new Map(products.map(product => [
    `/${product.model === 'affiliate' ? 'discover' : 'shop'}/${product.slug}/`,
    product
  ]));
  for (const [, href] of homePage.matchAll(/<h3><a href="([^"]+)">/g)) {
    const product = productByPath.get(href);
    if (!product) continue;
    if (product.cardLine) assert.ok(homePage.includes(escapeHtml(product.cardLine)), `${product.slug} is missing its card line`);
    if (product.format) assert.ok(homePage.includes(escapeHtml(product.format)), `${product.slug} is missing its format`);
  }

  // A room circle renders only when collections.json carries an image, so the
  // text-only row is the current truth until the six photographs arrive.
  assert.equal(
    (homePage.match(/class="room-index__figure"/g) || []).length,
    collections.filter(room => room.image).length,
    'a circle without an image would be an empty disc'
  );

  // No price is invented, and nothing is billed as sold.
  for (const product of products.filter(item => !Number.isFinite(item.price))) {
    assert.ok(homePage.includes('Price on request'), 'a price-less piece must say price on request');
  }
  assert.doesNotMatch(homePage, /[£$]\s?\d|customer review|best ?sell|in stock|% off/i);

  // Static: no hydration, no React, no Tailwind utilities carried over.
  assert.doesNotMatch(homePage, /id="root"|index\.tsx|type="module"|<script type="module"/);
  assert.doesNotMatch(homePage, /class="[^"]*\b[a-z-]+:(hover|focus|md|lg|sm|group-hover)/);
  assert.doesNotMatch(homePage, /aria-current="page"/, 'the homepage is not a section');
});

test('the hero is preloaded on the homepage and nowhere else', () => {
  assert.match(homePage, /<link rel="preload" as="image" href="\/assets\/brand\/hero-opar\.avif" type="image\/avif" fetchpriority="high">/);
  assert.ok(homePage.indexOf('rel="preload"') < homePage.indexOf('rel="stylesheet" href="/assets/product-pages.css"'),
    'the preload must be discovered before the stylesheet');
  // The modern sources, tried in order; a browser that supports neither falls
  // through to the JPG.
  assert.match(homePage, /<source type="image\/avif" srcset="\/assets\/brand\/hero-opar\.avif">/);
  assert.match(homePage, /<source type="image\/webp" srcset="\/assets\/brand\/hero-opar\.webp">/);
  // Explicit dimensions, so the photograph cannot shift the layout when it lands.
  assert.match(homePage, /<img src="\/assets\/brand\/hero-opar\.jpg" alt="" width="1920" height="1080" fetchpriority="high" decoding="async">/);
  for (const page of [shopPage, affiliatePage, checkoutPage, cartPage, newsletterPage]) {
    assert.doesNotMatch(page, /rel="preload"/, 'only the homepage preloads an image');
  }
});

test('every image the homepage references is a real file', () => {
  const sources = [
    ...homePage.matchAll(/<img src="(\/assets\/[^"]+)"/g),
    ...homePage.matchAll(/srcset="(\/assets\/[^"]+)"/g)
  ].map(match => match[1]);
  // A piece with no photograph gets an empty mount, never a placeholder graphic:
  // the grey "photography pending" tile read as a broken shop.
  assert.doesNotMatch(homePage, /photography-pending\.svg|cleansing-pads-placeholder\.svg/);
  assert.ok(sources.length >= 1, 'the hero photograph');
  for (const source of sources) {
    assert.ok(existsSync(new URL(`../public${source}`, import.meta.url)), `${source} is referenced but missing`);
  }
});

test('every section background the homepage CSS references is a real file', () => {
  const css = readFileSync(new URL('../public/assets/product-pages.css', import.meta.url), 'utf8');
  const urls = [...css.matchAll(/url\("(\/assets\/[^"]+)"\)/g)].map(match => match[1]);
  // bg-featured and bg-rooms each appear three times (avif, webp, jpg fallback).
  assert.ok(urls.length >= 6, 'both section backgrounds carry a modern pair and a fallback');
  for (const url of urls) {
    assert.ok(existsSync(new URL(`../public${url}`, import.meta.url)), `${url} is referenced in CSS but missing`);
  }
});

test('the journal plate is the second movement of the archipelago', () => {
  const journal = site.nav.find(item => item.id === 'journal');
  const columns = journal.children.filter(child => child.href !== journal.href);

  // It follows the monograph's last plate, on the same ground, and it is the
  // frame the writing will be filed under - not a set of invented articles.
  const start = homePage.indexOf('class="archipelago-block');
  // Prefix only: the reversed plate carries a second class after it.
  assert.ok(homePage.indexOf('class="journal-plate"') > homePage.lastIndexOf('class="editorial-spread'),
    'the journal plate must close the monograph');
  assert.ok(homePage.slice(start, homePage.indexOf('</main>')).includes('class="journal-plate"'),
    'the journal plate must sit on the archipelago ground');

  const indexStart = homePage.indexOf('class="journal-index"');
  const index = homePage.slice(indexStart, homePage.indexOf('</ul>', indexStart));
  assert.equal((index.match(/class="journal-index__column"/g) || []).length, columns.length,
    'one column per journal category');
  for (const column of columns) {
    assert.ok(index.includes(`href="${column.href}"`), `${column.href} is not in the index`);
    assert.ok(existsSync(new URL(`../public${column.href}index.html`, import.meta.url)),
      `${column.href} has no generated page`);
    const page = sitePages.find(item => item.path === column.href);
    assert.ok(page, `${column.href} has no page record`);
    // The line is the page's own meta description, escaped for the document.
    assert.ok(index.includes(escapeHtml(page.description)),
      `${column.href} must carry its own description`);
  }

  // One way into the listing itself, and no article furniture before articles exist.
  assert.ok(homePage.includes(`<a class="journal-plate__all" href="${journal.href}">All writing`),
    'the journal root needs one link');
  assert.doesNotMatch(index, /class="(journal-entry|article-card|post-card)/,
    'the frame must not invent articles');
});

test('the homepage is `/`, generated, and listed once', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  for (const marker of ['class="home-hero"', 'id="featured"', 'id="rooms"']) {
    assert.ok(html.includes(marker), `${marker} is not in the generated file`);
  }
  // The launch switch still holds: noindex until a domain and absolute URLs exist.
  assert.match(html, /<meta name="robots" content="noindex, follow">/);
  // And it is a generated document, not the React shell it replaced.
  assert.doesNotMatch(html, /id="root"|assets\/index-[A-Za-z0-9_-]+\.js/);

  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.equal((sitemap.match(/<loc>\/<\/loc>/g) || []).length, 1, 'the homepage is in the sitemap exactly once');
  assert.ok(sitemap.indexOf('<loc>/</loc>') < sitemap.indexOf('<loc>/shop/'), 'the homepage opens the sitemap');
  assert.doesNotMatch(sitemap, /home-preview/, 'the T3 trial route is gone');

  const searchIndex = await readFile(new URL('../public/assets/search-index.json', import.meta.url), 'utf8');
  const entries = JSON.parse(searchIndex);
  assert.equal(entries.filter(entry => entry.href === '/').length, 1, 'search offers the homepage once');
  assert.ok(!searchIndex.includes('home-preview'));

  for (const page of [shopPage, affiliatePage, aloePage, checkoutPage, cartPage, newsletterPage]) {
    assert.doesNotMatch(page, /home-preview/, 'nothing may still link to the trial route');
  }

  // The trial route and its directory are gone, not merely unlinked.
  assert.equal(existsSync(new URL('../public/home-preview', import.meta.url)), false);

  // The generator builds `/` first and resolves links to it like any other page.
  const generator = await readFile(new URL('../scripts/generate-product-pages.mjs', import.meta.url), 'utf8');
  assert.match(generator, /const pages = \[\s*\{ path: '\/', html: renderHomePage\(products\) \},/);
  assert.doesNotMatch(generator, /if \(href === '\/' \|\| /, 'the link validator must not skip `/` any more');
});

test('the hero grain and scrims have one value across both stylesheets', async () => {
  const block = (css, selector) => {
    const match = css.match(new RegExp(`\\n${selector.replace(/\./g, '\\.')} \\{([\\s\\S]*?)\\n\\}`));
    assert.ok(match, `${selector} is missing`);
    return match[1];
  };
  const background = css => {
    const match = css.match(/background-image:\s*([\s\S]*?);/);
    assert.ok(match, 'no background-image');
    return match[1].replace(/\s+/g, ' ').trim();
  };

  const canonical = await readFile(new URL('../public/assets/product-pages.css', import.meta.url), 'utf8');
  const legacy = await readFile(new URL('../index.css', import.meta.url), 'utf8');
  for (const selector of ['.grain', '.hero-scrim-top', '.hero-scrim-base']) {
    assert.equal(
      background(block(canonical, selector)),
      background(block(legacy, selector)),
      `${selector} differs between the generated pages and the React shell`
    );
  }
});
