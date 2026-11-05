/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import products from '../data/pilot-products.json';

/** Links the new HTML pages into the existing storefront without changing its catalogue. */
const PilotProducts: React.FC = () => (
  <section id="pilot-products" className="py-20 px-6 md:px-12 bg-[#F5F2EB] border-b border-[#D6D1C7]">
    <div className="max-w-[1800px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#735B40] font-medium block mb-3">AURA · Product-page previews</span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2C2A26]">Two ways to discover.</h2>
        </div>
        <p className="text-sm text-[#5D5A53] leading-relaxed max-w-md">Our first shop page and our first external-offer page. These layouts are for browsing; AURA orders and payments are not enabled.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl">
        {products.map(product => {
          const affiliate = product.model === 'affiliate';
          const path = `/${affiliate ? 'discover' : 'shop'}/${product.slug}/`;
          const image = product.images[0];
          return (
            <article key={product.id} className="group">
              <a href={path} aria-hidden="true" tabIndex={-1} className="block relative aspect-[4/5] bg-[#EBE7DE] overflow-hidden">
                <img src={image.src} alt="" width="640" height="640" loading="lazy" className="w-full h-full object-contain" onError={event => {
                  const target = event.currentTarget;
                  if (!target.src.endsWith('/assets/products/photography-pending.svg')) target.src = '/assets/products/photography-pending.svg';
                }} />
                <span className="absolute top-4 left-4 px-3 py-1.5 text-[10px] uppercase tracking-wider bg-[#F5F2EB] text-[#2C2A26] border border-[#D6D1C7]">{affiliate ? 'Affiliate / referral' : 'Dropshipping · Preview'}</span>
              </a>
              <div className="pt-5">
                <span className="text-[11px] uppercase tracking-widest text-[#735B40]">{product.category}</span>
                <h3 className="text-2xl font-serif mt-2 mb-2"><a href={path} className="inline-flex items-center justify-between gap-4 w-full min-h-[44px] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{product.name}<span aria-hidden="true">→</span></a></h3>
                <p className="text-xs text-[#5D5A53]">{affiliate ? `View with ${product.sourceName} · Referral eligibility pending` : 'Coming soon · Ordering closed'}</p>
              </div>
            </article>
          );
        })}
      </div>
      <a href="/templates/" className="inline-flex items-center gap-3 min-h-[44px] text-xs uppercase tracking-widest mt-8 text-[#735B40] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">View both templates <span aria-hidden="true">→</span></a>
    </div>
  </section>
);

export default PilotProducts;
