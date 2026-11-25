/**
 * OPAR V2 Preview Renderer — "The Double-Sided Herbarium & Apothecary"
 * Builds a complete, navigable, noindex /v2/* preview edition without altering
 * live templates, frozen homepage hashes, shared CSS, or catalogue JSON.
 */

import { readFileSync } from 'node:fs';
import {
  BRAND,
  brand,
  site,
  collections,
  pages,
  escapeHtml,
  arrow,
  external,
  icons,
  whatsappLink,
  whatsappDisclosure
} from './chrome.mjs';
import { MODELS, collectionFor, formatMoney, roomBotanicalMark, variantLabel } from './product-page.mjs';

const complianceRegister = JSON.parse(readFileSync(new URL('../data/compliance.json', import.meta.url), 'utf8'));

export function v2Href(livePath = '/') {
  const value = String(livePath || '/');
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/assets/') || value.startsWith('/v2/')) {
    return value;
  }
  return value === '/' ? '/v2/' : `/v2${value}`;
}

const chevron = '<span class="nav-chevron" aria-hidden="true"></span>';
const isPublished = item => Boolean(item) && item.published !== false;

function navGroups(children) {
  const groups = new Map();
  children.forEach(child => {
    const key = child.group || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(child);
  });
  return [...groups.entries()];
}

function v2Header(active = null, theme = null) {
  const utility = site.utility || {};
  const emblem = theme === 'theme-paper'
    ? '/assets/brand/web/opar-mark-green.svg'
    : '/assets/OPAR-brand-assets/opar-mark-main.svg';
  const searchPublished = isPublished(utility.search);
  const search = searchPublished ? `
        <details class="nav-search">
          <summary class="utility-link nav-search__toggle" aria-label="${escapeHtml(utility.search.label)}"><span class="utility-icon">${icons.search}</span><span class="utility-label">${escapeHtml(utility.search.label)}</span></summary>
          <div class="nav-search__drawer">
            <form class="site-search" role="search" action="${escapeHtml(v2Href(utility.search.action))}" method="get">
              <label class="sr-only" for="site-search-input">${escapeHtml(utility.search.placeholder)}</label>
              <input id="site-search-input" type="search" name="q" placeholder="${escapeHtml(utility.search.placeholder)}" autocomplete="off">
              <button class="site-search__submit" type="submit" aria-label="${escapeHtml(utility.search.label)}">${icons.search}</button>
              <button class="site-search__close" type="button" data-search-close aria-label="Close search" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
            </form>
          </div>
        </details>` : '';
  const utilityLink = (item, icon, extra = '') => isPublished(item)
    ? `<a class="utility-link" href="${escapeHtml(v2Href(item.href))}"><span class="utility-icon">${icon}</span><span class="utility-label">${escapeHtml(item.label)}</span>${extra}</a>`
    : '';
  const navItem = item => {
    const children = (item.children || []).filter(isPublished);
    const current = item.id === active ? ' aria-current="page"' : '';
    if (!children.length) {
      return `<a href="${escapeHtml(v2Href(item.href))}"${current}>${escapeHtml(item.label)}</a>`;
    }
    const groups = navGroups(children);
    const panel = groups.length > 1
      ? `<div class="nav-panel nav-panel-grouped">${groups.map(([group, links]) => `
            <div class="nav-column">
              ${group ? `<span class="nav-group-label">${escapeHtml(group)}</span>` : ''}
              ${links.map(child => `<a href="${escapeHtml(v2Href(child.href))}"><span>${escapeHtml(child.label)}</span>${child.note ? `<span class="nav-note">${escapeHtml(child.note)}</span>` : ''}</a>`).join('')}
            </div>`).join('')}
          </div>`
      : `<div class="nav-panel">${children.map(child => `
            <a href="${escapeHtml(v2Href(child.href))}"><span>${escapeHtml(child.label)}</span>${child.note ? `<span class="nav-note">${escapeHtml(child.note)}</span>` : ''}</a>`).join('')}
          </div>`;
    return `<details class="nav-group"${item.id === active ? ' data-current="true"' : ''}>
          <summary${current}><span>${escapeHtml(item.label)}</span>${chevron}</summary>
          ${panel}
        </details>`;
  };

  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="header-row">
        <a class="wordmark" href="/v2/" aria-label="${escapeHtml(site.brand.name)} V2 home"><img class="wordmark-emblem" src="${escapeHtml(emblem)}" alt="${escapeHtml(brand.logo.altText)}" width="40" height="40"><span class="wordmark-text">${escapeHtml(site.brand.wordmark)}</span>${site.brand.note ? `<span class="wordmark-note">${escapeHtml(site.brand.note)}</span>` : ''}</a>
        <details class="nav-toggle">
          <summary aria-label="Menu">${icons.menu}</summary>
        </details>
        <nav class="primary-nav" aria-label="Primary navigation">
          ${site.nav.filter(isPublished).map(navItem).join('\n          ')}
        </nav>
        <div class="header-utility">${search}
          ${utilityLink(utility.account, icons.user)}
          ${utilityLink(utility.wishlist, icons.heart, '<span class="utility-count" data-wishlist-count hidden></span>')}
          ${utilityLink(utility.cart, icons.bag, '<span class="utility-count" data-cart-count hidden></span>')}
        </div>
      </div>
    </header>`;
}

function v2ThresholdBar({ place, meta, liveHref = '/' }) {
  return `
    <div class="v2-threshold" role="region" aria-label="Section threshold">
      <div class="v2-threshold__inner">
        <span class="v2-threshold__place"><span class="v2-threshold__dot" aria-hidden="true"></span><span>${escapeHtml(place)}</span></span>
        <div class="v2-threshold__meta">
          <span>${meta}</span>
          <a class="v2-threshold__exit" href="${escapeHtml(liveHref)}" data-v2-external-live>V2 Edition · View current live page &rarr;</a>
        </div>
      </div>
    </div>`;
}

function v2Footer() {
  const columns = site.footer.columns.map(column => {
    const id = `footer-${column.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return `
        <nav class="footer-column" aria-labelledby="${id}">
          <h2 class="footer-heading" id="${id}">${escapeHtml(column.heading)}</h2>
          ${column.links.map(link => `<a href="${escapeHtml(v2Href(link.href))}">${escapeHtml(link.label)}</a>`).join('')}
        </nav>`;
  }).join('');
  const waHref = whatsappLink();
  const waNote = whatsappDisclosure();
  return `
    <footer class="site-footer v2-split-footer">
      <div class="v2-split-band" aria-label="Cross the threshold">
        <section class="v2-split-wing" aria-labelledby="v2-wing-moss">
          <span class="eyebrow">Night Canopy · Free Sanctuary</span>
          <h3 id="v2-wing-moss">The Night Library</h3>
          <p>Free books, sacred sound recordings, and plant monographs set in Moss Nocturne—kept apart from commerce.</p>
          <div class="v2-split-wing__links">
            <a href="/v2/perennis/">Perennis Library</a>
            <a href="/v2/perennis/books/">Books</a>
            <a href="/v2/perennis/music/">Listening Room</a>
            <a href="/v2/journal/">Journal</a>
          </div>
        </section>
        <section class="v2-split-wing v2-split-wing--paper" aria-labelledby="v2-wing-paper">
          <span class="eyebrow">Warm Paper · Specimen Table</span>
          <h3 id="v2-wing-paper">Dispensary &amp; Objects</h3>
          <p>Objects chosen one by one on cotton-rag Warm Paper, with invoice-first inquiry and visible sourcing records.</p>
          <div class="v2-split-wing__links">
            <a href="/v2/shop/">Shop Archive</a>
            <a href="/v2/discover/">Partner Offers</a>
            <a href="/v2/cart/">Bag</a>
            <a href="/v2/checkout/">Request Invoice</a>
          </div>
        </section>
      </div>
      <div class="footer-top">
        <div class="footer-brand">
          <a class="wordmark" href="/v2/" aria-label="${escapeHtml(site.brand.name)} V2 home"><img class="wordmark-emblem" src="/assets/OPAR-brand-assets/opar-mark-main.svg" alt="${escapeHtml(brand.logo.altText)}" width="28" height="28">${escapeHtml(site.brand.wordmark)}</a>
          <p>${escapeHtml(site.brand.description)}<br>${escapeHtml(site.brand.tagline)}</p>
          <p class="footer-whatsapp"><a class="text-link" href="${escapeHtml(waHref)}" target="_blank" rel="noopener noreferrer">WhatsApp inquiry desk ${external}</a><span class="footer-whatsapp__note">${escapeHtml(waNote)}</span></p>
        </div>
        <div class="footer-columns">${columns}
        </div>
      </div>
      <div class="footer-legal">
        <p>${escapeHtml(site.footer.note)}</p>
        <p class="footer-signature">${escapeHtml(site.footer.signature)} · V2 Architecture Study</p>
      </div>
    </footer>`;
}

