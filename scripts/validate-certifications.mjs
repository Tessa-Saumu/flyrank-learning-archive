import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const records = JSON.parse(await readFile(new URL('../src/data/certifications.json', import.meta.url), 'utf8'));
const ids = new Set();
const hashes = new Set();
for (const c of records) {
  if (!/^[a-z0-9-]+$/.test(c.id) || ids.has(c.id) || hashes.has(c.sha256)) throw new Error(`Duplicate/invalid certification: ${c.id}`);
  ids.add(c.id); hashes.add(c.sha256);
  if (!c.title || c.status !== 'completed' || !c.issuer || c.previewWidth <= 0 || c.previewHeight <= 0) throw new Error(`Incomplete certificate: ${c.id}`);
  for (const path of [c.pdfPath, c.previewImage]) {
    if (!path.startsWith('/evidence/certifications/') || path.includes('..')) throw new Error(`Invalid certificate path: ${path}`);
    const bytes = await readFile(new URL(`../public${path}`, import.meta.url));
    if (path.endsWith('.pdf') && (bytes.subarray(0, 5).toString() !== '%PDF-' || createHash('sha256').update(bytes).digest('hex') !== c.sha256)) throw new Error(`Certificate hash/signature mismatch: ${c.id}`);
    if (path.endsWith('.webp') && bytes.subarray(8, 12).toString() !== 'WEBP') throw new Error(`Invalid preview: ${c.id}`);
  }
}
await readFile(new URL('../public/evidence/certifications/claude-certificates.zip', import.meta.url));
console.log(`Validated ${records.length} unique original certificates and full-page previews.`);
