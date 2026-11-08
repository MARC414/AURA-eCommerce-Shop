# AURA — Status

**Updated:** 2026-11-09  
**Phase:** Site structure P1b complete: the static cart and wishlist are real, browser-local islands sharing `aura_cart_v1` and `aura_wishlist_v1` with the React app. 26 generated pages, 42 tests. No checkout or payment. Next approved work is P0 homepage truth hygiene.

## Current intake (D-020 takes precedence over older notes)

- Added `/shop/ashwagandha-with-black-pepper/`, CJ `1898627038642925570`, SKU `CJHP232030301AZ`, under **Herbal Botanicals**. Shop is the intake assumption for this sourcing link; no affiliate token was supplied.
- **60 capsules**, not loose powder. The supplier's `Powder` attribute conflicts with the description and label; **113 g is gross package weight**. AURA selling price remains `null` and ordering is disabled.
- Corrected the agent's earlier misreading: the owner wanted Ashwagandha added because powder/root was unavailable. D-019's powder/root-only restriction is superseded. Factual capsule previews are allowed; unsupported health/certification claims remain excluded.
- The PDF reader failed, but the one-page file was rendered with the existing Windows PDF renderer and reviewed locally. It is **label artwork**, not a lab report or organic certificate. It states 2 capsules per serving, 30 servings, 1,300 mg Ashwagandha root and 10 mg black pepper fruit per serving, plus pullulan capsules. Actual composition and SKU/batch linkage remain unverified.
- `cmp-ashwagandha-black-pepper` records **0 verified / 10 outstanding** checks. Artwork/identity/format review is pending. Supplier cost, live inventory, and quoted shipping are not imported as AURA selling terms. Original PDF stays outside the repo; product photography is a labelled placeholder.
- Verification this intake: **30/30 template tests passed**, seven HTML pages regenerated, PilotProducts/concierge compiled with the existing esbuild tool, and three concierge-answer smoke checks passed. Browser DOM checks at **375 px and 1425 px content widths** found no horizontal overflow; the quantity control worked and ordering stayed disabled. A screenshot could not be captured because the desktop browser window was not visible.
- Handoff: `AURA-eCommerce-Shop-main/docs/COMPLIANCE.md` contains the label evidence summary and fingerprint. `AGENTS.md`, `CLAUDE.md`, `.agents/product-marketing.md`, and the concierge corpus use the corrected scope.

## Current facts

- A local React/TypeScript/Vite prototype exists in `AURA-eCommerce-Shop-main`.
- **Not deployed to Cloudflare**, confirmed by the owner on 2026-11-04. Cloudflare is a future temporary preview option. Final hosting/domain structure is undecided.
- Owner reports AliExpress affiliate/dropshipping and CJ account access. Connection to AURA and payout eligibility remain unverified.
- The two product types (dropshipping = AURA sells, affiliate/referral = partner sells) are distinguished on one site by `purchaseOwner: 'aura' | 'partner'`, regardless of source platform.
- Pilot products: 
  * AliExpress item `1005007532901889` (turmeric cleansing soap, dropshipping)
  * AliExpress item `1005008143754192` (aloe vera cleansing bar, dropshipping) 
   * CJ item `2114448810729783298` (turmeric cleansing pads, affiliate/referral)
   * CJ item `1898627038642925570` (Ashwagandha with Black Pepper, Shop preview)
- CJ commission eligibility remains unverified; token may be merchant-referral not product-sale.
- Books must have documented publication rights. Prior candidates need further edition/territory checks; access and pricing are undecided.

## Completed work since last status

