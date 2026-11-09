# AURA — Decision Log

Append-only. Each entry records what was decided, why, and whether it is reversible.
Status values: **APPROVED** (owner), **PROPOSED** (agent suggestion, not approved), **REJECTED**, **SUPERSEDED / CORRECTED**.

**Current reading note (2026-11-09):** Read D-020 first: it corrects the mistaken powder/root-only interpretation in D-019 and records the CJ capsule selection. D-017 covers the frontend structure request; D-014/D-015 correct earlier assumptions. Older entries remain history, not current authority where corrected. D-021 and D-022 are **pending owner choices** (Tailwind delivery, duplicate template set); D-023 records the owner's static-first direction; D-024 and D-025 record the executed P1a/P1b work. See `planning/SITE-ARCHITECTURE.md` for the page map and the cart/state design.

---

## D-001 — Affiliate-first, not shop-first
**2026-11-03 · APPROVED**
Start with affiliate links so AURA is not the seller, avoiding cosmetics, food, VAT, and returns obligations. Affiliate commission also funds later compliance work.

## D-002 — Two hubs: affiliate for high ticket, dropship for mid ticket
**2026-11-03 · APPROVED**
Affiliate works at £100+ because commission scales with price. Dropship works at £35–150 because margin covers shipping and VAT. Sub-£25 dropship deferred — the lowest price band carries the highest compliance cost per order.

## D-003 — Exclude medical, homeopathy, supplements, health claims
**2026-11-03 · APPROVED**
Regulatory exposure and absent evidence. Art, culture, sound, and books replace them.

## D-004 — No copyrighted files on the site
**2026-11-03 · APPROVED**
`Book/` contains 245 PDFs and 59 videos, overwhelmingly from PDFDrive, Z-Library, Studocu, and Coursedrive. "Free" does not remove copyright. UK CDPA 1988 covers reproduction and distribution, not price. A takedown would suspend the whole site, including the shop.

## D-005 — Books: free PD library in HTML, reviews, affiliate links
**2026-11-03 · APPROVED**
Public-domain texts published as HTML build SEO and email. Reviews of in-copyright books are lawful under fair dealing (CDPA s.30) with attribution and brief quotation. Interior images and full files are not permitted. Charging for PD texts is lawful but commercially weak — give them away, sell original writing instead.

## D-006 — Reviews may use cover images only
**2026-11-03 · APPROVED**
Cover thumbnails sourced from the affiliate image feed are acceptable. Interior plates are not, especially for art-instruction books where the images are the product.

## D-007 — No dropshipping from Amazon
**2026-11-03 · APPROVED**
Amazon's Associates agreement prohibits purchasing through own links for resale and prohibits dropshipping. Legitimate alternative: wholesale accounts with Gardners or Ingram.

## D-008 — Preserve storefront design, change rendering strategy
**2026-11-03 · APPROVED**
Visual identity is fixed. The React/Vite SPA must be prerendered so each product and page has real HTML and unique metadata.

## D-009 — No renaming yet
**2026-11-03 · PROPOSED**
Keep `AURA` as house brand, add a descriptor, use named collections. Full rename deferred until trademark availability in classes 3, 5, 30, 35, 41 is checked.

## D-010 — No paid ads before earnings data
**2026-11-03 · PROPOSED**
No conversion or earnings-per-session data exists. Advertising spend would be unoptimised.

## D-011 — Build structure before payments
**2026-11-03 · APPROVED**
Site structure, design, and product display come first. Payments, trade licence, and domain cutover come last. No checkout until a gateway is live and the seller identity is settled. Rationale: design decisions are reversible; taking money is not.

## D-012 — Cloudflare Pages for development, `.co.uk` held back
**2026-11-03 · APPROVED**
Development happens on a Cloudflare Pages preview URL, protected and `noindex`. The `.co.uk` is not attached until launch. Rationale: an indexed staging site with placeholder products damages trust and search standing before launch.

## D-013 — Two separate page templates, not one
**2026-11-03 · APPROVED**
Hub A (affiliate) and Hub B (dropship) get different templates and different data models from the start. Affiliate pages carry no price, no cart, and no "add to basket". Mixing them in one grid without a label creates consumer-law and disclosure problems.

---

## Rejected

| Idea | Why |
|---|---|
| $5/year subscription for the book library | Trivial revenue, unlimited liability, requires gateway and digital VAT registration |
| Hosting the art book PDFs "with a disclaimer" | A disclaimer cannot license content |
| Amazon dropshipping | Contractually prohibited |
| Competitive Ads skill install | Redundant with installed `ads-competitor` |
| Wholesale cinematic redesign | Contradicts design-preservation requirement |
| Health claims framed as "traditional use" | Same regulatory exposure |

---

## D-014 — Corrected current baseline
**2026-11-04 · OWNER CLARIFICATIONS + RECORD CORRECTIONS**

The current scope comes from the owner's actual requests, including corrections about source platforms, the pilot catalogue, and undeployed Cloudflare hosting.

| Earlier entry / claim | Current authoritative reading |
|---|---|
| D-001 affiliate-only first | Superseded as the website build scope: prepare both affiliate and dropshipping templates together, initially for display. Activation timing will be decided later. Affiliate revenue funding everything else was a suggestion, not a forecast. |
| D-002 numeric price bands | Corrected: owner prefers higher-price affiliate and lower-price dropshipping. No £100 minimum, £35 floor, or blanket sub-£25 rejection was approved. |
| D-003 medical exclusions | Medical/homeopathy and health-claim content stay outside current scope. Do not confuse artistic figure-drawing material with medical guidance simply because its title says anatomy. |
| D-004 all files from named sources are copyrighted / automatic whole-site suspension | Not established by the recorded evidence. Source names and takedown predictions are not legal determinations. The owner's decision is to host only books with established rights; keep originals intact while checking. |
| D-005 free HTML library and affiliate links on every book | Recommendations, not settled access/monetisation decisions. Owner's confirmed requirement is publishable full books, potentially for sale. Exact editions and territories need checking. |
| D-006 covers always allowed / interior images always forbidden | Not a verified blanket rule. Actual rights, permissions, applicable exceptions, and affiliate asset terms must be checked when an image is proposed. |
| D-007 Amazon prohibition | Not an approved AURA sourcing restriction. The previous explanation conflated Associates self-purchases, marketplace dropshipping policies, and retail sourcing. Verify the specific program/workflow if considered. |
| D-008 mandatory prerender migration | Design preservation and useful per-page HTML/SEO are owner goals. The implementation approach remains undecided; no migration approval. |
| D-009 name | Keep AURA as the current working name. Descriptor/rename and availability research remain open. |
| D-010 paid advertising | A later recommendation, not an approved permanent restriction. |
| D-011 structure before sales | Confirmed. Build the presentation and catalogue before real payment/selling operations. Required documents depend on the eventual setup. |
| D-012 Cloudflare preview already arranged | Corrected: owner has not deployed there. It is a temporary viewing option. No permanent subdomain strategy, final hosting decision, or preview access configuration is approved. |
| D-013 two product templates | Confirmed. Supplier is separate from model: AliExpress/CJ/future sources are not tied to one hub. No blanket prohibition on affiliate prices or shared discovery grids was approved; clarity and actual source terms guide the details. |

