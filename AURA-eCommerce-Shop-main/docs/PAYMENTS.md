# AURA — Payments (2026-11-06)

## Rule
AURA never receives, stores, or transmits card numbers, expiry, or security codes. There is no card form anywhere. A future card payment is a redirect to a provider-hosted page.

## Current state: no gateway connected
- Enabled: `invoice` (request an invoice), `bank-transfer` (details on invoice after review).
- Disabled with plain reason shown: `card-hosted`, `wallet`, `payoneer`.

### Payoneer — owner has an account
Owner confirmed having Payoneer. The provider entry now exists in `services/payments.ts` as `enabled: false`:
- **What Payoneer can do:** receive money — e.g. a customer pays into your Payoneer-linked USD bank details, or you send a payment request. Good as a *receiving* rail.
- **What it cannot do:** act as a hosted checkout on your page. It cannot take a customer card payment inside AURA checkout, and it gives you no webhook to auto-mark orders `paid`.
- **Usable flow once connected:** AURA issues invoice → customer pays Payoneer → AURA (or a future server) confirms receipt → fulfil. The manual confirmation step remains until a real gateway exists.
- **Still needed before enable:** trading entity + address on the invoice, and confirmation that your Payoneer account can issue receiving details for that entity/country (Bangladesh eligibility for receiving USD bank details must be verified in your account — not assumed).
- Checkout creates an order with `paymentStatus: 'awaiting_payment'`. `canClientMarkPaid()` returns `false` by design.
- Only a server-side provider webhook may set `paid`. No such webhook exists yet.

## Bangladesh operator problem (unresolved)
- Stripe/PayPal standard country lists exclude Bangladesh. No gateway is connected.
- Original operator / partner in Belgium may be able to receive funds — unconfirmed.
- Trade licence / TIN / BIN are the near-term legal bottleneck for invoices.
- Do not promise: delivery dates, shipping prices, money-back guarantees, discount codes. None are agreed yet.

## What "done" looks like
1. Seller entity + registered address decided.
2. A settlement route confirmed in writing for that entity.
3. Provider-hosted checkout integrated server-side; webhook sets `paid`.
4. Invoice template with entity details, VAT/duty treatment per destination.
