/**
 * axe-core accessibility audit (IMPLEMENTATION_PLAN §3.6, Task 3.3).
 *
 * Runs axe-core over the key routes (home + map, work index, a detail page,
 * reflection) and asserts zero critical/serious violations. The non-graph route
 * is the accessibility story; the map adds a11y on top.
 *
 * Requires: npx playwright install chromium
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  { name: 'home+map', url: '/' },
  { name: 'work-index', url: '/work/' },
  { name: 'detail', url: '/work/ml-09-validation-claim-audit/' },
  { name: 'reflection', url: '/reflection/' },
  { name: 'framework', url: '/framework/' },
];

for (const r of routes) {
  test(`axe: ${r.name} has no critical/serious violations`, async ({ page }) => {
    await page.goto(r.url);
    await page.waitForSelector('main');
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(
      serious,
      `Accessibility violations on ${r.name}: ${serious
        .map((v) => `${v.id} (${v.impact})`)
        .join(', ')}`
    ).toHaveLength(0);
  });
}
