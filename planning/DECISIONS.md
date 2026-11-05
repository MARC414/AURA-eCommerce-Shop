# AURA — Decision Log

Append-only. Each entry records what was decided, why, and whether it is reversible.
Status values: **APPROVED** (owner), **PROPOSED** (agent suggestion, not approved), **REJECTED**, **SUPERSEDED / CORRECTED**.

**Current reading note (2026-11-06):** Read D-020 first: it corrects the mistaken powder/root-only interpretation in D-019 and records the CJ capsule selection. D-017 covers the frontend structure request; D-014/D-015 correct earlier assumptions. Older entries remain history, not current authority where corrected.

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
