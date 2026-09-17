/**
 * V2 REVISION Phase 3 verification suite
 * (docs/V2 REVISION_IMPLEMENTATION_SPEC.md — PHASE 3: work filters,
 * terminology & final cleanup; §15–§16 and Phase 3 acceptance criteria).
 *
 * Covers:
 *   §15 Work filters functional on both Home (#browse) and Work (/work/)
 *       - AI Fluency category filter (25 assignments)
 *       - Machine Learning category filter (10 assignments)
 *       - All / reset filter (35 assignments)
 *       - Concepts view switch on /work/
 *       - In-place filtering without navigating away
 *       - Clear active filter state (.is-active + aria-current="page")
 *       - Search + category filter integration
 *   §16 Removal of all tier concept / supporting-reference terminology
 *       - No "tier", "supporting", "reference" in public UI copy or metadata
 *       - Work browsing uses real categories: AI Fluency & Machine Learning
 *
 * Runs against the built site via `astro preview` (see playwright.config.ts).
 * Requires: npx playwright install chromium
 */
import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// §15 — Work filters on Home page
// ---------------------------------------------------------------------------

test('home page: AI Fluency filter shows 25 items and hides ML without navigating away (§15)', async ({
  page,
}) => {
  await page.goto('/');

  // Verify initial state: all 35 items visible across both tracks
  const allItems = page.locator('#browse [data-search-item]');
  await expect(allItems).toHaveCount(35);

  // Click AI Fluency filter tab
  const aiTab = page.locator('#browse [data-filter-track="ai-fluency"]');
  await expect(aiTab).toBeVisible();
  await aiTab.click();

  // Stayed on home page without navigating away
  expect(new URL(page.url()).pathname).toBe('/');

  // AI Fluency tab is active
  await expect(aiTab).toHaveClass(/is-active/);
  await expect(aiTab).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#browse [data-filter-track="all"]')).not.toHaveClass(/is-active/);
  await expect(page.locator('#browse [data-filter-track="machine-learning"]')).not.toHaveClass(/is-active/);

  // Exactly 25 AI Fluency items visible, 10 ML items hidden
  const visibleItems = page.locator('#browse [data-search-item]:not([hidden])');
  await expect(visibleItems).toHaveCount(25);
  await expect(page.locator('#browse [data-track-group][data-track="machine-learning"]')).toBeHidden();
  await expect(page.locator('#browse [data-track-group][data-track="ai-fluency"]')).toBeVisible();
});

test('home page: Machine Learning filter shows 10 items and hides AI Fluency without navigating away (§15)', async ({
  page,
}) => {
  await page.goto('/');

  const mlTab = page.locator('#browse [data-filter-track="machine-learning"]');
  await mlTab.click();

  // Stayed on home page
  expect(new URL(page.url()).pathname).toBe('/');

  // ML tab is active
  await expect(mlTab).toHaveClass(/is-active/);
  await expect(mlTab).toHaveAttribute('aria-current', 'page');

  // Exactly 10 ML items visible, AI Fluency hidden
  const visibleItems = page.locator('#browse [data-search-item]:not([hidden])');
  await expect(visibleItems).toHaveCount(10);
  await expect(page.locator('#browse [data-track-group][data-track="ai-fluency"]')).toBeHidden();
  await expect(page.locator('#browse [data-track-group][data-track="machine-learning"]')).toBeVisible();
});

test('home page: All filter restores all 35 assignments (§15)', async ({ page }) => {
  await page.goto('/');

  // First filter to ML
  await page.locator('#browse [data-filter-track="machine-learning"]').click();
  await expect(page.locator('#browse [data-search-item]:not([hidden])')).toHaveCount(10);

  // Reset by clicking All
  const allTab = page.locator('#browse [data-filter-track="all"]');
  await allTab.click();

  // Active state flips back to All
  await expect(allTab).toHaveClass(/is-active/);
  await expect(allTab).toHaveAttribute('aria-current', 'page');

  // All 35 assignments restored
  await expect(page.locator('#browse [data-search-item]:not([hidden])')).toHaveCount(35);
  await expect(page.locator('#browse [data-track-group][data-track="ai-fluency"]')).toBeVisible();
  await expect(page.locator('#browse [data-track-group][data-track="machine-learning"]')).toBeVisible();
});

