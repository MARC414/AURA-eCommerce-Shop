/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Footer.
 *
 * Every line here is a claim, so every line has to be true. Removed in an
 * earlier revision: invented organic certification, a delivery window that
 * has not been agreed, a money-back guarantee that does not exist yet, a
 * discount that was never authorised, and a link labelled "Dropship Admin
 * Portal", which leaked the supply chain.
 *
 * The footer is the dark forest branding surface, matching the generated pages.
 */

import React, { useState } from 'react';
import { LegalPolicyType } from '../types';
import { SHOP_ROOMS } from '../constants';
import { commerce } from '../services/commerce';

interface FooterProps {
  onOpenPolicy: (policy: LegalPolicyType) => void;
  onOpenAdmin: () => void;
  onOpenSources?: () => void;
  onSelectCategory?: (categorySlug: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenPolicy, onOpenAdmin, onOpenSources }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    const result = commerce.subscribe(email, 'footer');
    setIsError(!result.ok);
    setIsSaved(result.ok);
    setMessage(result.message);
    if (result.ok) setEmail('');
  };

  return (
    <footer className="border-t border-line bg-well px-6 pb-12 pt-24 text-body md:px-12">
      <div className="mx-auto mb-20 grid max-w-[1580px] grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <a href="/" className="mb-4 flex w-fit items-center gap-3 text-paper">
            {/* Plate-free emblem, inked for the dark ground. */}
            <img
              src="/assets/brand/opar-seed-orbit-on-dark.png"
              alt=""
              width={28}
              height={28}
              className="h-[28px] w-[28px] object-contain"
            />
            <span className="font-serif text-3xl">OPAR</span>
          </a>
          <p className="mb-6 max-w-xs text-sm font-light leading-relaxed">
            A small shop for a slower, more sensory life: instruments, art, books, quiet technology, and the materials of
            practice. The catalogue is being built one verified item at a time.
          </p>
          <div className="flex flex-col gap-1 text-xs font-medium text-cta">
            <span>· No health claims, ever</span>
            <span>· Every product page states what is still unverified</span>
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-paper">Browse</h4>
          <ul className="space-y-3 text-xs font-light">
            <li>
              <a href="/shop/" className="transition-colors hover:text-paper">The entire shop</a>
            </li>
            {SHOP_ROOMS.map(room => (
              <li key={room.slug}>
                <a href={`/shop/${room.slug}/`} className="transition-colors hover:text-paper">{room.title}</a>
              </li>
            ))}
            {onOpenSources && (
              <li className="pt-2">
                <button
                  onClick={onOpenSources}
                  className="flex items-center gap-1.5 text-left font-medium text-cta hover:underline"
                >
                  <span>✦ Sourcing &amp; lineage directory</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-paper">Help &amp; policies</h4>
          <ul className="space-y-3.5 text-xs font-light">
            <li><a href="/policies/shipping/" className="transition-colors hover:text-paper">Shipping &amp; delivery</a></li>
            <li><a href="/policies/returns/" className="transition-colors hover:text-paper">Returns &amp; refunds</a></li>
            <li><a href="/policies/privacy/" className="transition-colors hover:text-paper">Privacy</a></li>
            <li><a href="/policies/terms/" className="transition-colors hover:text-paper">Terms of service</a></li>
            <li><a href="/help/" className="transition-colors hover:text-paper">Questions</a></li>
            <li>
              <button
                onClick={() => onOpenPolicy('faq')}
                className="text-left transition-colors hover:text-paper"
              >
                Concierge answers
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-paper">The quiet dispatch</h4>
          <p className="mb-4 text-xs font-light leading-relaxed">
            Occasional notes when something real is added. No schedule, no urgency.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input
              id="footer-email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSaved}
              className="border-b border-line bg-transparent py-2 text-sm text-paper outline-none transition-colors placeholder:text-body/50 focus:border-cta disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSaved || !email.trim()}
              className="mt-2 self-start text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:text-cta disabled:cursor-default disabled:opacity-50"
            >
              {isSaved ? 'Saved on this device' : 'Add me to the list'}
            </button>
          </form>
          {message && (
            <p className={`mt-2 text-[11px] leading-relaxed ${isError ? 'text-[#E0A798]' : 'text-body'}`}>
              {message}
            </p>
          )}
          {!message && (
            <p className="mt-2 text-[10px] leading-relaxed text-body/60">
              No mailing provider is connected yet, so the address is stored in this browser only.
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1580px] flex-col items-center justify-between gap-4 border-t border-line/60 pt-8 text-xs uppercase tracking-[0.2em] opacity-75 sm:flex-row">
        <p>© 2026 OPAR · Preview build, not open for orders</p>
        <div className="flex items-center gap-6">
          <a href="/policies/privacy/" className="transition-colors hover:text-paper">Privacy</a>
          <span aria-hidden="true">·</span>
          <a href="/policies/terms/" className="transition-colors hover:text-paper">Terms</a>
          <span aria-hidden="true">·</span>
          <button onClick={onOpenAdmin} className="font-medium text-cta hover:underline">
            Team access
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
