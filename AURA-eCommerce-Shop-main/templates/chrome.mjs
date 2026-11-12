/**
 * The shell: <head>, header, footer and the one document wrapper.
 *
 * Every generated page goes through documentPage(), so there is exactly one
 * place that defines the fonts, the stylesheet, the scripts, the skip link and
 * the two navigation surfaces. Nothing here knows what a product is.
 *
 * It also holds the data every renderer reads (site.json, collections.json,
 * brand.json) and the shared inline icon set, so a new page cannot invent a
 * second header or a second bag icon.
 */

import { readFileSync } from 'node:fs';

export const site = JSON.parse(readFileSync(new URL('../data/site.json', import.meta.url), 'utf8'));
export const collections = JSON.parse(readFileSync(new URL('../data/collections.json', import.meta.url), 'utf8'));
export const brand = JSON.parse(readFileSync(new URL('../data/brand.json', import.meta.url), 'utf8'));
/* The content pages, read here so a template can quote a page's own words
   instead of repeating them. The journal index on the homepage uses the
   column's meta description, so the two can never drift apart. */
export const pages = JSON.parse(readFileSync(new URL('../data/pages.json', import.meta.url), 'utf8'));
export const BRAND = brand.name;

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

export const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
export const external = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 5h5v5m0-5L9 15M10 5H5v14h14v-5"/></svg>';

/**
 * button({ label, href, variant, size, icon, attrs })
 *   variant: 'primary' (default) | 'secondary' | 'quiet' | 'icon'
 *   size:    'default' (56px)    | 'small'
 * One implementation, mirroring the CSS roles above. `attrs` is an object of
 * extra attributes, escaped. Values match the house spec in
 * docs/BRAND-GUIDELINES.md (§Buttons), settled 2026-11-10.
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
    return `<${tag} class="${cls}"${hrefAttr}${type}${attrList.join('')} aria-label="${escapeHtml(icon)}">${iconHtml}</${tag}>`;
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

/** Group a nav panel's children by their optional `group` label. */
function navGroups(children) {
  const groups = new Map();
  children.forEach(child => {
    const key = child.group || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(child);
  });
  return [...groups.entries()];
}

/**
 * One row at every width: identity, sections, utilities (T4.5).
 *
 * The two-row header it replaced measured 198px at 375 (a quarter of the
 * viewport) and 120px above 760, because identity + search + utilities and the
 * section menu each got their own line. Four sections, a wordmark and four
 * utilities do not fit on one 375px line, so below 761 the sections move into a
 * `<details>` panel opened from an icon: no JavaScript, no duplicated nav
 * markup, and the same Escape/closes-on-outside-click behaviour the shop panels
 * already have. Above 1100 the search is a field; below that it is an icon that
 * links to `/search/`, which carries the field.
 */
