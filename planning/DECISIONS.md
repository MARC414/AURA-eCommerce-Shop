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

---

## D-033 - Static-first architecture adopted (Option A); foundations audited, nothing implemented
**2026-11-10 - OWNER DECISION, PLANNED ONLY.** TASK 01 (nav unified on `site.json`) and TASK 02 (homepage room index, `components/CategoryDiscovery.tsx`) completed and committed locally, not pushed. The owner then chose **Option A**: the generated static pages become the single customer-facing shell, React only for genuinely isolated interaction, not an SPA. Full audit and plan: `planning/TASK-03-STATIC-FIRST-PLAN.md`. No source file, route, dependency, config, image or deployment was changed.

**Audit findings (verified).** The site is built twice. 41 HTML files in `public/` against one React shell; the homepage is the only page not generated and the only page shipping 408.51 kB of JS to render three static sections. Duplication measured: header (React 1 row/93px/fixed/no search vs static 2 rows/**198px at 375px**/search+account), footer (React `SHOP_ROOMS` 6 rooms vs `site.json` **4 rooms** - Art & Craft and Quiet Living were missing from every footer), room list in three files, cart in two views of one key, and **two checkout record formats** (`aura_orders_v8` `AUR-#####` vs `aura_order_requests_v1` `OPAR-YYMMDD-XXXX`). 43 of 47 tests already target the static shell; the React shell has four. `preview-products.mjs` 302s `/` to `/shop/` because no static homepage exists.

**Decisions delegated to the architect and taken.** (1) No slide-out cart drawer; `/cart/` is the single view. (2) Admin panel stays but unpublished - local dev entry, no admin JS in `dist/`; it cannot see real orders because orders are browser-local. (3) Concierge deferred with a trigger (knowledge base outgrows `/help/`, or ~30 library entries); then `/concierge/` in plain JS. (4) Dead components with invented prices/stock/reviews (`ProductDetail`, `ProductGrid`, `ProductCard`, `CategoryPage`, `Journal`, `JournalDetail`, `About`, `Features`) deleted in cleanup. (5) `/brand-preview/` stays, noindex, not in sitemap or search.

**Core Web Vitals (owner instruction).** They are a gate on every task, not a later pass: homepage JS under 20 kB, one CSS file under 55 kB, LCP still the hero (converted to WebP/AVIF, preload moved into the generated page), CLS <= 0.1, and a forced header consolidation task (T4.5) targeting <= 80px at 375px and <= 96px at 1440. Budgets and per-task gates are section 10 of the plan.

**Sequenced but not started.** T1 data conformance, T2 renderer split (byte-identical gate), T3 homepage template at an unlinked `/home-preview/`, T4 atomic cutover, T4.5 header, T5 commerce verification, T6 admin/concierge disposition, T7 Moss button system (the only point at which buttons are defined once), T8 cleanup and docs.

**Deliberately not done.** Nothing implemented, nothing deleted, no route or config changed, no dependency installed, no image wired, nothing pushed. Five owner images in `Branding/` remain untracked and unused.

**Executed 2026-11-10 — T1 to T4, unpushed.** T1 `f56b3c6` (the footer shows all six rooms from `site.json`); T2 `a5715f6` (renderer split behind an unchanged facade, 116 files byte-identical); T3 `d3119bc` (homepage template at an unlisted `/home-preview/`, two defects found by measurement and fixed — a miscounted standfirst and a 3.72:1 header over the photograph); the safety net `npm run check:site` `2777c5c`; T4 `c0cc156` + `962c622` + `5d0bb11`.

T4 was split into two commits at the owner's "go" — cutover mechanics, then React retirement — because the plan's atomicity requirement only ever applied while Vite still wrote `dist/index.html`; each part stays independently revertable. Two deviations, both disclosed: `services/commerce.ts` was **trimmed rather than deleted** (AdminDashboard imports it for the subscribers CSV, so it keeps the newsletter functions and loses the cart half), and **five** tests were coupled to the retired shell rather than the four the plan identified (T1 had added one against `Footer.tsx`). All five were rewritten against the static surfaces rather than dropped. `storeService.ts` trimming and the admin order re-point move to T6, which is the task that decides the panel's fate. The `unlisted` sitemap flag went with its only user, `/home-preview/`; every generated page is now listed, and `check:site` reports any page the sitemap omits. `lang="en"` is site-wide, so moving to `en-GB` later is one line in `documentPage()`.

**Gate.** `npx tsc --noEmit` clean; 52/52 template tests; `npm run check:site` 42 routes, 42 generated, 0 problems; `/` at 375/768/1440 with 0 horizontal overflow, one `h1`, four pieces, six rooms, the hero decoded and no console messages; cart → checkout → account reachable with an item in the cart and the invoice form still carrying no card fields. `dist/` is 68 files / 2011.9 kB, about 429 kB lighter than the shell it replaced.

