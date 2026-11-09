/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Newsletter capture for the admin panel.
 *
 * This file used to own a second cart: `getCart`, `addToCart`, `cartSubtotal`
 * and the rest, all reading `aura_cart_v1` alongside the static store in
 * `public/assets/cart.js`. Since T4 the static store is the only cart - the
 * cart is `/cart/`, the checkout is `/checkout/`, and both are plain pages that
 * need no React. What survives here is the one job the static pages cannot do
 * for the owner: reading and exporting the addresses the newsletter page saved
 * in this browser.
 *
 * `aura_newsletter_v1` is written by cart.js. Keep the key and the record shape
 * in step with `saveNewsletter()` there; `npm run test:templates` checks it.
 *
 * Everything here is browser-local. The UI must not claim an email was sent,
 * because no mailing provider is connected.
 */

import { NewsletterSubscriber } from '../types';

const NEWSLETTER_KEY = 'aura_newsletter_v1';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readSubscribers(): NewsletterSubscriber[] {
  try {
    const raw = localStorage.getItem(NEWSLETTER_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`Could not read ${NEWSLETTER_KEY}`, error);
    return [];
  }
}

function writeSubscribers(subscribers: NewsletterSubscriber[]): void {
  try {
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subscribers));
  } catch (error) {
    console.warn(`Could not write ${NEWSLETTER_KEY}`, error);
  }
}

export interface SubscribeResult {
  ok: boolean;
  message: string;
  subscriber?: NewsletterSubscriber;
}

export const commerce = {
  getSubscribers(): NewsletterSubscriber[] {
    return readSubscribers();
  },

  /**
   * Records consent locally. No mailing provider is connected, so the
   * subscriber is stored as `queued`, not `sent`.
   */
  subscribe(email: string, source = 'footer'): SubscribeResult {
    const clean = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(clean)) {
      return { ok: false, message: 'That email address does not look complete.' };
    }

    const subscribers = readSubscribers();
    if (subscribers.some(entry => entry.email === clean && entry.status !== 'unsubscribed')) {
      return { ok: false, message: 'This address is already on the list.' };
    }

    const subscriber: NewsletterSubscriber = {
      email: clean,
      consentAt: new Date().toISOString(),
      source,
      status: 'pending-confirmation',
      delivery: 'queued'
    };

    writeSubscribers([...subscribers, subscriber]);
    return {
      ok: true,
      message: 'Saved on this device. A confirmation email will be sent once a mailing provider is connected.',
      subscriber
    };
  },

  unsubscribe(email: string): void {
    const clean = email.trim().toLowerCase();
    writeSubscribers(
      readSubscribers().map(entry =>
        entry.email === clean ? { ...entry, status: 'unsubscribed' as const } : entry
      )
    );
  },

  exportSubscribersCSV(): void {
    const subscribers = readSubscribers();
    if (subscribers.length === 0) return;
    const headers = ['Email', 'Consent At', 'Source', 'Status', 'Delivery'];
    const rows = subscribers.map(entry => [
      entry.email,
      entry.consentAt,
      entry.source,
      entry.status,
      entry.delivery
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `aura-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