Additional confirmed facts: owner is in Bangladesh, partner is in Belgium, international reach is the goal, and market selection should be product-specific. Pilot size is one affiliate plus one dropshipping product. Skill selection should be small and task-relevant.

Older universal claims about VAT, Bangladesh documents, payment eligibility, DSers incompatibility, AliExpress APIs, image use, or supplier quality require source-grounded verification for the actual setup. They are not a ready-to-apply operating policy.

## D-015 — One ordered roadmap
**2026-11-04 · APPROVED TO DRAFT; SEQUENCE PROPOSED**

Owner requests a step-by-step outline to organise the accumulated discussion. `ROADMAP.md` v1 is the proposed sequence: blueprint, pilot materials, templates, site completion, temporary preview, quality review, selling arrangements, integrations/tests, public launch, and evidence-led expansion.

This request authorises the outline and memory consolidation, not automatic execution of later implementation, installation, payment, or deployment steps.

## D-016 — Build the two pilot layouts
**2026-11-06 · APPROVED (owner explicitly requested design and build)**

Owner supplied AliExpress item `1005007532901889` as the dropshipping example and CJ item `2114448810729783298` as the affiliate/referral example, then explicitly instructed the assistant to build the planned layouts instead of continuing to discuss specifications.

- Implement the two reusable layouts in AURA's existing visual identity, with individual product URLs and separate collection pages.
- Pilot pages use generated HTML/CSS/JavaScript alongside the existing React storefront. This does not authorise rewriting the entire site.
- Product details unavailable from the suppliers remain clearly marked as pending; no invented prices, variants, testimonials, stock, or delivery promises.
- Dropshipping ordering remains disabled. CJ's supplied referral URL is preserved, with its unverified commission status disclosed.
- Frontend build and local review only: no package/tool installation, payment integration, supplier order, backend/admin build, public deployment, or production domain changes.

---

## D-017 — Complete site structure with compliance, payment, cart, admin, newsletter, chatbot
**2026-11-06 · APPROVED (owner-requested extensions to initial pilot build)**

Following D-016 approval, owner subsequently requested completion of the full e-commerce structure including payment handling, cart persistence, wishlist, admin panel for multiple users, newsletter signup, free chatbot, and compliance/verification space for lab tests, medical reports, and accreditation.

- Added third pilot product (aloe vera soap) to data/pilot-products.json with complete supplier facts and `price: null`.
- Created comprehensive compliance register in data/compliance.json tracking verification items per product and store-level requirements (trade licence, responsible person, safety reports, etc.).
- Rewrote checkout (Checkout.tsx) to remove all card fields; implemented invoice/bank-transfer flow with `paymentStatus: 'awaiting_payment'`; no client can mark orders as paid.
- Implemented cart persistence via commerce.getCart()/saveCart() in App.tsx.
- Updated OrderSuccess.tsx to honestly represent "request received — not paid" state with clear next steps.
- Rewrote Assistant.tsx to use deterministic askConcierge over data/knowledge-base.json (no LLM, no cost).
- Updated Footer.tsx to reflect honest newsletter messaging: "Saved on this device. A confirmation email will be sent once a mailing provider is connected."
- Created AdminGate.tsx for passphrase setup/login (SHA-256 hash in localStorage, no default PIN).
- Extended AdminDashboard.tsx to multi-user panel with roles/permissions model, compliance tab displaying verification statuses, and team management.
- Enhanced types.ts with PurchaseOwner ('aura' | 'partner'), SourcingModel, PaymentStatus, PaymentMethod, verification types, AdminRole/AdminSession/AdminUser/ROLE_PERMISSIONS, NewsletterSubscriber.
- Created services layer: concierge.ts (knowledge base retrieval), commerce.ts (cart/newsletter), auth.ts (passphrase and roles), payments.ts (provider registry, FORBIDDEN_CARD_FIELDS).
- Added compliance section to product-pages.mjs template with status panels, blocked claims list, and responsible person display.
- Updated all related tests in product-pages.test.mjs to verify compliance handling, price pending display, and honest status reporting.
- 26/26 template tests pass; all service modules compile via esbuild.

This work fulfills the owner's request to: finish site structure (product pages, cart, wishlist, payment, admin for multiple users, newsletter, free chatbot), with a compliance/verification space for lab tests/medical reports/accreditation; keep shared memory current for AI Studio and Claude Desktop continuation; preserve AURA visual identity with plain HTML/CSS/JS; create two distinct product templates (dropshipping/affiliate) with one canonical URL per product; and not publish any medical/homeopathy/supplement/health-claim content.

Implementation honors all hard rules: planning first (no deploy/install/config changes without approval), book publication only with established rights, no medical content, preserving storefront design, supplier-neutral hub classification, using extracted project only, and keeping secrets out of version control.

## D-018 — Remove fake seeded data and default PIN
**2026-11-06 · APPROVED as honesty fix under D-017**

- `INITIAL_ORDERS` and `INITIAL_REVIEWS` in `services/storeService.ts` contained invented customers, `paymentStatus: 'paid'`, tracking numbers, and `verified: true` reviews. Cleared to empty arrays so admin metrics and product pages cannot present fake sales/reviews as real. Existing browser localStorage copies are not migrated — clearing site data removes them.
- `INITIAL_SETTINGS.adminPin: 'admin123'` removed (set to empty, deprecated). The only lock is now `AdminGate`/`auth.ts` passphrase with no default. The old PIN field is retained only for type compatibility.
- `constants.ts` Ashwagandha/health-claim demo products were NOT removed in this edit — that is a catalogue decision requiring explicit owner approval (see STATUS open item). No new medical content was added.

