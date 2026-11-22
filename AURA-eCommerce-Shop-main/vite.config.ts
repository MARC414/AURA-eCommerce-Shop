import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function staticDirectoryRoutingPlugin(publicDir: string): Plugin {
  const attach = (middlewares: { use: Function }) => {
    middlewares.use((req: any, res: any, next: Function) => {
      if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) return next();
      const [rawPath, query = ''] = req.url.split('?');
      if (
        rawPath === '/' ||
        rawPath.startsWith('/@') ||
        rawPath.startsWith('/src/') ||
        rawPath.startsWith('/node_modules/') ||
        rawPath.startsWith('/assets/') ||
        rawPath.startsWith('/api/') ||
        rawPath === '/admin.html'
      ) {
        return next();
      }
      if (path.posix.extname(rawPath)) {
        return next();
      }
      const clean = rawPath.replace(/^\/+|\/+$/g, '');
      const candidate = path.join(publicDir, clean, 'index.html');
      if (fs.existsSync(candidate)) {
        req.url = `/${clean}/index.html${query ? `?${query}` : ''}`;
        return next();
      }
      const notFoundPage = path.join(publicDir, '404.html');
      if (fs.existsSync(notFoundPage)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync(notFoundPage, 'utf8'));
        return;
      }
      return next();
    });
  };
  return {
    name: 'aura-static-directory-routing',
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  const publicDir = path.resolve(__dirname, 'public');
  return {
    root: __dirname,
    publicDir,
    server: {
      port: Number(process.env.PORT || 3000),
      host: '0.0.0.0',
    },
    build: {
      outDir: path.resolve(__dirname, '..', 'dist'),
      emptyOutDir: true,
    },
    plugins: [staticDirectoryRoutingPlugin(publicDir), react()],
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