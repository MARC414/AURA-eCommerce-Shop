/**
 * The admin panel's dev server, and nothing else.
 *
 * Until T4 this config built the storefront. It does not any more: the
 * storefront is generated HTML in `public/`, `npm run build` copies it to
 * `dist/`, and no step in that path runs Vite. `npm run dev:admin` opens
 * admin.html here, which is the only page Vite still serves.
 *
 * That is why `outDir` is not set to `../dist`: a production build from this
 * config would write a React bundle into the tree that copy-site.mjs empties
 * and refills. Do not add a `build` target to this file without deciding that
 * something is meant to ship.
 */
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
