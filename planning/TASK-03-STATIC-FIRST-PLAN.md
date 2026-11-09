# OPAR - Static-First Architecture

**Task:** TASK 03 - establish the static-first customer-facing architecture (Option A).
**Date:** 2026-11-10.
**Status:** audit and plan only. Nothing in this document has been implemented. No source file,
route, dependency, config, image or deployment was changed. The only file created is this one.

Owner decision recorded in the task: **Option A** - the generated static pages become the single
source of truth for the customer-facing site; React survives only where interaction genuinely needs
it; the site is **not** converted to a React SPA.

Labels used throughout: **[FACT]** inspected in the repo, **[DECISION]** owner's, **[PROPOSAL]** mine.

---

## 0. What was inspected

Read in full or in the relevant parts:

- `AGENTS.md`, `planning/STATUS.md`, `planning/DECISIONS.md` (to D-032), `docs/BRAND-GUIDELINES.md`
- `data/site.json`, `data/collections.json`, `data/pages.json`, `data/pilot-products.json`,
  `data/brand.json` (via the template)
- `templates/product-pages.mjs` (all 745 lines), `scripts/generate-product-pages.mjs` (162),
  `scripts/preview-products.mjs`
- `public/assets/product-pages.css` (button and component blocks), `public/assets/cart.js` (254),
  `site.js` (77), `product-pages.js` (112), `cart-page.js` (170), `checkout-page.js` (224),
  `account-page.js` (112), `search.js` (80)
- `index.html`, `App.tsx` (208), `components/Navbar.tsx`, `Footer.tsx`, `Hero.tsx`,
  `FeaturedProducts.tsx`, `CategoryDiscovery.tsx`, `Checkout.tsx`, `AdminDashboard.tsx` (head),
  `Assistant.tsx` (head), `services/commerce.ts` (174), `services/storeService.ts` (292)
- `tests/product-pages.test.mjs` (47 tests), `package.json`, `vite.config.ts`, `index.css`,
  `.gitignore`, `public/brand-preview/index.html`
- Component import graph, computed with a script over `App.tsx`, `index.tsx` and `components/*.tsx`.

---

## 1. The proposed single-shell architecture

### 1.1 The one rule

> Every customer-facing page is produced by `templates/product-pages.mjs` through
> `documentPage()` and served from `public/`. There is exactly one header, one footer, one room
> list, one button system, one store key and one CSS token layer. No customer route runs React.

### 1.2 Build pipeline

**Today [FACT]**

```
npm run build
  prebuild -> node scripts/generate-product-pages.mjs
                writes 40 HTML files into public/         (4 products, 2 collections,
                6 rooms, 28 site pages)                     + 41st file is hand-authored
                writes public/assets/search-index.json     (38 entries)
                writes public/assets/catalogue.json        (4 entries)
                writes public/robots.txt                   (Disallow: /)
                writes public/sitemap.xml                  (40 relative <loc>s)
  build    -> vite build
                dist/ = copy of public/
                dist/index.html  <- root index.html  (React shell, 4.57 kB)
                dist/assets/index-*.css  45.02 kB  (Tailwind + tokens)
                dist/assets/index-*.js   408.51 kB / 120.72 kB gzip
```

The homepage is the only page that is not generated, and it is the only page that ships 408 kB of
JavaScript. The other 40 pages ship `cart.js` (7 kB) + `site.js` (3 kB) + one small page script.

**Proposed [PROPOSAL]**

```
npm run build
  node scripts/generate-product-pages.mjs     writes 41 HTML files into public/  (adds /)
  node scripts/copy-site.mjs                  copies public/ -> dist/ exactly, nothing else
```

- The customer build has **no bundler**. `dist/` is the generated site, byte for byte.
- Vite stays in `devDependencies` as a **local tool for the admin panel only** (section 6), never in
  the shipped output.
- Result: no importmap, no React runtime, no Tailwind on any customer page, one CSS file.

Alternative kept on the table: if the owner wants a shipped React island (for example the
concierge), Vite stays in the build with `build.rollupOptions.input` pointing at `islands/*.tsx`
and fixed entry names, and the generated pages load `/assets/islands/<name>.js`. That works, but it
reintroduces a bundler, hashed-or-fixed filenames and a second CSS pipeline for no customer-facing
gain today. My recommendation is not to do it until there is a feature that needs it.

### 1.3 Where everything lives after migration

```
templates/
  chrome.mjs            documentPage(), header(), footer(), icons, button() helper
  home-page.mjs         renderHomePage()          - hero, featured pieces, room index
  product-page.mjs      gallery, details, related, productJsonLd, renderProductPage
  collection-pages.mjs  MODELS, renderCollection, renderCategoryPage, categoryStrip
  app-pages.mjs         checkoutSection, accountSection, newsletterSection, renderStaticPage
  product-pages.mjs     re-export facade only (keeps existing imports valid)
public/
  index.html            GENERATED homepage (new)
  shop/...              generated (unchanged)
  discover/...          generated (unchanged)
  <28 site pages>       generated (unchanged)
  brand-preview/        hand-authored, noindex, internal
  assets/
    product-pages.css   the only stylesheet in the shipped site
    cart.js             the only store (window.AuraStore)
    site.js             chrome behaviour + counts
    <page scripts>      cart/checkout/wishlist/account/search/newsletter/product islands
data/
  site.json             nav + footer + utility contract (sole source)
  collections.json      rooms (sole source)
  pages.json            content and application pages
  pilot-products.json   catalogue
scripts/
  generate-product-pages.mjs   all HTML + index + sitemap + robots
  copy-site.mjs                public/ -> dist/ (new, ~15 lines)
  preview-products.mjs         local server for public/ (serves / instead of redirecting)
```

