/**
 * The customer build: public/ becomes dist/, and nothing else is added.
 *
 * Until T4 this step was `vite build`, which copied public/ and then wrote a
 * 410 kB React bundle beside it for a homepage the bundle no longer needed to
 * render. The storefront is generated HTML plus about 40 kB of CSS and 40 kB of
 * plain JavaScript; there is nothing left for a bundler to do.
 *
 * Consequences worth stating, because they are the point:
 *   - dist/ holds no .jsx, no import map and no Tailwind output;
 *   - the only JavaScript that ships is the eight hand-written files in
 *     public/assets, which the pages reference by name;
 *   - the admin panel is not here. It runs from `npm run dev:admin` and has no
 *     build step, no route and no bundle in this tree (decision 2, D-033).
 *
 * `npm run build` runs the generator first, so this file only ever copies.
 */

import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = fileURLToPath(new URL('../', import.meta.url));
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const source = join(appRoot, 'public');
const destination = join(repoRoot, 'dist');

async function totalBytes(directory) {
  let bytes = 0;
  let files = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = await totalBytes(path);
      bytes += nested.bytes;
      files += nested.files;
    } else {
      bytes += (await stat(path)).size;
      files += 1;
    }
  }
  return { bytes, files };
}

const before = await stat(source).catch(() => null);
if (!before) {
  console.error('public/ does not exist. Run `npm run build:templates` first.');
  process.exit(1);
}

/* A clean copy, not a merge: a leftover bundle from an earlier build is exactly
   the kind of file that keeps being served because nobody deleted it. */
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

/* The two files that make the tree a site rather than a folder of pages. */
for (const required of ['index.html', 'sitemap.xml', 'robots.txt']) {
  const present = await stat(join(destination, required)).catch(() => null);
  if (!present) throw new Error(`dist/${required} is missing: the generator did not produce it`);
}

const { bytes, files } = await totalBytes(destination);
console.log(`Copied public/ -> dist/: ${files} files, ${(bytes / 1024).toFixed(1)} kB`);
