/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Footer.
 *
 * Every line here is a claim, so every line has to be true. Removed in this
 * revision: invented organic certification, a delivery window that has not
 * been agreed, a money-back guarantee that does not exist yet, a discount
 * that was never authorised, and a link labelled "Dropship Admin Portal",
 * which leaked the supply chain.
 */

import React, { useState } from 'react';
import { LegalPolicyType } from '../types';
import { commerce } from '../services/commerce';

interface FooterProps {
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  onOpenPolicy: (policy: LegalPolicyType) => void;
  onOpenAdmin: () => void;
  onOpenSources?: () => void;
  onSelectCategory?: (categorySlug: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick, onOpenPolicy, onOpenAdmin, onOpenSources, onSelectCategory }) => {
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

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onSelectCategory(slug);
    }
  };

  return (
    <footer className="bg-[#EBE7DE] pt-24 pb-12 px-6 md:px-12 text-[#5D5A53]">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2.5 mb-3">
            <img 
              src="/assets/brand/orvanya-seed-orbit.svg" 
              alt="OPAR Seed and Orbit Emblem" 
              className="w-7 h-7 shrink-0"
              width="28"
              height="28"
            />
            <h4 className="text-3xl font-serif text-[#101B12]">OPAR</h4>
          </div>
          <p className="text-xs uppercase tracking-widest text-[#82915B] font-medium mb-3">A World of Conscious Living</p>
          <p className="max-w-xs font-light leading-relaxed text-sm mb-6 text-[#5D5A53]">
            Objects, books, instruments, and materials for conscious, contemplative living. The catalogue is being built one verified item at a time.
          </p>
          <div className="flex flex-col gap-1 text-xs text-[#82915B] font-medium">
            <span>· No health claims, ever</span>
            <span>· Every product page states what is still unverified</span>
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-medium text-[#2C2A26] mb-6 tracking-widest text-xs uppercase">Browse</h4>
          <ul className="space-y-3 text-xs font-light">
            <li><a href="#products" onClick={(e) => onLinkClick(e, 'products')} className="hover:text-[#2C2A26] transition-colors">The entire collection</a></li>
            <li><button onClick={() => handleCategoryClick('sacred-texts-philosophy')} className="hover:text-[#2C2A26] transition-colors text-left">Books &amp; sacred texts</button></li>
            <li><button onClick={() => handleCategoryClick('sacred-sound-music')} className="hover:text-[#2C2A26] transition-colors text-left">Music &amp; sound</button></li>
            <li><button onClick={() => handleCategoryClick('organic-quiet-tech')} className="hover:text-[#2C2A26] transition-colors text-left">Quiet technology</button></li>
            <li><button onClick={() => handleCategoryClick('yoga-materials')} className="hover:text-[#2C2A26] transition-colors text-left">Practice materials</button></li>
            {onOpenSources && (
              <li className="pt-2">
                <button
                  onClick={onOpenSources}
                  className="text-[#8C7355] font-medium hover:underline text-left flex items-center gap-1.5"
                >
                  <span>✦ Sourcing &amp; lineage directory</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-medium text-[#2C2A26] mb-6 tracking-widest text-xs uppercase">Help &amp; policies</h4>
          <ul className="space-y-3.5 text-xs font-light">
            <li>
              <button onClick={() => onOpenPolicy('shipping')} className="hover:text-[#2C2A26] transition-colors text-left">
                Shipping &amp; delivery
              </button>
            </li>
            <li>
              <button onClick={() => onOpenPolicy('refund')} className="hover:text-[#2C2A26] transition-colors text-left">
                Returns &amp; refunds
              </button>
            </li>
            <li>
              <button onClick={() => onOpenPolicy('privacy')} className="hover:text-[#2C2A26] transition-colors text-left">
                Privacy
              </button>
            </li>
            <li>
              <button onClick={() => onOpenPolicy('terms')} className="hover:text-[#2C2A26] transition-colors text-left">
                Terms of service
              </button>
            </li>
            <li>
              <button onClick={() => onOpenPolicy('faq')} className="hover:text-[#2C2A26] transition-colors text-left">
                Questions
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-medium text-[#2C2A26] mb-4 tracking-widest text-xs uppercase">The quiet dispatch</h4>
          <p className="text-xs font-light leading-relaxed mb-4">
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
              className="bg-transparent border-b border-[#A8A29E] py-2 text-sm outline-none focus:border-[#2C2A26] transition-colors placeholder-[#A8A29E]/70 text-[#2C2A26] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSaved || !email.trim()}
              className="self-start text-xs font-medium uppercase tracking-widest mt-2 hover:text-[#2C2A26] disabled:cursor-default disabled:opacity-50 transition-opacity"
            >
              {isSaved ? 'Saved on this device' : 'Add me to the list'}
            </button>
          </form>
          {message && (
            <p className={`text-[11px] mt-2 leading-relaxed ${isError ? 'text-[#7A4038]' : 'text-[#5D5A53]'}`}>
              {message}
            </p>
          )}
          {!message && (
            <p className="text-[10px] text-[#A8A29E] mt-2 leading-relaxed">
              No mailing provider is connected yet, so the address is stored in this browser only.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto pt-8 border-t border-[#D6D1C7] flex flex-col sm:flex-row justify-between items-center text-xs tracking-widest uppercase opacity-75 gap-4">
        <p>© 2026 OPAR · A World of Conscious Living · Preview build, not open for orders</p>
        <div className="flex items-center gap-6">
          <button onClick={() => onOpenPolicy('privacy')} className="hover:text-[#2C2A26] transition-colors">
            Privacy
          </button>
          <span>·</span>
          <button onClick={() => onOpenPolicy('terms')} className="hover:text-[#2C2A26] transition-colors">
            Terms
          </button>
          <span>·</span>
          <button onClick={onOpenAdmin} className="text-[#8C7355] font-medium hover:underline">
            Team access
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
