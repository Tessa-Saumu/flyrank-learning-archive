/**
 * Lighthouse config (IMPLEMENTATION_PLAN Task 3.4.4).
 *
 * Runs against the `npm run preview` server. Keeps all four categories so the
 * Phase 3 exit gate (≥ 90 on Performance / Accessibility / Best Practices / SEO
 * for home, a detail page, and the map) is measurable on both mobile and
 * desktop.
 *
 * Usage: npm run build && npm run preview -- --port 4321 --host 127.0.0.1 (in
 * another shell), then: npm run lighthouse
 *
 * Requires a Chromium/Chrome binary to be available for Lighthouse.
 */
export default {
  extends: 'lighthouse:default',
  settings: {
    output: 'html',
    // Simulated mid-tier mobile (Plan §3.4: LCP < 2.5s on simulated 4G).
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 },
    throttling: {
      rttMs: 150,
      throughputKbps: 1600,
      cpuSlowdownMultiplier: 4,
    },
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  },
};
