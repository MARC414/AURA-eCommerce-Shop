# AURA - Site Architecture Proposal

**Version:** v1
**Date:** 2026-11-09
**Status:** PROPOSAL. No implementation authority. Nothing in the storefront has been changed by this document.
**Supersedes:** nothing. Extends `planning/ROADMAP.md` (10-step outline) with the page map, the state decision, and the build order.

Read with: `.agents/product-marketing.md`, `planning/STATUS.md`, `planning/DECISIONS.md` (D-021 to D-023), `planning/SKILLS-PLAYBOOK.md`.

---

## 0. Owner inputs recorded before writing this

| Input | Date | Status |
|---|---|---|
| Static-first (HTML/CSS/JS) if it is SEO- and Google-friendly | 2026-11-09 | **Owner preference.** Conditional on confirmation, which section 1 gives. Recorded as D-023. |
| One menu and one footer across the whole site | 2026-11-09 | **Owner decision.** Current site has three different chromes (React homepage, `/shop/`, `/discover/`). |
| Duplicates are not wanted | 2026-11-09 | **Owner decision.** Applied to the `product-detail.*` set (D-022) and the two build configs. |
| AI Studio must keep working on this project | 2026-11-09 | **Hard constraint.** Section 7 is the compatibility contract. |

---

## 1. Is static-first genuinely better for SEO and Google?

**Yes - for a catalogue-and-content site like AURA - and it is the lower-risk option.** The reasoning is narrower than "static is better than React", so it is worth stating exactly.

Google does not score a technology. It crawls the HTML response, finds links in `<a href>`, then renders JavaScript in a second queue and indexes what it sees. Two consequences matter here:

- Pages whose content only exists after JavaScript are rendered later, sometimes much later, and **"not all bots can run JavaScript"** (Google, [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)). Pre-rendering is still recommended by Google for exactly this reason.
- A page returned with a non-`200` status, or carrying `noindex`, may never be rendered at all. Static files make correct status codes and per-page metadata trivial; a client-side router makes them awkward - Google even documents "soft 404" workarounds for SPAs.

What static HTML/CSS/JS gives AURA specifically:

| Advantage | Why it matters here |
|---|---|
| Content is in the source | Every product page already does this. No rendering queue uncertainty. |
| Per-page `<title>`, description, canonical, JSON-LD | Already implemented in generated pages; a SPA has to inject them, and Google warns about JS-injected canonicals. |
| Correct HTTP status per page | Real 404 for dead product URLs instead of a client-side fallback. |
| Small, fast pages | No framework hydration. Directly improves LCP/INP, which the current Unsplash hero and Tailwind CDN are already hurting. |
| No JS failure mode | If a script fails, the product information is still readable. Material for a claims-sensitive site. |
| Matches the owner's stack preference | HTML/CSS/JS first, progressively enhanced. |
| Cheap hosting | Files only. No server needed for the catalogue. |

What static does **not** fix - stated plainly so it is not oversold:

- Content quality, differentiation, and internal linking still decide ranking. Static only removes technical friction.
- A cart cannot be static. State has to live in JS plus storage, and orders need a server later.
- Static pages can still be slow if images are 500 KB. The image pipeline is separate work.
- Static does not create trust, claims evidence, or policies.

**Conclusion:** static-first is correct for pages; the parts that must be dynamic (cart, order request, admin) stay as small, explicit islands. That is the distinction that makes the rest of this document coherent.

---

## 2. The decision that actually blocks progress (#3): where does cart state live?

Today the site is two products wearing one brand:

- `/` - React SPA (`App.tsx`) with a real cart in React state persisted to `localStorage` under `aura_cart_v1`.
- `/shop/...`, `/discover/...` - generated static HTML whose only JS (`product-pages.js`) shows a preview quantity and states "Ordering remains closed". **No cart, no continuity.**

A visitor can add an item on the homepage and the cart disappears the moment they open a product page. No styling work fixes this.

### Options

| | A. React-first SPA | B. Static-first + JS islands **(recommended)** | C. Prerendered React (SSG) |
|---|---|---|---|
| Per-page HTML | Weak (empty shell) | **Full** | Good |
| Cart continuity | Native | **Requires one shared module** | Native |
| CWV | Framework cost | **Lowest** | Medium |
| AI Studio compatibility | **Full** | Keeps shell + islands | Partial (build step changes) |
| Effort | Low now, high later | **Medium, staged** | High |
| Matches owner's HTML preference | No | **Yes** | Partly |
| Risk | SEO/architecture debt | Low | Build complexity, config churn |

