/** Opt-in reference compositions. No catalogue or commerce behavior lives here. */
import { escapeHtml, arrow } from './chrome.mjs';

export const REFERENCE_ASSETS = '/assets/OPAR-ui-mockup-templates/assets';

export function renderReferenceHero({ surface, eyebrow, heading, intro, breadcrumbs = '', action = null, meta = '' }) {
  if (!['paper', 'moss'].includes(surface)) throw new Error(`Unsupported reference surface: ${surface}`);
  return `<section class="reference-hero reference-hero--${surface}" aria-labelledby="reference-hero-heading">
    <div class="reference-hero__background" aria-hidden="true"></div>
    ${surface === 'moss' ? '<div class="reference-hero__scrim" aria-hidden="true"></div>' : ''}
    <img class="reference-hero__mark" src="${REFERENCE_ASSETS}/opar-mark-main.png" alt="" aria-hidden="true" width="720" height="720">
    <div class="reference-hero__copy">
      ${breadcrumbs}
      <span class="eyebrow">${escapeHtml(eyebrow)}</span>
      <h1 id="reference-hero-heading">${escapeHtml(heading)}</h1>
      <p class="reference-hero__intro">${escapeHtml(intro)}</p>
      ${action ? `<a class="button button-secondary reference-action" href="${escapeHtml(action.href)}">${escapeHtml(action.label)} ${arrow}</a>` : ''}
      ${meta ? `<p class="reference-hero__meta">${escapeHtml(meta)}</p>` : ''}
    </div>
  </section>`;
}

export function renderReferenceNewsletter({ page, form }) {
  return `<section class="reference-newsletter" aria-labelledby="reference-newsletter-heading">
    <div class="reference-newsletter__shade" aria-hidden="true"></div>
    <img class="reference-newsletter__mark" src="${REFERENCE_ASSETS}/opar-mark-main.png" alt="" aria-hidden="true" width="800" height="800">
    <div class="reference-newsletter__copy">
      <span class="eyebrow">${escapeHtml(page.eyebrow)}</span>
      <h1 id="reference-newsletter-heading">${escapeHtml(page.heading)}</h1>
      <p class="reference-newsletter__intro">${escapeHtml(page.intro)}</p>
      ${form}
      <p class="reference-newsletter__note">${escapeHtml(page.note)}</p>
    </div>
  </section>`;
}
