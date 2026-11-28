/**
 * OPAR Homepage (/) — Moss Nocturne threshold, pressed specimen front shelf,
 * 6 studio room medallions, full 3-plate botanical atlas, Perennis & Journal
 * archipelago, and local letter subscription.
 */

import { BRAND, collections, escapeHtml, documentPage, arrow, site, pages } from './chrome.mjs';
import { collectionFor, formatMoney, specimenPlateMarkup } from './product-page.mjs';

const HERO_IMAGE = '/assets/brand/hero-opar.jpg';
const HERO_IMAGE_AVIF = '/assets/brand/hero-opar.avif';
const HERO_IMAGE_WEBP = '/assets/brand/hero-opar.webp';

const HERO_LEDE = 'Objects and knowledge for a slower, more sensory life — herbs, everyday care, sound, practice and craft, described honestly.';

const MONOGRAPH_GROUND = {
  src: '/assets/botanicals/monograph-apiary-garden.jpg',
  avif: '/assets/botanicals/monograph-apiary-garden.avif',
  webp: '/assets/botanicals/monograph-apiary-garden.webp',
  width: 1376,
  height: 768
};

const ROOM_IMAGES = {
  'herbal-botanicals': { slug: 'herbal-botanicals', src: '/assets/products/studio-herbal-botanicals-800.jpg', avif: '/assets/products/studio-herbal-botanicals-800.avif', webp: '/assets/products/studio-herbal-botanicals-800.webp', alt: 'Amber botanical apothecary vessel' },
  'everyday-care': { slug: 'everyday-care', src: '/assets/products/studio-everyday-care-800.jpg', avif: '/assets/products/studio-everyday-care-800.avif', webp: '/assets/products/studio-everyday-care-800.webp', alt: 'Cold-process matte cleansing bar' },
  'showpieces': { slug: 'showpieces', src: '/assets/products/studio-showpieces-800.jpg', avif: '/assets/products/studio-showpieces-800.avif', webp: '/assets/products/studio-showpieces-800.webp', alt: 'Hand-turned hardwood vessel' },
  'yoga-practice': { slug: 'yoga-practice', src: '/assets/products/studio-yoga-practice-800.jpg', avif: '/assets/products/studio-yoga-practice-800.avif', webp: '/assets/products/studio-yoga-practice-800.webp', alt: 'Rolled woven mat and cork block' },
  'art-craft': { slug: 'art-craft', src: '/assets/products/studio-art-craft-800.jpg', avif: '/assets/products/studio-art-craft-800.avif', webp: '/assets/products/studio-art-craft-800.webp', alt: 'Ceramic studio craft vase' },
  'quiet-living': { slug: 'quiet-living', src: '/assets/products/studio-quiet-living-800.jpg', avif: '/assets/products/studio-quiet-living-800.avif', webp: '/assets/products/studio-quiet-living-800.webp', alt: 'Linen cloth and stoneware dish' }
};

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
      <nav class="v2-hero-index" aria-label="Homepage chapters">
        <a href="#featured">01 · Objects</a>
        <a href="#rooms">02 · Rooms</a>
        <a href="#botanicals">03 · Materia Medica</a>
      </nav>
      <div class="home-hero__hairline" aria-hidden="true"></div>
    </section>`;
}

function featureCard(product, index) {
  const affiliate = product.model === 'affiliate';
  const path = `/${affiliate ? 'discover' : 'shop'}/${product.slug}/`;
  const priced = Number.isFinite(product.price);
  const collection = collectionFor(product);
  const category = escapeHtml(product.category);
  const cardLine = product.cardLine || product.tagline || '';
  const format = product.format || '';

  return `
        <article class="feature-card">
          <a class="feature-card__mount" href="${escapeHtml(path)}" aria-hidden="true" tabindex="-1">
            ${specimenPlateMarkup(product, index)}
          </a>
          <div class="feature-card__copy">
            <span class="eyebrow">${collection ? `<a href="/shop/${escapeHtml(collection.slug)}/">${category}</a>` : category}</span>
            <h3><a href="${escapeHtml(path)}">${escapeHtml(product.name)}</a></h3>
            ${cardLine ? `<p class="feature-card__line">${escapeHtml(cardLine)}</p>` : ''}
            <div class="feature-card__foot">
              <span class="feature-card__terms">
                ${format ? `<span class="feature-card__format">${escapeHtml(format)}</span>` : ''}
                <span class="feature-card__price">${priced ? escapeHtml(formatMoney(product.price, product.currency)) : 'Price on request'}</span>
              </span>
              <a class="text-link" href="${escapeHtml(path)}">View folio ${arrow}<span class="sr-only"> about ${escapeHtml(product.name)}</span></a>
            </div>
          </div>
        </article>`;
}

function featured(products) {
  const pieces = shelfPieces(products);
  const note = `${pieces.length} pressed-specimen mounts from ${products.length} listed pieces. Confirmed pricing settles on written invoice.`;
  return `
    <section id="featured" class="home-section home-featured" aria-labelledby="featured-heading">
      <div class="home-shell">
        <div class="home-section__head">
          <div class="home-section__intro">
            <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>Featured specimens</span>
            <h2 id="featured-heading">Pressed shelf index.</h2>
          </div>
          <p class="home-section__note">${escapeHtml(note)}</p>
        </div>
        <div class="feature-grid">${pieces.map(featureCard).join('')}
        </div>
        <div class="home-featured__foot">
          <p>Every folio states verified label provenance side-by-side with claims ${escapeHtml(BRAND)} strips out.</p>
          <a class="button button-primary button-inline" href="/shop/">Enter the shop ${arrow}</a>
        </div>
      </div>
    </section>`;
}

function rooms() {
  const items = collections.map((room, index) => {
    const img = ROOM_IMAGES[room.slug];
    const figure = img
      ? `<span class="room-index__figure"><picture><source type="image/avif" srcset="${escapeHtml(img.avif)}"><source type="image/webp" srcset="${escapeHtml(img.webp)}"><img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" width="120" height="120" loading="lazy" decoding="async"></picture></span>`
      : '';
    return `
          <li>
            <a class="room-index__item" href="/shop/${escapeHtml(room.slug)}/">
              <span class="room-index__top">
                <span class="room-index__number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                <span class="room-index__arrow" aria-hidden="true">&rarr;</span>
              </span>
              ${figure}
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
          <p class="home-section__note">Each room pairs a studio medallion with its curated Warm Paper archive.</p>
        </div>
        <ul class="room-index">${items}
        </ul>
      </div>
      <img class="corner-foliage corner-foliage--neem-head" src="/assets/botanicals/corner-neem.webp" alt="" aria-hidden="true" width="768" height="964" loading="lazy" decoding="async">
    </section>`;
}

