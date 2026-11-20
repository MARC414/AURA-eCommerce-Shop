# OPAR — AI Studio build brief v2

**Created:** 2026-11-20
**Owner:** Farhan (OPAR). **Executor:** Google AI Studio, working in `MARC414/AURA-eCommerce-Shop`, branch `main`.
**Status:** ready to execute, one unit at a time.

**Scope:** every page **except the homepage.** The homepage is finished and frozen as of 2026-11-20. It is the reference the rest of the site is built to match — not a work item.

**Note on v1:** an aperture implementation was attempted locally on 2026-11-20 and reverted on the owner's instruction. A second attempt was planned for AI Studio and dropped the same day. **The shaped-window idea is closed (D-045), not deferred.** The image system is a paper mount, described in Phase 1.

---

## How to use this file

Do **one unit per session**. Each unit ends with the gates and a STOP. Do not begin the next unit until the owner says go.

Report after every unit, in this order: what changed and why · gate output · numbers you measured · what you could not verify · assumptions you made · what the owner should look at with their own eyes.

Never batch units. Never "while I'm here".

---

## 0. Ground rules — read before any unit

### 0.1 Context

Read `AGENTS.md`, `.agents/product-marketing.md`, `planning/STATUS.md`, and the newest entries in `planning/DECISIONS.md`. They are authoritative. Where they disagree with this brief, they win — say so instead of choosing silently.

### 0.2 Non-negotiables

- Never invent a product fact: no price, stock, certification, lab result, review, rating, medical or health claim, "organic", "clinically proven", or maker name not already in `data/` or supplied by the owner. Missing facts render as "Price on request", "Not yet verified", "Photograph in preparation".
- No card fields, no payment gateway, no third-party checkout, no analytics, no CDN scripts. No card number, expiry, CVC, PIN, OTP or transaction screenshot is ever collected.
- Never edit generated files: `index.html`, `public/**/index.html`, `public/sitemap.xml`, `public/robots.txt`, `dist/`. Edit sources: `templates/*.mjs`, `data/*.json`, `public/assets/*.css|js`.
- Do not undo the owner's work. Do not re-apply D-041 to D-044. The current neem / moringa / honey-hive placement is the owner's latest.
- No new packages. No changes to `.github`, `_redirects`, `_headers`, or Cloudflare settings.
- Accessibility floor: one `h1` per page, no horizontal overflow at 320/375/414/768/1024/1440/1920, AA contrast measured not guessed, keyboard reachable, works with JavaScript off.

### 0.3 Design system — reuse, do not extend

Ground `#2F332B`, main text `#F4F2EE`, header `#D0D3C4`, button `#9AA66C`, accent `#55632A`, gold `#C5AD70` on the dark ground only. Any other surface is a stated mix of ground and main text. Cormorant Garamond headings, Manrope body. Buttons: one pill system — 56px default, 40px small, 44×44 icon, 11px/600 uppercase, .12em tracking. Tokens only in `public/assets/product-pages.css`; no raw hex inside a component rule.

### 0.4 Gates — run after every unit

```
npm run build          → 41 pages
npm run test:templates → all pass (55 at the start of this work; the count grows as units land — report the before and after numbers)
npm run check:site     → "All checks passed"
```

### 0.5 Commit protocol

One unit = one commit, plain message, no force-push. Push only when the unit's gates pass and the owner has seen the result.

### 0.6 The homepage is the reference, not a target

The homepage is complete and the owner is not working on it now. Nothing in this brief edits it: not `templates/home-page.mjs`, not its markup, not its copy, not its featured mounts, not its herbs.

Every other page is built by **matching** it: open the homepage, take its rhythm — overline and rule, serif heading, one line of plain copy, generous margins, an edge herb, no new colour — and apply that to the pages that are still thin. The homepage is the specimen sheet. The work is the rest of the book.

If a unit appears to need a homepage change, stop and say so. Do not make it.

One consequence, stated plainly so it is not discovered later: nothing on the homepage changes, and nothing needs to. Because there are no shaped windows anywhere, the homepage's featured mounts and the rest of the site already agree — paper, square corners, hairline. The consistency problem solved itself by dropping the shapes.

