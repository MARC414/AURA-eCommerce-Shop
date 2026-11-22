# OPAR UI mockup fidelity — correction and source mapping

**Date:** 2026-11-23  
**Status:** Owner approved the template-led mapping on 2026-11-23. Preview revision only; live rollout still requires visual approval.  
**Owner correction:** use the supplied OPAR UI mockup templates as the visual references for appropriate pages and sections, especially colour and backgrounds. The existing homepage remains frozen.

## Honest assessment

The six current dual-surface specimens are **not faithful implementations of the supplied mockup layouts**. They reuse the existing production page structures with theme/identity overrides. Passing technical tests does not establish visual fidelity. Keep the verified Shop filtering repair; do not treat the current specimens as approved design matches.

## Inspected references

Source folder: `AURA-eCommerce-Shop-main/public/assets/OPAR-ui-mockup-templates/`.

The alternate copy at `public/assets/brand/OPAR-ui-mockup-templates/` has the same five HTML files after normalizing line endings. There is no content-version disagreement between the copies. All five supplied 1440×900 PNG previews were visually inspected alongside their source HTML.

| Template | Source visual treatment | Current mismatch | Approved preview destination |
|---|---|---|---|
| `01-homepage-hero-dark.html` | Moss ground; supplied ground orbit background; a separate oversized ivory orbit mark at 14%; left-aligned serif headline | Moss reading samples currently use ordinary prose headings, not this hero composition | Perennis and Journal opening sections; **not the homepage** |
| `02-homepage-hero-paper.html` | Warm Paper ground; supplied Paper orbit background; dark-green display type; restrained outlined action | Paper Shop sample still contains the existing dark photographic hero | Shop hero and suitable commerce collection openers |
| `03-product-card-grid.html` | Paper page; complete hairline-framed cards; `#E2E1DC` image wells; inset metadata; green category tabs | Existing cards have no complete outer frame; wells remain `#F4F2EE`; metadata has top-only padding | Shop/category/Discover result cards, retaining the functional sidebar |
| `04-featured-product-card.html` | Paper visual pane beside Moss details; approximately 54:46 split; large serif title and sage action | Current PDP sample makes both panes Paper and retains the old buy-box composition | PDP opening/featured-piece composition, with existing gallery caps and commerce controls |
| `05-newsletter-cta.html` | Moss-tinted supplied Button-ground artwork; 76% dark shade; oversized mark at 16%; spacious left-aligned form | No matching newsletter specimen has been implemented | `/newsletter/` and explicitly approved non-homepage newsletter sections; **not the frozen homepage Letter** |

## Measured differences at a 1440px viewport

- Paper reference hero: **812px** region, **84px** headline, **75.6px** line-height, **88px** left text inset. Current Paper Shop: **540px**, **56.16px**, **62.90px**, **48px** inset.
- Reference navigation: **88px** height. Current samples measured **93px** in this comparison; they do not reproduce the reference lockup scale/spacing.
- Reference cards: **1px whole-card border**, `#E2E1DC` photo well, metadata padding **18px 18px 20px**. Current cards: **0px whole-card border**, `#F4F2EE` well, metadata padding **23px 0 0**.
- Featured-product reference: **Moss details pane** and **Paper visual pane**, with a **72px** headline. Current PDP specimen: uniform Paper treatment and the existing **56.16px** headline.

The base palette matches; component backgrounds, image treatment, visual hierarchy, typography scale, spacing and framing do not yet match.

## Background and colour authority

Use the actual template artwork and layering as the reference, rather than substituting the new comparison mask or guessing another opacity:

- Dark hero: `assets/section-bg-ground.png`, background layer opacity `.78`, the source directional scrim, separate `assets/opar-mark-main.png` at `.14`.
- Paper hero: `assets/section-bg-paper.png`, background layer opacity `.78`, separate source mark at `.10`; preserve the very restrained appearance seen in the supplied PNG.
- Product grid: `#F4F2EE` page/card, `#E2E1DC` image well, `#CDCCC7` card hairline, `#2F332B` primary ink, `#43463F` secondary copy and `#55632A` category accents.
- Featured detail: `#F4F2EE` visual pane and `#2F332B` details pane, ivory/mist type, `#9AA66C` action.
- Newsletter: `assets/section-bg-button.png`, dark shade `.76`, separate mark `.16`.

The owner approved rectangular outlined/filled actions on the revised non-homepage previews and the mixed Paper/Moss PDP, replacing the earlier blanket all-Paper commerce proposal. The homepage's existing button treatment must remain untouched.

## Faithful design does not mean copying prototype defects

- The samples hard-code a 1440×900 canvas and use `overflow: hidden` plus absolute positioning. Reproduce desktop composition, but build fluid layouts with real mobile behavior; do not clip usable pages to a poster-sized viewport.
- `04-featured-product-card.html` references missing `assets/opar-mark-ground.png` in both copies. Its generic `.visual img` rule also overrides the intended small `.product-mark` dimensions. Fix the derived implementation using the real supplied mark and explicit sizing; do not reproduce a broken image or alter the originals.
- Use actual product names, facts, construction pricing and honest availability. Do not copy sample prices, “Limited edit” or stock implications as commercial facts.
- Keep the owner's smaller PDP gallery limits. The reference's 812px visual pane is not permission to reintroduce oversized product images.
- Keep product photographs uncropped (`object-fit: contain`) inside the reference's rectilinear well. Scene/hero artwork may use cover where appropriate; do not cut products to silhouettes.
- Keep real navigation destinations, accessible controls and existing cart/wishlist behavior. The mockups' spans, placeholder heart character and decorative form are not working interface components.
- Use the declared Cormorant/Manrope brand typography consistently rather than depending on accidental system-font fallback.

## Approaches and approval question

**Recommended:** let each source template govern its matching non-homepage composition, including the Paper/Moss PDP split and the dark newsletter treatment. Preserve the Shop sidebar and working data/controls. Show source preview and revised implementation side by side before rollout.

**Alternative:** retain the earlier uniformly Paper commerce rule and only borrow reference details. This intentionally departs from template 04 and cannot be called an exact template match.

**Owner approval:** “Approve” confirms the recommended source-to-page mapping, mixed PDP, dark newsletter and rectangular reference buttons. It authorizes revising the previews, not changing customer routes, committing, pushing or deploying. Inline execution in the current folder remains the selected method, without agents or installations. Implementation plan: `planning/OPAR-TEMPLATE-FIDELITY-PLAN-2026-11-23.md`.
