# AURA — Claude Project Context

This project keeps its shared context in files so every session and every tool starts with the same baseline. Read them before acting:

- `AGENTS.md` — instructions and hard rules
- `.agents/product-marketing.md` — short current business context
- `planning/STATUS.md` — current phase, blockers, next approved task

Load detail when relevant:

- `planning/ROADMAP.md` — proposed step-by-step outline
- `planning/DECISIONS.md` — history and latest corrections; older recommendations were sometimes mislabelled as approvals
- `planning/BOOKS.md` — candidate books and rights evidence, not a blanket clearance

## Non-negotiables

- Planning only until explicitly authorised. No site edits, deployments, installs, or scheduled automations.
- Never publish in-copyright material. Consult the exact-edition evidence and status in `planning/BOOKS.md`.
- No medical, homeopathy, supplement, or health-claim content.
- Do not expose credentials, supplier costs, or personal data.

Current owner corrections take precedence over old planning assumptions. Update the shared memory when a decision changes; do not execute later roadmap steps automatically. Cloudflare is currently undeployed and intended only as a temporary preview option.