function v2Document({ title, description, active = null, theme = null, thresholdPlace, thresholdMeta, liveHref = '/', content, scripts = [], bodyClass = '' }) {
  const isPaper = theme === 'theme-paper';
  const themeColor = isPaper ? '#F4F2EE' : '#2F332B';
  const favicons = brand.logo.favicons || {};
  const iconTags = `<link rel="icon" href="${escapeHtml(favicons.ico || '/assets/OPAR-brand-assets/favicon.ico')}" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="${escapeHtml(favicons.png32 || '/assets/OPAR-brand-assets/favicon-32.png')}">
  <link rel="apple-touch-icon" sizes="180x180" href="${escapeHtml(favicons.appleTouch180 || '/assets/OPAR-brand-assets/favicon-180.png')}">`;
  const classes = [theme, 'v2-doc', bodyClass].filter(Boolean).join(' ');
  const allScripts = ['/assets/cart.js', '/assets/site.js', ...scripts, '/assets/v2-editorial.js'];

  return `<!DOCTYPE html>
<html lang="en">
<!-- Generated V2 preview document (noindex). Live production routes stay untouched. -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — ${escapeHtml(BRAND)} V2</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="${escapeHtml(themeColor)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${escapeHtml(brand.typography.googleFontsHref)}" rel="stylesheet">
  ${iconTags}
  <link rel="stylesheet" href="/assets/product-pages.css">
  <link rel="stylesheet" href="/assets/non-home-branding.css">
  <link rel="stylesheet" href="/assets/v2-editorial.css">
  ${allScripts.map(src => `<script src="${escapeHtml(src)}" defer></script>`).join('\n  ')}
</head>
<body class="${escapeHtml(classes)}">
  ${v2Header(active, theme)}
  ${v2ThresholdBar({ place: thresholdPlace, meta: thresholdMeta, liveHref })}
  <main id="main-content" tabindex="-1">${content}</main>
  ${v2Footer()}
</body>
</html>`;
}

function botanicalBinomial(product) {
  const s = `${product.slug} ${product.name}`.toLowerCase();
  if (s.includes('ashwagandha')) return 'Withania somnifera';
  if (s.includes('turmeric') && s.includes('pad')) return 'Curcuma longa · Partner Specimen';
  if (s.includes('turmeric')) return 'Curcuma longa · Solid Bar';
  if (s.includes('aloe')) return 'Aloe barbadensis · Cold Form';
  return product.category;
}

function specimenPlateMarkup(product, index = 0) {
  const code = product.sourceSku || `OPAR-${String(index + 1).padStart(2, '0')}`;
  const latin = botanicalBinomial(product);
  const sub = product.format || product.cardLine || product.tagline;
  const origin = product.specifications?.find(s => /origin|manufacturing|country/i.test(s.label))?.value || product.sourceName;
  return `<div class="v2-specimen-plate" aria-hidden="true">
    <img class="v2-specimen-plate__orbit" src="/assets/brand/web/opar-mark-green.svg" alt="" width="180" height="180" loading="lazy" decoding="async">
    <div class="v2-specimen-plate__top">
      <span>Specimen No. ${String(index + 1).padStart(2, '0')}</span>
      <span>${escapeHtml(code)}</span>
    </div>
    <div class="v2-specimen-plate__body">
      <span class="v2-specimen-plate__latin">${escapeHtml(latin)}</span>
      <span class="v2-specimen-plate__sub">${escapeHtml(sub)}</span>
    </div>
    <div class="v2-specimen-plate__foot">
      <span>${escapeHtml(product.category)}</span>
      <span>${escapeHtml(origin)}</span>
    </div>
  </div>`;
}

const V2_ROOM_IMAGES = {
  'herbal-botanicals': { src: '/assets/products/studio-herbal-botanicals-800.jpg', alt: 'Amber botanical apothecary vessel' },
  'everyday-care': { src: '/assets/products/studio-everyday-care-800.jpg', alt: 'Cold-process matte cleansing bar' },
  'showpieces': { src: '/assets/products/studio-showpieces-800.jpg', alt: 'Hand-turned hardwood vessel' },
  'yoga-practice': { src: '/assets/products/studio-yoga-practice-800.jpg', alt: 'Rolled woven mat and cork block' },
  'art-craft': { src: '/assets/products/studio-art-craft-800.jpg', alt: 'Ceramic studio craft vase' },
  'quiet-living': { src: '/assets/products/studio-quiet-living-800.jpg', alt: 'Linen cloth and stoneware dish' }
};

