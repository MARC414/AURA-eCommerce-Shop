import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { escapeHtml, validateProduct, productPath, variantLabel, renderDropshippingPage, renderAffiliatePage, renderCollection, renderPreviewIndex } from '../templates/product-pages.mjs';

const products = JSON.parse(await readFile(new URL('../data/pilot-products.json', import.meta.url), 'utf8'));
const register = JSON.parse(await readFile(new URL('../data/compliance.json', import.meta.url), 'utf8'));
const complianceFor = product => register.records.find(record => record.productId === product.id) || null;
const shopProduct = products.find(product => product.model === 'dropshipping');
const affiliateProduct = products.find(product => product.model === 'affiliate');
const aloeProduct = products.find(product => product.slug === 'aloe-vera-soap');
const shopPage = renderDropshippingPage(shopProduct, products, complianceFor(shopProduct));
const affiliatePage = renderAffiliatePage(affiliateProduct, products, complianceFor(affiliateProduct));
const aloePage = renderDropshippingPage(aloeProduct, products, complianceFor(aloeProduct));
const clone = product => structuredClone(product);

test('the pilot contains exactly the three products supplied by the owner', () => {
  assert.equal(products.length, 3);
  assert.equal(shopProduct.sourceProductId, '1005007532901889');
  assert.equal(affiliateProduct.sourceProductId, '2114448810729783298');
  assert.equal(aloeProduct.sourceProductId, '1005008143754192');
  products.forEach(product => assert.doesNotThrow(() => validateProduct(product)));
});

test('every pilot product has a compliance record', () => {
  products.forEach(product => {
    const record = complianceFor(product);
    assert.ok(record, `${product.id} has no compliance record`);
    assert.ok(record.items.length > 0);
    assert.ok(record.blockedClaims.length > 0);
    record.items.forEach(item => {
      assert.ok(['verified', 'pending', 'not-provided', 'not-applicable'].includes(item.status));
    });
  });
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
  assert.match(aloePage, /Claims we will not make/);
  assert.match(aloePage, /no treatment, prevention, or skin-tone claim/);
  assert.doesNotMatch(aloePage, /Anti Acne/);
});

test('the aloe page records real supplier facts without inventing a price', () => {
  assert.match(aloePage, /100 g \/ 3\.5 oz/);
  assert.match(aloePage, /12 months/);
  assert.match(aloePage, /36 months/);
  assert.match(aloePage, /12000043973353662-WK-aloe-vera-soapX1/);
  assert.match(aloePage, /GAVIMOSA CONSULTORIA/);
  assert.match(aloePage, /Price being prepared/);
  assert.doesNotMatch(aloePage, /£28\.30|£20\.73|save £/i);
});

test('the aloe variants render with pending prices rather than fake amounts', () => {
  assert.match(aloePage, /Pack of 1 — price pending/);
  assert.match(aloePage, /Pack of 3 — price pending/);
  assert.match(aloePage, /Pack of 5 — price pending/);
  assert.equal(variantLabel('Plain label'), 'Plain label');
  assert.throws(() => variantLabel({ sku: 'x' }), /needs a label/);
});

test('compliance statuses are shown honestly and never upgraded', () => {
  assert.match(aloePage, /status-not-provided/);
  assert.match(aloePage, /Not provided/);
  assert.match(aloePage, /0 verified/);
  assert.doesNotMatch(aloePage, /status-verified/);
});

test('both products have individual, model-specific routes', () => {
  assert.equal(productPath(shopProduct), '/shop/turmeric-cleansing-soap/');
  assert.equal(productPath(affiliateProduct), '/discover/turmeric-cleansing-pads/');
});

test('the dropshipping action is explicitly disabled and never creates an order', () => {
  assert.match(shopPage, /<button[^>]+disabled[^>]*>Coming soon/);
  assert.match(shopPage, /Ordering closed/);
  assert.doesNotMatch(shopPage, /<form\b|\/checkout|onAddToCart|paymentIntent|stripe|paypal/i);
  assert.doesNotMatch(shopPage, /data-product-model="affiliate"/);
});

test('the affiliate action preserves the exact referral token and opens externally', () => {
  const action = affiliatePage.match(/<a class="button button-primary external-cta"[^>]+>/)?.[0];
  assert.ok(action);
  assert.ok(action.includes(`href="${escapeHtml(affiliateProduct.externalUrl)}"`));
  assert.match(action, /target="_blank"/);
  assert.match(action, /rel="sponsored noopener noreferrer"/);
  assert.match(action, /aria-describedby="offer-disclosure"/);
  assert.match(affiliatePage, /Commission eligibility has not yet been verified/);
});

test('affiliate pages never contain AURA purchase or quantity controls', () => {
  assert.doesNotMatch(affiliatePage, /data-quantity-change|data-variant|button-closed|<form\b|\/checkout/);
  assert.match(affiliatePage, /Not sold by AURA/);
  assert.match(affiliatePage, /No AURA cart or checkout/);
});

