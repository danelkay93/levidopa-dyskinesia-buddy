import { expect, test } from '@playwright/test';
import { schedules } from './fixtures/schedules';
import { installHarness, invokeChartClick, openApp } from './support/harness';

const visualComparisonEnabled = process.env.VISUAL_COMPARE === '1';

test.describe('opt-in visual comparison', () => {
  test.skip(
    !visualComparisonEnabled,
    'Current screenshots are captures, not approved visual baselines. Set VISUAL_COMPARE=1 only after an explicit baseline decision.',
  );

  test('default phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installHarness(page, schedules.defaultDay.doses);
    await openApp(page);
    await expect(page).toHaveScreenshot('default-phone-390x844.png', { fullPage: true });
  });

  test('selected dose phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installHarness(page, schedules.defaultDay.doses);
    await openApp(page);
    await invokeChartClick(page, { seriesName: 'Dose pills', value: [450, 200, 0] });
    await expect(page).toHaveScreenshot('selected-dose-phone-390x844.png', { fullPage: true });
  });

  test('minimum phone width', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await installHarness(page, schedules.defaultDay.doses);
    await openApp(page);
    await expect(page).toHaveScreenshot('default-phone-320x568.png', { fullPage: true });
  });
});
