import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODELS, validateProduct, productPath, renderDropshippingPage, renderAffiliatePage, renderCollection, renderPreviewIndex } from '../templates/product-pages.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const products = JSON.parse(await readFile(join(projectRoot, 'data/pilot-products.json'), 'utf8'));
const register = JSON.parse(await readFile(join(projectRoot, 'data/compliance.json'), 'utf8'));
const complianceByProduct = new Map(register.records.map(record => [record.productId, record]));
const complianceFor = product => complianceByProduct.get(product.id) || null;
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
    ? renderAffiliatePage(product, products, complianceFor(product))
    : renderDropshippingPage(product, products, complianceFor(product))
}));

for (const [model, definition] of Object.entries(MODELS)) {
  pages.push({ path: definition.path, html: renderCollection(model, products) });
}
pages.push({ path: '/templates/', html: renderPreviewIndex(products) });

for (const page of pages) {
  const destination = join(projectRoot, 'public', page.path.slice(1), 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, page.html, 'utf8');
  console.log(`Generated ${page.path}`);
}

// Preview robots/sitemap: pages are noindex until launch. When the site goes
// live, replace robots.txt with an allow rule and make sitemap URLs absolute.
await writeFile(
  join(projectRoot, 'public/robots.txt'),
  '# AURA preview — do not index until launch\nUser-agent: *\nDisallow: /\n',
  'utf8'
);
console.log('Generated /robots.txt (preview: disallow all)');

const sitemapUrls = pages
  .map(page => `  <url><loc>${page.path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
  .join('\n');
await writeFile(
  join(projectRoot, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Preview sitemap. Pages are noindex until launch. Make loc absolute at go-live. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
  'utf8'
);
console.log('Generated /sitemap.xml');

console.log('Preview pages are display-only and noindex. No orders, payment calls, or supplier API calls were made.');
