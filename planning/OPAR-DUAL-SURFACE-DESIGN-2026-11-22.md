# OPAR dual-surface review stage — corrected design

**Date:** 2026-11-22  
**Owner direction:** proceed with the recommended review stage; work in the current folder.  
**Baseline:** `550d6a0`; homepage restriction preserved as D-048.  
**Source review:** `planning/BRAND-DUAL-LAYOUT-REVIEW-2026-11-22.md`.

**Owner correction and approval, 2026-11-23:** the supplied `OPAR-ui-mockup-templates` HTML/PNG compositions govern the revised previews, not merely colours on existing layouts. The owner approved the mixed Paper/Moss PDP, dark newsletter and rectangular reference buttons. The old future surface matrix below is superseded wherever it conflicts with `planning/OPAR-MOCKUP-FIDELITY-REVIEW-2026-11-23.md`; execute only the revised `planning/OPAR-TEMPLATE-FIDELITY-PLAN-2026-11-23.md` after its confirmation. The homepage stays excluded and live rollout still needs visual approval.

## Scope and approaches

Use the existing static HTML templates and semantic CSS tokens. Repair Shop visibility now; use optional, preview-only document settings to show future themes and identity assets through the actual production renderers. Do not clone the navigation or mutate the live brand registry.

This is preferable to a blanket theme rollout, which would change live pages before visual approval, or a new frontend package, which is unnecessary. The owner selected the staged recommendation; the specimen layout below is the builder's concrete implementation of that review stage.

## Homepage is excluded completely

There is **no homepage signature band**. No homepage layout, copy, images, header/footer identity, favicon, scripts or behavior are changed. Default renderer output must remain byte-identical. New preview styles are loaded only by preview documents. The only live CSS addition is scoped to the Shop grid's hidden state.

## Deliverables in this stage

1. Scoped Shop hidden-state repair plus checks for matching counts, rendered cards, zero results and reset.
2. A selected web identity profile for preview only: true path-based ivory/green SVG emblem derivatives from the supplied outlined EPS master, `.ico`, 32px PNG and 180px touch icon. Original files are read, never edited. No installable-app claim or PWA implementation.
3. Review specimens linked from `/brand-preview/`: Warm Paper Shop, PDP, Discover and Checkout; Moss Perennis and Journal desk. Each is rendered by the existing production template and shared shell, with its own document/IDs and an explicit “review only” notice.
4. Plain/5%/10% orbit panels on both grounds, using one unbaked self-contained vector layer so opacity is applied exactly once. Medallion pairing and favicon-size matrix use supplied assets without implying certification.
5. Preserve existing brand-preview content; add a clearly separated review area and links to full-size samples. Samples are noindex, excluded from sitemap/search and not linked from customer pages.

## Future route matrix — proposed, not applied

- **Paper:** Shop, six rooms, Discover, all PDPs, Cart, Wishlist, Checkout, Account, Order, Search; practical About/Sourcing/Help/Policies, Contact, Imprint, Newsletter and 404.
- **Moss:** Perennis/Books/Music, Journal hub/desks.
- **Homepage:** completely frozen, not included in this rollout.
- **Footer:** retains a separately scoped dark ground on both themes.

## Specimen requirements

- Keep the existing Shop studio hero; scope its text/breadcrumb tokens independently as dark over photography on the Paper sample.
- Paper controls use light native schemes and distinguishable borders/focus states. Keep original palette and product mounts; no new silhouette masks or image cutouts.
- Preview uses the actual shared header/footer, product cards, filters and accordions. Isolate documents in lazy-loaded iframes and offer full-size links; do not duplicate IDs in one document.
- Decorative orbit/medallions carry no interaction or verification meaning. All compared text uses identical sizes and widths.
- Existing public source packs are not broadly moved/deleted in this step. Derived web assets live separately under `/assets/brand/web/`; a deployment-source cleanup remains separately reviewable.

## Acceptance

- Shop rendered count matches the displayed count for room and zero-result combinations; reset restores all nine Shop cards.
- Existing default HTML, especially homepage output and source, stays unchanged; live `brand.json` and route themes stay unchanged.
- Six full-size samples are functional, noindex and unlisted; shared rendering is used and the original asset hashes remain unchanged.
- Correct plain/5%/10% comparison, readable Paper controls and dark hero/footer; no overflow at mobile and desktop widths.
- Tests, TypeScript, build and site checker pass; browser verification is reported separately from screenshot availability.
- Stop for owner visual approval before any live route-theme or identity rollout. No push or deployment.