### Recommendation: B

Concretely:

1. One shared cart module (`public/assets/cart.js`) that reads/writes the **same** storage key `aura_cart_v1` and the same item shape as `services/commerce.ts`.
2. Generated product pages get a real "add to cart" control that calls that module and renders a count in the header - only for `purchaseOwner: 'aura'`. Affiliate pages keep no cart control (D-013).
3. The React app imports the same module instead of owning cart logic in `App.tsx`. One implementation, two consumers.
4. Cart and checkout remain local-only until a server exists. No payment, no order submission, no change to `paymentStatus` rules.
5. Order submission, inventory, and payment are server functions **when they exist**. Static delivery is not the same as static commerce.

**Why not C:** it would be the best of both, but it requires changing the build config that AI Studio depends on. The owner's constraint outranks the marginal gain.

**Why not A:** it keeps the SEO debt and contradicts the owner's stated preference, while making every future page a React page - which is the thing Google's rendering queue penalises most.

### Acceptance test for B

- Add to cart on `/shop/turmeric-cleansing-soap/`, navigate to `/`, cart count persists; change quantity in the drawer, return to the product page, count matches.
- Affiliate pages still show no cart control, verified by the template test.
- With JavaScript disabled, every page still shows full product information and an honest "cart unavailable" state.

---

## 3. One menu, one footer

**Cause:** two independent implementations - `components/Navbar.tsx` / `Footer.tsx` and a `site-header` / `site-footer` written into `templates/product-pages.mjs`. They also link to different things: React shows a Categories dropdown, cart, wishlist, admin; the generated header shows Shop / Discover / Preview index plus a "Development preview" badge; the generated footer has three links while the React footer has four columns, a newsletter, and policy modals.

**Fix:** one data contract, two renderers.

`data/site.json`:

```
brand      { name, descriptor, homeHref }
nav        [{ label, href, children[] (optional) }]
utility    { search, wishlist, cart, account }  // capability flags
footer     { columns: [{ heading, links: [{ label, href }] }], legal: [...], note }
status     { preview: true|false, label }
```

Rules:

1. The generator reads `site.json`; the React `Navbar`/`Footer` read the same file at build time. Neither hard-codes a link.
2. **Never ship a nav link to a page that does not exist.** This is why Library/Journal/About are currently absent - the correct fix is to add the section and its nav entry in the same change, not to add a dead link.
3. `Preview index` leaves the production nav and moves to `/preview/` (`noindex`, not in sitemap).
4. The "Development preview" badge is driven by `site.status.preview`, so launch is a data change, not a code change across seven files.
5. Every footer link that is currently a modal (`privacy`, `terms`, `shipping`, `refund`, `faq`) becomes a real URL. Modals cannot be linked, shared, cited, or indexed.

**Global navigation — decided structure (owner: "the menu shouldn't be crowded"):**

Four top-level items, plus utility. Depth goes into submenus, not into the bar.

```
Shop ▾        Perennis ▾        Journal        About ▾        |  Search  Wishlist  Cart
```

| Item | Panel contents |
|---|---|
| **Shop** ▾ | Two labelled columns. *Sold by AURA*: All products + the six categories. *Sold by partners*: Discover - partner offers, marked "external checkout". |
| **Perennis** ▾ | All books · All music · About the library |
| **Journal** | A plain link until at least three topic pages exist; it becomes a dropdown then, not before. |
| **About** ▾ | Our story · Sourcing & makers · Contact · Help & FAQ · Policies |

Rules that keep it from crowding again:

1. **Maximum 4 top-level items** (5 only if a section has no natural parent). Discover stays inside the Shop panel with its own labelled column until the partner catalogue exceeds roughly six items; then it earns a top-level slot.
2. **Dropdown only where depth exists.** Journal is a link today. A dropdown with one item is worse than no dropdown.
3. **Never a third level.** Panel → link. No nested flyouts.
4. Every panel item must resolve to a real page. Panels are generated from `site.json`, so an unpublished section cannot appear.
5. Interaction: hover to open on pointer devices, `focus-within` for keyboards, tap to open on touch, `Escape` closes, `aria-expanded` on the trigger, visible focus ring. One panel open at a time.
6. Mobile: a single full-screen sheet, accordion groups in the same order, utility actions pinned at the bottom. No hover dependence.
7. `Preview index` leaves the production nav and moves to `/preview/` (`noindex`, not in sitemap).
8. The "Development preview" badge is driven by `site.status.preview`, so launch is a data change rather than an edit across seven files.
9. Every footer link that is currently a modal (`privacy`, `terms`, `shipping`, `refund`, `faq`) becomes a real URL. Modals cannot be linked, shared, cited, or indexed.

