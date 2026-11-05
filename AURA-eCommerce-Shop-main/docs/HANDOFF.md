AURA — Handoff Summary (v2026-11-06)
=====================================

Read the outer `AGENTS.md`, `.agents/product-marketing.md`, and `planning/STATUS.md`
first. They hold current decisions; this file maps the implementation for AI Studio
and Claude Desktop.

LATEST INTAKE (D-020, 2026-11-06)
-------------------------------
- Added CJ `1898627038642925570`, SKU `CJHP232030301AZ`, at
  `/shop/ashwagandha-with-black-pepper/`, category Herbal Botanicals. Shop is the
  intake assumption for the sourcing link. Selling price is pending; ordering is disabled.
- This is **60 capsules**, despite CJ's `Powder` attribute. 113 g is gross package
  weight. The owner wanted capsules because powder/root was unavailable; D-019
  recorded the preference backwards and is corrected by D-020.
- Supplied PDF was rendered and read locally after the direct reader failed. It
  is label artwork, not a laboratory report or accreditation. Per two-capsule
  serving it states 1,300 mg Ashwagandha root and 10 mg black pepper, with pullulan
  capsules as inactive ingredient. These are label statements, not verified test results.
- Evidence review: 0 verified / 10 outstanding. Label, identity, and form are pending;
  tests/certificates/physical pack/image permission remain outstanding. Original PDF
  is not hosted. `docs/COMPLIANCE.md` records its fingerprint and limitations.
- 30 template tests passed; generated seven HTML pages. PilotProducts and concierge
  compile; three updated-answer smoke checks pass. DOM checks at 375/1425 px content
  widths pass without horizontal overflow; order action stays disabled.
- New product automatically appears in the existing homepage preview cards and Shop
  collection. The main React demo catalogue is still separate and contains older
  sample claims; it is not the source of verified supplier facts.

WHAT IS DONE
------------
- Storefront: four static product pages (turmeric soap, cleansing pads, aloe bar,
  Ashwagandha capsules) under /shop/ and /discover/.
- Compliance register: data/compliance.json records every verification item
  per product. A claim may only be published when the matching record is
  'verified'. Missing evidence is recorded as missing, never implied.
- Two purchase paths:
  * /shop/ → AURA sells once activated; current HTML previews cannot create orders.
  * /discover/ → affiliate products (partner sells, links out; no cart,
    no quantity controls, token disclosed per page).
  * One canonical URL per product; never mixed in the same grid.
- Cart: persistent in localStorage via commerce.ts. addToCart / removeFromCart /
  updateQuantity all go through the commerce API; cart survives page reload.
- Newsletter: subscribed emails stored locally; form says "Saved on this device.
  A confirmation email will be sent once a mailing provider is connected."
- Chatbot (Assistant): deterministic retrieval from data/knowledge-base.json.
  No LLM, no cost. Refuses with a honest fallback when no match. Suggestion
  chips cover the most common questions.
- Payment: No card fields anywhere. Card payment is a provider-hosted redirect
  (currently disabled). Default route is "Request an invoice" which records an
  order with paymentStatus = 'awaiting_payment'. No server webhook yet; only a
  server can change status to 'paid'.
- Admin panel: protected by a passphrase (SHA-256 hash in localStorage). No
  default 'admin123'. Session labelled 'local-preview'. Roles/permissions
  modelled for a future server — ROLE_PERMISSIONS in types.ts.
- Compliance tab in AdminDashboard reads data/compliance.json, shows each
  product's verification items, status pills, blocked claims, and responsible
  person note. Nothing can be auto-upgraded; missing evidence stays missing.
- Footer: every claim removed that was not verified. No fake certifications,
  no "30-day money-back guarantee", no "Subscribe for 10% Off", no "Dropship
  Admin Portal" link. Honest copy only.
- Product pages: each product has its own URL; price shown as null pending;
  variants labelled "price pending"; compliance section on each page; blocked
  claims always visible.
- Two template models: `renderDropshippingPage` and `renderAffiliatePage`; each
  enforces model-specific UI rules (no card form on affiliate, no quantity
  controls on partner, etc.).
