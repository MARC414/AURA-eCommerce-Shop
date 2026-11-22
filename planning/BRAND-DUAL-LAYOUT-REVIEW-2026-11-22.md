# OPAR brand assets & dual-layout plan — review

**Date:** 2026-11-22  
**Scope:** Owner-pasted integration plan; latest `origin/main` at `550d6a0`; supplied brand pack; locally served review snapshot.  
**Verdict:** Good two-surface direction, but **do not implement as written**. Resolve the homepage contradiction, fix the existing Shop visibility defect, correct asset descriptions and specify actual route/component contracts first.

## Repository and review state

- Workspace `main` remains at `2b4d5f1`, four commits behind the fetched remote. Local planning changes and untracked owner assets were preserved; no merge, reset, push or deployment was performed.
- Inspected and built an isolated snapshot at `C:/Users/HP/AppData/Local/Temp/opencode/opar-review-550d6a0-20261122`.
- Remote already contains the Shop studio hero, editorial sidebar, PDP caps and hub-cutout removal. The dual-surface brand integration has not been implemented.
- Remote and local both use **D-047 for different entries**: local records the homepage freeze; remote records executed Shop/PDP work. Reconcile both histories without deleting either correction before synchronizing the planning files.
- The latest commit removed `AURA-eCommerce-Shop-main/brand-preview/index.html`, a duplicate outside `public/`. It did **not** remove the served `public/brand-preview/index.html`; `/brand-preview/` returned 200 during review.
- “Live” here means a local preview of the remote snapshot, not a verified public deployment.

## Blocker: the homepage preservation guarantee contradicts the signature band

The owner explicitly prohibited homepage additions. Inserting a full-width Warm Paper interlude changes the homepage flow, length and composition even if existing sections retain their markup. “Additive only” does not satisfy that restriction.

**Required plan correction:** remove the signature band from the overview, design section, Decision 3, architecture diagram and stylesheet scope. Preview the medallion/watermark treatment on `/brand-preview/` instead. Do not change homepage copy to “Honest Objects · Free Knowledge”; library access/pricing remains an open owner decision.

The same conflict applies to changing homepage header/footer marks and HTML-head icons via the shared shell. A future explicit owner exception could allow identity-only changes; this review grants no such permission. Until then preserve `/`, including indirect shared CSS/script/chrome effects.

## Confirmed implementation finding

### High — Shop filters count matching cards but do not visually hide the others

**Category:** Functional correctness. **Confidence:** High.  
**Locations at `550d6a0`:** `AURA-eCommerce-Shop-main/public/assets/shop-page.js:114-131`; `AURA-eCommerce-Shop-main/public/assets/product-pages.css:410-412`.

The script sets `card.hidden = !show`, but `.product-card { display: flex; }` overrides the visual effect of the browser's hidden rule. `.product-cards { display: grid; }` similarly needs a hidden-state rule for the zero-result grid.

**Browser reproduction:** choose Everyday Care. Count becomes “Showing 3 of 9 pieces”; six cards have `hidden`, but all nine still have rendered height and `display: flex`. A temporary, Shop-scoped browser-only rule reduced rendered cards to three and reduced an Art & Craft + Owner preview selection to zero. The temporary rule was removed; no source file was edited.

**Proposed repair, not applied:**

```css
[data-shop-grid] .product-card[hidden],
[data-shop-grid][hidden] {
  display: none;
}
```

Add browser regression checks for **rendered visibility**, counts and the zero-results panel. The 63 passing template tests do not catch this defect. Fix this before judging the new Paper filter workspace.

## Asset findings and corrections

### The proposed header SVGs are self-contained, but not vector artwork

In the pack's `opar-mark-main.svg`, `opar-lockup-main.svg` and `opar-wordmark-main.svg`, inspection found **one embedded PNG image and zero path nodes each**. Their source dimensions are respectively 596×596, 145×34 and 94×23. The wrapper does not create extra detail or unlimited vector sharpness. The emblem can still be suitable at small header sizes; the small lockup/wordmark raster needs careful size/DPR review.

`OPAR-brand-assets/README.md:19-20` explicitly describes raster geometry/SVG wrappers. True outlined `*-vector-press.eps` files also exist. If genuine vector web marks are required, export **derived** path-based SVGs from those masters while preserving the original kit. Otherwise describe the chosen assets accurately as self-contained raster SVG wrappers.

### The external-resource concern is valid, but a missing curve is not necessarily a blank box

`opar-section-bg-wide-paper.svg` and `...-ground.svg` refer to sibling `opar-mark-main.svg`. SVG image contexts restrict external resources; self-contained rendered backgrounds avoid that dependency. The Paper wrapper still paints its base rectangle if the emblem reference fails, so the failure can appear as an absent watermark rather than a broken image.