---

## 4. Route map

| Area | Routes | Template | Notes |
|---|---|---|---|
| Home | `/` | app shell | existing React page, cleanup pending (claims) |
| Shop | `/shop/` | collection | AURA sells; cart allowed |
| Shop category | `/shop/<category>/` | collection | Herbal Botanicals, Cleansing & Skin, Sound & Instruments, Art & Craft, Quiet Living, Yoga & Practice |
| Shop product | `/shop/<product>/` | dropshipping | price, variants, delivery, compliance block |
| Discover | `/discover/` | collection | partner sells; no cart |
| Discover product | `/discover/<product>/` | affiliate | disclosure, token, `rel="sponsored noopener noreferrer"` |
| Library | `/perennis/` | collection | rights status must be visible |
| Book | `/perennis/books/<book>/` | book detail | edition, territory, rights evidence |
| Reader | `/perennis/books/<book>/read/` | reader | only for cleared editions |
| Journal | `/journal/` | collection | original writing |
| Article | `/journal/<slug>/` | article | byline, date, sources |
| Topic | `/journal/topic/<topic>/` | collection | optional |
| About | `/about/` | page | brand, sourcing philosophy |
| Contact | `/contact/` | page | real form or email, no fake SLA |
| Help | `/help/` + `/help/shipping/`, `returns/`, `payments/`, `faq/` | page | must state what is *not yet* available |
| Policies | `/policies/privacy/`, `terms/`, `cookies/`, `shipping/`, `returns/`, `accessibility/`, `affiliate-disclosure/`, `health-disclaimer/`, `imprint/` | page | URL, not modal |
| Search | `/search/?q=` | results | static index + client filter |
| Cart | `/cart/` | app island | shared module |
| Checkout | `/checkout/` | app island | request-only until gateway |
| Order status | `/order/<reference>/` | app island | after a server exists |
| Newsletter | `/newsletter/confirm/`, `/unsubscribe/` | page | honest local-only state |
| System | `/404`, `/500`, `/sitemap.xml`, `/robots.txt` | - | real status codes |
| Dev | `/preview/` (`noindex`) | index | replaces "Preview index" in nav |
| Admin | `/admin/` | app island | local-preview only |

---

## 5. Full-shop capability checklist

"Everything a real shop has" is listed below, but filtered against AURA's rules: nothing is added that must be faked to exist.

| # | Capability | Current | Phase |
|---|---|---|---|
| 1 | Catalogue + PDP (variants, availability, compliance block) | partial - 4 products, no options, no prices | P2 |
| 2 | Category pages + filters | missing | P2 |
| 3 | Site-wide search | missing | P2 |
| 4 | Cross-page cart | broken by design | P1 |
| 5 | Order request → invoice → lookup | local prototype | P3 |
| 6 | Payment | blocked, no gateway | later |
| 7 | Shipping rules per destination | undecided | P3 |
| 8 | Returns/refund process | modal text only | P5 |
| 9 | Transactional email | not connected | P3 |
| 10 | Analytics + consent | not connected | P6 |
| 11 | Legal/trust pages as URLs | modals only | P5 |
| 12 | Accessibility statement + WCAG 2.2 AA pass | missing | P5 |
| 13 | Admin/ops (orders, catalogue, compliance) | local prototype | keep |
| 14 | Journal + library reader | missing | P4 |
| 15 | Support (FAQ, contact, concierge) | concierge only | P4 |
| 16 | 404/500 + search-no-results | missing | P5 |
| 17 | Image pipeline + performance budget | supplier JPEGs 200-524 KB | P6 |
| 18 | One design system across renderers | two CSS systems | P1 |

**Deliberately excluded, now and probably always:** fake review counts, urgency timers, stock scarcity, "as seen in" badges, invented certifications, delivery promises, multi-currency without a settlement plan, accounts without an order need, and any book reader for an edition whose rights are not established.

---