test('missing prices are shown as pending, not fabricated zero-price offers', () => {
  assert.match(shopPage, /Price being prepared/);
  assert.match(affiliatePage, /Check the current price on CJ/);
  for (const page of [shopPage, affiliatePage]) {
    assert.doesNotMatch(page, /\$0\b|schema.org\/InStock|"price"|Limited Run|Verified Buyer|\d+ Reviews/);
  }
});

test('the template can render a clearly labelled supplied preview price', () => {
  const product = { ...clone(shopProduct), price: 12.5, currency: 'GBP' };
  assert.match(renderDropshippingPage(product), /£12\.50/);
  assert.match(renderDropshippingPage(product), /not a live offer/);
  assert.match(renderDropshippingPage(product), /disabled[^>]*>Coming soon/);
});

test('unknown supplier variants are disabled rather than invented', () => {
  assert.match(shopPage, /<select id="product-variant" data-variant disabled>/);
  assert.match(shopPage, /Options awaiting confirmation/);
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
  for (const page of [shopPage, affiliatePage]) {
    assert.match(page, /role="group" aria-label="Product gallery"/);
    assert.equal((page.match(/data-gallery-src=/g) || []).length, 2);
    assert.match(page, /aria-pressed="true"/);
    assert.match(page, /width="1000" height="1000"/);
    assert.match(page, /data-fallback="\/assets\/products\/photography-pending.svg"/);
    assert.match(page, /<p class="image-caption" data-gallery-caption aria-live="polite">/);
  }
});

test('static HTML contains meaningful content and unique metadata before JavaScript', () => {
  for (const [page, product] of [[shopPage, shopProduct], [affiliatePage, affiliateProduct]]) {
    assert.equal((page.match(/<h1>/g) || []).length, 1);
    assert.match(page, /<meta name="robots" content="noindex, follow">/);
    assert.match(page, /<meta name="description"/);
    assert.ok(page.includes(`<h1>${product.name}</h1>`));
    assert.ok(page.includes(escapeHtml(product.description)));
    assert.doesNotMatch(page, /react|tailwindcss.com|type="module"|<div id="root"/i);
  }
  assert.notEqual(shopPage.match(/<title>(.*?)<\/title>/)?.[1], affiliatePage.match(/<title>(.*?)<\/title>/)?.[1]);
});

test('collection pages keep the selected product models separate', () => {
  const shop = renderCollection('dropshipping', products);
  const discover = renderCollection('affiliate', products);
  assert.ok(shop.includes(shopProduct.name));
  assert.ok(!shop.includes(affiliateProduct.name));
  assert.ok(discover.includes(affiliateProduct.name));
  assert.ok(!discover.includes(shopProduct.name));
});

test('the preview index links to both individual pages and collections', () => {
  const page = renderPreviewIndex(products);
  assert.ok(page.includes(productPath(shopProduct)));
  assert.ok(page.includes(productPath(affiliateProduct)));
  assert.match(page, /Browse the shop preview/);
  assert.match(page, /Browse external offers/);
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

test('enhancement script contains no network, payment, order, or customer-data persistence', async () => {
  const script = await readFile(new URL('../public/assets/product-pages.js', import.meta.url), 'utf8');
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|createOrder|onAddToCart|\.submit\(/);
  assert.match(script, /Math\.max\(1, Math\.min\(10/);
  assert.match(script, /Ordering remains closed/);
  assert.match(script, /querySelector\('p\[data-gallery-caption\]'\)/);
  assert.doesNotMatch(script, /querySelector\('\[data-gallery-caption\]'\)/);
});

test('product pages emit canonical, JSON-LD, and no fake offers', () => {
  assert.match(shopPage, /<link rel="canonical" href="\/shop\/turmeric-cleansing-soap\/">/);
  assert.match(shopPage, /application\/ld\+json/);
  assert.match(shopPage, /"@type":"Product"/);
  assert.match(shopPage, /"@type":"BreadcrumbList"/);
  // No price => no Offer block (Google penalises fake offers)
  assert.doesNotMatch(shopPage, /"@type":"Offer"/);
  assert.match(affiliatePage, /rel="sponsored noopener noreferrer"/);
  assert.match(shopPage, /property="og:image"/);
  // Blocked claims appear only in the "Claims we will not make" panel, never as AURA copy.
  const head = shopPage.split('</head>')[0];
  assert.doesNotMatch(head, /anti-acne|brighten|whitening|melanin|oil control/i);
});

test('styles include visible focus, responsive layouts, and reduced-motion support', async () => {
  const css = await readFile(new URL('../public/assets/product-pages.css', import.meta.url), 'utf8');
  assert.match(css, /:focus-visible/);
  assert.match(css, /max-width: 760px/);
  assert.match(css, /max-width: 480px/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
