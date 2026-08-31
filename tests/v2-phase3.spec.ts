/**
 * V2 Phase 3 verification suite (V2_IMPROVEMENT_SPEC §18, Phase 3 — Navigation).
 *
 * Covers:
 *   13. Section/tab hierarchy (§1)
 *   14. Laptop navigation sizing (§6)
 *   15. Move `Explore the Map` CTA (§12)
 *
 * Runs against the built site via `astro preview` (see playwright.config.ts).
 * Requires: npx playwright install chromium
 */
import { test, expect, type Page } from '@playwright/test';

const LAPTOP = { width: 1366, height: 768 };

async function fontSizePx(page: Page, selector: string): Promise<number> {
  return page.locator(selector).first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
}

async function fontWeight(page: Page, selector: string): Promise<number> {
  return page
    .locator(selector)
    .first()
    .evaluate((el) => parseInt(getComputedStyle(el).fontWeight, 10));
}

// ---------------------------------------------------------------------------
// §1 — Section/tab hierarchy
// ---------------------------------------------------------------------------

test('header: primary sections read above the secondary track links (§1)', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto('/');

  // Primary section navigation has stronger typographic weight and size.
  const primarySize = await fontSizePx(page, '.header__link--primary');
  const secondarySize = await fontSizePx(page, '.header__link--secondary');
  expect(primarySize).toBeGreaterThan(secondarySize);
  expect(await fontWeight(page, '.header__link--primary')).toBeGreaterThanOrEqual(600);
  expect(await fontWeight(page, '.header__link--secondary')).toBeLessThan(600);

  // The tracks cluster is explicitly grouped under its own label, so the
  // header is no longer one continuous flat row.
  await expect(page.locator('.header__tracks-label')).toHaveText(/tracks/i);
  await expect(page.locator('.header__link--primary')).toHaveCount(4);
  await expect(page.locator('.header__link--secondary')).toHaveCount(2);
});

test('filter bars: secondary tier tabs are grouped and lighter than primary tabs (§1)', async ({
  page,
}) => {
  await page.setViewportSize(LAPTOP);

  for (const path of ['/', '/work/']) {
    await page.goto(path);

    // Primary tabs are heavier and larger than the tier tabs.
    const primaryWeight = await fontWeight(page, '.filterbar__item--primary');
    const secondaryWeight = await fontWeight(page, '.filterbar__item--secondary');
    expect(primaryWeight).toBeGreaterThan(secondaryWeight);
    const primarySize = await fontSizePx(page, '.filterbar__item--primary');
    const secondarySize = await fontSizePx(page, '.filterbar__item--secondary');
    expect(primarySize).toBeGreaterThan(secondarySize);

    // The tier cluster clearly belongs to its parent group (labelled).
    await expect(page.locator('.filterbar__kicker')).toHaveText(/tier/i);
  }

  // The map controls carry the same two-level treatment.
  await page.goto('/');
  const mapPrimaryWeight = await fontWeight(page, '.map-filter--primary');
  const mapSecondaryWeight = await fontWeight(page, '.map-filter--secondary');
  expect(mapPrimaryWeight).toBeGreaterThan(mapSecondaryWeight);
  await expect(page.locator('.learning-map__kicker')).toHaveText(/tier/i);
});

test('no decorative containers were introduced for hierarchy (§1)', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto('/');

  // Hierarchy comes from typography/spacing/grouping: nav links and kickers
  // stay free of backgrounds, shadows, and gradients.
  for (const selector of ['.header__link--primary', '.header__tracks-label', '.filterbar__kicker']) {
    const style = await page.locator(selector).first().evaluate((el) => {
      const s = getComputedStyle(el);
      return { background: s.backgroundImage, shadow: s.boxShadow, bg: s.backgroundColor };
    });
    expect(style.background).toBe('none');
    expect(style.shadow).toBe('none');
    expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(style.bg);
  }
});

// ---------------------------------------------------------------------------
// §6 — Laptop navigation sizing
// ---------------------------------------------------------------------------

