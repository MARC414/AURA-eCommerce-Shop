/** Opt-in identity specimens; original brand pack and customer route themes are untouched. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { epsOutlineToSvg, epsOrbitMask, previewIconSizes, renderBrandPreviewDocuments } from '../templates/brand-preview.mjs';

const START = '<!-- Brand review:start -->';
const END = '<!-- Brand review:end -->';

export async function generateBrandPreview(projectRoot) {
  const publicDir = join(projectRoot, 'public');
  const kit = join(publicDir, 'assets', 'OPAR-brand-assets');
  const indexPath = join(publicDir, 'brand-preview', 'index.html');
  // Read/validate every original dependency before touching an output file.
  const required = ['opar-mark-main-vector-press.eps', 'favicon.ico', ...previewIconSizes.map(size => `favicon-${size}.png`), 'opar-medallion-paper-1200.png', 'opar-medallion-ground-1200.png', 'opar-lockup-main-vector-press.eps'];
  const originals = await Promise.all(required.map(file => readFile(join(kit, file))));
  const referenceRoot = join(publicDir, 'assets', 'OPAR-ui-mockup-templates');
  await Promise.all(['assets/section-bg-paper.png', 'assets/section-bg-ground.png', 'assets/section-bg-button.png', 'assets/opar-mark-main.png', ...['01-homepage-hero-dark', '02-homepage-hero-paper', '03-product-card-grid', '04-featured-product-card', '05-newsletter-cta'].map(file => `previews/${file}.png`)].map(file => readFile(join(referenceRoot, file))));
  const source = originals[0].toString('utf8');
  const lockup = originals.at(-1).toString('utf8');
  const assets = [
    ['opar-mark-ivory.svg', epsOutlineToSvg(source, '#F4F2EE')],
    ['opar-mark-green.svg', epsOutlineToSvg(source, '#2F332B')],
    ['opar-orbit-mask.svg', epsOrbitMask(source)],
    ['opar-lockup-ivory.svg', epsOutlineToSvg(lockup, '#F4F2EE')],
    ['opar-lockup-green.svg', epsOutlineToSvg(lockup, '#2F332B')]
  ];
  const products = JSON.parse(await readFile(join(projectRoot, 'data', 'pilot-products.json'), 'utf8'));
  const pages = JSON.parse(await readFile(join(projectRoot, 'data', 'pages.json'), 'utf8'));
  const { documents, section } = renderBrandPreviewDocuments(products, pages);
  let index = await readFile(indexPath, 'utf8');
  const marked = `${START}\n${section}\n${END}`;
  if (index.includes(START) || index.includes(END)) {
    if (index.split(START).length !== 2 || index.split(END).length !== 2 || index.indexOf(START) >= index.indexOf(END)) {
      throw new Error('Ambiguous brand-review markers; existing reference was not changed.');
    }
    const start = index.indexOf(START);
    const end = index.indexOf(END) + END.length;
    index = index.slice(0, start) + marked + index.slice(end);
  } else {
    const main = index.indexOf('<main');
    const firstSectionEnd = main < 0 ? -1 : index.indexOf('</section>', main);
    if (firstSectionEnd < 0) throw new Error('Missing reference introduction; existing reference was not changed.');
    const insert = firstSectionEnd + '</section>'.length;
    index = index.slice(0, insert) + `\n\n${marked}` + index.slice(insert);
  }
  if (!index.includes('href="/assets/brand-preview.css"')) {
    if (!index.includes('</head>')) throw new Error('Missing reference head; no output was written.');
    index = index.replace('</head>', '  <link rel="stylesheet" href="/assets/brand-preview.css">\n</head>');
  }
  if (!index.includes('href="/assets/opar-template-preview.css"')) {
    index = index.replace('</head>', '  <link rel="stylesheet" href="/assets/opar-template-preview.css">\n</head>');
  }
  const web = join(publicDir, 'assets', 'brand', 'web');
  await mkdir(web, { recursive: true });
  for (const [file, svg] of assets) await writeFile(join(web, file), svg, 'utf8');
  for (const document of documents) await writeFile(join(publicDir, 'brand-preview', document.file), document.html, 'utf8');
  await writeFile(indexPath, index, 'utf8');
  return { documents: documents.map(document => document.file), assets: assets.map(([file]) => file) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const result = await generateBrandPreview(root);
  console.log(`Generated ${result.documents.length} review-only samples and ${result.assets.length} web vector derivatives; originals unchanged.`);
}