Removed from the customer path: `index.html` (root), `index.tsx`, `App.tsx`, `index.css`,
`components/*` (customer set), `services/commerce.ts`. Retained for the local admin tool:
`components/AdminDashboard.tsx`, `AdminGate.tsx`, `services/auth.ts`, `payments.ts`,
`storeService.ts`, `types.ts`, `index.css`.

### 1.4 Page to renderer map after migration

| Route | Renderer | Interactive layer |
|---|---|---|
| `/` | `renderHomePage()` **new** | `site.js` counts only |
| `/shop/`, `/discover/` | `renderCollection()` | `site.js` |
| `/shop/{room}/` x6 | `renderCategoryPage()` | `site.js` |
| 4 product pages | `renderDropshippingPage()` / `renderAffiliatePage()` | `product-pages.js` |
| `/cart/` | `renderStaticPage()` + cart section | `cart-page.js` |
| `/checkout/` | `renderStaticPage()` + checkout section | `checkout-page.js` |
| `/wishlist/` | `renderStaticPage()` + wishlist section | `wishlist-page.js` |
| `/account/` | `renderStaticPage()` + account section | `account-page.js` |
| `/search/` | `renderStaticPage()` + search section | `search.js` |
| `/newsletter/` | `renderStaticPage()` + newsletter section | `newsletter-page.js` |
| 21 content/policy pages | `renderStaticPage()` | none |

That is 41 pages, one renderer, one chrome.

### 1.5 Why not the other two options

- **React-first (B)** deletes the 40 pages that work, the link validator, the JSON-LD generator, the
  noindex switch and the 47 tests, and contradicts the owner's HTML/CSS/JS preference. Rejected.
- **Contract-tested twins (C)** keeps two headers, two carts, two checkouts and two room lists and
  adds a test that they match. It is a truce; drift resumes with the next edit. Rejected.

---

## 2. Exact files and components involved

### 2.1 Fate of every file that matters

| File | Lines | Fate | Note |
|---|---|---|---|
| `templates/product-pages.mjs` | 745 | **split** into 5 modules, keep as facade | no output change |
| `scripts/generate-product-pages.mjs` | 162 | **extend** | add home page, unskip `/` in the link check, add `/` to sitemap |
| `scripts/preview-products.mjs` | - | **change** | serves `/` instead of 302 to `/shop/` |
| `public/assets/product-pages.css` | 45 kB | **extend** | home sections + Moss button system |
| `public/assets/*.js` (9 files) | 737 | **keep** | unchanged except a drawer if approved |
| `data/site.json` | 5.7 kB | **fix** | footer Shop column omits Art & Craft and Quiet Living |
| `data/collections.json` | 6 rooms | **keep** | sole room source |
| `index.html` (root) | 104 | **delete** | replaced by generated `public/index.html` |
| `index.tsx` | - | **delete** | React entry |
| `App.tsx` | 208 | **delete** | home-only shell |
| `index.css` | - | **move out of build** | admin-only; Tailwind must not ship |
| `components/Hero.tsx` | 84 | **port then delete** | becomes `.home-hero` in template + CSS |
| `components/FeaturedProducts.tsx` | 118 | **port then delete** | becomes `.home-featured` |
| `components/CategoryDiscovery.tsx` | 103 | **port then delete** | becomes `.home-rooms` |
| `components/Navbar.tsx` | 529 | **delete** | `header()` is the header |
| `components/Footer.tsx` | 154 | **delete** | `footer()` is the footer |
| `components/CartDrawer.tsx` | 174 | **delete** | `/cart/` replaces it |
| `components/WishlistDrawer.tsx` | 195 | **delete** | `/wishlist/` replaces it |
| `components/Checkout.tsx` | 406 | **delete** | `/checkout/` replaces it |
| `components/OrderSuccess.tsx` | 161 | **delete** | inline confirmation replaced it |
| `components/PolicyModal.tsx` | 186 | **delete** | `/policies/*` are canonical |
| `components/AuthenticSourcesModal.tsx` | 344 | **delete** | `/about/sourcing/` is canonical |
| `components/Assistant.tsx` | 145 | **defer** | decision needed - section 6 |
| `components/AdminDashboard.tsx` + `AdminGate.tsx` | 879 | **keep, unpublished** | local tool only |
| `components/ProductDetail.tsx` | 592 | **delete** | already dead (0 imports) |
| `components/ProductGrid.tsx` | 156 | **delete** | already dead |
| `components/ProductCard.tsx` | 110 | **delete** | only imported by the two dead files |
| `components/CategoryPage.tsx` | 288 | **delete** | dead |
| `components/Journal.tsx`, `JournalDetail.tsx`, `About.tsx`, `Features.tsx` | 256 | **delete** | dead |
| `services/commerce.ts` | 174 | **delete** | `cart.js` is the store |
| `services/storeService.ts` | 292 | **trim** | keep products/settings for admin; drop orders/reviews duplicate |
| `services/auth.ts`, `payments.ts` | 256 | **keep** | admin only |
| `services/concierge.ts`, `geminiService.ts` | 139 | **defer** | with the concierge decision |
| `constants.ts` | 214 | **trim** | delete `SHOP_ROOMS` (third room list), `PRODUCTS` (empty), `CATEGORIES_CATALOG` |
| `types.ts` | 281 | **trim** | keep `Order`/`AdminUser`/`ComplianceRegister` for admin; `Review` orphaned |
| `tests/product-pages.test.mjs` | 576 | **rewrite 4 tests** | they import React files that will not exist |

