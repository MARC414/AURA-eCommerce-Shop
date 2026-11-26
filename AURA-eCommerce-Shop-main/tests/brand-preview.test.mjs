import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { documentPage, brand } from '../templates/chrome.mjs';
import { MODELS, productPath, renderCollection, renderCategoryPage, renderAffiliatePage, renderDropshippingPage, renderStaticPage, renderHomePage, renderNotFoundPage } from '../templates/product-pages.mjs';

const data = name => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), 'utf8'));
const products = data('pilot-products');
const pages = data('pages');
const sha = text => createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
const fixture = JSON.parse(readFileSync(new URL('./fixtures/homepage-freeze.json', import.meta.url), 'utf8'));
const identity = {
  assetPathOnDark: '/assets/brand/web/opar-mark-ivory.svg',
  assetPathOnLight: '/assets/brand/web/opar-mark-green.svg',
  icons: [
    { rel: 'icon', href: '/assets/OPAR-brand-assets/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/OPAR-brand-assets/favicon-32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/OPAR-brand-assets/favicon-180.png' }
  ]
};
const options = { theme: 'theme-paper', identity, stylesheets: ['/assets/brand-preview.css'], bodyClass: 'brand-preview-document' };
const referenceOptions = { ...options, bodyClass: 'brand-preview-document opar-reference-document', stylesheets: [...options.stylesheets, '/assets/opar-template-preview.css'] };
const defaultFixture = JSON.parse(readFileSync(new URL('./fixtures/reference-defaults.json', import.meta.url), 'utf8'));

test('promoted customer output keeps route parity, preserves frozen shared CSS, and leaks no preview scaffolding', () => {
  const docs = [
    ['/', renderHomePage(products)],
    ...products.map(p => [productPath(p), p.model === 'affiliate' ? renderAffiliatePage(p, products) : renderDropshippingPage(p, products)]),
    ...Object.entries(MODELS).map(([model, definition]) => [definition.path, renderCollection(model, products)]),
    ...data('collections').map(c => [`/shop/${c.slug}/`, renderCategoryPage(c, products)]),
    ...pages.map(p => [p.path, renderStaticPage(p)]),
    ['/404.html', renderNotFoundPage()]
  ];
  assert.equal(docs.length, defaultFixture.routes);
  for (const [path, html] of docs) {
    assert.ok(!html.includes('brand-preview-document'), `${path} must stay isolated from brand-preview specimens`);
    assert.ok(!html.includes('/v2/'), `${path} must not emit retired /v2/ links`);
    assert.ok(!html.includes('v2-threshold'), `${path} must not emit retired /v2/ threshold bar`);
  }
  assert.equal(sha(readFileSync(new URL('../public/assets/product-pages.css', import.meta.url), 'utf8')), defaultFixture.sharedCSS);
});

test('reference shell uses a full lockup only for explicitly selected identity', () => {
  const html = documentPage({ title: 'Lockup', description: 'Review', content: '<h1>Lockup</h1>', ...referenceOptions, identity: { ...identity, headerLockupOnLight: '/assets/brand/web/opar-lockup-green.svg' } });
  assert.ok(html.includes('class="wordmark-lockup"'), 'reference header needs full lockup');
  assert.ok(html.includes('src="/assets/brand/web/opar-lockup-green.svg"'));
  assert.ok(!html.includes('class="wordmark-text"'), 'lockup must not duplicate the wordmark');
  assert.ok(html.includes('data-cart-count') && html.includes('Primary navigation'));
});

test('reference hero replaces only the Shop photograph and reading headings', () => {
  const shop = renderCollection('dropshipping', products, { ...referenceOptions, referenceLayout: 'paper-hero' });
  assert.ok(shop.includes('reference-hero--paper'), 'Shop must use the reference Paper composition');
  assert.ok(!shop.includes('hero-shop.avif'));
  assert.ok(shop.includes('data-shop-form') && shop.includes('href="#shop-reference-results"'));
  for (const path of ['/perennis/', '/journal/plants-and-practice/']) {
    const page = pages.find(p => p.path === path);
    const html = renderStaticPage(page, { ...referenceOptions, theme: null, referenceLayout: 'dark-hero' });
    assert.ok(html.includes('reference-hero--moss'), `${path} needs the dark composition`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(page.blocks[0].heading));
  }
  assert.throws(() => renderCollection('dropshipping', products, { referenceLayout: 'dark-hero' }), /Unsupported reference/);
  assert.throws(() => renderStaticPage(pages.find(p => p.path === '/checkout/'), { referenceLayout: 'dark-hero' }), /Unsupported reference/);
});

