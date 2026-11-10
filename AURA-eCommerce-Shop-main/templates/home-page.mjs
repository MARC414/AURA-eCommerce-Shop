/**
 * The homepage: three sections and nothing else.
 *
 * Ported from components/Hero.tsx, components/FeaturedProducts.tsx and
 * components/CategoryDiscovery.tsx in T3. The copy is the copy those
 * components carried; it is not rewritten here. What changes is the delivery:
 * this is a static document, so the hero photograph is preloaded, nothing is
 * hydrated, and the page renders completely with JavaScript off.
 *
 * Three rules the markup keeps:
 *   1. Every room comes from data/collections.json, so the index cannot list a
 *      room whose page does not exist.
 *   2. Every piece comes from data/pilot-products.json, and the price row reads
 *      "Price on request" unless the data carries a real number.
 *   3. The count in the featured standfirst is computed from the data, so it
 *      cannot go stale the way the footer room list did.
 */

import { BRAND, collections, escapeHtml, documentPage, arrow } from './chrome.mjs';
import { collectionFor, categoryPath, formatMoney } from './product-page.mjs';

const HERO_IMAGE = '/assets/brand/hero-opar.jpg';
// T8: the modern sources are 16:9 crops of the JPG (1920x1080), which is all
// the full-bleed hero ever displays (object-fit: cover, object-position 50% 45%).
// The AVIF is preloaded with a type attribute, so browsers without AVIF skip
// that fetch and take the WebP or the JPG instead - nobody downloads two.
const HERO_IMAGE_AVIF = '/assets/brand/hero-opar.avif';
const HERO_IMAGE_WEBP = '/assets/brand/hero-opar.webp';

const HERO_LEDE = `Objects and knowledge for a slower, more sensory life — herbs, everyday care, sound, practice and craft, described honestly. Ordering opens after the first pieces are verified.`;

/** The featured standfirst, counted from the data rather than written by hand. */
function featuredStandfirst(products) {
  const house = products.filter(product => product.model === 'dropshipping').length;
  const partner = products.filter(product => product.model === 'affiliate').length;
  const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
  return `${plural(products.length, 'preview', 'previews')}: ${plural(house, 'OPAR house piece', 'OPAR house pieces')} and ${plural(partner, 'partner offer', 'partner offers')}. Prices are confirmed on the invoice, and nothing is charged on this site.`;
}

function hero() {
  return `
    <section class="home-hero" aria-labelledby="home-heading">
      <div class="home-hero__photo" aria-hidden="true">
        <picture>
          <source type="image/avif" srcset="${HERO_IMAGE_AVIF}">
          <source type="image/webp" srcset="${HERO_IMAGE_WEBP}">
          <img src="${HERO_IMAGE}" alt="" width="1920" height="1080" fetchpriority="high" decoding="async">
        </picture>
      </div>
      <div class="home-hero__grade" aria-hidden="true"></div>
      <div class="grain home-hero__grain" aria-hidden="true"></div>
      <div class="hero-scrim-top" aria-hidden="true"></div>
      <div class="hero-scrim-base" aria-hidden="true"></div>
      <div class="home-shell home-hero__inner">
        <p class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(BRAND)}</p>
        <h1 id="home-heading" class="home-hero__title">A world of<br><em>conscious living.</em></h1>
        <p class="home-hero__lede">${escapeHtml(HERO_LEDE)}</p>
        <div class="home-hero__actions">
          <a class="button button-primary button-inline" href="/shop/">Enter the shop</a>
          <a class="button button-secondary button-inline" href="/about/">About ${escapeHtml(BRAND)}</a>
        </div>
      </div>
      <div class="home-hero__hairline" aria-hidden="true"></div>
    </section>`;
}

function featureCard(product) {
  const affiliate = product.model === 'affiliate';
  const path = `/${affiliate ? 'discover' : 'shop'}/${product.slug}/`;
  const image = product.images[0];
  const priced = Number.isFinite(product.price);
  const collection = collectionFor(product);
  const category = escapeHtml(product.category);
  return `
        <article class="feature-card">
          <a class="feature-card__tile" href="${escapeHtml(path)}" aria-hidden="true" tabindex="-1">
            <img src="${escapeHtml(image.src)}" alt="" width="640" height="640" loading="lazy" decoding="async">
            <span class="feature-card__tag">${affiliate ? 'Partner offer' : `${escapeHtml(BRAND)} house`}</span>
            <span class="feature-card__credit">Supplier photo</span>
          </a>
          <div class="feature-card__copy">
            <span class="eyebrow">${collection ? `<a href="${categoryPath(collection)}">${category}</a>` : category}</span>
            <h3><a href="${escapeHtml(path)}">${escapeHtml(product.name)}</a></h3>
            <p class="feature-card__meta">${affiliate ? `Seen at ${escapeHtml(product.sourceName)} · referral pending` : 'Preview · ordering not open'}</p>
            <div class="feature-card__foot">
              <span class="feature-card__price">${priced ? escapeHtml(formatMoney(product.price, product.currency)) : 'Price on request'}</span>
              <a class="button button-primary button-inline button-compact" href="${escapeHtml(path)}">View piece ${arrow}</a>
            </div>
          </div>
        </article>`;
}

function featured(products) {
  return `
    <section id="featured" class="home-section home-featured" aria-labelledby="featured-heading">
      <div class="home-shell">
        <div class="home-section__head">
          <div class="home-section__intro">
            <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>Featured pieces</span>
            <h2 id="featured-heading">A first look at the shelf.</h2>
          </div>
          <p class="home-section__note">${escapeHtml(featuredStandfirst(products))}</p>
        </div>
        <div class="feature-grid">${products.map(featureCard).join('')}
        </div>
        <div class="home-featured__foot">
          <p>Every piece page states what the supplier has confirmed, what is still unchecked, and what ${escapeHtml(BRAND)} will not claim.</p>
          <a class="button button-primary button-inline" href="/shop/">View all pieces ${arrow}</a>
        </div>
      </div>
    </section>`;
}

function rooms() {
  const items = collections.map((room, index) => `
          <li>
            <a class="room-index__item" href="/shop/${escapeHtml(room.slug)}/">
              <span class="room-index__top">
                <span class="room-index__number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                <span class="room-index__arrow" aria-hidden="true">→</span>
              </span>
              <h3>${escapeHtml(room.heading)}</h3>
              <p>${escapeHtml(room.intro)}</p>
            </a>
          </li>`).join('');
  return `
    <section id="rooms" class="home-section home-rooms" aria-labelledby="rooms-heading">
      <div class="home-shell">
        <div class="home-section__head">
          <div class="home-section__intro">
            <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>The shop</span>
            <h2 id="rooms-heading">Start with a room.</h2>
          </div>
          <p class="home-section__note">The shop is arranged as rooms rather than one long list. Each room has its own page showing what is listed there now.</p>
        </div>
        <ul class="room-index">${items}
        </ul>
      </div>
    </section>`;
}

export function renderHomePage(products = []) {
  return documentPage({
    title: 'A world of conscious living',
    description: HERO_LEDE,
    theme: 'theme-home',
    image: HERO_IMAGE,
    preload: [{ as: 'image', href: HERO_IMAGE_AVIF, type: 'image/avif', fetchpriority: 'high' }],
    content: `${hero()}${featured(products)}${rooms()}`
  });
}