---

## Phase 1 — The mount system

The recurring defect: a product photo with a flat white background sits on a dark page, so a white rectangle breaks the organic feel. Fix it in the **frame**, not the file, so supplier photos never need retouching.

The homepage already solved this once: `.feature-card__mount` is a paper mount with object-fit and archival corners. That component is the precedent. Extend it — do not design a second one, and do not edit the homepage copy of it.

**No shaped windows. Closed 2026-11-20 (D-045).** Organic silhouettes cut into photographs were designed, implemented and discarded — twice. Nothing in this phase draws a shape, masks a photograph, or clips an image to a path. The reasoning is repeated here so the idea is not reopened a third time: the page already carries one botanical layer, the herbs at the edges, and a second and louder one wrapped around every photograph competes with it and with the type. A product reads best as an object on a sheet, and a sheet has four corners. The organic quality is meant to come from the photograph and the paper, not from the geometry of the window.

### 1.1 — The mount rule

**Goal.** One written rule every product photograph on the site obeys, so no page invents its own treatment.

**Rules.**
- A product image is never placed directly on the dark ground. It sits on the paper mount (`--paper-canvas`), which is already the light role.
- Photograph inside a mount: `mix-blend-mode: multiply`. Flat white becomes the mount colour and the rectangle stops existing. This is the fix that survives real supplier photos, because it works on the file as supplied.
- Provide `[data-blend="none"] > img { mix-blend-mode: normal; }` for any photograph darker than the mount, and state the rule in a CSS comment.
- Square corners. No radius, no shadow, no gradient, no glow. A 1px `--line` ring only where the mount meets the page.
- The mount is a container, not a shape: 4:5 on a card, 1:1 on a thumbnail, and the photograph inside is `object-fit: contain` so the product is never cropped away.

**Done when.** The rule is written in one place in `public/assets/product-pages.css` with a comment explaining why, and a test image with a pure `#FFFFFF` background shows no visible rectangle against the paper at 72px and at 1000px; gates pass.

**STOP.**

### 1.2 — The mount on the shop, room and partner cards

**Goal.** Every card in `/shop/`, the six room pages and `/discover/` uses the same mount, so the grid reads as one collection rather than three.

**Rules.** Extend the existing card component; do not fork it, and do not touch the homepage's featured mounts. Related cards on a product page use the same mount as the grid they came from. The badge and the category line stay exactly where they are today — this unit changes the surface under the photograph, nothing else.

**Done when.** Every card on those pages sits on paper, no white rectangle survives, the grid stays visually even at 375/768/1440, and gates pass.

**STOP.**

### 1.3 — The mount on the product gallery

**Goal.** The gallery is the same window as the cards, at hero scale.

**Rules.** One large mount, up to three thumbnails, all on paper. The large mount holds a fixed 4:5 box so the buy box beside it never jumps as images load. The selected thumbnail keeps a visible selected state. Nothing is hidden behind hover.

**Done when.** Gallery and thumbnails share the mount; keyboard selection still works; no-JS still shows the first image; gates pass.

**STOP.**

### 1.4 — The empty mount

**Goal.** A piece with no photograph looks intentional and honest.

**Rules.** Replace the generic picture icon on an empty mount with a drawn botanical mark for that room (inline SVG, stroke only, accent at 18% opacity) plus the chip "Photograph in preparation". The mark is a line drawing sitting on the plain mount — it is not a mask and it never cuts the mount. No grey box, no stock photo of a different product.

**Done when.** All four current pieces and six placeholders render an honest empty mount; the words appear once, not twice; gates pass.

**STOP.**

### 1.5 — Dummy photography, one per room

**Goal.** Six interchangeable dummy photographs that will be replaced by real ones without a redesign, and that carry the organic quality the frame no longer supplies.

**Generation template — use it verbatim, change only `[OBJECT]`:**

