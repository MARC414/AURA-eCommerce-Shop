# OPAR Template Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `executing-plans` inline, task by task. No agents are authorized. Track steps with checkboxes and RED/GREEN evidence in the existing execution ledger. Leave changes uncommitted.

**Goal:** revise the non-homepage preview documents to follow the five supplied mockup compositions, then compare them with the supplied PNGs before any live rollout.

**Architecture:** retain the production renderers and their data/controls. Add explicit `referenceLayout` variants and a separately loaded, scoped reference stylesheet; omitted options produce exactly the current customer HTML. The preview factory selects these variants and the existing generator updates only derivatives, sample documents and its marked reference-page area.

**Tech Stack:** existing Node.js ES modules, generated HTML, CSS, browser JavaScript and node:test. No framework migration or new dependencies.

**Spec:** `planning/OPAR-MOCKUP-FIDELITY-REVIEW-2026-11-23.md`, approved 2026-11-23. Authoritative HTML/PNGs: `AURA-eCommerce-Shop-main/public/assets/OPAR-ui-mockup-templates/`.

## Execution Checkpoint — 2026-11-23

- [x] Task 1: opt-in shell/hero implementation and renderer gates; measured source-scale desktop hero geometry.
- [x] Task 2: reference cards/category implementation; border/well/inset measurements and Shop filter/reset/sort checks.
- [x] Task 3: mixed PDP implementation; gallery caps, wishlist and construction-price variant checks. Preserve existing pending-price cart behavior rather than the incorrect disabled-cart assumption below.
- [x] Task 4: real newsletter composition; required email, local save/remove and computed hidden-state checks.
- [x] Task 5: eight generated samples/five source comparison pairs, deterministic generation, asset/default-output guards, tests/build/TypeScript/site checks.
- [ ] Remaining acceptance: owner visual approval, screenshot-based comparison and complete composed-background contrast audit. Screenshot tool requires a visible desktop window; composed-artwork canvas probe timed out. Doubled heading-text reflow was checked, not actual OS/browser zoom. Do not describe this checkpoint as pixel-perfect or fully accessibility-audited.

Detailed RED/GREEN results and rulings are in `planning/OPAR-REPAIR-PREVIEW-PROGRESS-2026-11-22.md`. The task steps below remain the original implementation brief; this checkpoint is the execution state.

## Global Constraints

- Homepage strictly frozen, including Letter, shared-style effects, navigation, identity and scripts. Do not edit `templates/home-page.mjs`, live brand/site data, scripts or `public/assets/product-pages.css` during this revision. Retain the earlier scoped Shop hidden-state repair.
- Preview revision only. No live route-theme rollout, commit, push, deploy, package installation, automation or agents. Work inline in the current folder.
- All optional branches default off. Default customer output stays unchanged, including product facts, construction disclosures, referral URLs and controls.
- Original assets stay byte-identical. Use supplied background PNGs directly; keep SVG derivatives separate under `/assets/brand/web/`. No AI photography.
- Keep existing smaller gallery caps: 520×650 desktop, 400×500 at narrower desktop widths, centred capped mobile gallery. Use `object-fit: contain` for products; decorative backgrounds may cover.
- Eight review documents, `noindex, nofollow`, excluded from sitemap/search/customer navigation. Preserve the six existing filenames; add `category-paper.html` and `newsletter-moss.html`. The legacy `pdp-paper.html` filename remains, but its label must explicitly say mixed Paper/Moss.
- Exact source palette: Paper `#F4F2EE`, Moss `#2F332B`, Mist `#D0D3C4`, action `#9AA66C`, accent `#55632A`, Paper body `#43463F`, card well `#E2E1DC`, card border `#CDCCC7`.
- Cormorant Garamond display and Manrope interface type from the existing font configuration. Do not copy prototype clipping, dummy prices, stock implications, missing assets or nonfunctional controls.

## Review Focus

1. Default callers, especially homepage cards/header/Letter, must never select preview branches or load reference CSS (Task 1 default-output guards).
2. Long text, 200% zoom and small viewports must grow naturally; decorate with positioned layers, not positioned content or fixed page height (Tasks 1–4 browser probes).
3. Empty results and unavailable products must retain working reset/disabled states; a hidden flex card must not return (Tasks 2–3).
4. Paper and Moss native controls, focus rings and body text must be readable independently, including after newsletter save/remove (Tasks 3–4 contrast/interaction checks).
5. Missing source assets, repeated generation and existing reference edits must not cause partial or destructive regeneration (Task 5 generator tests).

## File Responsibilities and Interfaces

All storefront paths below are relative to `AURA-eCommerce-Shop-main/`.

