/**
 * V2 REVISION Phase 1 verification suite
 * (docs/V2 REVISION_IMPLEMENTATION_SPEC.md — PHASE 1: graph, node layout &
 * graph panel; §1–§8 and the Phase 1 acceptance criteria).
 *
 * Covers, in spec order:
 *   §1 concept containers fit their content
 *   §2 multiple artifacts spread around their concept/work instead of stacking
 *   §3 artifact nodes are triangles in a distinct colour
 *   §4 stronger graph node contrast
 *   §5 the detail panel is a narrow secondary column (graph-first)
 *   §6 the Tier filter and its terminology are gone from the interface
 *   §7 a visible close control + Escape close the detail panel
 *   §8 explicit, labelled zoom/pan navigation controls (additive)
 *   plus the "existing graph functionality still works" acceptance check.
 *
 * Runs against the built site via `astro preview` (see playwright.config.ts).
 * The graph is a canvas, so node geometry/colour is read through the exposed
 * `window.__learningMap` hook and the real Cytoscape instance; every control
 * is driven through real DOM interaction.
 */
import { test, expect, type Page } from '@playwright/test';
import { ALL_ARTIFACT_IDS } from '../src/components/map/adapter';
import { ARTIFACT_CLEARANCE } from '../src/components/map/layout';

async function waitReady(page: Page): Promise<void> {
  await page.waitForSelector('[data-learning-map].js-map-ready');
  // Let the initial fit animation settle before measuring geometry.
  await page.waitForTimeout(450);
}

/** WCAG 2.x relative luminance → contrast ratio, for the §4 colour check. */
function contrastRatio(a: string, b: string): number {
  const parse = (c: string): [number, number, number] => {
    const m = c.match(/[\d.]+/g);
    if (!m) throw new Error(`unparseable colour: ${c}`);
    return [Number(m[0]), Number(m[1]), Number(m[2])];
  };
  const lum = (c: string): number => {
    const [r, g, b] = parse(c).map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = lum(a);
  const l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ---------------------------------------------------------------------------
// §1 — Concept containers fit their content
// ---------------------------------------------------------------------------

test('concept nodes size to their content: no label spills outside the box (§1)', async ({
  page,
}) => {
  await page.goto('/');
  await waitReady(page);

  // The renderer's own measured label dimensions (`rstyle.labelWidth/Height`,
  // populated by recalculateRenderedStyle) are the ground truth for what is
  // actually drawn inside the box.
  const concepts = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    return cy.nodes('[nodeType="concept"]').map((n: any) => {
      n.recalculateRenderedStyle();
      const rs = n[0]._private.rstyle;
      return {
        id: n.id(),
        label: n.data('label'),
        width: n.width(),
        height: n.height(),
        labelWidth: rs.labelWidth,
        labelHeight: rs.labelHeight,
        padX: (n.width() - rs.labelWidth) / 2,
        padY: (n.height() - rs.labelHeight) / 2,
      };
    });
  });

  expect(concepts.length).toBe(10);

  for (const c of concepts) {
    expect(c.labelWidth, `${c.id}: label measured`).toBeGreaterThan(0);
    expect(c.labelHeight, `${c.id}: label measured`).toBeGreaterThan(0);
    // All text stays inside the container, with real padding on every side.
    expect(c.padX, `${c.id}: label overflows horizontally`).toBeGreaterThanOrEqual(8);
    expect(c.padY, `${c.id}: label overflows vertically`).toBeGreaterThanOrEqual(6);
    // Compact and content-driven, not a blanket oversized box.
    expect(c.width, `${c.id}: box too wide`).toBeLessThan(180);
    expect(c.height, `${c.id}: box too tall`).toBeLessThan(80);
  }

  // Content-driven: the boxes follow their text, so they are not all the same
  // size (a single fixed size would fail the "grows as required" rule).
  const widths = new Set(concepts.map((c) => Math.round(c.width)));
  const heights = new Set(concepts.map((c) => Math.round(c.height)));
  expect(widths.size, 'concept widths should vary with content').toBeGreaterThan(1);
  expect(heights.size, 'concept heights should vary with content').toBeGreaterThan(1);
});

