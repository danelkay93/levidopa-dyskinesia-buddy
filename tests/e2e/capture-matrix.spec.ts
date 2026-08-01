import { test, expect } from '@playwright/test';
import { capture, openState, viewports } from './support';

for (const viewport of viewports) {
  test(`default ${viewport.id}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = await openState(page, '/?now=09:30');
    await capture(page, `default-${viewport.id}`);
    expect(errors).toEqual([]);
  });
}

const states = [
  ['selected-dose', '/?now=09:30&state=dose-1130'],
  ['selected-overlap', '/?now=12:00&fixture=overlap&state=period-overlap'],
  ['overview', '/?now=09:30&state=overview'],
  ['analyze', '/?view=analyze&now=12:00&state=dose-1130'],
  ['editing', '/?view=schedule&now=09:30'],
  ['sharing', '/?view=schedule&now=09:30&state=sharing'],
  ['malformed', '/?s=not-valid&now=09:30'],
  ['midnight', '/?fixture=midnight&now=23:45'],
  ['dense', '/?fixture=dense&now=12:00'],
  ['long-low', '/?fixture=one&now=02:30'],
] as const;

for (const [name, path] of states) {
  test(name, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const errors = await openState(page, path);
    await capture(page, name);
    expect(errors).toEqual([]);
  });
}

test('selected dose tablet layout', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  const errors = await openState(page, '/?now=09:30&state=dose-1130');
  await capture(page, 'selected-dose-tablet-768');
  expect(errors).toEqual([]);
});

test('enlarged text reflows', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openState(page, '/?now=09:30');
  await page.addStyleTag({ content: ':root{font-size:125%} body{font-size:24px}' });
  await capture(page, 'enlarged-text');
});

test('reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await openState(page, '/?now=09:30&state=dose-1130');
  await capture(page, 'reduced-motion');
});
