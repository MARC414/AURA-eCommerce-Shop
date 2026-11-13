# AURA — Homepage design review and 360° plan

**2026-11-13 · REVIEW ONLY.** The only change made this round is the removal of the morning light, which the owner ordered. Nothing else in this file is implemented. Hero untouched.

---

## 1. What was reviewed, and with which skills

**Measured in the running page** (`http://127.0.0.1:3000/`) at 320, 360, 390, 414, 761, 768, 800, 860, 1024, 1440 and 1920 px, with sized same-origin iframes, real layout, real fonts, and canvas sampling of the decoded background photographs under the real scrims. Screenshots remain unavailable; every claim below is numeric or computed.

**Skills used, and why this stage:**

| Skill | What it contributed here |
|---|---|
| `ui-ux-pro-max` | Layout, responsive, touch-target and contrast rules; 4.5:1 normal text, 24px WCAG target floor / 44px best practice. Its Python search CLI is unavailable on this machine, so its local data tables were read directly. |
| `design-system` | Token discipline, component states, the one-pill rule, no raw hex, no new surface without a semantic token. |
| `brand` | Palette lock (D-032), gold budget (D-034), photography rule (food only), identity consistency across bands. |
| `cro` | Homepage path, value proposition, price transparency, secondary capture, trust without review stars. |
| `site-architecture` | 4 sections / 6 rooms / 3 journal categories, 3-click depth, no orphan pages, where the newsletter belongs. |

**Deliberately not used yet:** `ab-testing` and `analytics` (no traffic, no measurement), `seo-page` / `schema` / `launch` (pre-launch, no indexable public site), `paywalls` / `signup` (not this page). `copy-editing` applies only after the new card and newsletter copy is drafted.

---

## 2. Verdict

The page is structurally sound: no horizontal overflow at any width, one `h1`, the header switches cleanly, the mobile menu fits a 320×568 phone, all text clears 4.5:1, and the hero is unchanged. It does **not** yet work as a selling homepage, for reasons that are mostly missing content and missing assets, not broken layout:

1. No price, stock or shipping exists on any piece. Owner-side.
2. The rooms have no images, so the section reads as a text list.
3. The product cards have no product-specific one-liner; the line under the name is a status message.
4. There is no newsletter section on the homepage.
5. The neem leaf still sits in the monograph; the sunrise-crimson ground does not exist as an asset.

---

## 3. Findings

### P0 — owner blockers (no design fix will close these)

- **Every price is `null`**; every card says "Price on request". The page cannot transact.
- **Shipping, stock and returns terms are not decided.**
- **The newsletter is browser-local.** `newsletter-page.js` writes to `localStorage` and sends nothing; the status text says so. A homepage form is honest only while that copy remains.
- **No sunrise-crimson long shot exists in the repo** (`assets/brand`, `assets/botanicals`, `src/assets/images` checked). It must be supplied or licensed before the Materia Medica ground can change.

### P1 — the requested design work

| # | Finding | Evidence |
|---|---|---|
| 1 | **Rooms have no images.** `data/collections.json` has no `image` field, and `.room-index` renders text only. The requested circles need six category images plus a data field. | `collections.json` fields: slug, label, eyebrow, heading, intro, description, matches. |
| 2 | **Cards lack a product one-liner.** The current line is "Preview · ordering not open" / "Seen at … · referral pending" — a status, not a description. `tagline` exists but is generic on two pieces ("A small addition to the everyday"). | `templates/home-page.mjs` `featureCard()`; `data/pilot-products.json`. |
| 3 | **No newsletter on the homepage.** The only form lives on opt-in content pages (`app-pages.mjs` `newsletterSection()`). | `templates/app-pages.mjs:87`; `public/assets/newsletter-page.js`. |
| 4 | **Neem leaf is in the monograph header**, top-right, above "The materia medica". It should settle in Rooms. | `home-page.mjs:233`; `.corner-foliage--neem-tr`. |
| 5 | **Materia Medica has no sunrise-crimson ground.** The three plates each use a habitat photograph; a single section-wide ground would be hidden behind them. | `monograph()` and `.editorial-spread` rules. |
| 6 | **Feature grid at 761–1024 is three cards of 209–288px.** At 768 every product name wraps to two lines. Adding a descriptor and a format line will make it tighter. | Measured: 768 → 3×209; 1024 → 3×288. |

