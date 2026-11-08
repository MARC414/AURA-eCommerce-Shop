# AURA - Skill & Automation Playbook

**Version:** v1
**Date:** 2026-11-09
**Status:** Planning artefact only. No skill has been applied to the storefront, no automation is running, no config changed.

**Purpose:** decide *which* installed skill is used at *which* stage, in *what order*, and which skills must never be pointed at AURA. Written to be read by the owner, AI Studio, and Claude Desktop before any build session.

Legend for claims in this document:

- **[verified]** - checked in this session against files, commands, or the running site.
- **[suggestion]** - my recommendation; not approved.
- **[owner decision]** - already decided by the owner and recorded elsewhere.

---

## 0. Rules of engagement (read before loading any skill)

1. **Context first, skill second.** Every marketing skill in the installed pack begins by looking for `.agents/product-marketing.md`. That file is the authority. A skill that contradicts it loses.
2. **Selection budget: 1 primary + at most 2 supporting skills per task.** 118 skills is roughly 2 MB of instructions; loading broadly produces contradictory advice (brand brief vs. growth hack vs. compliance rule). Narrow loads also keep the context window usable for actual code.
3. **Skills advise; they never authorise.** No skill may cause a deploy, a package install, a spend, a supplier order, a price, or a compliance status change. Those remain owner decisions.
4. **Capability gate.** Before a skill is trusted, confirm it can actually run here (offline data, account, MCP server, API key). A skill that silently degrades to "general advice" is worse than no skill, because it looks authoritative.
5. **Honesty rules beat optimisation rules.** Any skill output that adds urgency, scarcity, invented certification, health benefit, delivery promise, or review count is rejected regardless of skill quality. See section 5.
6. **One rendering decision, not two.** AURA currently has two front ends (React app + generated HTML). Every design or token artefact must be usable by both, or the design will drift.

---

## 1. Repo sync record (2026-11-09)

**[verified]** Git binary: `E:\OLD Client and Projects\A\Git\cmd\git.exe` (v2.55.0).

| Item | State |
|---|---|
| Local branch | `master` at `8040e96` (CJ Ashwagandha preview) |
| `origin/master` | `8040e96` - in sync |
| `origin/main` (remote default) | `87996f1` - **one commit ahead**: `feat: initialize project configuration` |
| Difference | 4 new root files only: `metadata.json`, `package.json`, `tsconfig.json`, `vite.config.ts` (AI Studio export) |
| Tests | `node --test` -> **30/30 pass** (0.95 s) |
| `node_modules` | **absent** (root and app folder) |
| `.env` / keys | **none found** |
| MCP servers | **none registered** (`list_mcp_resources` returned empty) |
| Untracked, in repo root | `Alibaba/`, `Aliexpress/`, `Prompt.txt`, `New Text Document.txt`, `New Microsoft Word Document.docx` |
| Untracked, in app | `public/assets/product-detail.css` (21 KB), `public/assets/product-detail.js` (21 KB), `templates/product-detail.html` (23 KB) |

**Sync result:** fetch completed; local content is up to date with what `master` tracks. I did **not** merge `origin/main`.

**Why not [suggestion]:** that commit adds a *second* build entry point - a root `package.json`/`vite.config.ts` whose `root` points into `AURA-eCommerce-Shop-main` - while the app already has its own `package.json` and `vite.config.ts`. Merging it creates two ways to run the same site, and the one in `docs/HANDOFF.md` is not the one that would appear newest. This needs an owner decision (section 7, D1), not a silent fast-forward.

---

## 2. Site audit - what the skills should actually be aimed at

The storefront's *structure* is in better shape than its *surface copy*. Four generated pages are clean, tested, and honest. The legacy React page is the liability.

### Strengths [verified]

