# OPAR product image guide

**Version:** 1.0 · 10 November 2026
**Applies to:** every image inside a product tile (card), product gallery, cart
and checkout thumbnail, in both the effective static pages and the React shell.

This guide answers three questions in order: what the layout requires, what can
be done to an image, and what the files currently in the repository actually are.

---

## 1. The layout the image must survive

| Property | Value | Why |
|---|---|---|
| Frame | **4:5 portrait** (`aspect-ratio: 4/5`) | Tall enough for bottles and bars; consistent card heights |
| Fit | **`object-fit: contain`** | The whole product must be visible; cropping a bar to a square loses an edge |
| Padding | **~20px** inside the tile | Keeps the object off the frame edge so it reads as an object, not a bleed |
| Tile background | **`--paper-canvas` `#F4F2EE`** | Light surface under a product; never the dark ground |
| Hover | `scale(1.03)` over 400ms | Slight push in; the frame itself never moves |
| Corner radius | **0** | Squared tiles are the editorial signature |
| Caption | Always present under or over the tile | Says whether it is a supplier photo, an OPAR photo, or a placeholder |

Consequences of that spec, in plain terms:

- **The image is never cropped by the layout.** Whatever you supply is shown
  whole, letterboxed inside the 4:5 frame. So the *file's own* background is
  what the visitor sees, not the tile colour.
- **The file should therefore be roughly 4:5 or square.** A 16:9 landscape image
  will letterbox with wide bands. A square image letterboxes only slightly.
- **A white or very light background is correct here.** It merges with the
  `#F4F2EE` tile. A dark, saturated or busy background is the problem case: it
  becomes a visible rectangle inside the frame.

Recommended supply:

| Item | Target |
|---|---|
| Aspect | 4:5 portrait preferred; square acceptable |
| Long edge | 1200 px minimum, 2000 px ideal |
| Format | JPEG (photographs) or SVG (illustrations/placeholders) |
| Colour | sRGB, 8-bit |
| Weight | ≤ 250 KB per tile image after compression |
| Background | Plain, light, seamless — ideally near `#F4F2EE` |
| Text in image | **None.** No prices, badges, claims, or "SALE" overlays |
| Subject | The actual item in the actual packaging OPAR ships |

---

## 2. What can be done — and what cannot

### Yes, doable with the files we have

1. **Placement and framing.** Any image can be shown `contain`-ed, centred, with
   consistent padding. This is already implemented and is why the tiles behave
   predictably.
2. **Compression and resizing.** Re-encoding to sRGB JPEG/WebP at the target
   long edge, with a quality setting that lands under 250 KB, loses nothing at
   display size. This is a build-time operation, not a design change.
3. **Light-background normalisation.** If a photo already has a plain light
   background, its edges can be levelled to near-`#F4F2EE` with a subtle tone
   curve so the tile looks seamless. This only works when the background is
   already close and evenly lit.
4. **Cropping to 4:5.** Crop from a larger original, provided the crop does not
   remove the product. Safe for lifestyle shots; risky for tight product shots.
5. **Fixing an image that is too dark or too warm** with a gentle white-balance
   correction — as long as the product's own colour stays true.

### No — not honestly, not from these files

1. **Removing a supplier's marketing layout is not "editing", it is fabrication.**
   The aloe file is a designed composite: brand header, a 260 px
   "ALOE VERA SOAP" headline, an "Anti-Acne · Oil Control · Brighten" pill, and
   an "Olive Oil" seal. Cropping any of that out leaves a fragment of the design,
   not a product photo.
2. **Background removal / cut-out is not viable here.** Cut-out needs a clean,
   evenly lit subject against a plain background. These are composites with
   drop shadows, reflections, props and gradients; a naive key would leave a
   halo, and a hand mask is a re-composition, not a correction. Even a perfect
   cut-out would then sit on `#F4F2EE` as a floating object with no ground
   contact — it usually reads *worse*, not better.
3. **Colour-keying to "match the palette" is not allowed.** Tinting a photograph
   of an orange turmeric bar toward the brand green misrepresents the product.
   Product photography stays true to the item; only the *hero* photograph is
   graded, because it is atmosphere rather than evidence.
4. **Inventing a missing view.** One photo of the front of a bar cannot become a
   back-label photo, an open-pack photo, or a size comparison.
5. **AI generation presented as the product** is not acceptable. If a synthetic
   image is ever used, it must be labelled as an illustration, at the same size
   and prominence as a real photo would be.

### The honest rule

If an image cannot be shown truthfully at 4:5, on a light tile, without claim
wording, it is **withheld** and replaced by `photography-pending.svg` with a
caption that says so. An honest gap is a design element; a borrowed or altered
photo is a liability.

---

## 3. How the current files measure up

| File | Pixels | Weight | What it is | Verdict |
|---|---|---|---|---|
| `aliexpress-turmeric-soap.jpg` | 1000 × 1000 | 206 KB | A real photograph: a hand holding the wrapped bar, pale grey studio background. The pack label reads "turmeric & kojic soap / BRIGHTENING SOAP" — that is the supplier's printed label, not an overlay. | **Usable as a reference photo.** Slightly soft for a 4:5 tile at 2×. Caption names the label as the supplier's. Owner photography replaces it at launch. |
| `aliexpress-aloe-soap.jpg` | 1600 × 1600 | 524 KB | A marketing composite: brand header, oversized headline, "Anti-Acne · Oil Control · Brighten" pill, "Olive Oil" seal, two bars on a green lifestyle background. The label repeats "Anti-Acne". | **Withheld.** "Anti-acne" is a medicinal claim; publishing the pixels contradicts the no-claim rule. Its `sourceImageUrl` is kept in `pilot-products.json` as provenance; the listing shows the placeholder. |
| `cleansing-pads-placeholder.svg` | vector | 2 KB | An editorial illustration of a jar and pads, clearly not the CJ product. | **Correct as-is** for a partner offer whose photography is not licensed. Labelled "Illustration only". |
| `photography-pending.svg` | vector | 1 KB | Neutral 1000 × 1000 placeholder: an outlined frame, a mountain glyph, "A closer look, soon". | **Correct as-is.** Used wherever a photograph is missing. |

Note: `aliexpress-aloe-soap.jpg` stays on disk unreferenced, so the decision can
be reversed without re-downloading. It must not be re-linked until the owner
either obtains permission-independent photography or accepts supplier artwork
carrying that wording.

---

## 4. Instruction for whoever supplies the next image

1. Photograph the **actual item** OPAR will ship — same packaging, same size.
2. Plain light background (white, off-white or light stone). No props that could
   be mistaken for contents.
3. Shoot **portrait or square**, product filling roughly 80 % of the frame.
4. No text, badges, watermarks or logos added in post. A label that is genuinely
   printed on the pack is fine — it is part of the product.
5. Export sRGB, 1200–2000 px on the long edge, under 250 KB.
6. Place the file in `public/assets/products/` with a descriptive lowercase name.
7. Point `images[0].src` at it in `data/pilot-products.json`, give it a caption
   that says it is an OPAR photograph, remove `isPlaceholder`, and regenerate:
   `npm run build`.

If any of 1–4 cannot be met, ship the placeholder instead. The layout is built to
make that look intentional, not broken.
