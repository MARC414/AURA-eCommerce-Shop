# AURA — Status

**Updated:** 2026-11-06  
**Phase:** Four generated product previews; current intake is CJ Ashwagandha with Black Pepper. Commerce/admin remain local prototypes. Git is working and the remote is configured.

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
- `npm run build:templates` → 7 HTML pages generated (4 products + 2 collections + preview index).
- `npm run test:templates` → 30 tests pass, including capsule identity, per-serving amounts, pending evidence, and metadata.
- Services compile: concierge, commerce, auth, payments bundles produced by esbuild.
- Types updated: PurchaseOwner, PaymentMethod, PaymentStatus, VerificationStatus, AdminRole/AdminSession, etc. with detailed JSDoc.
- Selected herbal-supplement previews are now allowed under D-020. New product copy omits supplier health and certification claims; the legacy React demo catalogue still needs a separate content cleanup.

## Next work

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
| Wider site | Library placement, additional categories, and any rendering changes beyond pilot pages. |

These do not block product-preview intake. Live payments, deployment, and new installations need their own approval.

## Implemented pilot pages

Project directory: `AURA-eCommerce-Shop-main`.

- `/shop/turmeric-cleansing-soap/` — dropshipping preview, pending price/options, compliance section.
- `/shop/aloe-vera-soap/` — dropshipping preview, pending price/options, compliance section, supplier facts.
- `/discover/turmeric-cleansing-pads/` — affiliate/referral page, exact CJ token disclosed, external purchase explanation, no cart.
- `/shop/ashwagandha-with-black-pepper/` — 60-capsule herbal supplement preview; label-stated facts and pending evidence.
- `/shop/` and `/discover/` — collection pages browsable by model.
- `/templates/` — combined preview index linking to all pages.
- Product pages generated from `data/pilot-products.json` via `templates/product-pages.mjs`; static assets in `public/assets/`.

All preview pages respect the core rules: card fields absent, payment status honest, compliance transparent, no medical claims.

## Verification

- `npm run build:templates`: seven HTML pages generated.
- `npm run test:templates`: 30 tests passed.
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