export function renderV2Home(products) {
  const shelfSlugs = ['turmeric-cleansing-soap', 'ashwagandha-with-black-pepper', 'turmeric-cleansing-pads'];
  const shelf = shelfSlugs.map(slug => products.find(p => p.slug === slug)).filter(Boolean);
  const lede = 'Objects and knowledge for a slower, more sensory life — herbs, everyday care, sound, practice and craft, described honestly.';

  const heroHtml = `
    <section class="home-hero" aria-labelledby="home-heading">
      <div class="home-hero__photo" aria-hidden="true">
        <picture>
          <source type="image/avif" srcset="/assets/brand/hero-opar.avif">
          <source type="image/webp" srcset="/assets/brand/hero-opar.webp">
          <img src="/assets/brand/hero-opar.jpg" alt="" width="1920" height="1080" fetchpriority="high" decoding="async">
        </picture>
      </div>
      <div class="home-hero__grade" aria-hidden="true"></div>
      <div class="grain home-hero__grain" aria-hidden="true"></div>
      <div class="hero-scrim-top" aria-hidden="true"></div>
      <div class="hero-scrim-base" aria-hidden="true"></div>
      <div class="home-shell home-hero__inner">
        <p class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(BRAND)}</p>
        <h1 id="home-heading" class="home-hero__title">A world of<br><em><span class="gold">conscious</span> living.</em></h1>
        <p class="home-hero__lede">${escapeHtml(lede)}</p>
        <div class="home-hero__actions">
          <a class="button button-primary button-inline" href="/v2/shop/">Enter the shop</a>
          <a class="button button-secondary button-inline" href="/v2/about/">About ${escapeHtml(BRAND)}</a>
        </div>
      </div>
      <nav class="v2-hero-index" aria-label="Homepage chapters">
        <a href="#featured">01 · Objects</a>
        <a href="#rooms">02 · Rooms</a>
        <a href="#botanicals">03 · Materia Medica</a>
      </nav>
      <div class="home-hero__hairline" aria-hidden="true"></div>
    </section>`;

  const cardsHtml = shelf.map((product, idx) => {
    const path = v2Href(`/${product.model === 'affiliate' ? 'discover' : 'shop'}/${product.slug}/`);
    const collection = collectionFor(product);
    const priced = Number.isFinite(product.price);
    return `
        <article class="feature-card">
          <a class="feature-card__mount" href="${escapeHtml(path)}" aria-hidden="true" tabindex="-1">
            ${specimenPlateMarkup(product, idx)}
          </a>
          <div class="feature-card__copy">
            <span class="eyebrow">${collection ? `<a href="${escapeHtml(v2Href(`/shop/${collection.slug}/`))}">${escapeHtml(product.category)}</a>` : escapeHtml(product.category)}</span>
            <h3><a href="${escapeHtml(path)}">${escapeHtml(product.name)}</a></h3>
            <p class="feature-card__line">${escapeHtml(product.cardLine || product.tagline)}</p>
            <div class="feature-card__foot">
              <span class="feature-card__terms">
                ${product.format ? `<span class="feature-card__format">${escapeHtml(product.format)}</span>` : ''}
                <span class="feature-card__price">${priced ? escapeHtml(formatMoney(product.price, product.currency)) : 'Price on request'}</span>
              </span>
              <a class="text-link" href="${escapeHtml(path)}">View folio ${arrow}<span class="sr-only"> about ${escapeHtml(product.name)}</span></a>
            </div>
          </div>
        </article>`;
  }).join('');

  const featuredHtml = `
    <section id="featured" class="home-section home-featured" aria-labelledby="featured-heading">
      <div class="home-shell">
        <div class="home-section__head">
          <div class="home-section__intro">
            <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>Featured specimens</span>
            <h2 id="featured-heading">Pressed shelf index.</h2>
          </div>
          <p class="home-section__note">${shelf.length} pressed-specimen mounts from ${products.length} listed pieces. Confirmed pricing settles on written invoice.</p>
        </div>
        <div class="feature-grid">${cardsHtml}</div>
        <div class="home-featured__foot">
          <p>Every folio states verified label provenance side-by-side with claims OPAR strips out.</p>
          <a class="button button-primary button-inline" href="/v2/shop/">Enter V2 archive ${arrow}</a>
        </div>
      </div>
    </section>`;

  const roomsHtml = `
    <section id="rooms" class="home-section home-rooms" aria-labelledby="rooms-heading">
      <div class="home-shell">
        <div class="home-section__head">
          <div class="home-section__intro">
            <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>The shop</span>
            <h2 id="rooms-heading">Start with a room.</h2>
          </div>
          <p class="home-section__note">Each room pairs a studio medallion with its curated Warm Paper archive.</p>
        </div>
        <ul class="room-index">
          ${collections.map((room, index) => {
            const img = V2_ROOM_IMAGES[room.slug];
            return `
          <li>
            <a class="room-index__item" href="/v2/shop/${escapeHtml(room.slug)}/">
              <span class="room-index__top">
                <span class="room-index__number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                <span class="room-index__arrow" aria-hidden="true">&rarr;</span>
              </span>
              ${img ? `<span class="room-index__figure"><img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" width="120" height="120" loading="lazy" decoding="async"></span>` : ''}
              <h3>${escapeHtml(room.heading)}</h3>
              <p>${escapeHtml(room.intro)}</p>
            </a>
          </li>`;
          }).join('')}
        </ul>
      </div>
      <img class="corner-foliage corner-foliage--neem-head" src="/assets/botanicals/corner-neem.webp" alt="" aria-hidden="true" width="768" height="964" loading="lazy" decoding="async">
    </section>`;

  const journalItem = site.nav.find(n => n.id === 'journal');
  const pageByPath = new Map(pages.map(p => [p.path, p]));
  const journalRoot = pageByPath.get(journalItem.href);
  const monographHtml = `
    <section id="botanicals" class="botanical-monograph botanical-monograph--grounded" aria-labelledby="monograph-heading">
      <div class="monograph-head monograph-head--photo">
        <picture class="spread-picture monograph-head__picture">
          <source type="image/avif" srcset="/assets/botanicals/monograph-apiary-garden.avif">
          <source type="image/webp" srcset="/assets/botanicals/monograph-apiary-garden.webp">
          <img class="monograph-head__photo" src="/assets/botanicals/monograph-apiary-garden.jpg" alt="" aria-hidden="true" width="1376" height="768" loading="lazy" decoding="async">
        </picture>
        <div class="monograph-head__scrim" aria-hidden="true"></div>
        <img class="corner-foliage corner-foliage--beehive-tr" src="/assets/botanicals/corner-honey-hive.webp" alt="" aria-hidden="true" width="1200" height="896" loading="lazy" decoding="async">
        <div class="botanical-monograph__header">
          <div class="home-section__head">
            <div class="home-section__intro">
              <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>Editorial monograph</span>
              <h2 id="monograph-heading">The materia medica: whole roots &amp; sacred seeds.</h2>
              <p class="home-section__note monograph-head__note">Three foods, photographed where they grow, with the lineage and the chemistry kept apart so neither has to borrow from the other.</p>
              <div class="monograph-head__actions">
                <a class="button button-secondary button-small button-inline" href="/v2/journal/">Read the V2 Journal ${arrow}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article class="editorial-spread editorial-spread--reverse">
        <picture class="spread-picture">
          <source type="image/avif" srcset="/assets/botanicals/ashwagandha-env-forest.avif">
          <source type="image/webp" srcset="/assets/botanicals/ashwagandha-env-forest.webp">
          <img class="spread-bg" src="/assets/botanicals/ashwagandha-env-forest.jpg" alt="Misty sub-Himalayan forest understory, the habitat of Withania somnifera" width="1376" height="768" loading="lazy" decoding="async">
        </picture>
        <div class="spread-scrim" aria-hidden="true"></div>
        <div class="editorial-spread__text">
          <span class="editorial-spread__eyebrow"><span class="home-rule home-rule--gold" aria-hidden="true"></span>Withania somnifera &middot; Whole Root</span>
          <h3 class="editorial-spread__quote">"The sovereign root of classical Ayurveda, yielding <em>grounded vitality</em>."</h3>
          <p class="editorial-spread__heritage">Recorded in the <em>Charaka Samhita</em> as the prime rasayana of serenity and deep vigor.</p>
          <div class="editorial-spread__actions">
            <a class="button button-primary button-small button-inline" href="/v2/shop/ashwagandha-with-black-pepper/">Open V2 Botanical Folio &rarr;</a>
          </div>
        </div>
        <div class="spread-figure">
          <img class="floating-specimen" src="/assets/botanicals/ashwagandha-bowl-roots-isolated.webp" alt="Handcrafted wooden bowl of ashwagandha root powder" width="645" height="316" loading="lazy" decoding="async">
        </div>
      </article>

      <div class="archipelago-block archipelago-block--journal">
        <picture class="spread-picture">
          <source type="image/avif" srcset="/assets/botanicals/botanical-archipelago.avif">
          <source type="image/webp" srcset="/assets/botanicals/botanical-archipelago.webp">
          <img class="spread-bg" src="/assets/botanicals/botanical-archipelago.jpg" alt="Natural arrangement of whole roots, black seeds, turmeric, and honeycomb" width="1376" height="768" loading="lazy" decoding="async">
        </picture>
        <div class="archipelago-scrim" aria-hidden="true"></div>
        <div class="archipelago-visual">
          <div class="archipelago-overlay">
            <div class="archipelago-overlay__copy">
              <span class="home-overline"><span class="home-rule home-rule--gold" aria-hidden="true"></span>The Night Library</span>
              <h3>Fine-Press Books, Music &amp; Journal</h3>
              <p>Step from the Warm Paper dispensary back into Moss Nocturne for sacred sound and fine-press reading rooms.</p>
            </div>
            <a class="button button-primary button-small button-inline" href="/v2/perennis/">Enter Perennis Sanctuary &rarr;</a>
          </div>
          <section class="journal-plate" id="journal" aria-labelledby="journal-heading">
            <div class="journal-plate__head">
              <div>
                <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(journalItem.label)}</span>
                <h3 id="journal-heading">${escapeHtml(journalRoot.heading)}</h3>
                <p>${escapeHtml(journalRoot.description)}</p>
              </div>
              <a class="journal-plate__all" href="/v2/journal/">All writing${arrow}</a>
            </div>
            <ul class="journal-index">
              ${(journalItem.children || []).filter(c => c.href !== journalItem.href).map((c, idx) => {
                const pg = pageByPath.get(c.href);
                return `<li><a class="journal-index__column" href="${escapeHtml(v2Href(c.href))}"><span class="journal-index__number" aria-hidden="true">${String(idx + 1).padStart(2, '0')}</span><span class="journal-index__name">${escapeHtml(c.label)}${arrow}</span><span class="journal-index__line">${escapeHtml(pg.description)}</span></a></li>`;
              }).join('')}
            </ul>
          </section>
        </div>
      </div>
    </section>`;

  const letterHtml = `
    <section id="letter" class="home-section home-letter" aria-labelledby="letter-heading">
      <img class="corner-foliage corner-foliage--moringa-letter" src="/assets/botanicals/corner-moringa.webp" alt="" aria-hidden="true" width="768" height="768" loading="lazy" decoding="async">
      <div class="home-shell home-letter__inner">
        <div class="home-letter__copy">
          <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>The letter</span>
          <h2 id="letter-heading">Notes from the shelf.</h2>
          <p>New pieces, what the supplier has confirmed, and what is still being checked. Written plainly, and only when there is something worth saying.</p>
        </div>
        <div class="home-letter__subscribe">
          <form class="newsletter-form" data-newsletter-form data-newsletter-quiet>
            <label class="field" for="newsletter-email"><span>Email address</span>
              <input id="newsletter-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com">
            </label>
            <button class="button button-primary" type="submit">Subscribe</button>
          </form>
          <p class="commerce-status" data-newsletter-status role="status" aria-live="polite"></p>
          <button class="text-link newsletter-remove" type="button" data-newsletter-remove hidden>Remove my preference from this browser</button>
          <p class="home-letter__note">Saved in this browser until a mailing service is connected. No address leaves this device.</p>
        </div>
      </div>
    </section>`;

  return v2Document({
    title: 'A world of conscious living',
    description: lede,
    theme: null,
    thresholdPlace: 'NIGHT CANOPY · V2 ARCHITECTURE PREVIEW',
    thresholdMeta: '6 Studio Medallions · Pressed Herbarium Front Shelf',
    liveHref: '/',
    scripts: ['/assets/newsletter-page.js'],
    content: `${heroHtml}${featuredHtml}${roomsHtml}${monographHtml}${letterHtml}`
  });
}

