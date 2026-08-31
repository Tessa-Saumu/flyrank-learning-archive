/**
 * robots.txt — static robots rule generated at build time. Allows crawling and
 * points to the sitemap (uses the placeholder site URL from src/config.ts).
 */
import type { APIRoute } from 'astro';
import { site } from '../config';

export const GET: APIRoute = () => {
  const sitemap = new URL('/sitemap.xml', site.url).toString();
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