Source: [MDN — SVG as an image, restrictions](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image#restrictions).

### Watermark intensity must be specified once

The wrapper already sets orbit opacity to **0.055**; the rendered PNGs already contain a faint curve. Applying another 5% opacity to that artwork compounds the attenuation. Never reduce opacity on the section containing text and controls.

For the comparator, use actual 5%/10% derived artwork or one unbaked decorative layer. Specify crop, position and size separately for Paper and Moss. Keep the orbit away from product mounts and form-control boundaries. Decorative medallions are brand devices, not verification/certification seals.

### Publish only the assets the site actually uses

Latest snapshot `public/` contains **263 files**, approximately **20.8 MiB**. The two public brand/mockup directories contain **111 files / 8.36 MiB**, including **10 EPS sources, 10 prototype HTML files and 10 preview PNGs**. `scripts/copy-site.mjs:55` copies every file in `public/` to `dist/`, regardless of Git tracking status.

Those files are deployment contents, not all automatic page-download costs. Nevertheless, source masters, marketing prototypes and references should stay outside the published asset tree unless deliberately approved for hosting. Keep one canonical web-asset path; remote uses `/assets/OPAR-brand-assets/`, while another local copy exists at `/assets/brand/OPAR-brand-assets/`. Do not broadly delete the owner's originals.

## Actual route state versus proposed state

| Route group | Latest site now | Proposed plan |
|---|---|---|
| Homepage | Moss (`theme-home`) | Preserve completely; no signature band |
| Shop, category rooms, PDPs, Discover | Moss | Warm Paper |
| Cart, Wishlist, Checkout, Account, Order, Search | Warm Paper | Warm Paper |
| About, Sourcing, Help, practical policies | Warm Paper | Warm Paper recommendation |
| Perennis, Books, Music | Warm Paper | Moss |
| Journal hub | Moss | Moss |
| Journal desks | Warm Paper | Moss |

The current broad rule at `templates/app-pages.mjs:235` makes Perennis and Journal desks Paper. Replace it with an explicit, testable route-theme contract rather than deriving appearance from loosely overlapping content flags. Explicitly settle Contact, Imprint, Newsletter and 404 too.

`data/brand.json` still references the older PNG marks and 128px tile. `templates/chrome.mjs:233-234` still emits the old 128px favicon/touch icon; the new kit is not wired simply because its files were uploaded.

## Component and accessibility review

- **Strong direction:** Paper shopping surfaces with a bounded dark Shop hero, Moss cultural routes, and an explicitly dark footer. Theme-aware semantic tokens are preferable to blanket overrides.
- **Hero protection:** current `.shop-hero__lede` uses `--ink` and metadata uses `--body`. A Paper route flip would make these dark over a dark photograph. Give the hero its own dark token scope, including breadcrumb, overline, title and metadata—not just the H1.
- **Footer protection:** a permanently dark footer needs its own dark semantic scope on Paper pages; global body token changes must not recolour its text, links, focus states or borders as Paper controls.
- **Paper controls:** update sort's hard-coded `color-scheme: dark`, selectors, selected states, radio accent, empty results, partner actions, badges and evidence accordions. Keep product images uncropped and do not double-tint studio backgrounds with multiply.
- **Computed solid-colour text pairs:** `#55632A` on `#F4F2EE` = **5.86:1**; `#43463F` on Paper = **8.59:1**; `#2F332B` on Paper = **11.53:1**. These confirm the quoted text ratios only, not whole-page accessibility.
- **Control boundaries:** `#CDCCC7` on Paper = **1.44:1**; `#E2E1DC` on Paper = **1.17:1**. Suitable as restrained decorative separations, but not the sole visual identifier of an input or meaningful control. Use a stronger control border/focus ring where required.
- **Icons:** production head needs a deliberately selected favicon/touch-icon set, not an indiscriminate list of all eight exports. Demonstrate all sizes in the specimen page. 192/512 app icons alone do not establish an installable app; manifest/PWA behavior is separate scope.
- **Preview:** use the production component/token contracts, not approximate duplicate headers. Keep comparator text size/width identical, account for reduced motion and decorative-image semantics, and prevent duplicated IDs in header specimens.

## Fresh verification

- Isolated snapshot: **63/63 template tests passed**, `npm run build` succeeded, and `npm run check:site` passed (**49 routes, 263 files, 48 sitemap entries**).
- Browser fetched 16 representative routes successfully with one H1 each; confirmed actual themes and old icon/header references.
- Browser geometry checks on Shop, aloe PDP, Perennis and one Journal desk at **375 and 1440px**: eight cases, zero horizontal overflow. PDP mount measured **320×400** at 375px and **520×650** at 1440px. Shop hero measured about **410px / 540px** respectively.
- Shop console had no reported errors, despite the reproduced visibility defect.
- Homepage template, generated homepage HTML, shared chrome and brand metadata have no changes between local baseline and latest remote. This is source evidence, not a pixel-perfect old/new screenshot comparison.
- Screenshot capture was unavailable because the desktop tab was not visibly displayed. No complete visual/contrast/browser-matrix audit or public deployment verification is claimed.
- The four earlier checkout/privacy/configuration findings are not resolved by this brand plan; their affected files were not changed by the latest four commits. See `planning/STOREFRONT-REVIEW-2026-11-21.md`.

## Recommended approval boundary

Keep the dual-surface direction, but remove all homepage changes. First fix Shop visibility and choose canonical web assets; then review production-faithful Paper/Moss specimens at `/brand-preview/`. Approve measured specimens and the complete route matrix before rolling out non-homepage themes. Original brand-kit files remain untouched. This is a review recommendation, not permission to implement, deploy or resolve the local/remote planning-history conflict.