function v2Card(product, index = 0) {
  const first = product.images[0];
  const isAffiliate = product.model === 'affiliate';
  const collection = collectionFor(product);
  const href = v2Href(`/${isAffiliate ? 'discover' : 'shop'}/${product.slug}/`);
  const badge = `<span class="badge${isAffiliate ? ' badge-partner' : ''}">${escapeHtml(MODELS[product.model].badge)}</span>`;
  const media = first.isEmptyMount
    ? specimenPlateMarkup(product, index)
    : `<img src="${escapeHtml(first.src800Jpg || first.src)}" alt="" width="800" height="800" loading="lazy" decoding="async">`;
  const priceText = isAffiliate
    ? `View with ${escapeHtml(product.sourceName)}`
    : Number.isFinite(product.price)
    ? `${formatMoney(product.price, product.currency)}${product.samplePricing ? ' · Sample' : ''}`
    : 'Price on request';
  return `<article class="product-card" data-model="${product.model}" data-room="${escapeHtml(collection ? collection.slug : '')}" data-price="${Number.isFinite(product.price) ? String(product.price) : ''}" data-sample="${product.isPlaceholder ? 'true' : 'false'}" data-name="${escapeHtml(product.name)}" data-index="${index}" data-v2-slug="${escapeHtml(product.slug)}">
    <a class="card-image product-mount" href="${escapeHtml(href)}" tabindex="-1" aria-hidden="true">${media}${badge}</a>
    <div class="card-copy">
      <span class="eyebrow">${collection && !isAffiliate ? `<a href="${escapeHtml(v2Href(`/shop/${collection.slug}/`))}">${escapeHtml(product.category)}</a>` : escapeHtml(product.category)}</span>
      <h3><a href="${escapeHtml(href)}">${escapeHtml(product.name)} ${arrow}</a></h3>
      <p>${escapeHtml(product.tagline)}</p>
      <span class="card-price">${priceText}</span>
      <a class="text-link card-cta" href="${escapeHtml(href)}">Open folio ${arrow}</a>
    </div>
  </article>`;
}

export function renderV2Collection(modelName, products) {
  const model = MODELS[modelName];
  const list = products.filter(p => p.model === modelName);
  const isShop = modelName === 'dropshipping';

  if (isShop) {
    const sampleCount = list.filter(item => item.isPlaceholder).length;
    const previewCount = list.length - sampleCount;
    const priced = list.filter(item => Number.isFinite(item.price));
    const categoryCount = col => products.filter(p => p.model === 'dropshipping' && (col.matches || []).includes(p.category)).length;
    return v2Document({
      title: 'Shop Archive',
      description: model.description,
      active: 'shop',
      theme: 'theme-paper',
      thresholdPlace: 'DISPENSARY & OBJECTS · SHOP ARCHIVE',
      thresholdMeta: '<span data-v2-bag-summary>0 pieces in bag</span>',
      liveHref: '/shop/',
      scripts: ['/assets/shop-page.js'],
      content: `<div class="shop-hub-page">
        <section class="shop-hero" aria-labelledby="shop-hero-heading">
          <div class="shop-hero__media" aria-hidden="true">
            <picture>
              <source type="image/avif" srcset="/assets/brand/hero-shop.avif" sizes="100vw">
              <source type="image/webp" srcset="/assets/brand/hero-shop.webp" sizes="100vw">
              <img src="/assets/brand/hero-shop.jpg" alt="" width="1600" height="900" fetchpriority="high" decoding="async">
            </picture>
            <div class="shop-hero__grade"></div>
            <div class="grain"></div>
            <div class="shop-hero__scrim"></div>
          </div>
          <div class="shop-hero__inner">
            <nav class="breadcrumbs breadcrumbs--hero" aria-label="Breadcrumb"><ol><li><a href="/v2/">Home</a></li><li aria-current="page">Shop</li></ol></nav>
            <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(BRAND)} collection</span>
            <h1 id="shop-hero-heading" class="shop-hero__title">Objects for a slower life.</h1>
            <p class="shop-hero__lede">${escapeHtml(model.description)}</p>
            <p class="shop-hero__meta">${list.length} curated pieces · ${collections.length} rooms · ${previewCount} preview · ${sampleCount} construction samples</p>
          </div>
        </section>
        <div class="page-shell collection-page shop-collection-shell">
          <div class="shop-workspace">
            <aside class="shop-sidebar" aria-label="Filter and sort collection">
              <details class="shop-filter-disclosure" data-shop-disclosure open>
                <summary class="shop-filter-summary"><span>Filter &amp; sort</span><span class="shop-filter-summary__state" data-shop-active-summary>All rooms · Curated order</span></summary>
                <form class="shop-filter-form" data-shop-form>
                  <div class="shop-filter-head"><span class="eyebrow">Refine archive</span><button type="button" class="text-link shop-reset-btn" data-shop-reset hidden>Clear all</button></div>
                  <fieldset class="filter-group"><legend>Room</legend>
                    <label class="filter-option"><input type="radio" name="room" value="all" data-label="All rooms" checked><span class="filter-option__label">All rooms</span><span class="filter-option__count">${list.length}</span></label>
                    ${collections.map(c => `<label class="filter-option"><input type="radio" name="room" value="${escapeHtml(c.slug)}" data-label="${escapeHtml(c.label)}"><span class="filter-option__label">${escapeHtml(c.label)}</span><span class="filter-option__count">${categoryCount(c)}</span></label>`).join('')}
                  </fieldset>
                  <fieldset class="filter-group"><legend>Listing state</legend>
                    <label class="filter-option"><input type="radio" name="status" value="all" data-label="All states" checked><span class="filter-option__label">All states</span><span class="filter-option__count">${list.length}</span></label>
                    <label class="filter-option"><input type="radio" name="status" value="preview" data-label="Owner preview"><span class="filter-option__label">Owner preview</span><span class="filter-option__count">${previewCount}</span></label>
                    <label class="filter-option"><input type="radio" name="status" value="sample" data-label="Construction sample"><span class="filter-option__label">Construction sample</span><span class="filter-option__count">${sampleCount}</span></label>
                  </fieldset>
                  <fieldset class="filter-group"><legend>Price guide</legend>
                    <label class="filter-option"><input type="radio" name="tier" value="all" data-label="Any price" checked><span class="filter-option__label">Any price</span><span class="filter-option__count">${list.length}</span></label>
                    <label class="filter-option"><input type="radio" name="tier" value="under-20" data-label="Under £20"><span class="filter-option__label">Under £20</span><span class="filter-option__count">${priced.filter(p => p.price < 20).length}</span></label>
                    <label class="filter-option"><input type="radio" name="tier" value="20-45" data-label="£20 – £45"><span class="filter-option__label">£20 – £45</span><span class="filter-option__count">${priced.filter(p => p.price >= 20 && p.price <= 45).length}</span></label>
                    <label class="filter-option"><input type="radio" name="tier" value="45-plus" data-label="Over £45"><span class="filter-option__label">Over £45</span><span class="filter-option__count">${priced.filter(p => p.price > 45).length}</span></label>
                  </fieldset>
                  <div class="filter-group filter-group--sort">
                    <label class="filter-sort-label" for="shop-sort-select">Sort order</label>
                    <select id="shop-sort-select" class="filter-sort-select" name="sort">
                      <option value="curated">Curated order</option>
                      <option value="price-asc">Price: low to high</option>
                      <option value="price-desc">Price: high to low</option>
                      <option value="name-asc">Title: A to Z</option>
                    </select>
                  </div>
                </form>
              </details>
            </aside>
            <div class="shop-results">
              <div class="shop-toolbar">
                <p class="shop-toolbar__count" data-shop-count aria-live="polite">Showing ${list.length} of ${list.length} pieces</p>
                <button type="button" class="text-link shop-toolbar__reset" data-shop-reset hidden>Reset filters</button>
              </div>
              <div class="product-cards" data-shop-grid>${list.map((p, i) => v2Card(p, i)).join('')}</div>
              <div class="shop-empty" data-shop-empty hidden>
                <span class="eyebrow">No match in current selection</span>
                <h2>No pieces match those filters.</h2>
                <p>Try widening the room or price bracket, or reset to read the full collection.</p>
                <button type="button" class="button button-secondary button-small" data-shop-reset>Clear all filters</button>
              </div>
            </div>
          </div>
          <div class="paper-pause" aria-hidden="true"><img src="/assets/OPAR-brand-assets/opar-medallion-paper-1200.png" alt="" width="72" height="72" loading="lazy" decoding="async"></div>
        </div>
      </div>`
    });
  }

  return v2Document({
    title: 'Partner offers',
    description: model.description,
    active: 'shop',
    theme: 'theme-paper',
    thresholdPlace: 'DISPENSARY & OBJECTS · PARTNER DIRECTORY',
    thresholdMeta: '<span data-v2-bag-summary>0 pieces in bag</span>',
    liveHref: '/discover/',
    content: `<div class="page-shell collection-page">
      <header class="paper-opener">
        <img class="paper-opener__mark" src="/assets/brand/web/opar-mark-green.svg" alt="" aria-hidden="true" width="460" height="460" loading="lazy" decoding="async">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/v2/">Home</a></li><li aria-current="page">Partner offers</li></ol></nav>
        <div class="collection-heading">
          <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>A different way to discover</span>
          <h1>${escapeHtml(model.heading)}</h1>
          <p>${escapeHtml(model.description)}</p>
        </div>
      </header>
      <div class="hub-explainer"><span class="badge badge-partner">${escapeHtml(model.badge)}</span><p>You browse here; the purchase, delivery and returns take place on the linked merchant’s website.</p></div>
      <div class="product-cards">${list.map((p, i) => v2Card(p, i)).join('')}</div>
      <div class="paper-pause" aria-hidden="true"><img src="/assets/OPAR-brand-assets/opar-medallion-paper-1200.png" alt="" width="72" height="72" loading="lazy" decoding="async"></div>
    </div>`
  });
}

