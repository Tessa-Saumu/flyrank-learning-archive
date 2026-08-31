/**
 * sitemap.xml — generated at build time from the assignment, concept, and
 * track pages. Uses the site URL from `src/config.ts` (a PLACEHOLDER until
 * the real production origin is supplied).
 */
import type { APIRoute } from 'astro';
import { assignments } from '../data/assignments';
import { concepts } from '../data/concepts';
import { site } from '../config';

const staticPaths = [
  '/',
  '/work/',
  '/track/ai-fluency/',
  '/track/machine-learning/',
  '/framework/',
  '/framework/wish-i-knew/',
  '/reflection/',
];

export const GET: APIRoute = () => {
  const paths = [
    ...staticPaths,
    ...assignments.map((a) => `/work/${a.id}/`),
    ...concepts.map((c) => `/concepts/${c.id}/`),
  ];

  const urls = paths
    .map((p) => new URL(p, site.url).toString())
    .map((loc) => `  <url><loc>${loc}</loc></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
