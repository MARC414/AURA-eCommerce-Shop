# OPAR brand assets

Five colours only: ground `#2F332B`, Main Text `#F4F2EE`, Header `#D0D3C4`,
Button `#9AA66C`, Accent `#55632A` (D-032). The emblem exists in two inks because
one raster cannot sit on both the ground and the paper.

- `opar-seed-orbit.jpg` — the file as supplied: cream Seed + Orbit mark on a solid
  `#003926` plate. Kept as the source for re-derivation; the site does not
  reference it.
- `opar-seed-orbit-on-dark.png` — transparent emblem inked Main Text `#F4F2EE`.
  Used on the ground (static header, footer, React navbar and footer).
- `opar-seed-orbit-on-light.png` — transparent emblem inked the ground `#2F332B`.
  Used on `theme-paper` pages, where a light mark would vanish.
- `opar-mark-tile-128.png` — 128 px tab / app icon: the mark in `#F4F2EE` on the
  `#2F332B` ground. An icon needs a container colour; that is the one place a
  plate is correct.
- `hero-opar.jpg` — the owner's OPAR landscape (2000×1333), the homepage hero.

Regenerate the three derived PNGs with `scripts/derive-brand-marks.ps1`. The plate
is removed by alpha un-matte, not colour keying, so edges stay clean at any size.
Mark geometry is untouched; only the ink colour changes per ground.

`/assets/brand/opar-seed-orbit.svg` stays reserved for the final vector emblem
(`logo.approvedAssetPath`). When it arrives, point `assetPathOnDark` and
`assetPathOnLight` at it and regenerate the tile.

The palette, its contrast measurements and the component rules live in
`docs/BRAND-GUIDELINES.md`; image rules live in `docs/PRODUCT-IMAGE-GUIDE.md`; a
rendered reference is at `/brand-preview/` (noindex).
