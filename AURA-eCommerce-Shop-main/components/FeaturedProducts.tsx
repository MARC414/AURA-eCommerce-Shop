/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Featured pieces — the reference sheet's product card, applied.
 *
 * Card pattern taken from the Moss reference: a light paper tile carrying the
 * photograph, then category, serif name, price row, and the Button-colour
 * pill. Nothing is invented: every piece here is a preview with no confirmed
 * price, so the row reads "Price on request" and the section says so. It is
 * not called "Best Sellers" because nothing has been sold yet.
 */

import React from 'react';
import products from '../data/pilot-products.json';

const FeaturedProducts: React.FC = () => (
  <section id="featured" className="border-b border-line/40 bg-canvas px-6 py-20 md:px-12 md:py-28">
    <div className="mx-auto max-w-[1580px]">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="mb-4 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-cta">
            <span aria-hidden="true" className="h-px w-10 bg-cta" />
            Featured pieces
          </span>
          <h2 className="font-serif text-4xl leading-[1.05] text-paper md:text-5xl">
            A first look at the shelf.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-body">
          Four previews: two OPAR house pieces and two partner offers. Prices are
          confirmed on the invoice, and nothing is charged on this site.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {products.map(product => {
          const affiliate = product.model === 'affiliate';
          const path = `/${affiliate ? 'discover' : 'shop'}/${product.slug}/`;
          const image = product.images[0];
          const priced = Number.isFinite(product.price);

          return (
            <article key={product.id} className="group flex flex-col">
              {/* The light tile is the point: supplier photographs are shot on
                  light backgrounds, so they belong on paper, not on the ground. */}
              <a
                href={path}
                aria-hidden="true"
                tabIndex={-1}
                className="relative block aspect-[4/5] overflow-hidden bg-paper"
              >
                <img
                  src={image.src}
                  alt=""
                  width="640"
                  height="640"
                  loading="lazy"
                  className="h-full w-full object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  onError={event => {
                    const target = event.currentTarget;
                    if (!target.src.endsWith('/assets/products/photography-pending.svg')) {
                      target.src = '/assets/products/photography-pending.svg';
                    }
                  }}
                />
                <span className="absolute left-3 top-3 border border-line/70 bg-paper/95 px-2.5 py-1 text-[8px] uppercase tracking-[0.14em] text-ink">
                  {affiliate ? 'Partner offer' : 'OPAR house'}
                </span>
                <span className="absolute bottom-3 right-3 text-[8px] uppercase tracking-[0.14em] text-ink/80">
                  Supplier photo
                </span>
              </a>

              <div className="flex flex-1 flex-col pt-6">
                <span className="text-[10px] uppercase tracking-[0.24em] text-cta">{product.category}</span>
                <h3 className="mt-3 font-serif text-2xl leading-snug text-paper">
                  <a
                    href={path}
                    className="transition-colors hover:text-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {product.name}
                  </a>
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-body">
                  {affiliate
                    ? `Seen at ${product.sourceName} · referral pending`
                    : 'Preview · ordering not open'}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-paper">
                    {priced ? `${product.currency ?? ''} ${product.price}` : 'Price on request'}
                  </span>
                  <a
                    href={path}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-cta px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    View piece
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line/60 pt-10 md:flex-row md:items-center">
        <p className="max-w-lg text-xs leading-relaxed text-body">
          Every piece page states what the supplier has confirmed, what is still
          unchecked, and what OPAR will not claim.
        </p>
        <a
          href="/shop/"
          className="inline-flex min-h-[52px] items-center gap-3 rounded-full bg-cta px-9 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink transition-colors duration-300 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          View all pieces
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
);

export default FeaturedProducts;