### Site structure — P1b (2026-11-09, D-025)
- `public/assets/cart.js` is the single browser store for generated pages: `AuraStore`, keys `aura_cart_v1` and `aura_wishlist_v1`, same item shape and events as `services/commerce.ts` and `services/storeService.ts`.
- Product pages: **Add to cart** only where `purchaseOwner: 'aura'`; partner pages keep no cart or quantity control. Both models can toggle **Save to wishlist** (`aria-pressed`).
- `/cart/` renders items, quantities, remove, and a pending-price subtotal. `/wishlist/` joins saved IDs to `public/assets/catalogue.json` and shows removed products honestly. Both are `<noscript>`-safe.
- Header cart and wishlist badges update live and survive navigation.
- Caught by browser probe: `Number(null) === 0` made an unpriced item show `£0.00`. `cart.js`, `cart-page.js`, `wishlist-page.js`, and `commerce.cartSubtotal` now treat null/empty as missing; a Node unit test exercises `cart.js` with a mock `window`.
- Deliberate, disclosed React touch: display-only null-price guards in `CartDrawer.tsx`, `Checkout.tsx`, and `services/commerce.ts`. No flow or layout change.

### Site structure — P2 (2026-11-09, D-026)
- **Six-category taxonomy** in `data/collections.json` with matching to `product.category`.
- **28 content/application pages** in `data/pages.json`: Perennis, Journal, About (incl. sourcing), Contact, Imprint, Help, 13 policy/utility pages, search, wishlist, cart, checkout, account, newsletter. All production copy, no preview/compliance theatre.
- **40 product pages** generated from `data/pilot-products.json` (4 products: 1 affiliate + 3 dropshipping), all with `listingStatus: "published"`, `price: null`, and "Price on request" display.
- **Full page template** (`templates/product-pages.mjs`) with grouped nav panel, category strip/toolbar, category renderers, product cards, purchase panels (dropshipping add-to-cart + affiliate external CTA), wishlist toggle, breadcrumbs, JSON-LD schema (no Offer for unpriced pieces), and invoice-request checkout.
- **Generator** (`scripts/generate-product-pages.mjs`) producing search-index, catalogue, robots (launch switch: disallow all), and sitemap; enforces zero broken internal links.
- **Shared browser store** (`public/assets/cart.js`) extended with `aura_order_requests_v1` and `aura_newsletter_v1` keys; `hasPendingPrice()` guard against `Number(null) === 0` bug; invoice request flow with reference generation; account and newsletter preference pages.
- **CSS** (`public/assets/product-pages.css`) for grouped nav, category rooms, checkout, orders, newsletter, responsive breakpoints down to 320 px.
- **Test suite** (`tests/product-pages.test.mjs`) rewritten to 45 tests; 2 failures fixed: (a) `/selected\./` → `/selected/` regex, (b) checkout card-field regex changed to inspect only `<input>` tags rather than prose text.
- Pages are `noindex, follow` until a real domain and absolute canonical URLs exist (launch switch `INDEXABLE = false` in template). Disclose at go-live.
- `robots.txt` disallows all as a launch switch; sitemap uses relative URLs.

### Site structure — D-027 (2026-11-09): centred menu with visible category bar
- The primary menu (Shop · Perennis · Journal · About) is now centred in the header's second row; dropdown panels centre under their button (mobile resets to static).
- A new centred `category-nav` bar appears under the menu on every page: All pieces + the six rooms from `data/collections.json` (`/shop/herbal-botanicals/`, `/shop/everyday-care/`, `/shop/sacred-sound/`, `/shop/yoga-practice/`, `/shop/art-craft/`, `/shop/quiet-living/`), each on its own individual page (verified: H1 per category; Everyday Care holds 2 pieces, Herbal Botanicals 1, the rest show an honest empty state).
- Top-level nav stays at 4 items (uncrowded rule preserved); the Shop dropdown keeps the same six links. Tests assert the category bar and centring CSS; 45/45 pass, 40 pages regenerated with no broken links.