- Create `templates/reference-layouts.mjs`: decorative hero/newsletter wrappers only; consumes escaped content from existing renderers, not commerce logic.
- Create `public/assets/opar-template-preview.css`: reference tokens, backgrounds, header, heroes, cards, mixed PDP and newsletter rules. Every rendered-page selector starts with `.opar-reference-document`; reference-index rules use `.brand-review-reference-comparison`. No global selectors.
- Modify `templates/chrome.mjs`: optional header lockup only; footer/default identity remains unchanged.
- Modify `templates/collection-pages.mjs`, `templates/product-page.mjs`, `templates/app-pages.mjs`: select reference wrappers while retaining their existing private helpers and scripts.
- Modify `templates/brand-preview.mjs`, `scripts/generate-brand-preview.mjs`: select eight specimens, validate supplied dependencies, provide five source/implementation comparisons, generate two additional lockup SVGs.
- Modify `tests/brand-preview.test.mjs`, `tests/browser-probes.mjs`; create `tests/fixtures/reference-defaults.json`: real renderer/default-output and browser contracts. Tests remain imported by the current suite entry.

**Shared layout contract:** optional `referenceLayout` lives in the renderer's existing options object and is destructured before forwarding document options. Allowed combinations: Shop/category `paper-hero`; Discover `paper-grid`; PDP `featured-product`; Perennis/Journal `dark-hero`; `/newsletter/` `newsletter`. Reject unsupported combinations with a descriptive error; never silently modify a different route. Body classes/stylesheets are selected explicitly by the preview factory.

**Helper contract:** `renderReferenceHero({ surface, eyebrow, heading, intro, breadcrumbs = '', action = null, meta = '' }) -> string`, where `surface` is `paper` or `moss` and `action` is `{ href, label }`. Escape text/action values; `breadcrumbs` is trusted markup built by the caller. `renderReferenceNewsletter({ page, form }) -> string` consumes existing page copy and the existing rendered newsletter form.

**Identity contract:** add optional `identity.headerLockupOnDark` / `identity.headerLockupOnLight`; preview header uses the full lockup with intrinsic 145×34 ratio and accessible home-link name, without duplicating the wordmark. Default header and all footer branches stay unchanged. Export ivory/green outlines from the supplied `opar-lockup-main-vector-press.eps` through existing `epsOutlineToSvg(source, color)`.

## Task 1: Isolated Reference Shell and Orbit Heroes

**Files:** `templates/reference-layouts.mjs`, `templates/chrome.mjs`, `templates/collection-pages.mjs`, `templates/app-pages.mjs`, `public/assets/opar-template-preview.css`, `tests/brand-preview.test.mjs`, `tests/fixtures/reference-defaults.json`.

- [ ] Capture LF-normalized SHA-256 hashes of all default customer renderer outputs before modification, using current data and the existing homepage freeze fixture. Add a test comparing every default output to those fixed hashes.
- [ ] Add failing real-renderer tests: opt-in Shop uses `section-bg-paper.png` and no studio photograph, retains `data-shop-form`; Perennis and Journal use `section-bg-ground.png`, each has one H1 and retains its blocks/links; unsupported reference variants throw; default pages contain no reference class/stylesheet. Test hero text escaping and valid CTA destinations.
- [ ] Run `node --test --test-name-pattern="reference shell|reference hero|default customer" AURA-eCommerce-Shop-main/tests/product-pages.test.mjs`; observe the missing-reference behavior fail, not an unrelated import/setup error.
- [ ] Implement the helper/branches and optional lockup contract above. Preview header target: 88px desktop, 56px horizontal inset, full lockup 220px wide; keep real menus/search/account/wishlist/cart and construction status, using responsive accommodation rather than deleting controls. Keep the review notice visible outside the hero and record its extra height in comparisons.
- [ ] Implement 1440px hero targets from sources 01/02: minimum 812px region, content inset 88px/170px, heading 84px at `.9` line-height and weight 400, intro 18px/1.55 and max 520px, copy widths 620px dark/590px Paper. Content stays in flow and may enlarge the hero. Scale type/gutters below desktop; no clipping or forced line breaks in real page headings.
- [ ] Preserve source layer order/crops: dark supplied ground background `.78`, directional Moss scrim (`.98` at 0%, `.82` at 45%, `.16` at 100%), mark 720px/right −80px/top 40px at `.14`; Paper background `.78`, mark 720px/right −90px/top 60px at `.10`, no dark photo/scrim. Decorations are noninteractive and hidden from assistive technology.
- [ ] Give Shop a real anchor to its existing results; reading openers use their existing destination links. Add scoped rectangular button styles: source 15px/20px padding, 11px uppercase/.15em tracking, appropriate outlined/filled roles; retain visible focus and at least 44px action targets.
- [ ] Run the targeted tests then `npm run test:templates`; record RED/GREEN and verify default hashes unchanged. Browser-check long text at 375/768/1440px and 200% zoom before accepting hero geometry.

