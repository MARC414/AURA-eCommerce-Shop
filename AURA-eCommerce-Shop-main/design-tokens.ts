/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Design Tokens
 * Single source of truth for the OPAR Premium Design System.
 * 
 * Brand: OPAR — A World of Conscious Living
 */

import { OPAR_BRAND } from './brand.config';

export const tokens = {
  colors: {
    // Core Brand Palette
    forestGreen: OPAR_BRAND.colors.forestGreen, // #101B12 - Deep grounding dark
    evergreen: OPAR_BRAND.colors.evergreen,     // #1D3020 - Secondary dark editorial
    antiqueGold: OPAR_BRAND.colors.antiqueGold, // #C5AD70 - Primary refinement accent
    mossGreen: OPAR_BRAND.colors.mossGreen,     // #82915B - Natural harmony
    warmIvory: OPAR_BRAND.colors.warmIvory,     // #F1EBDD - Primary natural canvas
    softSage: OPAR_BRAND.colors.softSage,       // #B8BEAA - Subtle atmospheric tint
    stone: OPAR_BRAND.colors.stone,             // #34382D - Earth neutral

    // Semantic Roles
    canvas: '#F1EBDD',            // Natural shopping surface
    canvasSubtle: '#EBE7DE',      // Secondary surface / card backdrop
    canvasDark: '#101B12',        // Editorial & dark banner surface
    canvasDarkSubtle: '#1D3020',  // Editorial secondary surface
    
    text: {
      primary: '#101B12',         // High-contrast primary reading
      secondary: '#5D5A53',       // Muted descriptions & metadata
      muted: '#82915B',           // Botanical & secondary note
      accent: '#C5AD70',          // Editorial kicker & gold highlights
      light: '#F1EBDD',           // Text on dark surfaces
      lightMuted: '#B8BEAA'       // Secondary text on dark surfaces
    },

    border: {
      subtle: '#D6D1C7',          // Hairline divider on light surface
      medium: '#B8BEAA',          // Noticeable framing border
      accent: '#C5AD70',          // Active highlight border
      darkSubtle: '#34382D'       // Divider on dark surfaces
    },

    badge: {
      dropship: {
        bg: '#F1EBDD',
        text: '#101B12',
        border: '#C5AD70'
      },
      affiliate: {
        bg: '#EBE7DE',
        text: '#34382D',
        border: '#82915B'
      },
      verified: {
        bg: '#E7EFE6',
        text: '#1D3020',
        border: '#82915B'
      },
      pending: {
        bg: '#F6EFDD',
        text: '#5D5A53',
        border: '#C5AD70'
      }
    }
  },

  typography: {
    fonts: {
      heading: OPAR_BRAND.typography.headings,
      body: OPAR_BRAND.typography.body
    },
    scale: {
      hero: 'clamp(2.4rem, 4vw, 3.8rem)',
      h1: 'clamp(2rem, 3.2vw, 3rem)',
      h2: 'clamp(1.6rem, 2.5vw, 2.25rem)',
      h3: '1.5rem',
      h4: '1.25rem',
      bodyLarge: '1.125rem',
      body: '0.9375rem',
      bodySmall: '0.8125rem',
      caption: '0.75rem',
      eyebrow: '0.6875rem'
    },
    letterSpacing: {
      tighter: '-0.035em',
      tight: '-0.02em',
      normal: '0',
      wide: '0.08em',
      wider: '0.14em',
      widest: '0.2em'
    },
    lineHeight: {
      tight: '1.15',
      heading: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '1.9'
    }
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '80px',
    '5xl': '96px'
  },

  layout: {
    maxWidth: '1440px',
    contentWidth: '1200px',
    proseWidth: '760px',
    compactWidth: '960px',
    headerHeight: '64px',
    minTouchTarget: '44px'
  },

  radii: {
    none: '0px',
    sm: '2px',
    md: '4px',
    lg: '8px',
    full: '9999px'
  },

  shadows: {
    none: 'none',
    subtle: '0 1px 3px rgba(16, 27, 18, 0.05)',
    soft: '0 4px 14px rgba(16, 27, 18, 0.07)',
    elevated: '0 14px 34px rgba(16, 27, 18, 0.09)',
    cardHover: '0 8px 24px rgba(16, 27, 18, 0.08)'
  },

  button: {
    dimensions: {
      sm: { minHeight: '38px', py: '8px', px: '14px', fontSize: '11px' },
      md: { minHeight: '44px', py: '12px', px: '20px', fontSize: '11px' },
      lg: { minHeight: '56px', py: '16px', px: '28px', fontSize: '12px' }
    }
  },

  gridGaps: {
    sm: '16px',
    md: '24px',
    lg: '40px',
    xl: '64px'
  },

  breakpoints: {
    mobileSm: '375px',
    mobile: '390px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1440px'
  },

  transitions: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
    slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
    lift: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1)'
  }
} as const;

export default tokens;