test('laptop: navigation labels are immediately legible and do not overflow (§6)', async ({
  page,
}) => {
  await page.setViewportSize(LAPTOP);
  await page.goto('/');

  // Nav labels are no longer metadata-sized (V1 rendered 9px at this width).
  const primarySize = await fontSizePx(page, '.header__link--primary');
  expect(primarySize).toBeGreaterThanOrEqual(12);
  expect(primarySize).toBeLessThanOrEqual(16); // comfortable, not oversized

  // Navigation neither overflows nor wraps the sticky bar taller.
  const overflow = await page.evaluate(() => {
    const header = document.querySelector('.header')!;
    return header.scrollWidth - header.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(0);
  const headerHeight = await page.locator('.header').evaluate((el) => el.getBoundingClientRect().height);
  expect(headerHeight).toBeLessThanOrEqual(72); // 64px bar preserved (±border)

  // All six items remain visible in the bar.
  for (const label of ['MAP', 'WORK', 'FRAMEWORK', 'REFLECTION', 'AI FLUENCY', 'MACHINE LEARNING']) {
    await expect(page.locator('.header__nav, .header__tracks').getByText(label, { exact: true })).toBeVisible();
  }
});

test('mobile 375px: header keeps its wrap behaviour with no horizontal overflow (§6 preserve)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await expect(page.locator('.header__nav').getByText('WORK', { exact: true })).toBeVisible();
});

// ---------------------------------------------------------------------------
// §12 — Explore the Map CTA
// ---------------------------------------------------------------------------

test('CTA sits after the work section, not beside the map preview (§12)', async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto('/');

  // No Explore-the-map button beside/under the map preview (hero actions).
  await expect(page.locator('.hero__actions a', { hasText: /explore the map/i })).toHaveCount(0);

  // Exactly one CTA, inside #browse, after the browse listing.
  const cta = page.locator('#browse a[data-explore-map]');
  await expect(cta).toHaveCount(1);
  await expect(cta).toHaveText(/explore the map/i);
  const order = await page.evaluate(() => {
    const list = document.querySelector('#browse [data-browse-work], #browse .browse')?.getBoundingClientRect();
    const listBottom =
      list?.bottom ??
      (() => {
        const cards = document.querySelectorAll('#browse a[href^="/work/"]');
        const last = cards[cards.length - 1];
        return last ? last.getBoundingClientRect().bottom : 0;
      })();
    const cta = document.querySelector('#browse a[data-explore-map]')!.getBoundingClientRect();
    return { listBottom, ctaTop: cta.top };
  });
  expect(order.ctaTop).toBeGreaterThan(order.listBottom);
});

test('clicking Explore the Map produces meaningful navigation to the full graph (§12)', async ({
  page,
}) => {
  await page.setViewportSize(LAPTOP);
  await page.goto('/');
  await page.waitForSelector('[data-learning-map].js-map-ready');

  const cta = page.locator('#browse a[data-explore-map]');
  await cta.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(600); // we start far from the map

  await cta.click();
  // Meaningful movement: the map section is now in the viewport.
  await page.waitForFunction(() => {
    const map = document.querySelector('#map');
    if (!map) return false;
    const r = map.getBoundingClientRect();
    return r.top > -r.height / 2 && r.top < window.innerHeight / 2;
  });

  // And the click lands on the full Knowledge Graph experience: the map is
  // expanded (context panel recedes, graph takes the full width — §13 state).
  await expect(page.locator('.map-section.is-expanded')).toHaveCount(1);
  await expect(page.locator('[data-map-expand]')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.map-section__intro')).toBeHidden();

  // The §13 control still collapses it again.
  await page.locator('[data-map-expand]').click();
  await expect(page.locator('.map-section.is-expanded')).toHaveCount(0);
});

test('no-JS: the CTA remains a working anchor to the map section (§12)', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  const cta = page.locator('#browse a[data-explore-map]');
  await expect(cta).toHaveAttribute('href', '#map');
  await expect(page.locator('#map')).toHaveCount(1);
  await context.close();
});
