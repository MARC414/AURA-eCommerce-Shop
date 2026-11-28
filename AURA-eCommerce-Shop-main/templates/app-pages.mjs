/**
 * The applications: content pages, and the cart, checkout, order-tracking,
 * account, search, wishlist, newsletter, and 404 recovery sections. The markup
 * is static; the behaviour is in public/assets/*.js.
 */

import { readFileSync } from 'node:fs';
import {
  BRAND,
  escapeHtml,
  arrow,
  external,
  documentPage,
  whatsappLink,
  whatsappDisclosure,
  medallionPictureMarkup,
  journal,
  site
} from './chrome.mjs';
import { renderReferenceHero, renderReferenceNewsletter } from './reference-layouts.mjs';

const complianceRegister = JSON.parse(readFileSync(new URL('../data/compliance.json', import.meta.url), 'utf8'));
const pilotProducts = JSON.parse(readFileSync(new URL('../data/pilot-products.json', import.meta.url), 'utf8'));

const JOURNAL_DESKS = ['plants-and-practice', 'mind-and-body', 'worldly-and-divine'];
const FORBIDDEN_JOURNAL_PATTERNS = [
  /\banti[-\s]?acne\b/i,
  /\bclinically\s+proven\b/i,
  /\bcures?\b/i,
  /\btreats?\s+(?:acne|anxiety|depression|disease|illness|insomnia)\b/i,
  /\bverified\s+buyer\b/i,
  /\b5[-\s]?star\b/i
];

export function journalEntryPath(entry) {
  return `/journal/${entry.desk}/${entry.slug}/`;
}

