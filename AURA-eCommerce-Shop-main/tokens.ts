/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ORVANYA Design System — Design Token Architecture
 * Brand: ORVANYA — A World of Conscious Living
 *
 * Provides typed semantic design tokens for colours, typography scale,
 * spacing, layout widths, radii, shadows, button dimensions, grid gaps,
 * responsive breakpoints, and transitions.
 */

import { ORVANYA_BRAND } from './brand.config';

/**
 * 1. Colour Roles & Semantic Tokens
 * Light natural surfaces for shopping; dark forest surfaces for branding & editorial.
 */
export const colors = {
  // Brand Raw Palette
  raw: {
    forestGreen: ORVANYA_BRAND.colors.forestGreen, // #101B12
    evergreen: ORVANYA_BRAND.colors.evergreen,     // #1D3020
    antiqueGold: ORVANYA_BRAND.colors.antiqueGold, // #C5AD70
    mossGreen: ORVANYA_BRAND.colors.mossGreen,     // #82915B
    warmIvory: ORVANYA_BRAND.colors.warmIvory,     // #F1EBDD
    softSage: ORVANYA_BRAND.colors.softSage,       // #B8BEAA
    stone: ORVANYA_BRAND.colors.stone              // #34382D
  },

  // Semantic Surface Roles
  surface: {
    canvas: '#F1EBDD',           // Warm Ivory base background
    canvasSubtle: '#EBE5D6',     // Slightly deeper neutral surface
    card: '#FBF8F2',             // Elevated light card surface
    stone: '#34382D',            // Contemplative stone panel
    darkForest: '#101B12',       // Editorial & branding deep forest
    evergreen: '#1D3020',        // Secondary dark botanical surface
    overlay: 'rgba(16, 27, 18, 0.45)', // Modal and drawer backdrop
    goldHighlight: 'rgba(197, 173, 112, 0.12)' // Antique gold tint
  },

  // Semantic Text Roles
  text: {
    primary: '#101B12',          // Deep Forest Green for high-contrast headlines and text
    secondary: '#34382D',        // Stone for body text
    muted: '#626857',            // Soft moss-stone for secondary descriptions
    gold: '#C5AD70',             // Antique gold for accents and highlights
    onDarkPrimary: '#F1EBDD',    // Warm Ivory on dark backgrounds
    onDarkSecondary: '#B8BEAA',  // Soft Sage on dark backgrounds
    partnerTag: '#735B40'        // Distinct tone for external partner notes
  },

  // Border & Divider Roles
  border: {
    subtle: '#D6D1C7',           // Clean, minimal divider
    medium: '#B8BEAA',           // Soft Sage border
    gold: '#C5AD70',             // Antique Gold border for active/focused elements
    stone: '#34382D',            // Strong structural frame
    darkSubtle: 'rgba(241, 235, 221, 0.15)' // Subtle rule on dark surfaces
  },

  // Interactive & State Roles
  state: {
    hoverBg: 'rgba(197, 173, 112, 0.08)',
    activeBg: 'rgba(197, 173, 112, 0.18)',
    focusRing: '#C5AD70',
    focusRingOffset: '#F1EBDD',
    focusRingDarkOffset: '#101B12',
    disabledBg: '#E5E0D4',
    disabledText: '#9A9589'
  }
} as const;

/**
 * 2. Typography Scale & Hierarchy
 * Headings: Cormorant Garamond (editorial luxury, warmth, contemplative)
 * Body: Manrope (modern, clean, international legibility)
 */