### 2.2 New files

| File | Purpose | Approx. size |
|---|---|---|
| `templates/chrome.mjs` | `documentPage`, `header`, `footer`, `icons`, `button()` | ~250 lines |
| `templates/home-page.mjs` | `renderHomePage()` | ~140 lines |
| `templates/product-page.mjs` | product renderers | ~330 lines |
| `templates/collection-pages.mjs` | collections and rooms | ~120 lines |
| `templates/app-pages.mjs` | checkout/account/newsletter/static | ~220 lines |
| `scripts/copy-site.mjs` | deterministic public -> dist copy | ~20 lines |
| `public/assets/product-pages.css` additions | `.home-hero`, `.home-featured`, `.home-rooms`, `.button` family | ~200 lines |

---

## 3. Dependency map: what depends on React today

### 3.1 Customer-facing React tree

```
index.html  (root, 104 lines: fonts, hero preload, importmap to esm.sh, GA/pixel slots, #root)
└── index.tsx  -> ReactDOM.createRoot
    └── App.tsx (208)
        ├── Navbar.tsx (529)            header, mobile menu, search overlay, cart/wishlist/admin buttons
        ├── Hero.tsx (84)               home only
        ├── FeaturedProducts.tsx (118)  home only
        ├── CategoryDiscovery.tsx (103) home only, reads data/collections.json
        ├── Checkout.tsx (406)          view 'checkout'
        ├── OrderSuccess.tsx (161)      view 'order_success'
        ├── AdminDashboard.tsx (721)    view 'admin'
        │   └── AdminGate.tsx (158) -> services/auth.ts (167)
        ├── CartDrawer.tsx (174)        overlay, any view
        ├── WishlistDrawer.tsx (195)    overlay, any view
        ├── Assistant.tsx (145)         floating, every view except admin
        │   └── services/concierge.ts (84) -> data/knowledge-base.json
        ├── PolicyModal.tsx (186)
        ├── AuthenticSourcesModal.tsx (344)
        └── Footer.tsx (154)            uses constants.ts SHOP_ROOMS
```

Services reachable only from React: `commerce.ts` (cart + newsletter), `storeService.ts`
(products/orders/reviews/settings/wishlist), `payments.ts`, `auth.ts`, `concierge.ts`,
`geminiService.ts`.

### 3.2 What is genuinely React-only, and what is duplicated

| Capability | React implementation | Static implementation | Verdict |
|---|---|---|---|
| Header | `Navbar.tsx` 1 row, fixed, 93px, no search | `header()` 2 rows, in-flow, 120px / 198px at 375px, search + account | static wins |
| Footer | `Footer.tsx`, `SHOP_ROOMS` (6 rooms), policy modals | `footer()` from `site.json` (4 rooms in Shop column) | static wins, data needs fixing |
| Room list | `constants.ts SHOP_ROOMS` + `collections.json` (CategoryDiscovery) | `collections.json` + `site.json` nav groups | three sources, must become one |
| Cart | `commerce.ts`, localStorage `aura_cart_v1` | `cart.js` `AuraStore`, same key, same item shape | identical; static wins |
| Wishlist | `storeService.ts`, key `aura_wishlist_v1` | `cart.js`, same key, same ids | identical; static wins |
| Checkout | `Checkout.tsx` + `storeService.createOrder` -> `aura_orders_v8`, id `AUR-#####`, `awaiting_payment` | `/checkout/` + `checkout-page.js` -> `aura_order_requests_v1`, id `OPAR-YYMMDD-XXXX`, no payment | **two order records - the most dangerous split** |
| Search | none | `/search/` + generated index (38 entries) | static only |
| Account | none (admin tab instead) | `/account/` reading local requests | static only |
| Newsletter | `commerce.subscribe` -> `aura_newsletter_v1` array | `cart.js.saveNewsletter` -> same key, single object | static wins |
| Policies | `PolicyModal` | 10 generated policy pages | static wins |
| Sourcing | `AuthenticSourcesModal` | `/about/sourcing/` | static wins |
| Admin | `AdminDashboard` + `auth.ts` | none | React only, unpublished |
| Concierge | `Assistant` + offline knowledge base | none | React only, decision needed |

