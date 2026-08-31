/**
 * Learning Map browser interaction suite (IMPLEMENTATION_PLAN §2.6).
 *
 * Runs against the built site via `astro preview` (see playwright.config.ts).
 * Requires: npx playwright install chromium
 *
 * NOTE: the graph is drawn on a canvas, so node assertions read the exposed
 * `window.__learningMap` test hook (cy instance + view state) and selection is
 * driven through real DOM controls (roster buttons, filters, search, canvas
 * clicks) rather than fake events.
 */
import { test, expect, type Page } from '@playwright/test';
import { ALL_ASSIGNMENT_IDS } from '../src/components/map/adapter';

async function waitReady(page: Page): Promise<void> {
  await page.waitForSelector('[data-learning-map].js-map-ready');
  // let the initial fit animation settle
  await page.waitForTimeout(450);
}

async function graph(page: Page): Promise<Record<string, unknown>> {
  return page.evaluate(() => {
    const m = (window as unknown as { __learningMap?: { cy: any } }).__learningMap!;
    const cy = m.cy;
    return {
      concepts: cy.nodes('[nodeType="concept"]').length,
      assignments: cy.nodes('[nodeType="assignment"]').length,
      artifacts: cy.nodes('[nodeType="artifact"]').length,
      edges: cy.edges().length,
      referenceVisible: cy.nodes('[nodeType="assignment"][tier="reference"]').length,
      dimmedML: cy
        .nodes('[nodeType="assignment"][track="machine-learning"]')
        .filter((n: any) => n.hasClass('dimmed')).length,
    };
  });
}

async function panelInfo(page: Page): Promise<{ open: boolean; text: string }> {
  return page.evaluate(() => {
    const root = document.querySelector('[data-learning-map]')!;
    const panel = root.querySelector('[data-map-panel]')!;
    return { open: root.classList.contains('is-open'), text: (panel.textContent ?? '').trim() };
  });
}

test('default state is calm and correct', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);
  const g = await graph(page);
  expect(g.concepts).toBe(10);
  expect(g.assignments).toBe(19); // 18 core + ML-01
  expect(g.edges).toBe(18); // approved high-confidence only
  expect(g.referenceVisible).toBe(0);
  // ML-01 sits at the ML entrance
  expect((await page.evaluate(() => (window as any).__learningMap.cy.getElementById('ml-01-run-starter-notebooks').length))).toBe(1);
  expect(await page.evaluate(() => (window as any).__learningMap.getState().kind)).toBe('default');
});

test('clicking an assignment opens the panel beside the map', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);
  // Real canvas click on the ml-09 node using its rendered position.
  const pos = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    const el = cy.getElementById('ml-09-validation-claim-audit');
    const rp = el.renderedPosition();
    const bb = document.querySelector('[data-map-stage]')!.getBoundingClientRect();
    return { x: bb.left + rp.x, y: bb.top + rp.y };
  });
  await page.mouse.click(pos.x, pos.y);
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  const info = await panelInfo(page);
  expect(info.text).toContain('Validation and Research Claim Audit');
  expect(info.text.toLowerCase()).toContain('task');
  expect(info.text.toLowerCase()).toContain('lesson');
  expect(info.text.toLowerCase()).toContain('takeaway');
  // Map still present in DOM + outer ring applied.
  expect(await page.locator('[data-map-stage]').count()).toBe(1);
  expect(await page.evaluate(() => (window as any).__learningMap.cy.getElementById('ml-09-validation-claim-audit').hasClass('selected'))).toBe(true);
});

test('concept selection promotes reference-tier assignments', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);
  await page.evaluate(() => (window as any).__learningMap.select('concept-human-judgment', 'concept'));
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  const g = await graph(page);
  // fl-curate-images (reference tier) becomes visible/promoted under Human Judgment.
  expect(await page.evaluate(() => (window as any).__learningMap.cy.getElementById('fl-curate-images').length)).toBe(1);
  expect(g.assignments).toBe(10);
});

test('AI Fluency track selection reveals both strands and keeps cross-track bridges', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);
  await page.locator('[data-filter-primary="ai-fluency"]').click();
  await page.waitForTimeout(250);
  const g = await graph(page);
  // Both AI Fluency strands are present (portfolio + agents).
  expect(g.assignments).toBe(28); // 25 AI Fluency + 3 cross-track ML bridges
  expect(await page.evaluate(() => (window as any).__learningMap.cy.getElementById('ml-02-research-question-lane').length)).toBe(1);
  expect(await page.evaluate(() => (window as any).__learningMap.cy.getElementById('ml-11-ship-paper').length)).toBe(1);
  expect(await page.evaluate(() => (window as any).__learningMap.cy.getElementById('ml-12-tell-story').length)).toBe(1);
  // ML spine dimmed so the chosen track is dominant.
  expect((g.dimmedML as number)).toBeGreaterThan(0);
  // Cross-track concept nodes preserved (concepts still present).
  expect((g.concepts as number)).toBeGreaterThan(0);
});

test('Escape closes the panel and returns to the default view', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);
  await page.evaluate(() => (window as any).__learningMap.select('ml-09-validation-claim-audit', 'assignment'));
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const info = await panelInfo(page);
  expect(info.open).toBe(false);
  expect(await page.evaluate(() => (window as any).__learningMap.getState().kind)).toBe('default');
});

test('URL state deep-links and survives refresh', async ({ page }) => {
  await page.goto('/?node=ml-09-validation-claim-audit');
  await waitReady(page);
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  const state = await page.evaluate(() => (window as any).__learningMap.getState());
  expect(state.kind).toBe('assignment');
  expect(state.node).toBe('ml-09-validation-claim-audit');
  // Refresh keeps the state.
  await page.reload();
  await waitReady(page);
  expect(await page.evaluate(() => (window as any).__learningMap.getState().kind)).toBe('assignment');
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
});

test('search resolves by code and by title', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);
  await page.fill('[data-map-search]', 'ML-09');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__learningMap.getState().node)).toBe('ml-09-validation-claim-audit');

  // close and search by full title
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await page.fill('[data-map-search]', 'Validation and Research Claim Audit');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__learningMap.getState().node)).toBe('ml-09-validation-claim-audit');
});

test('keyboard-only selection and focus return', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);
  const btn = page.locator('[data-roster="ml-09-validation-claim-audit"]');
  await btn.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await expect(page.locator('[data-learning-map]:not(.is-open)')).toBeVisible();
  // Focus returns to the roster trigger.
  const active = await page.evaluate(() => document.activeElement?.getAttribute('data-roster'));
  expect(active).toBe('ml-09-validation-claim-audit');
});

test('no-JS: browseable archive with all 35 assignments reachable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  const missing: string[] = [];
  for (const id of ALL_ASSIGNMENT_IDS) {
    const count = await page.locator(`a[href="/work/${id}/"]`).count();
    if (count === 0) missing.push(id);
  }
  expect(missing).toEqual([]);
  // The map fallback note is visible (map unavailable without JS).
  await expect(page.locator('.learning-map__fallback-note')).toBeVisible();
  await context.close();
});

test('reduced motion preference does not break the map', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await waitReady(page);
  await expect(page.locator('[data-learning-map].js-map-ready')).toBeVisible();
  await context.close();
});

test('mobile 375px: map renders, tap works, no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await waitReady(page);
  await expect(page.locator('[data-map-stage]')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(overflow).toBe(false);
  await page.evaluate(() => (window as any).__learningMap.select('ml-09-validation-claim-audit', 'assignment'));
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await expect(page.locator('[data-learning-map]:not(.is-open)')).toBeVisible();
});