test('reference hero escapes real copy and action labels', async () => {
  let helper;
  try { helper = await import('../templates/reference-layouts.mjs'); }
  catch (error) { if (error.code === 'ERR_MODULE_NOT_FOUND') assert.fail('reference hero helper is missing'); throw error; }
  const html = helper.renderReferenceHero({ surface: 'paper', eyebrow: '<unsafe>', heading: 'A & B', intro: 'Plain', action: { href: '/shop/', label: '<browse>' } });
  assert.ok(html.includes('A &amp; B') && html.includes('&lt;browse&gt;'));
  assert.ok(!html.includes('<unsafe>'));
  assert.throws(() => helper.renderReferenceHero({ surface: 'bad' }), /Unsupported/);
});

test('reference category uses the Paper opener while preserving empty-room recovery', () => {
  const room = data('collections').find(c => c.slug === 'everyday-care');
  const html = renderCategoryPage(room, products, { ...referenceOptions, referenceLayout: 'paper-hero' });
  assert.ok(html.includes('reference-hero--paper'), 'category needs the Paper opener');
  assert.ok(html.includes('reference-card-grid'));
  assert.ok(html.includes('/shop/aloe-vera-soap/'));
  const empty = renderCategoryPage(room, [], { ...referenceOptions, referenceLayout: 'paper-hero' });
  assert.ok(empty.includes('Pieces are being selected for this room.') && empty.includes('href="/shop/"'));
  assert.throws(() => renderCategoryPage(room, products, { referenceLayout: 'dark-hero' }), /Unsupported reference/);
});

test('reference cards preserve merchant disclosures and real category links', () => {
  const html = renderCollection('affiliate', products, { ...referenceOptions, referenceLayout: 'paper-grid' });
  assert.ok(html.includes('reference-card-grid'), 'Discover needs the reference grid');
  assert.ok(html.includes('linked merchant’s website') && html.includes('data-model="affiliate"'));
  assert.ok(html.includes('aria-label="Browse rooms"'));
});