### Site structure — D-028 (2026-11-09): Categories beside Shop; Showpieces replaces Sacred Sound
- Row-3 category bar removed (header back to two rows, compact). Main menu is now Shop · Categories · Perennis · Journal · About, centred; Shop dropdown = All pieces + Partner offers; Categories dropdown = all six category names, each on its own page (`/shop/herbal-botanicals/`, `/shop/everyday-care/`, `/shop/showpieces/`, `/shop/yoga-practice/`, `/shop/art-craft/`, `/shop/quiet-living/`).
- `data/collections.json`: Sacred Sound removed (it belongs to Perennis), Showpieces added — exceptional miscellany (wooden showpieces, meditative candles, organic ornaments). Stale `/shop/sacred-sound/` deleted; `/shop/showpieces/` generated with honest empty state. Sacred Sound now appears under the Perennis submenu and in the Perennis Music page copy.
- Tests updated (5-item menu order, Categories children = collections, empty-category = Showpieces, no category-nav row, no `/shop/sacred-sound/` link); 45/45 pass, 40 pages regenerated with no broken links.

### Storefront & product structure
- Four pilot products implemented with individual URLs under `/shop/` (AURA sells) and `/discover/` (partner sells).
- Each product has its own page with compliant pricing (`price: null` pending owner decision), variant handling, and sourcing details.
- Two distinct templates enforce model-specific UI rules: no cart/quantity controls on affiliate pages, no invented prices.
- All static pages are `noindex` and display-only; no live offers or payment processing.

### Site structure — P1a (2026-11-09)
- `data/site.json` is now the single chrome contract: brand, preview status, utility actions, four top-level navigation items (Shop, Perennis, Journal, About) with panels, and five footer columns. Header and footer both render from it.
- Two-row header: wordmark + GET search bar + wishlist/cart on the first row; the four sections on the second. Panels use native `<details>`/`<summary>`, so they work without JavaScript and on touch.
- `data/pages.json` + `renderStaticPage()` generate 19 content pages: Perennis (hub, books, music), Journal, About, Contact, Help/FAQ, Policies index + 8 real policy URLs, Search, Wishlist, Cart. 26 pages in total.
- `/preview/` replaces `/templates/`; the old path is deleted and left out of the menu.
- Search is real: the build emits `assets/search-index.json` and `/search/` filters it. `assets/site.js` closes one panel at a time and now drives live cart and wishlist counts from `AuraStore`.
- The generator now throws if any internal `href` points at a page it did not generate, so the menu cannot ship a dead link.
- The duplicate `product-detail.*` set was deleted (D-022); a copy is outside the repo at `C:\Users\HP\AppData\Local\Temp\opencode\aura-product-detail-backup-20261109\`.

### Storefront & product structure
- Four pilot products implemented with individual URLs under `/shop/` (AURA sells) and `/discover/` (partner sells).
- Each product has its own page with compliant pricing (`price: null` pending owner decision), variant handling, and sourcing details.
- Two distinct templates enforce model-specific UI rules: no cart/quantity controls on affiliate pages, no invented prices.
- All static pages are `noindex` and display-only; no live offers or payment processing.

### Compliance & verification (per owner request)
- Created `data/compliance.json`: per-product verification register with statuses (`verified` | `pending` | `not-provided` | `not-applicable`), blocked claims, responsible person notes, and store-level items.
- Claim may only be published when matching record is `verified`. Missing evidence is recorded as missing, never implied.
- Compliance section on each product page shows verification items, status pills, and blocked claims list.
- Admin dashboard includes read-only compliance tab for team review.

### Payment, cart & order flow
- Card fields completely removed from checkout — AURA never collects card numbers, expiry, or security codes.
- Checkout now collects customer details and payment method preference (invoice, bank transfer, card-hosted redirect when enabled, wallet, Payoneer).
- Order created via checkout has `paymentStatus: 'awaiting_payment'`; only a server webhook can change to `'paid'`.
- Cart persists in localStorage via `commerce.getCart()`/`saveCart()` and survives page reload.
- OrderSuccess screen accurately reflects "request received — not paid" state with clear next steps.
- No fake discounts, delivery windows, or money-back guarantees shown.

### Multi-user admin panel
- Passphrase-protected access (SHA-256 hash in localStorage) with no default PIN.
- Role-based permissions modelled (`AdminRole`: owner, manager, fulfilment, support, viewer) for future server enforcement.
- Tabs: Overview (honest metrics), Requests (order queue), Catalogue (product list), Team (user management), Compliance (verification register), Settings (store config).
- All data stored locally in browser; clearing site data erases it. Panel labels session as `local-preview`.

### Additional features
- Newsletter signup: emails stored locally with consent timestamp; form says "Saved on this device. A confirmation email will be sent once a mailing provider is connected."
- Chatbot (Assistant): deterministic retrieval from `data/knowledge-base.json` (18 Q&A entries). No LLM, no cost, refuses when no match. Suggestion chips for common questions.
- Wishlist: client-side only, stored in localStorage, does not sync across devices.
- Footer: all unverified claims removed; honest copy only about data handling and preview state.

### Technical health
- `npm run build:templates` → 26 HTML pages generated (4 products + 2 collections + preview + 19 content pages), broken-link check clean, plus `search-index.json` and `catalogue.json`.
- `npm run test:templates` → 42 tests pass, including capsule identity, per-serving amounts, pending evidence, shared chrome, metadata, AURA-only add-to-cart, storage contract, and null-price handling.
- Services compile: concierge, commerce, auth, payments bundles produced by esbuild.
- Types updated: PurchaseOwner, PaymentMethod, PaymentStatus, VerificationStatus, AdminRole/AdminSession, etc. with detailed JSDoc.
- Selected herbal-supplement previews are now allowed under D-020. New product copy omits supplier health and certification claims; the legacy React demo catalogue still needs a separate content cleanup.

## Next work

- **P0 (truth hygiene), then the React chrome:** remove the fabricated demo catalogue in `constants.ts`, the false `Store` schema and health claim in `index.html`, the placeholder GSC token, and settle Tailwind delivery (D-021). The generated cart/wishlist now work, so this is the next structural blocker.
- Ask the supplier for the exact-product physical label, a batch-linked certificate of analysis, and any actual organic certificate. The current PDF only provides label content.
- Add the product photograph when supplied with publication permission. The page is usable as a preview meanwhile.
- Keep taking owner-selected links through the same factual intake. Decide the remaining category structure and reconcile the legacy React demo catalogue with the generated catalogue before launch.
- Git: use `E:\OLD Client and Projects\A\Git\cmd\git.exe`; repo root is the outer AURA folder and origin is `https://github.com/MARC414/AURA-eCommerce-Shop.git`. Stage explicit paths and use fast-forward pushes. No further force-push approval is implied.