### P2 — consistency and polish

- **Journal index jumps 1 → 3 columns at 761**, while the monograph spreads stay single-column until 859. At 768 the three journal columns are 212/193/211px; the lines are 12.5px. Align the journal to the spread breakpoint: one column ≤860, three above.
- **Small buttons are 40px tall**, below the 44px best practice (they still pass the 24px WCAG floor). Utility icon links are 28–37×44; at 320 the wordmark is a 26×26 emblem. All pass 24px; none reach 44px in both axes.
- **Journal description lines are 12.5px.** Readable at 6.89:1, but small for a category index. 13.5px would match the overlay paragraph.

### P3 — measured, no action

- `.archipelago-scrim` is 100vw wide inside a scrollbar viewport, so it overhangs 7px on each side. It is clipped and flat-coloured; invisible.
- The turmeric corner leaf extends ~4px past the viewport at several widths; the plate clips it by design.
- Only the visually-hidden labels report `scrollWidth > clientWidth`; no visible text clips at any width.
- Mobile menu: 209px closed, 410px with Journal open at 320×568; fits without scrolling.
- No page overflow at any tested width (scrollWidth equals the client width; the −15px reading is the scrollbar).

---

## 4. Scrim under the monograph text

**Current** (`.spread-scrim`, 90deg / 270deg):

```
0% .97 · 32% .95 · 52% .88 · 68% .42 · 87% .10 · 100% 0
```

Canvas sampling of the real photographs behind every text block, 25×15 grid per block, at 390/768/1024/1440/1920:

- **Worst current contrast: 6.45:1** (1440px, `.editorial-spread__science` body text).
- Quote text 9.3–10.1:1; italic 7.9–8.9:1; heritage 9.2–10.2:1.
- Journal/archipelago text: worst 6.89:1 (overlay paragraph), overline 7.28:1, index line 7.66–8.24:1.

So the current scrim is **not a legibility defect**. Increasing it is an aesthetic choice: it quietens the photograph behind the words.

**Proposed "a little more"** — a minimal lift on the word side only:

```
0% .97 · 32% .96 · 52% .90 · 68% .46 · 87% .11 · 100% 0
```

Mobile (≤859, 180deg): `.97 / 44% .95 / 70% .64 / 100% .19`.

**Measured result of the proposal:** worst **6.77:1** at 1440 (from 6.45), 6.97 at 1024, 7.33 at 768. The specimen side (87–100%) is effectively unchanged. This is the smallest change that is actually visible; a jump to .94 at 52% would flatten the photograph and is not recommended.

**Status: PROPOSED, not applied.**

---

## 5. Product-card pattern — what the leading shops actually do

Checked live on 2026-11-13:

- **OSEA Malibu** (premium skincare, Shopify): image · stars + review count · name · **one-line benefit** ("Top anti-aging hydration") · **size selector** · price ("$108", ranges "$20 – $84") · "Add to bag" · occasional award/"New"/"Save" badges. Source: `oseamalibu.com/collections/all`.
- **FRAMA** (Copenhagen, home/furniture): image · name · **one-line variant/finish** ("Stainless Steel | D27 / W80") · price. No stars, no descriptor paragraph, no listing CTA. Source: `framacph.com/collections/all`.
- Aesop, COS and Arket returned 403/Cloudflare today; they are **not** cited as verified.

**The pattern that fits OPAR:** four lines, no stars, no badges.

1. Name (serif).
2. One factual line — what the piece is, in the supplier's confirmed terms (5–9 words).
3. Format / size — "100 g bar", "60 capsules", "pack of 1, 3 or 5".
4. Price — or "Price on request" until the owner sets one.

Keep one link (the name) plus the quiet "View piece" text link. Do not add "Add to bag" while ordering is closed. Do not add review stars: with no sales, they would be invented social proof. The substitute is provenance — supplier, origin, verification state — which the piece pages already carry.

