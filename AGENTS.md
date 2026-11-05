# AURA — Agent Instructions

Read the short startup context before working, in order:

1. `.agents/product-marketing.md` — the business, the model, the hard rules
2. `planning/STATUS.md` — current phase, blockers, next approved task

Then load the relevant detail only:

- `planning/ROADMAP.md` — proposed work order; future steps are not execution permission
- `planning/DECISIONS.md` — decision history; read the latest corrections before older entries
- `planning/BOOKS.md` — book rights evidence and current publication status

Do not re-derive context from scratch. Do not ask questions already answered in those files.

## Hard rules

- **Planning first.** Do not edit the storefront, deploy, install packages, change configs, or run automations without explicit approval in the current session.
- **Book publication.** Never upload, host, mirror, or redistribute in-copyright material. Check exact-edition evidence in `planning/BOOKS.md`; a candidate or archive metadata flag is not publication approval.
- **No medical content.** Homeopathy, supplements, herbs-as-treatment, iridology, and health claims were deliberately removed. Do not reintroduce them, even as "traditional use".
  - *Owner correction 2026-11-06 (D-019):* supplements ban reversed for herbal botanicals only (e.g. Ashwagandha powder/root). Still forbidden: homeopathy, iridology, disease-treatment claims, and any health claim without authorised evidence. Herbal products are preview-only until compliance record is `verified`.
- **Preserve the storefront design.** Code lives in `AURA-eCommerce-Shop-main` (React 19 + Vite). Respect the owner's HTML/CSS/JavaScript preference; the rendering approach requires an explicit decision.
- **Current hosting state.** As of 2026-11-04 the owner has not deployed to Cloudflare. It is a temporary preview option, not a settled production/subdomain strategy.
- **Supplier-neutral hubs.** Classify each product as affiliate or dropshipping independently of AliExpress/CJ/other supplier. Start with one of each; numeric price bands were not approved.
- **Use the extracted project.** Ignore the two project ZIP archives. Older embedded launch plans are reference material, not current approvals.
- **Secrets stay out.** No credentials, supplier costs, customer data, or personal details in these files or in the repo.

## Working style

- Be direct. Say when an idea is weak, illegal, or uneconomic. Do not agree for the sake of agreement.
- Distinguish clearly between *owner's decision*, *agent suggestion*, and *verified fact*.
- Cite sources for legal and platform claims. Mark unverified claims as unverified.
- Keep memory brief and dated. Apply current owner corrections instead of repeating older assistant assumptions.
- Use a small task-relevant skill selection. Do not launch subagents or scheduled automation without an explicit request.
