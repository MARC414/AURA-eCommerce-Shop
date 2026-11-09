/**
 * OPAR's dependency-free HTML templates.
 *
 * One shell for the whole static storefront: one header, one footer, one set of
 * design tokens. The homepage, product pages, category pages, the checkout, the
 * account and the content pages are all generated from the JSON in data/.
 *
 * The public pages do not render the internal compliance register. That record
 * stays in data/compliance.json for review; it is not a customer-facing badge
 * and it is not used as marketing.
 *
 * This file is only the entry point. The renderers live beside it:
 *
 *   chrome.mjs            <head>, header, footer, documentPage()
 *   product-page.mjs      product pages, cards, JSON-LD, price and availability
 *   collection-pages.mjs  /shop/, /discover/, the six category pages
 *   app-pages.mjs         content pages and the cart/checkout/account sections
 *   home-page.mjs         the homepage
 *
 * Import through this file so the generator and the tests have a stable surface.
 */
export {
  MODELS,
  validateProduct,
  productPath,
  variantLabel,
  productJsonLd,
  renderDropshippingPage,
  renderAffiliatePage
} from './product-page.mjs';
export { renderCollection, renderCategoryPage } from './collection-pages.mjs';
export { renderStaticPage } from './app-pages.mjs';
export { renderHomePage } from './home-page.mjs';
export { escapeHtml } from './chrome.mjs';