function header(active = null, emblem = brand.logo.assetPathOnDark) {
  const utility = site.utility || {};
  const searchPublished = isPublished(utility.search);
  const search = searchPublished ? `
        <form class="site-search" role="search" action="${escapeHtml(utility.search.action)}" method="get">
          <label class="sr-only" for="site-search-input">${escapeHtml(utility.search.placeholder)}</label>
          <input id="site-search-input" type="search" name="q" placeholder="${escapeHtml(utility.search.placeholder)}" autocomplete="off">
          <button type="submit" aria-label="${escapeHtml(utility.search.label)}">${icons.search}</button>
        </form>` : '';
  const utilityLink = (item, icon, extra = '') => isPublished(item)
    ? `<a class="utility-link" href="${escapeHtml(item.href)}"><span class="utility-icon">${icon}</span><span class="utility-label">${escapeHtml(item.label)}</span>${extra}</a>`
    : '';
  /* The icon form of the same destination: the field is only wide enough to be
     useful above 1100, and a submit button with no visible field is not a
     control. `/search/` has the field. */
  const searchLink = searchPublished
    ? `<a class="utility-link utility-search" href="${escapeHtml(utility.search.action)}" aria-label="${escapeHtml(utility.search.label)}">${icons.search}</a>`
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
        <a class="wordmark" href="${escapeHtml(site.brand.homeHref)}" aria-label="${escapeHtml(site.brand.name)} home"><img class="wordmark-emblem" src="${escapeHtml(emblem)}" alt="${escapeHtml(brand.logo.altText)}" width="32" height="32"><span class="wordmark-text">${escapeHtml(site.brand.wordmark)}</span><span class="wordmark-note">${escapeHtml(site.brand.note)}</span></a>
        <details class="nav-toggle">
          <summary aria-label="Menu">${icons.menu}</summary>
        </details>
        <nav class="primary-nav" aria-label="Primary navigation">
          ${site.nav.filter(isPublished).map(navItem).join('\n          ')}
        </nav>
        <div class="header-utility">${search}${searchLink}
          ${utilityLink(utility.account, icons.user)}
          ${utilityLink(utility.wishlist, icons.heart, '<span class="utility-count" data-wishlist-count hidden></span>')}
          ${utilityLink(utility.cart, icons.bag, '<span class="utility-count" data-cart-count hidden></span>')}
          ${status}
        </div>
      </div>
    </header>`;
}

/** Footer: real URLs only. No modal links, no dead sections. */
function footer(emblem = brand.logo.assetPathOnDark) {
  const columns = site.footer.columns.map(column => {
    const id = `footer-${column.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return `
        <nav class="footer-column" aria-labelledby="${id}">
          <h2 class="footer-heading" id="${id}">${escapeHtml(column.heading)}</h2>
          ${column.links.map(link => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join('')}
        </nav>`;
  }).join('');
  return `
    <footer class="site-footer">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="wordmark" href="${escapeHtml(site.brand.homeHref)}" aria-label="${escapeHtml(site.brand.name)} home"><img class="wordmark-emblem" src="${escapeHtml(emblem)}" alt="${escapeHtml(brand.logo.altText)}" width="28" height="28">${escapeHtml(site.brand.wordmark)}</a>
          <p>${escapeHtml(site.brand.description)}<br>${escapeHtml(site.brand.tagline)}</p>
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

export function documentPage({ title, description, active = null, content, canonical = null, jsonLd = null, keywords = null, image = null, theme = null, scripts = [], preload = [] }) {
  const jsonLdTag = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/<\//g, '<\\/')}</script>`
    : '';
  // Anything the browser should start fetching before the stylesheet is
  // parsed: today that is the hero photograph on the homepage. Empty by
  // default, and empty renders no tag at all, so other pages are untouched.
  const preloadTags = preload.map(item =>
    `<link rel="preload" as="${escapeHtml(item.as)}" href="${escapeHtml(item.href)}"${item.type ? ` type="${escapeHtml(item.type)}"` : ''}${item.fetchpriority ? ` fetchpriority="${escapeHtml(item.fetchpriority)}"` : ''}>\n  `
  ).join('');
  // The emblem is inked for the ground it sits on: ivory on the dark canvas,
  // paper ink on theme-paper pages. The footer is always dark.
  const headerEmblem = theme === 'theme-paper' ? brand.logo.assetPathOnLight : brand.logo.assetPathOnDark;
  return `<!DOCTYPE html>
<html lang="en">
<!-- Generated by scripts/generate-product-pages.mjs. Edit the data or shared templates, not this file. -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — ${escapeHtml(BRAND)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">\n  ` : ''}${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">\n  ` : ''}<meta name="robots" content="${INDEXABLE ? 'index, follow' : 'noindex, follow'}">
  <meta property="og:type" content="${jsonLd ? 'product' : 'website'}">
  <meta property="og:site_name" content="${escapeHtml(BRAND)}">
  <meta property="og:title" content="${escapeHtml(title)} — ${escapeHtml(BRAND)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">\n  ` : ''}${canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">\n  ` : ''}<meta name="theme-color" content="#2F332B">${jsonLdTag}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${escapeHtml(brand.typography.googleFontsHref)}" rel="stylesheet">
  <link rel="icon" type="image/png" sizes="128x128" href="${escapeHtml(brand.logo.tilePath)}">
  <link rel="apple-touch-icon" href="${escapeHtml(brand.logo.tilePath)}">
  ${preloadTags}<link rel="stylesheet" href="/assets/product-pages.css">
  ${['/assets/cart.js', '/assets/site.js', ...scripts].map(src => `<script src="${escapeHtml(src)}" defer></script>`).join('\n  ')}
</head>
<body${theme ? ` class="${theme}"` : ''}>
  ${header(active, headerEmblem)}
  <main id="main-content" tabindex="-1">${content}</main>
  ${footer(brand.logo.assetPathOnDark)}
</body>
</html>
`.replace(/[\t ]+$/gm, '');
}