## D-019 — Owner reverses supplements ban for herbal botanicals (powder/root)
**2026-11-06 · CORRECTED BY D-020: the agent misread the requested product form**

Owner explicitly instructed: change the rules and add Ashwagandha as powder or herb roots (capsule form not wanted / not found).

Scope of reversal (narrow, not a full repeal):
- ALLOWED: herbal botanicals in powder/root form (Ashwagandha) as a product category, preview-only.
- STILL FORBIDDEN: homeopathy, iridology, disease-treatment/cure/prevention claims, and any health claim without authorised evidence. "Traditional use" framing does not authorise a claim.
- Guardrails retained: every herbal product requires a compliance record (`food-safety`, `lab-test`, `labelling`, `claims`) with status `not-provided` until documents are collected; blocked claims listed on the page; no sale until record is `verified`; no "organic"/"certified" badge without accreditation evidence.
- Capsule link supplied on 2026-11-06 (AliExpress `1005013385024290`, 30 caps, £8.49) was NOT added — owner requested powder/root form instead, and capsule claims were unverified.
- Ashwagandha powder/root product link still needed from owner before intake can proceed.

## D-020 — Correct the capsule preference and intake CJ Ashwagandha with Black Pepper
**2026-11-06 · OWNER CORRECTION + SUPPLIED LISTING; SHOP ROUTE IS AN IMPLEMENTATION ASSUMPTION**

- The owner asked to change the rules and add Ashwagandha **because powder or roots were not found**. D-019 incorrectly recorded this as rejecting capsules. Factual previews of owner-selected herbal supplements may include capsules. Homeopathy, iridology, disease-treatment claims, and unsupported health/certification claims remain excluded; preview approval does not activate sales.
- Latest selected listing: CJ `1898627038642925570`, SKU `CJHP232030301AZ`, Ashwagandha with Black Pepper. The owner supplied listing text and a PDF. It is **60 capsules**. The `Powder` attribute conflicts with the description; **113 g is gross package weight**. Do not call it loose powder or carry over the earlier AliExpress product's 500 mg amount or brand.
- The live CJ URL returned human verification. Listing information is owner-supplied supplier text, not an independent live-listing check. The PDF reader failed, but the one-page PDF was rendered with the existing Windows PDF renderer and visually reviewed locally.
- **Verified document observation:** the PDF is label artwork, not a laboratory report or accreditation. Its Supplement Facts state 2 capsules per serving, 30 servings, 1,300 mg Ashwagandha root and 10 mg black pepper fruit per serving, and pullulan capsules as the inactive ingredient. These are transcribed label statements, not verified composition or dosing advice. The artwork names Vendercart; exact SKU/batch linkage and the physical label remain unverified.
- **Implementation assumption:** use `/shop/ashwagandha-with-black-pepper/` for the supplied sourcing listing. This is not a supplier-to-hub rule; an affiliate entry would need the owner's appropriate tracking URL. No referral token was invented.
- Selling price remains `null`. Supplier cost, inventory, and domestic shipping estimates are not imported as AURA price, stock, or promises. Label review is `pending`; batch tests, organic/free-from evidence, image permission, and selling terms remain outstanding. The original PDF and its rendered image stay outside the repo.
- Product category: **Herbal Botanicals**. This supplement is separate from the requested cosmetics collection; no organic category or certification badge is inferred.
- Reuse the existing generated HTML template and homepage pilot links. Add the matching compliance record and update the local concierge's answers. The legacy React demo catalogue remains a separately recorded follow-up, not verified supplier data.

## D-021 — Tailwind delivery: Play CDN or compiled CSS
**2026-11-09 · EXECUTED 2026-11-10 (owner approved "Moss is confirmed then… you can go"). Option B implemented:** `tailwindcss@^3.4.0` + `postcss` + `autoprefixer` devDependencies, root `tailwind.config.js` (semantic colour names mapped to the D-030 roles), and an explicit in‑Vite PostCSS config path in `vite.config.ts` (no PostCSS config‑file discovery). `@tailwind base/components/utilities` prepended to `index.css`; Play CDN `<script>` removed from `index.html`. Build verified: `npm run build` clean, compiled `index-*.css` (43.48 kB) contains the semantic utilities (e.g. `.bg-canvas`, `.text-paper`, `.bg-forest`), no `cdn.tailwindcss.com` in the built HTML.

**Finding:** `AURA-eCommerce-Shop-main/index.html` line 36 loads `https://cdn.tailwindcss.com`, a runtime script. Tailwind's own documentation states the Play CDN is "designed for development purposes only, and is not the best choice for production". The React components use roughly 765 Tailwind class usages, so the CDN is currently a hard dependency, not decoration.

**Options put to the owner:**

| Option | Work | Result |
|---|---|---|
| A. Keep the CDN | none | render-blocking third-party script, no version pin, no purge, no build. Permanently unshippable for a launch. |
| B. Compile Tailwind at build (*recommended*) | ~half a day: add `tailwindcss`/`postcss` devDependencies, content globs, import in the currently empty `index.css`, remove the CDN `<script>` | all class names keep working, no visual change expected, CDN risk removed. Requires one `npm install`, which needs separate approval. |
| C. Remove Tailwind, hand-write token CSS | days: 765 class usages | maximum control, no dependency, but duplicates what the generated pages already do and risks visual regression. |

**Constraint:** whichever option is chosen, AI Studio's preview must still boot. Option B must be verified inside AI Studio immediately after the change, with a one-commit revert ready.

**Not approved. No edit made.**

## D-022 — Remove the duplicate `product-detail` template set
**2026-11-09 · APPROVED AND EXECUTED (owner instructed deletion)**

Untracked files `templates/product-detail.html`, `public/assets/product-detail.css` (21 KB) and `public/assets/product-detail.js` (21 KB) duplicated the tested generator in `templates/product-pages.mjs` and introduced a second CSS system.

**Verified:** none of them was referenced by `scripts/`, `templates/`, `data/`, or `tests/`. The set had already been removed once in commit `9c90890` and reappeared untracked, most likely from an AI Studio export.