- 30 template tests pass. esbuild checks are compilation smoke checks, not a full
  TypeScript or end-to-end verification of the React app.

REMAINING BLOCKERS
-----------------
- Git is resolved: `E:\OLD Client and Projects\A\Git\cmd\git.exe`.
  Origin: `https://github.com/MARC414/AURA-eCommerce-Shop.git`.
  Stage explicit files only; local user files and duplicate templates are untracked.
- Payment gateway for Bangladesh operator unresolved; only manual invoice /
  bank transfer live. No Stripe/PayPal standard list includes Bangladesh.
- Affiliate payout eligibility from Bangladesh unverified (AliExpress, CJ,
  Amazon). CJ link token may be merchant-referral not product-sale commission.
- constants.ts still contains Ashwagandha and health-claim demo products,
  which conflicts with the no-medical rule. Not yet addressed — scope was
  checkout/structure first; this requires reworking the product catalogue.
- EU responsible-person address for aloe soap displayed as "CASTELLANA 9141,
  28046 Madrid" looks malformed; recorded as supplier-stated, must be
  verified before relied on. UK responsible person is separate.
- The remote repository is configured. No public deployment has been performed;
  Cloudflare remains a temporary preview option, not settled hosting.

FILES CREATED OR MODIFIED THIS SESSION
--------------------------------------
- data/compliance.json — full verification register.
- data/pilot-products.json — third product added, refined fields.
- data/knowledge-base.json — chatbot corpus (18 Q&A entries).
- services/concierge.ts — retrieval chatbot, no LLM.
- services/commerce.ts — cart, newsletter, CSV export.
- services/auth.ts — passphrase hash, AdminUser/role model.
- services/payments.ts — provider registry, FORBIDDEN_CARD_FIELDS, canClientMarkPaid().
- templates/product-pages.mjs — compliance section, variantLabel(), render templates.
- scripts/generate-product-pages.mjs — loads compliance.json per product.
- public/assets/product-pages.css — verification styles, .rp-note.
- components/Checkout.tsx — card fields removed, invoice-first.
- components/OrderSuccess.tsx — honest "request received", no fake delivery.
- components/Assistant.tsx — uses askConcierge + knowledge-base.
- components/Footer.tsx — removed fake copy, honest newsletter.
- components/AdminGate.tsx — passphrase setup/login, user selection.
- components/AdminDashboard.tsx — multi-user panel, compliance tab, team, settings.
- types.ts — PurchaseOwner, SourcingModel, PaymentStatus, PaymentMethod, etc.
- tests/product-pages.test.mjs — 30 tests including the capsule and evidence regressions.

PLANNING FILES REFERENCED
------------------------
- planning/STATUS.md — current product intake, verification, and remaining prototype work.
- planning/DECISIONS.md — decision history reviewed.
- .agents/product-marketing.md — product context, audience, positioning.

NEXT WORK (future integrations still need approval)
---------------------------------------
1. Obtain the exact-product physical label, batch-linked analysis, and certificate evidence.
2. Reconcile the legacy React demo catalogue with the generated product pages.
3. Finalize EU/UK responsible-person verification for aloe soap.
4. If partner in Belgium can supply a payment method, integrate it.
5. Consider a small UI clean-up of the Ashwagandha references visible in
   ProductDetail (they come from constants.ts product list).

HOW TO REBUILD FROM SCRATCH (for AI Studio / Claude Desktop)
-----------------------------------------------------------
- Run `npm run build:templates` → generates all shop pages.
- Run `npm run test:templates` → 30 tests.
- Run `npm run preview:templates` (port 4173) to view the storefront.
- To add a new product: edit data/pilot-products.json, then re-run the build
  script. Add a matching record in data/compliance.json; tests require a record
  for every pilot product. Keep unavailable evidence pending or not-provided.
- The chatbot is ready: Assistant uses askConcierge; add Q&A entries in
  data/knowledge-base.json as needed.
- The admin panel requires a passphrase; set one via AdminGate on first load.
  The default state has no passphrase set.

END OF DOCUMENT