test('long concept names wrap instead of clipping, and the box grows with them (§1)', async ({
  page,
}) => {
  await page.goto('/');
  await waitReady(page);

  const measured = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    const read = (id: string) => {
      const n = cy.getElementById(id);
      n.recalculateRenderedStyle();
      const rs = n[0]._private.rstyle;
      return {
        label: n.data('label'),
        width: n.width(),
        height: n.height(),
        labelHeight: rs.labelHeight,
        // numericStyle = model-space value (getRenderedStyle is zoom-scaled).
        maxWidth: n.numericStyle('text-max-width'),
      };
    };
    return { wrapped: read('concept-problem-framing'), single: read('concept-communication') };
  });

  // A multi-word name wraps onto a second line and the box grows vertically.
  expect(measured.wrapped.label).toBe('PROBLEM FRAMING');
  expect(measured.wrapped.labelHeight).toBeGreaterThan(15); // two text lines
  expect(measured.wrapped.height).toBeGreaterThan(32);
  expect(measured.wrapped.width).toBeLessThanOrEqual(measured.wrapped.maxWidth + 30);

  // An unbreakable single word is never clipped: the box grows horizontally.
  expect(measured.single.label).toBe('COMMUNICATION');
  expect(measured.single.width).toBeGreaterThan(measured.single.maxWidth);
  expect(measured.single.labelHeight).toBeLessThanOrEqual(12); // still one line
});

// ---------------------------------------------------------------------------
// §2 — Multiple artifacts spread around the work they belong to
// ---------------------------------------------------------------------------

test('multiple artifacts never stack on top of one another (§2)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  const artifacts = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    return cy.nodes('[nodeType="artifact"]').map((n: any) => {
      const p = n.position();
      const box = n.boundingBox({ includeNodes: true, includeLabels: false });
      return { id: n.id(), x: p.x, y: p.y, w: box.w, h: box.h };
    });
  });

  expect(artifacts.length).toBe(ALL_ARTIFACT_IDS.length);

  let minDistance = Infinity;
  let overlaps = 0;
  for (let i = 0; i < artifacts.length; i++) {
    for (let j = i + 1; j < artifacts.length; j++) {
      const a = artifacts[i];
      const b = artifacts[j];
      minDistance = Math.min(minDistance, Math.hypot(a.x - b.x, a.y - b.y));
      const separated =
        Math.abs(a.x - b.x) >= (a.w + b.w) / 2 || Math.abs(a.y - b.y) >= (a.h + b.h) / 2;
      if (!separated) overlaps++;
    }
  }

  // No two artifact bodies overlap …
  expect(overlaps, 'overlapping artifact node pairs').toBe(0);
  // … and the spacing is intentional and consistent, not accidental.
  expect(minDistance).toBeGreaterThanOrEqual(ARTIFACT_CLEARANCE * 0.9);
});

test('the four artifacts of one assignment spread around it instead of stacking (§2)', async ({
  page,
}) => {
  await page.goto('/');
  await waitReady(page);

  const group = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    // FL-10 is the extreme case: one assignment cites four artifacts, which
    // used to be drawn at four identical coordinates.
    const ids = [
      'artifact-learning-archive',
      'artifact-final-retrospective',
      'artifact-hours-log',
      'artifact-build-in-public-post',
    ];
    const anchor = cy.getElementById('fl-10-final-package').position();
    return ids.map((id) => {
      const p = cy.getElementById(id).position();
      return { id, x: p.x, y: p.y, dist: Math.hypot(p.x - anchor.x, p.y - anchor.y) };
    });
  });

  const positions = new Set(group.map((g) => `${Math.round(g.x)},${Math.round(g.y)}`));
  expect(positions.size, 'the four artifacts must occupy four distinct positions').toBe(4);
  // Spread *around* the work they belong to, at a readable radius.
  for (const g of group) {
    expect(g.dist, `${g.id} sits on top of its assignment`).toBeGreaterThan(30);
    expect(g.dist, `${g.id} drifted away from its assignment`).toBeLessThan(170);
  }
});

// ---------------------------------------------------------------------------
// §3 + §4 — Artifact shape/colour and overall graph contrast
// ---------------------------------------------------------------------------