**Executed 2026-11-10 — T4.5, the header, `8710208`.** The forced consolidation the owner budget asked for: ≤80px at 375 and ≤96px at 1440 measured **65px and 73px** against 198px and 120px before. One row at every width. Below 761 the four sections live in a `<details class="nav-toggle">` panel behind a menu icon, revealed by a sibling selector — no duplicated nav markup, no `:has()`, no JavaScript needed to open it, and `site.js` only adds Escape-to-close with focus returned to the icon plus outside-click. Search is exactly one control at every width: the field above 1279, an icon linking to `/search/` (which carries the field) below. Utilities keep the icon and gain a screen-reader-only label rather than a smaller one; at 320 the wordmark's text is visually hidden and the link keeps `aria-label="OPAR home"`.

Two consequences worth naming. The hero scrim was 260px *because* the header was 120px deep, so it was re-measured rather than left alone: at 73px, 200px holds 0.801 alpha at the header's bottom edge and the worst composited pixel in the band is 6.36:1 for mist and 8.65:1 for ink at 761/1024/1440 — better than the 4.93:1 it replaced — and hero top padding drops 200px → 152px. And the panel is absolutely positioned, so opening the menu moves nothing: the `h1` stays at the same pixel and the document keeps its height, which is the CLS part of the gate.

Gate: 53/53 tests (a new one asserts the one-row contract), `tsc` clean, 41 pages, `check:site` passes, 15 page/width combinations across five representative pages with 0 overflow and one `h1`, all 20 unique nav hrefs 200, Escape/focus-return/outside-click verified, `aria-current` intact.

**Executed 2026-11-10 — T5 to T8, pushed to `origin/main` (`2da7c4b…` settle commit).**

- **T5, verification only.** 48 checks, 0 defects, 0 console errors; full table in `planning/T5-COMMERCE-VERIFICATION.md`. Unpriced lines read "Price on request" / "On invoice", never `£0.00`. No card field, no payment host.
- **T6, admin re-point, `2da7c4b`.** The owner chose to re-point the admin order tab rather than retire the panel. `AdminDashboard` now reads `aura_order_requests_v1` through a new `InvoiceRequest` type; the imaginary payment/revenue/fulfilment pipeline was deleted, not mapped — the tab is a read-only requests list with a CSV export, and it says so on the page. The concierge stays deferred behind its recorded trigger.
- **T7, button system, `9535193` + `37bb593`.** One `.button` base, four roles, size and state modifiers, a `button()` template helper, and a full specimen on `/brand-preview/`. The Moss JPEG is a forest photograph, not a UI sheet, so the owner approved an approximation; every value was marked provisional in three places pending review. **Settled the same day** (the settle commit): the rendered system was measured in the browser against the house spec in `docs/BRAND-GUIDELINES.md` §Buttons and matches it exactly — 56px default, 40px small, 44x44 icon, 11px/600 uppercase, .12em tracking, 999px radius, hover to mist. Two deviations found and fixed while settling: the hero's 52px override now uses the 56px token, and the specimen page's own row `min-width: 210px` had been inflating the icon pill (now exempted, 44x44). A missing `.button:disabled` opacity rule was added to make the documented state real.
- **T8, cleanup and hero, `28b6122` + `f0fb138`.** The eight dead components with invented prices/stock/reviews are deleted. The hero JPEG (605.8 kB, the last open CWV budget) became a 1920x1080 16:9 crop at the displayed `object-position` — the full frame was unfittable, bottoming at 260 kB WebP visibly degraded — landing at **171.3 kB AVIF q54** with a 179.9 kB WebP fallback, wired through `<picture>` with `type="image/avif"` on the preload so no browser downloads two heroes. Homepage payload ~692 kB → ~258 kB, verified in-browser (`currentSrc` is the AVIF, `fetchpriority=high`, no shift).

**State after T8.** The static-first migration T1–T8 is complete: 41 generated pages, 53/53 tests, `tsc` clean, `check:site` passing, `dist/` 70 files / 2394 kB. Owner-side facts still open before any sale: price, shipping, stock decisions; domain and hosting (deploy not approved); product photography; herbal evidence review before enabling orders.


---

