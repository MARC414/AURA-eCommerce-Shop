/**
 * OPAR's dependency-free HTML templates entry point.
 */
export {
  MODELS,
  validateProduct,
  productPath,
  variantLabel,
  collectionFor,
  categoryPath,
  productJsonLd,
  formatMoney,
  card,
  renderDropshippingPage,
  renderAffiliatePage
} from './product-page.mjs';
export { renderCollection, renderCategoryPage } from './collection-pages.mjs';
export {
  renderStaticPage,
  renderNotFoundPage,
  journalEntryPath,
  validateJournalEntry,
  renderJournalArchivePage,
  renderJournalEntryPage
} from './app-pages.mjs';
export { renderHomePage } from './home-page.mjs';
export { escapeHtml, foliage, journal } from './chrome.mjs';
export {
  getConfiguredOrigin,
  normalizeRoutePath,
  resolveCanonicalUrl,
  normalizeMetaDescription,
  resolveDocumentSeo,
  renderSeoHeadTags,
  createSeoRegistry,
  auditRenderedPages
} from './seo-service.mjs';
