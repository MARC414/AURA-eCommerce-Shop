# OPAR logo asset pack

Prepared from the confirmed screenshot supplied by the owner and aligned to the repository's approved brand contract. Existing site code and existing source assets were not changed.

## Confirmed identity

- Brand: OPAR
- Wordmark: OPAR
- Lockup source: `source-confirmed-screenshot.png` (original user-provided screenshot copied without modification)
- Approved palette: Main Text `#F4F2EE`, Ground `#2F332B`, Mist/Header `#D0D3C4`, Button `#9AA66C`, Accent `#55632A`; the repository also documents Gold `#C5AD70` for limited interaction details.
- Approved heading type in the repository: Cormorant Garamond. Body: Manrope.

## Included

- Transparent confirmed lockup PNG, isolated confirmed wordmark PNG, and isolated high-resolution emblem PNG.
- Transparent palette colorways for lockup, wordmark, and emblem.
- Production mark sizes from 16px through 1024px and lockup exports preserving the confirmed ratio.
- `favicon.ico` plus PNG favicon sizes 16px through 512px using the approved Ground tile and Main Text emblem.
- EPS masters for Main Text and Ground lockups, wordmark, and emblem. These use transparent PostScript image-mask encoding so the supplied geometry is retained rather than re-typeset or redrawn.
- SVG wrappers for web use, preserving the same transparent raster geometry.

## Usage guidance

Use the transparent lockup for header/brand placements. Use `opar-mark-main.svg` or `opar-mark-main-*.png` for square contexts. Use the favicon assets for browser/app icon contexts only. Do not place the Accent as small text on the Ground; follow `docs/BRAND-GUIDELINES.md`.

## Large-format and environmental graphics

The `*-transparent-main-600.png`, `1200.png`, and `2400.png` exports are large transparent production files for headers, social crops, packaging mockups, and print comps. The `opar-section-bg-*` files are oversized, low-opacity circular emblem fields for editorial sections; use them behind content, never as a replacement for the primary logo. The medallions are decorative circular brand devices for section openers, story pages, or quiet callout panels.

## Print / press

Files ending in `vector-press.eps` are the scalable outlined masters for press handoff. The earlier EPS files remain in the pack as geometry-preserving image-mask references. For professional press, place the vector EPS into the printer's CMYK workflow and request the printer's required bleed and color-profile conversion; the supplied brand values are specified as RGB hex because they are the repository's canonical digital palette.