test('artifact nodes are triangles; concept nodes keep their rectangle (§3)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  const shapes = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    const shape = (n: any) => cy.style().getRenderedStyle(n, 'shape');
    return {
      artifacts: cy.nodes('[nodeType="artifact"]').map(shape),
      concepts: cy.nodes('[nodeType="concept"]').map(shape),
      assignments: cy.nodes('[nodeType="assignment"]').map(shape),
    };
  });

  expect(shapes.artifacts.length).toBe(ALL_ARTIFACT_IDS.length);
  expect(new Set(shapes.artifacts)).toEqual(new Set(['triangle']));
  // Concept nodes retain their existing shape; assignments stay circles.
  expect(new Set(shapes.concepts)).toEqual(new Set(['rectangle']));
  expect(new Set(shapes.assignments)).toEqual(new Set(['ellipse']));
});

test('artifact, concept and assignment nodes are separated by colour, with real contrast (§3, §4)', async ({
  page,
}) => {
  await page.goto('/');
  await waitReady(page);

  const colours = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    const rgb = (s: string) => {
      const d = document.createElement('div');
      d.style.color = s;
      document.body.appendChild(d);
      const c = getComputedStyle(d).color;
      d.remove();
      return c;
    };
    const fill = (n: any) => rgb(cy.style().getRenderedStyle(n, 'background-color'));
    const border = (n: any) => rgb(cy.style().getRenderedStyle(n, 'border-color'));
    return {
      pageBg: rgb(getComputedStyle(document.documentElement).getPropertyValue('--bg')),
      artifact: fill(cy.nodes('[nodeType="artifact"]').first()),
      concept: fill(cy.nodes('[nodeType="concept"]').first()),
      assignmentAiBorder: border(cy.nodes('[nodeType="assignment"][track="ai-fluency"]').first()),
      assignmentMlBorder: border(cy.nodes('[nodeType="assignment"][track="machine-learning"]').first()),
    };
  });

  // Artifact vs concept: clearly different colours (and different shapes).
  expect(colours.artifact).not.toBe(colours.concept);
  // Both are solid fills that read against the page background — the graph no
  // longer draws dark-on-dark hairline boxes. 3:1 is the WCAG floor for
  // non-text graphical objects; both are well above it.
  expect(contrastRatio(colours.artifact, colours.pageBg)).toBeGreaterThan(3);
  expect(contrastRatio(colours.concept, colours.pageBg)).toBeGreaterThan(3);
  // The two node types are also far apart from each other in luminance.
  expect(contrastRatio(colours.artifact, colours.concept)).toBeGreaterThan(1.7);
  // Track rings stay distinct from each other and legible on the background.
  expect(colours.assignmentAiBorder).not.toBe(colours.assignmentMlBorder);
  expect(contrastRatio(colours.assignmentAiBorder, colours.pageBg)).toBeGreaterThan(3);
  expect(contrastRatio(colours.assignmentMlBorder, colours.pageBg)).toBeGreaterThan(3);
});

// ---------------------------------------------------------------------------
// §5 — Graph-first layout: the detail panel is a narrow secondary column
// ---------------------------------------------------------------------------

test('the detail panel is clearly narrower than the graph (§5)', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/');
  await waitReady(page);

  await page.evaluate(() =>
    (window as any).__learningMap.select('ml-09-validation-claim-audit', 'assignment')
  );
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  await page.waitForTimeout(300);

  const widths = await page.evaluate(() => {
    const row = document.querySelector('.learning-map__region-row')!;
    const stage = document.querySelector('[data-map-stage]')!;
    const panel = document.querySelector('[data-map-panel]')!;
    return {
      row: row.getBoundingClientRect().width,
      stage: stage.getBoundingClientRect().width,
      panel: panel.getBoundingClientRect().width,
    };
  });

  // Not a 50/50 split: the panel takes a clearly smaller, secondary share.
  expect(widths.panel / widths.row).toBeLessThan(0.35);
  expect(widths.stage).toBeGreaterThan(widths.panel * 1.8);
  // … but still wide enough to hold its content.
  expect(widths.panel).toBeGreaterThanOrEqual(240);
  // The graph is still on screen and dominant.
  await expect(page.locator('[data-map-stage]')).toBeVisible();
});

// ---------------------------------------------------------------------------
// §6 — Tier filter and terminology removed
// ---------------------------------------------------------------------------