**Executed 2026-11-09:** all three deleted from the working tree. Because they were untracked, a copy was placed outside the repo at `C:\Users\HP\AppData\Local\Temp\opencode\aura-product-detail-backup-20261109\` before removal. Template tests re-run afterwards: 30/30 pass. No other file changed.

## D-023 — Static-first architecture (HTML/CSS/JS, progressively enhanced)
**2026-11-09 · APPROVED (direction; implementation details pending)**

The owner asked whether a static HTML/CSS/JS build is SEO- and Google-friendly, and stated a preference for it if so. Confirmed: pre-rendering is recommended by Google because it is faster for users and crawlers and "not all bots can run JavaScript" (https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). Static HTML also gives correct per-page status codes, canonicals, and metadata, which a client-rendered SPA has to inject.

Recorded direction:

- Catalogue, product, collection, library, journal, help, and policy pages are delivered as static HTML with a shared CSS layer and small progressive-enhancement scripts.
- Dynamic behaviour (cart, wishlist, search, checkout request, admin) remains small explicit JavaScript islands. **Static delivery is not static commerce:** order submission, inventory, and payment will require server functions when they exist.
- The React app is retained as the app shell (home, cart/checkout, admin) because AI Studio depends on the root build adapter committed in `87996f1`. Removing or restructuring that adapter is out of scope.
- The cart must use one implementation shared by both renderers, reading the existing storage key `aura_cart_v1`. The detailed proposal is section 2 of `planning/SITE-ARCHITECTURE.md`; it still needs its own go-ahead before any code is written.
- One navigation and one footer across the site, generated from a single `data/site.json` contract. No nav entry may point at a page that does not exist.

This entry authorises no build work. Each phase in `SITE-ARCHITECTURE.md` section 6 requires separate approval.

## D-024 — P1a executed: one chrome from `data/site.json`
**2026-11-09 · EXECUTED (owner said "start next step")**

**What changed in the generator only.** The React app, its components, `App.tsx`, and the root AI Studio build files were not edited.

1. **One chrome contract.** `data/site.json` now holds brand, preview status, the three utility actions, four top-level navigation items (Shop, Perennis, Journal, About) with their panels, and five footer columns. `templates/product-pages.mjs` renders the header and footer from it; no link is hard-coded in the template.
2. **Two-row header.** Row one: wordmark, a real GET search bar (`action="/search/"`, `name="q"`), wishlist and cart. Row two: the four sections plus the preview badge. Submenus use native `<details>`/`<summary>` so they work with JavaScript disabled and on touch; `assets/site.js` only adds "one panel at a time", Escape-to-close, and a read-only cart count from `aura_cart_v1`.
3. **The pages the menu points at exist.** `data/pages.json` plus `renderStaticPage()` produce 19 content pages: Perennis hub, books, music; Journal; About; Contact; Help/FAQ; Policies index and eight policy URLs; Search; Wishlist; Cart. Every one carries `noindex, follow` and one `h1`. Total generated pages: 26.
4. **`/preview/` replaces `/templates/`.** The preview index left the production menu; the old directory is deleted by the generator so it cannot drift back.
5. **Search is functional, not decorative.** The build emits `public/assets/search-index.json` (23 entries: home, 4 products, 18 content pages) and `/search/` filters it client-side. Verified: `?q=soap` returns both soap pages and reports "2 results".
6. **Dead links are now a build error.** After rendering, the generator extracts every internal `href` and throws if the target page was not generated. `"/"` is exempt because the React shell serves it.
7. **Tests: 30 → 34.** Two existing assertions that banned any `<form>` on product and affiliate pages were narrowed to ignore the header's search form (`withoutHeaderSearch`), because a search field is not a purchase control; the no-checkout, no-quantity, no-payment assertions are unchanged. Four new tests cover the four-item menu, generated targets for every nav/footer link, the single shared header/footer, and static-page validation.

**Deliberately not done:** add-to-cart on static pages, wishlist persistence, checkout or payment, React `Navbar`/`Footer` unification, Tailwind delivery (D-021 still open), and homepage claim cleanup. The cart and wishlist pages currently explain their state honestly rather than pretending to work.

**Verified:** 34/34 template tests pass; generator broken-link check clean; 26/26 routes return 200 from the local preview server (`/` redirects to `/preview/` by design); DOM probe at 1000 px and inside a 375 px frame shows no horizontal overflow, 44 px minimum targets, a 320 px search field, and a static (non-overlapping) mobile panel.

## D-026 — Production structure: full commerce IA generated from data/
**2026-11-09 · APPROVED (shell build complete; test suite passes)**

Following D-025 P1b, the owner approved removing preview/compliance presentation from public pages and building the full commerce information architecture. This entry records the P2 structure execution.

**What was built:**

1. **Six-category taxonomy** in `data/collections.json` (`herbal-botanicals`, `everyday-care`, `sacred-sound`, `yoga-practice`, `art-craft`, `quiet-living`) with matching to `product.category`.
2. **28 content/application pages** in `data/pages.json`: Perennis, Journal, About (incl. sourcing), Contact, Imprint, Help, 13 policy/utility pages (privacy, terms, cookies, shipping, returns, payment, accessibility, affiliate-disclosure, health-disclaimer), search, wishlist, cart, checkout, account, newsletter. All production copy, no preview/compliance theatre.
3. **40 product pages** generated from `data/pilot-products.json` (4 products: 1 affiliate + 3 dropshipping), all with `listingStatus: "published"`, `price: null`, and "Price on request" display.
4. **Full page template** (`templates/product-pages.mjs`) with grouped nav panel, category strip/toolbar, category renderers, product cards, purchase panels (dropshipping add-to-cart + affiliate external CTA), wishlist toggle, breadcrumbs, JSON-LD schema (no Offer for unpriced pieces), and invoice-request checkout.
5. **Generator** (`scripts/generate-product-pages.mjs`) producing search-index, catalogue, robots (launch switch: disallow all), and sitemap; enforces zero broken internal links.
6. **Shared browser store** (`public/assets/cart.js`) extended with `aura_order_requests_v1` and `aura_newsletter_v1` keys; `hasPendingPrice()` guard against `Number(null) === 0` bug; invoice request flow with reference generation; account and newsletter preference pages.
7. **CSS** (`public/assets/product-pages.css`) for grouped nav, category rooms, checkout, orders, newsletter, responsive breakpoints down to 320 px.
8. **Test suite** (`tests/product-pages.test.mjs`) rewritten to 45 tests; 2 failures fixed: (a) `/selected\./` → `/selected/` regex, (b) checkout card-field regex changed to inspect only `<input>` tags rather than prose text.

**Disclosures retained:**

- Pages are `noindex, follow` until a real domain and absolute canonical URLs exist (launch switch `INDEXABLE = false` in template). Disclose at go-live.
- `robots.txt` disallows all as a launch switch; sitemap uses relative URLs.
- No card fields, no payment collection, no order submission at any stage.
- Price null = "Price on request" across all pages; no fabricated amounts.

**Status:** P2 structure execution complete. All 45 tests pass. Next steps: browser-probe at 375 px, record go-live launch decisions, consider D-027 for checkout/PayPal guardrails if/when a server gateway is connected.

---

## D-027 — Centred menu in the header, with a visible category bar
**2026-11-09 · APPROVED (owner: “the menu will be in the middle exactly in header or navbar. Each category must have individual page”)**

**Problem the owner saw:** the six shop categories were hidden inside the Shop dropdown panel, so they appeared absent from the navbar/menu. The menu row also sat left-aligned.

**Change (header only, no new top-level items — the 4-item uncrowded test still applies):**

1. **Primary menu centred.** `.header-bottom { justify-content: center }` and `.primary-nav { justify-content: center; width: 100% }` — Shop · Perennis · Journal · About now sit in the middle of the header's second row. Dropdown panels centre themselves under their button (`left: 50%`, `translateX(-50%)`, `max-width: calc(100vw - 48px)`); the ≤760 px rules reset the panel to static with `transform: none`.
2. **Visible category bar in the navbar.** A new `<nav class="category-nav" aria-label="Shop categories">` sits directly under the primary menu, centred, on every page: All pieces + the six `data/collections.json` rooms, each linking to its own individual page (`/shop/herbal-botanicals/` … `/shop/quiet-living/`). It renders from `collections`, so a future category gets its navbar link automatically.
3. **Each category keeps its individual page.** The six `/shop/<slug>/` pages are unchanged in route and content (own H1, breadcrumb, product list or honest empty state). The Shop dropdown keeps the same six links under "Sold by AURA" for keyboard/touch parity.
4. **Tests:** the shared-header test now asserts the `category-nav` block and one link per collection slug on every generated header; the styles test asserts the centred `header-bottom`, `primary-nav`, `category-nav` and centred panel rules.

**Verified:** 45/45 tests pass; generator regenerates 40 pages with zero broken internal links (the new navbar links resolve to the six category pages). `noindex`/robots launch switch unchanged.

## D-028 — Categories beside Shop in the main menu; Showpieces replaces Sacred Sound in the shop
**2026-11-09 · APPROVED (owner correction to D-027’s row-3 category bar)**

**Owner direction:** no third row (it would make the header too large). Put the categories in the main menu directly beside Shop, with all category names as the submenu under “Categories”. Sacred Sound is not a shop category — it belongs to Perennis (free books and music). Create Showpieces: exceptional miscellaneous pieces (wooden showpieces, meditative candles, organic ornaments), correcting the earlier “antique” framing.

**What changed:**

1. **Row 3 removed.** The `category-nav` bar from D-027 is deleted from `templates/product-pages.mjs` and its `.category-nav` CSS removed. The header returns to two rows — the centred main menu sits directly under the wordmark/search/utility row, so the header stays compact. Centring from D-027 (`.header-bottom`, `.primary-nav`, centred panels) is kept.
2. **“Categories” is a top-level item beside Shop.** The primary menu is now Shop · Categories · Perennis · Journal · About (5 items, still uncrowded). Shop’s own dropdown is reduced to All pieces + Partner offers; the Categories dropdown lists all six category names, each linking to its individual page (`/shop/<slug>/`). The site contract (`data/site.json`) holds both, so the header stays generated from data.
3. **Sacred Sound leaves the shop taxonomy.** `data/collections.json` drops `sacred-sound` and adds `showpieces` (“Exceptional miscellany”: wooden showpieces, meditative candles, organic ornaments, one-of-a-kind objects; `matches: ["Showpieces"]`). The stale `/shop/sacred-sound/` page is removed from `public/`; `/shop/showpieces/` is generated (own H1, breadcrumb, honest empty state). Product matching, shop category strip/tiles, sitemap, and search index all follow `collections.json` automatically.
4. **Sacred Sound now lives in Perennis.** The Perennis submenu gains “Sacred Sound” (→ `/perennis/music/`, “Recordings and listening”), and the Music page copy names sacred sound explicitly. The Shop footer column drops Sacred Sound and gains Showpieces.
5. **Tests:** menu assertion updated to the 5-item order Shop · Categories · Perennis · Journal · About with Categories children deep-equal to `collections`; the empty-category test now uses Showpieces; header tests assert every collection href appears in the menu, no `category-nav` row, no `/shop/sacred-sound/` link, and that “Sacred Sound” appears (via the Perennis submenu); styles test asserts the `.category-nav` CSS is gone.

**Verified:** 45/45 tests pass; 40 pages regenerated, zero broken internal links; the new top-level order and both dropdown panels confirmed in generated HTML; Showpieces page exists, Sacred Sound shop page deleted, no shop Sacred Sound link remains.

## D-029 — Cloudflare Pages build failed: copy main's build config onto master verbatim
**2026-11-09 · FIX (agent diagnosis; owner action still needed in Cloudflare dashboard)**

**Observed failure (owner pasted from GitHub PR #1 merge view):** “All checks have failed — Cloudflare Pages — Building” on the PR `master` → `main`. Via the public GitHub API: PR #1 head `4711871` (master), base `75c0edd` (main), `mergeable: true`, check-run 128876976317 `conclusion: failure`, status completed — started 22:04:57Z, completed 22:04:57Z (**under one second**, so an instant config error, not a real build failure). Build logs live behind Cloudflare dashboard auth and are not readable from here.

**Diagnosis (owner-verified fact):** `origin/master` has **no root `package.json`** — its root tree is only `.agents`, `.gitignore`, `AGENTS.md`, `AURA-eCommerce-Shop-main/`, `CLAUDE.md`, `planning`. Cloudflare Pages builds with root directory `/` and build command `npm run build` (per `docs/CLOUDFLARE.md` on main), so npm errors with ENOENT instantly. `main` carries the AI Studio root files (87996f1) and the Cloudflare config commit (75c0edd); `master` never received them.

**Fix (repo-only, committed to master, no force, no config edits on main):** copy the 11 files from `origin/main` **byte-for-byte** onto master:
- Root: `package.json`, `vite.config.ts`, `tsconfig.json`, `metadata.json`, `.node-version`, `.nvmrc`
- Nested: `AURA-eCommerce-Shop-main/public/_headers`, `AURA-eCommerce-Shop-main/public/_redirects`, `AURA-eCommerce-Shop-main/docs/CLOUDFLARE.md`, `AURA-eCommerce-Shop-main/.node-version`, `AURA-eCommerce-Shop-main/.nvmrc`

Verified `git diff --cached origin/main` shows **no diff for those 11 files**, so the master→main merge stays conflict-free and trivial for config (identical both sides). Net effect: master now builds standalone with the documented settings (root `/`, `npm run build`, output `dist`).

**Build-readiness verification (no npm install per AGENTS.md):** `prebuild` generator runs clean on master (40 pages, zero broken links); 45/45 tests pass; a static import-graph check (31 SPA files, 95 imports) confirms every relative import resolves and every bare import is declared in `package.json` — the main vite-build failure classes. The full `vite build` still needs `npm install` to run; Cloudflare will be the first real vite attempt. If vite build fails for a code reason, the new check-run will show it.

**Owner action still required (dashboard, cannot be done from repo):** in Cloudflare Pages project `aura-ecommerce-shop`, confirm production branch is `main` (or accept `master` now that both build), build command `npm run build`, output directory `dist`, root directory `/`. PR #1 merge then deploys.

**Caveat:** pushing this to master re-triggers the Cloudflare check; success depends on the above dashboard settings matching the documented ones and on the first real vite build passing.

---

## D-025 — P1b executed: browser-local cart and wishlist on static pages
**2026-11-09 · EXECUTED (owner approved "go with P1b")**

**Scope.** One shared browser store, add-to-cart only where `purchaseOwner === 'aura'`, wishlist on both selling models, live counts in the shared header. No checkout, no payment, no server call, no order creation.

1. **Shared store.** New `public/assets/cart.js` exposes `window.AuraStore` and reads/writes exactly what the React app already uses: `aura_cart_v1` = `[{ product, quantity, selectedVariant? }]`, `aura_wishlist_v1` = `["product-id", …]`. It emits `aura_cart_updated` and `aura_wishlist_updated`, and dispatches the latter with `{ detail: { list } }`, matching `services/storeService.ts`.
2. **Product pages.** AURA-owned shop pages replace the disabled "Coming soon" button with an enabled **Add to cart** control carrying public product data attributes. Partner pages keep no cart or quantity control; they can still be saved to the wishlist. Both templates show a Save to wishlist toggle with `aria-pressed`. All result text says ordering is not open.
3. **Real pages.** `/cart/` renders items, quantity controls, remove, and a pending-price subtotal. `/wishlist/` joins saved IDs to a new build asset, `public/assets/catalogue.json` (public product fields only), and shows a removed product honestly rather than dropping it. Both pages are `<noscript>`-safe and state that nothing is sent anywhere.
4. **Header counts.** `site.js` now reads `AuraStore`, refreshes on both custom events and `storage`, and shows cart and wishlist badges that survive navigation.
5. **Null price bug caught by browser probe.** `Number(null)` is `0`, so the first implementation showed an unpriced item as `£0.00`. Every layer now treats `null`/empty as missing: `cart.js`, `cart-page.js`, `wishlist-page.js`, and the React subtotal helper. A unit test loads `cart.js` with a mock `window` and asserts `hasPendingPrice() === true` and `cartSubtotal() === 0` for an unpriced item.
6. **Deliberate React touch (disclosed).** `components/CartDrawer.tsx`, `components/Checkout.tsx`, and `services/commerce.ts` received display-only null-price guards so a static-page cart item cannot crash or show a fake `£0` total in the React shell. No layout, flow, or state behaviour changed; no other React file was edited.
7. **Tests: 34 → 42.** New coverage: AURA-only add-to-cart, wishlist on both models, script order (`cart.js` → `site.js` → page island), cart/wishlist shells, exact storage keys and item shape, wishlist catalogue fallback, the null-price behaviour above, and source guards on the React display fix. Affiliate still has no `<form>` beyond the header search and no checkout link.

**Verified:** 42/42 template tests pass; generator broken-link check clean; 28 routes/assets return 200. Browser probes: add soap → header shows `1`; `/cart/` shows "Price being prepared", line `—`, subtotal `—`, pending note visible; quantity increase updates storage and badge to `2`; wishlist toggle → `/wishlist/` shows the product, correct path, "Partner offer/Sold by AURA" label, then remove empties it. Affiliate page: 0 add-to-cart controls, 1 wishlist toggle, 0 checkout links, 1 header search form. No horizontal overflow at 375 px on product, cart or wishlist pages.

**Deliberately not done:** checkout, payment, stock reservation, accounts, cross-device sync, cart merge between the React shell and static pages beyond shared storage, and any supplier or analytics call.

---

## D-030 — Dark editorial canvas (Moss-style skin) supersedes Task 3's light shopping surface
**2026-11-09 — CONFIRMED by the owner 2026-11-10 ("Moss is confirmed then… you can go"). EXECUTED 2026-11-10 as follows:** (1) `:root` roles in `public/assets/product-pages.css` flipped to the dark ground (`#28332A` canvas, Evergreen raised, ivory `#EFF1E7` ink, sage `#C6CCBD` body, moss-line hairlines, gold eyebrows/accents) and the same roles in `index.css` (Tailwind semantic colour names `canvas/surface/paper/brass/moss/…`); (2) a `body.theme-paper` layer gives reading pages the cool-ivory ground with dark ink (applied via a new `theme` parameter on `documentPage()`, passed only by `renderStaticPage()`); (3) light-only component assumptions dark-tuned (status chips, `.badge-partner`, `.button-primary/.button-secondary`, `.claims-panel` marker, card hover/availability, `.button.is-confirmed`); (4) CSS-only grain (inline SVG data-URI) so the ground never reads as flat digital green, gold kept to hairlines/eyebrows, moss to large text only; (5) `<meta name="theme-color">` now `#28332A`. P0 truth hygiene in the same rollout: false `Store`/`Offer` JSON-LD, Play CDN, GSC placeholder and Unsplash preloads removed from `index.html`; the seeded demo catalogue (`PRODUCTS`, 45.8 KB of invented entries) emptied per D-018; the demo views (`ProductGrid`, `CategoryPage`, `JournalDetail`, `About`) removed from `App.tsx` so home = Hero + pilot previews; `storeService` defaults to `OPAR` / `hello@opar.example` with the products storage key bumped to `aura_products_v9`; `SHOP_ROOMS` added and nav/footer now link to the real static rooms (`/shop/<slug>/`, `/about/`, `/journal/`, policy pages). Hero rewritten as a dark editorial canvas with a reserved `data-photography-slot` (no stock/supplier imagery); legacy drawers/checkout/admin hexes cooled (`#F5F2EB`→`#EFF1E7` family). QA: 45/45 template tests, build clean, 0 overflow at 375/768/1440 on home/shop/paper pages, 12/12 internal routes 200. Photography remains deferred — the owner will supply images to drop into the reserved slots.