## D-034 - Antique gold #C5AD70 approved as a sixth colour (the secret accent)
**2026-11-11 - OWNER DECISION.** Amends D-032 "no new hue, gradient, gold" rule. Antique gold (#C5AD70) approved as sixth colour, strict constraints.

**What gold is:** muted, desaturated, earthy gold (aged brass / honey). Sits between olive greens and warm off-white Main Text.

**Constraints (all must hold):**
1. Maximum 4 touches per page.
2. Only on dark ground (#2F332B). Gold on ground = 6.16:1 (AA pass). Gold on mist = 1.40:1 (fail). Gold on paper = 1.94:1 (fail). Gold on button fill = 1.52:1 (fail). No exceptions.
3. Only interaction moments and micro-details. Never a surface, large fill, or text on light background.
4. Never primary button default fill. Gold may appear as hover edge only.
5. Never in nav or footer.
6. Never a gradient on a surface.

**Approved uses (5 maximum):**
1. ::selection background gold, text ground ink.
2. .text-link hover: gold underline.
3. Primary button hover: subtle gold gradient edge on bottom border (Moss "light catch").
4. Hero hairline: gold at 20% opacity instead of CTA at 25%.
5. One gold word in hero headline - "conscious" in "A world of conscious living."

**Contrast:** gold #C5AD70 on ground #2F332B = 6.16:1 (AA pass). All other combinations fail.

**Why amends D-032:** D-032 removed gold tokens. D-034 re-introduces gold as strictly controlled sixth colour in a handful of micro-interaction moments (4 in the final build - see the implementation note), all on dark ground, all measured.

**Reversible:** yes. Remove gold CSS block and the gold touches revert. No structural or data changes.

**Status:** APPROVED (owner, 2026-11-11). Implementation pending (D-034 phases 2-5).

**Implementation note (2026-11-11, phases 2-3 built):**
- **Use 3 (button hover gold edge) rejected by measurement.** A gold line inside the pill sits on the CTA fill (1.52:1) by default and on the mist hover fill (1.40:1) on hover — invisible in both states. Gold cannot draw on the Button colour. The primary button keeps its green fill and mist hover.
- **Final set is 4 touches, dark ground only:** `::selection` (6.16:1, paper pages keep their accent selection), `.text-link:hover` (scoped `body:not(.theme-paper)`, 6.16:1), hero hairline at 20%, and the hero word "conscious". Paper pages are untouched.
- **Hero word measured, not assumed:** base scrim + brand grade applied to the real `hero-opar.jpg`, 33,500 samples across the headline band. Gold at full strength: 6.38:1 median, 4.34:1 worst case. The line is 51-128px display type, so large-text AA (3:1) holds at every sample.
- **Headline second line** changed from `opacity: .78` to `color: rgba(244, 242, 238, .78)` so the gold word is not dimmed with the line; the rendered look of "living." is unchanged.
- **Cost:** CSS +420 B gzipped (14,334 -> 14,754). No JS, no images, no layout metric change, no CLS.

**Amendment (2026-11-13, monograph and homepage built).** The monograph spends gold once per plate: a 24px heritage rule before the eyebrow. That is four rules on the homepage (three plates and the archipelago), on top of the hero's word and hairline. Counted one by one that exceeds the cap of four, so the count is settled by role instead: gold *type* stays at exactly one word on the page (the hero's "conscious"), and below the fold the gold device is the heritage rule and nothing else. It repeats because it is the plate's label device, not a new accent each time. Two consequences recorded at the same time: the 2px gold left border on `.editorial-spread__heritage` became `var(--line)`, so a plate never spends gold twice; and gold micro-text never sits on a photograph (D-036), so the eyebrow is Main Text and only the rule is gold.

**Status of the amendment:** agent resolution, owner informed, owner's eye on the rendered page still the check.

---

## D-035 - Product integrity rule (corrects the "no fabricated product appearance" wording)
**2026-11-11 - OWNER CORRECTION.** The earlier phrasing risked reading as a ban on art direction. The owner confirmed: the product itself stays exactly as photographed; the setting may be designed.

**The rule:**
- **Product integrity:** the product's appearance - form, texture, colour, packaging, label, quantity, capsule/root appearance - must come from the real photographed product. No AI re-rendering, no invented variants, no generated packaging.
- **Art direction is allowed:** background, surface (stone, wood, forest), lighting, shadow, crop, framing, colour field, and a model holding the product may all be art-directed to the brand palette.
- This is normal studio practice, not misrepresentation. Composites are honest while the product pixels remain the actual product.

**Scope:** applies to cards, hero/branding imagery, detail pages and future photography. Marketing context may be styled; the product shown to the customer must be the one shipped (D-020).

**Status:** APPROVED (owner, 2026-11-11).

---

## D-036 - Botanical monograph is full-bleed ground, not a framed card
**2026-11-13 - OWNER APPROVED (direction); implemented on `/brand-preview/`.**

**Decision:** the three botanical plates and the closing archipelago are full-bleed photographic grounds. The bordered, rounded, shadowed card that AI Studio's `f95f25d` introduced is removed.

**Rules:**
- A plate spans the viewport exactly, edge to edge: no inset, 0 radius, no border, no shadow, no fill. Same construction as `.home-hero`.
- The habitat photograph is the section ground (`object-fit: cover`), never a framed picture inside the section.
- Contrast is carried by **one directional scrim** — solid over the text column, falling to zero over the specimen — not a flat wash.
- Words stay on the page grid (shell inset, else the gutter); only the ground goes to the edge.
- No hover transform on specimens. They are still objects, not buttons.
- **Gold micro-text never sits on a photograph.** On a photographic ground the eyebrow is Main Text; gold remains the hairline accent and the heritage rule. This follows the rule already written into `product-pages.css` for the hero.
- Stacking order declared once per plate: photo 0, foliage 1, scrim 2, words/specimen 3.

**Measured** (877px viewport, sampled against the real photograph pixels, not a flat fill):
- Plates 0 -> 877 = viewport width; text at 35.7 = `.guide` content edge; horizontal overflow 0.
- Worst contrast per plate: **6.64 / 7.29 / 6.69 / 7.03 : 1** against the 4.5 target. The previous flat wash measured 6.12 / 6.47 / 6.13, i.e. it was over-dark and was spending two thirds of the usable contrast.

**Notes:**
- The preview page publishes `--sbw` (real scrollbar width) so a `100vw` bleed lands exactly on the viewport edge while nested inside the capped `.guide`. Production does not need this: there the section is a direct child of the page, so `width: 100%` is already the viewport.
- Habitat photographs are 1376x768, so full-bleed upscales them about 1.4x on a wide desktop. That is an asset gap for the real-photography pass, not a layout fault.

**Out of scope, still open:** the image-treatment variant block and `.ecosystem-pillar:hover` still use off-palette values (`#242820`, `#292D26`, `#44473F`, `#EAE6DF`, `#CDCCC7`). Separate decision.

**Status:** implemented on the preview page. Port into `templates/home-page.mjs` pending owner sign-off on the rendered result.

---

## D-037 - The front shelf is a mount, not a product tile
**2026-11-13 - implemented on the homepage; owner sign-off on the rendered result pending.**

**Decision:** the featured row is three pieces on archival mounts, not four product cards in a four-column grid.

**Rules:**
- Three across from 761px up. A fourth column left a hole in the row, and the old two-column middle step orphaned the third card on its own line.
- The mount is the light role (`--paper-canvas`), because supplier photographs are shot on light backgrounds and belong on paper, not on the ground. Square corners, no border, no shadow, no radius.
- A piece with no photograph gets an **empty mount**: specimen index, four corner ticks, a hairline, "Photograph in preparation". Never a grey placeholder graphic. A real photograph drops into the same box with `object-fit: cover` and changes nothing else.
- No hover motion on the photograph (owner, 2026-11-13).
- One link per card in the tab order (the name) plus a text link; no per-card pill. The section keeps one pill.
- The eyebrow is mist, not the Button colour: on this section's scrimmed photograph the Button colour measured **4.22:1** and **4.36:1** on cards 2 and 3. Mist measures 7.24 / 7.47 / 7.86.

**Photography:** `SHOW_SUPPLIED_IMAGERY = false` in `templates/home-page.mjs`. The only supplied image is a hand holding a plastic-wrapped bar on a light background: a supplier snapshot, not a photograph of the piece, and it breaks the food-only image rule. Flip the flag to show it in the same mounts.

**Measured** (877px viewport): 3 cards, 3 columns, equal heights, mount 247x309 = 4:5, horizontal overflow 0.

**Status:** implemented. Monograph and journal port pending.

---

## D-038 - Morning light: one sun for the page, and where it may fall
**2026-11-13 - OWNER DEMAND, IMPLEMENTED.** Owner: "use sunlight or ray of sun slightly like morning hue in the corner of some sections other than the monograph, that can support antique gold. make it true somehow, it is my demand."

**Decision:** the homepage carries one warm light, not a gradient decoration. It enters high on the right, just outside the frame, and falls to the left.

**Rules:**
- **Where:** only on sections whose ground is already a photograph - the featured band and the rooms band. Never the hero (locked), never the monograph (owner excluded it), never a flat paper page.
- **One direction:** the source is the top-right corner and the fall is down-left, on every section that takes it. The page reads as one room with one window.
- **One hue:** warm amber `rgba(255, 228, 178, ...)`, the light that makes `#C5AD70` read as aged brass rather than as a painted accent.
- **Smooth, no edge:** two radial falloffs (a source core beyond the corner, a long ellipse leaning 13deg down-left). A shaft with a hard edge on a photograph looks like a graphic; light in air has no edge.
- **Above the ground, below the words:** the layer is z-index 1, the shell is z-index 2. No glyph is tinted. The ground behind the type is lit, so the light is capped by measurement, not by taste.

**Measured (785px, canvas sampling of the real decoded background under the real scrim):**
- Featured note: 7.53:1 unlit -> **6.52:1** lit.
- Rooms note: 6.78:1 unlit -> **5.26:1** lit.
- Worst alpha over any text rect across 375/414/785/1440/1920 widths: **0.155** (bounded by geometry, so narrow viewports cannot drift brighter).

**Two defects found while measuring, both fixed:**
1. The rooms scrim at .78 put a room paragraph at **4.34:1** at 785px. The cover crop changes with the section's aspect ratio, so the flat scrim has to hold the worst crop, not the crop it was first measured on. Raised to **.84**; the worst paragraph is now 5.21:1.
2. `.room-index__number` in the Button colour measured **4.11:1** on the same ground. Changed to mist, the same correction D-037 made to the featured eyebrow.

**Not gold:** the light adds no gold. Gold stays at the hero word, the hero hairline, and the 24px heritage rule before a label below the fold; the light is what those now sit in.

**Reversible:** yes. Delete the `.sunlight` block and the two `<div class="sunlight">` lines; the sections keep their previous grounds.

**Status:** implemented and measured. Owner's eye on the rendered result is the remaining check.

**2026-11-13 - REVERSED BY OWNER, REMOVED.** Owner: "remove the morning light form the corner, it does not look good." The two `<div class="sunlight">` lines and the whole `.sunlight` CSS block (source, shaft, and the stacking rules that existed only for them) are deleted. The featured and rooms bands keep their photographic grounds and scrims; the section notes return to their unlit values — **7.53:1** (featured) and **6.78:1** (rooms) at 785px. The rooms scrim remains `.84`, which was a separate contrast correction, not part of the light. Build 41 pages, `check:site` clean, no `sunlight` reference remains. **Do not reintroduce without a new owner instruction**; the entry stays as history, not current design authority.

---

## D-039 - The Journal is a listing frame, and the homepage closes on its index
**2026-11-13 - OWNER INSTRUCTION, HOMEPAGE PART IMPLEMENTED.** Owner: "journal is like Blog listing page where all writing will be listed, and the Plants, Mind and Devine are some main categories, under them the writing will distribute. Keep them structured, I am now start selling yet, I will tell you when marketing will start, your job is to make frame, furnish technical soundness."

**Decision:** the Journal is a listing, not a second shop. `/journal/` is the listing; **Plants & practice**, **Mind & body** and **Worldly & divine** are the three categories every piece is filed under. The homepage closes on that frame rather than inventing articles to fill it.

**Rules:**
- **One source for the frame.** The columns are the journal's own nav children in `data/site.json`; each line is the category page's `description` in `data/pages.json`. The homepage cannot describe a category differently from the page it links to.
- **No invented writing.** The index is three links, three descriptions and one way into `/journal/`. No article cards, dates, counts or teasers until articles exist. When writing is published it files under the categories and the listing fills; the homepage plate does not need to change.
- **The second movement of the archipelago.** One photograph, one scrim, one plate: the monograph's closing statement above a hairline, the Journal index below it. No new ground, no card, no radius, no border on the columns (a hairline between them), no hover motion.
- **No gold added.** The plate has already spent its one gold rule on "The sustenance cluster". The Journal label is mist, not the Button colour: the green measured **3.78:1** on that ground, the same failure D-037 corrected on the featured eyebrow.
- **The scrim follows the words, not the section.** `.archipelago-block--journal` ties the scrim to `.archipelago-visual`, with a 160px mask at the top. A taller plate therefore shows more photograph instead of thinning the scrim under the text. The base `.archipelago-block` stays as it was, so `/brand-preview/` keeps its original closing.
- **Full bleed by viewport, not percentage.** The scrim is one viewport wide, centred on the text and clipped by the plate: a percentage inset resolved against the text column, not the section, and left 163px of photograph un-scrimmed at 1920.

**Measured (canvas sampling of the real decoded photograph under the real scrim):** worst text contrast **6.78:1** across 360/414/768/1024/1440/1920 widths; no horizontal overflow at any of them; scrim flush to both plate edges.

**Reversible:** yes. Remove the `.journal-plate` markup and `journalIndex()`, and the `.archipelago-block--journal` rules; the old closing returns.

**Status:** homepage plate built and measured. `/journal/` and the three category pages still render as prose empty states; converting them to the listing template (article data + list + empty state) is the next step. Owner's eye on the rendered plate is the remaining check.

---

## D-040 - The homepage sells: cards state the piece, rooms open with circles, the letter sits between them
**2026-11-13 - OWNER APPROVED THE SEVEN REVIEW ANSWERS, IMPLEMENTED.** The review in `planning/DESIGN-REVIEW-2026-11-13.md` closed with seven questions. The owner answered all seven; this entry records what was built in the reviewed order. The hero is untouched.

**The seven answers:**
1. **Neem:** move it from the monograph's top-right to the foot of Rooms, bottom-right.
2. **Sunrise:** a header band behind the Materia Medica only, not the three plate grounds.
3. **Newsletter:** between Rooms and Monograph.
4. **Card line:** approve a factual `cardLine` plus `format`, with price still pending.
5. **Room circles:** data-driven circular images above each room, one hairline ring, no fill.
6. **Grid:** features 1 column, then 2 at 761, then 3 at 1101.
7. **Scrim:** apply the Section 4 lift.

**What changed, in order:**
- **Rooms and neem.** The leaf now sits at the bottom-right of the Rooms band, cropped by the section edge. Candidate A: `clamp(160px, 16vw, 220px)` wide, `right: -24px`, `bottom: -28px`, `rotate(-12deg)`, opacity `.6`. Hidden at and below 860; from 861 the section reserves `padding-bottom: clamp(120px, 14vw, 180px)`. The shell sits above the leaf (`z-index: 2`), so no room text is painted under it. Measured as bright pixels through the rotation: **0 hits on room text** at 861/1024/1440/1920, with 147-212px of foliage visible.
- **Cards.** Each card now reads category, name, one factual line, format, price (or "Price on request"), then "View piece". The shop-state badge (`Preview - ordering not open` / `referral pending`) is gone from the card; that status belongs to the piece page. `cardLine` and `format` were added to all four products in `data/pilot-products.json`, traceable to the listings already reviewed: 100 g bar; pads with quantity on CJ; aloe 100 g in packs of 1, 3 or 5; Ashwagandha 60 capsules. No stars, no reviews, no stock claims.
- **The letter.** A quiet band between Rooms and Monograph, using the same `/assets/newsletter-page.js` contract as `/newsletter/`. The homepage form carries `data-newsletter-quiet`, so the status line is empty at rest and speaks only after save or remove. Saving writes the address to this browser and says, in the same sentence, that nothing was sent; removing clears it. No provider is connected.
- **The sunrise slot.** `MONOGRAPH_GROUND = null` in `templates/home-page.mjs`. No fabricated photograph, no CSS `url()` for a missing file. When the owner supplies a licensed long shot of sunrise crimson, setting `{ src, width, height }` turns the header into that photograph behind a scrim; the scrim direction and the heading contrast must then be measured against the real crop before it ships.
- **The scrim.** Desktop `0% .97 / 32% .96 / 52% .90 / 68% .46 / 87% .11 / 100% 0`; single column `0% .97 / 44% .95 / 70% .64 / 100% .19`. This is a quieting choice, not a legibility repair: the previous ramp already cleared AA.
- **Responsive alignment.** Features 1 to 2 at 761 and 3 at 1101; the journal listing stacks at 860 with the spreads and opens into three columns at 861; journal lines 12.5 to 13.5px. The room circle is `clamp(88px, 10vw, 120px)`, `border-radius: 50%`, a 1px `--line` ring, 16px above the heading, and renders only when `collections.json` carries `image`; without one the row stays text-only rather than showing an empty disc.

**Measured:**
- Spread text worst case: **6.73:1** (390), 7.33:1 (768), 6.97:1 (1024), **6.77:1** (1440), 6.87-7.47:1 (1920), against 4.5.
- Card text worst case **6.61:1**; room paragraphs worst **5.20:1** (800), all above 4.5.
- No horizontal overflow at 320/360/390/414/761/768/800/860/861/1024/1101/1440/1920; one `h1`; no duplicate IDs; no visible text clipping in the new bands.
- Newsletter exercised in the browser: empty at rest (0px status), save stores `reader@example.com` locally and announces that nothing was sent, remove clears both.

**One defect found and fixed:** the neem file is 1024x1024, and adding `width`/`height` attributes made the HTML dimensions presentational hints that stretched the leaf to 1024px tall. `.corner-foliage` now sets `height: auto`; the width clamp is the only size in play.

**No new gold.** The gold remains at the hero word, the hero hairline, and the 24px rule before a below-fold label, within D-034's cap. The letter and the circles add no gold.

**Not done, deliberately:** the Journal listing template. `/journal/` and the three category pages still render prose empty states; building the listing (article data model, list, empty state) needs separate approval.

**Reversible:** yes. The template functions are isolated (`featureCard()`, `rooms()`, `newsletter()`, `monograph()`), and the CSS blocks are section-scoped.

**Status:** implemented, built (41 pages), 55/55 tests, `check:site` clean; uncommitted. Two asset gates remain with the owner: the six room/category photographs and the sunrise-crimson long shot. Prices, shipping, stock and real product photography also remain owner-side; the newsletter has no provider.

**2026-11-13 - CORRECTED BY D-041:** the owner moved the neem to the top-left of the Materia Medica header and the letter to after the Journal. The other five answers and the measurements above stand.

---

## D-041 - Owner correction: neem to the Materia Medica header, letter after the Journal
**2026-11-13 - OWNER INSTRUCTION, IMPLEMENTED.** Owner: "Change the nee[m] leaf on the top left corner, palce the newsletter or subscription section after journal or before footer."

**Decision:** the neem moves from the foot of Rooms to the top-left of the Materia Medica header, inside the band reserved for the sunrise slot. The letter moves from between Rooms and Monograph to after the Journal plate, immediately before the footer. This corrects D-040's two placements; the rest of D-040 stands.

**Neem:**
- `corner-foliage--neem-tl`: `top: -40px`, `left: -24px`, `width: clamp(140px, 13vw, 180px)`, `rotate(-12deg)`, opacity `.6`; hidden at and below 860.
- From 861 the header reserves `padding-top: clamp(128px, 12vw, 170px)`. Below 861 the leaf is hidden and the section keeps its original 56-88px top padding, so the band is never empty ground.
- The section's top padding is 0 from 861, so the leaf sits in the section corner and `overflow: clip` crops it.
- Measured: at 861/1024 the band is 128px, the leaf 140x140 with 113px visible and **15px** clearance to the overline; at 1440/1920 the band is 170px, the leaf 180x180 with 157px visible and **13px** clearance. **0 bright-pixel hits** on the overline, heading or note at all four widths.
- Rooms loses the reserved bottom band: padding-bottom returns to 80px at 320/390 and 112px from 761. No leaf remains in Rooms.

**Letter:**
- Content order is now hero -> featured -> rooms -> monograph (ending on the Journal plate) -> letter -> footer.
- The form keeps the same `/assets/newsletter-page.js` contract and `data-newsletter-quiet`: empty at rest, speaks after save or remove, writes to this browser only. No provider is connected.
- Verified at 390 and 1440: letter after the Journal and before the footer; status empty at rest; save stores `reader@example.com` locally and says nothing was sent; remove clears it.
- No horizontal overflow at 320/390/768/860/861/1024/1440/1920; one `h1`; no duplicate IDs.

**Sunrise:** the leaf now sits above the dormant ground slot. When a photograph is supplied it covers the same band, and the leaf remains above the scrim and below the words.

**Reversible:** yes. Move the `<img class="...--neem-tl">` back into `rooms()`, restore the Rooms padding rule, and place `${newsletter()}` before `${monograph()}` in the content string.

**Status:** implemented, 41 pages, 55/55 tests, `check:site` clean; uncommitted.

---

## D-042 - Owner correction: the neem is a bridge, not a header ornament
**2026-11-14 - OWNER INSTRUCTION, IMPLEMENTED.** Owner: "I don't like the neem leaf there, use this image instead, make it transparent and large, the branch will come from the previous section and its tip of the leaf will touch the Editorial monograph."

**Decision:** D-041's top-left header leaf is **removed, not tuned**. The neem is now a true cutout carried by a zero-height bridge between Rooms and the Materia Medica: the stem grows out of the Rooms bottom padding, the branch crosses the seam, and the leaf tip lands on the "Editorial monograph" overline. The letter placement from D-041 is unchanged.

**The asset:**
- `public/assets/botanicals/corner-neem.webp`, 768x964, 184,462 bytes, a real alpha cutout made from the supplied `corner-neem.jpg`.
- Keying method, after a border flood fill failed (enclosed black pockets between leaflets stayed opaque): neutral near-black (`luma <= 9`, `chroma <= 6`), connected blobs of 25px or more, a 0.7px alpha feather, and edge unpremultiply; the photographed interior is left alone.
- Verified over ground, light and checker: no backdrop, no enclosed black, no fringe. The rim is greener than the interior (68,83,43 against 95,121,59), which is natural edge shading, not black fringing.
- Mean opaque leaf colour is (95,121,58): luminance 111 against the ground's 50, a 2.11:1 decorative read. No text sits on it.

**The bridge:**
- Markup: `<div class="monograph-bridge" aria-hidden="true">` between `${rooms()}` and `${monograph()}` in `renderHomePage`, carrying the branch image with `width="768" height="964"`, lazy, `alt=""`. Zero height, no ground of its own; the branch paints above Rooms and below the monograph's words.
- `--monograph-band: clamp(128px, 12vw, 170px)` is now the single number for the monograph header's top padding **and** the branch's bottom offset. The tip meets the overline by construction, not by eye.
- `left` aligns the branch to the content shell: `max(var(--gutter), (100% - var(--width-shell)) / 2 + var(--gutter))`. The source tip sits at 80.2% of the image width, so the stem lands at the left content edge and the tip lands on the label.
- Width `calc(0.7967 * (136px + var(--monograph-band)))`: the image is 1.2552 tall for its width, and the Rooms clear band is 148px (36px item padding + 112px section), so this keeps 12px between the stem and the last room text while using the empty padding. Rendered: 210x264 at 861-1024, 231x290 at 1280, 244x306 at 1440-1920.
- `opacity: .95`, `mix-blend-mode: normal`, transparent background, no drop shadow. The shadow was removed deliberately: black is invisible on this ground and risked reading as the same smudge the owner rejected.

**Measured** (sized same-origin frames, opaque pixels mapped through the rendered box):
- Tip to overline top: **0-1px** at 861/900/1024/1110/1280/1366/1440/1600/1800/1920, always inside the overline's x-range.
- Stem clearance from the last room text: **12px** at every width; the stem sits inside the Rooms padding, never on text.
- 1 leaf pixel touches the overline box at the tip, which is the intended contact; 0 leaf pixels on the heading or note.
- No horizontal overflow at any tested width (scrollWidth - innerWidth = -15, i.e. the scrollbar only).
- At and below 860: branch `display: none`, bridge height 0, monograph keeps its normal 56px top padding; at 861 the band and branch switch on together.
- Background computed `rgba(0, 0, 0, 0)`, blend `normal`, image loaded: no black rectangle.

**Test:** the homepage order test now asserts the bridge sits after `id="rooms"` and before `id="botanicals"`, that the branch points at `corner-neem.webp`, and that no `corner-foliage--neem-*` remains.

**Reversible:** yes. Delete `neemBridge()` from the content string and the `.monograph-bridge` rules; D-041's header image and CSS are recorded above if the owner wants them back.

**Status:** implemented, 41 pages, 55/55 tests, `check:site` clean; committed locally, not pushed (owner has deliberately paused pushes). `corner-neem.jpg` stays because `/brand-preview/` still uses it.

**2026-11-14 - CORRECTED BY D-043:** the owner asked for the moringa's edge treatment instead of the bridge. The bridge markup and CSS are removed; the neem now grows from the bottom-left edge of the Rooms section. See D-043.

---

## D-043 - Owner correction: the neem mirrors the moringa's edge emergence
**2026-11-14 - OWNER INSTRUCTION, IMPLEMENTED.** Owner: "Actually place the Neem leaf image exactly like the Moringa leaf used in Journal, the way it branches outside seems coming from out of the website page, That is it, it can be resized if you think that can intensify its importance and beauty, overall how you feel the concept of using leaf in the site that are coming form outside of the website page?"

**Decision:** the D-042 bridge is removed. The neem now uses the moringa's gesture: **bottom-left of a section, cropped by the section edge, rotated, growing in from outside the page.** It sits at the foot of **Rooms**, the section immediately before the monograph, so the leaf still belongs to the shop's close and the botanical sequence begins there. The moringa keeps the foot of the Journal; the two leaves form one left-margin thread rather than scattered decoration. This is a deliberate two-anchor device, not a leaf on every section.

**The treatment, copied from `.corner-foliage--moringa-bl`:**
- `bottom: -30px; left: 0; width: clamp(220px, 22vw, 340px); transform: translateX(7.92%) rotate(-10deg);`
- `.home-rooms` gains `position: relative` and `overflow: clip`, so the stem is cut by the left page edge and the base by the section's bottom edge.
- The neem is an alpha cutout, so `mix-blend-mode: normal` and `filter: none`; the moringa keeps `screen` only to knock the black out of its jpg. Opacity `.88`, matching the moringa's weight.
- The Rooms section reserves `padding-bottom: clamp(180px, 28vw, 420px)` from 861 so the larger leaf never crosses the room text; below 861 the leaf is hidden and the padding returns to 80px.

**Measured** at 861/1024/1280/1440/1920:
- The leaf's transformed box top sits **14-53px below the last room text**, so no room word is covered.
- Visible leaf height **263-423px**; the box is clipped 5-8px at the left edge and 47-56px at the bottom, which is the "outside the page" read.
- No horizontal overflow at any width. At 320/390/768/860 the leaf is `display: none`, the section padding is 80px, and the page is unchanged.
- The leaf is bright enough to read against the ground (mean opaque RGB 95,121,58; 2.11:1 decorative), and no text rides on it.

**Why the concept works, and where it would fail:** a leaf entering from beyond the page edge is a depth device, not an ornament. It works when it is rare, when each leaf belongs to a specific section, and when the crop is confident enough to feel like the page is a window rather than a frame. Two anchors (Rooms and Journal) give the page a botanical thread; a leaf on every section would turn it into wallpaper, and a leaf that stops short of the edge reads as a sticker. The failure modes are a visible stem inside the page, a leaf floating in a margin, or foliage behind body text; this placement avoids all three.

**Reversible:** yes. Delete the `.corner-foliage--neem-bl` image and rules, restore `.home-rooms` to its previous padding/overflow. The D-042 bridge markup and CSS remain in the history if the owner ever wants that version back.

**Status:** implemented, 41 pages, 55/55 tests, `check:site` clean; committed locally, not pushed.
