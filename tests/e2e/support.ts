import { expect, type Page } from '@playwright/test';
import fs from 'node:fs/promises';

export const viewports = [
  { id: 'phone-320', width: 320, height: 568 },
  { id: 'phone-375', width: 375, height: 667 },
  { id: 'phone-390', width: 390, height: 844 },
  { id: 'phone-430', width: 430, height: 932 },
  { id: 'phone-landscape', width: 844, height: 390 },
  { id: 'tablet-768', width: 768, height: 1024 },
  { id: 'tablet-1024', width: 1024, height: 1366 },
];

export async function capture(page: Page, name: string) {
  await fs.mkdir('artifacts/screenshots', { recursive: true });
  await page.screenshot({ path: `artifacts/screenshots/${name}.png`, fullPage: true });
  const metrics = await page.evaluate(() => ({
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    targets: [...document.querySelectorAll<HTMLElement>('button,input,[role=tab]')].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        label: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 80),
        width: rect.width,
        height: rect.height,
      };
    }),
  }));
  await fs.mkdir('artifacts/metrics', { recursive: true });
  await fs.writeFile(`artifacts/metrics/${name}.json`, JSON.stringify(metrics, null, 2));
  expect(metrics.horizontalOverflow).toBe(false);
}

export async function openState(page: Page, path: string) {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(path);
  await expect(page).toHaveTitle('Levodopa Day Map');
  await expect(page.getByTestId('app-shell')).toBeVisible();
  return errors;
}
