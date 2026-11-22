# OPAR Repair & Preview Implementation Plan

**Superseded for remaining visual work, 2026-11-23:** the owner approved the template-led mapping, mixed PDP and rectangular reference buttons. Preserve completed filtering/preview work as recorded in the ledger. Use `planning/OPAR-TEMPLATE-FIDELITY-PLAN-2026-11-23.md` for the revision; do not execute the old all-Paper assumptions below. Live rollout remains blocked.

> **For agentic workers:** use `executing-plans` inline. No subagents are authorized. Steps use checkboxes for tracking.

**Goal:** fix Shop visual filtering and provide review-only production-faithful Paper/Moss specimens without changing the homepage or live theme mapping.

**Architecture:** preserve default renderer outputs; add optional identity/theme/stylesheet settings only for explicit specimen callers. A separate generator writes web SVG derivatives and full-size sample documents, and updates a marked section of the existing reference page.

**Tech Stack:** existing Node.js, static HTML/CSS/JavaScript, node:test; no new dependencies.

**Spec:** `planning/OPAR-DUAL-SURFACE-DESIGN-2026-11-22.md`.

## Global constraints

- Homepage completely frozen; no signature band, live identity changes or shared-style regressions.
- Original brand-kit files untouched; `/assets/brand/web/` is the separate derived-web path.
- No new dependencies, agents, payment/backend changes, deployment or push.
- Future theme routing is a proposal. This stage changes only Shop hidden-state behavior and review documents.
- Keep default generated HTML identical; samples are noindex and absent from sitemap/search.

## Review focus

- Hidden cards must actually disappear, not merely acquire a `hidden` attribute.
- Empty results must hide the grid, show recovery and reset correctly.
- Optional preview settings must not change the homepage or any default rendered page.
- Paper hero/footer must retain dark-surface text contrast and native controls must match their surface.
- EPS export and sample generation must not alter originals or duplicate document IDs.

### Task 1: Repair Shop visibility

**Files:** modify `AURA-eCommerce-Shop-main/public/assets/product-pages.css`; test `AURA-eCommerce-Shop-main/tests/product-pages.test.mjs` and the browser-rendered Shop.

**Interface:** existing `shop-page.js` sets `hidden`; CSS must honor it on `[data-shop-grid]` and its cards without changing other routes.

- [ ] Add a failing node:test contract asserting the scoped hidden selectors; run the test and confirm failure.
- [ ] Add `[data-shop-grid] .product-card[hidden], [data-shop-grid][hidden] { display: none; }`.
- [ ] Run the suite; browser-check Everyday Care = 3 displayed, Art & Craft + Owner preview = 0, reset = 9.

### Task 2: Preserve defaults; add explicit specimen options

**Files:** modify `templates/chrome.mjs`, `templates/collection-pages.mjs`, `templates/product-page.mjs`, `templates/app-pages.mjs` under `AURA-eCommerce-Shop-main`; add tests and `tests/fixtures/homepage-freeze.json`.

**Interface:** optional document settings `{ theme, identity, stylesheets, bodyClass }` pass through renderer calls. Defaults remain identical. The preview identity has dark/light emblem paths and an explicitly selected icon list.

- [ ] Capture the approved-baseline homepage source and rendered-output hashes; add failing tests for optional identity/style settings and unchanged defaults.
- [ ] Add pass-through options without mutating global brand/site data; provide a separate preview body class and stylesheet only when requested.
- [ ] Test homepage/default-page equality and preview emblem/icon/theme isolation.

### Task 3: Generate selected web assets and sample documents

**Files:** create `templates/brand-preview.mjs`, `scripts/generate-brand-preview.mjs`, `public/assets/brand-preview.css`, derived SVGs under `public/assets/brand/web/`, and `.html` samples under `public/brand-preview/`; add a marked review section to the existing `public/brand-preview/index.html`. All paths under `AURA-eCommerce-Shop-main`.

**Build integration ruling:** `scripts/generate-product-pages.mjs` calls the separate tested preview generator after customer sitemap/search generation, without adding preview entries to either index.

**Interface:** `renderBrandPreviewDocuments(products, pages)` returns named HTML documents and the index-review section; `epsOutlineToSvg(source, color)` returns self-contained paths using the supplied EPS geometry and coordinate flip.

- [ ] Add failing tests for path-only export, preserved originals, six noindex samples, real template controls and valid internal sample links.
- [ ] Implement EPS conversion and the Paper Shop/PDP/Discover/Checkout plus Moss Perennis/Journal samples through production renderers; do not rewrite the original kit.
- [ ] Build the reference area with full-size links, lazy iframes, six orbit panels, medallions and icon matrix; preserve existing reference content outside markers.
- [ ] Generate the selected files and verify deterministic output, metadata, IDs and missing-asset behavior.

### Task 4: Verify and hand over for visual approval

**Files:** update this checklist, `planning/STATUS.md` and `planning/DECISIONS.md`; do not change the live route matrix or brand registry.

- [ ] Run node tests, installed TypeScript, build and built-site checker.
- [ ] Browser-check the live filter repair and samples at 375px and 1440px; measure text/control contrast and zero overflow. State screenshot limits honestly.
- [ ] Verify homepage/default HTML, original kit hashes and live themes unchanged. Inspect diff for accidental customer-route/asset changes.
- [ ] Present `/brand-preview/` for owner visual approval. Leave changes uncommitted; no push/deployment or live theme rollout.
