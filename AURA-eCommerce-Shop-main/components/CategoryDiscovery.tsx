/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Room index — the shop's categories as a contents page.
 *
 * The six rooms are read from `data/collections.json`, the same file the static
 * generator uses to build each room page, so the label, the description and the
 * destination cannot drift from the pages that exist. Nothing is written here:
 * no counts, no ratings, no "explore" filler, and no image slots — photography
 * arrives later as the tile above the name, without changing this layout.
 *
 * Composition follows the reference: squared edges, hairline rules, an index
 * numeral in the Accent, Cormorant for the name, Manrope for the line beneath.
 * The Accent is decorative only (1.97:1 on the ground), so no text that must be
 * read is set in it; the numeral is `aria-hidden` and the names are Main Text.
 */

import React from 'react';
import rooms from '../data/collections.json';

const CategoryDiscovery: React.FC = () => (
  <section id="rooms" aria-labelledby="rooms-heading" className="bg-canvas px-6 py-20 md:px-12 md:py-28">
    <div className="mx-auto max-w-[1580px]">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="mb-4 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-cta">
            <span aria-hidden="true" className="h-px w-10 bg-cta" />
            The shop
          </span>
          <h2 id="rooms-heading" className="font-serif text-4xl leading-[1.05] text-paper md:text-5xl">
            Start with a room.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-body">
          The shop is arranged as rooms rather than one long list. Each room has its own page showing what is listed
          there now.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <li key={room.slug}>
            <a
              href={`/shop/${room.slug}/`}
              className="group flex h-full flex-col border-t border-line/70 pb-8 pt-6 transition-colors duration-300 hover:border-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none md:pb-9 md:pt-7"
            >
              <span className="flex items-baseline justify-between gap-4">
                {/* Ordinal, not a stock level: it says where you are in the list. */}
                <span aria-hidden="true" className="font-serif text-base tabular-nums text-cta">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className="text-sm text-body transition duration-300 group-hover:translate-x-1 group-hover:text-cta motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                >
                  →
                </span>
              </span>

              <h3 className="mt-5 font-serif text-[1.55rem] leading-snug text-paper transition-colors duration-300 group-hover:text-cta motion-reduce:transition-none md:mt-6">
                {room.heading}
              </h3>
              <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-body">{room.intro}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default CategoryDiscovery;
