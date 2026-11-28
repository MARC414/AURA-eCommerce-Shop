/**
 * The shell: <head>, header, footer and the one document wrapper.
 *
 * Every generated page goes through documentPage(), so there is exactly one
 * place that defines the fonts, the stylesheet, the scripts, the skip link and
 * the two navigation surfaces. Nothing here knows what a product is.
 *
 * It also holds the data every renderer reads (site.json, collections.json,
 * brand.json, foliage.json) and the shared inline icon set, so a new page cannot
 * invent a second header or a second bag icon.
 */

import { readFileSync } from 'node:fs';
import { resolveDocumentSeo, renderSeoHeadTags } from './seo-service.mjs';

export const site = JSON.parse(readFileSync(new URL('../data/site.json', import.meta.url), 'utf8'));
export const collections = JSON.parse(readFileSync(new URL('../data/collections.json', import.meta.url), 'utf8'));
export const brand = JSON.parse(readFileSync(new URL('../data/brand.json', import.meta.url), 'utf8'));
export const pages = JSON.parse(readFileSync(new URL('../data/pages.json', import.meta.url), 'utf8'));
export const foliage = JSON.parse(readFileSync(new URL('../data/foliage.json', import.meta.url), 'utf8'));
export const journal = JSON.parse(readFileSync(new URL('../data/journal.json', import.meta.url), 'utf8'));
export const BRAND = brand.name;

export function medallionPictureMarkup(variant = 'paper', { className = '', alt = '', width = 72, height = 72, lazy = true } = {}) {
  const key = variant === 'ground' ? 'ground' : 'paper';
  const avif = `/assets/brand/web/opar-medallion-${key}-400.avif`;
  const webp = `/assets/brand/web/opar-medallion-${key}-400.webp`;
  const fallback = `/assets/OPAR-brand-assets/opar-medallion-${key}-1200.png`;
  const cls = className ? ` class="${escapeHtml(className)}"` : '';
  const load = lazy ? ' loading="lazy"' : '';
  return `<picture><source type="image/avif" srcset="${avif}"><source type="image/webp" srcset="${webp}"><img${cls} src="${fallback}" alt="${escapeHtml(alt)}" width="${width}" height="${height}"${load} decoding="async"></picture>`;
}

/**
 * Launch switch: generated pages are noindex until a real domain and absolute
 * canonical URLs exist. This is technical, not editorial. Flip it at go-live.
 */
const INDEXABLE = false;

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

export function whatsappLink(message = '') {
  const base = site.contact?.whatsappUrl || 'https://wa.me/447700900412';
  const text = message || `Hello ${BRAND}, I would like to enquire about an item or invoice.`;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function whatsappDisclosure() {
  return site.contact?.whatsappDisclosure
    || 'WhatsApp is a third-party messaging service (Meta); opening this link leaves OPAR.';
}

/**
 * Restrained hub foliage renderer: reads data/foliage.json only. Never renders
 * on `/` (the homepage manages its own edge botanicals) or utility routes.
 */
export function hubFoliageMarkup(routePath) {
  if (!routePath || routePath === '/') return '';
  const entry = foliage.find(item => item.page === routePath);
  if (!entry) return '';
  const corner = entry.corner || 'top-right';
  return `<img class="corner-foliage hub-foliage hub-foliage--${escapeHtml(corner)}" src="${escapeHtml(entry.asset)}" alt="" aria-hidden="true" width="${Number(entry.width) || 760}" height="${Number(entry.height) || 567}" loading="lazy" decoding="async">`;
}

export const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
export const external = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 5h5v5m0-5L9 15M10 5H5v14h14v-5"/></svg>';

/**
 * button({ label, href, variant, size, icon, attrs })
 *   variant: 'primary' (default) | 'secondary' | 'quiet' | 'icon'
 *   size:    'default' (56px)    | 'small'
 */
export function button({ label = '', href = null, variant = 'primary', size = null, icon = null, attrs = {} } = {}) {
  const variants = new Set(['primary', 'secondary', 'quiet', 'icon']);
  const sizes = new Set([null, 'small']);
  if (!variants.has(variant)) variant = 'primary';
  if (!sizes.has(size)) size = null;
  const tag = href ? 'a' : 'button';
  const cls = ['button', 'button-' + variant, size ? 'button-' + size : null].filter(Boolean).join(' ');
  const attrList = Object.entries(attrs || {}).map(([key, value]) => ` ${escapeHtml(key)}="${escapeHtml(String(value))}"`);
  const iconHtml = icon ? `<span aria-hidden="true">${icon}</span>` : '';
  const type = tag === 'button' ? ' type="button"' : '';
  const hrefAttr = href ? ` href="${escapeHtml(href)}"` : '';
  const labelHtml = label ? `<span>${escapeHtml(label)}</span>` : '';
  if (icon && !label) {
    const hasAriaLabel = attrs && (Object.hasOwn(attrs, 'aria-label') || Object.hasOwn(attrs, 'aria-labelledby'));
    const ariaFallback = hasAriaLabel ? '' : ' aria-label="Action"';
    return `<${tag} class="${cls}"${hrefAttr}${type}${attrList.join('')}${ariaFallback}>${iconHtml}</${tag}>`;
  }
  return `<${tag} class="${cls}"${hrefAttr}${type}${attrList.join('')}>${iconHtml}${labelHtml}</${tag}>`;
}

export const icons = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.4-3.6 4-5.4 7-5.4s5.6 1.8 7 5.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
};

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