Evidence for the identical cart claim is already enforced by the test suite: "the static store
writes exactly the keys and item shape the React app reads" (tests 470-486) and "the browser store
treats a null price as pending, never as zero" (496-535).

### 3.3 Data dependency

- `data/site.json` -> `header()` and `footer()` (static) and `Navbar` (React). Sole nav contract
  since TASK 01.
- `data/collections.json` -> 6 room pages, the `/shop/` category strip, the search index, and
  `CategoryDiscovery` (React).
- `constants.ts SHOP_ROOMS` -> React `Footer` only. Third copy. Must go.
- `data/pages.json` (28 entries) -> 28 static pages plus 3 application pages. No React reader.
- `data/pilot-products.json` (4 entries) -> 4 product pages, the search index, the catalogue file,
  and `FeaturedProducts` (React).
- `data/compliance.json` -> `AdminDashboard` only. Never rendered publicly.

### 3.4 Test coupling

Four tests read React source and will fail after retirement:

| Test | Reads | Action |
|---|---|---|
| "the static store writes exactly the keys and item shape the React app reads" (470) | `services/commerce.ts`, `services/storeService.ts` | rewrite as "there is one store" |
| "React cart and checkout never format a missing price as a number" (562) | `CartDrawer.tsx`, `Checkout.tsx`, `commerce.ts` | rewrite against `cart.js` / `checkout-page.js` |
| "the homepage room index renders each existing room once..." (574) | `CategoryDiscovery.tsx`, `App.tsx` | port to `templates/home-page.mjs` |
| "the React navbar reads the same site contract as the static header" (602) | `Navbar.tsx` | delete; the contract test on `site.json` (310-378) already covers it |

The remaining 43 tests are template and output tests and survive unchanged. That is the strongest
argument for this migration: **the tests are already written against the static architecture**. The
React shell has four tests; the static shell has forty-three.

---

## 4. Migration sequence

Each task is independently testable, committed on its own, and reversible with `git revert`. No task
deletes a component that a later task still needs. Estimates are agent effort, not a quote.

### T1 - Data conformance (30 min, risk: low)

Goal: one room list before any renderer work.

1. `data/site.json` footer Shop column currently lists `All pieces, Herbal Botanicals, Everyday Care,
   Yoga & Practice, Showpieces, Partner offers` [FACT]. It omits **Art & Craft** and **Quiet Living**.
   Add them in `collections.json` order.
2. Add a test asserting three things agree: `collections.json` slugs, the children of the nav `Rooms`
   group, and the footer Shop column.
3. Delete `SHOP_ROOMS` from `constants.ts` and point `Footer.tsx` at `site.json` (one-line change) so
   the React side cannot disagree before it is retired.

Gate: 48 tests pass; build clean; the diff on the 40 generated pages is limited to the footer Shop
column; `/shop/art-craft/` and `/shop/quiet-living/` now reachable from every footer.

### T2 - Renderer split, byte-identical (2 h, risk: low)

Goal: a module layout that can absorb the homepage without one 900-line file.

1. Move code into `chrome.mjs`, `product-page.mjs`, `collection-pages.mjs`, `app-pages.mjs`.
2. `product-pages.mjs` re-exports the same names, so `scripts/generate-product-pages.mjs` and all 47
   tests keep importing what they import today.
3. Snapshot the hash of all 40 generated files before and after.

Gate: 40/40 hashes identical; 48 tests pass; build clean. **Byte-identical is the acceptance test.**

### T3 - Homepage in the template, at a preview route (4 h, risk: medium)

Goal: prove the static homepage before switching `/`.

1. `renderHomePage()` produces, in `product-pages.css` classes:
   - hero: the existing photograph, 15% multiply grade, grain, top and base scrims, the current
     headline and lede, primary `Enter the shop` and secondary `About OPAR` buttons;
   - featured pieces: 4 cards from `data/pilot-products.json`, paper 4:5 tile, "Partner offer" /
     "OPAR house" label, "Supplier photo" label, `Price on request`, `View piece`;
   - room index: 6 rooms from `data/collections.json`, rule + ordinal + name + one line, whole card
     one link.
2. Copy is taken from the existing components, not rewritten, so nothing is lost or invented.
3. Generate it to `/home-preview/` (noindex, not in the sitemap, not in the search index, not linked
   from any page) and add the CSS blocks.
4. Move three primitives that exist **only** in `index.css` into `product-pages.css`, because the
   hero cannot be ported without them: `.grain` (index.css:77), `.hero-scrim-top` (:88),
   `.hero-scrim-base` (:98). The same applies to the `bg-canvas/15 mix-blend-multiply` grade, which
   is a Tailwind utility today. This is the only part of the port that is not a straight copy.
5. `documentPage()` must accept the page's `<link rel="preload">` for the hero so it is not requested
   after the CSS.

Gate: preview renders with JavaScript disabled and still shows all three sections; one `<h1>`;
0 horizontal overflow at 375 / 768 / 1440; text contrast re-measured against the photograph; the 40
existing pages byte-identical.

### T4 - Cutover (2-3 h, risk: high, atomic)

