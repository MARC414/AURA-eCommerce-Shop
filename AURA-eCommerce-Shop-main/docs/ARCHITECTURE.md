# AURA — Architecture (2026-11-06)

## What exists
- `AURA-eCommerce-Shop-main` — React 19 + TypeScript + Vite prototype (existing design, preserved).
- Static HTML product pages generated from `data/pilot-products.json` via `templates/product-pages.mjs` + `scripts/generate-product-pages.mjs` into `public/shop/`, `public/discover/`, `public/templates/`. All `noindex`, display-only.
- No backend, no database, no deployment. Cloudflare is a temporary preview option only, not settled hosting.

## Purchase model (the core distinction)
Split by `purchaseOwner: "aura" | "partner"`, not by supplier:
- Shop `/shop/` — AURA sells (dropshipping). Cart, checkout (invoice request), order record.
- Discover `/discover/` — partner sells (affiliate/referral). Links out, no cart, no quantity, token disclosed.
- One canonical URL per product. Never show "drop ship" publicly. Cart is the contract: anything that cannot enter AURA's cart never gets cart affordances. No mixed shoppable grid.

## Verified not-yet-live rules
- `paymentStatus: 'paid'` can only be set by a server webhook. Client creates `awaiting_payment` only.
- Card data never touches AURA. Any future card payment = redirect to provider-hosted page.
- A claim is publishable only when its compliance record is `verified`. Status is never auto-upgraded.
- Free chatbot = deterministic retrieval over `data/knowledge-base.json`. No LLM, no cost, refuses on no match.

## Key modules
- `services/commerce.ts` — cart persistence, newsletter (localStorage, honest "saved on this device").
- `services/payments.ts` — provider registry, `FORBIDDEN_CARD_FIELDS`, `canClientMarkPaid() === false`.
- `services/auth.ts` — local-preview passphrase (SHA-256, no default), roles/permissions contract for a future server.
- `services/concierge.ts` — `askConcierge()` retrieval.
- `data/compliance.json` — verification register (lab test, accreditation, medical report, safety, labelling, origin, image rights).
- `components/AdminDashboard.tsx` + `AdminGate.tsx` — Overview / Requests / Catalogue / Team / Compliance / Settings. Session labelled `local-preview`.

## Verification
- `npm run build:templates` → generates product + collection pages.
- `npm run test:templates` → 26 tests (compliance, pricing, variants, blocked claims, affiliate token, no card/order in static JS).
- esbuild compile check on `services/*.ts` (see HANDOFF.md for command).

## Known gaps (not fixed without owner decision)
- `constants.ts` still contains Ashwagandha/health-claim demo products — conflicts with no-medical rule. Awaiting owner decision on removal vs. quarantine.
- Fake seeded orders/reviews in `storeService.ts` — see fix applied 2026-11-06 (empty seed, no default PIN).
- Git binary missing in this environment; commit/push blocked pending install + remote URL.
