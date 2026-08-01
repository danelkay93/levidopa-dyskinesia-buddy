import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import { waitForFeatureView } from './support';

const states = [
  ['default', '/?now=09:30'],
  ['analyze', '/?view=analyze&now=12:00'],
  ['editing', '/?view=schedule'],
  ['selected', '/?state=dose-1130&now=09:30'],
  ['dense', '/?fixture=dense&now=12:00'],
] as const;

for (const [name, path] of states) {
  test(`axe ${name}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await page.getByTestId('app-shell').waitFor();
    await waitForFeatureView(page);

    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    await fs.mkdir('artifacts/accessibility', { recursive: true });
    await fs.writeFile(`artifacts/accessibility/${name}.json`, JSON.stringify(result, null, 2));
    expect(result.violations).toEqual([]);

    const targets = await page.locator('button,input,[role=tab]').evaluateAll((elements) => elements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          label: element.getAttribute('aria-label') || element.textContent,
        };
      })
      .filter((target) => target.width > 1 && target.height > 1));
    const undersized = targets.filter((target) => target.width < 44 || target.height < 44);
    expect(undersized).toEqual([]);
  });
}