**Finding.** The owner wants the storefront's overall look to follow the Moss reference sheet (`Branding/bf7dca245779961.69b4ce1c2b3d0.webp`, a dark botanical e-commerce case study): a dark green page ground rather than Task 3's light Warm Ivory shopping canvas. Measurements: the reference's dark ground `#2F332B` sits at hue 90°/L 18%; OPAR's approved Forest `#101B12` is hue 131°/L 8% and reads as black next to it; the approved palette has no mid-dark step between Stone `#34382D` (L 20%) and Moss `#82915B` (L 46%).

**Proposal.** Add one derived token and re-role the dark surfaces, without copying any reference hex:

| Token | Value | Role | Contrast |
|---|---|---|---|
| `--moss-canvas` (proposed) | `#28332A` | dark page ground; OPAR hue family at the reference's lightness | ivory ink ≈ 11:1, gold ≈ 6.0:1, sage ≈ 6.9:1 |
| Evergreen `#1D3020` | existing | sunken wells/cards on the dark canvas | defined by hairlines |
| `--gold-deep` | `#6D5C2E` | small accent text on ivory (OPAR skin) | ≈ 5.5:1 |

**State.** Two hand-authored, noindex preview pages implement this proposal for comparison — `/brand-preview/opar/` (approved Task 3 system: ivory canvas, forest bands) and `/brand-preview/moss/` (identical content on the proposed `#28332A` canvas with Evergreen wells). Cormorant Garamond + Manrope and all seven approved colours are kept in both; only the ground changes. No reference palette hexes, prices, ratings or claims were copied from the Moss sheet.

