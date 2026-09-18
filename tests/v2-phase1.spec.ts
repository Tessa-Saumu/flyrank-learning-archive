/**
 * V2 Phase 1 verification suite (V2_IMPROVEMENT_SPEC §18, Phase 1).
 *
 * Covers the structural interaction phase:
 *   1. Assignment modal from assignment cards
 *   2. Two-column assignment layout
 *   3. Evidence panel
 *   4. Lazy evidence loading
 *   5. Cardinal assignment-card typography tokens
 *
 * Runs against the built site via `astro preview` (see playwright.config.ts).
 * Requires: npx playwright install chromium
 */
import { test, expect, type Page } from '@playwright/test';

async function openCardModal(page: Page, id = 'ml-09-validation-claim-audit') {
  await page.goto('/');
  const card = page.locator(`[data-assignment-id="${id}"]`).first();
  await card.click();
  const dialog = page.locator('[data-assignment-modal] dialog[open]');
  await expect(dialog).toBeVisible();
  await page.locator('[data-modal-body] .detail__grid').waitFor();
  return dialog;
}

test('assignment card opens in modal without navigating away', async ({ page }) => {
  const dialog = await openCardModal(page);

  await expect(page).toHaveURL('/');
  await expect(page.locator('[data-modal-body] .detail__title')).toContainText(
    'Validation and Research Claim Audit'
  );
  await expect(page.locator('[data-modal-body] .detail__beats')).toBeVisible();
  await expect(page.locator('[data-modal-body] .beat__label')).toHaveCount(3);
});

test('modal contains an evidence panel beside the assignment content', async ({ page }) => {
  await openCardModal(page);

  const panel = page.locator('[data-modal-body] [data-evidence-panel]');
  await expect(panel).toBeVisible();
  await expect(panel.locator('.evidence__label')).toHaveText('Evidence');
  // ML-09's evidence is the contained notebook viewport, with the real public
  // notebook link and the repository action (no artifact card, no iframe).
  await expect(panel.locator('.nb').first()).toBeVisible();
  await expect(
    panel.locator('.nb a[href*="w06_validation_audit.ipynb"]').first()
  ).toBeVisible();
  await expect(panel.locator('.nb a[href*="FlyRank-ML-Internship"]').first()).toBeVisible();
});

test('modal preserves background scroll position and Escape closes it', async ({ page }) => {
  await page.goto('/work/');
  const card = page.locator('[data-assignment-id="ml-09-validation-claim-audit"]').first();
  await card.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(0);

  await card.click();
  await page.locator('[data-modal-body] .detail__grid').waitFor();
  expect(await page.evaluate(() => window.scrollY)).toBe(before);

  await page.keyboard.press('Escape');
  await expect(page.locator('[data-assignment-modal] dialog[open]')).toHaveCount(0);
  await expect(page.locator('[data-assignment-modal] dialog')).toBeHidden();
  // Focus returns to the card that opened the modal.
  await expect(page.locator('[data-assignment-id="ml-09-validation-claim-audit"]').first()).toBeFocused();
});

test('close control closes the modal', async ({ page }) => {
  await openCardModal(page);
  await page.locator('[data-assignment-modal] [data-modal-close]').click();
  await expect(page.locator('[data-assignment-modal] dialog[open]')).toHaveCount(0);
});

test('evidence never ships a heavy viewer in the initial modal HTML', async ({ page }) => {
  await openCardModal(page);

  // No iframe/video/object exists in the modal until the visitor asks for it.
  expect(await page.locator('[data-modal-body] iframe, [data-modal-body] video, [data-modal-body] object').count()).toBe(0);

  // ML-09's notebook viewport is self-contained: real GitHub links only, no
  // embed is created and nothing is fabricated.
  await expect(page.locator('[data-modal-body] .nb').first()).toBeVisible();
  expect(await page.locator('[data-modal-body] iframe, [data-modal-body] video, [data-modal-body] object').count()).toBe(0);

  // An artifact card with a real PDF (FL-01) still creates its viewer lazily,
  // only after the visitor chooses "Show evidence".
  await page.keyboard.press('Escape');
  await page.locator('[data-assignment-id="fl-01-workflow-audit"]').first().click();
  await expect(page.locator('[data-assignment-modal] dialog[open]')).toBeVisible();
  await page.locator('[data-modal-body] .detail__grid').waitFor();

  expect(await page.locator('[data-modal-body] iframe').count()).toBe(0);
  const show = page.locator('[data-modal-body] [data-show-evidence]').first();
  await expect(show).toBeVisible();
  await show.click();
  const iframe = page.locator('[data-modal-body] iframe').first();
  await expect(iframe).toBeVisible();
  await expect(iframe).toHaveAttribute('src', /fl-01-workflow-audit\.pdf$/);
  // The URL is supplied, so the honest pending message stays hidden.
  await expect(page.locator('[data-modal-body] [data-evidence-pending]').first()).toBeHidden();
});

test('assignment cards share the canonical card typography tokens', async ({ page }) => {
  await page.goto('/work/');

  const labelOne = await page.locator('.acard__code').first().evaluate((el) => getComputedStyle(el).fontSize);
  const titleOne = await page.locator('.acard__title').first().evaluate((el) => getComputedStyle(el).fontSize);
  const metaOne = await page.locator('.acard__meta').first().evaluate((el) => getComputedStyle(el).fontSize);

  const allLabels = await page.locator('.acard__code').evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).fontSize)
  );
  const allTitles = await page.locator('.acard__title').evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).fontSize)
  );

  expect(allLabels.every((size) => size === labelOne)).toBe(true);
  expect(allTitles.every((size) => size === titleOne)).toBe(true);
  expect(allLabels[0]).not.toBe(allTitles[0]);
  expect(metaOne.length).toBeGreaterThan(0);
});

test('static detail page renders the two-column evidence layout', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/work/ml-09-validation-claim-audit/');
  await expect(page.locator('.detail__grid')).toBeVisible();
  await expect(page.locator('.detail__evidence-column [data-evidence-panel]')).toBeVisible();
});