**T4 must land as one commit.** Writing `public/index.html` while the root `index.html` still exists
means Vite emits `dist/index.html` from the root stub and overwrites the generated homepage.

1. Point `renderHomePage()` at `/`; add `/` to the generator's path set; stop skipping `href === '/'`
   in the link validator; add `/` to `sitemap.xml`.
2. `npm run build` becomes `generate` + `scripts/copy-site.mjs`. Vite leaves the customer build.
3. Delete root `index.html`, `index.tsx`, `App.tsx`.
4. Delete the customer components and `services/commerce.ts` listed in 2.1.
5. Rewrite the four React-coupled tests (3.4).
6. `preview-products.mjs` serves `/` from `public/index.html` instead of 302 to `/shop/`.
7. Remove `/home-preview/` and its generator branch.

Gate: all 41 routes 200; `/` contains the hero headline, the four pieces and the six rooms in the
served HTML; no console messages on `/` and `/shop/`; cart -> checkout -> account flow completes in
one browser; `dist/` contains no `.jsx`, no importmap, no Tailwind; page weight on `/` drops by
roughly 400 kB.

### T4.5 - Header consolidation (2-3 h, risk: medium)

The measured problem: the static header is 198px at 375px (25% of an 800px viewport) and 120px at
768/1440. Unifying on it unchanged would make that the site-wide default and push the hero's LCP
element down on every page.

1. One row at all widths: wordmark, four sections, utilities.
2. Search becomes an icon that expands to a field on focus, or a `/search/` link under 768px.
3. Utilities stay icons with count chips: account, wishlist, cart - all linking to their pages.
4. Keep the `<details>` panel behaviour, Escape handling, focus return and the grouped Shop panel
   from TASK 01.
5. Mobile fit: the four sections fit with icon utilities; text utility labels are what break the fit.

Gate: <= 80px at 375, <= 96px at 1440; no overflow; `aria-current` still set; all 21 nav hrefs 200;
Escape closes and returns focus; no CLS introduced.

### T5 - Commerce verification (2 h, risk: low)

1. Scripted pass on the built site: add a priced item and an unpriced item, change quantity, remove,
   reach `/checkout/`, submit, read the reference, find it on `/account/`, remove it.
2. Wishlist: save on a product page, see it on `/wishlist/`, remove.
3. Search: query a room name, a product name, a policy name.
4. Decide the drawer question: today the React slide-out cart is reachable **only from the homepage
   navbar icon**, and the homepage has no add-to-cart control of its own [FACT: `FeaturedProducts`
   links to the product page, nothing else]. So no capability is lost by the cutover - only an
   animation. If the owner wants it back, it is a ~60-line plain-JS `<dialog>` that opens on the
   cart icon on all 41 pages, with `/cart/` as the no-JS fallback.

Gate: a written pass/fail table for each flow, both models, both price states.

### T6 - Admin and concierge disposition (1-2 h, risk: low)

The admin panel cannot see customer orders. It reads `aura_orders_v8`, written only by the React
checkout that is being deleted, and both it and the static checkout are browser-local - a different
device sees nothing either way. Under one shell it has no data source at all unless it is pointed at
`aura_order_requests_v1`.

Proposal: keep `AdminDashboard` as an **unpublished local tool** (`npm run dev:admin`, a dev-only
Vite entry), point its order tab at `AuraStore.getOrders()`, and ship no admin JavaScript to
`dist/`. Client-side passphrase gating on a public origin is not security and should not be
published as if it were.

Concierge: `Assistant` is offline, reads `data/knowledge-base.json`, and cannot invent answers
[FACT]. Three options - (a) a generated `/concierge/` page with ~80 lines of plain JS, (b) leave it
out until the library grows, (c) keep it as the only shipped React island. I recommend (a), after
T7, because a chat panel is genuinely interactive and does not belong in the shell.

Gate: `dist/` contains no admin or concierge bundle unless (c) is chosen; no customer route loses a
feature it had.

### T7 - Moss-inspired button system (4-6 h, risk: low)

See section 6. Deliberately after T4: doing it before the cutover means implementing it twice, once
in Tailwind and once in CSS, and then deleting the Tailwind half.

Gate: every button state rendered on `/brand-preview/`; contrast table for each state; keyboard
order; reduced motion; no ad-hoc pill left in any shipped file.

### T8 - Cleanup and memory (2 h, risk: low)

1. Delete the dead components (`ProductDetail`, `ProductGrid`, `ProductCard`, `CategoryPage`,
   `Journal`, `JournalDetail`, `About`, `Features`), the orphaned `Review` type and
   `storeService.getReviews`.
2. Trim `constants.ts` to what the admin tool still uses.
3. Delete `index.css` from the shipped path; keep Tailwind only inside the dev admin entry.
4. Update `planning/STATUS.md`, add the decision entry for Option A and the button-system task to
   `planning/DECISIONS.md`, and note in `docs/BRAND-GUIDELINES.md` that the button system is the one
   component pending implementation.
5. Re-measure and record page weight and header height before/after.

Gate: tests, clean build, no unused file left in `components/`, docs match the code.

---

## 5. How cart, checkout, search, wishlist and account survive