## 6. Build order (one phase at a time, each leaving a working site)

| Phase | Work | Exit gate | SKILLS-PLAYBOOK phase |
|---|---|---|---|
| **P0** | Truth hygiene: remove fabricated catalogue/claims, false `Store` schema, placeholder GSC token | banned-claim scan clean; 30/30 tests | A0 |
| **P1** | Chrome + state foundation: `data/site.json`, `tokens.css`, shared `cart.js`, one nav/footer in both renderers | cart survives page navigation; one nav, one footer; zero visual diff | A2 + A3 |
| **P2** | Catalogue: categories, filters, search, PDP completeness | every product reachable in ≤2 clicks; search returns real results | A3 |
| **P3** | Commerce: order request, invoice, lookup, notifications | a test request flows end-to-end locally | A6 |
| **P4** | Content: Journal, then Perennis | 1 real article, library index with rights status | A4 |
| **P5** | Trust: policy URLs, accessibility statement, 404/500 | every footer link resolves to a real page | A3/A5 |
| **P6** | Launch prep: SEO flip, images, analytics | see `SITE-ARCHITECTURE` section 8 + ROADMAP Step 6 | A5/A7 |

P1 is the only phase that touches both renderers. It is also the only one that can silently break AI Studio, so it gets its own verification pass.

---

## 7. AI Studio compatibility contract

AI Studio runs from the repository root, using the adapter committed in `87996f1` (root `package.json`, `vite.config.ts`, `tsconfig.json`, `metadata.json`), which points Vite at `AURA-eCommerce-Shop-main`.

**Never, in any phase:**

- delete, move, or edit the root `package.json`, `vite.config.ts`, `tsconfig.json`, `metadata.json`;
- move `App.tsx`, `index.tsx`, `index.html`, or `types.ts` out of `AURA-eCommerce-Shop-main`;
- rename that folder, add a second `index.html` at the root, change `root`/`publicDir`, or change bundler;
- rewrite `App.tsx` wholesale in one commit (AI Studio will conflict on save).

**Always:**

- `git pull` before local editing; AI Studio overwrites files it manages;
- keep new work inside `AURA-eCommerce-Shop-main/` (`components/`, `data/`, `services/`, `templates/`, `public/`);
- keep generated pages in `public/` so the same Vite app still serves them;
- after any change near the build, open AI Studio's preview and confirm it still boots, before committing further.

**Under static-first, AI Studio's role is:** the app shell (home, cart/checkout islands, admin), component work, and visual experiments. It is no longer the only way the site is built - which is the point, but it must be said out loud so nobody is surprised.

---

## 8. Launch-readiness definition (for later)

AURA is launch-ready when, in one atomic change: robots allows crawling, `noindex` is removed from public pages, sitemap `<loc>` values are absolute, GSC verification is real, canonicals point at the production domain, and no page carries a claim without a `verified` compliance record. Until then the site stays `noindex`.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| Static and React drift apart again | `site.json` + `tokens.css` + one cart module; a test that fails if a nav link has no page |
| AI Studio overwrites local work | Pull before edit; keep AI Studio's blast radius in `components/` and `App.tsx` |
| Static pages cannot take orders | Explicit: orders are server functions later; the catalogue is static |
| Cart "works" locally but loses data | Same storage key, versioned shape (`aura_cart_v1`), documented migration |
| Phase P1 becomes a redesign | Token extraction must reproduce current values; visual diff is the gate |
| Library page published before rights | Reader route exists only when `rights: verified`; template test enforces it |

---

## 10. Open decisions

| # | Decision | Recommendation | Recorded as |
|---|---|---|---|
| 1 | Cart/state architecture (this section 2) | B - static-first + islands | D-023 |
| 2 | Tailwind delivery | compile at build (option B in SKILLS-PLAYBOOK) | D-021 |
| 3 | Duplicate `product-detail.*` | delete | D-022 |
| 4 | Category taxonomy for the real catalogue | propose 6 categories in P2, owner confirms | pending |
| 5 | Search implementation | client-side index over `pilot-products.json` until >50 products | pending |
| 6 | Policy page copy | needs UK/EU/Bangladesh-specific wording; not drafted here | pending |

---

## 11. What this document does not authorise

No storefront edit, no config change, no package install, no deployment, no payment or supplier integration, no price, no book publication, and no navigation change. It is a map. Each phase in section 6 needs its own explicit go-ahead.
