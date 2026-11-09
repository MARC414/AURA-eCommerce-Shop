/**
 * OPAR central brand configuration.
 *
 * This file is the typed React-side view of `data/brand.json`, which is the
 * single brand contract shared with the static page generator
 * (scripts/generate-product-pages.mjs and templates/product-pages.mjs).
 * Change brand values in data/brand.json, not here.
 */

import brandData from './data/brand.json';

export const BRAND = brandData;

export const OPAR_BRAND = {
  name: BRAND.name,
  wordmark: BRAND.wordmark,
  tagline: BRAND.tagline,
  description: BRAND.description,
  logo: BRAND.logo,
  colors: BRAND.colors,
  typography: BRAND.typography
} as const;

export type OparBrand = typeof OPAR_BRAND;

/** Convenience accessors used by the React chrome (Navbar, Footer). */
export const BRAND_NAME = OPAR_BRAND.wordmark;
export const BRAND_TAGLINE = OPAR_BRAND.tagline;

/**
 * Design tokens mirrored as CSS custom properties. The canonical live values
 * are declared in public/assets/product-pages.css (:root) and index.css;
 * this record documents the contract for React components.
 */
export const DESIGN_TOKENS = {
  color: {
    ground: BRAND.colors.ground,
    mainText: BRAND.colors.mainText,
    header: BRAND.colors.header,
    button: BRAND.colors.button,
    accent: BRAND.colors.accent
  },
  font: {
    headings: "'Cormorant Garamond', Georgia, serif",
    body: "'Manrope', 'Segoe UI', Arial, sans-serif"
  }
} as const;