test('the Tier filter is gone from the graph controls and the work filters (§6)', async ({
  page,
}) => {
  for (const path of ['/', '/work/']) {
    await page.goto(path);

    await expect(page.locator('[data-filter-tier]')).toHaveCount(0);
    await expect(page.locator('.map-filter--secondary')).toHaveCount(0);
    await expect(page.locator('.filterbar__group--tier')).toHaveCount(0);
    await expect(page.locator('.filterbar__kicker')).toHaveCount(0);
    await expect(page.locator('.learning-map__kicker')).toHaveCount(0);

    // No tier terminology in the rendered copy of these two pages.
    const text = await page.locator('body').innerText();
    expect(text, 'the word Tier is still rendered').not.toMatch(/\bTier\b/i);
    for (const term of ['Core', 'Supporting', 'Reference']) {
      expect(text, `${term} is still rendered as a filter/label`).not.toContain(term);
    }
  }

  // The remaining work/category filtering uses the real categories.
  await page.goto('/work/');
  await expect(page.locator('.filterbar__item--primary')).toHaveCount(4);
  for (const label of ['All', 'AI Fluency', 'Machine Learning', 'Concepts']) {
    await expect(
      page.locator('.filterbar__item--primary').filter({ hasText: label }).first()
    ).toBeVisible();
  }
});

test('no supporting/reference tier labels survive in cards or the graph panel (§6)', async ({
  page,
}) => {
  await page.goto('/');
  await waitReady(page);

  // Assignment cards carry "Week · Track" only.
  const metas = await page.locator('.acard__meta').allInnerTexts();
  expect(metas.length).toBeGreaterThan(0);
  for (const m of metas) {
    expect(m, `card metadata still shows a tier: ${m}`).not.toMatch(/Core|Supporting|Reference/i);
  }

  // A supporting-tier assignment's graph panel metadata has no tier either.
  await page.evaluate(() => (window as any).__learningMap.select('fl-01-workflow-audit', 'assignment'));
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  const panelMeta = await page.locator('.panel__meta').innerText();
  expect(panelMeta).toContain('AI Fluency');
  expect(panelMeta, `panel metadata still shows a tier: ${panelMeta}`).not.toMatch(
    /Core|Supporting|Reference/i
  );
});

test('a legacy ?tier= URL no longer filters the graph (§6)', async ({ page }) => {
  await page.goto('/?tier=core');
  await waitReady(page);
  const state = await page.evaluate(() => (window as any).__learningMap.getState());
  expect(state.tier, 'tier is still part of the view state').toBeUndefined();
  // The default anchor view is unchanged: 19 assignments (18 core + ML-01).
  const assignments = await page.evaluate(
    () => (window as any).__learningMap.cy.nodes('[nodeType="assignment"]').length
  );
  expect(assignments).toBe(19);
});

// ---------------------------------------------------------------------------
// §7 — Visible close control + Escape
// ---------------------------------------------------------------------------

test('the panel has a visible close control that closes it (§7)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  await page.evaluate(() =>
    (window as any).__learningMap.select('ml-09-validation-claim-audit', 'assignment')
  );
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();

  // Discoverable: visible, labelled, and reachable.
  const close = page.locator('[data-map-close]');
  await expect(close).toBeVisible();
  await expect(close).toHaveAccessibleName(/close/i);

  await close.click();
  await page.waitForTimeout(200);
  await expect(page.locator('[data-learning-map]:not(.is-open)')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__learningMap.getState().kind)).toBe('default');
  // Closing returns the user to the full graph view.
  await expect(page.locator('[data-map-stage]')).toBeVisible();
});

test('Escape closes the panel from the visible control state too (§7)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  await page.evaluate(() => (window as any).__learningMap.select('concept-evaluation', 'concept'));
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  await expect(page.locator('[data-map-close]')).toBeVisible();

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await expect(page.locator('[data-learning-map]:not(.is-open)')).toBeVisible();
});

// ---------------------------------------------------------------------------
// §8 — Explicit graph navigation controls
// ---------------------------------------------------------------------------