function header(active = null, emblem = brand.logo.assetPathOnDark, lockup = null) {
  const utility = site.utility || {};
  const searchPublished = isPublished(utility.search);
  const search = searchPublished ? `
        <details class="nav-search">
          <summary class="utility-link nav-search__toggle" aria-label="${escapeHtml(utility.search.label)}"><span class="utility-icon">${icons.search}</span><span class="utility-label">${escapeHtml(utility.search.label)}</span></summary>
          <div class="nav-search__drawer">
            <form class="site-search" role="search" action="${escapeHtml(utility.search.action)}" method="get">
              <label class="sr-only" for="site-search-input">${escapeHtml(utility.search.placeholder)}</label>
              <input id="site-search-input" type="search" name="q" placeholder="${escapeHtml(utility.search.placeholder)}" autocomplete="off">
              <button class="site-search__submit" type="submit" aria-label="${escapeHtml(utility.search.label)}">${icons.search}</button>
              <button class="site-search__close" type="button" data-search-close aria-label="Close search" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
            </form>
          </div>
        </details>` : '';
  const utilityLink = (item, icon, extra = '') => isPublished(item)
    ? `<a class="utility-link" href="${escapeHtml(item.href)}"><span class="utility-icon">${icon}</span><span class="utility-label">${escapeHtml(item.label)}</span>${extra}</a>`
    : '';
  const status = site.status?.preview
    ? `<span class="header-status"><span aria-hidden="true"></span>${escapeHtml(site.status.label)}</span>`
    : '';
  const navItem = item => {
    const children = (item.children || []).filter(isPublished);
    const current = item.id === active ? ' aria-current="page"' : '';
    if (!children.length) {
      return `<a href="${escapeHtml(item.href)}"${current}>${escapeHtml(item.label)}</a>`;
    }
    const groups = navGroups(children);
    const panel = groups.length > 1
      ? `<div class="nav-panel nav-panel-grouped">${groups.map(([group, links]) => `
            <div class="nav-column">
              ${group ? `<span class="nav-group-label">${escapeHtml(group)}</span>` : ''}
              ${links.map(child => `<a href="${escapeHtml(child.href)}"><span>${escapeHtml(child.label)}</span>${child.note ? `<span class="nav-note">${escapeHtml(child.note)}</span>` : ''}</a>`).join('')}
            </div>`).join('')}
          </div>`
      : `<div class="nav-panel">${children.map(child => `
            <a href="${escapeHtml(child.href)}"><span>${escapeHtml(child.label)}</span>${child.note ? `<span class="nav-note">${escapeHtml(child.note)}</span>` : ''}</a>`).join('')}
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
        <a class="wordmark" href="${escapeHtml(site.brand.homeHref)}" aria-label="${escapeHtml(site.brand.name)} home">${lockup ? `<img class="wordmark-lockup" src="${escapeHtml(lockup)}" alt="" width="145" height="34">` : `<img class="wordmark-emblem" src="${escapeHtml(emblem)}" alt="${escapeHtml(brand.logo.altText)}" width="40" height="40"><span class="wordmark-text">${escapeHtml(site.brand.wordmark)}</span>${site.brand.note ? `<span class="wordmark-note">${escapeHtml(site.brand.note)}</span>` : ''}`}</a>
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
          ${status}
        </div>
      </div>
    </header>`;
}

/** Footer: Cross-the-Threshold split sanctuary/dispensary band + site contract columns + WhatsApp inquiry desk. */
function footer(emblem = brand.logo.assetPathOnDark, includeSplitBand = true) {
  const columns = site.footer.columns.map(column => {
    const id = `footer-${column.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return `
        <nav class="footer-column" aria-labelledby="${id}">
          <h2 class="footer-heading" id="${id}">${escapeHtml(column.heading)}</h2>
          ${column.links.map(link => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join('')}
        </nav>`;
  }).join('');
  const waHref = whatsappLink();
  const waNote = whatsappDisclosure();
  const splitBand = includeSplitBand ? `
      <div class="v2-split-band" aria-label="Cross the threshold">
        <section class="v2-split-wing" aria-labelledby="v2-wing-moss">
          <span class="eyebrow">Night Canopy · Free Sanctuary</span>
          <h3 id="v2-wing-moss">The Night Library</h3>
          <p>Free books, sacred sound recordings, and plant monographs set in Moss Nocturne—kept apart from commerce.</p>
          <div class="v2-split-wing__links">
            <a href="/perennis/">Perennis Library</a>
            <a href="/perennis/books/">Books</a>
            <a href="/perennis/music/">Listening Room</a>
            <a href="/journal/">Journal</a>
          </div>
        </section>
        <section class="v2-split-wing v2-split-wing--paper" aria-labelledby="v2-wing-paper">
          <span class="eyebrow">Warm Paper · Specimen Table</span>
          <h3 id="v2-wing-paper">Dispensary &amp; Objects</h3>
          <p>Objects chosen one by one on cotton-rag Warm Paper, with invoice-first inquiry and visible sourcing records.</p>
          <div class="v2-split-wing__links">
            <a href="/shop/">Shop Archive</a>
            <a href="/discover/">Partner Offers</a>
            <a href="/cart/">Bag</a>
            <a href="/checkout/">Request Invoice</a>
          </div>
        </section>
      </div>` : '';
  return `
    <footer class="${includeSplitBand ? 'site-footer v2-split-footer' : 'site-footer'}">${splitBand}
      <div class="footer-top">
        <div class="footer-brand">
          <a class="wordmark" href="${escapeHtml(site.brand.homeHref)}" aria-label="${escapeHtml(site.brand.name)} home"><img class="wordmark-emblem" src="${escapeHtml(emblem)}" alt="${escapeHtml(brand.logo.altText)}" width="28" height="28" loading="lazy" decoding="async">${escapeHtml(site.brand.wordmark)}</a>
          <p>${escapeHtml(site.brand.description)}<br>${escapeHtml(site.brand.tagline)}</p>
          <p class="footer-whatsapp"><a class="text-link" href="${escapeHtml(waHref)}" target="_blank" rel="noopener noreferrer">WhatsApp inquiry desk ${external}</a><span class="footer-whatsapp__note">${escapeHtml(waNote)}</span></p>
        </div>
        <div class="footer-columns">${columns}
        </div>
      </div>
      <div class="footer-legal">
        <p>${escapeHtml(site.footer.note)}</p>
        <p class="footer-signature">${escapeHtml(site.footer.signature)}</p>
      </div>
    </footer>`;
}

export function documentPage({ title, description, active = null, content, canonical = null, route = null, jsonLd = null, keywords = null, image = null, theme = null, scripts = [], preload = [], robots = null, identity = null, stylesheets = [], bodyClass = '', previewLabel = '', seo = null }) {
  const preloadTags = preload.map(item =>
    `<link rel="preload" as="${escapeHtml(item.as)}" href="${escapeHtml(item.href)}"${item.type ? ` type="${escapeHtml(item.type)}"` : ''}${item.fetchpriority ? ` fetchpriority="${escapeHtml(item.fetchpriority)}"` : ''}>\n  `
  ).join('');
  const isSpecimen = Boolean(previewLabel || identity);
  const resolvedSeo = resolveDocumentSeo({
    title,
    description,
    canonical: canonical ?? route,
    route,
    brandName: BRAND,
    keywords,
    image,
    robots,
    indexable: INDEXABLE,
    jsonLd,
    previewLabel,
    seo
  });
  const logo = identity
    ? { ...brand.logo, ...identity }
    : { ...brand.logo, assetPathOnLight: '/assets/brand/web/opar-mark-green.svg' };
  const headerEmblem = theme === 'theme-paper' ? logo.assetPathOnLight : logo.assetPathOnDark;
  const bodyClasses = [theme, isSpecimen ? '' : 'v2-doc', bodyClass].filter(Boolean).join(' ');
  const additionalStyles = [
    '/assets/non-home-branding.css',
    ...(isSpecimen ? [] : ['/assets/v2-editorial.css']),
    ...stylesheets
  ].map(src => `\n  <link rel="stylesheet" href="${escapeHtml(src)}">`).join('');
  const favicons = brand.logo.favicons || {};
  const iconTags = identity?.icons
    ? identity.icons.map(icon => `<link rel="${escapeHtml(icon.rel)}"${icon.type ? ` type="${escapeHtml(icon.type)}"` : ''}${icon.sizes ? ` sizes="${escapeHtml(icon.sizes)}"` : ''} href="${escapeHtml(icon.href)}">`).join('\n  ')
    : `<link rel="icon" href="${escapeHtml(favicons.ico || '/assets/OPAR-brand-assets/favicon.ico')}" sizes="any">\n  ${[['16x16', 'png16'], ['32x32', 'png32'], ['48x48', 'png48'], ['128x128', 'png128'], ['192x192', 'png192'], ['512x512', 'png512']].map(([sizes, key]) => `<link rel="icon" type="image/png" sizes="${sizes}" href="${escapeHtml(favicons[key] || (key === 'png128' ? brand.logo.tilePath : `/assets/OPAR-brand-assets/favicon-${sizes.split('x')[0]}.png`))}">`).join('\n  ')}\n  <link rel="apple-touch-icon" sizes="180x180" href="${escapeHtml(favicons.appleTouch180 || '/assets/OPAR-brand-assets/favicon-180.png')}">`;
  const previewNotice = previewLabel
    ? `\n  <aside class="brand-preview-notice" role="note"><span>${escapeHtml(previewLabel)}</span><a href="/brand-preview/#dual-surface-review">Back to comparisons</a></aside>`
    : '';
  const themeColor = theme === 'theme-paper' ? '#F4F2EE' : '#2F332B';
  const allScripts = isSpecimen
    ? ['/assets/cart.js', '/assets/site.js', ...scripts]
    : ['/assets/cart.js', '/assets/site.js', ...scripts, '/assets/v2-editorial.js'];
  const cwvTag = isSpecimen
    ? ''
    : '\n  <script src="/assets/cwv-loader.js" async fetchpriority="low"></script>';
  return `<!DOCTYPE html>
<html lang="en">
<!-- Generated by scripts/generate-product-pages.mjs. Edit the data or shared templates, not this file. -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${renderSeoHeadTags(resolvedSeo, escapeHtml)}
  <meta name="theme-color" content="${escapeHtml(themeColor)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${escapeHtml(brand.typography.googleFontsHref)}" rel="stylesheet">
  ${iconTags}
  ${preloadTags}<link rel="stylesheet" href="/assets/product-pages.css">${additionalStyles}
</head>
<body${bodyClasses ? ` class="${escapeHtml(bodyClasses)}"` : ''}>
  ${header(active, headerEmblem, theme === 'theme-paper' ? identity?.headerLockupOnLight : identity?.headerLockupOnDark)}${previewNotice}
  <main id="main-content" tabindex="-1">${content}</main>
  ${footer(logo.assetPathOnDark, !isSpecimen)}
  ${allScripts.map(src => `<script src="${escapeHtml(src)}" defer></script>`).join('\n  ')}${cwvTag}
</body>
</html>
`.replace(/[\t ]+$/gm, '');
}
