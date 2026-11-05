# AURA — Product & Business Context

**Document version:** v4  
**Last updated:** 2026-11-06

Keep this brief. Confirmed owner choices take precedence over older assistant recommendations.

## Business and audience

- AURA is a planned content-and-commerce brand spanning cultural instruments, art, books, quiet technology, and yoga/practice materials. Handmade cultural instruments are a precious core category.
- Working positioning suggestion: objects and knowledge for a slower, more sensory life. The exact audience and the balance of broadly accessible versus explicitly spiritual messaging remain open.
- Owner operates from Bangladesh; a partner in Belgium may help with payments. The legal/financial arrangement is unconfirmed.
- International reach is the goal. Select initial destinations product by product using demand, economics, and delivery evidence. UK-first was an earlier suggestion, not a final restriction.
- Owner reports a free `.co.uk` domain. Final domain/hosting setup is undecided. **No Cloudflare deployment has occurred.** Cloudflare is intended for temporary development viewing; no subdomain strategy has been chosen.

## Confirmed catalogue model

| Product type | Purchase path | Owner preference |
|---|---|---|
| Affiliate | Customer purchases from an external merchant through a labelled tracking link. | Generally more expensive items. |
| Dropshipping | AURA's eventual selling entity takes the order; a supplier fulfils it. | Generally lower-priced items. |

- One website, two differentiated landing-page templates. Each product has its own URL.
- Supplier and selling model are independent fields. AliExpress, CJ, and future sources are not restricted to one hub by policy.
- AliExpress is the owner's first browsing source. Owner reports affiliate/dropshipping account access; program approval, payout eligibility, and integration capabilities have not all been verified.
- Pilot selected: AliExpress item `1005007532901889` for the dropshipping layout; CJ item `2114448810729783298` for the external/referral layout. No fixed numeric price cutoffs. CJ commission eligibility remains unverified.
- Initial objective is a display/demo catalogue. Real payments and selling operations come after the structure is ready.

## Library and content

- Owner wants only books suitable for full-text hosting and potentially sale, with rights established for the exact edition and relevant territories.
- `planning/BOOKS.md` records candidates and evidence gaps. Earlier archive metadata checks did not establish unrestricted worldwide clearance.
- Free reading, signup requirements, paid downloads, and an HTML/EPUB/PDF mix remain open. A free library and HTML-first reading are recommendations, not settled choices.
- Original reviews and guides were discussed as possible content. Use only appropriately permitted assets/quotations; a disclaimer is not permission.
- Medical, homeopathy, supplement-treatment, iridology, and health-claim content are excluded from current scope. The owner selected two cosmetic listings for layout previews only; safety/compliance and product claims are not verified for sale. Own food production remains a later unresolved expansion.

## Site and working constraints

- Existing local prototype: `AURA-eCommerce-Shop-main`, React 19 / TypeScript / Vite. Prior review found simulated commerce functions; it is not a verified live ordering system.
- Preserve the existing visual design. The two pilot product pages and their collection pages are now generated plain HTML with shared CSS and lightweight JavaScript. The React homepage links to them. This is not a site-wide migration.
- Owner explicitly authorised designing and building the two planned layouts. Frontend implementation and local testing are complete; no payments, supplier-order integration, Cloudflare deployment, or tool/package installation was authorised or performed. `planning/STATUS.md` records the current work.
- Use a small task-relevant skill selection. Do not install tools, launch agents, implement, deploy, or transact without the corresponding owner instruction.
- Ignore the two project ZIP archives. Keep credentials, supplier costs, and customer/personal records out of shared memory and public source files.

## Later operational decisions

Confirm budget, initial destinations, seller identity, partner arrangement, gateway eligibility, affiliate payouts, applicable registration/tax requirements, and evidence-based delivery/returns terms before enabling sales. Exact obligations depend on the actual setup; older broad tax/platform statements are not verified application requirements.

### Structure completion (D-017, 2026-11-06)
- Third pilot added: aloe vera soap (AliExpress `1005008143754192`), `price: null` — owner decides selling price later, product added now without inventing one.
- Compliance/verification space created per owner request: `data/compliance.json` register (lab tests, medical reports, accreditations, safety, labelling, origin, image rights). No badge/claim renders unless record is `verified`.
- Payment: invoice/bank-transfer only while no gateway exists. Card data never collected; client cannot set `paid`.
- Cart persists locally; wishlist local-only; newsletter stores locally with honest messaging; chatbot is free retrieval over `data/knowledge-base.json` (no paid AI).
- Admin panel supports multiple users via role model (`owner/manager/fulfilment/support/viewer`), local-preview passphrase, no default PIN.
- Handoff docs: `AURA-eCommerce-Shop-main/docs/HANDOFF.md`, `ARCHITECTURE.md`, `PAYMENTS.md`, `COMPLIANCE.md` — read these first when continuing in AI Studio / Claude Desktop.
- Git commit/push remains blocked: git binary missing in this environment. Needs install + remote URL + credentials before merge.

## Changelog

- v4 (2026-11-06) — Added D-017 structure completion: third pilot, compliance register, invoice-first payment, persistent cart, newsletter, free chatbot, multi-user admin, handoff docs.
- v3 (2026-11-06) — Recorded the owner's frontend-build authorisation, selected AliExpress/CJ pilot items, generated HTML templates, and continued display-only/no-deployment limits.
- v2 (2026-11-04) — Corrected undeployed Cloudflare status; restored supplier-independent hubs, the one-plus-one pilot, international market choice, and open library/technical decisions. Removed unsupported fixed price rules.
- v1 (2026-11-03) — Initial shared context, originally saved without a version field.