- Generated pages: exactly one `<h1>`, valid Product + BreadcrumbList JSON-LD, canonical link, `noindex, follow`, 4 images with alt text, zero inline style attributes, skip link present, no horizontal overflow at 985 px content width.
- Product JSON-LD correctly omits `brand`, `offers`, `rating`, and images it does not have. That restraint is the single best technical decision in the repo.
- 30 template tests include regression guards for capsule identity, per-serving amounts, blocked claims, and "label artwork cannot become a verified certificate".
- Design tokens are consistent across the generated CSS (body `#f5f2eb` on `#2c2a26`, Inter/Playfair, 11 px meta, 15 px body, 34 px H1).

### Risks, ranked

| # | Severity | Finding | Evidence | Fixed in |
|---|---|---|---|---|
| S1 | **Critical - legal** | Legacy catalogue fabricates products, certifications, and disease claims: "100% Certified USDA Organic", "KSM-66", "regulate cortisol", "calm the central nervous system", "clinically revered". None is verified; D-020 forbids these. | `constants.ts` lines 17-40, 95-112, 120-142, 179+ | A0 |
| S2 | **Critical - legal** | The same contamination is in the React document head: `certified organic KSM-66` (line 7), `stress relief and circadian balance` (line 58), plus a Store schema asserting `currenciesAccepted: USD`, `paymentAccepted: Credit Card, Debit Card, Payoneer`, `priceRange: "$$"` and `url: https://aurastudios.co` - none of which is true (line 44-48). | `index.html` | A0 |
| S3 | High - performance | Tailwind Play CDN (`cdn.tailwindcss.com`, line 36) is a runtime, render-blocking, third-party script. Tailwind's docs state the Play CDN is "designed for development purposes only, and is not the best choice for production" (https://v3.tailwindcss.com/docs/installation/play-cdn). It also means the 765 Tailwind class usages in the React components have no build step, no purge, and no version pin. | `index.html:36`; 765 `className` matches | A2 |
| S4 | High - LCP | Hero LCP is a preloaded remote Unsplash JPEG (line 33) with no dimensions, no `srcset`, no local control. Product photography is supplier JPEGs at 206 KB and 524 KB, unoptimised, fixed-size. | `index.html:33`; `public/assets/products/` | A5 |
| S5 | High - indexing | `robots.txt` disallows everything, every page is `noindex`, `sitemap.xml` uses *relative* `<loc>` values, and GSC verification is the literal placeholder `GSC_VERIFICATION_TOKEN_HERE`. Go-live must flip all four in one atomic change; done piecemeal the site is either invisible or half-indexed. | `public/robots.txt`, `public/sitemap.xml`, `index.html:25`, page `<meta robots>` | A5/A7 |
| S6 | Medium - a11y | Breadcrumb and footer links render at 14 px tall ("Home" 31x14, "Shop" 27x14). WCAG 2.2 AA 2.5.8 requires 24x24 CSS px, **but** its "inline" exception covers targets constrained by the line-height of surrounding non-target text - which arguably describes a breadcrumb. Treat as a border-line case to verify, not a proven failure (https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). | measured in browser at 985 px | A3 |
| S7 | Medium - architecture | Two rendering systems with duplicated, independently-edited CSS: `product-pages.css` (18 KB) + untracked `product-detail.css` (21 KB). The duplicate detail template was deleted in commit `9c90890` and has reappeared untracked. Design drift is now a maintenance certainty, not a risk. | `public/assets/`, `templates/` | A2 |
| S8 | Medium - build truth | The React app has never been built in this checkout (`node_modules` absent). STATUS already admits esbuild was a compilation smoke test, not a build. Nobody currently knows whether `npm run build` succeeds or what it emits. | filesystem + `docs/HANDOFF.md` | A3 |
| S9 | Low - schema | Correct restraint on product schema, but the homepage `Store` node makes unverifiable claims and points at a domain that is not confirmed. | `index.html:44-58` | A0 |

**Direct conclusion [suggestion]:** the highest-quality work available this week is *subtraction* (S1, S2, S9) and *one architectural decision* (S3/S7). No design, SEO, or conversion skill should be loaded until A0 is done - every one of them will happily optimise text that must be deleted.

