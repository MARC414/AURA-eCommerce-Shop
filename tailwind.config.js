/** @type {import('tailwindcss').Config} */

/*
  D-021: Tailwind is compiled at build time (no Play CDN). The Vite root is
  AURA-eCommerce-Shop-main, but npm scripts run from the repository root, so
  the content globs are written from the root and passed an explicit config
  path in vite.config.ts.

  D-032: the colour names below are the five colours sampled from the Moss
  reference sheet, plus the surfaces derived from them by mixing the ground
  with Main Text at the same ratios as the static token layer
  (public/assets/product-pages.css). Utility classes are the only place these
  hex values are written on the React side; components consume the names.

    canvas  #2F332B  ground        paper   #F4F2EE  Main Text / reading ground
    surface #3D4039  raised panel  body    #D0D3C4  Header / secondary ink
    well    #292D26  inset well    line    #4F524A  hairline
    ink     #2F332B  ink on fill   cta     #9AA66C  Button
                                   accent  #55632A  Accent (fill only)
*/
module.exports = {
  content: [
    './AURA-eCommerce-Shop-main/index.html',
    './AURA-eCommerce-Shop-main/index.tsx',
    './AURA-eCommerce-Shop-main/App.tsx',
    './AURA-eCommerce-Shop-main/constants.ts',
    './AURA-eCommerce-Shop-main/brand.config.ts',
    './AURA-eCommerce-Shop-main/components/**/*.{ts,tsx}',
    './AURA-eCommerce-Shop-main/services/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#2F332B',        // the ground
        surface: '#3D4039',       // ground + 7% Main Text
        well: '#292D26',          // ground − 12% value
        ink: '#2F332B',           // ink inside a Button fill or on paper
        paper: '#F4F2EE',         // Main Text; the reading ground
        'paper-raised': '#E2E1DC',
        body: '#D0D3C4',          // the reference's "Header" role
        line: '#4F524A',          // ground + 16% Main Text
        cta: '#9AA66C',           // the reference's "Button" role
        accent: '#55632A',        // the reference's "Accent" role (fill only)
      },
      fontFamily: {
        serif: ['var(--serif)'],
        sans: ['var(--sans)'],
      },
    },
  },
  plugins: [],
};
