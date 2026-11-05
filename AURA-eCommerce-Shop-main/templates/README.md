# AURA product-page templates

Two reusable, pre-rendered HTML layouts alongside the existing React storefront:

- `/shop/turmeric-cleansing-soap/` — AliExpress dropshipping preview; ordering disabled.
- `/shop/aloe-vera-soap/` — aloe bar preview; price pending.
- `/shop/ashwagandha-with-black-pepper/` — CJ herbal supplement preview, **60 capsules**, not loose powder. Ingredient amounts are label-stated; product checks remain outstanding.
- `/discover/turmeric-cleansing-pads/` — external CJ referral listing; no AURA cart or checkout.
- `/shop/` and `/discover/` — separate collection pages.
- `/templates/` — review all four product previews in one place.

## Local review without installing anything

From `AURA-eCommerce-Shop-main`:

```powershell
npm run build:templates
npm run test:templates
npm run preview:templates
```

Open `http://127.0.0.1:4173/templates/`. This command serves only the HTML previews. It redirects its root to the preview index; it does not serve or replace the React homepage.

The existing `npm run dev` and `npm run build` commands generate these pages before Vite runs. Vite copies the `public/` files into its output, so the main storefront's new Shop/Discover links use the same origin. Its dependencies must already be installed to run Vite; no dependencies were added for these templates.

## Adding another product

Edit `data/pilot-products.json`, then regenerate. Set `model` to `dropshipping` or `affiliate` independently of `sourceName`. The slug determines the product URL within its hub.

- Use exact, confirmed descriptions, variants, and image permissions.
- Keep `price: null` when the AURA price is not set. A numeric price is labelled a preview, never a live offer.
- An affiliate entry needs `externalUrl` and a truthful `disclosure`.
- Give every product a matching `data/compliance.json` record. A supplied label is recorded as received/pending review, not upgraded to verified certification or batch testing.
- Mark placeholder images with `isPlaceholder: true`; they remain visible as placeholders but are omitted from Product and Open Graph product-image metadata. An unknown brand is omitted rather than fabricated.
- Empty variants display a disabled "Options awaiting confirmation" field.
- Generated HTML should not be edited directly; edit `templates/product-pages.mjs` instead.

## Deliberate development restrictions

- Dropshipping actions remain disabled, even if a preview price or variants are supplied. No order-processing code exists in these pages.
- The quantity stepper and gallery are demonstration interactions only.
- No customer data, accounts, database, payment SDK, supplier API, or newsletter submission was introduced.
- The CJ link is preserved exactly as provided. Its commission eligibility has not been confirmed.
- The soap title and one image were read from AliExpress public metadata. "Handmade," ingredients, safety, and other supplier claims are not independently verified. No supplier price or delivery promise was imported.
- The CJ title is a draft from the URL. Its artwork is explicitly labelled an illustration, not a supplier photograph.
- Seven HTML pages are generated (four products, two collections, one index), all `noindex`. Product metadata and JSON-LD are present, but preview-relative canonical/sitemap URLs still need a confirmed production origin. Preview crawling/indexing rules also need a launch review. The pending-price products emit no offers or ratings.
- This is not a site-wide React migration or a production checkout. Existing prototype components outside the pilot remain unchanged.