> Studio product photograph of `[OBJECT]`, centred, occupying no more than 60% of the frame width, on a flat `#F4F2EE` backdrop, soft even daylight 5200K, gentle contact shadow directly beneath at 10% opacity, no props, no hands, no text, no labels, no logo, no watermark, no packaging claims, matte finish, no coloured rim light, square 1:1, photorealistic.

**Objects:** herbal botanicals — amber glass jar of root powder with loose capsules; everyday care — unwrapped soap bar; showpieces — carved wooden vessel; yoga & practice — rolled mat with a cork block; art & craft — hand-thrown ceramic bowl; quiet living — folded linen runner with a smooth stone.

**Rules.**
- Backdrop **never pure `#FFFFFF`**; the model must be told `#F4F2EE`.
- Object inside the central 60%, with breathing room on all four sides, so the photograph can be re-cropped later without losing the product.
- The object's own silhouette does the organic work here: leaves, seeds, stone, turned wood, linen. No props, no styling clutter, no second object competing with it.
- Convert to AVIF + WebP + JPG fallback at 1200px and 800px, each ≤120 kB. Commit converted files only; no hotlinks.
- Record `imageSource: "generated-placeholder"` and `rights: "in-house"` in the product data.
- Generate two variants per room, put one in the repo, keep the rejected one out.

**Done when.** Six files exist, each ≤120 kB per format, each object inside the safe area, and the mount shows no white rectangle behind any of them.

**STOP.**

### 1.6 — Image audit

**Goal.** Prove the system holds.

**Done when.** A table is reported: for each of the six rooms and four pieces — mount ratio, file size, rendered box at 375/768/1440, whether any part of the product is cropped, whether any white edge is visible, no horizontal overflow.

**STOP.**

---

## Phase 2 — Edge foliage, one herb per page

### 2.1 — The foliage map

**Goal.** The homepage's botanical language extends to the rest of the site without repeating a picture.

**Rules.** Create `data/foliage.json`: `{ page, asset, corner, rotate, size }`. Exactly one asset per editorial page: `/shop/`, the six rooms, `/discover/`, `/journal/`, `/about/`. Utility pages (cart, checkout, wishlist, account, search, newsletter, order) carry none.

The homepage already carries neem (Rooms), moringa (the letter) and honey hive (the monograph). Those three are the precedent and they stay exactly where they are — they are not inventory to move, rename or re-crop, and the map does not list the homepage. Every page in the list above needs a new asset of its own.

**Done when.** The map exists, the homepage is absent from it, and every listed editorial page resolves to exactly one asset.

**STOP.**

### 2.2 — Seven new cut-outs

**Goal.** Cover the pages that have no herb.

**Rules.** Generate: turmeric leaf, ashwagandha root sprig, black cumin sprig, clove, moringa pod, cardamom, seed-head. Generate each **on the exact band colour** (`#2F332B`) so no alpha keying is needed over a solid band. Use true alpha only for foliage over a photograph. WebP ≤60 kB each, cropped so the stem enters from the page edge.

**Done when.** Seven files committed, each ≤60 kB, each reads as a single herb against its band.

**STOP.**

### 2.3 — Placement and clearance

**Goal.** The herbs frame the pages without ever touching words.

**Rules.** Implement from `data/foliage.json` only. Foliage sits at the page edge, may be clipped by the section, and never crosses a heading, an overline, an eyebrow or body copy. Hidden at and below 860.

**Done when.** Measured at 861/1024/1440/1920: no leaf pixel inside the text box of any heading or paragraph; no horizontal overflow.

**STOP.**

### 2.4 — The no-repeat test

**Goal.** Make the rule permanent.

**Done when.** A test fails if one asset path appears on two pages, if a page declares more than one foliage image, or if a referenced file is missing.

**STOP.**

---

## Phase 3 — Placeholder catalogue

### 3.1 — The placeholder flag

**Goal.** Sample pieces exist without pretending to be offers.

**Rules.** Add `isPlaceholder: true` to the product schema and validate it. A placeholder can never carry a price, a stock figure, a certification, a review or a spec beyond its room and a format word.