**Decision needed from owner:** pick the skin for the rollout (OPAR ivory / Moss dark), which approves or rejects the `#28332A` token and the supersession of Task 3's light-surface rule. Until then no production page changes ground.

---

## D-031 — Owner-supplied hero photograph + de-plated emblem (logo plate removed as a defect)
**2026-11-10 — OWNER INSTRUCTION, EXECUTED.**

**Instruction.** Put the original AURA hero photograph on the homepage, and remove the logo's solid background — "the color does not match, which is a very big mistake from design rules perspective."

**Finding (verified).** `opar-seed-orbit.jpg` is a 750×750 two-tone file: the cream Seed + Orbit mark (`#F5F0D0`) on a flat `#003926` square. `#003926` is not one of the seven approved colours, so the plate read as a coloured sticker on both the `#28332A` ground and the `#EFF1E7` paper. The owner's classification — defect, not variation — is correct.

**Executed — emblem.**
- The plate is removed by **alpha un-matte**, not colour keying: each pixel is projected onto the plate→mark axis to recover its true coverage, then re-inked. Colour keying would have left a dark halo on every edge. Reproducible via `scripts/derive-brand-marks.ps1` (System.Drawing only, no dependency). Mark geometry untouched; only ink colour changes, which is the standard treatment for a one-colour mark.
- **Two ground variants**, because one cream raster cannot work on both grounds: `opar-seed-orbit-on-dark.png` (cool ivory `#EFF1E7`, for the dark canvas) and `opar-seed-orbit-on-light.png` (paper ink `#1A231C`, for `theme-paper` pages). Selected per theme inside `documentPage()`. The footer always takes the ivory variant because `.site-footer` is `--forest-green` `#101B12` on every page, paper pages included.
- `data/brand.json` now carries `assetPathOnDark` / `assetPathOnLight` / `tilePath`; the ambiguous `currentAssetPath` is gone. `approvedAssetPath` (the vector) stays reserved.
- Lockup sizing corrected: a 42 px emblem box suited a plate, but a plate-free mark at 42 px overpowers the 34 px serif wordmark. Now 32 px in the header, 28 px in the footer, `object-fit: contain`, no `border-radius`, and the footer's leftover plate border removed.
- The tab icon is the one place a container colour is *correct*, so the favicon is a tile (`opar-mark-tile-128.png`, ivory mark on `#28332A`). No favicon existed before, so every page view was requesting `/favicon.ico` and getting a 404.
- The React chrome (Navbar, Footer) now carries the emblem too: the static pages showed emblem + wordmark while the shell showed only the wordmark.

