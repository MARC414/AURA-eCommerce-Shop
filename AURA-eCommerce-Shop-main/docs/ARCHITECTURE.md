# AURA — Architecture (2026-11-06)

## What exists
- `AURA-eCommerce-Shop-main` — React 19 + TypeScript + Vite prototype (existing design, preserved).
- Static HTML product pages generated from `data/pilot-products.json` via `templates/product-pages.mjs` + `scripts/generate-product-pages.mjs` into `public/shop/`, `public/discover/`, `public/templates/`. All `noindex`, display-only.
- No backend, no database, no deployment. Cloudflare is a temporary preview option only, not settled hosting.

## Purchase model (the core distinction)
Split by `purchaseOwner: "aura" | "partner"`, not by supplier:
- Shop `/shop/` — AURA is the intended seller. The generated HTML pages are previews with ordering disabled; the separate React checkout is a browser-local order-request prototype.
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
- `npm run test:templates` → 30 tests, including capsule form, label-stated serving amounts, evidence statuses, and schema checks for the CJ Ashwagandha entry.
- esbuild compilation is a smoke check, not a full TypeScript or end-to-end application test. The latest intake checked PilotProducts and concierge; see `planning/STATUS.md` at the outer repo root.

## Known gaps and current scope
- D-020 allows owner-selected herbal-supplement previews, including capsules. `constants.ts` still contains a separate legacy demo catalogue with unsupported claims; it is not verified product data. Catalogue reconciliation remains a follow-up.
- Fake seeded orders/reviews in `storeService.ts` — see fix applied 2026-11-06 (empty seed, no default PIN).
- Git and origin are configured (outer AURA repo root). Use explicit staging and ordinary fast-forward pushes; user files and duplicate templates remain untracked.
- Preview SEO still uses relative canonical/sitemap URLs and development crawling rules. Review these against the confirmed origin before any public launch.