## Task 2: Framed Paper Cards and Category Preview

**Files:** `templates/collection-pages.mjs`, `public/assets/opar-template-preview.css`, `tests/brand-preview.test.mjs`, `tests/browser-probes.mjs`.

**Interface:** extend `renderCategoryPage(collection, products, documentOptions = {})`; omitted options preserve existing output. Continue using `card(product, index)` unchanged so homepage cards cannot change.

- [ ] Add failing tests for category option pass-through, real product links/card facts, an empty category recovery link and Discover affiliate disclosures. Add browser assertions for Paper cards: 1px complete border, well `rgb(226, 225, 220)`, metadata padding `18px 18px 20px`; hidden states still win.
- [ ] Run `node --test --test-name-pattern="reference cards|reference category" AURA-eCommerce-Shop-main/tests/product-pages.test.mjs`; confirm expected failures.
- [ ] Add scoped reference card CSS: Paper complete frame, 22px grid gap, 27px/400 serif names, contained photographs, green category labels and rectangular actions. Three columns where available, two at intermediate widths, one mobile. Keep metadata height intrinsic instead of copying the source's fixed 600px card; image wells scale with card width rather than forcing 385px at every width.
- [ ] Keep the real Shop sidebar and its fieldsets/reset/sort; visually integrate them with the Paper grid without adding dummy category tabs. Reference-grid Discover/category navigation uses actual room links and selected-page semantics. Do not alter the existing numeric filter logic or infer approval for those price bands.
- [ ] Run the targeted/full suites. Execute `shopVisibilityProbe()` on live Shop and revised Shop: `9 → 3 → 0 → 9`; verify URL/reset/sort behavior and mobile disclosure. Record the intentional width adaptation caused by the retained sidebar.

## Task 3: Mixed Paper/Moss Product Opening

**Files:** `templates/product-page.mjs`, `public/assets/opar-template-preview.css`, `tests/brand-preview.test.mjs`, `tests/browser-probes.mjs`.

**Interface:** `renderDropshippingPage(product, products = [], documentOptions = {})` and `renderAffiliatePage(product, products = [], documentOptions = {})` both forward `featured-product`; private gallery/actions/details helpers remain the source of commerce markup.

- [ ] Add failing tests that opt-in product HTML has distinct visual/detail wrappers, one H1, original variant/wishlist/cart/accordion hooks and no `opar-mark-ground.png` reference. Test unpriced/disabled and affiliate paths; affiliate never gains purchase/quantity controls. Default output hashes must still match.
- [ ] Run `node --test --test-name-pattern="reference product" AURA-eCommerce-Shop-main/tests/product-pages.test.mjs`; observe RED.
- [ ] Implement a full-width opening composition with `1.08fr .92fr` desktop panes and no gap: Paper visual left, Moss information right. Visual background uses supplied Paper artwork at `.18` with multiply; decorative overlay must not intercept the gallery or wash out product facts. Use the existing green vector mark at explicit 130px width/auto height, `.85`, with 45px source insets where space permits.
- [ ] Centre the capped gallery within the larger Paper pane; keep actual images/thumbnails uncut. Details target source 100px/88px desktop padding, 72px/.9/400 heading, 18px/1.55 secondary copy; allow content to extend beyond 812px rather than clipping real controls/disclosures. Stack panes below 861px, retaining existing narrower/mobile gallery caps.
- [ ] Set independent Moss semantic tokens for the detail pane and its form, focus, status, wishlist, sourcing and action elements. Keep longer specifications/related cards below in readable Paper sections; preserve sample notice, exact facts and pricing constraints.
- [ ] Run targeted/full tests. Browser-check gallery geometry at 375/1024/1440px, variant switching, wishlist toggle, disabled ordering and accordion/jump links; measure both panels' text/control contrast. Use browser-local synthetic data only and restore it after probes.

## Task 4: Dark Newsletter Composition with Real Form

**Files:** `templates/reference-layouts.mjs`, `templates/app-pages.mjs`, `public/assets/opar-template-preview.css`, `tests/brand-preview.test.mjs`, `tests/browser-probes.mjs`.

**Interface:** reference `/newsletter/` passes existing `newsletterSection()` markup to `renderReferenceNewsletter({ page, form })`; no homepage Letter changes and no new subscription backend.

