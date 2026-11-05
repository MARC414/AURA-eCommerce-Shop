# AURA — Payments (2026-11-06)

## Rule
AURA never receives, stores, or transmits card numbers, expiry, or security codes. There is no card form anywhere. A future card payment is a redirect to a provider-hosted page.

## Current state: no gateway connected
- Enabled: `invoice` (request an invoice), `bank-transfer` (details on invoice after review).
- Disabled with plain reason shown: `card-hosted`, `wallet`.
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