**Done when.** Validation rejects a placeholder that carries any of those; gates pass.

**STOP.**

### 3.2 — Six placeholders, beside the four real previews

**Goal.** Every room has one representative piece so the shop, the cart and the PDP can be finished and tested.

**Rules.** One per room. **The four existing preview pieces stay exactly as they are** — nothing owner-made is deleted or renamed. Catalogue, search index, sitemap and room pages stay consistent; the generator already fails on a dead internal link.

**Done when.** Six new pages build, each room shows its placeholder, the four originals are untouched, gates pass.

**STOP.**

### 3.3 — The placeholder state on the page

**Goal.** Nobody mistakes a sample for a product.

**Rules.** A visible banner at the top of `main`: "Sample layout — not a real product. Used to build and test the shop." Ordering disabled. The mount shows the room's botanical mark and "Photograph in preparation".

**Done when.** Banner present on all six, absent on the four real pages; add-to-cart absent or disabled; gates pass.

**STOP.**

---

## Phase 4 — Page skins

Every page in this phase is matched to the homepage, which is the finished specimen: overline + rule, a serif heading, one line of plain copy, generous margins, an edge herb, no new colours. The homepage itself is not touched in this phase or any other.

### 4.1 — `/shop/`
### 4.2 — The six room pages
### 4.3 — `/discover/` (partner pieces; no cart control anywhere)
### 4.4 — `/journal/` (listing only; empty states stay honest)
### 4.5 — `/about/` and `/about/sourcing/`
### 4.6 — Utility pages pass (cart, checkout, wishlist, account, search, newsletter): consistent, quieter, same tokens

**Rules for 4.1–4.6.** One `h1`; the page's own words from `data/pages.json` or `data/collections.json` — do not invent article titles, maker names or promises; no hover motion on anything that is a photograph; no new colour; no new component without a specimen check.

**Done when, per unit.** Gates pass; 375/768/1440 show no overflow and no heading crossed by foliage; the owner has seen it.

**STOP after each.**

---

## Phase 5 — The product detail page

### 5.1 — The hero

**Goal.** The first screen reads like a professional shop.

**Rules.** Two columns from 861px: gallery left (paper mount, one large image, up to three thumbnails), buy box right. Buy box order: room link · `h1` name · one factual line · format/quantity · "Price on request" · variants when they exist · quantity · Add to cart (dropship) or partner CTA (affiliate) · Save to wishlist · one-line delivery note · a three-item verification summary linking down. One `h1`. No card fields. No invented price.

**Done when.** At 375 it stacks without reordering content; at 861+ the two columns align at the top; gates pass.

**STOP.**

### 5.2 — The E-E-A-T layer

**Goal.** Authenticity a customer can check — without inventing a single credential.

**Rules.** Under the hero, in this order, each block able to say "not yet" honestly:

1. **What this is** — plain factual description from `data`.
2. **Provenance** — supplier, SKU, origin region, sourcing route, link to `/about/sourcing/`.
3. **Verification register** — reuse `data/compliance.json`: verified, outstanding, each with its date. Do not duplicate the register.
4. **What OPAR will not claim** — the blocked-claims list for this piece.
5. **Who checked it** — a named role and a date, or literally "Not yet reviewed by a named person". Never a person, credential, testimonial or review that does not exist.
6. **Care, delivery, returns** — inline links to the real policy pages.
7. **Questions** — the contact route and the stated response expectation.
8. **Last updated** — a visible date, repeated in the JSON-LD.

**Done when.** Every block renders in order on all ten pages; no review, rating or credential is fabricated anywhere; gates pass.

**STOP.**

### 5.3 — Structured data and no-JS

**Rules.** `Product` with no `Offer` while the price is null; no `AggregateRating`; no `Review` unless attributable. The page is readable with JavaScript off.

**Done when.** JSON-LD validates, contains no invented field, and the page renders completely without JS.

**STOP.**

---

## Phase 6 — Commerce surfaces

No backend, no server, no third party in this phase.

