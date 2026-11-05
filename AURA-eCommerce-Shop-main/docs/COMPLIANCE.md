# AURA — Compliance & Verification (2026-11-06)

## Register
`data/compliance.json` is the single register. Categories: product-safety, labelling, claims, lab-test, accreditation, medical-report, origin, ethical, food-safety, image-rights. Statuses: `verified | pending | not-provided | not-applicable`.

## Rule
A claim may only be published when its record is `verified`. Status is never upgraded automatically. Missing evidence is recorded as missing.

## Per-product status (pilot, 2026-11-06)
- Turmeric Cleansing Soap (AliExpress 1005007532901889): 0 verified. No INCI list, no safety report, no RP, no image permission. Preview only.
- Turmeric Cleansing Pads (CJ 2114448810729783298, affiliate): listing identity unconfirmed (CJ needs human verification). No claims published by AURA. Commission eligibility unverified — token may be merchant-referral, not product-sale commission.
- Aloe Vera Cleansing Bar (AliExpress 1005008143754192): 0 verified. No full INCI, no safety report, no UK responsible person. EU RP stated by supplier as GAVIMOSA CONSULTORIA, Madrid — address as displayed looks malformed, must be verified before reliance. Max 1 pc/shopper, supplier retail £7.57 inc VAT, brand's own store — little/no resale margin. Blocked claims include anti-acne, brightening, oil control, melanin.

### Ashwagandha with Black Pepper (D-020)

- CJ product `1898627038642925570`, SKU `CJHP232030301AZ`; `/shop/ashwagandha-with-black-pepper/` is a display-only preview under Herbal Botanicals. Shop is the intake assumption, not a rule tying CJ to one selling model.
- Owner-supplied listing text and label describe **60 capsules**. CJ's `Powder` attribute conflicts with that description. **113 g is gross package weight**, not net powder contents.
- The attached PDF was successfully rendered locally after the direct PDF reader failed. It is **one-page label artwork**, not a laboratory report or certification. Reading its contents does not verify the actual formulation or batch.
- Label-stated facts: serving size 2 capsules; 30 servings; **1,300 mg Ashwagandha root and 10 mg black pepper fruit per serving**; inactive ingredient: pullulan capsules. These are transcription details, not dosing advice.
- Artwork names Vendercart but lacks the CJ SKU, a batch number, expiry, or laboratory results. Obtain the physical-pack label and exact-product linkage. The supplier description says black pepper extract; the label says fruit, so standardisation/extract status is unconfirmed.
- **0 product checks verified.** Label, identity, and format review are pending. Batch analysis, organic certification, allergen/free-from evidence, supplier terms, and image permission are outstanding.
- Evidence fingerprint (SHA-256): `3da0bff89170df4d5172c17244c93c3b3760fc27f5a9a14d86bf28c577cacd2c`. The original PDF and local rendered image are not hosted or committed. The page uses a labelled photography placeholder.

## Store-level
- Trading entity/address: not provided (Bangladesh trade licence/TIN/BIN pending).
- Supplement / food operations review: pending following the new herbal-supplement preview. Confirm the eventual seller, intended markets, traceability, and allergen process before enabling sales.
- Health-claim policy: verified as policy — no treatment/cure/prevention claims. (This is a policy record, not product evidence.)
- Accreditation register: none held. No certificate badge may appear until verified.
- Image rights: supplier photos are mockup-only pending written permission.

## Current herbal scope
D-020 corrects the agent's powder/root-only interpretation in D-019. The owner permits factual previews of selected herbal supplements, including capsules. Homeopathy, iridology, disease-treatment claims, and unsupported health or certification claims remain excluded. A label, disclaimer, or a supplier's "Certification (1)" tab does not by itself verify a product, approve an organic badge, or enable sales. Review requirements for the actual product and destination rather than reusing a cosmetic INCI/CPSR checklist for a supplement.
