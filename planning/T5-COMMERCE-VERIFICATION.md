# T5 — Commerce verification, on the built site

**Date:** 2026-11-10
**Scope:** D-033 §4 T5. Verification only — no storefront file was changed by this pass.
**Method:** the built `dist/` served by `scripts/preview-products.mjs` (port 4175), driven in
Chromium at `http://127.0.0.1:4175`. Same-origin iframes, real clicks, real `localStorage`, real
`fetch` for the search index. Nothing was mocked except the priced state (see below).

## The honest caveat first

No product in `data/pilot-products.json` carries a price, so **every real page shows "Price on
request"** and the priced path cannot be reached by browsing. To exercise it, `aura_cart_v1` was
seeded directly with a 12.50 item — the same key and the same item shape `cart.js` writes. That
tests the store and the two pages that read it; it does not prove a price exists anywhere.

## Pass/fail

| # | Flow | What was driven | Result |
|---|---|---|---|
| 1 | Cart, dropshipping, unpriced | Add from `/shop/turmeric-cleansing-soap/` | **pass** — 1 item stored (price `null`, quantity 1), count chip `1`, in-place "Added 1 × …" |
| 2 | Cart page, unpriced | Line price, subtotal, note | **pass** — "Price on request", line total `—`, subtotal **"On invoice"** (not `£0.00`), note: "Some pieces are priced on request…" |
| 3 | Cart page, quantity | Increase, then decrease | **pass** — store 1 → 2 → 1; the `<output>` follows; both buttons disable at the limits |
| 4 | Cart page, priced (seeded) | 12.50 × 2 | **pass** — "£12.50 each", subtotal **£25.00**, no pending note |
| 5 | Cart page, remove | Remove the last item | **pass** — store empty, empty state shown |
| 6 | Checkout, unpriced | Fill 8 real fields + consent, submit | **pass** — reference `OPAR-261110-…` shown, confirmation visible, cart cleared, request stored with `subtotal: null, priceOnRequest: true` |
| 7 | Checkout, mixed | Seeded 12.50 × 2 + one unpriced | **pass** — line totals `£25.00` and "On invoice", subtotal withheld, order stores `subtotal: null, priceOnRequest: true`, 2 items |
| 8 | Checkout, payment fields | Inspect the form | **pass** — no card, CVC or `cc-number` field anywhere; no request to any payment host |
| 9 | Account | Find the reference, remove it | **pass** — the new request is listed by reference; removing it empties the store and the empty state returns |
| 10 | Wishlist | Save on `/shop/ashwagandha-with-black-pepper/` | **pass** — id written to `aura_wishlist_v1`, control says saved, count chip `1` |
| 11 | Wishlist page | List, then remove | **pass** — one card naming the piece; remove empties it, empty state returns |
| 12 | Search | `herbal`, `turmeric`, `privacy` | **pass** — each finds the expected destination (`/shop/herbal-botanicals/`, `/shop/turmeric-cleansing-soap/`, `/policies/privacy/`) and reports a result count |
| 13 | Affiliate model | `/discover/turmeric-cleansing-pads/` | **pass** — no add-to-cart, external CTA "View offer on CJ (opens in a new tab)" with `rel="sponsored noopener noreferrer"`, referral disclosure in the page ("OPAR may earn a commission…") |
| 14 | Variants (3 real options) | Aloe, "Pack of 3" | **pass** — options listed from data, selection announced, `selectedVariant` stored with the item, cart page names the variant |
| 15 | Console | All pages driven | **pass** — 0 errors, 0 warnings |

48 checks, 0 defects. Two assertions failed on first wording and were the assertions' fault, not the
site's: the subtotal reads **"On invoice"** rather than `-` (better copy than the check expected),
and the quantity lives in an `<output>` inside the line rather than as loose text.

## Observations that are not defects

1. **Affiliate offers live under `/discover/`, not `/shop/`.** So an affiliate product is not in a
   room and is not on `/shop/`; it is reached from the Discover menu. Supplier-neutral hubs are the
   owner's rule, so whether an affiliate piece should also sit in a room is an owner decision, not a
   bug — but it does mean the shop grid shows only dropshipping pieces today.
2. **The drawer question is closed** by D-033 and needed no test: the React slide-out was reachable
   only from the homepage navbar, and the homepage had no add-to-cart of its own, so the cutover lost
   an animation rather than a capability. The cart icon links to `/cart/` on all 41 pages.
3. **Everything is browser-local.** A different device sees an empty cart, wishlist and account. That
   is stated on the pages and is correct until a backend exists; it is also why the admin panel cannot
   see a customer's request (T6).