---

## 3. Skill inventory

**Count: 118 callable skills from three sources [verified]**

| Source | Path | Count | Family |
|---|---|---|---|
| Marketing/SEO/ads pack | `C:\Users\HP\.claude\skills` -> `E:\CLAUDE-HUB\skills` | 109 | 34 ads, 27 seo, 48 marketing |
| Design pack | `E:\OpenRouter\skills` | 7 | design, design-system, ui-styling, ui-ux-pro-max, brand, banner-design, slides |
| Harness | built into the runtime | 2 | `opencode`, `report` |

`E:\AI\Skills` is registered in the config but **empty** [verified].

### 3.1 Capability matrix - the gate that matters

| Tier | Meaning | Skills |
|---|---|---|
| **Offline, usable today** | Local data or pure method; no account, no key, no MCP | `ui-ux-pro-max` (local CSVs + Python 3.14, verified working), `design-system`, `brand`, `copy-editing`, `copywriting`, `site-architecture`, `content-strategy`, `seo-content`, `seo-content-brief`, `seo-plan`, `seo-cluster`, `seo-sxo`, `seo-hreflang`, `seo-sitemap`, `seo-technical`, `seo-audit`, `seo-page`, `seo-schema`, `seo-drift`, `cro`, `analytics` (as a plan), `attribution` (as a plan), `revops`, `emails`, `pricing`, `launch`, `ab-testing`, `marketing-council`, `marketing-ideas` |
| **Needs an account/data source** | Degrades to generic advice without it | `seo-dataforseo` (DataForSEO MCP), `seo-google` (GSC/PSI/CrUX), `seo-backlinks` (paid link index), `seo-image-gen` (Gemini/nanobanana MCP), `seo-maps`, `seo-local`, `seo-ecommerce`, all 34 `ads-*` (platform tokens + CLIs in `tools/clis`), `seo-geo`/`ai-seo` (needs live AI-answer sampling to be meaningful) |
| **Blocked or mismatched for AURA** | Would require infrastructure that does not exist, or contradicts the stack/rules | see section 5 |

**Verified blockers today:** no MCP servers registered, no API keys on disk, no ad accounts linked, no deployed site, no sellable product, no payment gateway. That means the entire `ads-*` family, `seo-dataforseo`, `seo-google`, `seo-image-gen`, and `seo-maps` are currently *decorative*. Treat them as unavailable, not as optional.

### 3.2 Design pack, judged individually

| Skill | Verdict for AURA |
|---|---|
| `ui-ux-pro-max` | **Use.** 79 styles, 192 palettes, 119 UX guidelines, 22 stacks, all local, no network. The only design authority available that can be checked rather than believed. |
| `design-system` | **Use at A2.** Token architecture (primitive -> semantic -> component) is exactly what unifies the two renderers. |
| `brand` | **Use at A1/A2.** Voice and identity rules; keep it descriptive of AURA, not generative of a new brand. |
| `ui-styling` | **Do not use now.** It is shadcn/ui + Radix + Tailwind. AURA has no Tailwind build, no React component library, and a hand-authored CSS design that must be preserved. Adopting it is a rewrite, not a polish. |
| `design` | **Later, surgical.** Its logo/CIP/banner generators expect Gemini image models. Only the banner/social-photo references are usable without keys. |
| `banner-design` | **Phase A8** for OG/social images, once a real brand image exists. |
| `slides` | Not needed until an investor/partner deck exists. |

---

## 4. Phase map - which skill, in which order

Phases are aligned to `planning/ROADMAP.md` steps so there is one roadmap, not two. Each phase has an exit gate; the next phase does not start until the gate passes.

### A0 - Truth hygiene (ROADMAP pre-step) - **do this first**

**Skills: none.** This is deliberately skill-free. It is deletion and metadata correction, verified by the existing tests plus one new guard.