export function validateJournalEntry(entry) {
  if (!entry || typeof entry !== 'object') throw new Error('Journal entry must be an object.');
  if (!JOURNAL_DESKS.includes(entry.desk)) throw new Error(`Unknown journal desk: ${entry.desk}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug || '')) throw new Error(`Invalid journal slug: ${entry.slug}`);
  if (!entry.id || !entry.title || !entry.deck || !entry.deskLabel) {
    throw new Error(`Journal entry ${entry.slug || entry.id} needs id, title, deck, and deskLabel.`);
  }
  if (!Array.isArray(entry.sections) || !entry.sections.length) {
    throw new Error(`Journal entry ${entry.slug} needs at least one reading section.`);
  }
  if (!entry.provenance?.verifiedFact || !entry.provenance?.attributedTradition || !entry.provenance?.withheldOutcome) {
    throw new Error(`Journal entry ${entry.slug} requires provenance triplet (verifiedFact, attributedTradition, withheldOutcome).`);
  }
  const text = [
    entry.title,
    entry.kicker,
    entry.deck,
    ...entry.sections.flatMap(sec => [sec.heading, ...(sec.paragraphs || [])]),
    entry.seo?.title,
    entry.seo?.description
  ].filter(Boolean).join(' ');
  for (const pattern of FORBIDDEN_JOURNAL_PATTERNS) {
    if (pattern.test(text)) {
      throw new Error(`Journal entry ${entry.slug} contains prohibited claim wording (${pattern}).`);
    }
  }
  return entry;
}

function checkoutSection() {
  const countries = ['United Kingdom', 'Ireland', 'France', 'Germany', 'Netherlands', 'Belgium', 'Spain', 'Italy', 'Portugal', 'Sweden', 'Denmark', 'Norway', 'Switzerland', 'United States', 'Canada', 'Australia', 'New Zealand', 'India', 'Bangladesh', 'Japan', 'Singapore', 'United Arab Emirates', 'Other'];
  const waHref = whatsappLink(`Hello ${BRAND}, I have submitted an invoice request and would like to confirm details.`);
  return `
      <section class="checkout-block" aria-labelledby="checkout-heading">
        <div class="checkout-layout">
          <div class="checkout-main">
            <p class="commerce-status" data-checkout-status role="status" aria-live="polite">Reading your cart…</p>
            <form class="checkout-form" data-checkout-form>
              <fieldset>
                <legend>Contact</legend>
                <div class="field-grid">
                  <label class="field"><span>Full name</span><input name="name" autocomplete="name" required></label>
                  <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Delivery</legend>
                <div class="field-grid">
                  <label class="field"><span>Country</span><select name="country" autocomplete="country-name" required>${countries.map(country => `<option>${escapeHtml(country)}</option>`).join('')}</select></label>
                  <label class="field"><span>City</span><input name="city" autocomplete="address-level2" required></label>
                  <label class="field field-wide"><span>Address</span><input name="address" autocomplete="street-address" required></label>
                  <label class="field"><span>Postcode</span><input name="postcode" autocomplete="postal-code"></label>
                  <label class="field"><span>Phone (optional)</span><input name="phone" type="tel" autocomplete="tel"></label>
                </div>
              </fieldset>
              <fieldset class="payment-preferences">
                <legend>Payment preference</legend>
                <p class="small-note">We will confirm payment with you after the request. No card number, PIN, OTP or instant payment is processed on this site.</p>
                <div class="payment-groups">
                  <div class="payment-group" role="group" aria-labelledby="pay-group-intl">
                    <span class="field-label" id="pay-group-intl">International options</span>
                    <label class="radio-field"><input type="radio" name="paymentMethod" value="International invoice / hosted payment link after confirmation" checked><span>International invoice / hosted payment link sent after confirmation</span></label>
                    <label class="radio-field"><input type="radio" name="paymentMethod" value="International payment wallet invoice after confirmation"><span>International payment wallet invoice after confirmation</span></label>
                    <label class="radio-field"><input type="radio" name="paymentMethod" value="International bank transfer after confirmation"><span>International bank transfer (details supplied on written invoice)</span></label>
                  </div>
                  <div class="payment-group" role="group" aria-labelledby="pay-group-local">
                    <span class="field-label" id="pay-group-local">Domestic options</span>
                    <label class="radio-field"><input type="radio" name="paymentMethod" value="Domestic bank transfer after confirmation"><span>Domestic bank transfer after confirmation</span></label>
                    <label class="radio-field"><input type="radio" name="paymentMethod" value="Regional mobile wallet on confirmation"><span>Regional mobile wallet on confirmation</span></label>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>Notes</legend>
                <label class="field field-wide"><span>Anything ${BRAND} should know about this request</span><textarea name="notes" rows="4"></textarea></label>
                <label class="check-field"><input type="checkbox" name="consent" required><span>I understand this is an invoice request, not a payment, and that price, delivery and settlement are confirmed in writing first.</span></label>
              </fieldset>
              <button class="button button-primary" type="submit" data-checkout-submit>Request invoice ${arrow}</button>
              <p class="action-note">No card details are collected. The request is saved in this browser until a server is connected.</p>
            </form>
            <div class="checkout-confirmation v2-proforma" data-checkout-confirmation data-v2-proforma hidden tabindex="-1">
              <div class="v2-proforma__head">
                <div>
                  <span class="eyebrow">Atelier Proforma Inquiry Sheet</span>
                  <h2>Reference <span data-checkout-reference data-v2-proforma-ref>—</span></h2>
                  <p class="small-note" data-v2-proforma-recipient></p>
                </div>
                ${medallionPictureMarkup('paper', { className: 'v2-proforma__seal', alt: 'OPAR archival seal', width: 64, height: 64 })}
              </div>
              <p class="v2-proforma__copy" data-checkout-confirmation-copy>Your request is saved in this browser. ${BRAND} replies with a written invoice before anything is paid.</p>
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
                <a class="text-link" href="/order/" data-checkout-track-link>Track this request ${arrow}</a>
                <a class="text-link" href="${escapeHtml(waHref)}" target="_blank" rel="noopener noreferrer" data-checkout-whatsapp>Send reference via WhatsApp ${external}</a>
                <a class="text-link" href="/account/">View saved requests ${arrow}</a>
                <a class="text-link" href="/shop/">Continue browsing ${arrow}</a>
              </div>
              <p class="small-note">${escapeHtml(whatsappDisclosure())}</p>
            </div>
            <noscript><p class="page-note">Checkout needs JavaScript to read the cart and save the request in this browser. Nothing has been sent anywhere.</p></noscript>
          </div>
          <aside class="checkout-summary" aria-labelledby="checkout-summary-heading">
            <div class="section-heading"><span class="eyebrow">Your selection</span><h2 id="checkout-summary-heading">Invoice summary</h2></div>
            <ul class="commerce-list" data-checkout-items></ul>
            <div class="empty-state" data-checkout-empty>
              <p>Nothing is in the cart yet.</p>
              <p class="small-note">Add a piece from the shop to request an invoice.</p>
              <a class="text-link" href="/shop/">Browse the shop ${arrow}</a>
            </div>
            <div class="commerce-summary" data-checkout-summary hidden>
              <div class="commerce-total"><span class="eyebrow">Subtotal</span><strong data-checkout-subtotal>—</strong></div>
              <p class="commerce-price-note" data-checkout-price-note hidden>Some prices are on request. ${BRAND} sets the full amount on your invoice.</p>
              <p class="action-note">Delivery and any import charges are added to the written invoice.</p>
            </div>
          </aside>
        </div>
      </section>`;
}

function orderSection() {
  return `
      <section class="content-block order-tracking-block" aria-labelledby="order-lookup-heading">
        <div class="sample-banner sample-banner--paper" role="note">
          <span class="eyebrow">Saved on this browser</span>
          <p>Requests shown here come from this browser only because no live server is connected yet.</p>
        </div>
        <h2 id="order-lookup-heading">Look up a request</h2>
        <form class="order-lookup-form" data-order-form>
          <div class="field-grid">
            <label class="field"><span>Invoice reference</span><input name="reference" required placeholder="e.g. OPAR-261121-ABCD" autocomplete="off"></label>
            <label class="field"><span>Email address used at checkout</span><input name="email" type="email" required placeholder="you@example.com" autocomplete="email"></label>
          </div>
          <button class="button button-primary button-inline" type="submit">Look up request ${arrow}</button>
        </form>
        <p class="commerce-status" data-order-status role="status" aria-live="polite">Enter your reference and email to check a saved request.</p>
        <div class="order-lookup-result" data-order-result hidden></div>
        <noscript><p class="page-note">Order lookup needs JavaScript to read this browser’s storage. Nothing has been sent anywhere.</p></noscript>
      </section>`;
}

function accountSection() {
  return `
      <section class="content-block commerce-block" aria-labelledby="account-heading">
        <h2 id="account-heading">Invoice requests in this browser</h2>
        <p class="commerce-status" data-account-status role="status" aria-live="polite">Reading requests…</p>
        <div class="empty-state" data-account-empty>
          <p>No request is saved yet.</p>
          <p class="small-note">Requests made on this device appear here with their reference.</p>
          <a class="text-link" href="/shop/">Browse the shop ${arrow}</a>
        </div>
        <ul class="order-list" data-account-orders hidden></ul>
        <noscript><p class="page-note">This list needs JavaScript to read this browser’s storage. Nothing has been sent anywhere.</p></noscript>
      </section>`;
}

function newsletterSection() {
  return `
      <section class="content-block newsletter-block" aria-labelledby="newsletter-heading">
        <h2 id="newsletter-heading">Join the letter</h2>
        <form class="newsletter-form" data-newsletter-form>
          <label class="field" for="newsletter-email"><span>Email address</span>
            <input id="newsletter-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com">
          </label>
          <button class="button button-primary" type="submit">Subscribe</button>
        </form>
        <p class="commerce-status" data-newsletter-status role="status" aria-live="polite"></p>
        <button class="text-link newsletter-remove" type="button" data-newsletter-remove hidden>Remove my preference from this browser</button>
        <noscript><p class="page-note">This form needs JavaScript to save the preference in this browser. Nothing has been sent anywhere.</p></noscript>
      </section>`;
}

function renderSacredMossPage(page, shellOptions) {
  const roman = ['I', 'II', 'III', 'IV', 'V'];
  const isMusic = page.path === '/perennis/music/';
  const isBooks = page.path === '/perennis/books/';
  const parent = page.parent
    ? `<li><a href="${escapeHtml(page.parent.href)}">${escapeHtml(page.parent.label)}</a></li>`
    : '';

  const blocksHtml = (page.blocks || []).map((section, idx) => `
    <section class="v2-finepress-section">
      <span class="v2-roman-numeral" aria-hidden="true">${roman[idx] || String(idx + 1)}</span>
      ${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}
      ${(section.paragraphs || []).map((p, pIdx) => `<p${pIdx === 0 ? ' class="v2-dropcap"' : ''}>${escapeHtml(p)}</p>`).join('')}
      ${section.links ? `<div class="content-links">${section.links.map(l => `<a class="text-link" href="${escapeHtml(l.href)}">${escapeHtml(l.label)} ${arrow}</a>`).join('')}</div>` : ''}
    </section>`).join('');

  const musicPlate = isMusic ? `
    <section class="v2-listening-plate" aria-labelledby="v2-listening-title">
      ${medallionPictureMarkup('ground', { className: 'v2-listening-seal', alt: 'OPAR double-ring listening seal', width: 190, height: 190 })}
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

  return documentPage({
    title: page.title,
    description: page.description,
    canonical: page.path,
    active: page.section || null,
    theme: null,
    seo: {
      type: 'library',
      context: `${page.label} inside Perennis, ${BRAND}'s free public reading and listening room with verified edition provenance.`
    },
    ...shellOptions,
    content: `<div class="page-shell">
      <header class="v2-chapter-opener">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${parent}<li aria-current="page">${escapeHtml(page.label)}</li></ol></nav>
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

function journalMetaLine(entry) {
  const parts = [
    entry.deskLabel,
    `${entry.readingMinutes || 3} min read`,
    entry.publishedDate,
    entry.provenanceBasis
  ].filter(Boolean);
  return `<div class="v2-journal-meta">${parts.map(p => `<span>${escapeHtml(p)}</span>`).join('<span class="v2-journal-meta__sep" aria-hidden="true">&middot;</span>')}</div>`;
}

function journalDeskNav(activeHref) {
  const navGroup = site.nav.find(item => item.id === 'journal');
  const items = navGroup?.children || [{ label: 'All writing', href: '/journal/' }];
  return `<nav class="v2-journal-desk-nav" aria-label="Journal desks">${items.map(item => `<a href="${escapeHtml(item.href)}"${item.href === activeHref ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`).join('')}</nav>`;
}

export function renderJournalArchivePage(page, journalEntries = journal, shellOptions = {}) {
  const roman = ['I', 'II', 'III', 'IV', 'V'];
  const parent = page.parent
    ? `<li><a href="${escapeHtml(page.parent.href)}">${escapeHtml(page.parent.label)}</a></li>`
    : '';
  const deskMatch = /^\/journal\/([a-z-]+)\/$/.exec(page.path);
  const deskSlug = deskMatch ? deskMatch[1] : null;
  const scoped = deskSlug
    ? journalEntries.filter(entry => entry.desk === deskSlug)
    : journalEntries.slice();
  const lead = scoped.find(entry => entry.featured) || scoped[0] || null;
  const secondary = lead ? scoped.filter(entry => entry.id !== lead.id) : [];

  const leadHtml = lead ? `
    <article class="v2-journal-lead" aria-labelledby="lead-essay-heading">
      <span class="eyebrow">${escapeHtml(lead.kicker || lead.deskLabel)}</span>
      <h2 id="lead-essay-heading"><a href="${escapeHtml(journalEntryPath(lead))}">${escapeHtml(lead.title)}</a></h2>
      <p class="v2-journal-lead__deck">${escapeHtml(lead.deck)}</p>
      <div class="v2-journal-lead__foot">
        ${journalMetaLine(lead)}
        <a class="text-link" href="${escapeHtml(journalEntryPath(lead))}">Read note ${arrow}</a>
      </div>
    </article>` : `
    <section class="v2-journal-empty" aria-labelledby="journal-empty-heading">
      <span class="eyebrow">Publishing status</span>
      <h2 id="journal-empty-heading">Notes for this desk are in preparation.</h2>
      <p>Writing appears here only after botanical identification, edition provenance, and source attributions are recorded cleanly.</p>
    </section>`;

  const secondaryHtml = secondary.length ? `
    <div class="v2-journal-grid">
      ${secondary.map(entry => `
        <article class="v2-journal-card">
          <div>
            <span class="eyebrow">${escapeHtml(entry.kicker || entry.deskLabel)}</span>
            <h3><a href="${escapeHtml(journalEntryPath(entry))}">${escapeHtml(entry.title)}</a></h3>
            <p class="v2-journal-card__deck">${escapeHtml(entry.deck)}</p>
          </div>
          <div class="v2-journal-card__foot">
            ${journalMetaLine(entry)}
            <a class="text-link" href="${escapeHtml(journalEntryPath(entry))}">Read note ${arrow}</a>
          </div>
        </article>`).join('')}
    </div>` : '';

  const blocksHtml = (page.blocks || []).map((section, idx) => `
    <section class="v2-finepress-section">
      <span class="v2-roman-numeral" aria-hidden="true">${roman[idx] || String(idx + 1)}</span>
      ${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}
      ${(section.paragraphs || []).map((p, pIdx) => `<p${pIdx === 0 ? ' class="v2-dropcap"' : ''}>${escapeHtml(p)}</p>`).join('')}
      ${section.links ? `<div class="content-links">${section.links.map(l => `<a class="text-link" href="${escapeHtml(l.href)}">${escapeHtml(l.label)} ${arrow}</a>`).join('')}</div>` : ''}
    </section>`).join('');

  return documentPage({
    title: page.title,
    description: page.description,
    canonical: page.path,
    active: 'journal',
    theme: null,
    seo: {
      type: 'journal-index',
      context: `${scoped.length} documented notes in ${page.label}, separating observed fact from attributed tradition.`
    },
    ...shellOptions,
    content: `<div class="page-shell">
      <header class="v2-chapter-opener">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${parent}<li aria-current="page">${escapeHtml(page.label)}</li></ol></nav>
        <div class="collection-heading">
          <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(page.eyebrow)}</span>
          <h1>${escapeHtml(page.heading)}</h1>
          <p>${escapeHtml(page.intro)}</p>
        </div>
      </header>
      ${journalDeskNav(page.path)}
      ${leadHtml}
      ${secondaryHtml}
      <div class="v2-finepress">
        ${blocksHtml}
        ${page.note ? `<p class="page-note">${escapeHtml(page.note)}</p>` : ''}
      </div>
    </div>`
  });
}

export function renderJournalEntryPage(entry, allEntries = journal, shellOptions = {}) {
  validateJournalEntry(entry);
  const canonical = journalEntryPath(entry);
  const roman = ['I', 'II', 'III', 'IV', 'V'];
  const siblings = allEntries.filter(item => item.desk === entry.desk && item.slug !== entry.slug);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: entry.title,
      description: entry.seo?.description || entry.deck,
      articleSection: entry.deskLabel,
      datePublished: entry.publishedDate,
      author: { '@type': 'Organization', name: entry.author || `${BRAND} Editorial Desk` },
      publisher: { '@type': 'Organization', name: BRAND },
      url: canonical
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Journal', item: '/journal/' },
        { '@type': 'ListItem', position: 3, name: entry.deskLabel, item: entry.deskHref },
        { '@type': 'ListItem', position: 4, name: entry.title, item: canonical }
      ]
    }
  ];

  const sectionsHtml = entry.sections.map((section, idx) => `
    <section class="v2-finepress-section">
      <span class="v2-roman-numeral" aria-hidden="true">${roman[idx] || String(idx + 1)}</span>
      ${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}
      ${(section.paragraphs || []).map((p, pIdx) => `<p${idx === 0 && pIdx === 0 ? ' class="v2-dropcap"' : ''}>${escapeHtml(p)}</p>`).join('')}
    </section>`).join('');

  const relationHtml = entry.relatedProduct ? `
    <aside class="v2-journal-relation" aria-label="Related house section">
      <div>
        <span class="eyebrow">House Reference · Invitation only</span>
        <p>${escapeHtml(entry.relatedProduct.note)}</p>
      </div>
      <a class="text-link" href="${escapeHtml(entry.relatedProduct.href)}">${escapeHtml(entry.relatedProduct.label)} ${arrow}</a>
    </aside>` : '';

  const citationsHtml = Array.isArray(entry.citations) && entry.citations.length ? `
    <div class="v2-journal-citations">
      <span class="eyebrow">References &amp; archival records</span>
      <ol>${entry.citations.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
    </div>` : '';

  const continueLinks = siblings.length
    ? siblings.map(item => `<a class="text-link" href="${escapeHtml(journalEntryPath(item))}">${escapeHtml(item.title)} ${arrow}</a>`).join('')
    : `<a class="text-link" href="${escapeHtml(entry.deskHref)}">More in ${escapeHtml(entry.deskLabel)} ${arrow}</a><a class="text-link" href="/journal/">All Journal notes ${arrow}</a>`;

  return documentPage({
    title: entry.seo?.title || entry.title,
    description: entry.seo?.description || entry.deck,
    canonical,
    active: 'journal',
    theme: null,
    jsonLd,
    keywords: entry.seo?.keywords?.join(', ') || null,
    seo: {
      type: 'article',
      ogType: 'article',
      context: `${entry.deskLabel} essay (${entry.readingMinutes || 3} min read) with observed fact and archival citations.`
    },
    ...shellOptions,
    content: `<div class="page-shell">
      <header class="v2-chapter-opener">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/journal/">Journal</a></li><li><a href="${escapeHtml(entry.deskHref)}">${escapeHtml(entry.deskLabel)}</a></li><li aria-current="page">${escapeHtml(entry.title)}</li></ol></nav>
        <div class="collection-heading">
          <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(entry.kicker || entry.deskLabel)}</span>
          <h1>${escapeHtml(entry.title)}</h1>
          <p>${escapeHtml(entry.deck)}</p>
        </div>
        ${journalMetaLine(entry)}
      </header>
      <article class="v2-finepress">
        ${sectionsHtml}
        <aside class="v2-provenance-ledger" aria-labelledby="provenance-ledger-heading">
          <span class="eyebrow">Writing Charter · Provenance Split</span>
          <h2 id="provenance-ledger-heading">Observed Fact, Tradition, and Withheld Outcomes</h2>
          <dl class="v2-provenance-list">
            <div class="v2-provenance-row"><dt>Observed &amp; Verified Fact</dt><dd>${escapeHtml(entry.provenance.verifiedFact)}</dd></div>
            <div class="v2-provenance-row"><dt>Attributed Tradition</dt><dd>${escapeHtml(entry.provenance.attributedTradition)}</dd></div>
            <div class="v2-provenance-row"><dt>Withheld Claims</dt><dd>${escapeHtml(entry.provenance.withheldOutcome)}</dd></div>
          </dl>
        </aside>
        ${relationHtml}
        ${citationsHtml}
        <div class="content-links content-links-wide">${continueLinks}</div>
      </article>
    </div>`
  });
}

function productHrefById(productId) {
  const product = pilotProducts.find(item => item.id === productId);
  if (!product) return null;
  const prefix = product.model === 'affiliate' ? '/discover' : '/shop';
  return `${prefix}/${product.slug}/#compliance-section`;
}

function renderComplianceFaqSection(page) {
  if (!page.complianceShowcase && !(Array.isArray(page.complianceFaq) && page.complianceFaq.length)) return '';
  const statusLabels = {
    verified: 'Verified',
    pending: 'Pending',
    'not-provided': 'Not provided',
    'not-applicable': 'Not applicable'
  };
  const pillars = [
    {
      index: '01 · Supplier verification',
      title: 'Named makers & UK/EU Responsible Persons',
      body: 'Marketplace listings frequently mask who actually manufactures an item. OPAR traces beyond reseller storefronts to the factory name, country of origin, and statutory Responsible Person—explicitly recording gaps such as malformed EU addresses or missing Great Britain representatives.'
    },
    {
      index: '02 · INCI ingredient listings',
      title: 'Ordered declarations over marketing blurbs',
      body: 'Marketing highlights ("with tea tree oil and aloe") are not accepted as cosmetic ingredient disclosures. Regulated soaps and topicals require complete weight-ordered INCI lists; botanical supplements require per-serving Supplement Facts kept distinct from gross shipping weight and conflicting feed attributes.'
    },
    {
      index: '03 · Safety reports & lab COAs',
      title: 'Cosmetic CPSRs & batch Certificates of Analysis',
      body: 'Topical cosmetics require a Cosmetic Product Safety Report (CPSR) and microbiological / heavy-metal testing prior to sale. Ingestible botanicals require a batch-specific third-party COA. Packaging PDF artwork or supplier badges are never treated as safety verification or organic certification.'
    }
  ];

  const recordsHtml = (complianceRegister.records || []).map(record => {
    const items = Array.isArray(record.items) ? record.items : [];
    const verifiedCount = items.filter(item => item.status === 'verified').length;
    const outstanding = items
      .filter(item => item.status === 'not-provided' || item.status === 'pending')
      .slice(0, 3)
      .map(item => item.label)
      .join(' · ');
    const href = productHrefById(record.productId);
    const rpSummary = record.responsiblePerson
      ? `${record.responsiblePerson.name} (${record.responsiblePerson.status})`
      : 'None verified';
    return `<tr>
      <th scope="row">${href ? `<a class="text-link" href="${escapeHtml(href)}">${escapeHtml(record.productName)} ${arrow}</a>` : escapeHtml(record.productName)}</th>
      <td>${escapeHtml(record.riskTier || 'regulated')}</td>
      <td class="v2-compliance-num">${verifiedCount} / ${items.length}</td>
      <td>${escapeHtml(rpSummary)}</td>
      <td>${escapeHtml(outstanding || 'None')}</td>
    </tr>`;
  }).join('');

  const storeLevelHtml = (complianceRegister.storeLevel || []).map(control => `
    <li>
      <span class="v2-compliance-store__label">${escapeHtml(control.label)}</span>
      <span class="v2-compliance-store__status">${escapeHtml(statusLabels[control.status] || control.status)}</span>
      <p>${escapeHtml(control.note)}</p>
    </li>`).join('');

  const statusKeyHtml = Object.entries(complianceRegister.statusMeaning || {}).map(([key, meaning]) => `
    <div>
      <dt>${escapeHtml(statusLabels[key] || key)}</dt>
      <dd>${escapeHtml(meaning)}</dd>
    </div>`).join('');

  const faqHtml = Array.isArray(page.complianceFaq) && page.complianceFaq.length ? `
    <div class="v2-compliance-faq-subhead">
      <span class="eyebrow">Verification questions answered</span>
      <h3>Detailed Compliance &amp; Verification FAQ</h3>
    </div>
    <div class="faq-list v2-compliance-faq-list">
      ${page.complianceFaq.map((item, idx) => `<details${idx === 0 ? ' open' : ''}><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}
    </div>` : '';

  return `
    <section class="content-block v2-compliance-faq" id="compliance-faq" aria-labelledby="compliance-faq-heading">
      <div class="v2-compliance-faq__head">
        <span class="eyebrow">Pre-launch trust initiative · Register reviewed ${escapeHtml(complianceRegister.lastReviewed || '')}</span>
        <h2 id="compliance-faq-heading">Compliance &amp; FAQ</h2>
        <p>${escapeHtml(complianceRegister.purpose)}</p>
      </div>

      <div class="v2-compliance-pillars">
        ${pillars.map(pillar => `
          <article class="v2-compliance-pillar">
            <span class="eyebrow">${escapeHtml(pillar.index)}</span>
            <h3>${escapeHtml(pillar.title)}</h3>
            <p>${escapeHtml(pillar.body)}</p>
          </article>`).join('')}
      </div>

      <div class="v2-compliance-register">
        <div class="v2-compliance-register__head">
          <div>
            <span class="eyebrow">Live evidence snapshot</span>
            <h3>Product &amp; Store-Level Verification Register</h3>
          </div>
          <a class="text-link" href="/policies/health-disclaimer/">Health disclaimer ${arrow}</a>
        </div>
        <dl class="v2-compliance-status-key">${statusKeyHtml}</dl>
        <div class="v2-compliance-table-wrap">
          <table class="v2-compliance-table" aria-label="Product compliance register status">
            <thead>
              <tr>
                <th scope="col">Preview folio</th>
                <th scope="col">Tier</th>
                <th scope="col">Checks verified</th>
                <th scope="col">Responsible person</th>
                <th scope="col">Key outstanding files</th>
              </tr>
            </thead>
            <tbody>${recordsHtml}</tbody>
          </table>
        </div>
        <div class="v2-compliance-store">
          <span class="eyebrow">Storewide controls (${(complianceRegister.storeLevel || []).length})</span>
          <ul class="v2-compliance-store-list">${storeLevelHtml}</ul>
        </div>
      </div>

      ${faqHtml}
    </section>`;
}

/** Plain content pages plus cart, checkout, order-tracking, account, wishlist, search and newsletter apps. */
export function renderStaticPage(page, documentOptions = {}) {
  const { referenceLayout = null, ...shellOptions } = documentOptions;
  if (referenceLayout && !((referenceLayout === 'dark-hero' && ['perennis', 'journal'].includes(page.section)) || (referenceLayout === 'newsletter' && page.path === '/newsletter/' && page.newsletter))) throw new Error(`Unsupported reference layout for ${page.path}`);
  if (!/^\/[a-z0-9/-]*\/$/.test(page.path)) throw new Error(`Invalid static page path: ${page.path}`);
  if (!page.title || !page.description || !page.label || !page.heading || !page.intro) {
    throw new Error(`Static page ${page.path} needs a title, description, label, heading, and intro.`);
  }
  if (!referenceLayout && page.section === 'journal') {
    return renderJournalArchivePage(page, journal, shellOptions);
  }
  if (!referenceLayout && page.section === 'perennis') {
    return renderSacredMossPage(page, shellOptions);
  }
  const parent = page.parent
    ? `<li><a href="${escapeHtml(page.parent.href)}">${escapeHtml(page.parent.label)}</a></li>`
    : '';
  const block = section => `
      <section class="content-block">
        ${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ''}
        ${(section.paragraphs || []).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('\n        ')}
        ${section.links ? `<div class="content-links">${section.links.map(link => `<a class="text-link" href="${escapeHtml(link.href)}">${escapeHtml(link.label)} ${arrow}</a>`).join('')}</div>` : ''}
      </section>`;
  const blocks = (page.blocks || []).map(block).join('');
  const links = page.links
    ? `<div class="content-links content-links-wide">${page.links.map(link => {
        const isExt = /^https?:\/\//i.test(link.href);
        const relAttr = isExt ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a class="text-link" href="${escapeHtml(link.href)}"${relAttr}>${escapeHtml(link.label)} ${isExt ? external : arrow}</a>`;
      }).join('')}</div>`
    : '';
  const faq = page.faq ? `
      <section class="content-block">
        <h2>Common questions</h2>
        <div class="faq-list">${page.faq.map(item => `
          <details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}
        </div>
      </section>` : '';
  const search = page.search ? `
      <form class="search-form" role="search" action="/search/" method="get">
        <label class="sr-only" for="search-input">Search ${escapeHtml(BRAND)}</label>
        <input id="search-input" type="search" name="q" data-search-input placeholder="Search pieces, books, music…" autocomplete="off">
        <button type="submit" class="button button-primary">Search</button>
      </form>
      <p class="search-status" data-search-status role="status" aria-live="polite"></p>
      <ul class="search-results" data-search-results></ul>` : '';
  const cart = page.cart ? `
      <section class="content-block commerce-block" aria-labelledby="cart-items-heading">
        <h2 id="cart-items-heading">Items in this browser</h2>
        <p class="commerce-status" data-cart-status role="status" aria-live="polite">Reading the cart…</p>
        <div class="empty-state" data-cart-empty>
          <p>Nothing is in the cart yet.</p>
          <p class="small-note">The cart is kept in this browser only.</p>
          <a class="text-link" href="/shop/">Browse the shop ${arrow}</a>
        </div>
        <ul class="commerce-list" data-cart-items></ul>
        <div class="commerce-summary" data-cart-summary hidden>
          <div class="commerce-total"><span class="eyebrow">Subtotal</span><strong data-cart-subtotal>—</strong></div>
          <p class="commerce-price-note" data-cart-price-note hidden>Some pieces are priced on request, so the full amount is set on your invoice.</p>
          <a class="button button-primary" href="/checkout/">Continue to Proforma Inquiry ${arrow}</a>
          <p class="action-note">Nothing is charged on this site. Price, delivery and payment preference are confirmed in writing first.</p>
        </div>
        <noscript><p class="page-note">The cart needs JavaScript to read this browser’s storage. Nothing has been sent anywhere.</p></noscript>
      </section>` : '';
  const wishlist = page.wishlist ? `
      <section class="content-block commerce-block" aria-labelledby="wishlist-items-heading">
        <h2 id="wishlist-items-heading">Saved items</h2>
        <p class="commerce-status" data-wishlist-status role="status" aria-live="polite">Reading the wishlist…</p>
        <div class="empty-state" data-wishlist-empty>
          <p>Nothing is saved yet.</p>
          <p class="small-note">Use “Save to wishlist” on a product page. It is kept in this browser only.</p>
          <a class="text-link" href="/shop/">Browse the shop ${arrow}</a>
        </div>
        <ul class="commerce-list" data-wishlist-items hidden></ul>
        <noscript><p class="page-note">The wishlist needs JavaScript to read this browser’s storage. Nothing has been sent anywhere.</p></noscript>
      </section>` : '';
  const checkout = page.checkout ? checkoutSection() : '';
  const orderTracking = page.orderTracking ? orderSection() : '';
  const account = page.account ? accountSection() : '';
  const newsletter = page.newsletter ? newsletterSection() : '';
  const complianceSection = renderComplianceFaqSection(page);
  const allFaqs = [
    ...(Array.isArray(page.faq) ? page.faq : []),
    ...(Array.isArray(page.complianceFaq) ? page.complianceFaq : [])
  ];
  const faqJsonLd = allFaqs.length ? [{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }] : null;
  const pageScripts = [
    ...(page.search ? ['/assets/search.js'] : []),
    ...(page.cart ? ['/assets/cart-page.js'] : []),
    ...(page.wishlist ? ['/assets/wishlist-page.js'] : []),
    ...(page.checkout ? ['/assets/checkout-page.js'] : []),
    ...(page.orderTracking ? ['/assets/order-page.js'] : []),
    ...(page.account ? ['/assets/account-page.js'] : []),
    ...(page.newsletter ? ['/assets/newsletter-page.js'] : [])
  ];
  const isUtility = Boolean(page.search || page.cart || page.wishlist || page.checkout || page.account || page.newsletter || page.orderTracking);
  const usePaperTheme = isUtility || page.section === 'about' || page.section === 'policies' || page.path.startsWith('/policies/') || page.path === '/imprint/' || page.path === '/contact/' || page.path === '/help/';
  const resolvedTheme = Object.hasOwn(shellOptions, 'theme') ? shellOptions.theme : (usePaperTheme ? 'theme-paper' : null);
  return documentPage({
    title: page.title,
    description: page.description,
    canonical: page.path,
    active: page.section || null,
    theme: resolvedTheme,
    jsonLd: faqJsonLd,
    scripts: pageScripts,
    seo: {
      type: 'page',
      context: `${page.label} on ${BRAND} — transparent house standards, invoice-first inquiry, and client care.`
    },
    ...shellOptions,
    content: `${referenceLayout === 'newsletter' ? renderReferenceNewsletter({ page, form: newsletter }) : referenceLayout ? renderReferenceHero({ surface: 'moss', eyebrow: page.eyebrow, heading: page.heading, intro: page.intro, action: page.links?.find(link => link.href.startsWith('/')) || null }) : ''}<div class="page-shell static-page">
      ${referenceLayout ? '' : resolvedTheme === 'theme-paper' ? `<header class="paper-opener">
        <img class="paper-opener__mark" src="/assets/brand/web/opar-mark-green.svg" alt="" aria-hidden="true" width="460" height="460" loading="lazy" decoding="async">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${parent}<li aria-current="page">${escapeHtml(page.label)}</li></ol></nav>
        <div class="collection-heading">
          <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(page.eyebrow)}</span>
          <h1>${escapeHtml(page.heading)}</h1>
          <p>${escapeHtml(page.intro)}</p>
        </div>
      </header>` : `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${parent}<li aria-current="page">${escapeHtml(page.label)}</li></ol></nav>
      <div class="collection-heading">
        <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(page.eyebrow)}</span>
        <h1>${escapeHtml(page.heading)}</h1>
        <p>${escapeHtml(page.intro)}</p>
      </div>`}
      ${search}${cart}${wishlist}${checkout}${orderTracking}${account}${referenceLayout === 'newsletter' ? '' : newsletter}${blocks}${links}${faq}${complianceSection}
      ${page.note ? `<p class="page-note">${escapeHtml(page.note)}</p>` : ''}
    </div>`
  });
}

/**
 * F1: Dedicated static 404 recovery document (served as public/404.html & dist/404.html).
 */
export function renderNotFoundPage() {
  return documentPage({
    title: 'Page not found (404)',
    description: 'The requested page could not be found on OPAR. Browse the six shop rooms, discover partner offers, or search the catalogue.',
    canonical: '/404.html',
    robots: 'noindex, nofollow',
    theme: 'theme-paper',
    seo: {
      type: 'not-found',
      context: 'Return home or track an existing browser-saved invoice request.'
    },
    content: `<div class="page-shell static-page not-found-page">
      <header class="paper-opener">
        <img class="paper-opener__mark" src="/assets/brand/web/opar-mark-green.svg" alt="" aria-hidden="true" width="460" height="460" loading="lazy" decoding="async">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">404</li></ol></nav>
        <div class="collection-heading">
          <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>Error 404</span>
          <h1>This page was not found.</h1>
          <p>The link you followed may have moved or never existed. Nothing is lost — browse the shop rooms, search pieces, or track an existing request below.</p>
        </div>
      </header>
      <div class="content-links content-links-wide">
        <a class="text-link" href="/">Return home ${arrow}</a>
        <a class="text-link" href="/shop/">Browse all shop pieces ${arrow}</a>
        <a class="text-link" href="/discover/">View partner offers ${arrow}</a>
        <a class="text-link" href="/search/">Search ${escapeHtml(BRAND)} ${arrow}</a>
        <a class="text-link" href="/order/">Track a request ${arrow}</a>
      </div>
    </div>`
  });
}
