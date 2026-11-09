/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Hero.
 *
 * The dark Moss ground carries the first impression, and the owner's own OPAR
 * landscape — snow peaks above a forested valley — opens it. Photography is
 * never supplier or stock art.
 *
 * Three layers keep the type honest over a bright photograph:
 *   1. a restrained multiply grade so the image reads as part of the palette,
 *   2. a top scrim, because the transparent navbar sits on sky at scroll 0,
 *   3. a base scrim, because the headline and body copy sit on the treeline.
 * Contrast targets: nav and body ≥ 4.5:1, display headline far above that.
 */

import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative flex min-h-[88svh] w-full items-end overflow-hidden bg-canvas">

      {/* Photography slot — the owner-supplied OPAR landscape. Decorative:
          the headline carries the meaning, so it stays out of the a11y tree. */}
      <div className="absolute inset-0" data-photography-slot="hero" aria-hidden="true">
        <img
          src="/assets/brand/hero-opar.jpg"
          alt=""
          width={2000}
          height={1333}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[50%_45%]"
        />
      </div>

      {/* Brand grade: pull the photograph toward the ground so the picture and
          the palette behave as one system. Kept low — the image should still
          look like a photograph, not a filter. */}
      <div
        className="pointer-events-none absolute inset-0 bg-canvas/15 mix-blend-multiply"
        aria-hidden="true"
      />

      {/* Grain: the ground should never read as flat digital green. */}
      <div className="grain absolute inset-0" aria-hidden="true" />

      {/* Scrims: top for the transparent navbar, base for the type. */}
      <div className="hero-scrim-top pointer-events-none absolute inset-x-0 top-0 h-44" aria-hidden="true" />
      <div className="hero-scrim-base pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1580px] px-6 pb-24 pt-40 md:px-12 md:pb-28">
        {/* The overline is set in Main Text, not the Button colour: the button
            colour is a 4.94:1 mid-tone and cannot hold small type over a
            photograph. It keeps the rule and the primary CTA, where the pill
            sits on the darkened base. */}
        <p className="mb-10 flex items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-paper">
          <span aria-hidden="true" className="h-px w-12 bg-cta" />
          OPAR
        </p>

        <h1 className="max-w-5xl font-serif text-[clamp(3.2rem,9vw,8rem)] font-normal leading-[0.92] tracking-[-0.02em] text-paper">
          A world of
          <br />
          <span className="italic text-paper/75">conscious living.</span>
        </h1>

        <p className="mt-10 max-w-xl text-sm font-light leading-relaxed text-paper/80 md:text-base">
          Objects and knowledge for a slower, more sensory life — herbs, everyday care, sound, practice
          and craft, described honestly. Ordering opens after the first pieces are verified.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="/shop/"
            className="inline-flex min-h-[52px] items-center rounded-full bg-cta px-9 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink transition-colors duration-300 hover:bg-paper"
          >
            Enter the shop
          </a>
          <a
            href="/about/"
            className="inline-flex min-h-[52px] items-center rounded-full border border-paper/25 px-9 text-[10px] font-semibold uppercase tracking-[0.24em] text-paper/80 transition-colors duration-300 hover:border-paper hover:text-paper"
          >
            About OPAR
          </a>
        </div>
      </div>

      {/* Hairline base: the Button colour closes the ground. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-cta/25" aria-hidden="true" />
    </section>
  );
};

export default Hero;
