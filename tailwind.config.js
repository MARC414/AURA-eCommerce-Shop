/** @type {import('tailwindcss').Config} */

/*
  D-021: Tailwind is compiled at build time (no Play CDN). The Vite root is
  AURA-eCommerce-Shop-main, but npm scripts run from the repository root, so
  the content globs are written from the root and passed an explicit config
  path in vite.config.ts.

  Colours mirror the D-030 roles: the dark Moss ground is the site canvas and
  the cool ivory paper is the reading surface. Utility classes are the only
  place these hex values are written on the React side; components consume
  the semantic names.
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
        canvas: '#28332A',        // D-030 ground
        surface: '#31402F',       // raised panel on the ground
        well: '#22301F',          // inset well on the ground
        ink: '#1A231C',           // ink on paper / gold
        paper: '#EFF1E7',         // D-030 cool ivory reading paper
        'paper-raised': '#E7EADF',
        body: '#C6CCBD',          // body copy on the ground
        line: '#4A5443',          // hairline on the ground
        brass: '#C5AD70',         // antique gold: hairlines, eyebrows, counts
        moss: '#82915B',          // large text only
        forest: '#101B12',
        sage: '#B8BEAA',
      },
      fontFamily: {
        serif: ['var(--serif)'],
        sans: ['var(--sans)'],
      },
    },
  },
  plugins: [],
};
