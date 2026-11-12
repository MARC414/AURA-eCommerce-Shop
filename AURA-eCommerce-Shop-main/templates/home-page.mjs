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

import { BRAND, collections, escapeHtml, documentPage, arrow, site, pages } from './chrome.mjs';
import { collectionFor, categoryPath, formatMoney } from './product-page.mjs';

const HERO_IMAGE = '/assets/brand/hero-opar.jpg';
// T8: the modern sources are 16:9 crops of the JPG (1920x1080), which is all
// the full-bleed hero ever displays (object-fit: cover, object-position 50% 45%).
// The AVIF is preloaded with a type attribute, so browsers without AVIF skip
// that fetch and take the WebP or the JPG instead - nobody downloads two.
const HERO_IMAGE_AVIF = '/assets/brand/hero-opar.avif';
const HERO_IMAGE_WEBP = '/assets/brand/hero-opar.webp';

const HERO_LEDE = `Objects and knowledge for a slower, more sensory life — herbs, everyday care, sound, practice and craft, described honestly. Ordering opens after the first pieces are verified.`;

/**
 * Product photography is not ready. The one supplied image is a hand holding a
 * plastic-wrapped bar against a light background: a supplier snapshot, not a
 * photograph of the piece. It breaks the owner's food-only image rule and it
 * would be the weakest picture on the page, directly under the hero. So every
 * mount is reserved until real photography exists. Set this to true and the
 * supplied images appear in the same mounts with no other change.
 */
const SHOW_SUPPLIED_IMAGERY = false;

/**
 * The Materia Medica ground. The owner asked for a long shot of sunrise crimson
 * behind the monograph header. No such photograph exists in the repository yet,
 * so this slot stays empty and the header keeps the plain ground: an empty
 * string renders no image, no scrim and no extra padding. When the file is
 * supplied (and its licence recorded), set src, width and height here — the
 * header band becomes that photograph behind a scrim, and nothing else moves.
 */
const MONOGRAPH_GROUND = null;

/**
 * The three pieces on the front shelf, in the order they are shown. Resolved
 * against the data, so a retired slug can never leave a dead card; if any slug
 * is missing the row falls back to the first three pieces rather than showing a
 * short row.
 */
const SHELF_SLUGS = ['turmeric-cleansing-soap', 'ashwagandha-with-black-pepper', 'turmeric-cleansing-pads'];

