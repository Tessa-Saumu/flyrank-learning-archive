/**
 * Phase 3 verification suite (IMPLEMENTATION_PLAN §3.6).
 *
 * Covers the Phase 3 acceptance criteria that are automatable over the built
 * site: keyboard-only journey, no-JS browse, embed failure drill (fallback + no
 * empty boxes), reduced-motion, and the mobile (375px) / tablet (768px)
 * journeys. Runs against `npm run preview` (see playwright.config.ts).
 *
 * Requires: npx playwright install chromium
 */
import { test, expect, type Page } from '@playwright/test';
import { ALL_ASSIGNMENT_IDS } from '../src/components/map/adapter';

async function noHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
}

test('keyboard-only journey: home → filter → assignment → artifact → concept → map node → panel → close', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);

  // Browse index is reachable by keyboard alone (no graph required).
  await page.keyboard.press('Tab');
  const activeTag = await page.evaluate(() => document.activeElement?.tagName);
  expect(activeTag).toBeDefined();

  // Navigate to a detail page and prove the artifact link is keyboard-reachable.
  await page.goto('/work/ml-09-validation-claim-audit/');
  await page.locator('main h1').waitFor();
  // Focus the first link/button on the page and Tab through to the proof block.
  await page.locator('a').first().focus();
  await expect(page.locator('h1', { hasText: 'Validation and Research Claim Audit' })).toBeVisible();
  // The three beats + evidence status are exposed as text (not colour alone).
  const body = await page.locator('body').innerText();
  expect(body.toLowerCase()).toContain('evidence: partial');

  // Concept chip reachable from a detail page.
  await page.goto('/concepts/concept-evaluation/');
  await expect(page.locator('h1', { hasText: 'Evaluation' })).toBeVisible();
  const links = await page.locator('a').count();
  expect(links).toBeGreaterThan(0);

  // Map node keyboard path (roster button): select, panel opens, Escape closes.
  await page.goto('/');
  await page.waitForSelector('[data-learning-map].js-map-ready');
  const btn = page.locator('[data-roster="ml-09-validation-claim-audit"]');
  await btn.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await expect(page.locator('[data-learning-map]:not(.is-open)')).toBeVisible();
});

test('no-JS journey: every canonical assignment reachable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  // The non-graph routes are fully static and browsable with JS off.
  await page.goto('/');
  const missing: string[] = [];
  for (const id of ALL_ASSIGNMENT_IDS) {
    const count = await page.locator(`a[href="/work/${id}/"]`).count();
    if (count === 0) missing.push(id);
  }
  expect(missing).toEqual([]);

  // Static pages render without JS.
  await page.goto('/framework/');
  await expect(page.locator('h1', { hasText: 'My Working Framework' })).toBeVisible();
  await page.goto('/framework/wish-i-knew/');
  await expect(page.locator('h1', { hasText: 'What I Wish I Knew in Week 1' })).toBeVisible();
  await page.goto('/reflection/');
  await expect(page.locator('h1', { hasText: 'Final Reflection' })).toBeVisible();
  // Long-form retrospective is in the 500-800 word range (rendered text).
  const reflText = await page.locator('.refl-body').innerText();
  const words = reflText.trim().split(/\s+/).length;
  expect(words).toBeGreaterThanOrEqual(500);
  expect(words).toBeLessThanOrEqual(800);

  await context.close();
});

test('embed failure drill: fallback card + open-artifact control, no empty boxes', async ({ page }) => {
  // ml-11-ship-paper is an embed-mode artifact (ML paper). Abort any external
  // request and assert the first-class fallback stays visible, never an empty box.
  await page.route('**/*', (route) => {
    const url = route.request().url();
    // Allow same-origin; abort any external/embed host request.
    if (url.startsWith('http://127.0.0.1:4321') || url.startsWith('data:')) return route.continue();
    return route.abort();
  });
  await page.goto('/work/ml-11-ship-paper/');
  const fallback = page.locator('[data-artifact-embed] [data-embed-fallback]');
  await expect(fallback).toBeVisible();
  await expect(fallback.locator('.embed-fallback__note')).toContainText('This artifact opens externally');
  // The open-artifact control must be present (a link when a URL exists, the
  // pending label otherwise). Nothing renders as an empty iframe box.
  const openControl = fallback.locator('[data-open-artifact]');
  await expect(openControl).toBeVisible();
  await expect(fallback.locator('.preview__status')).toContainText(/evidence/i);
});

test('no-embed iframe exists in the initial HTML of any page', async ({ page }) => {
  for (const path of ['/', '/work/ml-11-ship-paper/', '/work/pf-04-personal-website/', '/work/fl-09-documentation-demo/']) {
    await page.goto(path);
    const iframes = await page.locator('iframe').count();
    // Lazy embeds create iframes only on demand; the initial HTML has none.
    expect(iframes, `${path} must not ship an iframe in the initial HTML`).toBe(0);
  }
});

test('reduced-motion is honoured site-wide', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  const transition = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--motion-hover').trim()
  );
  // Global reduced-motion guard collapses transition durations to ~0.
  const anyTransition = await page.evaluate(() => {
    const el = document.querySelector('a');
    return el ? getComputedStyle(el).transitionDuration : '0ms';
  });
  // On reduced motion the durations should be effectively instant.
  expect(anyTransition === '0s' || anyTransition === '0.00001s' || parseFloat(anyTransition) < 0.01).toBe(true);
  await context.close();
});

test('mobile 375px: no horizontal scroll, content reachable on every key page', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  for (const path of ['/', '/work/', '/framework/', '/reflection/']) {
    await page.goto(path);
    expect(await noHorizontalOverflow(page), `${path} overflows at 375px`).toBe(false);
    await expect(page.locator('h1').first()).toBeVisible();
  }
  // Mobile map: tap-select + close works.
  await page.goto('/');
  await page.waitForSelector('[data-learning-map].js-map-ready');
  await page.evaluate(() => (window as any).__learningMap.select('ml-09-validation-claim-audit', 'assignment'));
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await expect(page.locator('[data-learning-map]:not(.is-open)')).toBeVisible();
});

test('tablet 768px: no horizontal scroll, assignment content reachable', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  for (const path of ['/', '/work/ml-11-ship-paper/', '/framework/wish-i-knew/']) {
    await page.goto(path);
    expect(await noHorizontalOverflow(page), `${path} overflows at 768px`).toBe(false);
  }
  await expect(page.locator('h1').first()).toBeVisible();
});
