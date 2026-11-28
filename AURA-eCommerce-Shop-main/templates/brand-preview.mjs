/** Review-only specimens. Production renderers supply every page and its chrome. */
import { escapeHtml, collections } from './chrome.mjs';
import { renderCollection, renderCategoryPage, renderDropshippingPage, renderStaticPage } from './product-pages.mjs';

const KIT = '/assets/OPAR-brand-assets';
export const previewIconSizes = [16, 32, 48, 64, 128, 180, 192, 512];
export const previewIdentity = {
  headerLockupOnDark: '/assets/brand/web/opar-lockup-ivory.svg',
  headerLockupOnLight: '/assets/brand/web/opar-lockup-green.svg',
  assetPathOnDark: '/assets/brand/web/opar-mark-ivory.svg',
  assetPathOnLight: '/assets/brand/web/opar-mark-green.svg',
  icons: [
    { rel: 'icon', href: `${KIT}/favicon.ico` },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${KIT}/favicon-32.png` },
    { rel: 'apple-touch-icon', sizes: '180x180', href: `${KIT}/favicon-180.png` }
  ]
};

/** Only the straight outlined operations present in the supplied EPS are accepted. */
export function epsOutlineToSvg(source, color) {
  if (!/^#[a-f0-9]{6}$/i.test(color)) throw new Error('A vector export needs a six-digit palette colour.');
  const bounds = source.match(/%%BoundingBox:\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/)?.slice(1).map(Number);
  if (!bounds || bounds[2] <= bounds[0] || bounds[3] <= bounds[1]) throw new Error('Invalid EPS BoundingBox bounds.');
  const body = source.match(/\bnewpath\s+([\s\S]*?)\s+eofill\b/)?.[1];
  if (!body) throw new Error('Missing outlined EPS path.');
  const path = [];
  let numbers = [];
  for (const token of body.trim().split(/\s+/)) {
    if (/^-?\d+(?:\.\d+)?$/.test(token)) {
      numbers.push(Number(token));
    } else if (token === 'moveto' || token === 'lineto') {
      if (numbers.length !== 2) throw new Error(`Invalid EPS ${token} operands.`);
      path.push(token === 'moveto' ? 'M' : 'L', ...numbers);
      numbers = [];
    } else if (token === 'closepath') {
      if (numbers.length) throw new Error('Invalid EPS closepath operands.');
      path.push('Z');
    } else {
      throw new Error(`Unsupported EPS operator: ${token}`);
    }
  }
  if (numbers.length || path[0] !== 'M') throw new Error('Incomplete EPS outline.');
  const [left, bottom, right, top] = bounds;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left} ${bottom} ${right - left} ${top - bottom}" width="${right - left}" height="${top - bottom}"><title>OPAR seed and orbit — outlined web emblem</title><g transform="translate(0 ${bottom + top}) scale(1 -1)"><path fill="${color}" fill-rule="evenodd" d="${path.join(' ')}"/></g></svg>\n`;
}

export function epsOrbitMask(source) {
  const mark = epsOutlineToSvg(source, '#FFFFFF');
  const viewBox = mark.match(/viewBox="([^"]+)"/)[1];
  const inset = mark.replace(/<svg[^>]*>/, `<svg x="588" y="-560" width="2520" height="2520" viewBox="${viewBox}">`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 1400" width="2400" height="1400"><title>OPAR orbit mask — opacity supplied by the specimen</title>${inset}</svg>\n`;
}

export function renderBrandPreviewDocuments(products, pages) {
  const pageAt = path => {
    const page = pages.find(item => item.path === path);
    if (!page) throw new Error(`Missing specimen page: ${path}`);
    return page;
  };
  const product = products.find(item => item.slug === 'aloe-vera-soap');
  if (!product) throw new Error('The PDP specimen needs the existing aloe listing.');
  const samples = [
    { file: 'shop-paper.html', label: 'Warm Paper · Shop', theme: 'theme-paper', layout: 'paper-hero', render: options => renderCollection('dropshipping', products, options) },
    { file: 'pdp-paper.html', label: 'Paper / Moss · Product detail', theme: 'theme-paper', layout: 'featured-product', render: options => renderDropshippingPage(product, products, options) },
    { file: 'discover-paper.html', label: 'Warm Paper · Partner offers', theme: 'theme-paper', layout: 'paper-grid', render: options => renderCollection('affiliate', products, options) },
    { file: 'checkout-paper.html', label: 'Warm Paper · Checkout', theme: 'theme-paper', render: options => renderStaticPage(pageAt('/checkout/'), options) },
    { file: 'perennis-moss.html', label: 'Moss Dark · Perennis', theme: null, layout: 'dark-hero', render: options => renderStaticPage(pageAt('/perennis/'), options) },
    { file: 'journal-moss.html', label: 'Moss Dark · Journal desk', theme: null, layout: 'dark-hero', render: options => renderStaticPage(pageAt('/journal/plants-and-practice/'), options) },
    { file: 'category-paper.html', label: 'Warm Paper · Everyday Care', theme: 'theme-paper', layout: 'paper-hero', render: options => renderCategoryPage(collections.find(c => c.slug === 'everyday-care'), products, options) },
    { file: 'newsletter-moss.html', label: 'Moss Dark · Newsletter', theme: null, layout: 'newsletter', render: options => renderStaticPage(pageAt('/newsletter/'), options) }
  ];
  const documents = samples.map(sample => ({
    file: sample.file,
    label: sample.label,
    html: sample.render({
      theme: sample.theme,
      identity: previewIdentity,
      canonical: `/brand-preview/${sample.file}`,
      bodyClass: 'brand-preview-document opar-reference-document',
      stylesheets: ['/assets/brand-preview.css', '/assets/opar-template-preview.css'],
      ...(sample.layout ? { referenceLayout: sample.layout } : {}),
      robots: 'noindex, nofollow',
      previewLabel: `Review only — ${sample.label}. Do not enter real personal details.`,
      title: `${sample.label} — review specimen`
    })
  }));
  const link = sample => `<a class="text-link" href="/brand-preview/${sample.file}" target="_blank" rel="noopener">Open ${escapeHtml(sample.label)} <span class="sr-only">in a new tab</span></a>`;
  const comparisons = [
    ['01-homepage-hero-dark', 4, 'Dark orbit hero → Perennis', ''],
    ['02-homepage-hero-paper', 0, 'Paper orbit hero → Shop', ''],
    ['03-product-card-grid', 6, 'Framed grid → Everyday Care results', '#category-reference-results'],
    ['04-featured-product-card', 1, 'Featured piece → Paper / Moss product detail', ''],
    ['05-newsletter-cta', 7, 'Dark letter → Newsletter', '']
  ].map(([source, index, label, hash]) => `<article class="brand-review-reference-comparison">
    <h3>${escapeHtml(label)}</h3>
    <div class="brand-review-reference-comparison__pair">
      <figure><figcaption>Supplied 1440 × 900 reference · <a href="/assets/OPAR-ui-mockup-templates/${source}.html" target="_blank" rel="noopener">Source HTML</a></figcaption><a href="/assets/OPAR-ui-mockup-templates/previews/${source}.png" target="_blank" rel="noopener"><img src="/assets/OPAR-ui-mockup-templates/previews/${source}.png" alt="Supplied ${escapeHtml(label)} mockup" width="1440" height="900" loading="lazy"></a></figure>
      <figure><figcaption>Responsive implementation · ${link(documents[index])}</figcaption><iframe src="/brand-preview/${documents[index].file}${hash}" title="${escapeHtml(label)} revised preview" loading="lazy" width="720" height="900"></iframe></figure>
    </div>
  </article>`).join('');
  const panels = ['paper', 'moss'].flatMap(ground => [
    ['0', 'Plain'], ['0.05', '5% orbit'], ['0.10', '10% orbit']
  ].map(([opacity, label]) => `<figure class="brand-review-watermark brand-review-${ground}" data-opacity="${opacity}" style="--review-orbit-opacity: ${opacity}"><figcaption class="eyebrow">${ground === 'paper' ? 'Warm Paper' : 'Moss Dark'} · ${label}</figcaption><h3>Room to read.</h3><p>Objects and knowledge for a slower, more sensory life.</p></figure>`)).join('');
  const section = `<section class="guide-band brand-review-area" id="dual-surface-review">
    <span class="eyebrow">Review stage · not a live theme rollout</span>
    <h2>Reference layouts, real pages.</h2>
    <p class="guide-lede">The five supplied mockups now govern these preview compositions: orbit heroes, framed cards, mixed Paper/Moss product detail and the dark letter. Real catalogue facts and controls remain. The homepage and live route themes are unchanged.</p>
    <p class="brand-review-caution">Compare full-size pages at 1440px with the supplied images. Embedded pages respond to the width of this pane and are not 1440px screenshots. Real navigation, construction notices, the Shop sidebar, bounded galleries and longer copy are intentional adaptations.</p>
    ${comparisons}
    <p class="brand-review-caution">Use full-size samples to judge navigation and controls. Links inside them lead to the current site, not a simulated theme rollout. Do not enter real personal details in checkout.</p>
    <div class="brand-review-pair">
      ${[documents[0], documents[4]].map(sample => `<article class="brand-review-sample"><h3>${escapeHtml(sample.label)}</h3><p>${link(sample)}</p><iframe src="/brand-preview/${sample.file}" title="${escapeHtml(sample.label)} interactive specimen" loading="lazy" width="720" height="620"></iframe></article>`).join('')}
    </div>
    <nav class="brand-review-links" aria-label="Full-size theme samples">${documents.map(link).join('')}</nav>
    <div class="brand-review-heading"><span class="eyebrow">Separate watermark study · not the template hero layers</span><h3>Plain, subtle or stronger.</h3><p>One unbaked vector mask, applied at exactly 0%, 5% or 10%. These studies are separate from the supplied backgrounds used in the revised heroes.</p></div>
    <div class="brand-review-watermarks">${panels}</div>
    <div class="brand-review-heading"><span class="eyebrow">Identity devices</span><h3>An emblem for navigation; a medallion for a pause.</h3><p>The new header marks are outlined vector derivatives. These supplied double-ring medallions are decorative brand devices, not verification seals.</p></div>
    <div class="brand-review-medallions">
      <figure class="brand-review-paper"><img src="${KIT}/opar-medallion-paper-1200.png" alt="" aria-hidden="true" width="240" height="240" loading="lazy"><figcaption>Warm Paper medallion</figcaption></figure>
      <figure class="brand-review-moss"><img src="${KIT}/opar-medallion-ground-1200.png" alt="" aria-hidden="true" width="240" height="240" loading="lazy"><figcaption>Moss Dark medallion</figcaption></figure>
    </div>
    <div class="brand-review-heading"><span class="eyebrow">Browser icon matrix</span><h3>Small marks, clear edges.</h3><p>All supplied exports are shown here. The preview head selects the ICO, 32px PNG and 180px touch icon; the live head remains unchanged.</p></div>
    <div class="brand-review-icons">${previewIconSizes.map(size => {
      const display = Math.min(size, 192);
      return `<figure><div><img src="${KIT}/favicon-${size}.png" alt="" width="${display}" height="${display}" loading="lazy"></div><figcaption>${size}px export${size !== display ? ` · ${display}px display` : ''}</figcaption></figure>`;
    }).join('')}</div>
  </section>`;
  return { documents, section };
}
