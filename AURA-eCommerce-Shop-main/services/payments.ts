/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Payment providers.
 *
 * Hard rule: AURA never receives, stores, or transmits card numbers,
 * expiry dates, or security codes. A card payment is always a redirect
 * to a provider-hosted page. This module only describes which routes
 * exist and whether they are live.
 *
 * No provider is connected yet. That is represented as `enabled: false`
 * with a plain reason, never as a simulated success.
 */

import { PaymentMethod, PaymentProvider } from '../types';

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: 'invoice',
    name: 'Request an invoice',
    kind: 'manual',
    enabled: true,
    settlementCountries: ['Worldwide'],
    note: 'AURA reviews the order, confirms stock and shipping, then emails an invoice with a payment link. Nothing is charged at this step.'
  },
  {
    id: 'bank-transfer',
    name: 'Bank transfer',
    kind: 'manual',
    enabled: true,
    settlementCountries: ['Worldwide'],
    note: 'Bank details are included with the invoice after the order is reviewed. The order stays awaiting payment until funds clear.'
  },
  {
    id: 'card-hosted',
    name: 'Card payment',
    kind: 'hosted',
    enabled: false,
    unavailableReason: 'No card provider is connected yet.',
    settlementCountries: [],
    note: 'Card details would be entered on the provider’s own secure page. AURA would never see or store them.'
  },
  {
    id: 'wallet',
    name: 'Mobile wallet',
    kind: 'hosted',
    enabled: false,
    unavailableReason: 'No wallet provider is connected yet.',
    settlementCountries: [],
    note: 'For bKash, Nagad, or a similar wallet once a merchant account exists.'
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    kind: 'manual',
    enabled: false,
    unavailableReason: 'Owner holds Payoneer. Not yet connected as a settlement route.',
    settlementCountries: [],
    note: 'Payoneer can RECEIVE money (e.g. via USD bank details / payment requests) but it is not a hosted checkout: it cannot take a customer card payment on the AURA page. Usable only as: AURA invoices the customer, customer pays to the Payoneer-linked account, AURA confirms receipt, then fulfils. Requires: trading entity details on the invoice and confirmation that the Payoneer account can issue receiving details for that entity/country. Until then it stays disabled.'
  }
];

export function getProvider(id: PaymentMethod): PaymentProvider | undefined {
  return PAYMENT_PROVIDERS.find(provider => provider.id === id);
}

export function enabledProviders(): PaymentProvider[] {
  return PAYMENT_PROVIDERS.filter(provider => provider.enabled);
}

/** The default route while no gateway exists. Honest and usable today. */
export const DEFAULT_PROVIDER: PaymentMethod = 'invoice';

export interface OrderRequest {
  provider: PaymentMethod;
  email: string;
  note?: string;
}

/**
 * A payment can only be marked paid by a provider webhook on the server.
 * The client may create an order; it may never assert that money arrived.
 */
export function canClientMarkPaid(): false {
  return false;
}

/** Fields that must never appear in a checkout form. Used by the test suite. */
export const FORBIDDEN_CARD_FIELDS = [
  'cardNumber',
  'cardExpiry',
  'cardCvv',
  'cardCVC',
  'cardName',
  'securityCode'
] as const;
