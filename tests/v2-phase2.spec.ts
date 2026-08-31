/**
 * V2 Phase 2 verification suite (V2_IMPROVEMENT_SPEC §18, Phase 2).
 *
 * Covers the Knowledge Graph phase:
 *   6.  Node descriptors (§7)
 *   7.  Hover information (§8)
 *   8.  Interaction instructions (§9)
 *   9.  Arrowheads (§10.1)
 *   10. Concept relationships (§10.2)
 *   11. Default artifact visibility (§11)
 *   12. Expandable homepage graph (§13)
 *
 * Runs against the built site via `astro preview` (see playwright.config.ts).
 * Requires: npx playwright install chromium
 */
import { test, expect, type Page } from '@playwright/test';

async function waitReady(page: Page): Promise<void> {
  await page.waitForSelector('[data-learning-map].js-map-ready');
  await page.waitForTimeout(450);
}

test('assignment nodes display short descriptors, not raw codes (§7)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  const labels = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    const get = (id: string) => ({
      label: cy.getElementById(id).data('label'),
      title: cy.getElementById(id).data('title'),
    });
    return {
      ml11: get('ml-11-ship-paper'),
      ml09: get('ml-09-validation-claim-audit'),
      proof: get('fl-portfolio-proof'),
    };
  });

  expect(labels.ml11.label).toBe('Ship the Paper');
  expect(labels.ml09.label).toBe('Validate the Claim');
  expect(labels.proof.label).toBe('What Are You Proving?');

  // The full canonical title is retained for the hover tooltip (§8).
  expect(labels.ml09.title).toBe('Validation and Research Claim Audit');
});

test('hovering a node reveals the full name and description (§8)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  const pos = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    const el = cy.getElementById('ml-09-validation-claim-audit');
    const rp = el.renderedPosition();
    const bb = document.querySelector('[data-map-stage]')!.getBoundingClientRect();
    return { x: bb.left + rp.x, y: bb.top + rp.y };
  });

  await page.mouse.move(pos.x, pos.y);
  await expect(page.locator('[data-map-tooltip]')).toBeVisible();
  await expect(page.locator('[data-map-tooltip] strong')).toHaveText(
    'Validation and Research Claim Audit'
  );
  await expect(page.locator('[data-map-tooltip] span')).toContainText('Audit your Week 5 model');

  // Moving off the node hides the tooltip again.
  await page.mouse.move(5, 5);
  await expect(page.locator('[data-map-tooltip]')).toBeHidden();
});

test('map legend explains zoom, pan, and escape (§9)', async ({ page }) => {
  await page.goto('/');
  const legend = page.locator('[data-map-legend]');
  await expect(legend).toBeVisible();
  const text = (await legend.innerText()).toLowerCase();
  expect(text).toContain('zoom');
  expect(text).toContain('drag');
  expect(text).toContain('esc');
});

test('directional edges render visible arrowheads (§10.1)', async ({ page }) => {
  // browse-all includes every relationship type, including the single
  // medium-confidence `connects-to` edge.
  await page.goto('/?view=browse-all');
  await waitReady(page);

  const shapes = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    const shape = (rel: string) =>
      cy.edges(`[relationship="${rel}"]`).first().style('target-arrow-shape');
    const count = (rel: string) => cy.edges(`[relationship="${rel}"]`).length;
    return {
      builds: shape('builds-on'),
      connects: shape('connects-to'),
      cross: shape('cross-track'),
      buildsCount: count('builds-on'),
      connectsCount: count('connects-to'),
      crossCount: count('cross-track'),
    };
  });

  expect(shapes.builds).toBe('triangle');
  expect(shapes.connects).toBe('triangle');
  expect(shapes.cross).toBe('triangle');
  expect(shapes.buildsCount).toBeGreaterThan(0);
  expect(shapes.connectsCount).toBeGreaterThan(0);
  expect(shapes.crossCount).toBeGreaterThan(0);
});

test('every concept node is connected, no orphans (§10.2)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  const result = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    const conceptNodes = cy.nodes('[nodeType="concept"]');
    const orphans = conceptNodes
      .filter((n: any) => n.connectedEdges().length === 0)
      .map((n: any) => n.id());
    return {
      orphanCount: orphans.length,
      conceptEdgeCount: cy.edges('[relationship="concept"]').length,
    };
  });

  expect(result.orphanCount).toBe(0);
  // 39 concept connective edges in the default (anchor) view.
  expect(result.conceptEdgeCount).toBe(39);
});

test('artifacts are visible by default and still filterable (§11)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  const initial = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    return {
      artifacts: cy.nodes('[nodeType="artifact"]').length,
      artifactEdges: cy.edges('[relationship="artifact"]').length,
    };
  });
  // No filter interaction required: all 11 artifacts and their relationships
  // are present on first load.
  expect(initial.artifacts).toBe(11);
  expect(initial.artifactEdges).toBe(23);

  // The Concepts filter still hides artifacts.
  await page.locator('[data-filter-primary="concepts"]').click();
  await page.waitForTimeout(250);
  const after = await page.evaluate(
    () => (window as any).__learningMap.cy.nodes('[nodeType="artifact"]').length
  );
  expect(after).toBe(0);
});

test('homepage map preview expands and collapses (§13)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  const expand = page.locator('[data-map-expand]');
  await expect(expand).toBeVisible();

  await expand.click();
  await expect(page.locator('.map-section.is-expanded')).toBeVisible();
  await expect(expand).toHaveAttribute('aria-expanded', 'true');
  await expect(expand).toHaveText('Collapse map');
  // The adjacent context panel recedes.
  await expect(page.locator('.map-section__intro')).toBeHidden();

  await expand.click();
  await expect(page.locator('.map-section.is-expanded')).toHaveCount(0);
  await expect(expand).toHaveAttribute('aria-expanded', 'false');
  await expect(expand).toHaveText('Expand map');
  await expect(page.locator('.map-section__intro')).toBeVisible();
});