function shelfPieces(products) {
  const chosen = SHELF_SLUGS.map(slug => products.find(product => product.slug === slug)).filter(Boolean);
  return chosen.length === SHELF_SLUGS.length ? chosen : products.slice(0, 3);
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
        <h1 id="home-heading" class="home-hero__title">A world of<br><em><span class="gold">conscious</span> living.</em></h1>
        <p class="home-hero__lede">${escapeHtml(HERO_LEDE)}</p>
        <div class="home-hero__actions">
          <a class="button button-primary button-inline" href="/shop/">Enter the shop</a>
          <a class="button button-secondary button-inline" href="/about/">About ${escapeHtml(BRAND)}</a>
        </div>
      </div>
      <div class="home-hero__hairline" aria-hidden="true"></div>
    </section>`;
}

/**
 * A piece sits on a mount, not in a tile.
 *
 * The mount is the light role, because supplier photographs are shot on light
 * backgrounds and belong on paper rather than on the ground. A piece with no
 * photograph is not given a placeholder graphic: the mount is left empty with
 * its specimen index and four ticks, the way a herbarium sheet waits for its
 * specimen. A real photograph drops into the same box and changes nothing else.
 */
function featureCard(product, index) {
  const affiliate = product.model === 'affiliate';
  const path = `/${affiliate ? 'discover' : 'shop'}/${product.slug}/`;
  const image = product.images[0];
  const priced = Number.isFinite(product.price);
  const collection = collectionFor(product);
  const category = escapeHtml(product.category);
  const hasPhoto = SHOW_SUPPLIED_IMAGERY && !/\.svg$/i.test(image.src);
  const indexLabel = `${escapeHtml(BRAND)} &middot; ${String(index + 1).padStart(2, '0')}`;
  // The card carries what the piece is, not what state the shop is in. The
  // status line moved to the piece page; `cardLine` and `format` are the
  // supplier-confirmed facts, and an absent one simply renders nothing.
  const cardLine = product.cardLine || product.tagline || '';
  const format = product.format || '';

  const mount = hasPhoto
    ? `<img class="feature-card__photo" src="${escapeHtml(image.src)}" alt="" width="1000" height="1000" loading="lazy" decoding="async">`
    : `<span class="feature-card__corner feature-card__corner--tl" aria-hidden="true"></span>
            <span class="feature-card__corner feature-card__corner--tr" aria-hidden="true"></span>
            <span class="feature-card__corner feature-card__corner--bl" aria-hidden="true"></span>
            <span class="feature-card__corner feature-card__corner--br" aria-hidden="true"></span>
            <span class="feature-card__pending" aria-hidden="true">Photograph in preparation</span>`;

  return `
        <article class="feature-card">
          <a class="feature-card__mount" href="${escapeHtml(path)}" aria-hidden="true" tabindex="-1">
            <span class="feature-card__index" aria-hidden="true">${indexLabel}</span>
            ${mount}
            ${hasPhoto ? '<span class="feature-card__credit">Supplier photo</span>' : ''}
          </a>
          <div class="feature-card__copy">
            <span class="eyebrow">${collection ? `<a href="${categoryPath(collection)}">${category}</a>` : category}</span>
            <h3><a href="${escapeHtml(path)}">${escapeHtml(product.name)}</a></h3>
            ${cardLine ? `<p class="feature-card__line">${escapeHtml(cardLine)}</p>` : ''}
            <div class="feature-card__foot">
              <span class="feature-card__terms">
                ${format ? `<span class="feature-card__format">${escapeHtml(format)}</span>` : ''}
                <span class="feature-card__price">${priced ? escapeHtml(formatMoney(product.price, product.currency)) : 'Price on request'}</span>
              </span>
              <a class="text-link" href="${escapeHtml(path)}">View piece ${arrow}</a>
            </div>
          </div>
        </article>`;
}

function featured(products) {
  const pieces = shelfPieces(products);
  const note = `${pieces.length} pieces on the front shelf, from ${products.length} listed. Prices are confirmed on the invoice, and nothing is charged on this site.`;
  return `
    <section id="featured" class="home-section home-featured" aria-labelledby="featured-heading">
      <div class="home-shell">
        <div class="home-section__head">
          <div class="home-section__intro">
            <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>Featured pieces</span>
            <h2 id="featured-heading">A first look at the shelf.</h2>
          </div>
          <p class="home-section__note">${escapeHtml(note)}</p>
        </div>
        <div class="feature-grid">${pieces.map(featureCard).join('')}
        </div>
        <div class="home-featured__foot">
          <p>Every piece page states what the supplier has confirmed, what is still unchecked, and what ${escapeHtml(BRAND)} will not claim.</p>
          <a class="button button-primary button-inline" href="/shop/">View all pieces ${arrow}</a>
        </div>
      </div>
    </section>`;
}

function rooms() {
  const items = collections.map((room, index) => {
    // The circle is data-driven: a room without a matching photograph keeps the
    // text-only row rather than showing an empty disc. Once `image` is set in
    // collections.json, the same markup fills in and nothing else changes.
    const figure = room.image
      ? `
              <span class="room-index__figure"><img src="${escapeHtml(room.image)}" alt="${escapeHtml(room.imageAlt || '')}" loading="lazy" decoding="async"></span>`
      : '';
    return `
          <li>
            <a class="room-index__item" href="/shop/${escapeHtml(room.slug)}/">
              <span class="room-index__top">
                <span class="room-index__number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                <span class="room-index__arrow" aria-hidden="true">→</span>
              </span>${figure}
              <h3>${escapeHtml(room.heading)}</h3>
              <p>${escapeHtml(room.intro)}</p>
            </a>
          </li>`;
  }).join('');
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
      <img class="corner-foliage corner-foliage--neem-br" src="/assets/botanicals/corner-neem.jpg" alt="" aria-hidden="true" width="1024" height="1024" loading="lazy" decoding="async">
    </section>`;
}

/**
 * The letter. One quiet band between the rooms and the monograph: the form is
 * the same contract as /newsletter/ (`/assets/newsletter-page.js`), and while
 * no mailing service is connected both the note here and the script's own
 * status say the address stays in this browser.
 */
function newsletter() {
  return `
    <section id="letter" class="home-section home-letter" aria-labelledby="letter-heading">
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
          <noscript><p class="page-note">This form needs JavaScript to save the preference in this browser. Nothing has been sent anywhere.</p></noscript>
        </div>
      </div>
    </section>`;
}

/**
 * The journal index at the foot of the archipelago. The columns are the
 * journal's own nav children, and every line is the column page's meta
 * description read from data/pages.json, so the homepage cannot describe a
 * column differently from the page it links to. The frame is fixed here; the
 * writing will be filed under it.
 */
