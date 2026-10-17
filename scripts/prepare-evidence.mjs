import { copyFile, mkdir, readFile, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { artifacts } from '../src/data/artifacts.ts';

const source = new URL('../assignment-artifacts/', import.meta.url);
const target = new URL('../public/evidence/assignments/', import.meta.url);
const prefix = '/evidence/assignments/';
const names = new Set(artifacts.flatMap(a => [a.embedUrl, a.previewImage])
  .filter(url => url?.startsWith(prefix)).map(url => url.slice(prefix.length)));
await mkdir(target, { recursive: true });
// Only manage files in this dedicated generated directory; never source assets.
for (const name of await readdir(target)) {
  if (!names.has(name)) await unlink(new URL(name, target));
}
for (const name of names) {
  if (!/^[a-z0-9-]+\.(pdf|mp4|png)$/.test(name)) throw new Error(`Invalid evidence filename: ${name}`);
  const from = new URL(name, source);
  const to = new URL(name, target);
  await copyFile(from, to);
  const hash = data => createHash('sha256').update(data).digest('hex');
  if (hash(await readFile(from)) !== hash(await readFile(to))) {
    throw new Error(`Evidence copy mismatch: ${fileURLToPath(from)}`);
  }
}
console.log(`Prepared and hash-verified ${names.size} evidence assets.`);
