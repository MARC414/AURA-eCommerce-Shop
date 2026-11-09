# OPAR brand guidelines — colour, type and components

**Version:** 1.0 · 10 November 2026
**Decision record:** D-032 (exact reference palette)
**Canonical code:** `public/assets/product-pages.css` (`:root`), mirrored in `index.css` and `tailwind.config.js`

This document is the reference for anyone — human or agent — laying out an OPAR
page. It records what the palette *is*, what each colour is allowed to do, and
the measurements behind those rules. Where a rule exists because of a contrast
failure, the measured number is quoted.

---

## 1. The palette

Five colours, sampled pixel-for-pixel from the Moss reference sheet
(`Branding/bf7dca245779961.69b4ce1c2b3d0.webp`) at its four swatches and its own
background. Nothing else is added: every other surface in the system is a stated
mix of two of these.

| Role name on the sheet | Token | Hex | RGB | What it is |
|---|---|---|---|---|
| (background) | `--opar-ground` | `#2F332B` | 47, 51, 43 | Page ground. Deep warm green-grey, hue ≈ 90°, L ≈ 18 %. |
| Main Text | `--opar-text` | `#F4F2EE` | 244, 242, 238 | Primary ink and the "paper" reading ground. |
| Header | `--opar-mist` | `#D0D3C4` | 208, 211, 196 | Secondary ink: nav, body copy, meta, mute. |
| Button | `--opar-cta` | `#9AA66C` | 154, 166, 108 | Primary action fill. The one mid-tone that carries text. |
| Accent | `--opar-accent` | `#55632A` | 85, 99, 42 | Filled badge, ink on light paper. Never text on the ground. |

The four printed hex labels on the reference sheet are a copy-paste placeholder
(all four read `#F3F2EE`). The values above are what the swatches actually
contain, which is why they differ from the labels.

### Measured contrast (WCAG 2.1, relative luminance)

| Pair | Ratio | Verdict |
|---|---|---|
| Main Text on ground | **11.53:1** | AAA |
| Mist on ground | **8.47:1** | AAA |
| Button fill vs ground | **4.94:1** | ✓ UI component (≥ 3:1) |
| Ground ink *inside* the Button fill | **4.94:1** | AA text |
| Accent on ground | **1.97:1** | ✗ never text or a thin line |
| Accent on Main Text (paper) | **5.86:1** | AA |
| Button fill on paper | **2.33:1** | ✗ needs an accent edge — see §5 |

Two rules come straight out of this table:

1. **The accent is a fill, not an ink, on the ground.** It works as a badge
   background holding Main Text (5.86:1). It does not work as 11 px text on
   `#2F332B`.
2. **The Button colour needs an edge on paper.** Against Main Text it is only
   2.33:1, so paper-mode pills carry a 1px accent border to satisfy 1.4.11
   non-text contrast even though the fill is unchanged.

### Derived surfaces (documented mixes only)

No new hue is introduced. Each value is the ground mixed toward Main Text by the
stated percentage, or the ground darkened.

| Token | Hex | Derivation | Use |
|---|---|---|---|
| `--opar-raised` | `#3D4039` | ground + 7 % text | Raised panel on the ground |
| `--opar-well` | `#292D26` | ground − 12 % value | Inset well; the footer |
| `--opar-ground-line` | `#4F524A` | ground + 16 % text | Hairline on the ground |
| `--opar-paper-raised` | `#E2E1DC` | text − 9 % toward ground | Panel on paper |
| `--opar-paper-well` | `#D8D7D3` | text − 14 % | Inset well on paper |
| `--opar-paper-line` | `#CDCCC7` | text − 20 % | Hairline on paper |
| `--opar-paper-body` | `#43463F` | ground + 10 % text | Body ink on paper (8.59:1) |
| `--opar-accent-soft` | `#DDE1CE` | tint of text toward accent | Paper-mode wash only |

Derived edge contrast is decorative (1.17–1.23:1). That is intentional — a
hairline is a rhythm mark, not an information carrier. Nothing may be
communicated by a hairline alone.

---

## 2. Colour roles

| Surface | Ground | Ink | Secondary ink | Hairline |
|---|---|---|---|---|
| Default page (home, shop, product) | `--canvas` `#2F332B` | `--ink` `#F4F2EE` | `--body` `#D0D3C4` | `--line` `#4F524A` |
| Paper page (policies, about, help) | `--paper-canvas` `#F4F2EE` | `--paper-ink` `#2F332B` | `--paper-body` `#43463F` | `--paper-line` `#CDCCC7` |
| Footer | `--footer-canvas` `#292D26` | `#F4F2EE` | `#D0D3C4` | `#4F524A` |

- **The header is transparent.** `.site-header` has no background, so a hero
  photograph runs beneath it and every page opens the way it continues. The
  dropdown panel (`.nav-panel`) *is* opaque `--canvas`, so a menu never shows
  page text through itself.
- **Paper mode is a role swap, not a second palette.** `body.theme-paper`
  reassigns the same variables. Nothing is hard-coded twice.
- **The footer is the well.** Pages close one step darker than they opened.

### What each colour may do

| Colour | May | May not |
|---|---|---|
| Ground `#2F332B` | Page background; ink inside the Button fill; ink on paper | Text on the ground |
| Main Text `#F4F2EE` | Headlines, wordmark, primary ink; paper background | — |
| Mist `#D0D3C4` | Nav, body copy, captions, secondary buttons, focus ring | As a large flat surface behind text |
| Button `#9AA66C` | Primary pill fill, small availability label (4.94:1), status reinforcement | Large background fields; body text on paper |
| Accent `#55632A` | Partner badge fill, ink on paper, paper-mode outlines | Text on the ground (1.97:1); decorative hairlines only |

