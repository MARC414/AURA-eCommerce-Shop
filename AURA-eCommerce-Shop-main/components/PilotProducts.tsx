/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Pilot products: the verified previews that link into the generated HTML
 * pages. No prices, ratings or stock are invented here; the static pages carry
 * the full disclosure.
 */

import React from 'react';
import products from '../data/pilot-products.json';

const PilotProducts: React.FC = () => (
  <section id="pilot-products" className="border-b border-line/40 bg-canvas px-6 py-20 md:px-12 md:py-28">
    <div className="mx-auto max-w-[1580px]">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.3em] text-brass">
            OPAR · Current shop previews
          </span>
          <h2 className="font-serif text-4xl leading-tight text-paper md:text-5xl">Two ways to discover.</h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-body">
          House pieces and partner offers are described on their own pages, with the unverified details
          stated. OPAR orders and payments are not enabled in this preview build.
        </p>
      </div>

      <div className="grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        {products.map(product => {
          const affiliate = product.model === 'affiliate';
          const path = `/${affiliate ? 'discover' : 'shop'}/${product.slug}/`;
          const image = product.images[0];
          return (
            <article key={product.id} className="group">
              <a href={path} aria-hidden="true" tabIndex={-1} className="relative block aspect-[4/5] overflow-hidden bg-paper-raised">
                <img
                  src={image.src}
                  alt=""
                  width="640"
                  height="640"
                  loading="lazy"
                  className="h-full w-full object-contain"
                  onError={event => {
                    const target = event.currentTarget;
                    if (!target.src.endsWith('/assets/products/photography-pending.svg')) {
                      target.src = '/assets/products/photography-pending.svg';
                    }
                  }}
                />
                <span className="absolute left-4 top-4 border border-line/60 bg-canvas/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-paper">
                  {affiliate ? 'Partner / referral' : 'OPAR house · Preview'}
                </span>
              </a>
              <div className="pt-6">
                <span className="text-[10px] uppercase tracking-[0.24em] text-brass">{product.category}</span>
                <h3 className="mb-2 mt-3 font-serif text-2xl leading-snug">
                  <a
                    href={path}
                    className="inline-flex min-h-[44px] w-full items-center justify-between gap-4 text-paper transition-colors hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {product.name}
                    <span aria-hidden="true">→</span>
                  </a>
                </h3>
                <p className="text-xs leading-relaxed text-body">
                  {affiliate
                    ? `View with ${product.sourceName} · Referral eligibility pending`
                    : 'Coming soon · Ordering closed'}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <a
        href="/shop/"
        className="mt-12 inline-flex min-h-[44px] items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-brass transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        Browse the shop
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </section>
);

export default PilotProducts;