test('reference product preserves the actual gallery, pending prices and invoice disclosures inside mixed panes', () => {
  const p = products.find(p => p.slug === 'aloe-vera-soap');
  const html = renderDropshippingPage(p, products, { ...referenceOptions, referenceLayout: 'featured-product' });
  assert.ok(html.includes('reference-product__visual') && html.includes('reference-product__details'), 'PDP needs separate Paper/Moss panes');
  assert.ok(html.includes('data-variant') && html.includes('data-wishlist-toggle'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(!html.includes('opar-mark-ground.png'));
  assert.ok(html.includes('Construction sample pricing') && html.includes('written invoice'));
  const pending = renderDropshippingPage({ ...p, price: null, variants: [], samplePricing: false }, products, { ...referenceOptions, referenceLayout: 'featured-product' });
  assert.ok(pending.includes('data-product-price=""'), 'pending prices must not turn into zero');
  assert.ok(pending.includes('Price on request'));
  assert.throws(() => renderDropshippingPage(p, products, { referenceLayout: 'paper-hero' }), /Unsupported reference/);
});

test('reference product affiliate variant never inherits Shop buying controls', () => {
  const p = products.find(p => p.model === 'affiliate');
  const html = renderAffiliatePage(p, products, { ...referenceOptions, referenceLayout: 'featured-product' });
  assert.ok(html.includes('reference-product__details'));
  assert.ok(html.includes(p.externalUrl));
  assert.ok(!html.includes('data-add-to-cart') && !html.includes('data-quantity'));
});

test('reference newsletter uses one real local-only form in the dark composition', () => {
  const p = pages.find(p => p.path === '/newsletter/');
  const html = renderStaticPage(p, { ...referenceOptions, theme: null, referenceLayout: 'newsletter' });
  assert.ok(html.includes('reference-newsletter'), 'newsletter needs source 05 composition');
  assert.equal((html.match(/data-newsletter-form/g) || []).length, 1);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('type="email"') && html.includes('for="newsletter-email"'));
  assert.ok(html.includes('data-newsletter-status') && html.includes('data-newsletter-remove'));
  assert.ok(html.includes('Nothing is sent to a server') && html.includes('The mailing service is not connected yet'));
  assert.throws(() => renderStaticPage(pages[0], { referenceLayout: 'newsletter' }), /Unsupported reference/);
});

test('the promoted root homepage renders the Herbarium & Apothecary atlas with zero /v2/ references', () => {
  const html = renderHomePage(products);
  assert.match(html, /class="v2-doc"/);
  assert.match(html, /class="v2-hero-index"/);
  assert.match(html, /class="v2-specimen-plate"/);
  assert.match(html, /Nigella sativa/);
  assert.match(html, /Withania somnifera/);
  assert.match(html, /Curcuma longa/);
  assert.doesNotMatch(html, /\/v2\/|v2-threshold/);
});

test('preview document settings change only the explicitly requested identity and styles', () => {
  const originalBrand = JSON.stringify(brand);
  const html = documentPage({ title: 'Identity specimen', description: 'Review only', content: '<h1>Identity specimen</h1>', ...options });
  assert.ok(html.includes('<body class="theme-paper brand-preview-document">'), 'explicit preview body classes are missing');
  assert.match(html, /src="\/assets\/brand\/web\/opar-mark-green\.svg"/);
  assert.match(html, /sizes="180x180"/);
  assert.match(html, /href="\/assets\/brand-preview\.css"/);
  assert.equal(JSON.stringify(brand), originalBrand, 'preview identity must not mutate live brand data');
  const ordinary = documentPage({ title: 'Ordinary', description: 'Default', content: '<h1>Ordinary</h1>' });
  assert.doesNotMatch(ordinary, /brand-preview-document|brand-preview\.css|brand\/web\/opar-mark/);
});

test('preview options reach real collection, product and static-page shells without changing defaults', () => {
  const product = products.find(item => item.slug === 'aloe-vera-soap');
  const perennis = pages.find(page => page.path === '/perennis/');
  const renders = [
    [() => renderCollection('dropshipping', products, options), 'theme-paper'],
    [() => renderDropshippingPage(product, products, options), 'theme-paper'],
    [() => renderStaticPage(perennis, { ...options, theme: null }), 'brand-preview-document']
  ];
  for (const [render, theme] of renders) {
    const html = render();
    assert.ok(new RegExp(`<body class="[^"]*${theme}`).test(html), 'requested specimen theme was not passed to the shell');
    assert.match(html, /brand-preview\.css/);
    assert.match(html, /brand\/web\/opar-mark-(?:green|ivory)\.svg/);
  }
  assert.doesNotMatch(renderCollection('dropshipping', products), /brand-preview-document/);
  assert.doesNotMatch(renderDropshippingPage(product, products), /brand-preview-document/);
  assert.match(renderStaticPage(perennis), /<body class="v2-doc">/, 'retain Moss default for Perennis');
});

test('Paper preview browser tint matches the reconciled non-homepage Paper metadata', () => {
  const html = documentPage({ title: 'Paper sample', description: 'Review', content: '<h1>Sample</h1>', ...options });
  assert.ok(html.includes('<meta name="theme-color" content="#F4F2EE">'), 'Paper preview still advertises the dark browser tint');
  const ordinary = documentPage({ title: 'Ordinary', description: 'Default', content: '<h1>Ordinary</h1>', theme: 'theme-paper' });
  assert.ok(ordinary.includes('<meta name="theme-color" content="#F4F2EE">'), 'retain the remote Paper metadata while freezing homepage separately');
});

test('the preview hero overline uses the dark island text role rather than CTA olive', () => {
  const css = readFileSync(new URL('../public/assets/brand-preview.css', import.meta.url), 'utf8');
  assert.ok(/\.brand-preview-document \.shop-hero \.home-overline\s*\{[^}]*color:\s*var\(--body\)/.test(css), 'hero overline needs an explicit readable text role');
});

const previewModule = async () => {
  try {
    return await import('../templates/brand-preview.mjs');
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') assert.fail('The tested brand-preview renderer has not been implemented yet');
    throw error;
  }
};

test('outlined EPS exports a self-contained path with the correct coordinate flip', async () => {
  const { epsOutlineToSvg } = await previewModule();
  const svg = epsOutlineToSvg('%!PS-Adobe-3.0\n%%BoundingBox: 0 0 10 10\nnewpath\n0 0 moveto 10 0 lineto 0 10 lineto closepath\neofill\nshowpage', '#2F332B');
  assert.ok(svg.includes('viewBox="0 0 10 10"'));
  assert.ok(svg.includes('translate(0 10) scale(1 -1)'));
  assert.ok(svg.includes('d="M 0 0 L 10 0 L 0 10 Z"'));
  assert.ok(svg.includes('fill="#2F332B"'));
  assert.ok(svg.includes('fill-rule="evenodd"'));
  assert.doesNotMatch(svg, /<image\b|href=|data:image/);
  assert.throws(() => epsOutlineToSvg('%%BoundingBox: 0 0 10 10\nnewpath\n0 0 1 1 2 2 curveto\neofill', '#2F332B'), /Unsupported|operator/);
  assert.throws(() => epsOutlineToSvg('%%BoundingBox: 0 0 0 10\nnewpath\n0 0 moveto\neofill', '#2F332B'), /Bounding|bounds/);
});

test('eight noindex specimens use real production controls and stay isolated from the live route map', async () => {
  const { renderBrandPreviewDocuments } = await previewModule();
  const { documents, section } = renderBrandPreviewDocuments(products, pages);
  assert.deepEqual(documents.map(doc => doc.file), [
    'shop-paper.html', 'pdp-paper.html', 'discover-paper.html', 'checkout-paper.html', 'perennis-moss.html', 'journal-moss.html', 'category-paper.html', 'newsletter-moss.html'
  ]);
  for (const doc of documents) {
    assert.ok(doc.html.includes('noindex, nofollow'));
    assert.ok(doc.html.includes('brand-preview-document'));
    assert.ok(doc.html.includes('Review only'));
    assert.equal((doc.html.match(/<h1\b/g) || []).length, 1);
    assert.equal((doc.html.match(/<header class="site-header"/g) || []).length, 1);
    const ids = [...doc.html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${doc.file} must not duplicate IDs`);
  }
  assert.ok(documents[0].html.includes('data-shop-form'));
  assert.ok(documents[1].html.includes('data-variant'));
  assert.ok(documents[2].html.includes('Partner offers'));
  assert.ok(documents[3].html.includes('data-checkout-form'));
  assert.ok(documents[4].html.includes('<body class="brand-preview-document opar-reference-document">'));
  assert.ok(documents[5].html.includes('<body class="brand-preview-document opar-reference-document">'));
  assert.ok(documents[6].html.includes('reference-hero--paper'));
  assert.ok(documents[7].html.includes('reference-newsletter'));
  assert.ok(documents[1].label.includes('Paper / Moss'));
  assert.equal((section.match(/class="brand-review-watermark /g) || []).length, 6);
  assert.ok(section.includes('data-opacity="0.05"'));
  assert.ok(section.includes('data-opacity="0.10"'));
  assert.doesNotMatch(section, /Honest Objects|Free Knowledge/);
});

test('reference comparison contains all five supplied PNGs and correctly selected layouts', async () => {
  const { renderBrandPreviewDocuments } = await previewModule();
  const { documents, section } = renderBrandPreviewDocuments(products, pages);
  for (const file of ['01-homepage-hero-dark', '02-homepage-hero-paper', '03-product-card-grid', '04-featured-product-card', '05-newsletter-cta']) {
    assert.ok(section.includes(`/OPAR-ui-mockup-templates/previews/${file}.png`), `Missing source comparison ${file}`);
  }
  assert.equal((section.match(/class="brand-review-reference-comparison"/g) || []).length, 5);
  assert.ok(documents[0].html.includes('reference-hero--paper') && !documents[0].html.includes('hero-shop.avif'));
  assert.ok(documents[4].html.includes('reference-hero--moss'));
  for (const doc of documents) assert.ok(doc.html.includes('/assets/opar-template-preview.css'));
});

test('preview generation is deterministic and preserves source masters and existing reference content', async () => {
  let generateBrandPreview;
  try {
    ({ generateBrandPreview } = await import('../scripts/generate-brand-preview.mjs'));
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') assert.fail('The tested brand-preview generator has not been implemented yet');
    throw error;
  }
  const base = process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Temp', 'opencode') : tmpdir();
  const root = await mkdtemp(join(base, 'opar-preview-test-'));
  try {
    await mkdir(join(root, 'data'));
    for (const name of ['pilot-products', 'pages']) {
      await copyFile(new URL(`../data/${name}.json`, import.meta.url), join(root, 'data', `${name}.json`));
    }
    const kit = join(root, 'public', 'assets', 'OPAR-brand-assets');
    await mkdir(kit, { recursive: true });
    const sources = ['opar-mark-main-vector-press.eps', 'opar-lockup-main-vector-press.eps', 'favicon.ico', ...[16, 32, 48, 64, 128, 180, 192, 512].map(size => `favicon-${size}.png`), 'opar-medallion-paper-1200.png', 'opar-medallion-ground-1200.png'];
    const originals = new Map();
    for (const file of sources) {
      await copyFile(new URL(`../public/assets/OPAR-brand-assets/${file}`, import.meta.url), join(kit, file));
      originals.set(file, await readFile(join(kit, file)));
    }
    const referenceFiles = ['assets/section-bg-paper.png', 'assets/section-bg-ground.png', 'assets/section-bg-button.png', 'assets/opar-mark-main.png', ...['01-homepage-hero-dark', '02-homepage-hero-paper', '03-product-card-grid', '04-featured-product-card', '05-newsletter-cta'].map(file => `previews/${file}.png`)];
    const referenceOriginals = new Map();
    for (const file of referenceFiles) {
      const target = join(root, 'public', 'assets', 'OPAR-ui-mockup-templates', file);
      await mkdir(join(target, '..'), { recursive: true });
      await copyFile(new URL(`../public/assets/OPAR-ui-mockup-templates/${file}`, import.meta.url), target);
      referenceOriginals.set(target, await readFile(target));
    }
    const reference = '<!doctype html><html><head><title>Existing reference</title></head><body><main><section><h1>Original reference</h1></section><p>Preserve this owner content.</p></main></body></html>';
    await mkdir(join(root, 'public', 'brand-preview'));
    const index = join(root, 'public', 'brand-preview', 'index.html');
    await writeFile(index, reference);
    const result = await generateBrandPreview(root);
    assert.equal(result.documents.length, 8);
    const first = await readFile(index, 'utf8');
    assert.ok(first.includes('Preserve this owner content.'));
    assert.equal((first.match(/Brand review:start/g) || []).length, 1);
    await generateBrandPreview(root);
    assert.equal(await readFile(index, 'utf8'), first);
    for (const [file, original] of originals) assert.deepEqual(await readFile(join(kit, file)), original);
    for (const [file, original] of referenceOriginals) assert.deepEqual(await readFile(file), original);
    assert.equal((await readdir(join(root, 'public', 'assets', 'brand', 'web'))).filter(file => file.endsWith('.svg')).length, 5);
    const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
    const search = readFileSync(new URL('../public/assets/search-index.json', import.meta.url), 'utf8');
    assert.doesNotMatch(sitemap + search, /shop-paper\.html|perennis-moss\.html/);
    const background = join(root, 'public', 'assets', 'OPAR-ui-mockup-templates', 'assets', 'section-bg-paper.png');
    await rm(background);
    await assert.rejects(generateBrandPreview(root), /ENOENT|missing/i);
    assert.equal(await readFile(index, 'utf8'), first);
    await writeFile(background, referenceOriginals.get(background));
    await writeFile(index, first.replace('<!-- Brand review:end -->', ''));
    const malformed = await readFile(index, 'utf8');
    await assert.rejects(generateBrandPreview(root), /Ambiguous/);
    assert.equal(await readFile(index, 'utf8'), malformed);
    await writeFile(index, first);
    await rm(join(kit, 'opar-mark-main-vector-press.eps'));
    await assert.rejects(generateBrandPreview(root), /ENOENT|missing/i);
    assert.equal(await readFile(index, 'utf8'), first, 'missing source must not overwrite the reference');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
