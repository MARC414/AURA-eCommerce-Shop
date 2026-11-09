/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Central Brand Configuration for OPAR
 * 
 * This file serves as the single source of truth for:
 * - Brand identity (name, tagline, wordmark, logo paths)
 * - Color tokens (Forest Green, Evergreen, Antique Gold, Moss Green, Warm Ivory, Soft Sage, Stone)
 * - Typography (Cormorant Garamond for headings, Manrope for body copy)
 * 
 * In accordance with Task 02, this provides a unified brand definition without
 * forcing a disruptive total website redesign.
 */

export interface BrandColorPalette {
  forestGreen: string;
  evergreen: string;
  antiqueGold: string;
  mossGreen: string;
  warmIvory: string;
  softSage: string;
  stone: string;
}

export interface BrandTypography {
  headings: string;
  body: string;
  googleFontsLink: string;
}

export interface BrandLogo {
  symbolName: string;
  assetPath: string;
  altText: string;
  fallbackIcon: string;
}

export interface BrandConfiguration {
  name: string;
  tagline: string;
  shortDescriptor: string;
  logo: BrandLogo;
  colors: BrandColorPalette;
  typography: BrandTypography;
}

export const OPAR_BRAND: BrandConfiguration = {
  name: 'OPAR',
  tagline: 'A World of Conscious Living',
  shortDescriptor: 'Objects and knowledge for conscious, contemplative living.',
  logo: {
    symbolName: 'Seed + Orbit emblem',
    assetPath: '/assets/brand/orvanya-seed-orbit.svg',
    altText: 'OPAR — Seed + Orbit Emblem',
    fallbackIcon: 'seed-orbit'
  },
  colors: {
    forestGreen: '#101B12',
    evergreen: '#1D3020',
    antiqueGold: '#C5AD70',
    mossGreen: '#82915B',
    warmIvory: '#F1EBDD',
    softSage: '#B8BEAA',
    stone: '#34382D'
  },
  typography: {
    headings: "'Cormorant Garamond', Georgia, serif",
    body: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    googleFontsLink: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap'
  }
} as const;

export default OPAR_BRAND;