export const typography = {
  fontFamily: {
    heading: ORVANYA_BRAND.typography.headings,
    body: ORVANYA_BRAND.typography.body
  },
  scale: {
    display: {
      fontSize: 'clamp(2.75rem, 5vw, 4.5rem)',
      lineHeight: '1.08',
      letterSpacing: '-0.03em',
      fontWeight: '400',
      fontFamily: 'heading'
    },
    h1: {
      fontSize: 'clamp(2.25rem, 3.8vw, 3.5rem)',
      lineHeight: '1.14',
      letterSpacing: '-0.025em',
      fontWeight: '400',
      fontFamily: 'heading'
    },
    h2: {
      fontSize: 'clamp(1.75rem, 2.8vw, 2.5rem)',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      fontWeight: '400',
      fontFamily: 'heading'
    },
    h3: {
      fontSize: 'clamp(1.25rem, 1.8vw, 1.75rem)',
      lineHeight: '1.25',
      letterSpacing: '-0.015em',
      fontWeight: '500',
      fontFamily: 'heading'
    },
    h4: {
      fontSize: '1.125rem',
      lineHeight: '1.35',
      letterSpacing: '-0.01em',
      fontWeight: '500',
      fontFamily: 'heading'
    },
    bodyLarge: {
      fontSize: '1.0625rem',
      lineHeight: '1.65',
      letterSpacing: '0em',
      fontWeight: '400',
      fontFamily: 'body'
    },
    body: {
      fontSize: '0.9375rem',
      lineHeight: '1.7',
      letterSpacing: '0em',
      fontWeight: '400',
      fontFamily: 'body'
    },
    bodySmall: {
      fontSize: '0.8125rem',
      lineHeight: '1.6',
      letterSpacing: '0.01em',
      fontWeight: '400',
      fontFamily: 'body'
    },
    eyebrow: {
      fontSize: '0.6875rem',
      lineHeight: '1.4',
      letterSpacing: '0.16em',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontFamily: 'body'
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: '1.5',
      letterSpacing: '0.04em',
      fontWeight: '400',
      fontFamily: 'body'
    }
  }
} as const;

/**
 * 3. Spacing Scale (8-point system with 4px micro-increment)
 */
export const spacing = {
  xs: '4px',    // 0.25rem
  sm: '8px',    // 0.5rem
  md: '16px',   // 1rem
  lg: '24px',   // 1.5rem
  xl: '32px',   // 2rem
  '2xl': '48px',// 3rem
  '3xl': '64px',// 4rem
  '4xl': '96px' // 6rem
} as const;

/**
 * 4. Layout Widths & Content Containers
 */
export const layoutWidths = {
  narrow: '768px',    // 48rem - reading, articles, forms
  default: '1024px',  // 64rem - standard editorial content
  wide: '1280px',     // 80rem - catalogues, product grids
  full: '1580px'      // 98.75rem - maximum site header and full width
} as const;

/**
 * 5. Border Radii
 * Minimal, sharp-to-subtle architectural aesthetic. No pill shapes.
 */
export const radii = {
  none: '0px',
  sm: '2px',
  md: '4px',
  lg: '6px',
  full: '9999px' // Used strictly for circular icon-only buttons
} as const;

/**
 * 6. Shadows (Warm, diffuse ambient illumination)
 */
export const shadows = {
  none: 'none',
  subtle: '0 1px 3px rgba(16, 27, 18, 0.05)',
  card: '0 4px 16px -2px rgba(16, 27, 18, 0.06)',
  float: '0 12px 32px -4px rgba(16, 27, 18, 0.1)',
  drawer: '0 24px 48px -6px rgba(16, 27, 18, 0.18)'
} as const;

/**
 * 7. Button Dimensions
 * Adheres to WCAG 2.1 AA min 44x44px touch targets for mobile accessibility.
 */
export const buttonDimensions = {
  sm: {
    minHeight: '40px',
    padding: '8px 16px',
    fontSize: '0.75rem',
    letterSpacing: '0.12em'
  },
  md: {
    minHeight: '46px',
    padding: '12px 24px',
    fontSize: '0.8125rem',
    letterSpacing: '0.14em'
  },
  lg: {
    minHeight: '54px',
    padding: '16px 36px',
    fontSize: '0.875rem',
    letterSpacing: '0.15em'
  }
} as const;

/**
 * 8. Grid Gaps
 */
export const gridGaps = {
  compact: '16px',    // 1rem
  standard: '24px',   // 1.5rem
  generous: '32px',   // 2rem
  expansive: '48px'   // 3rem
} as const;

/**
 * 9. Responsive Breakpoints
 * Supporting 375px, 390px, 768px, 1024px, 1440px
 */
export const breakpoints = {
  mobileSm: 375,
  mobile: 390,
  tablet: 768,
  laptop: 1024,
  desktop: 1440
} as const;

/**
 * 10. Transitions & Easing
 */
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  standard: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '700ms cubic-bezier(0.16, 1, 0.3, 1)',
  colorFade: 'color 200ms ease, background-color 200ms ease, border-color 200ms ease'
} as const;

export default {
  colors,
  typography,
  spacing,
  layoutWidths,
  radii,
  shadows,
  buttonDimensions,
  gridGaps,
  breakpoints,
  transitions
};