export function renderV2Category(collection, products) {
  const list = products.filter(p => p.model === 'dropshipping' && (collection.matches || []).includes(p.category));
  return v2Document({
    title: collection.heading,
    description: collection.description,
    active: 'shop',
    theme: 'theme-paper',
    thresholdPlace: `DISPENSARY & OBJECTS · ROOM / ${collection.label.toUpperCase()}`,
    thresholdMeta: '<span data-v2-bag-summary>0 pieces in bag</span>',
    liveHref: `/shop/${collection.slug}/`,
    content: `<div class="page-shell collection-page room-page">
      <header class="paper-opener">
        <img class="paper-opener__mark" src="/assets/brand/web/opar-mark-green.svg" alt="" aria-hidden="true" width="460" height="460" loading="lazy" decoding="async">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/v2/">Home</a></li><li><a href="/v2/shop/">Shop</a></li><li aria-current="page">${escapeHtml(collection.label)}</li></ol></nav>
        <div class="collection-heading">
          <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(collection.eyebrow)}</span>
          <h1>${escapeHtml(collection.heading)}</h1>
          <p>${escapeHtml(collection.intro)}</p>
        </div>
      </header>
      <div class="category-toolbar"><span class="small-note">${list.length} ${list.length === 1 ? 'piece' : 'pieces'} in this room</span><a class="text-link" href="/v2/shop/">All pieces ${arrow}</a></div>
      <div class="product-cards">${list.map((p, i) => v2Card(p, i)).join('') || `<div class="empty-collection"><p>Pieces are being selected for this room.</p><a class="text-link" href="/v2/shop/">Browse everything in V2 shop ${arrow}</a></div>`}</div>
      <div class="paper-pause" aria-hidden="true"><img src="/assets/OPAR-brand-assets/opar-medallion-paper-1200.png" alt="" width="72" height="72" loading="lazy" decoding="async"></div>
    </div>`
  });
}

function habitatContextFor(product) {
  const s = `${product.slug} ${product.name}`.toLowerCase();
  if (s.includes('ashwagandha')) {
    return {
      quote: '“The sovereign root of classical Ayurveda, recorded without stress or cure claims.”',
      title: 'Withania somnifera · Habitat Plate',
      text: 'Grown in dry sub-Himalayan soils; here presented strictly by label weight (1,300 mg per serving) while laboratory reports remain requested.',
      img: '/assets/botanicals/ashwagandha-env-forest.jpg',
      alt: 'Misty sub-Himalayan forest understory'
    };
  }
  if (s.includes('turmeric')) {
    return {
      quote: '“Rooted in domestic ritual — separated clearly from medicinal or brightening claims.”',
      title: 'Curcuma longa · Plantation Plate',
      text: 'Fresh rhizome colour paired with a plain solid cleansing formulation; therapeutic wording is withheld prior to full safety review.',
      img: '/assets/botanicals/turmeric-plantation-env.jpg',
      alt: 'Tropical turmeric leaf canopy'
    };
  }
  return null;
}

