# Implementation Plan: Floating Botanicals, Environmental Habitats & Interactive Button System

Staging the complete floating botanical experience with authentic environmental backgrounds, alternating corner foliage, and purposeful **T7 button placements** in `/brand-preview/`.

---

## 1. Intentional Button Placements (Strict T7 Button System Compliance)

In accordance with **T7 (Settled Button System)** and brand rules:
- Buttons use the signature **999px pill** shape with `--cta: #9AA66C` green fill and ground ink on dark surfaces.
- **Never an invented square button or gold fill on primary actions.**
- Every botanical section and ecosystem pillar receives a purposeful action to guide the visitor smoothly from contemplation into the store and library:

| Section | Button Placement | Button Style | Destination Route | Action Label |
| :--- | :--- | :--- | :--- | :--- |
| **Black Seed Spread** | Below phytochemical text | `.button .button-secondary .button-small` | `/shop/herbal-botanicals/` | `View Herbal Botanicals &rarr;` |
| **Ashwagandha Spread** | Below rasayana text | `.button .button-primary .button-small` | `/shop/ashwagandha-with-black-pepper/` | `Explore Ashwagandha Piece &rarr;` |
| **Turmeric Spread** | Below golden hearth text | `.button .button-secondary .button-small` | `/shop/turmeric-cleansing-soap/` | `View Cleansing Soap &rarr;` |
| **Sustenance Canvas** | Lower-right overlay | `.button .button-primary` | `/shop/herbal-botanicals/` | `Enter Botanical Apothecary &rarr;` |
| **Pillar I (Sustenance)** | Bottom of pillar | `.button .button-secondary .button-small` | `/shop/herbal-botanicals/` | `Browse Whole Foods` |
| **Pillar II (Movement)** | Bottom of pillar | `.button .button-secondary .button-small` | `/shop/yoga-practice/` | `Somatic Practice Tools` |
| **Pillar III (Stillness)** | Bottom of pillar | `.button .button-secondary .button-small` | `/shop/quiet-living/` | `Quiet Living Pieces` |
| **Pillar IV (Wisdom)** | Bottom of pillar | `.button .button-primary .button-small` | `/perennis/books/` | `Read Perennis Library &rarr;` |

---

## 2. Real Botanical Imagery & True Pod Generation

1. **True Nigella sativa Pod & Seed Bursting (`black-seed-pod-bursting.jpg`):**
   - Ripe, papery horned seed capsule of *Nigella sativa* bursting open with real matte black angular seeds spilling out onto a slate fragment.
2. **Environmental Arid Habitat (`black-seed-env-arid.jpg`):**
   - Sun-drenched Mediterranean / Middle Eastern terra-cotta soil, dry stone walls, and wild blue Nigella wildflowers.
3. **Sub-Himalayan Ashwagandha Habitat (`ashwagandha-env-forest.jpg`):**
   - Misty mountain forest floor with deep green Withania shrubs, damp bark, and moss.
4. **Turmeric Polished Ritual Background (`turmeric-env-ritual.jpg`):**
   - Warm ambient golden glow, ceramic mortar, and hands polished with natural golden turmeric paste.
5. **Moringa Canopy Environment (`moringa-env-canopy.jpg`):**
   - Sun-dappled Moringa oleifera tree canopy against an early morning sky.

---

## 3. Spatial Architecture: Zero Cards, Floating Freedom

- **No Enclosing Card Frames:** The botanical specimens float freely on the canvas with gentle organic drop-shadows.
- **Split Environmental Stage:**
  - One flank features the rich environmental habitat photo under a calibrated dark moss scrim (`rgba(47, 51, 43, 0.72)`) guaranteeing crisp WCAG AA contrast (6.2:1+).
  - The opposite flank hosts the free-floating botanical specimen alongside the ultra-concise editorial copy and the dedicated T7 action pill.
- **Alternating Living Corner Foliage:**
  - Section 1 (Black Seed): Top-Right feathery Nigella sprig.
  - Section 2 (Ashwagandha): Top-Left Withania leaf cluster.
  - Section 3 (Turmeric): Top-Right broad Curcuma tropical leaf.
  - Section 4 (Moringa/Neem): Bottom-Left Neem branch and flowering Moringa.

---

## 4. Execution & Safety Verification
1. Generate the required photographic stills and environmental plates.
2. Update `/brand-preview/index.html` with the floating split layouts, buttons, and alternating foliage.
3. Run `npm run test:templates` to ensure all 54 tests pass.
4. Run `npm run check:site` to verify build integrity.
5. Live review at `http://localhost:3000/brand-preview/#editorial-botanicals`.
