# AURA — Step-by-Step Work Outline

**Version:** v1  
**Date:** 2026-11-04  
**Status:** Proposed overall work order. The two pilot layouts have since been explicitly authorised and built; later operations and deployment still require approval.

**Progress update (2026-11-06):** The owner subsequently authorised the two pilot layouts to be built. Step 3's product templates and a small part of Step 4 (homepage links and pilot collection navigation) are implemented. New pages are static HTML alongside the existing React prototype. A local review server is available; Step 5's Cloudflare deployment has not happened. See `STATUS.md` for test results and remaining scope.

## Goal

Complete a coherent, usable AURA website with a small representative catalogue, then prepare and connect the services needed for real sales.

## Confirmed direction

- One website with two clearly distinguished product types: affiliate and dropshipping. Each has its own reusable product landing-page template.
- Source platform and selling model are separate choices. Products may come from AliExpress, CJ, or future suppliers; the owner wants to browse AliExpress first.
- The owner prefers affiliate for expensive items and dropshipping for lower-priced items. There are no approved numeric price cutoffs; assess each product's economics.
- Begin with one affiliate product and one dropshipping product. Handmade cultural instruments remain an important category in the wider vision.
- Add a reading library using only exact editions whose full-text publication rights have been established. Free access, signup, downloads, and paid access are still to be decided.
- Medical and homeopathy content are excluded from the current project scope.
- Preserve the existing visual design. The owner prefers HTML/CSS/JavaScript and strong SEO/performance; the existing prototype is React/TypeScript/Vite. The implementation approach is still an explicit planning decision.
- The owner is in Bangladesh and has a partner in Belgium. The goal is international; choose initial sales destinations from product-level research.
- The owner confirms that the site has not been deployed to Cloudflare. Cloudflare is intended as a temporary way to view the developing website online. Production hosting, final domain setup, and any subdomain arrangement are undecided.

## Work sequence

| Step | Work | Concrete result |
|---|---|---|
| **1. Confirm the website blueprint** | Agree the page list, navigation, initial categories, two product journeys, and the rendering approach needed to preserve the design while delivering useful initial HTML. Keep AURA as the working name while the naming question remains open. | One page map and a short template/technical brief. |
| **2. Prepare the starter catalogue** | Select one affiliate offer and one dropshipping candidate from the owner's preferred sources. Record the exact product/variant, URLs, usable images, description facts, date/country-specific costs and delivery information. Select a book only after edition-specific rights verification. | A small, traceable content packet for the templates. |
| **3. Build the reusable templates** | Create the affiliate landing page with a clearly labelled external merchant link and disclosure. Create the dropshipping landing page with product/variant, pricing, and delivery areas, initially in demo/coming-soon mode. Prepare a book-detail layout if a book is ready. | Two product templates populated with the pilot items; a library template when appropriate. |
| **4. Complete the website around them** | Finish homepage, navigation, collections, relevant search/filter controls, library, journal/review layout, About, Contact, and footer. Refine mobile layout, typography, accessibility, and image presentation within the existing design. | A complete locally reviewable site with a small catalogue. |
| **5. Preview through Cloudflare** | When deployment is requested, create a temporary online preview and choose suitable access/indexing settings. Review it on real desktop and mobile devices. A temporary provider URL does not decide AURA's final domain structure. | A shareable development preview and focused feedback list. |
| **6. Check design, SEO, and performance** | Check direct product URLs, headings, meaningful initial HTML, metadata, internal links, image sizing, keyboard/mobile use, and measured loading performance. Fix issues found in the preview. | A verified presentation layer and recorded remaining issues. |
| **7. Prepare for selling** | Choose supported destinations and confirm the legal seller, payment route, affiliate payout eligibility, relevant business/tax requirements, supplier arrangements, delivery promises, and returns/support terms. Resolve library access/pricing if it will be offered. | A documented operating setup for the selected products and markets. |
| **8. Connect and test real functionality** | Connect the approved payment and order backend, selected supplier workflow, tracking, notifications, and any chosen library access controls. Test orders, payment failures, refunds, variants, and tracking using supported test facilities. Start with a manual supplier workflow if adequate. | A tested end-to-end buying and fulfilment flow; verified affiliate links. |
| **9. Launch on the final domain** | Confirm production hosting/domain settings, correct canonicals and indexing, sitemap, policies, and appropriate measurement. Release the small pilot catalogue and monitor initial use closely. | A public, operational pilot with support and order handling ready. |
| **10. Expand from evidence** | Add products, rights-cleared books, and useful original content based on demand, delivery reliability, affiliate earnings, and dropshipping margins. Add automation where repeat work justifies it. | A growing catalogue and an evidence-led improvement backlog. |

Steps 3 onward describe future implementation work. Their presence in this outline is not permission to execute them automatically.

## Starting point for the page map

The following labels are suggestions for Step 1, not approved navigation or routes:

```text
Home
├── Shop — dropshipping collection and product pages
├── Discover — affiliate collection and product pages
├── Library — book index and individual book pages
├── Journal — original articles, guides, and optional reviews
├── About
└── Contact + footer policy/support pages
```

Categories such as Sound & Instruments, Art & Creativity, and Quiet Living can sit within the relevant hubs. A product's supplier does not determine which hub it belongs to. Any shared discovery views should label the selling model clearly.

## Template principles

- Each selected product has a stable individual URL and a clear next action.
- Affiliate purchases finish on the named merchant's site. An affiliate item is not added to AURA's checkout.
- AURA dropshipping pages explain who sells and fulfils the order. In the development phase, controls are visibly demonstrative or unavailable for purchase.
- Prices, images, and other supplier assets follow the source/program's actual permissions and update requirements. There is no blanket rule that affiliate pages cannot show prices or that every image must be downloaded.
- Reuse design components while making the two purchase paths understandable.
- Book metadata/source flags alone are not a clearance for worldwide hosting or sale; consult `BOOKS.md` for current evidence status.

## How we will manage the work

- Keep the current step, completed work, and next action in `STATUS.md`.
- Record owner decisions separately from recommendations in `DECISIONS.md`.
- Keep durable business facts in `../.agents/product-marketing.md`; load detailed evidence only when relevant.
- Use relevant installed skills per task: site architecture for the blueprint, UI/design skills for layouts, copywriting for content, and SEO skills for page checks. Additional tools and background agents are not prerequisites for this outline.
- Business documents, payments, and fulfilment belong to the later selling phase; they do not prevent writing the blueprint or preparing a display-only catalogue.

## Next planning task

**Step 1: turn the proposed page list into AURA's agreed website blueprint.** Define where the two product types and the library appear, and list the fields each reusable template needs. Product links will be needed at Step 2. Budget, final domain, and gateway decisions can be resolved at their relevant steps.