function journalIndex() {
  const journal = site.nav.find((item) => item.id === 'journal');
  const pageByPath = new Map(pages.map((page) => [page.path, page]));
  const root = pageByPath.get(journal.href);
  const columns = (journal.children || [])
    .filter((child) => child.href !== journal.href)
    .map((child, index) => {
      const page = pageByPath.get(child.href);
      return `
            <li>
              <a class="journal-index__column" href="${child.href}">
                <span class="journal-index__number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                <span class="journal-index__name">${escapeHtml(child.label)}${arrow}</span>
                <span class="journal-index__line">${escapeHtml(page.description)}</span>
              </a>
            </li>`;
    })
    .join('');

  return `
          <section class="journal-plate" id="journal" aria-labelledby="journal-heading">
            <div class="journal-plate__head">
              <div>
                <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>${escapeHtml(journal.label)}</span>
                <h3 id="journal-heading">${escapeHtml(root.heading)}</h3>
                <p>${escapeHtml(root.description)}</p>
              </div>
              <a class="journal-plate__all" href="${journal.href}">All writing${arrow}</a>
            </div>
            <ul class="journal-index">${columns}
            </ul>
          </section>`;
}

/**
 * The botanical monograph: three plates and a closing cluster.
 *
 * Every plate is its own ground. The habitat photograph is the section, edge to
 * edge, exactly as the hero is built; the words ride on one directional scrim.
 * No card, no radius, no border, no shadow (D-036).
 *
 * The plates sit directly in <main>, not inside a shell, so 100% is already the
 * viewport and no scrollbar arithmetic is involved.
 */
