# AURA — Status

**Updated:** 2026-11-06  
**Phase:** Site structure complete — payment, cart, wishlist, admin panel, newsletter, chatbot, compliance register all implemented. Awaiting git resolution before commit/push.  

## Current facts

- A local React/TypeScript/Vite prototype exists in `AURA-eCommerce-Shop-main`.
- **Not deployed to Cloudflare**, confirmed by the owner on 2026-11-04. Cloudflare is a future temporary preview option. Final hosting/domain structure is undecided.
- Owner reports AliExpress affiliate/dropshipping and CJ account access. Connection to AURA and payout eligibility remain unverified.
- The two product types (dropshipping = AURA sells, affiliate/referral = partner sells) are distinguished on one site by `purchaseOwner: 'aura' | 'partner'`, regardless of source platform.
- Pilot products: 
  * AliExpress item `1005007532901889` (turmeric cleansing soap, dropshipping)
  * AliExpress item `1005008143754192` (aloe vera cleansing bar, dropshipping) 
  * CJ item `2114448810729783298` (turmeric cleansing pads, affiliate/referral)
- CJ commission eligibility remains unverified; token may be merchant-referral not product-sale.
- Books must have documented publication rights. Prior candidates need further edition/territory checks; access and pricing are undecided.

## Completed work since last status

### Storefront & product structure
- Three pilot products implemented with individual URLs under `/shop/` (dropshipping) and `/discover/` (affiliate).
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
- `npm run build:templates` → 7 HTML pages generated (3 product pages + shop/index + discover/index + templates/)
- `npm run test:templates` → 26 tests pass (includes compliance, pricing, variant rendering, blocked claims, etc.)
- Services compile: concierge, commerce, auth, payments bundles produced by esbuild.
- Types updated: PurchaseOwner, PaymentMethod, PaymentStatus, VerificationStatus, AdminRole/AdminSession, etc. with detailed JSDoc.
- No medical/homeopathy/supplement/health-claim content introduced.

## Next task (awaiting resolution)

**Git blocker must be resolved before commit/push.**
- Git binary missing despite being registered in winget.
- Need git installed + remote repository configured + credentials supplied.
- Once resolved: commit this work, push to agreed remote, then owner can review in context.

## Inputs still needed (future phases)

| When | Input / decision |
|---|---|
| Payment provider | Which operator/bank will settle to Bangladesh; or confirm Belgium-based partner can receive funds. |
| Trading entity | Bangladesh trade licence, TIN, BIN, and registered address for invoices. |
| Supplier terms | Confirmed ingredient lists, safety reports, responsible persons, image permissions for each product. |
| Affiliate payout | Verify commission eligibility from AliExpress/CJ/Amazon for Bangladesh entity. |
| Books | Exact editions with established hosting rights for full publication/sale. |
| Wider site | Library placement, additional categories, and any rendering changes beyond pilot pages. |

These do not block resolving the git blocker and committing the completed structure.

## Implemented pilot pages

Project directory: `AURA-eCommerce-Shop-main`.

- `/shop/turmeric-cleansing-soap/` — dropshipping preview, pending price/options, compliance section.
- `/shop/aloe-vera-soap/` — dropshipping preview, pending price/options, compliance section, supplier facts.
- `/discover/turmeric-cleansing-pads/` — affiliate/referral page, exact CJ token disclosed, external purchase explanation, no cart.
- `/shop/` and `/discover/` — collection pages browsable by model.
- `/templates/` — combined preview index linking to all pages.
- Product pages generated from `data/pilot-products.json` via `templates/product-pages.mjs`; static assets in `public/assets/`.

All preview pages respect the core rules: card fields absent, payment status honest, compliance transparent, no medical claims.

## Verification

- `npm run build:templates`: seven HTML pages generated.
- `npm run test:templates`: 26 tests passed.
- Services compiled successfully via esbuild.
- Browser checks: galleries, quantity limits, disabled ordering on affiliate pages, exact referral links preserved, no JS console errors.
- Responsive checks: standard breakpoints; no horizontal overflow or missing images.
- All preview pages are `noindex`. No production domain or live offer schema added.

## Scope affirmations

- Existing design is the baseline; distinct product templates share the AURA identity.
- Medical and homeopathy content remain strictly excluded per owner direction.
- No deployment, package installation, supplier order, or payment action attempted.
- Cloudflare remains a temporary preview option only; not a settled production/subdomain strategy.
- Work is traceable via commits so AI Studio and Claude Desktop can continue.

## Owner-authorized frontend development complete

The storefront structure (product pages, cart, wishlist, payment flow, admin panel for multiple users, newsletter signup, deterministic chatbot, compliance/verification space) is finished and ready for version control pending git resolution.

## Addendum 2026-11-06 (continuation session)

- Handoff docs created in `AURA-eCommerce-Shop-main/docs/`: `HANDOFF.md`, `ARCHITECTURE.md`, `PAYMENTS.md`, `COMPLIANCE.md`. Other tools should read these + this file before acting.
- Honesty fixes (D-018): fake seeded orders/reviews cleared; default `admin123` PIN removed. `paymentStatus: 'paid'` now only appears in code that filters for it, never as seeded data.
- `.agents/product-marketing.md` bumped to v4.
- **Ashwagandha decision (owner, 2026-11-06):** Owner will supply separate product links later. Keep the existing demo products as-is for now; do NOT add new medical/health-claim content. Replacement will happen when owner links arrive. Recorded as a pending catalogue swap, not an exemption.
- **Git resolved 2026-11-06:** git found at `E:\OLD Client and Projects\A\Git\cmd\git.exe` (v2.55.0). Local repo initialised at `E:\e-COMMERCE BUSINESS\AURA` with `.gitignore` excluding ZIPs, `Book/`, `node_modules/`. Remote: `https://github.com/MARC414/AURA-eCommerce-Shop.git`. First commit `741a02a` pushed. Remote `main` previously held the old root-level layout; owner approved replacing `main` with `master` (`git push --force origin master:main`). Both `main` and `master` now point to `741a02a`. Ashwagandha catalogue swap pending owner-supplied product links (see above).