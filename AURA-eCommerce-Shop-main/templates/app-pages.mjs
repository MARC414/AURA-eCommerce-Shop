/**
 * The applications: content pages, and the cart, checkout, account, search,
 * wishlist and newsletter sections a content page can opt into. The markup is
 * static; the behaviour is in public/assets/*.js.
 */

import { BRAND, escapeHtml, arrow, documentPage } from './chrome.mjs';

/** Sections that turn a content page into an application page. */
function checkoutSection() {
  const countries = ['United Kingdom', 'Ireland', 'France', 'Germany', 'Netherlands', 'Belgium', 'Spain', 'Italy', 'Portugal', 'Sweden', 'Denmark', 'Norway', 'Switzerland', 'United States', 'Canada', 'Australia', 'New Zealand', 'India', 'Bangladesh', 'Japan', 'Singapore', 'United Arab Emirates', 'Other'];
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
              <fieldset>
                <legend>Notes</legend>
                <label class="field field-wide"><span>Anything ${BRAND} should know about this request</span><textarea name="notes" rows="4"></textarea></label>
                <label class="check-field"><input type="checkbox" name="consent" required><span>I understand this is an invoice request, not a payment, and that price and delivery are confirmed in writing first.</span></label>
              </fieldset>
              <button class="button button-primary" type="submit" data-checkout-submit>Request invoice ${arrow}</button>
              <p class="action-note">No card details are collected. The request is saved in this browser until a server is connected.</p>
            </form>
            <div class="checkout-confirmation" data-checkout-confirmation hidden tabindex="-1">
              <span class="eyebrow">Request recorded</span>
              <h2>Reference <span data-checkout-reference>—</span></h2>
              <p data-checkout-confirmation-copy>Your request is saved in this browser. ${BRAND} replies with a written invoice before anything is paid.</p>
              <div class="content-links">
                <a class="text-link" href="/account/">View saved requests ${arrow}</a>
                <a class="text-link" href="/shop/">Continue browsing ${arrow}</a>
              </div>
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

/** Plain content pages plus the checkout, account and newsletter applications. */
export function renderStaticPage(page) {
  if (!/^\/[a-z0-9/-]*\/$/.test(page.path)) throw new Error(`Invalid static page path: ${page.path}`);
  if (!page.title || !page.description || !page.label || !page.heading || !page.intro) {
    throw new Error(`Static page ${page.path} needs a title, description, label, heading, and intro.`);
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
    ? `<div class="content-links content-links-wide">${page.links.map(link => `<a class="text-link" href="${escapeHtml(link.href)}">${escapeHtml(link.label)} ${arrow}</a>`).join('')}</div>`
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
          <a class="button button-primary" href="/checkout/">Continue to request invoice ${arrow}</a>
          <p class="action-note">Nothing is charged on this site. Price, delivery and payment are confirmed in writing first.</p>
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
  const account = page.account ? accountSection() : '';
  const newsletter = page.newsletter ? newsletterSection() : '';
  const pageScripts = [
    ...(page.search ? ['/assets/search.js'] : []),
    ...(page.cart ? ['/assets/cart-page.js'] : []),
    ...(page.wishlist ? ['/assets/wishlist-page.js'] : []),
    ...(page.checkout ? ['/assets/checkout-page.js'] : []),
    ...(page.account ? ['/assets/account-page.js'] : []),
    ...(page.newsletter ? ['/assets/newsletter-page.js'] : [])
  ];
  return documentPage({
    title: page.title,
    description: page.description,
    active: page.section || null,
    theme: 'theme-paper',
    scripts: pageScripts,
    content: `<div class="page-shell static-page">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${parent}<li aria-current="page">${escapeHtml(page.label)}</li></ol></nav>
      <div class="collection-heading"><span class="eyebrow">${escapeHtml(page.eyebrow)}</span><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.intro)}</p></div>
      ${search}${cart}${wishlist}${checkout}${account}${newsletter}${blocks}${links}${faq}
      ${page.note ? `<p class="page-note">${escapeHtml(page.note)}</p>` : ''}
    </div>`
  });
}
