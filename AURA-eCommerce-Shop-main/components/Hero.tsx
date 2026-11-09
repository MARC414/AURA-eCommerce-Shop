/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Hero.
 *
 * The dark Moss ground carries the first impression. A photography slot is
 * reserved but empty: supplier or stock imagery is never used as brand art, so
 * the owner's own photographs drop into the marked element later.
 */

import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative flex min-h-[88svh] w-full items-end overflow-hidden bg-canvas">

      {/* Photography slot — reserve only. Add the owner-supplied image here. */}
      <div className="absolute inset-0" data-photography-slot="hero" aria-hidden="true" />

      {/* Grain: the ground should never read as flat digital green. */}
      <div className="grain absolute inset-0" aria-hidden="true" />

      {/* Tonal veil so type stays legible over any future photograph. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas via-canvas/55 to-canvas/10" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1580px] px-6 pb-24 pt-40 md:px-12 md:pb-28">
        <p className="mb-10 flex items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-brass">
          <span aria-hidden="true" className="h-px w-12 bg-brass/70" />
          OPAR
        </p>

        <h1 className="max-w-5xl font-serif text-[clamp(3.2rem,9vw,8rem)] font-normal leading-[0.92] tracking-[-0.02em] text-paper">
          A world of
          <br />
          <span className="italic text-paper/75">conscious living.</span>
        </h1>

        <p className="mt-10 max-w-xl text-sm font-light leading-relaxed text-paper/70 md:text-base">
          Objects and knowledge for a slower, more sensory life — herbs, everyday care, sound, practice
          and craft, described honestly. Ordering opens after the first pieces are verified.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="/shop/"
            className="inline-flex min-h-[52px] items-center border border-brass px-9 text-[10px] font-semibold uppercase tracking-[0.24em] text-brass transition-colors duration-300 hover:bg-brass hover:text-ink"
          >
            Enter the shop
          </a>
          <a
            href="/about/"
            className="inline-flex min-h-[52px] items-center border border-paper/25 px-9 text-[10px] font-semibold uppercase tracking-[0.24em] text-paper/80 transition-colors duration-300 hover:border-paper hover:text-paper"
          >
            About OPAR
          </a>
        </div>
      </div>

      {/* Hairline base: the gold rule closes the ground. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-brass/20" aria-hidden="true" />
    </section>
  );
};

export default Hero;