Nothing in this list is rebuilt. Every one of them already exists as a generated page plus a small
plain-JS file, and those files are unchanged by the migration.

| Feature | Today | After | What changes | What is tested |
|---|---|---|---|---|
| Store | `cart.js` -> `window.AuraStore`, key `aura_cart_v1`, item `{ product, quantity, selectedVariant? }` | same file, same key, same shape | nothing | tests 470-535 (keys, null price, local-only) |
| Cart | `/cart/` + `cart-page.js`; React drawer on the homepage | `/cart/` only (optionally a plain-JS drawer, T5) | the drawer, not the cart | quantity, remove, subtotal, pending-price note |
| Checkout | `/checkout/` invoice request -> `aura_order_requests_v1`, reference `OPAR-YYMMDD-XXXX`; React `Checkout.tsx` -> `aura_orders_v8`, `AUR-#####` | the static one only | one record format disappears | tests 430-449, 441-449 |
| Search | `/search/` + `search.js` + generated `search-index.json` (38 entries) | same, plus the home entry it already contains | nothing | index build, degraded state without JS |
| Wishlist | `/wishlist/` + `wishlist-page.js` + `catalogue.json`; React drawer | `/wishlist/` only | the drawer | tests 487-495 |
| Account | `/account/` + `account-page.js` reading local requests | same | nothing | tests 450-459 |
| Newsletter | `/newsletter/` + `newsletter-page.js` | same | React `commerce.subscribe` disappears | test 460-469 |

Two consequences worth stating plainly:

1. **The React checkout is the one that goes, and it is the one that looks more like a shop.** It
   writes `awaiting_payment`, `supplierCost`, `estimatedProfit` and a payment method. The static one
   records an invoice request and collects no card data. Given that no price, no shipping cost and
   no stock are confirmed for any of the four pieces, the invoice-request model is the honest one.
   Deleting `Checkout.tsx` therefore removes an order pipeline that could never have completed.
2. **The admin's order tab will read an empty key** unless T6 points it at `aura_order_requests_v1`.
   A migration shim can copy any `aura_orders_v8` entries once; that is a ten-line addition, not a
   design.

---

## 6. The Moss-inspired button system

**When:** T7, immediately after T4 (single shell) and before T5-T8 and before any new page design.
Not now. Doing it earlier means writing it twice.

**Where:** one block in `public/assets/product-pages.css`, already anchored at `.button` (line 260),
plus one template helper `button()` in `templates/chrome.mjs`. That file is the canonical token
layer - `index.css` says so itself: "The static generated pages consume
public/assets/product-pages.css, which is the canonical token layer."

**What exists today [FACT]** - three button languages:

*Static, one family, already 80% right:*
- `.button` (L260): inline-flex, full width, 1px ink border, `--radius-pill`, uppercase, .12em
  tracking, `min-height: var(--button-min-height)`, active translate 1px, focus offset 3px
- `.button-primary` (L264): Button colour fill, ink text, hover to Mist
- `.button-secondary` (L267): transparent, Mist border, hover Mist at 12%
- `.button-closed` (L269), `.button.is-confirmed` (L422) - confirmed/added state
- `.external-cta` (L427): transparent, Mist border, hover fills Mist
- `.text-link` (L284, L431): 44px min-height, underlined, hover to Button colour
- `.quantity-control button` (L254): 44px square, zero radius, disabled at 0.4
- `.category-tile` (L442): whole-tile link, focus offset -2

*React, inline, hand-tuned per instance:*
- Hero primary `rounded-full bg-cta px-9 min-h-[52px]` (Hero.tsx:77)
- Hero secondary `rounded-full border border-paper/25 px-9` (Hero.tsx:83)
- Featured card `rounded-full bg-cta px-5 min-h-[40px]` (FeaturedProducts.tsx:97)
- Featured section `rounded-full bg-cta px-9 min-h-[52px]` (FeaturedProducts.tsx:116)
- plus one-off pills in Checkout, WishlistDrawer, OrderSuccess, and 34 Tailwind hits in
  AdminDashboard
- dead files still carrying their own variants: ProductDetail x5, ProductCard x2

*Four different size/weight combinations and three different hover rules for the same idea.*

**What the system should be [PROPOSAL], to be implemented in T7:**

- Roles: `primary` (Button fill, ink text), `secondary` (transparent, Mist border), `quiet`
  (text-link with arrow), `icon` (44px square, no fill). No other button types.
- Sizes: `default` 52px, `small` 40px (card actions), `block` for full width in forms.
- States: rest, hover, active (1px translate), focus-visible (2px outline, 3px offset, offset-in on
  tiles), disabled (0.4, no transform), pending (`aria-busy`, label unchanged), confirmed
  (`is-confirmed`, 1200 ms, already in `product-pages.js`).
- Radius: 999px for buttons and count chips only. Zero everywhere else, including quantity controls.
- Colour: only the five palette values and their stated mixes. `primary` is `--cta` with ink;
  hover is Mist, never a new hue; no gradient, no shadow.
- Type: Manrope, 10-11px, uppercase, .12-.24em tracking, weight 600. One scale, not four.
- Motion: `transform` and `background` only, `--dur-fast`, suppressed under
  `prefers-reduced-motion` (already handled by the existing media query block).