function monograph() {
  const ground = MONOGRAPH_GROUND
    ? `<img class="monograph-head__photo" src="${escapeHtml(MONOGRAPH_GROUND.src)}" alt="" aria-hidden="true" width="${MONOGRAPH_GROUND.width}" height="${MONOGRAPH_GROUND.height}" loading="lazy" decoding="async">
        <div class="monograph-head__scrim" aria-hidden="true"></div>`
    : '';
  return `
    <section id="botanicals" class="botanical-monograph${ground ? ' botanical-monograph--grounded' : ''}" aria-labelledby="monograph-heading">
      <img class="corner-foliage corner-foliage--moringa-bl" src="/assets/botanicals/corner-moringa.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">

      <div class="monograph-head${ground ? ' monograph-head--photo' : ''}">
        ${ground}
        <div class="botanical-monograph__header">
          <div class="home-section__head">
            <div class="home-section__intro">
              <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>Editorial monograph</span>
              <h2 id="monograph-heading">The materia medica: whole roots &amp; sacred seeds.</h2>
            </div>
            <p class="home-section__note">Three foods, photographed where they grow, with the lineage and the chemistry kept apart so neither has to borrow from the other.</p>
          </div>
        </div>
      </div>

      <article class="editorial-spread">
        <img class="spread-bg" src="/assets/botanicals/nigella-field-flowers.jpg" alt="Blooming Nigella sativa field with blue flowers and developing seed capsules at morning light" width="1376" height="768" loading="lazy" decoding="async">
        <div class="spread-scrim" aria-hidden="true"></div>
        <div class="editorial-spread__text">
          <span class="editorial-spread__eyebrow">
            <span class="home-rule home-rule--gold" aria-hidden="true"></span>
            Nigella sativa &middot; Black Cumin &middot; Kalo Jeera &middot; Kalonji
          </span>
          <h3 class="editorial-spread__quote">"The ancient <em>Habbat al-Barakah</em>&mdash;a remedy of restorative endurance."</h3>
          <p class="editorial-spread__heritage">
            Sahih al-Bukhari (5688), narrated by Abu Hurairah: the Prophet &#65018; said, "There is healing in
            black cumin for all diseases except death." The black seeds known as kalo jeera &mdash; also called
            kalonji or black cumin &mdash; come from the flowering <em>Nigella sativa</em> plant.
          </p>
          <div class="editorial-spread__science">
            <strong>Botany &amp; Vitality:</strong> The delicate sky-blue and white blossoms yield inflated
            seed capsules that open at maturity. The resulting angular matte-black seeds are intensely aromatic,
            rich in crystalline thymoquinone and essential fatty acids.
          </div>
          <div class="editorial-spread__actions">
            <a class="button button-secondary button-small button-inline" href="/shop/herbal-botanicals/">View Herbal Botanicals &rarr;</a>
          </div>
        </div>
        <div class="spread-figure">
          <img class="floating-specimen" src="/assets/botanicals/black-seeds-real-isolated.webp" alt="Clean pile of real black cumin seeds (Nigella sativa, kalo jeera)" width="1200" height="1168" loading="lazy" decoding="async">
        </div>
      </article>

      <article class="editorial-spread editorial-spread--reverse">
        <img class="spread-bg" src="/assets/botanicals/ashwagandha-env-forest.jpg" alt="Misty sub-Himalayan forest understory, the habitat of Withania somnifera" width="1376" height="768" loading="lazy" decoding="async">
        <div class="spread-scrim" aria-hidden="true"></div>
        <div class="editorial-spread__text">
          <span class="editorial-spread__eyebrow">
            <span class="home-rule home-rule--gold" aria-hidden="true"></span>
            Withania somnifera &middot; Whole Root
          </span>
          <h3 class="editorial-spread__quote">"The sovereign root of classical Ayurveda, yielding <em>grounded vitality</em>."</h3>
          <p class="editorial-spread__heritage">
            Recorded in the <em>Charaka Samhita</em> as the prime rasayana of serenity and deep vigor.
            An uncultivated winter-cherry root prized for nourishing the nervous system during prolonged exertion.
          </p>
          <div class="editorial-spread__science">
            <strong>Phytochemical Reality:</strong> Concentrates natural steroidal lactones (withanolides)
            that regulate physical cortisol balance and sustain endurance without artificial stimulation.
          </div>
          <div class="editorial-spread__actions">
            <a class="button button-primary button-small button-inline" href="/shop/ashwagandha-with-black-pepper/">Explore Ashwagandha Piece &rarr;</a>
          </div>
        </div>
        <div class="spread-figure">
          <img class="floating-specimen" src="/assets/botanicals/ashwagandha-bowl-roots-isolated.webp" alt="Handcrafted wooden bowl of ashwagandha root powder with carved spoon, raw root sticks and fresh leaves" width="645" height="316" loading="lazy" decoding="async">
        </div>
      </article>

      <article class="editorial-spread">
        <img class="corner-foliage corner-foliage--turmeric-tr" src="/assets/botanicals/corner-turmeric-leaf.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <img class="spread-bg" src="/assets/botanicals/turmeric-plantation-env.jpg" alt="Lush tropical turmeric plantation with vibrant green Curcuma longa leaves and morning mist" width="1376" height="768" loading="lazy" decoding="async">
        <div class="spread-scrim" aria-hidden="true"></div>
        <div class="editorial-spread__text">
          <span class="editorial-spread__eyebrow">
            <span class="home-rule home-rule--gold" aria-hidden="true"></span>
            Curcuma longa &middot; Fresh Broken Rhizome
          </span>
          <h3 class="editorial-spread__quote">"Centuries of <em>golden hearths</em> and tactile skin restoration."</h3>
          <p class="editorial-spread__heritage">
            Used across centuries of domestic ritual: polished directly onto skin for soothing purification,
            and decocted into evening milk to restore tired muscles after physical labor.
          </p>
          <div class="editorial-spread__science">
            <strong>Phytochemical Reality:</strong> The luminous orange core packs polyphenol curcuminoids;
            enhances natural skin moisture barrier and defends against oxidative environmental fatigue.
          </div>
          <div class="editorial-spread__actions">
            <a class="button button-secondary button-small button-inline" href="/shop/turmeric-cleansing-soap/">View Cleansing Soap &rarr;</a>
          </div>
        </div>
        <div class="spread-figure">
          <img class="floating-specimen" src="/assets/botanicals/turmeric-rhizomes-user-isolated.webp" alt="Freshly harvested Curcuma longa rhizomes with sliced vibrant orange interior and fine golden powder" width="506" height="289" loading="lazy" decoding="async">
        </div>
      </article>

      <div class="archipelago-block archipelago-block--journal">
        <img class="spread-bg" src="/assets/botanicals/botanical-archipelago.jpg" alt="Natural arrangement of black seeds, ashwagandha roots, fresh turmeric, moringa leaves and raw honeycomb" width="1376" height="768" loading="lazy" decoding="async">
        <div class="archipelago-visual">
          <div class="archipelago-scrim" aria-hidden="true"></div>
          <div class="archipelago-overlay">
            <div>
              <span class="home-overline"><span class="home-rule home-rule--gold" aria-hidden="true"></span>The sustenance cluster</span>
              <h3>The balanced natural ecology</h3>
              <p>When whole seeds, grounding roots, bitter leaves and raw honeycomb unite, they form a self-sustaining dietary foundation&mdash;a timeless matrix of nourishment requiring no synthetic additives.</p>
            </div>
            <a class="button button-primary button-small button-inline" href="/shop/herbal-botanicals/">Enter Botanical Apothecary &rarr;</a>
          </div>
          ${journalIndex()}
        </div>
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
    scripts: ['/assets/newsletter-page.js'],
    content: `${hero()}${featured(products)}${rooms()}${newsletter()}${monograph()}`
  });
}