### 6.1 — Cart
A mounted thumbnail per line, quantity, remove, "On invoice" subtotal when any line is unpriced, honest empty state, one call to action.

### 6.2 — Wishlist
Same mount treatment; removed pieces stay honest.

### 6.3 — Checkout payment preference
Radio groups only, under two labels:

- **International** (seller is the Belgian partner entity): Visa / card payment by secure hosted link sent after the invoice · PayPal · Payoneer · bank transfer / invoice.
- **Bangladesh** (only where a Bangladeshi entity sells under a local licence): bKash · Nagad · bank transfer.

Brand names are words, not logos — the method is named, never implied to be instant. Customer location does not decide the method; the entity that receives the money does, and the two can coexist on the same site.

Copy rule: this site takes no payment; every method is "we will confirm payment with you after the request". No card/wallet logos implying instant checkout. No card or PIN field anywhere in the markup.

### 6.4 — WhatsApp order
`wa.me` link with a prefilled message, on the PDP, the contact page and the footer. Number in `data/site.json` as a placeholder until the owner supplies a business number. Disclose that WhatsApp is a third party and the message leaves the site.

### 6.5 — `/policies/payment/`
Rewrite to match 6.3 and 6.4 exactly. No claim of a gateway that does not exist.

### 6.6 — Order tracking (`/order/`)
Reference field, plus email for verification. For now it reads `aura_order_requests_v1` in this browser and shows date, lines, preferred method and "Request received — awaiting confirmation". Say plainly that it only sees requests made in this browser, because no server exists yet.

Build against a fixed contract so a real endpoint replaces storage without touching the UI: `getOrder(reference, email) -> { reference, date, status, items[], paymentMethod }`. A reference alone is guessable and must never expose a name or address. Add the route to the footer's Client care column and `data/site.json`.

**A domain does not make tracking work. Only a backend does.**

### 6.7 — Admin panel
`admin.html`, local dev only: read-only list of requests — reference, date, items, preferred method — with CSV export. Nothing can be marked paid. Never built, routed or linked from the storefront.

**Done when, per unit.** Gates pass; the flow is walked in the browser with a real click path; no card field exists anywhere; nothing is charged.

**STOP after each.**

---

## Phase 7 — Closing

### 7.1 — Full verification
Run the three gates and report the numbers. Walk the whole path — homepage as the entry point (read-only, unchanged) → room → placeholder PDP → add to cart → cart → checkout → request → `/order/` lookup. Record every width tested, and confirm the homepage diff is empty.

### 7.2 — Memory
Update `planning/STATUS.md` with what shipped and what remains, and add one dated entry to `planning/DECISIONS.md` for the image system, the placeholder policy and the payment wording.

### 7.3 — Handover
List, in plain English, the owner-side facts still missing: prices, real photographs, entity name and country for the imprint, a business WhatsApp number, and the backend decision for live tracking.

---

## Flagged, awaiting an owner decision — do not build without an explicit yes

These were found during the 2026-11-20 review. They are real defects, but they were never approved, so no unit above covers them.

**F1 — Unknown URLs return the homepage with a 200.**
Cloudflare Pages has no `404.html` in the build, so every unknown path (`/nope/`, `/miss.css`) serves the homepage with status 200 instead of 404. That is wrong for crawlers, wrong for anyone who mistypes a URL, and wrong for a shop. The fix is small: one `404.html` page using the existing shell, generated like any other page, plus a `404` response. It touches the deployment surface, so it needs a yes before it is added to Phase 3.

**F2 — Should this work be recorded in memory as it lands?**
`planning/STATUS.md` and `planning/DECISIONS.md` are currently silent on the deployment verification and the image system. Unit 7.2 covers it at the end; it can also be done per phase. Owner's choice.

---

## What this brief does not authorise

- Real payments, a gateway, or any card/wallet data collection.
- Deleting or rewriting owner-authored pages, copy or imagery.
- Force-pushes, branch deletion, or changes to the deployment configuration.
- Inventing reviews, certifications, maker names, or health claims to make a page feel fuller.
- Building a database, adding Supabase/Firebase, or enabling indexing.