**Work:** remove or replace the fabricated catalogue in `constants.ts`; strip health/certification claims and the false `Store` schema from `index.html`; decide the fate of the three untracked root folders and the duplicate `product-detail.*` set; resolve D1 (root build config).

**Exit gate:** `grep` for the banned-claim list returns only `data/compliance.json` and test fixtures; 30/30 tests still pass; homepage still renders.

**Anti-pattern:** loading `copywriting` here. It will write better copy for products that do not exist. Delete first, write later.

---

### A1 - Blueprint, IA, and voice (ROADMAP Step 1)

**Primary:** `site-architecture`
**Support:** `brand`, `product-marketing`

**Order:**
1. `product-marketing` - refresh `.agents/product-marketing.md` only if a real gap appears (audience/positioning is still open by owner's own note).
2. `site-architecture` - produce the page map: Shop / Discover / Library / Journal / About / Contact, with the two purchase models as separate journeys and one canonical URL per product.
3. `brand` - voice rules that survive the honesty constraints (what AURA may say, never what it wishes it could say).

**Optional, only if keyword work is requested:** `seo-plan` then `seo-cluster`. Do **not** run `programmatic-seo` yet - four products with `price: null` is not a data set, it is a demo.

**Exit gate:** one page map + one template field list, both consistent with `docs/ARCHITECTURE.md`.

---

### A2 - Design contract (the quality multiplier)

**Primary:** `ui-ux-pro-max`
**Support:** `design-system`, `brand`

**Order:**
1. `ui-ux-pro-max` in audit mode - one domain query at a time, against the *existing* design, not a new one. Verified working invocation on this machine:
   ```
   py -V:Astral/CPython3.14.7 E:/OpenRouter/skills/ui-ux-pro-max/scripts/search.py "<outcome>" --domain ux --max-results 5
   ```
   Start with the measured defects: `"target size touch link" --domain ux`, `"breadcrumb" --domain ux`, `"product image srcset" --domain ux`.
2. `design-system` - codify what already exists as three token layers (primitive: colour/space/type scale; semantic: surface/text/border/status; component: product-card, compliance-pill, cta). Output: one `tokens.css` that both `product-pages.css` and the React components consume.
3. `brand` - confirm the semantic layer matches AURA's voice: quiet, factual, no urgency.

**Hard constraint:** this phase *codifies*, it does not redesign. If the token extraction disagrees with the current look, the current look wins and the extraction is wrong.

**Exit gate:** one token file, both renderers importing it, zero visual diff at 375 / 768 / 1440 px.

**This is the phase that decides S3 and S7:** either compile Tailwind at build time (and keep the class names), or delete the CDN and convert the 765 class usages to the token CSS. Both are real work. Doing neither is how sites rot.

---

### A3 - Page craft and components (ROADMAP Steps 3-4)

**Primary:** `ui-ux-pro-max`
**Support:** `cro`, `seo-page`, `seo-schema`

**Order:**
1. `ui-ux-pro-max` per component as it is touched (one focused domain query, 2-5 terms, one intent).
2. `cro` - page-level structure only: is the next action obvious, is the "not for sale yet" state honest and non-confusing, does the compliance section help or scare. Explicitly reject any urgency, scarcity, countdown, or social-proof suggestion - AURA has no orders.
3. `seo-page` per URL - title, description, headings, internal links, structured data presence.
4. `seo-schema` - only to validate existing JSON-LD. It must not add `Offer`, `brand`, `aggregateRating`, or `image` that do not exist.

**Exit gate:** `npm run test:templates` green, plus a manual DOM probe (one h1, no overflow, targets >= 24 px) at 375 and 1440 px.

---

### A4 - Content, claims, and reading experience

**Primary:** `copy-editing`
**Support:** `seo-content`, `seo-content-brief`

**Order:**
1. `copy-editing` - remove AI tells and marketing cadence from generated product pages; keep the factual register. This is the skill that most improves *perceived* quality per hour spent.
2. `seo-content` - thinness / E-E-A-T read on the collection and library templates.
3. `seo-content-brief` - only for Journal articles that will actually be written.

**Note:** every health-adjacent sentence is a compliance question, not a copy question. `data/compliance.json` decides; `copy-editing` only chooses the words around the decision.

---

### A5 - Technical SEO and performance (ROADMAP Step 6)

**Primary:** `seo-technical`
**Support:** `seo-audit`, `seo-images`, `seo-drift`

**Order:**
1. `seo-drift` **first**, before any edit - baseline the 7 generated pages + homepage so the next change is diffable. Cheap, offline, and it makes every later claim ("nothing broke") provable.
2. `seo-technical` - crawlability, indexability, canonical, render path, CWV, mobile, structured data.
3. `seo-images` - `srcset`, WebP/AVIF, explicit dimensions, the Unsplash LCP.
4. `seo-audit` (or `seo-audit-deep` for the full site) - the scored, prioritised pass. Run once, not weekly.

**Deferred:** `seo-google` (needs GSC + PSI API), `seo-dataforseo`, `seo-backlinks`, `seo-geo`, `ai-seo` - all post-launch and account-gated. `seo-hreflang` only if a second language is actually approved.

**Exit gate:** S4 and S5 closed; a written "go-live flip list" (robots, noindex, absolute sitemap locs, GSC token, canonical domain) ready to execute in one commit.

---

### A6 - Commerce readiness (ROADMAP Steps 7-8)

**Primary:** `analytics`
**Support:** `attribution`, `revops`, `emails`

**Order:**
1. `analytics` - measurement plan *before* any gateway: events, consent, what "conversion" means when the default is invoice-request.
2. `attribution` - only the reconciliation half: what AURA will be able to prove vs. what AliExpress/CJ will claim. This directly serves the unverified affiliate-payout question.
3. `revops` - order-request -> invoice -> fulfilment handoff, states, and who may change `paymentStatus`.
4. `emails` - order confirmation, invoice, and the newsletter confirmation the footer already promises.

**Do not** run `signup`, `onboarding`, `paywalls`, or `churn-prevention` here: there are no accounts and no subscriptions. They belong to the library phase, if it ever becomes paid.

**Exit gate:** documented operating setup, per ROADMAP Step 7. No gateway is integrated in this phase.

---

### A7 - Launch (ROADMAP Step 9)

**Primary:** `launch`
**Support:** `seo-audit` (final), `social`, `directory-submissions`

**Order:**
1. `launch` - pre-launch QA checklist; it is the one skill written for this exact moment.
2. `seo-audit` - one final full pass against the live preview.
3. The S5 atomic flip, verified in the live HTML source (not in the repo).
4. `social` + `directory-submissions` - only after the site is public and indexable.

**Gated on [owner decision]:** domain, hosting, seller identity, payment route, delivery/returns terms. None of these is a skill question.

---

### A8 - Growth (ROADMAP Step 10)

**Only after:** real orders, real traffic, real data.

| Need | Skills |
|---|---|
| Content cadence | `content-strategy`, `seo-cluster`, `programmatic-seo` (only with real catalogue data) |
| Paid acquisition | `ads-plan` -> `ads-dna` -> `ads-create` -> `ads-*` platform audits. Requires accounts, budget, and tracking that works. |
| Creative | `ad-creative`, `banner-design`, `image`, `video` |
| Word of mouth | `referrals`, `community-marketing`, `influencer-marketing` |
| Editorial | `public-relations`, `co-marketing` |
| Experiments | `ab-testing` (needs ~1,000+ conversions/arm; AURA is years from that on a 4-product catalogue - use qualitative review instead) |

---

## 5. Skills that will actively damage AURA

Stated plainly, because a perfectionist mentor should name the traps rather than list all 118 skills as if they were equally usable.

| Skill(s) | Why it is wrong here |
|---|---|
| `offers`, `pricing` (tactics half), `marketing-psychology` (scarcity framing) | AURA's brand is "no invented prices, no fake discounts, no money-back guarantee". Bonus stacks, countdowns, and anchoring scripts are the opposite of the product. Use `pricing` only for *structure* (when a price exists) and `offers` only if a service/lead-magnet is ever designed. |
| `popups`, `exit-intent` | AGENTS.md and the footer already promise honest, non-coercive contact. Interrupt overlays convert and cheapen simultaneously. Not before a mailing provider exists. |
| `paywalls`, `churn-prevention`, `signup`, `onboarding` | No accounts, no subscriptions, no app. Zero applicable surface today. |
| `aso` | No mobile app. |
| `sms` | No provider, no consent records; TCPA/GDPR exposure for a Bangladesh-based operator selling into the UK/EU. |
| `prospecting`, `cold-email`, `sales-enablement`, `competitors` | B2B/SaaS playbooks. AURA sells objects to individuals. `competitors` could later support "AURA vs. generic supplier" pages, but that is a positioning decision, not an outreach one. |
| All 34 `ads-*` | No accounts, no budget, no deployed site, no sellable product. Also the highest-risk family for autonomous spend. |
| `ui-styling` | Stack mismatch; adopting it means discarding the design that must be preserved. |
| `seo-programmatic` / `programmatic-seo` | Template pages at scale with 4 products and `price: null` produces thin, duplicate, claim-bearing pages - the fastest way to get a new domain devalued. |
| `ads-server-side-tracking`, `ads-attribution` | Premature; requires a live measurement stack that does not exist. |

---

## 6. Agentic automation plan

Everything installed that can automate, and the honest verdict on each.

### 6.1 What exists [verified]

| Capability | State | Verdict |
|---|---|---|
| Deterministic scripts | `npm run build:templates`, `test:templates`, `preview:templates` (port 4173) | **Ready.** This is real automation; use it every session. |
| `seo-drift` skill | Capture baseline + diff SEO-critical elements | **Ready.** Best low-cost automation available. |
| `marketing-loops` skill | Loop catalogue, guardrails, state/idempotency, stop conditions | **Ready as design, not as execution.** Needs a scheduler and a live site. |
| Subagents (`explore`, `general`) + worktrees | Local, bounded, no external side effects | **Safe.** Use for read-heavy research, never for publishing. |
| Browser tooling | DOM probes work; **screenshots fail** - the desktop window is not visible | Usable for measurement, not for visual sign-off. |
| Marketing CLIs / integrations (`tools/clis`, `tools/integrations`) | Present in the pack, but nothing authenticated | **Blocked.** |
| Dify (`dify-main`) | Full self-hosted automation platform on disk, not installed or running | **Out of scope.** Installing it is a project of its own and needs approval. |
| Scheduled/background agents | Not configured | **Do not create** without an explicit request (AGENTS.md). |

### 6.2 The three-layer ladder

**Layer 0 - deterministic gates (start now, zero cost, zero accounts)**

1. `test:templates` must pass on every change (it already blocks claim regressions).
2. **Add a claims lint** [suggestion]: a small script that scans `constants.ts`, `index.html`, and generated HTML for the banned-claim regex list (`cure|treat|clinically|KSM-66|USDA|certified organic|guaranteed|detox|anxiety`) and exits non-zero. This is worth more than any AI loop: it makes the hard rule mechanical instead of remembered. *Not implemented - needs approval.*
3. `seo-drift` baseline before A5, diff after.
4. Link + target-size probe (the browser tool already does this in one evaluate call).

**Layer 1 - human-in-the-loop weekly loop (after launch, ~4 weeks of data)**

Use `marketing-loops` to author exactly three loops, each with a human approval checkpoint and a stop condition:

- *Weekly SEO review* - `seo-drift` diff + `seo-audit` on changed pages; output a queue, never an edit.
- *Content refresh* - `seo-content` on the 5 weakest pages; propose rewrites for approval.
- *Link/claim integrity* - broken links, supplier tokens still alive, any new claim that appeared without a `verified` compliance record.

Explicitly **not** in Layer 1: publishing, outreach sends, spend changes, review responses.

**Layer 2 - platform loops (only after accounts, tracking, and budget exist)**

`ads-monitor` (daily pacing/anomaly) and `ads-optimize` (staged changes) with hard constraints: read-mostly, max daily spend cap, every mutation staged for approval, auto-disable on 3 consecutive errors. `seo-google` for GSC-driven opportunity pulls once the site is indexed.

### 6.3 Never automate

Publishing to the storefront, price changes, compliance status upgrades, supplier orders, refunds, customer replies, review responses, index/noindex flips, and anything that spends money. Every one of these is either irreversible, legally load-bearing, or both.

---

## 7. Decisions this analysis needs from the owner

| # | Decision | Default if no answer |
|---|---|---|
| D1 | Merge `origin/main` `87996f1` (root AI Studio build config) or drop it? Two build entry points is the worst of both options. | Leave unmerged; keep the app-local config authoritative. |
| D2 | Tailwind Play CDN: compile at build time, or convert the 765 class usages to token CSS? | Neither - the CDN stays as a known launch blocker. |
| D3 | Delete the untracked duplicate `product-detail.{html,css,js}` again, or adopt it? It duplicates `templates/product-pages.mjs`. | Delete; one renderer. |
| D4 | Scope of the `constants.ts` purge: replace the fabricated catalogue with the 4 real pilots, or empty it and let generated pages own the catalogue? | Replace with the 4 real pilots, `price: null`. |
| D5 | Are `Alibaba/`, `Aliexpress/`, `Prompt.txt`, and the two stray documents working material (keep, gitignored) or noise (remove)? | Keep locally, add to `.gitignore`, never commit. |

---

## 8. Now / next / not yet

**Now (A0) - no skill, all subtraction.** Delete the fabricated claims; make the homepage's metadata and schema either true or absent; settle D1-D5. Stop there and report.

**The one skill to load first:** `ui-ux-pro-max`, in audit mode.
Why this one and not `seo-audit` or `cro`: (a) design must be preserved, so the review has to be measured against an external standard rather than taste; (b) it is fully offline and verified working on this machine, so its output is reproducible and citable; (c) it produces the token extraction that fixes the two-renderer drift, which is the only *structural* quality problem left. It is a quality multiplier precisely because it changes what "good" means in a checkable way.

**Next three, in order:** `site-architecture` (A1) -> `design-system` (A2) -> `seo-drift` baseline (A5, early).

**Not yet, with triggers:**

| Skill family | Trigger |
|---|---|
| `ads-*` (34) | Deployed site + 2 sellable products + ad accounts + tracking verified |
| `seo-google`, `seo-dataforseo`, `seo-backlinks` | GSC/paid data account, plus a reason to look |
| `seo-geo`, `ai-seo` | Site indexed and stable for 8+ weeks |
| `email`, `sms`, `referrals` | A mailing/SMS provider is actually connected |
| `paywalls`, `onboarding`, `signup` | The library becomes a paid/account product |
| `marketing-loops` in execution | Layer 0 gates exist and the site is live |
| `ab-testing` | Real traffic; below ~1,000 conversions per arm it produces noise |

---

## 9. Maintenance

- Re-read this file at the start of any build session after `.agents/product-marketing.md` and `planning/STATUS.md`.
- Update the phase map when a phase's exit gate is met; keep the version and date current.
- If the skill pack is updated, re-verify the two capability facts that matter: does `ui-ux-pro-max` still run offline, and are any MCP servers now registered.
- Validate pack integrity with `E:\Claude Agents and Skills\CLAUDE AGENTS Automation\marketingskills-main\validate-skills.sh` before trusting a large batch of skills.
- This document grants no permissions. Separate approval is still required for any storefront edit, package install, deployment, or transaction.
