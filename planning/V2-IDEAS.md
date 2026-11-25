# OPAR V2 — Recorded Creative Upgrades (Pending Owner Discussion)

**Recorded:** 2026-11-25  
**Scope:** Preview-only ideas for `/v2/` keeping the current dual-world (Moss Nocturne + Warm Paper) V2 architecture intact. None of these are active approvals until discussed and selected by the owner.

## Creative Ideas to Elevate V2

1. **Specimen Loupe Modal on Product Folios (`/v2/shop/<item>/`)**
   - Add a restrained `"Inspect plate ↗"` trigger in the corner of the `4:5` mount that opens a clean Warm Paper `<dialog>` lightbox displaying the full-resolution image alongside its exact image-rights/source caption. Shoppers get close inspection without sticky-scroll overlap.

2. **Room Header Drawer Inside the Filtered Shop Archive (`/v2/shop/`)**
   - When a visitor selects a Room filter (*Everyday Care*, *Herbal Botanicals*, *Quiet Living*, etc.), reveal a crisp 1-row Room Introduction Strip directly above the product cards pairing that room's `80px` circular studio medallion with its curated 1-sentence room note—making digital filtering feel like stepping into a physical shelf room.

3. **Full 3-Plate Botanical Atlas on V2 Homepage (`/v2/`)**
   - Currently `/v2/` renders only the Ashwagandha spread in the lower monograph (`#botanicals`), whereas the live homepage features all three spreads (*Nigella sativa*, *Withania somnifera*, *Curcuma longa*). Restoring the Nigella and Turmeric editorial spreads in V2—with the active chapter indicator (`01 · Objects`, `02 · Rooms`, `03 · Materia Medica`) updating along the right edge as you scroll—completes the Night Canopy botanical atlas.

4. **Inline Compliance Audit Drawer + Product FAQs on V2 PDPs**
   - V2 PDPs currently show the 3-line Live Evidence Meter and the 2-column Claims Ledger, but omit the per-item compliance audit notes (`compliance.json`) and each product's 3 `faq` Q&As (`pilot-products.json`). Adding an expandable **"Full Verification File & Questions"** `<details>` band below the two-column ledger exposes every source check, pack measurement note, and factual answer without crowding above the fold.

5. **Inline "Bag Bridge" After Adding an Item**
   - Clicking `"Add to bag"` currently updates `"1 selected."` and the top-bar count. Rendering an immediate inline confirmation strip inside `.purchase-panel` (`"Saved to inquiry bag · Review Bag → | Issue Proforma →"`) gives buyers an effortless two-step path straight into the printable Proforma Inquiry Sheet.

6. **Fine-Press Navigation & Gold Reading Hairline in Perennis & Journal (`/v2/perennis/*`, `/v2/journal/*`)**
   - Add a `1px` antique-gold scroll reading progress rule beneath the Moss Threshold bar on long reading pages, plus a compact Roman-numeral chapter jump strip (`I · II · III`) at the top of `.v2-finepress` so essays and book sections feel like a bound cloth edition.

7. **Production SEO & Speed Pass (When Promoting V2)**
   - Port canonical links, OpenGraph/Twitter tags, `Product` / `BreadcrumbList` JSON-LD, hero AVIF preloading, and WebP-optimized medallion derivatives (`opar-medallion-*-1200.png` and `section-bg-*.png` currently weigh most of the asset budget) so V2 launches with strong Core Web Vitals.