function newsletter() {
  return `
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
          <noscript><p class="page-note">This form needs JavaScript to save the preference in this browser. Nothing has been sent anywhere.</p></noscript>
        </div>
      </div>
    </section>`;
}

function journalIndex() {
  const journal = site.nav.find(item => item.id === 'journal');
  const pageByPath = new Map(pages.map(page => [page.path, page]));
  const root = pageByPath.get(journal.href);
  const columns = (journal.children || [])
    .filter(child => child.href !== journal.href)
    .map((child, index) => {
      const page = pageByPath.get(child.href);
      return `
            <li>
              <a class="journal-index__column" href="${escapeHtml(child.href)}">
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
              <a class="journal-plate__all" href="${escapeHtml(journal.href)}">All writing${arrow}</a>
            </div>
            <ul class="journal-index">${columns}
            </ul>
          </section>`;
}

function monograph() {
  const ground = `
        <picture class="spread-picture monograph-head__picture">
          <source type="image/avif" srcset="${escapeHtml(MONOGRAPH_GROUND.avif)}">
          <source type="image/webp" srcset="${escapeHtml(MONOGRAPH_GROUND.webp)}">
          <img class="monograph-head__photo" src="${escapeHtml(MONOGRAPH_GROUND.src)}" alt="" aria-hidden="true" width="${MONOGRAPH_GROUND.width}" height="${MONOGRAPH_GROUND.height}" loading="lazy" decoding="async">
        </picture>
        <div class="monograph-head__scrim" aria-hidden="true"></div>`;

  return `
    <section id="botanicals" class="botanical-monograph botanical-monograph--grounded" aria-labelledby="monograph-heading">
      <div class="monograph-head monograph-head--photo">
        ${ground}
        <img class="corner-foliage corner-foliage--beehive-tr" src="/assets/botanicals/corner-honey-hive.webp" alt="" aria-hidden="true" width="1200" height="896" loading="lazy" decoding="async">
        <div class="botanical-monograph__header">
          <div class="home-section__head">
            <div class="home-section__intro">
              <span class="home-overline"><span class="home-rule" aria-hidden="true"></span>Editorial monograph</span>
              <h2 id="monograph-heading">The materia medica: whole roots &amp; sacred seeds.</h2>
              <p class="home-section__note monograph-head__note">Three foods, photographed where they grow, with the lineage and the chemistry kept apart so neither has to borrow from the other.</p>
              <div class="monograph-head__actions">
                <a class="button button-secondary button-small button-inline" href="/journal/">Read the Journal ${arrow}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article class="editorial-spread">
        <picture class="spread-picture">
          <source type="image/avif" srcset="/assets/botanicals/nigella-field-flowers.avif">
          <source type="image/webp" srcset="/assets/botanicals/nigella-field-flowers.webp">
          <img class="spread-bg" src="/assets/botanicals/nigella-field-flowers.jpg" alt="Blooming Nigella sativa field with blue flowers and developing seed capsules at morning light" width="1376" height="768" loading="lazy" decoding="async">
        </picture>
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
        <picture class="spread-picture">
          <source type="image/avif" srcset="/assets/botanicals/ashwagandha-env-forest.avif">
          <source type="image/webp" srcset="/assets/botanicals/ashwagandha-env-forest.webp">
          <img class="spread-bg" src="/assets/botanicals/ashwagandha-env-forest.jpg" alt="Misty sub-Himalayan forest understory, the habitat of Withania somnifera" width="1376" height="768" loading="lazy" decoding="async">
        </picture>
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
            <a class="button button-primary button-small button-inline" href="/shop/ashwagandha-with-black-pepper/">Open Botanical Folio &rarr;</a>
          </div>
        </div>
        <div class="spread-figure">
          <img class="floating-specimen" src="/assets/botanicals/ashwagandha-bowl-roots-isolated.webp" alt="Handcrafted wooden bowl of ashwagandha root powder with carved spoon, raw root sticks and fresh leaves" width="645" height="316" loading="lazy" decoding="async">
        </div>
      </article>

      <article class="editorial-spread">
        <picture class="spread-picture">
          <source type="image/avif" srcset="/assets/botanicals/turmeric-plantation-env.avif">
          <source type="image/webp" srcset="/assets/botanicals/turmeric-plantation-env.webp">
          <img class="spread-bg" src="/assets/botanicals/turmeric-plantation-env.jpg" alt="Lush tropical turmeric plantation with vibrant green Curcuma longa leaves and morning mist" width="1376" height="768" loading="lazy" decoding="async">
        </picture>
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
            <a class="button button-secondary button-small button-inline" href="/shop/turmeric-cleansing-soap/">Open Botanical Folio &rarr;</a>
          </div>
        </div>
        <div class="spread-figure">
          <img class="floating-specimen" src="/assets/botanicals/turmeric-rhizomes-user-isolated.webp" alt="Freshly harvested Curcuma longa rhizomes with sliced vibrant orange interior and fine golden powder" width="506" height="289" loading="lazy" decoding="async">
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
            <a class="button button-primary button-small button-inline" href="/perennis/">Enter Perennis Sanctuary &rarr;</a>
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
    canonical: '/',
    theme: null,
    image: HERO_IMAGE,
    seo: {
      type: 'home',
      context: `Explore ${products.length} curated pieces across ${collections.length} rooms, Perennis free books and sound, and Journal notes.`
    },
    preload: [{ as: 'image', href: HERO_IMAGE_AVIF, type: 'image/avif', fetchpriority: 'high' }],
    scripts: ['/assets/newsletter-page.js'],
    content: `${hero()}${featured(products)}${rooms()}${monograph()}${newsletter()}`
  });
}
