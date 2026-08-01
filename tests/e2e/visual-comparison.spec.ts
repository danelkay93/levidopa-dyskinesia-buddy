import { test, expect } from '@playwright/test';
import { waitForFeatureView } from './support';

test.skip(!process.env.VISUAL_COMPARE, 'Set VISUAL_COMPARE=1 to enable approved-baseline comparison');
const cases = [
  ['default-390', '/?now=09:30', { width: 390, height: 844 }],
  ['default-320', '/?now=09:30', { width: 320, height: 568 }],
  ['tablet-768', '/?now=09:30&state=dose-1130', { width: 768, height: 1024 }],
  ['analyze-390', '/?view=analyze&now=12:00', { width: 390, height: 844 }],
] as const;

for (const [name, path, viewport] of cases) {
  test(name, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(path);
    await page.getByTestId('app-shell').waitFor();
    await waitForFeatureView(page);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
