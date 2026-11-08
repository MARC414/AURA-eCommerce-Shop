import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODELS, validateProduct, productPath, renderDropshippingPage, renderAffiliatePage, renderCollection, renderCategoryPage, renderStaticPage } from '../templates/product-pages.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const products = JSON.parse(await readFile(join(projectRoot, 'data/pilot-products.json'), 'utf8'));
const collections = JSON.parse(await readFile(join(projectRoot, 'data/collections.json'), 'utf8'));
const sitePages = JSON.parse(await readFile(join(projectRoot, 'data/pages.json'), 'utf8'));
const paths = new Set();
const ids = new Set();

for (const product of products) {
  validateProduct(product);
  const route = productPath(product);
  if (paths.has(route) || ids.has(product.id)) throw new Error(`Duplicate product: ${product.id}`);
  paths.add(route);
  ids.add(product.id);
}

const pages = products.map(product => ({
  path: productPath(product),
  html: product.model === 'affiliate'
    ? renderAffiliatePage(product, products)
    : renderDropshippingPage(product, products)
}));

for (const [model, definition] of Object.entries(MODELS)) {
  pages.push({ path: definition.path, html: renderCollection(model, products) });
}

for (const collection of collections) {
  const path = `/shop/${collection.slug}/`;
  if (paths.has(path)) throw new Error(`Duplicate category path: ${path}`);
  paths.add(path);
  pages.push({ path, html: renderCategoryPage(collection, products) });
}

for (const page of sitePages) {
  pages.push({ path: page.path, html: renderStaticPage(page) });
}

const allPaths = new Set();
for (const page of pages) {
  if (allPaths.has(page.path)) throw new Error(`Duplicate page path: ${page.path}`);
  allPaths.add(page.path);
}

// Rule: never ship an internal link to a page that does not exist.
const broken = new Set();
for (const page of pages) {
  for (const match of page.html.matchAll(/href="(\/[^"#]*)"/g)) {
    const href = match[1].split('?')[0];
    if (href === '/' || href.startsWith('/assets/')) continue;
    const route = href.endsWith('/') ? href : `${href}/`;
    if (allPaths.has(route)) continue;
    if (!existsSync(join(projectRoot, 'public', route.slice(1), 'index.html'))) {
      broken.add(`${page.path} → ${href}`);
    }
  }
}
if (broken.size) throw new Error(`Broken internal links:\n${[...broken].join('\n')}`);

for (const page of pages) {
  const destination = join(projectRoot, 'public', page.path.slice(1), 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, page.html, 'utf8');
  console.log(`Generated ${page.path}`);
}

// Retired prototype surfaces. The production storefront has no preview index.
await rm(join(projectRoot, 'public/templates'), { recursive: true, force: true });
await rm(join(projectRoot, 'public/preview'), { recursive: true, force: true });

const sectionLabel = page => {
  if (page.path.startsWith('/policies/')) return 'Policy';
  if (page.section === 'perennis') return 'Perennis';
  if (page.section === 'journal') return 'Journal';
  if (page.section === 'about') return 'AURA';
  if (page.checkout) return 'Checkout';
  if (page.account) return 'Account';
  return 'Page';
};
const categoryCount = collection => products.filter(product =>
  product.model === 'dropshipping' && (collection.matches || []).includes(product.category)
).length;
const searchIndex = [
  {
    title: 'AURA home',
    description: 'Objects and knowledge for a slower, more awake life.',
    href: '/',
    type: 'Home',
    keywords: ['aura', 'shop', 'library', 'perennis', 'journal']
  },
  ...collections.map(collection => ({
    title: collection.heading,
    description: collection.description,
    href: `/shop/${collection.slug}/`,
    type: 'Category',
    keywords: [collection.label, collection.eyebrow, ...(collection.matches || []), categoryCount(collection) ? 'pieces' : 'coming soon']
  })),
  ...products.map(product => ({
    title: product.name,
    description: product.tagline,
    href: productPath(product),
    type: product.model === 'affiliate' ? 'Partner offer' : 'AURA shop',
    keywords: [product.category, ...(product.seo?.keywords || [])]
  })),
  ...sitePages
    .filter(page => !page.search)
    .map(page => ({
      title: page.heading,
      description: page.description,
      href: page.path,
      type: sectionLabel(page),
      keywords: [page.eyebrow, page.label]
    }))
];
await writeFile(join(projectRoot, 'public/assets/search-index.json'), `${JSON.stringify(searchIndex, null, 2)}\n`, 'utf8');
console.log(`Generated /assets/search-index.json (${searchIndex.length} entries)`);

// Public catalogue for the wishlist page. Only fields already shown on a
// product page; no supplier URL, cost, or internal note.
const catalogue = products.map(product => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  path: productPath(product),
  model: product.model,
  purchaseOwner: product.purchaseOwner,
  category: product.category,
  tagline: product.tagline,
  price: product.price,
  currency: product.currency || 'GBP',
  imageUrl: product.images.find(image => !image.isPlaceholder)?.src || product.images[0].src
}));
await writeFile(join(projectRoot, 'public/assets/catalogue.json'), `${JSON.stringify(catalogue, null, 2)}\n`, 'utf8');
console.log(`Generated /assets/catalogue.json (${catalogue.length} entries)`);

// Launch switch: pages are noindex until a domain and absolute URLs exist. When
// the site goes live, replace this with an allow rule and absolute sitemap locs.
await writeFile(
  join(projectRoot, 'public/robots.txt'),
  '# AURA — indexing is switched off until the launch domain is set\nUser-agent: *\nDisallow: /\n',
  'utf8'
);
console.log('Generated /robots.txt (launch switch: disallow all)');

const sitemapUrls = pages
  .map(page => `  <url><loc>${page.path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
  .join('\n');
await writeFile(
  join(projectRoot, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Launch switch: pages are noindex until the domain is set. Make loc absolute at go-live. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
  'utf8'
);
console.log('Generated /sitemap.xml');

console.log(`Generated ${pages.length} pages. Browser-local cart, requests and newsletter; no payment calls.`);