**Executed — hero photograph.**
- `Hero Image OPAR.jpg` (2000×1333) renamed to `hero-opar.jpg` for URL safety and set as the hero image: `object-cover` at `50% 45%`, explicit `width`/`height` (no CLS), `fetchPriority="high"`, `decoding="async"`, and a document-level `<link rel="preload" as="image">` because it is the LCP element. Decorative (`aria-hidden` slot, empty `alt`); the headline carries the meaning.
- Treated as part of the palette rather than dropped in raw: a 15 % `multiply` grade toward forest, the existing grain, plus two canvas-coloured scrims.

**Design-principle corrections found while doing it (measured, not eyeballed).**
1. *The transparent navbar sits on sky at scroll 0.* Ivory menu text on the photograph's blue sky measured **2.2:1**. A dedicated top scrim brought worst-case nav contrast to **8.7–9.2:1** at 375 / 768 / 1440.
2. *Brass is a mid-tone and cannot carry small text over a photograph.* The 10 px brass eyebrow measured **1.69:1** on the bright valley. Brass now keeps the hairline rule and the primary CTA (which sits on the darkened base, 4.9–5.3:1); the overline label is set in paper. Body copy moved from `paper/70` to `paper/80`.
3. *The type block is taller than the photograph can afford.* At 1440 the eyebrow sits ~78 % up the hero, so the base scrim was retuned to hold ≥0.5 alpha at that height while clearing to near-transparent at the top. The photograph keeps real presence — sky, peaks, valley and forest all read — and every text role passes: eyebrow 5.3–5.7:1, headline 4.3–5.2:1, body 5.7–6.4:1, brass CTA 4.9–5.3:1.