test('labelled zoom and pan controls drive the graph (§8)', async ({ page }) => {
  await page.goto('/');
  await waitReady(page);

  const buttons = page.locator('[data-map-nav]');
  await expect(buttons).toHaveCount(4);
  for (const [action, label] of [
    ['zoom-in', 'Zoom in'],
    ['zoom-out', 'Zoom out'],
    ['pan-left', 'Pan left'],
    ['pan-right', 'Pan right'],
  ] as const) {
    const btn = page.locator(`[data-map-nav="${action}"]`);
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAccessibleName(label);
  }

  const viewport = () =>
    page.evaluate(() => {
      const cy = (window as any).__learningMap.cy;
      return { zoom: cy.zoom(), panX: cy.pan().x, panY: cy.pan().y };
    });

  const before = await viewport();

  await page.locator('[data-map-nav="zoom-in"]').click();
  await page.waitForTimeout(400);
  const afterZoomIn = await viewport();
  expect(afterZoomIn.zoom).toBeGreaterThan(before.zoom * 1.1);

  await page.locator('[data-map-nav="zoom-out"]').click();
  await page.waitForTimeout(400);
  const afterZoomOut = await viewport();
  expect(afterZoomOut.zoom).toBeLessThan(afterZoomIn.zoom * 0.9);

  await page.locator('[data-map-nav="pan-left"]').click();
  await page.waitForTimeout(400);
  const afterPanLeft = await viewport();
  expect(afterPanLeft.panX).toBeGreaterThan(afterZoomOut.panX + 50);

  await page.locator('[data-map-nav="pan-right"]').click();
  await page.waitForTimeout(400);
  const afterPanRight = await viewport();
  expect(afterPanRight.panX).toBeLessThan(afterPanLeft.panX - 50);
});

test('the navigation controls stay usable on a small screen (§8)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await page.goto('/');
  await waitReady(page);

  await expect(page.locator('.learning-map__nav')).toBeVisible();
  for (const action of ['zoom-in', 'zoom-out', 'pan-left', 'pan-right']) {
    const box = await page.locator(`[data-map-nav="${action}"]`).boundingBox();
    expect(box, `${action} has no box`).not.toBeNull();
    // Tap-target sized and inside the viewport.
    expect(box!.width).toBeGreaterThanOrEqual(28);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
  }

  const before = await page.evaluate(() => (window as any).__learningMap.cy.zoom());
  await page.locator('[data-map-nav="zoom-in"]').click();
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => (window as any).__learningMap.cy.zoom())).toBeGreaterThan(before);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(overflow).toBe(false);
});

test('gestures are preserved: the controls are additive, not a replacement (§8)', async ({
  page,
}) => {
  await page.goto('/');
  await waitReady(page);

  // Dragging still pans (the pre-existing gesture path).
  const stage = await page.locator('[data-map-stage]').boundingBox();
  const before = await page.evaluate(() => (window as any).__learningMap.cy.pan().x);
  await page.mouse.move(stage!.x + stage!.width / 2, stage!.y + stage!.height / 2);
  await page.mouse.down();
  await page.mouse.move(stage!.x + stage!.width / 2 - 120, stage!.y + stage!.height / 2, {
    steps: 8,
  });
  await page.mouse.up();
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => (window as any).__learningMap.cy.pan().x);
  expect(Math.abs(after - before)).toBeGreaterThan(40);

  // A real canvas click still opens the panel.
  const pos = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    const rp = cy.getElementById('ml-09-validation-claim-audit').renderedPosition();
    const bb = document.querySelector('[data-map-stage]')!.getBoundingClientRect();
    return { x: bb.left + rp.x, y: bb.top + rp.y };
  });
  await page.mouse.click(pos.x, pos.y);
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Acceptance — existing graph functionality still works
// ---------------------------------------------------------------------------

test('regression: the default graph state is unchanged apart from layout/colour', async ({
  page,
}) => {
  await page.goto('/');
  await waitReady(page);

  const g = await page.evaluate(() => {
    const cy = (window as any).__learningMap.cy;
    return {
      assignments: cy.nodes('[nodeType="assignment"]').length,
      concepts: cy.nodes('[nodeType="concept"]').length,
      artifacts: cy.nodes('[nodeType="artifact"]').length,
      edges: cy.edges().length,
    };
  });
  expect(g).toEqual({ assignments: 19, concepts: 10, artifacts: 11, edges: 80 });

  // Category filters still drive the graph.
  await page.locator('[data-filter-primary="ai-fluency"]').click();
  await page.waitForTimeout(250);
  expect(
    await page.evaluate(() => (window as any).__learningMap.cy.nodes('[nodeType="assignment"]').length)
  ).toBe(28);

  // Search and the keyboard roster still open the panel.
  await page.locator('[data-filter-primary="all"]').click();
  await page.waitForTimeout(250);
  await page.fill('[data-map-search]', 'ML-09');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-learning-map].is-open')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await expect(page.locator('[data-learning-map]:not(.is-open)')).toBeVisible();
});