export function renderV2Product(product, products) {
  const isAffiliate = product.model === 'affiliate';
  const model = MODELS[product.model];
  const collection = !isAffiliate ? collectionFor(product) : null;
  const complianceRecord = complianceRegister.records.find(r => r.id === product.complianceId || r.productId === product.id) || null;
  const first = product.images[0];
  const isFirstEmpty = Boolean(first.isEmptyMount);
  const habitat = habitatContextFor(product);
  const paragraphs = Array.isArray(product.longDescription) && product.longDescription.length
    ? product.longDescription
    : [product.description];

  const firstVariantObj = product.variants.find(v => typeof v === 'object' && v !== null) || null;
  const initialSku = firstVariantObj?.sku || product.sourceSku || product.sourceProductId || product.id;
  const initialPrice = Number.isFinite(firstVariantObj?.price) ? firstVariantObj.price : product.price;
  const initialRateText = isAffiliate
    ? `Price on ${product.sourceName}`
    : Number.isFinite(initialPrice)
    ? `${formatMoney(initialPrice, product.currency)} ${product.currency}`
    : 'Price on request';
  const verifiedChecks = complianceRecord ? complianceRecord.items.filter(i => i.status === 'verified').length : 0;
  const totalChecks = complianceRecord ? complianceRecord.items.length : 0;
  const verificationCountLabel = complianceRecord
    ? `${verifiedChecks} of ${totalChecks} checks verified`
    : 'Construction sample';

  const verificationRows = complianceRecord
    ? [
        ['Source listing', complianceRecord.items.find(i => i.category === 'origin')?.status || 'pending'],
        ['Label / INCI', complianceRecord.items.find(i => i.category === 'labelling')?.status || 'not-provided'],
        ['Laboratory report', complianceRecord.items.find(i => i.category === 'lab-test')?.status || 'not-provided']
      ]
    : [
        ['Source listing', 'Construction sample'],
        ['Label / INCI', 'Pending intake'],
        ['Laboratory report', 'Not required yet']
      ];

  const actionsHtml = isAffiliate
    ? `<section class="purchase-panel external-panel" aria-labelledby="offer-heading">
        <h2 class="eyebrow" id="offer-heading">Partner offer</h2>
        <div class="price-row"><span class="price-value price-request">Price on ${escapeHtml(product.sourceName)}</span><span class="small-note">Confirmed on the linked merchant site.</span></div>
        <a class="button button-primary external-cta" href="${escapeHtml(product.externalUrl)}" target="_blank" rel="sponsored noopener noreferrer">View offer on ${escapeHtml(product.sourceName)} ${external}</a>
        <div class="v2-folio-actions">
          <button type="button" class="text-link v2-copy-folio" data-v2-copy-folio>Copy folio link</button>
          <output class="small-note" data-v2-copy-folio-status aria-live="polite"></output>
        </div>
        <aside class="disclosure" id="offer-disclosure"><strong>Referral disclosure</strong><p>${escapeHtml(product.disclosure)}</p></aside>
      </section>`
    : `<section class="purchase-panel" aria-labelledby="purchase-heading">
        <h2 class="eyebrow" id="purchase-heading">${escapeHtml(BRAND)} folio inquiry</h2>
        <div class="price-row">
          <span class="price-value" data-price-value>${Number.isFinite(initialPrice) ? `${escapeHtml(formatMoney(initialPrice, product.currency))} <span class="currency">${escapeHtml(product.currency)}</span>` : 'Price on request'}</span>
          <span class="small-note">${product.samplePricing ? 'Construction sample pricing · written invoice before settlement' : 'Confirmed on invoice'}</span>
        </div>
        <div class="variant-field">
          <label class="field-label" for="product-variant">Options</label>
          <select id="product-variant" data-variant${product.variants.length ? '' : ' disabled'}>
            ${product.variants.length
              ? product.variants.map(v => {
                  const isObj = typeof v === 'object' && v !== null;
                  const val = isObj && typeof v.label === 'string' ? v.label : String(v);
                  const pAttr = isObj && Number.isFinite(v.price) ? ` data-variant-price="${escapeHtml(String(v.price))}"` : '';
                  const skuAttr = isObj && typeof v.sku === 'string' && v.sku ? ` data-variant-sku="${escapeHtml(v.sku)}"` : '';
                  return `<option value="${escapeHtml(val)}"${pAttr}${skuAttr}>${escapeHtml(variantLabel(v))}</option>`;
                }).join('')
              : '<option>One edition</option>'}
          </select>
        </div>
        <div class="quantity-row">
          <span class="field-label" id="quantity-label">Quantity</span>
          <div class="quantity-control" role="group" aria-labelledby="quantity-label">
            <button type="button" aria-label="Decrease quantity" data-quantity-change="-1" disabled>&minus;</button>
            <output data-quantity aria-label="Selected quantity">1</output>
            <button type="button" aria-label="Increase quantity" data-quantity-change="1">+</button>
          </div>
        </div>
        <button type="button" class="button button-primary" data-add-to-cart
          data-product-id="${escapeHtml(product.id)}"
          data-product-name="${escapeHtml(product.name)}"
          data-product-slug="${escapeHtml(product.slug)}"
          data-product-tagline="${escapeHtml(product.tagline)}"
          data-product-price="${product.price === null || product.price === undefined ? '' : escapeHtml(String(product.price))}"
          data-product-currency="${escapeHtml(product.currency || 'GBP')}"
          data-product-category="${escapeHtml(product.category)}"
          data-product-model="${escapeHtml(product.model)}"
          data-product-path="/v2/${isAffiliate ? 'discover' : 'shop'}/${escapeHtml(product.slug)}/"
          data-product-image="${escapeHtml(first.src)}">Add to bag ${arrow}</button>
        <output class="selection-status" data-selection-status aria-live="polite">1 selected.</output>
        <div class="whatsapp-inquiry">
          <div class="v2-folio-actions">
            <a class="text-link" href="${escapeHtml(whatsappLink(`Hello ${BRAND}, enquiry regarding ${product.name} (${initialSku})`))}" target="_blank" rel="noopener noreferrer">Enquire via WhatsApp ${external}</a>
            <button type="button" class="text-link v2-copy-folio" data-v2-copy-folio>Copy folio link</button>
            <output class="small-note" data-v2-copy-folio-status aria-live="polite"></output>
          </div>
          <p class="small-note">${escapeHtml(whatsappDisclosure())}</p>
        </div>
      </section>`;

  const relatedList = products.filter(p => p.model === product.model && p.id !== product.id).slice(0, 3);
  const monographTopHtml = habitat ? `
        <div class="v2-monograph-top">
          <blockquote class="v2-monograph-quote">${escapeHtml(habitat.quote)}</blockquote>
          <div class="v2-habitat-plate">
            <img src="${escapeHtml(habitat.img)}" alt="${escapeHtml(habitat.alt)}" width="140" height="96" loading="lazy" decoding="async">
            <div><strong>${escapeHtml(habitat.title)}</strong><p>${escapeHtml(habitat.text)}</p></div>
          </div>
        </div>` : '';

  return v2Document({
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.description,
    active: 'shop',
    theme: 'theme-paper',
    thresholdPlace: `BOTANICAL FOLIO · ${product.category.toUpperCase()}`,
    thresholdMeta: '<span data-v2-bag-summary>0 pieces in bag</span>',
    liveHref: `/${isAffiliate ? 'discover' : 'shop'}/${product.slug}/`,
    scripts: ['/assets/product-pages.js'],
    content: `<div class="page-shell">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><ol>
        <li><a href="/v2/">Home</a></li>
        <li><a href="${escapeHtml(v2Href(model.path))}">${escapeHtml(model.label)}</a></li>
        ${collection ? `<li><a href="/v2/shop/${escapeHtml(collection.slug)}/">${escapeHtml(collection.label)}</a></li>` : ''}
        <li aria-current="page">${escapeHtml(product.name)}</li>
      </ol></nav>

      <article class="product-layout v2-folio-layout" data-product-model="${escapeHtml(product.model)}">
        <div class="product-gallery" data-gallery>
          <figure class="main-image product-mount" data-main-mount>
            <span class="image-corner-label">${isAffiliate ? 'Partner offer' : `${escapeHtml(BRAND)} folio`}</span>
            <img data-main-image src="${escapeHtml(first.src)}" alt="${isFirstEmpty ? '' : escapeHtml(first.alt)}" width="1200" height="1200" fetchpriority="high" decoding="async"${isFirstEmpty ? ' hidden' : ''}>
            <div class="empty-mount v2-empty-mount" data-empty-mount${isFirstEmpty ? '' : ' hidden'} aria-hidden="true">${specimenPlateMarkup(product, 0)}</div>
          </figure>
          ${product.images.length > 1 ? `<div class="gallery-thumbnails" role="group" aria-label="Product gallery">
            ${product.images.slice(0, 3).map((image, idx) => {
              const thumbEmpty = Boolean(image.isEmptyMount);
              const thumbContent = thumbEmpty
                ? `<span class="thumbnail__empty-mark" aria-hidden="true">${roomBotanicalMark(product.category)}</span>`
                : `<img src="${escapeHtml(image.src800Jpg || image.src)}" alt="" width="80" height="80" loading="lazy" decoding="async">`;
              return `<button type="button" class="thumbnail product-mount product-mount--square" aria-label="Show image ${idx + 1}: ${escapeHtml(image.alt)}" aria-pressed="${idx === 0}" data-gallery-src="${escapeHtml(image.src)}" data-gallery-alt="${escapeHtml(image.alt)}" data-gallery-caption="${escapeHtml(image.caption)}"${thumbEmpty ? ' data-gallery-empty="true"' : ''}>${thumbContent}</button>`;
            }).join('')}
            <span class="gallery-note">A closer look,<br>without the noise.</span>
          </div>` : ''}
          <p class="image-caption" data-gallery-caption>${escapeHtml(first.caption)}</p>
        </div>

        <aside class="product-information v2-folio-sheet">
          <div class="product-kicker">
            ${collection ? `<a class="eyebrow" href="/v2/shop/${escapeHtml(collection.slug)}/">${escapeHtml(product.category)}</a>` : `<span class="eyebrow">${escapeHtml(product.category)}</span>`}
            <span class="badge${isAffiliate ? ' badge-partner' : ''}">${escapeHtml(model.badge)}</span>
          </div>
          <h1>${escapeHtml(product.name)}</h1>
          <p class="tagline">${escapeHtml(product.tagline)}</p>
          <button type="button" class="wishlist-toggle" data-wishlist-toggle="${escapeHtml(product.id)}" aria-pressed="false">${icons.heart}<span data-wishlist-label>Save to wishlist</span></button>
          <p class="product-description">${escapeHtml(product.description)}</p>

          <section class="v2-folio-ref" aria-label="Folio reference and verification status">
            <div class="v2-folio-ref__head">
              <span class="v2-verify-meter__title">Folio Reference</span>
              <span class="v2-folio-ref__tally">${escapeHtml(verificationCountLabel)}</span>
            </div>
            <dl class="v2-folio-ref__grid">
              <div><dt>SKU</dt><dd data-v2-folio-sku data-base-sku="${escapeHtml(initialSku)}">${escapeHtml(initialSku)}</dd></div>
              <div><dt>Format</dt><dd>${escapeHtml(product.format || '—')}</dd></div>
              <div><dt>Source</dt><dd>${escapeHtml(product.sourceName)}</dd></div>
              <div><dt>Rate</dt><dd data-v2-folio-rate data-base-rate="${escapeHtml(initialRateText)}" data-currency="${escapeHtml(product.currency || 'GBP')}">${escapeHtml(initialRateText)}</dd></div>
            </dl>
            <div class="v2-verify-meter" aria-label="Verification status summary">
              ${verificationRows.map(([lbl, st]) => `<div class="v2-verify-row"><span>${escapeHtml(lbl)}</span><span class="status-pill status-${escapeHtml(st === 'verified' ? 'verified' : st === 'pending' ? 'pending' : 'not-provided')}">${escapeHtml(st)}</span></div>`).join('')}
            </div>
          </section>

          ${actionsHtml}

          <div class="source-note"><span class="eyebrow">Sourcing note · ${escapeHtml(product.sourceName)}</span><p>${escapeHtml(product.dataNote)}</p></div>
        </aside>
      </article>

      <section class="v2-monograph-band" aria-labelledby="v2-monograph-title">
        <div class="v2-monograph-head">
          <div>
            <span class="eyebrow">Factual record &amp; care</span>
            <h2 id="v2-monograph-title">Material provenance monograph</h2>
          </div>
          <span class="small-note">${escapeHtml(product.category)} · ${escapeHtml(product.sourceName)}</span>
        </div>
        ${monographTopHtml}
        <div class="v2-monograph-columns">
          <div class="v2-monograph-prose">
            ${paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
          </div>
          <div class="v2-monograph-aside">
            ${product.careGuide ? `<div class="care-callout"><span class="eyebrow">Care &amp; handling</span><p>${escapeHtml(product.careGuide)}</p></div>` : ''}
            <div class="v2-censor-stamp">
              <span class="v2-censor-stamp__seal">What OPAR Will Not Claim</span>
              <p>${escapeHtml(complianceRecord?.publicSummary || 'Unverified treatment, brightening, cure, or unsubstantiated certification copy is stripped from this folio.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="v2-claims-ledger" aria-labelledby="v2-ledger-heading">
        <div class="section-heading">
          <span class="eyebrow">Radical transparency · Verified record</span>
          <h2 id="v2-ledger-heading">Known &amp; Documented</h2>
        </div>
        <div class="v2-ledger-col">
          <ul class="v2-ledger-list v2-ledger-list--specs">
            ${product.specifications.map(spec => `<li><span><strong>${escapeHtml(spec.label)}</strong></span><span>${escapeHtml(spec.value)}</span></li>`).join('')}
          </ul>
        </div>
      </section>

      <div class="paper-pause" aria-hidden="true"><img src="/assets/OPAR-brand-assets/opar-medallion-paper-1200.png" alt="" width="72" height="72" loading="lazy" decoding="async"></div>

      <section class="related-section" aria-labelledby="related-heading">
        <div class="section-heading"><span class="eyebrow">Continue through the herbarium</span><h2 id="related-heading">Related folios</h2></div>
        <div class="product-cards">${relatedList.map((p, i) => v2Card(p, i)).join('')}</div>
      </section>
    </div>`
  });
}

