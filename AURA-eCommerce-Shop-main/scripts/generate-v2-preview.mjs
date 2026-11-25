/**
 * Isolated V2 preview generator: emits /v2/* into public/v2/* without touching
 * live routes, sitemap.xml, search-index.json, or homepage-freeze fixtures.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODELS, productPath } from '../templates/product-page.mjs';
import {
  renderV2Home,
  renderV2Collection,
  renderV2Category,
  renderV2Product,
  renderV2Static,
  v2Href
} from '../templates/v2-site.mjs';

export async function generateV2Preview(projectRoot) {
  const products = JSON.parse(await readFile(join(projectRoot, 'data/pilot-products.json'), 'utf8'));
  const collections = JSON.parse(await readFile(join(projectRoot, 'data/collections.json'), 'utf8'));
  const sitePages = JSON.parse(await readFile(join(projectRoot, 'data/pages.json'), 'utf8'));

  const v2Pages = [
    { path: '/v2/', html: renderV2Home(products) },
    ...products.map(product => ({
      path: v2Href(productPath(product)),
      html: renderV2Product(product, products)
    })),
    ...Object.entries(MODELS).map(([modelName, def]) => ({
      path: v2Href(def.path),
      html: renderV2Collection(modelName, products)
    })),
    ...collections.map(collection => ({
      path: `/v2/shop/${collection.slug}/`,
      html: renderV2Category(collection, products)
    })),
    ...sitePages.map(page => ({
      path: v2Href(page.path),
      html: renderV2Static(page)
    }))
  ];

  const v2Root = join(projectRoot, 'public', 'v2');
  await rm(v2Root, { recursive: true, force: true });

  for (const page of v2Pages) {
    const dest = join(projectRoot, 'public', page.path.slice(1), 'index.html');
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, page.html, 'utf8');
  }

  return { routes: v2Pages.map(p => p.path) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const result = await generateV2Preview(root);
  console.log(`Generated ${result.routes.length} isolated V2 preview pages under /v2/ (noindex, outside sitemap & search).`);
}