## Inputs still needed (future phases)

| When | Input / decision |
|---|---|
| Payment provider | Which operator/bank will settle to Bangladesh; or confirm Belgium-based partner can receive funds. |
| Trading entity | Bangladesh trade licence, TIN, BIN, and registered address for invoices. |
| Supplier terms | Confirmed ingredient lists, safety reports, responsible persons, image permissions for each product. |
| Affiliate payout | Verify commission eligibility from AliExpress/CJ/Amazon for Bangladesh entity. |
| Books | Exact editions with established hosting rights for full publication/sale. |
| Wider site | Homepage claim cleanup (P0), then decide Tailwind delivery (D-021). |

These do not block product-preview intake. Live payments, deployment, and new installations need their own approval.

## Implemented pilot pages

Project directory: `AURA-eCommerce-Shop-main`.

- `/shop/turmeric-cleansing-soap/` — dropshipping preview, pending price/options, compliance section.
- `/shop/aloe-vera-soap/` — dropshipping preview, pending price/options, compliance section, supplier facts.
- `/discover/turmeric-cleansing-pads/` — affiliate/referral page, exact CJ token disclosed, external purchase explanation, no cart.
- `/shop/ashwagandha-with-black-pepper/` — 60-capsule herbal supplement preview; label-stated facts and pending evidence.
- `/shop/` and `/discover/` — collection pages browsable by model.
- `/preview/` — combined preview index linking to all pages (not in the menu).
- Product pages generated from `data/pilot-products.json` via `templates/product-pages.mjs`; static assets in `public/assets/`.