function renderV2SacredMossPage(page) {
  const roman = ['I', 'II', 'III', 'IV', 'V'];
  const isMusic = page.path === '/perennis/music/';
  const isBooks = page.path === '/perennis/books/';

  const blocksHtml = (page.blocks || []).map((section, idx) => `
    <section class="v2-finepress-section">
      <span class="v2-roman-numeral" aria-hidden="true">${roman[idx] || String(idx + 1)}</span>
      ${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}
      ${(section.paragraphs || []).map((p, pIdx) => `<p${pIdx === 0 ? ' class="v2-dropcap"' : ''}>${escapeHtml(p)}</p>`).join('')}
      ${section.links ? `<div class="content-links">${section.links.map(l => `<a class="text-link" href="${escapeHtml(v2Href(l.href))}">${escapeHtml(l.label)} ${arrow}</a>`).join('')}</div>` : ''}
    </section>`).join('');

  const musicPlate = isMusic ? `
    <section class="v2-listening-plate" aria-labelledby="v2-listening-title">
      <img class="v2-listening-seal" src="/assets/OPAR-brand-assets/opar-medallion-ground-1200.png" alt="OPAR double-ring listening seal" width="190" height="190" loading="lazy" decoding="async">
      <span class="eyebrow">Dark Linen Acoustic Chamber · Consent-First Plate</span>
      <h2 id="v2-listening-title" class="v2-listening-title">Raga Yaman — Evening Alap Study</h2>
      <p class="v2-listening-credit">Attribution held at source &middot; Artist Channel Embed Slot</p>
      <div class="v2-listening-veil" data-v2-listening-veil>
        <p>External audio players stay dormant until you explicitly open them, so third-party embeds never track page visits uninvited.</p>
        <button type="button" class="button button-primary button-small" data-v2-consent-load>Load external recording slot ${arrow}</button>
      </div>
      <div class="v2-listening-deck" data-v2-listening-deck hidden tabindex="-1">
        <span class="eyebrow">Consent recorded for this session</span>
        <p class="v2-listening-deck__copy">When approved recordings are published in <code>perennis/music</code>, clicking above mounts the artist’s official embed here with full attribution.</p>
      </div>
    </section>` : '';

  const colophon = isBooks ? `
    <aside class="v2-colophon" aria-labelledby="v2-colophon-heading">
      <span class="eyebrow">Fine-Press Colophon · Edition Proof</span>
      <h2 id="v2-colophon-heading">How every Perennis volume is set</h2>
      <p>Each edition carries verified public-domain or written permission documentation before any reading text or download appears.</p>
      <dl class="v2-colophon-grid">
        <div><dt>Typography</dt><dd>Cormorant Garamond · 58ch measure</dd></div>
        <div><dt>Primary Format</dt><dd>Public HTML reader first; EPUB / PDF gated cleanly</dd></div>
        <div><dt>Rights Register</dt><dd>Exact edition basis checked per volume</dd></div>
        <div><dt>Reader Access</dt><dd>Public reading pages; no account required</dd></div>
      </dl>
    </aside>` : '';

  return v2Document({
    title: page.title,
    description: page.description,
    active: page.section || null,
    theme: null,
    thresholdPlace: `SANCTUARY · ${page.eyebrow.toUpperCase()}`,
    thresholdMeta: 'Fine-Press Reading Mode · Zero Commerce Scripts',
    liveHref: page.path,
    content: `<div class="page-shell">
      <header class="v2-chapter-opener">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/v2/">Home</a></li>${page.parent ? `<li><a href="${escapeHtml(v2Href(page.parent.href))}">${escapeHtml(page.parent.label)}</a></li>` : ''}<li aria-current="page">${escapeHtml(page.label)}</li></ol></nav>
        <div class="collection-heading">
          <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(page.eyebrow)}</span>
          <h1>${escapeHtml(page.heading)}</h1>
          <p>${escapeHtml(page.intro)}</p>
        </div>
      </header>
      ${musicPlate}
      <div class="v2-finepress">
        ${blocksHtml}
        ${colophon}
        ${page.note ? `<p class="page-note">${escapeHtml(page.note)}</p>` : ''}
      </div>
    </div>`
  });
}

function v2CheckoutSection() {
  const countries = ['United Kingdom', 'Ireland', 'France', 'Germany', 'Netherlands', 'United States', 'Canada', 'Australia', 'India', 'Bangladesh', 'Other'];
  const waHref = whatsappLink(`Hello ${BRAND}, I have submitted an invoice request and would like to confirm details.`);
  return `
      <section class="checkout-block" aria-labelledby="checkout-heading">
        <div class="checkout-layout">
          <div class="checkout-main">
            <p class="commerce-status" data-checkout-status role="status" aria-live="polite">Reading your cart…</p>
            <form class="checkout-form" data-checkout-form>
              <fieldset><legend>Contact</legend>
                <div class="field-grid">
                  <label class="field"><span>Full name</span><input name="name" autocomplete="name" required></label>
                  <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
                </div>
              </fieldset>
              <fieldset><legend>Delivery</legend>
                <div class="field-grid">
                  <label class="field"><span>Country</span><select name="country" autocomplete="country-name" required>${countries.map(c => `<option>${escapeHtml(c)}</option>`).join('')}</select></label>
                  <label class="field"><span>City</span><input name="city" autocomplete="address-level2" required></label>
                  <label class="field field-wide"><span>Address</span><input name="address" autocomplete="street-address" required></label>
                  <label class="field"><span>Postcode</span><input name="postcode" autocomplete="postal-code"></label>
                  <label class="field"><span>Phone (optional)</span><input name="phone" type="tel" autocomplete="tel"></label>
                </div>
              </fieldset>
              <fieldset class="payment-preferences"><legend>Payment preference</legend>
                <p class="small-note">We will confirm payment with you after the request. No card number, PIN, OTP or instant payment is processed on this site.</p>
                <div class="payment-groups">
                  <div class="payment-group" role="group" aria-labelledby="pay-group-intl">
                    <span class="field-label" id="pay-group-intl">Options</span>
                    <label class="radio-field"><input type="radio" name="paymentMethod" value="International invoice / hosted payment link after confirmation" checked><span>International invoice / hosted payment link sent after confirmation</span></label>
                    <label class="radio-field"><input type="radio" name="paymentMethod" value="Bank transfer after written invoice"><span>Bank transfer after written invoice</span></label>
                  </div>
                </div>
              </fieldset>
              <fieldset><legend>Notes</legend>
                <label class="field field-wide"><span>Anything ${escapeHtml(BRAND)} should know</span><textarea name="notes" rows="4"></textarea></label>
                <label class="check-field"><input type="checkbox" name="consent" required><span>I understand this is an invoice request, not a payment, and that price and delivery are confirmed in writing first.</span></label>
              </fieldset>
              <button class="button button-primary" type="submit" data-checkout-submit>Issue Proforma Request ${arrow}</button>
            </form>

            <div class="checkout-confirmation v2-proforma" data-checkout-confirmation data-v2-proforma hidden tabindex="-1">
              <div class="v2-proforma__head">
                <div>
                  <span class="eyebrow">Atelier Proforma Inquiry Sheet</span>
                  <h2>Reference <span data-checkout-reference data-v2-proforma-ref>—</span></h2>
                  <p class="small-note" data-v2-proforma-recipient></p>
                </div>
                <img class="v2-proforma__seal" src="/assets/OPAR-brand-assets/opar-medallion-paper-1200.png" alt="OPAR archival seal" width="64" height="64" loading="lazy" decoding="async">
              </div>
              <p class="v2-proforma__copy" data-checkout-confirmation-copy>Your request is recorded in this browser. ${escapeHtml(BRAND)} replies with a written invoice before settlement.</p>
              <p class="small-note" data-checkout-confirmation-method></p>
              <table class="v2-proforma__table" aria-label="Proforma summary">
                <thead><tr><th>Item</th><th>Qty</th><th>Rate</th></tr></thead>
                <tbody data-v2-proforma-lines></tbody>
                <tfoot><tr><th colspan="2">Recorded Subtotal</th><th data-v2-proforma-total>—</th></tr></tfoot>
              </table>
              <div class="v2-proforma__actions">
                <button type="button" class="button button-primary button-small" data-v2-print-proforma>Print / Save PDF Inquiry</button>
                <button type="button" class="button button-secondary button-small" data-v2-copy-ref>Copy reference</button>
              </div>
              <div class="content-links v2-proforma__links">
                <a class="text-link" href="/v2/order/" data-checkout-track-link>Track this request ${arrow}</a>
                <a class="text-link" href="${escapeHtml(waHref)}" target="_blank" rel="noopener noreferrer" data-checkout-whatsapp>Send reference via WhatsApp ${external}</a>
                <a class="text-link" href="/v2/shop/">Continue browsing ${arrow}</a>
              </div>
            </div>
          </div>
          <aside class="checkout-summary" aria-labelledby="checkout-summary-heading">
            <div class="section-heading"><span class="eyebrow">Your selection</span><h2 id="checkout-summary-heading">Invoice summary</h2></div>
            <ul class="commerce-list" data-checkout-items></ul>
            <div class="empty-state" data-checkout-empty>
              <p>Nothing is in the bag yet.</p>
              <a class="text-link" href="/v2/shop/">Browse the V2 shop ${arrow}</a>
            </div>
            <div class="commerce-summary" data-checkout-summary hidden>
              <div class="commerce-total"><span class="eyebrow">Subtotal</span><strong data-checkout-subtotal>—</strong></div>
              <p class="commerce-price-note" data-checkout-price-note hidden>Some prices are on request.</p>
            </div>
          </aside>
        </div>
      </section>`;
}