- Implementation: `.button` + `--primary/--secondary/--quiet/--icon` + `.button-small`,
  `button({ label, href, variant, size, icon, attrs })` in the template so the markup cannot drift.
  React islands use the same class names, not Tailwind, so a future island inherits the system free.
- Documentation: a button specimen block on `/brand-preview/`, which already reads the production
  token layer, plus the state table in `docs/BRAND-GUIDELINES.md`.

**Why this order matters:** after T4 there is exactly one place a button can be defined. Before T4
there are two, and the homepage's are the ones being deleted.

---

## 7. Risks and safeguards

| # | Risk | Why it is real here | Safeguard |
|---|---|---|---|
| 1 | Two order records diverge during the transition | `aura_orders_v8` (React) vs `aura_order_requests_v1` (static) | one store after T4; one-time read shim; T6 repoints admin |
| 2 | The homepage disappears from the build | root `index.html` and `public/index.html` both target `dist/index.html` | atomic T4; a test asserts `dist/index.html` contains the hero headline |
| 3 | Silent loss of a React capability | drawers, admin, concierge, sourcing modal are React-only | the 2.2 table is the checklist; T5/T6 gate each item explicitly |
| 4 | Hand-edited generated HTML | 67 files under `public/` are tracked in git | banner comment already in every file; regenerate, never edit; review diffs by section |
| 5 | Second CSS system creeps back | Tailwind stays in the repo for admin | a test asserts no shipped page links `index.css` and no generated HTML contains Tailwind utility classes |
| 6 | Link rot when `/` becomes generated | the validator currently skips `href === '/'` | unskip it in T4 so links to home are checked like every other route |
| 7 | SEO regression | pages are `noindex` today, sitemap has relative locs | switch untouched; at go-live make canonicals absolute and sitemap locs absolute in one change |
| 8 | Dev experience regression | Vite dev can no longer serve `/` if there is no HTML entry | `npm run preview` serves `dist/`; `preview:templates` serves `public/`; admin keeps its own dev entry |
| 9 | Deleting files the owner still wants | the brief says no deletions without approval | deletions happen in one commit per group, listed file by file, after the owner reads this plan |
| 10 | Test suite temporarily lies | four tests read React source | rewrite them in the same commit that deletes the files, never delete a test silently |
| 11 | Photography arrives mid-migration | five owner images are untracked right now | images are a separate task; the room index is typographic until each occupied room has its own photograph |
| 12 | Preview server expected `/` to redirect | `preview-products.mjs` 302s to `/shop/` | changed in T3/T4 and noted here so it is not mistaken for a regression |
| 13 | Core Web Vitals regress while unifying | the static header is 198px at 375px; the hero is a 606 kB JPEG; the homepage loses its preload when the root file is deleted | section 10 budgets; T4.5 header gate; hero preload moved into `renderHomePage()`; WebP/AVIF conversion in T8 |

Rollback: each task is one commit; `git revert` returns the previous shell. T4 is the only one that
cannot be partially reverted, which is why it is atomic and last before the design work.

---

## 8. Existing functionality vs proposed change

| Area | Works today | Proposed |
|---|---|---|
| 40 generated pages | yes, tested, link-validated | unchanged |
| Header / footer / nav | static shell on 40 pages; different React shell on 1 | one shell on 41 |
| Homepage | React, 408 kB JS, three sections | generated HTML, ~10 kB JS, same three sections |
| Rooms | 6 rooms, 4 empty, 3 definitions | 6 rooms, 1 definition, footer fixed |
| Cart | two views of one store, same key | one view, one store |
| Checkout | two implementations, two record formats | one: invoice request |
| Search | static only | unchanged |
| Wishlist | two views of one key | one view |
| Account | static only | unchanged |
| Admin | React, homepage-only entry, cannot see customer orders | local tool, unpublished (proposal) |
| Concierge | React, offline | decision: page, defer, or island |
| Buttons | three languages | one system in T7 |
| SEO | noindex, sitemap, JSON-LD on products | unchanged; `/` added |
| Hosting | not deployed | unchanged - still the owner's decision |

---

## 9. Decisions taken

The owner delegated these five to the architect on 2026-11-10 ("you are the finisher"). Recorded here
so the migration does not stall on them later. Each is reversible with `git revert`.