All preview pages respect the core rules: card fields absent, payment status honest, compliance transparent, no medical claims.

## Verification

- `npm run build:templates`: 26 HTML pages generated, broken-link check clean.
- `npm run test:templates`: 42 tests passed.
- Chrome DOM-checked at 1000 px and inside a 375 px frame: no horizontal overflow, 44 px targets, 320 px search field, static mobile panel.
- P1b browser probes: add-to-cart stored the item, badge survived navigation, cart rendered "Price being prepared"/`—`, quantity increase updated storage, wishlist add/remove worked, affiliate page had no add-to-cart or checkout link.
- Services compiled successfully via esbuild.
- Current browser checks: the new page has one H1 and parseable JSON-LD, the quantity control works, ordering stays disabled, and there is no horizontal overflow at the checked widths above. Affiliate-link preservation is covered by template tests.
- All preview pages are `noindex`. No production domain or live offer schema added.

## Scope affirmations

- Existing design is the baseline; distinct product templates share the AURA identity.
- Factual herbal-supplement previews are permitted; homeopathy, iridology, disease-treatment claims, and unsupported health/certification claims remain excluded.
- No deployment, package installation, supplier order, or payment action attempted.
- Cloudflare remains a temporary preview option only; not a settled production/subdomain strategy.
- Work is traceable via commits so AI Studio and Claude Desktop can continue.

## Frontend status

Generated product previews are usable for review. React cart, wishlist, order-request, newsletter, and admin features are browser-local prototypes, not live services. Prior esbuild compilation was not a full TypeScript or end-to-end check of the application. Production canonical/sitemap URLs and preview crawling rules still need a launch review.

## Earlier 2026-11-06 notes (history; current intake above takes precedence)

- Handoff docs created in `AURA-eCommerce-Shop-main/docs/`: `HANDOFF.md`, `ARCHITECTURE.md`, `PAYMENTS.md`, `COMPLIANCE.md`. Other tools should read these + this file before acting.
- Honesty fixes (D-018): fake seeded orders/reviews cleared; default `admin123` PIN removed. `paymentStatus: 'paid'` now only appears in code that filters for it, never as seeded data.
- `.agents/product-marketing.md` bumped to v4.
- **Ashwagandha decision (owner, 2026-11-06):** Owner will supply separate product links later. Keep the existing demo products as-is for now; do NOT add new medical/health-claim content. Replacement will happen when owner links arrive. Recorded as a pending catalogue swap, not an exemption.
- **Git resolved 2026-11-06:** git found at `E:\OLD Client and Projects\A\Git\cmd\git.exe` (v2.55.0). Local repo initialised at `E:\e-COMMERCE BUSINESS\AURA` with `.gitignore` excluding ZIPs, `Book/`, `node_modules/`. Remote: `https://github.com/MARC414/AURA-eCommerce-Shop.git`. First commit `741a02a` pushed. Remote `main` previously held the old root-level layout; owner approved replacing `main` with `master` (`git push --force origin master:main`). Both `main` and `master` now point to `741a02a`. Ashwagandha catalogue swap pending owner-supplied product links (see above).
- **Product detail page — production SEO layer added 2026-11-06 (27/27 tests):** canonical links, JSON-LD Product + BreadcrumbList (Offer only when a real price exists), Open Graph image/url, per-product `seo` fields in `pilot-products.json` (draft descriptive keywords only — no search-volume data held, no blocked claims used as keywords), `public/robots.txt` (preview disallow-all) + generated `public/sitemap.xml`. Affiliate CTA keeps `rel="sponsored noopener noreferrer"` + disclosure — no blind redirect. Pages remain `noindex` until launch. Owner confirmed Payoneer account; added as a disabled provider entry — receiving rail only, not a checkout. See `docs/PAYMENTS.md`.
- **D-019 corrected by D-020:** the powder/root-only interpretation was an agent error. The latest CJ capsule listing is now added as a preview; the earlier AliExpress capsule listing remains unlisted.