export function renderV2Static(page) {
  if (page.section === 'perennis' || page.section === 'journal') {
    return renderV2SacredMossPage(page);
  }
  const scripts = [
    ...(page.search ? ['/assets/search.js'] : []),
    ...(page.cart ? ['/assets/cart-page.js'] : []),
    ...(page.wishlist ? ['/assets/wishlist-page.js'] : []),
    ...(page.checkout ? ['/assets/checkout-page.js'] : []),
    ...(page.orderTracking ? ['/assets/order-page.js'] : []),
    ...(page.account ? ['/assets/account-page.js'] : []),
    ...(page.newsletter ? ['/assets/newsletter-page.js'] : [])
  ];
  const blocks = (page.blocks || []).map(section => `
    <section class="content-block">
      ${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}
      ${(section.paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join('')}
      ${section.links ? `<div class="content-links">${section.links.map(l => `<a class="text-link" href="${escapeHtml(v2Href(l.href))}">${escapeHtml(l.label)} ${arrow}</a>`).join('')}</div>` : ''}
    </section>`).join('');

  const special = page.checkout
    ? v2CheckoutSection()
    : page.cart
    ? `<section class="content-block commerce-block"><h2 id="cart-items-heading">Items in this browser</h2><p class="commerce-status" data-cart-status role="status" aria-live="polite">Reading the cart…</p><div class="empty-state" data-cart-empty><p>Nothing is in the cart yet.</p><a class="text-link" href="/v2/shop/">Browse the V2 shop ${arrow}</a></div><ul class="commerce-list" data-cart-items></ul><div class="commerce-summary" data-cart-summary hidden><div class="commerce-total"><span class="eyebrow">Subtotal</span><strong data-cart-subtotal>—</strong></div><a class="button button-primary" href="/v2/checkout/">Continue to Proforma Inquiry ${arrow}</a></div></section>`
    : page.wishlist
    ? `<section class="content-block commerce-block"><h2>Saved items</h2><p class="commerce-status" data-wishlist-status role="status" aria-live="polite">Reading the wishlist…</p><div class="empty-state" data-wishlist-empty><p>Nothing is saved yet.</p><a class="text-link" href="/v2/shop/">Browse the V2 shop ${arrow}</a></div><ul class="commerce-list" data-wishlist-items hidden></ul></section>`
    : page.search
    ? `<form class="search-form" role="search" action="/v2/search/" method="get"><label class="sr-only" for="search-input">Search ${escapeHtml(BRAND)}</label><input id="search-input" type="search" name="q" data-search-input placeholder="Search pieces, books, music…" autocomplete="off"><button type="submit" class="button button-primary">Search</button></form><p class="search-status" data-search-status role="status" aria-live="polite"></p><ul class="search-results" data-search-results></ul>`
    : page.orderTracking
    ? `<section class="content-block order-tracking-block"><h2>Look up a request</h2><form class="order-lookup-form" data-order-form><div class="field-grid"><label class="field"><span>Invoice reference</span><input name="reference" required placeholder="e.g. OPAR-261125-ABCD"></label><label class="field"><span>Email</span><input name="email" type="email" required></label></div><button class="button button-primary button-inline" type="submit">Look up request ${arrow}</button></form><p class="commerce-status" data-order-status role="status" aria-live="polite"></p><div class="order-lookup-result" data-order-result hidden></div></section>`
    : page.account
    ? `<section class="content-block commerce-block"><h2>Invoice requests in this browser</h2><p class="commerce-status" data-account-status role="status" aria-live="polite">Reading requests…</p><div class="empty-state" data-account-empty><p>No request is saved yet.</p><a class="text-link" href="/v2/shop/">Browse V2 shop ${arrow}</a></div><ul class="order-list" data-account-orders hidden></ul></section>`
    : page.newsletter
    ? `<section class="content-block newsletter-block"><h2>Join the letter</h2><form class="newsletter-form" data-newsletter-form><label class="field" for="newsletter-email"><span>Email address</span><input id="newsletter-email" name="email" type="email" required placeholder="you@example.com"></label><button class="button button-primary" type="submit">Subscribe</button></form><p class="commerce-status" data-newsletter-status role="status" aria-live="polite"></p><button class="text-link newsletter-remove" type="button" data-newsletter-remove hidden>Remove preference</button></section>`
    : '';

  return v2Document({
    title: page.title,
    description: page.description,
    active: page.section || null,
    theme: 'theme-paper',
    thresholdPlace: `WARM PAPER · ${page.eyebrow.toUpperCase()}`,
    thresholdMeta: '<span data-v2-bag-summary>0 pieces in bag</span>',
    liveHref: page.path,
    scripts,
    content: `<div class="page-shell static-page">
      <header class="paper-opener">
        <img class="paper-opener__mark" src="/assets/brand/web/opar-mark-green.svg" alt="" aria-hidden="true" width="460" height="460" loading="lazy" decoding="async">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/v2/">Home</a></li>${page.parent ? `<li><a href="${escapeHtml(v2Href(page.parent.href))}">${escapeHtml(page.parent.label)}</a></li>` : ''}<li aria-current="page">${escapeHtml(page.label)}</li></ol></nav>
        <div class="collection-heading">
          <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(page.eyebrow)}</span>
          <h1>${escapeHtml(page.heading)}</h1>
          <p>${escapeHtml(page.intro)}</p>
        </div>
      </header>
      ${special}${blocks}
      ${page.links ? `<div class="content-links content-links-wide">${page.links.map(link => {
        const isExt = /^https?:\/\//i.test(link.href);
        const relAttr = isExt ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a class="text-link" href="${escapeHtml(isExt ? link.href : v2Href(link.href))}"${relAttr}>${escapeHtml(link.label)} ${isExt ? external : arrow}</a>`;
      }).join('')}</div>` : ''}
      ${page.faq ? `<section class="content-block"><h2>Common questions</h2><div class="faq-list">${page.faq.map(item => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}</div></section>` : ''}
      ${page.note ? `<p class="page-note">${escapeHtml(page.note)}</p>` : ''}
    </div>`
  });
}
