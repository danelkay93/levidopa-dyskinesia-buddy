import { expect, test } from '@playwright/test';
import { requiredViewports, schedules } from './fixtures/schedules';
import {
  attachBrowserIssues,
  captureMetrics,
  captureScreenshot,
  installHarness,
  invokeChartClick,
  openApp,
} from './support/harness';

for (const viewport of requiredViewports) {
  test(`current prototype · default · ${viewport.id}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const issues = await installHarness(page, schedules.defaultDay.doses);
    await openApp(page);

    await expect(page).toHaveTitle('Levodopa Day Map');
    await expect(page.locator('#levodopa-day-map')).toBeVisible();
    await expect(page.locator('#ldm-chart')).toBeVisible();

    const name = `current-default-${viewport.id}`;
    await captureScreenshot(page, name);
    await captureMetrics(page, name, testInfo);
    await attachBrowserIssues(issues, name, testInfo);
  });
}

test.describe('current prototype · interaction and fixture states', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('selected dose', async ({ page }, testInfo) => {
    const issues = await installHarness(page, schedules.defaultDay.doses);
    await openApp(page);
    await invokeChartClick(page, { seriesName: 'Dose pills', value: [450, 200, 0] });
    await expect(page.locator('#ldm-inspector-title')).toContainText('07:30 · 200 mg');

    const name = 'current-selected-dose-phone-390x844';
    await captureScreenshot(page, name);
    await captureMetrics(page, name, testInfo);
    await attachBrowserIssues(issues, name, testInfo);
  });

  test('selected time', async ({ page }, testInfo) => {
    const issues = await installHarness(page, schedules.defaultDay.doses);
    await openApp(page);
    await invokeChartClick(page, { seriesName: 'Total curve', value: [720, 0.5] });
    await expect(page.locator('#ldm-inspector-title')).toContainText('12:00');

    const name = 'current-selected-time-phone-390x844';
    await captureScreenshot(page, name);
    await captureMetrics(page, name, testInfo);
    await attachBrowserIssues(issues, name, testInfo);
  });

  test('selected overlap crest', async ({ page }, testInfo) => {
    const issues = await installHarness(page, schedules.overlap.doses);
    await openApp(page);
    await invokeChartClick(page, { seriesName: 'Reference points', value: [0, 0, 0] });
    await expect(page.locator('#ldm-inspector-title')).toContainText("Today's high");

    const name = 'current-selected-overlap-phone-390x844';
    await captureScreenshot(page, name);
    await captureMetrics(page, name, testInfo);
    await attachBrowserIssues(issues, name, testInfo);
  });

  test('selected fast transition', async ({ page }, testInfo) => {
    const issues = await installHarness(page, schedules.defaultDay.doses);
    await openApp(page);
    await invokeChartClick(page, { seriesName: 'Reference points', value: [0, 0, 1] });
    await expect(page.locator('#ldm-inspector-title')).toContainText('Quickest climb');

    const name = 'current-selected-fast-transition-phone-390x844';
    await captureScreenshot(page, name);
    await captureMetrics(page, name, testInfo);
    await attachBrowserIssues(issues, name, testInfo);
  });

  test('selected long low period', async ({ page }, testInfo) => {
    const issues = await installHarness(page, schedules.oneDose.doses);
    await openApp(page);
    await invokeChartClick(page, { seriesName: 'OFF periods', value: [0, 0, 0] });
    await expect(page.locator('#ldm-inspector-title')).toContainText('OFF');

    const name = 'current-selected-long-low-phone-390x844';
    await captureScreenshot(page, name);
    await captureMetrics(page, name, testInfo);
    await attachBrowserIssues(issues, name, testInfo);
  });

  test('schedule editing', async ({ page }, testInfo) => {
    const issues = await installHarness(page, schedules.defaultDay.doses);
    await openApp(page);
    await page.locator('.ldm-schedule summary').click();
    const firstTime = page.locator('input[data-time="0"]');
    await firstTime.fill('08:00');
    await firstTime.dispatchEvent('change');
    await expect(page.locator('#ldm-schedule-summary')).toContainText('08:00');

    const name = 'current-schedule-editing-phone-390x844';
    await captureScreenshot(page, name);
    await captureMetrics(page, name, testInfo);
    await attachBrowserIssues(issues, name, testInfo);
  });

  test('share action', async ({ page }, testInfo) => {
    const issues = await installHarness(page, schedules.defaultDay.doses);
    await openApp(page);
    await page.locator('.ldm-schedule summary').click();
    await page.locator('#ldm-share').click();
    await expect(page.locator('#ldm-share-status')).toHaveText('Shared');

    const name = 'current-share-phone-390x844';
    await captureScreenshot(page, name);
    await captureMetrics(page, name, testInfo);
    await attachBrowserIssues(issues, name, testInfo);
  });

  test('malformed shared URL', async ({ page }, testInfo) => {
    const issues = await installHarness(page);
    await openApp(page, '?s=definitely-not-a-valid-schedule');
    await expect(page.locator('#ldm-schedule-summary')).toContainText('07:30');
    testInfo.annotations.push({
      type: 'known-product-gap',
      description: 'Malformed shared URLs silently fall back to the default schedule; no recovery message is shown.',
    });

    const name = 'current-malformed-shared-url-phone-390x844';
    await captureScreenshot(page, name);
    await captureMetrics(page, name, testInfo);
    await attachBrowserIssues(issues, name, testInfo);
  });

  for (const fixture of [schedules.midnightWrap, schedules.oneDose, schedules.dense]) {
    test(`${fixture.id} fixture`, async ({ page }, testInfo) => {
      const issues = await installHarness(page, fixture.doses);
      await openApp(page);
      await page.locator('.ldm-schedule summary').click();
      await expect(page.locator('.ldm-dose-row')).toHaveCount(fixture.doses.length);

      const name = `current-${fixture.id}-phone-390x844`;
      await captureScreenshot(page, name);
      await captureMetrics(page, name, testInfo);
      await attachBrowserIssues(issues, name, testInfo);
    });
  }
});

test('current prototype · enlarged text and reflow', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const issues = await installHarness(page, schedules.defaultDay.doses);
  await openApp(page);
  await page.addStyleTag({
    content: ':root { --font-size-base: 24px !important; } html { font-size: 125% !important; }',
  });
  await page.locator('.ldm-schedule summary').click();

  const name = 'current-enlarged-text-phone-390x844';
  await captureScreenshot(page, name);
  await captureMetrics(page, name, testInfo);
  await attachBrowserIssues(issues, name, testInfo);
});

test('current prototype · reduced motion', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const issues = await installHarness(page, schedules.defaultDay.doses);
  await openApp(page);

  const name = 'current-reduced-motion-phone-390x844';
  await captureScreenshot(page, name);
  await captureMetrics(page, name, testInfo);
  await attachBrowserIssues(issues, name, testInfo);
});

test('current prototype · increased contrast approximation', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ forcedColors: 'active' });
  const issues = await installHarness(page, schedules.defaultDay.doses);
  await openApp(page);

  const name = 'current-forced-colors-phone-390x844';
  await captureScreenshot(page, name);
  await captureMetrics(page, name, testInfo);
  await attachBrowserIssues(issues, name, testInfo);
});