**Data change required:** add a `cardLine` and a `format` field per product (or derive `format` from confirmed specifications). Do not use the current generic `tagline` for cards 1–2.

---

## 6. The 360° plan

### Phase 0 — done this round

- [x] Remove the morning light (markup, CSS, stacking rules).
- [x] Build 41 pages, `check:site` clean, no `sunlight` reference.
- [x] Record the reversal in D-038 and the unlit contrast values in `STATUS.md`.

### Phase 1 — approve the design decisions (no code)

1. **Neem position.** Recommended: bottom-right of Rooms, cropped by the section edge, with a reserved bottom band; hidden ≤860. Alternative: not in Rooms, removed entirely.
2. **Sunrise ground.** Recommended: the monograph **header band** only, behind "The materia medica" and its note; the three habitat plates stay. A section-wide ground would either be hidden or force the plates out.
3. **Newsletter position.** Recommended: between Rooms and the Monograph. Alternative: after the Journal (weakens the closing statement).
4. **Card content.** Approve the four-line pattern and the `cardLine`/`format` fields; price remains owner-side.
5. **Room circles.** Approve six images and the circular mask; no ring or a 1px `--line` ring.
6. **Grid.** Approve features 1 → 2 → 3 columns at 761 / 1101, matching Rooms.

### Phase 2 — assets and data (gates)

- **Sunrise-crimson long shot:** 21:9 or 16:9, ≥2400px wide, crimson sky + dark land silhouette, no sun disc, no text. AVIF/WebP/JPG, target ≤180kB AVIF. Supplied or licensed by the owner; record the licence.
- **Six room images:** one per collection, 1:1 crop, ≥800px, food/botanical/object photography consistent with the current rule. Until supplied, the item stays text-only rather than showing an empty circle.
- **`data/collections.json`:** add `image` and `imageAlt`.
- **`data/pilot-products.json`:** add `cardLine` and `format`, each traceable to a confirmed supplier fact; use "format not confirmed" where it is not.
- **Newsletter:** decide whether it stays browser-local (honest preview) or connects to a provider. No provider is configured today; the local form must keep saying so.

### Phase 3 — implementation order (one build per step)

**3.1 Rooms: circles + neem** — one section, one visual pass.
- Markup order inside the link: number/arrow → circle → `h3` → `p`.
- Circle: 1:1, `border-radius: 50%`, `object-fit: cover`, `width: clamp(88px, 12vw, 132px)`, no hover transform.
- Neem: move the `<img>` out of `monograph()` into `rooms()`; `bottom: -32px; right: -24px; width: clamp(180px, 20vw, 260px); transform: rotate(12deg); opacity: .55; mix-blend-mode: screen`; `.home-rooms` gets `padding-bottom: clamp(120px, 14vw, 180px)` at ≥861; hidden ≤860.
- Acceptance: no leaf/text intersection at 861/1024/1440/1920; no overflow; last room paragraph contrast unchanged.

**3.2 Featured: card content + 2-column band**
- Replace `.feature-card__meta` with `cardLine`, add `format` above the price, keep the status on the piece page.
- Grid: 1 col ≤760, 2 cols 761–1100, 3 cols ≥1101.
- No stars, no badges, no hover, no add-to-cart.
- Acceptance: at 768 two cards of ~326px, names one line where possible; at 1440 three of ~422px; no clipping.

**3.3 Newsletter: one band between Rooms and Monograph**
- Reuse `newsletterSection()` markup and `/assets/newsletter-page.js`; add the script to the homepage `documentPage` call.
- Solid ground, shell, overline + 24px rule, serif heading, one sentence, email field + pill, status, remove link, one privacy sentence.
- No card, no radius, no photograph; the page has enough photographic bands.
- Form stacks below 480; 44px targets.
- Acceptance: submit saves locally and says so; no network request; keyboard and screen-reader status works.

