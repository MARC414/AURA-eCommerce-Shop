# AURA product-page templates

Two reusable, pre-rendered HTML layouts alongside the existing React storefront:

- `/shop/turmeric-cleansing-soap/` — AliExpress dropshipping preview; ordering disabled.
- `/discover/turmeric-cleansing-pads/` — external CJ referral listing; no AURA cart or checkout.
- `/shop/` and `/discover/` — separate collection pages.
- `/templates/` — review both pilot pages in one place.

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
- Empty variants display a disabled "Options awaiting confirmation" field.
- Generated HTML should not be edited directly; edit `templates/product-pages.mjs` instead.

## Deliberate development restrictions

- Dropshipping actions remain disabled, even if a preview price or variants are supplied. No order-processing code exists in these pages.
- The quantity stepper and gallery are demonstration interactions only.
- No customer data, accounts, database, payment SDK, supplier API, or newsletter submission was introduced.
- The CJ link is preserved exactly as provided. Its commission eligibility has not been confirmed.
- The soap title and one image were read from AliExpress public metadata. "Handmade," ingredients, safety, and other supplier claims are not independently verified. No supplier price or delivery promise was imported.
- The CJ title is a draft from the URL. Its artwork is explicitly labelled an illustration, not a supplier photograph.
- All five pages have `noindex` during development. Canonical domains and live structured offers are intentionally absent until the production setup and listing facts are decided.
- This is not a site-wide React migration or a production checkout. Existing prototype components outside the pilot remain unchanged.
