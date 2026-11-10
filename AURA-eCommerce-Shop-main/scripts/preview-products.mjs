// Serves the generated storefront locally. No installs and no public deployment.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/* `fileURLToPath` keeps the trailing separator; strip it so the containment
   check below can compare against the directory itself, which is what `/`
   resolves to now that the homepage is a real page rather than a redirect. */
const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
const root = publicDir.endsWith(sep) ? publicDir.slice(0, -1) : publicDir;
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('This is a read-only local preview.');
    return;
  }

  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) {
        response.writeHead(301, { Location: `${pathname}/` });
        response.end();
        return;
      }
      file = resolve(file, 'index.html');
    }
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Preview page not found. Run npm run build:templates first.');
  }
});

server.listen(port, host, () => {
  console.log(`OPAR storefront: http://${host}:${port}/`);
  console.log('Local only. Serves public/, which is what `npm run build` ships.');
});