- [ ] Add failing tests for the opt-in newsletter: supplied Button background, shade `.76`, mark `.16`, one H1, one labelled `type=email` form, save/remove/status hooks, original browser-local/no-service disclosures. Reject newsletter layout on unrelated pages.
- [ ] Run `node --test --test-name-pattern="reference newsletter" AURA-eCommerce-Shop-main/tests/product-pages.test.mjs`; confirm RED.
- [ ] Wrap the existing page heading/intro and real form in source 05's composition: minimum 812px region, Button artwork at cover, separate Moss shade `.76`, 800px mark/right −140px/top −80px at `.16`; desktop content left 110px/top 180px/max 620px, heading 76px/.88/400. Form gap 8px, email control target 330px desktop, rectangular outlined action, source-like bottom line using existing brand text.
- [ ] Keep all newsletter disclosure blocks below the hero and a visible browser-local service note near the form. Intrinsic content flow replaces absolute form/footer placement; mobile form stacks and does not clip status/removal controls. Existing page copy replaces mockup marketing/sample text.
- [ ] Run targeted/full tests. Browser-check validation, save/status/remove with a synthetic `.invalid` email; back up and restore browser storage. Verify mobile labels/focus and composed contrast before accepting `.76` unchanged; report any needed accessibility deviation rather than silently weakening fidelity.

## Task 5: Generate Eight Specimens, Compare and Stop for Approval

**Files:** `templates/brand-preview.mjs`, `scripts/generate-brand-preview.mjs`, `tests/brand-preview.test.mjs`, `tests/browser-probes.mjs`, `public/brand-preview/` generated files, `/assets/brand/web/` generated lockups; planning status/ledger.

**Interface:** retain `renderBrandPreviewDocuments(products, pages) -> { documents, section }`; import category definitions from existing chrome data, not a second registry. Keep six old filenames/order and append category/newsletter. `generateBrandPreview(projectRoot)` validates all new original dependencies before any write; five SVG derivatives total (three existing plus two lockups).

- [ ] Update old six-document tests to the eight-document contract; add failing checks for selected layouts/stylesheets, valid comparison sources, mixed PDP label, five SVG outputs, unique IDs, noindex and absence from sitemap/search. Test missing background/lockup masters and ambiguous markers leave the existing index unchanged; test a second generation is identical and originals unchanged.
- [ ] Run `node --test --test-name-pattern="reference generation|reference comparison|noindex specimens|preview generation" AURA-eCommerce-Shop-main/tests/product-pages.test.mjs`; observe intentional RED before implementation.
- [ ] Select variants/stylesheets only in the preview factory. Category specimen is the existing Everyday Care collection; newsletter is the existing `/newsletter/` data. Checkout retains its actual form and receives only the approved preview surface/button treatment, not an invented template composition.
- [ ] Replace only the existing marked comparison area. Provide five pairs: source PNG and corresponding revised sample (dark/Perennis, Paper/Shop, grid/category or Discover, featured/PDP, newsletter/newsletter), full-size links, fixed-aspect source images and labelled lazy iframes. Preserve earlier watermark/medallion/icon reference material but label it separate from the actual hero designs. Load the reference stylesheet explicitly on the index for comparison wrappers.
- [ ] Run `npm run test:templates`, `node node_modules/typescript/bin/tsc --noEmit -p AURA-eCommerce-Shop-main/tsconfig.json`, `npm run build`, then `npm run check:site`. Require passing commands; do not infer fidelity from tests.
- [ ] At 1440×900, compare sources to revised samples: composition/alignment first, then spacing/type, palette/background layers, framing/buttons. Try installed browser screenshot capture without installing tools; if unavailable, disclose that limit and use loaded-page/DOM geometry plus owner visual review. Check all eight at 375/768/1440px; include 200% zoom, zero overflow, intact interactions and contrast.
- [ ] Verify current homepage source/render hashes, all default renderer hashes, original brand pack SHA-256 `91cb0bb15a49525f44f18d0b29d6f7405b8187dc243b5b230fac0cc8e8dcf0da` (91 files) and a separately captured mockup-folder hash unchanged. Inspect logical git diff for customer output changes versus line-ending noise; never discard user work.
- [ ] Record a self-review and remaining adaptations: real content, retained navigation/status/sidebar, bounded gallery, responsive intrinsic heights and any verified accessibility adjustment. No fresh-context reviewer is permitted under the no-agents instruction.
- [ ] Present `/brand-preview/#dual-surface-review` and the five reference pairs. Request visual approval; leave all work local and uncommitted. Do not apply the variants to live routes.

## Plan Self-Review / Handoff

- All five approved references have an owning task and comparison pair; category/newsletter gaps are covered.
- Optional renderer contracts, helper names, filenames and derivative counts agree across tasks.
- Each new behavior has RED/GREEN checks; default/output/browser checks cover the five Review Focus failures.
- The 2026-11-22 plan is historical and superseded for remaining visual work, not permission to execute old assumptions.
- Owner confirmed this detailed plan and selected inline/current-folder execution. The implementation checkpoint above awaits visual acceptance, not another plan-approval loop.