---

## 3. Typography

Unchanged from the approved system — the reference did not require a new face,
and mixing a third family would weaken the pairing.

- **Display / headings:** Cormorant Garamond (`--serif`). Light to regular
  weights; italic is used for the second line of a display headline.
- **Interface / body:** Manrope (`--sans`). 300–600.
- **Scale:** display `clamp(2.6rem, 3.9vw, 4.05rem)`, h2
  `clamp(1.95rem, 2.7vw, 2.8rem)`, h3 `1.55rem`, body `15px/1.72`, small `13px`,
  caption `12px`, eyebrow `11px` with `.14em` tracking, micro `10px`.
- **Eyebrows** are uppercase Manrope with wide tracking. They are labels, not
  decoration, so they must pass contrast in their own right.
- **Line length** stays inside `--width-text` (640px) for body copy; long
  measures at 15px on a dark ground are tiring.

Small-type hard floor: nothing informational below 10px, and nothing below 11px
in the Button colour.

---

## 4. Layout and rhythm

- Shell `1580px`, page `1100px`, content `760px`, text `640px`.
- Gutter `clamp(20px, 4vw, 48px)`; vertical rhythm on a 4px scale.
- Radii: `0` for tiles, cards, panels and images — the squared edge is the
  editorial signature. `999px` **only** for buttons and count chips.
- Motion: colour 150 ms, lift 250 ms, image 400 ms, `cubic-bezier(.22,.61,.36,1)`.
  All of it is suppressed under `prefers-reduced-motion`.
- Focus: 2px outline in Mist on the ground, Accent on paper, 3px offset. Never
  remove it — nothing else indicates keyboard position.

---

## 5. Components

### Buttons — pills

| Variant | Fill | Ink | Border | Use |
|---|---|---|---|---|
| Primary | `#9AA66C` | `#2F332B` | same as fill | The one action on a surface |
| Primary hover | `#D0D3C4` | `#2F332B` | same | Lifts to mist, not to a new colour |
| Secondary | transparent | `#F4F2EE` | `#D0D3C4` | The alternative action |
| Partner (external) | transparent | `#F4F2EE` | `#D0D3C4` | Leaves the site; disclosed |
| On paper | `#9AA66C` | `#2F332B` | `#55632A` | Same fill, accent edge for 1.4.11 |

- Minimum height 56px, 11px uppercase 600 with `.12em` tracking.
- **One primary pill per surface.** Two equal weights means neither is primary.
- A partner CTA is never the filled pill: the visitor must be able to tell a
  house purchase from an external referral at a glance.

### Cards

Image tile → category eyebrow → serif name → price/availability row → CTA.
The tile is **light paper** (`--paper-canvas`) with `object-contain`, never the
ground: supplier photography is shot on light backgrounds, and a white rectangle
floating in a dark grid is the failure mode this avoids. The tile is a product
photograph slot, so it must not be tinted, keyed or colour-graded to "match" the
palette. See `PRODUCT-IMAGE-GUIDE.md`.

### Badges and status

- House piece: outline badge, Mist text, Button-coloured dot.
- Partner offer: **filled accent** badge with Main Text — the only filled badge,
  so supplier relationships are unmistakable.
- Status chips always carry their meaning in the **word**; colour only
  reinforces. Never rely on hue alone.

---

## 6. Photography direction

- Real photographs only. No supplier marketing composites, no stock, no
  AI-generated product shots presented as the product.
- The hero is the owner's own landscape, graded 15 % toward the ground so the
  picture and the palette behave as one system. Product photography is **not**
  graded — a soap that is actually orange stays orange.
- Anything missing is shown as a labelled placeholder, in words, at the same
  size as the photograph would be. An honest gap beats a borrowed image.
- Text baked into an image is the supplier's wording. It is never repeated in
  OPAR's own copy, and it is never allowed to state a medicinal claim.

---

## 7. Do and don't

**Do**
- Use the five colours and the documented mixes, and nothing else.
- Put text in Main Text or Mist, on the ground or on paper.
- Use the Button colour for the primary action, and only that.
- Keep the pill for buttons; keep everything else square.
- Label every gap, and say "Price on request" when there is no price.

**Don't**
- Don't set small text in the Accent on the ground (1.97:1).
- Don't put the Button fill on paper without the accent edge.
- Don't introduce a sixth colour, a gradient, a gold, or a "premium" neutral.
- Don't tint product photographs to sit inside the palette.
- Don't use two filled pills, or a filled pill for an external referral.
- Don't invent prices, ratings, stock, reviews, certifications or health claims.

---

## 8. Where the values live

| File | Holds |
|---|---|
| `public/assets/product-pages.css` | The canonical token layer for every generated page |
| `index.css` | The same five colours for the React shell, plus hero scrims |
| `tailwind.config.js` | Utility names (`canvas`, `paper`, `body`, `cta`, `accent`, …) |
| `data/brand.json` | The brand contract: colours, logo paths, typography |
| `brand.config.ts` | Typed React view of `data/brand.json` |
| `scripts/derive-brand-marks.ps1` | Emblem ink derivation per ground |

If a hero or scrim needs the ground as an alpha value, write it as
`rgba(47, 51, 43, x)` — the ground at an opacity — not as a new grey.
