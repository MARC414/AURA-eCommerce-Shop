import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  return {
    root: __dirname,
    publicDir: path.resolve(__dirname, 'public'),
    server: {
      port: Number(process.env.PORT || 3000),
      host: '0.0.0.0',
    },
    build: {
      outDir: path.resolve(__dirname, '..', 'dist'),
      emptyOutDir: true,
    },
    plugins: [react()],
    /* D-021: compiled Tailwind. The config path is explicit so the plugin is
       found regardless of which directory the build is started from. */
    css: {
      postcss: {
        plugins: [
          tailwindcss({ config: path.resolve(__dirname, '..', 'tailwind.config.js') }),
          autoprefixer(),
        ],
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': __dirname,
      }
    }
  };
});