| # | Question | Decision | Why |
|---|---|---|---|
| 1 | Slide-out cart drawer, or `/cart/` only? | **`/cart/` only.** No drawer. | The cart control exists on all 41 pages, the page is the no-JS fallback anyway, and the drawer was reachable only from the homepage navbar icon. Two cart views is exactly the duplication this migration removes. |
| 2 | Admin panel: unpublished tool, or retired? | **Keep, unpublished.** Runs as a local Vite entry (`npm run dev:admin`). No admin JavaScript ships to `dist/`. | There are no clients and no server. It is the owner's private instrument. A passphrase-gated panel on a public origin is not security, and it cannot see real orders because orders live in the buyer's browser. Point its order tab at `aura_order_requests_v1` (one-time read shim for `aura_orders_v8`). |
| 3 | Concierge: shipped page, deferred, or island? | **Deferred, with a trigger.** No route in the first single-shell build. | `concierge.ts` matches `data/knowledge-base.json` offline; it cannot answer anything the FAQ pages do not already say. A chat that only repeats the FAQ costs a page, a script and the reader's attention. Trigger to build it: the knowledge base outgrows `/help/` and `/policies/`, or the library passes roughly 30 entries. Then it becomes `/concierge/` with ~80 lines of plain JS, after T7. |
| 4 | Dead components with invented prices/stock/reviews | **Delete in T8.** | `ProductDetail` (592), `ProductGrid` (156), `ProductCard` (110), `CategoryPage` (288), `Journal`, `JournalDetail`, `About`, `Features`. Zero imports, and they carry fabricated prices, `stock > 10` badges, `verified: true` reviews and an invented `$8C7355` accent. They are a truth liability the moment anyone re-imports one. Git history keeps them. |
| 5 | `/brand-preview/` | **Keep shipping, noindex.** | 18 kB of hand-authored HTML that reads the production token layer, so it cannot drift. It is the only rendered proof of the palette and, after T7, of the button system. Not in `sitemap.xml`, not in the search index, not linked from any customer page. |

Consequences to note:

- Removing the drawer means the homepage must not offer a cart affordance it cannot open. After T4
  the header cart icon is a link to `/cart/` on every page, including `/`. Nothing else changes.
- Keeping the admin unpublished removes the last reason for Vite, React and Tailwind to be in the
  customer build. That is what makes the `copy-site.mjs` build honest rather than a gesture.

---

## 10. Core Web Vitals contract

Owner instruction, 2026-11-10: the vitals must hold after the foundations change. They are a gate on
every task below, not a later optimisation pass.

Measured baseline today (lab, static pages, 800px viewport):

| Metric | Today | Budget after migration |
|---|---|---|
| Header height, 375px | **198px = 25% of the viewport** | **<= 80px** (T4.5) |
| Header height, 768 and 1440 | 120px | <= 96px |
| Homepage JS | 408.51 kB / 120.72 kB gzip | < 20 kB / < 8 kB gzip |
| Generated page JS | 10-18 kB | unchanged |
| CSS | 45.02 kB Tailwind + 45 kB product-pages.css | one file, < 55 kB |
| LCP element, `/` | hero photograph (`/assets/brand/hero-opar.jpg`, 606 kB JPEG, preloaded in root `index.html`) | same element, served as WebP/AVIF <= 180 kB, still preloaded, still `fetchpriority="high"` |
| CLS | low; image dimensions declared, fonts have `display=swap` | <= 0.1, no new shift from the header collapse |
| INP | unmeasured (no field data, site not deployed) | the JS budget cut above is the guarantee |

Per-task gates:

- **T1-T2:** page weight unchanged, header unchanged.
- **T3:** the preview LCP is still the hero image, preloaded, with explicit width/height; no layout
  shift when the photograph loads; hero preload moved from the deleted root `index.html` into
  `renderHomePage()`.
- **T4:** homepage weight drops by ~400 kB; total blocking JS on `/` under 20 kB.
- **T4.5:** header collapse lands. Gate: <= 80px at 375px, <= 96px at 1440, no CLS introduced, the
  four sections and all utilities still reachable, keyboard order unchanged.
- **T5-T8:** no regression; re-measure and record in `planning/STATUS.md`.

Note on the header: unifying on the current static header would make 198px of two-row chrome the
site-wide default on mobile, which both harms LCP position and wastes a quarter of the screen on the
page that is meant to sell. That is why T4.5 exists and why it comes before any design or
photography work.

Everything else in this plan is mechanical and reversible.

---

## Appendix A - measurements taken

| Measure | Value | Source |
|---|---|---|
| Generated pages | 40 (4 products, 2 collections, 6 rooms, 28 site pages) | generator output |
| Hand-authored pages | 1 (`/brand-preview/`) | `public/` |
| HTML files under `public/` | 41 | file count |
| React bundle | 408.51 kB / 120.72 kB gzip | `npm run build` |
| React CSS bundle | 45.02 kB / 8.56 kB gzip | `npm run build` |
| Static page JS | 7 + 3 + page script (2-8 kB) | `public/assets` |
| Tests | 47 (43 static, 4 React) | `npm run test:templates` |
| Search index entries | 38 | generator output |
| Catalogue entries | 4 | generator output |
| React header | 1 row, fixed, 93px | measured |
| Static header | 2 rows, in-flow, **198px at 375px (25% of an 800px viewport)**, 120px at 768 and 1440 | measured 2026-11-10 |
| Rooms per source | `collections.json` 6, `site.json` nav 6, `site.json` footer 4, `SHOP_ROOMS` 6 | files |

## Appendix B - the plan in one paragraph

Generate the homepage from the same template as the other 40 pages, in the same CSS token layer, so
there is one header, one footer, one room list and one store; drop the React entry from the customer
build; keep the nine static page scripts that already do the work; move the admin panel out of the
public build and give the concierge its own decision; implement the Moss button system in
`product-pages.css` plus one template helper immediately after the shell is unified; then, and only
then, return to photography, content and deployment.