**QA.** 45/45 template tests; clean 40-page build; 0 horizontal overflow at 375/768/1440 on home, shop and a paper page; emblem loads and is theme-correct on dark pages (header + footer) and paper pages (dark-ink header, ivory footer); both brand-preview pages repointed at the correct variant; no page references the plated JPG any more.

**Deliberately not done.** No vectorisation of the mark (the owner supplies the final SVG); no price, rating, stock or health-claim changes; the source JPG stays on disk as the derivation input; nothing pushed.

---

## D-032 — The reference palette, applied exactly (supersedes the D-030 approximations)
**2026-11-10 — OWNER INSTRUCTION, EXECUTED.** Owner: "why did you not apply it exactly. dont use other things, apply its color palette." Also commissioned in the same session: a final brand guideline, a featured-piece section with a shop button, and an honest answer on product imagery.

**Finding (verified).** D-030 approximated the Moss reference. The reference sheet (`Branding/bf7dca245779961.69b4ce1c2b3d0.webp`) prints four hex labels, but all four read `#F3F2EE` — a copy-paste placeholder, not the swatch values. Sampling the swatches and the sheet's own background by pixel gives five colours and nothing else:

| Sheet role | Hex | Measured contrast |
|---|---|---|
| (background) ground | `#2F332B` | — |
| Main Text | `#F4F2EE` | 11.53:1 on ground |
| Header | `#D0D3C4` | 8.47:1 on ground |
| Button | `#9AA66C` | 4.94:1 vs ground, and 4.94:1 as the ink inside it |
| Accent | `#55632A` | 1.97:1 on ground — fill only; 5.86:1 on paper |

**Executed — tokens.** `public/assets/product-pages.css` `:root` rewritten around the five primitives. Every other surface is a stated mix of ground and Main Text: raised `#3D4039` (+7 %), well `#292D26` (−12 % value), ground hairline `#4F524A` (+16 %), paper-raised `#E2E1DC`, paper-well `#D8D7D3`, paper-line `#CDCCC7`, paper-body `#43463F`, accent-soft `#DDE1CE`. Mapped through semantic roles (`canvas/surface/well/ink/body/line/cta/cta-ink/accent/accent-text` + paper and footer families). `index.css` rewritten with the same values; `tailwind.config.js` rewritten to `canvas/surface/well/ink/paper/paper-raised/body/line/cta/accent` (`forest/brass/moss/sage` deleted). `data/brand.json` + `brand.config.ts` carry `ground/mainText/header/button/accent`; `theme-color` is `#2F332B` in `index.html` and the generator. Legacy hexes swept out of every rendered component; only documented palette hexes remain. Shadows are now cast from the ground (`rgba(47,51,43,…)`), not a neutral grey.

**Executed — roles.** Nav and body copy take the Header colour; wordmark, headlines and primary ink take Main Text; the primary CTA is the reference's **pill** filled with `#9AA66C` and inked with the ground (`--radius-pill` is now the button radius, squares elsewhere); the partner CTA is a mist outline so a referral never looks like a house purchase; partner badges are the only accent-filled badge (Main Text on accent, 5.86:1); the footer is the ground's well; the header is transparent site-wide so photography runs beneath it, with an opaque `.nav-panel` so menus never show text through. Status chips were reduced to palette mixes and de-duplicated (they are reserved; no live page renders one).

**Executed — emblem.** `derive-brand-marks.ps1` re-run with Main Text `#F4F2EE` on the ground and the ground `#2F332B` as ink on paper; tile ground `#2F332B`. Geometry untouched.

**Executed — featured pieces.** `PilotProducts` replaced by `components/FeaturedProducts.tsx`: the reference card pattern (light paper 4:5 tile, category eyebrow, serif name, "Price on request", `#9AA66C` "View piece" pill) plus a "View all pieces" pill to `/shop/`. It is not called "Best Sellers" — nothing has been sold yet.

**Executed — imagery decision.** `aliexpress-aloe-soap.jpg` is a marketing composite with an "Anti-Acne · Oil Control · Brighten" overlay and the same line printed on the label. "Anti-acne" is a **medicinal** claim, so the pixels are not published: the aloe listing now shows `photography-pending.svg` and keeps the supplier URL as provenance. `aliexpress-turmeric-soap.jpg` is a genuine photograph of the wrapped bar; only its printed pack label carries text, so it stays, with the caption naming that label as the supplier's wording and not an OPAR claim. Cut-out, colour-keying and AI "product" shots are ruled out in the image guide — and tinting a product to match the palette is not allowed.

**Delivered — written system.** `docs/BRAND-GUIDELINES.md` (palette, measured contrast, roles, type, components, do/don't, where values live) and `docs/PRODUCT-IMAGE-GUIDE.md` (4:5 contain layout, what can and cannot be done to a supplier file, how today's four files measure up, instructions for the next shoot). The stale `/brand-preview/{opar,moss}` comparison pair and `brand-preview.css` are deleted, replaced by one rendered reference at `/brand-preview/` that loads the production token layer (`noindex, nofollow`).

**QA.** 45/45 template tests; clean 40-page build; 0 horizontal page overflow at 375/768/1440 on home, `/shop/`, `/policies/privacy/` and `/brand-preview/`. Computed values verified in-browser: body `rgb(47,51,43)` / `rgb(244,242,238)`, CTA `rgb(154,166,108)` on ground ink with 999px radius, footer `rgb(41,45,38)`, partner badge `rgb(85,99,42)`, paper tiles `rgb(244,242,238)` at 4:5, paper-mode pill carrying the accent edge. Screenshots remain unavailable this session (the desktop window is not visible), so the check is computed-style and geometry based.

**Deliberately not done.** No price, rating, stock or health-claim change; no photography invented for the two empty slots; no push, no deploy; the legacy unrendered `ProductGrid.tsx` / `ProductDetail.tsx` still hold inventing copy and remain untouched.