// ---------------------------------------------------------------------------
// §15 — Work filters on dedicated /work/ page
// ---------------------------------------------------------------------------

test('/work/ page: AI Fluency filter shows 25 items without page reload (§15)', async ({
  page,
}) => {
  await page.goto('/work/');

  const aiTab = page.locator('[data-filter-track="ai-fluency"]');
  await aiTab.click();

  expect(new URL(page.url()).pathname).toBe('/work/');
  await expect(aiTab).toHaveClass(/is-active/);

  const visibleItems = page.locator('[data-search-item]:not([hidden])');
  await expect(visibleItems).toHaveCount(25);
  await expect(page.locator('[data-track-group][data-track="machine-learning"]')).toBeHidden();
});

test('/work/ page: Machine Learning filter shows 10 items without page reload (§15)', async ({
  page,
}) => {
  await page.goto('/work/');

  const mlTab = page.locator('[data-filter-track="machine-learning"]');
  await mlTab.click();

  expect(new URL(page.url()).pathname).toBe('/work/');
  await expect(mlTab).toHaveClass(/is-active/);

  const visibleItems = page.locator('[data-search-item]:not([hidden])');
  await expect(visibleItems).toHaveCount(10);
  await expect(page.locator('[data-track-group][data-track="ai-fluency"]')).toBeHidden();
});

test('/work/ page: Concepts tab toggles concepts grid in place (§15)', async ({ page }) => {
  await page.goto('/work/');

  const conceptsTab = page.locator('[data-filter-view="concepts"]');
  await conceptsTab.click();

  expect(new URL(page.url()).pathname).toBe('/work/');
  await expect(conceptsTab).toHaveClass(/is-active/);

  // Concepts view is visible, assignments view is hidden
  await expect(page.locator('[data-work-view="concepts"]')).toBeVisible();
  await expect(page.locator('[data-work-view="assignments"]')).toBeHidden();

  // Clicking All switches back to assignments view
  const allTab = page.locator('[data-filter-track="all"]');
  await allTab.click();

  await expect(allTab).toHaveClass(/is-active/);
  await expect(page.locator('[data-work-view="assignments"]')).toBeVisible();
  await expect(page.locator('[data-work-view="concepts"]')).toBeHidden();
  await expect(page.locator('[data-search-item]:not([hidden])')).toHaveCount(35);
});

// ---------------------------------------------------------------------------
// §15 — Search + category filter integration
// ---------------------------------------------------------------------------

test('search input filters within the active category (§15)', async ({ page }) => {
  await page.goto('/');

  // Filter to Machine Learning
  await page.locator('#browse [data-filter-track="machine-learning"]').click();
  await expect(page.locator('#browse [data-search-item]:not([hidden])')).toHaveCount(10);

  // Search for "capstone"
  const searchInput = page.locator('#browse [data-search-input]');
  await searchInput.fill('capstone');

  // Exactly 1 ML capstone item matches
  const visible = page.locator('#browse [data-search-item]:not([hidden])');
  await expect(visible).toHaveCount(1);
  await expect(page.locator('#browse a[href="/work/ml-08-capstone-modeling/"]')).toBeVisible();

  // Clear search: restores all 10 ML items
  await searchInput.fill('');
  await expect(page.locator('#browse [data-search-item]:not([hidden])')).toHaveCount(10);
});

// ---------------------------------------------------------------------------
// §16 — Complete removal of tier concept / supporting-reference terminology
// ---------------------------------------------------------------------------

test('no tier concept / supporting-reference terminology in public UI copy (§16)', async ({
  page,
}) => {
  for (const path of ['/', '/work/', '/framework/', '/reflection/']) {
    await page.goto(path);

    const bodyText = await page.locator('body').innerText();

    // The word "Tier" must not appear as a label or filter
    expect(bodyText).not.toMatch(/>\s*Tier\s*</i);
    expect(bodyText).not.toMatch(/supporting\s+reference/i);

    // No T1 / T2 / T3 filter buttons
    await expect(page.locator('[data-filter-tier]')).toHaveCount(0);
    await expect(page.locator('.filterbar__group--tier')).toHaveCount(0);
  }
});