**3.4 Monograph: sunrise header**
- Add the long shot as the ground of `.botanical-monograph__header` only; keep the three plates and the archipelago unchanged.
- Scrim direction chosen against the actual crop; measure heading/note at 320–1920; ≥4.5:1 body, ≥3:1 display.
- Acceptance: the three plates still read as three grounds; the sunrise is visible only in the header band; no overflow; no new palette token.

**3.5 Scrim lift (only if approved)**
- Apply the stops in §4; re-measure the same blocks at 390/768/1024/1440/1920; keep ≥4.5:1.
- Acceptance: worst ≥6.7:1; specimen edge unchanged.

**3.6 Responsive and accessibility pass**
- Re-run 320/360/390/414/761/768/860/1024/1440/1920: overflow, text clipping, touch targets, menu at 320×568, journal stacking, new circles/neem/newsletter.
- Keyboard: skip link, menu Escape, form status, focus order through the new sections.
- Reduced motion: no new motion was added, so only the existing rule applies.

### Phase 4 — Journal listing template (separate approval)

- `/journal/` becomes the listing; the three category pages list their own pieces.
- Article data model, list item, empty state, pagination only when needed.
- No invented articles, dates, counts or authors. The homepage index does not change when the listing ships.

### Phase 5 — launch blockers (owner-side)

- Price, shipping, stock, returns, seller identity, domain/hosting.
- Real product photography; the six room images; the sunrise licence.
- Herbal evidence review before enabling orders.
- Newsletter provider, if the form is to do more than save locally.

---

## 7. What must not change

- The hero, in any way.
- The five-colour palette, the gold budget, the one gold word.
- No review stars, no invented reviews, no invented stock or delivery promises.
- No hover motion on photographs or cards.
- No cards, radii, shadows or borders on the monograph plates.
- The three-plate monograph and the journal frame (no invented articles).

---

## 8. Open owner decisions

**Resolved 2026-11-13.** The owner approved all seven answers; implementation and measurements are recorded in **D-040**. The questions are kept below with their outcomes.

1. Neem: bottom-right Rooms (recommended), or remove it? - **Bottom-right Rooms.** 160-220px, rotated -12deg, hidden at and below 860; 0 bright-pixel hits on room text.
2. Sunrise: header band only (recommended), or replace the three plate grounds? - **Header band only.** A dormant slot (`MONOGRAPH_GROUND = null`) until a licensed long shot is supplied.
3. Newsletter: Rooms→Monograph (recommended), or after the Journal? - **Between Rooms and Monograph.** Browser-local form; status speaks only after save or remove.
4. Card line: approve factual `cardLine` + `format`, with price still pending? - **Approved.** Added to all four products; price still reads "Price on request".
5. Room circles: which six images, and ring or no ring? - **One hairline ring (`--line`), data-driven.** The six photographs are still owner-side; rooms render text-only until `image` is set.
6. Grid: features 1→2→3 at 761/1101 (recommended)? - **Approved.** 1 column, 2 at 761, 3 at 1101.
7. Scrim: apply the §4 lift (6.45 → 6.77:1), or leave it? - **Applied.** Desktop and single-column ramps replaced; measured 6.73-7.47:1 across 390-1920.

**Revised the same day (D-041):** the owner moved the neem to the top-left of the Materia Medica header and the letter to after the Journal, before the footer. Answers 2-7 stand.

**Corrected again 2026-11-14 (D-042):** the owner rejected the header leaf. The neem is now a transparent cutout on a zero-height bridge between Rooms and the Materia Medica, growing out of the Rooms padding with its tip on the "Editorial monograph" overline; the letter stays after the Journal. Answers 2-7 stand.

**Corrected again the same day (D-043):** the bridge is removed. The neem now uses the moringa's gesture - bottom-left of Rooms, cropped by the section edge, rotated, growing in from outside the page. The letter stays after the Journal. Answers 2-7 stand.

**Moved again the same day (D-044):** the owner asked for the neem over the Rooms heading, not at the section foot. The neem is now the top-left canopy: larger than the moringa (1.12-1.25x), cropped 70-73px at the left and 90-150px at the top, with the actual opaque tip 22-30px above the overline. The moringa stays at the foot of the Journal. Answers 2-7 stand; the two-anchor rule is unchanged.

