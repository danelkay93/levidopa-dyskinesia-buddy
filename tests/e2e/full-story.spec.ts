import { test, expect } from '@playwright/test';
import { openState } from './support';

test('full product story stays coherent across My Day, Analyze, editing, sharing, and recovery', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = await openState(page, '/?now=09:30');

  await expect(page.getByRole('heading', { name: 'Medication is building' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Next dose at 11:30/i })).toBeVisible();

  await page.getByTestId('day-overview').click();
  await expect(page.getByRole('heading', { name: 'Today at a glance', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Building/i }).first().click();
  await expect(page.getByText(/derived schedule period/i)).toBeVisible();
  await page.getByRole('button', { name: 'Open technical curve' }).click();

  await expect(page.getByRole('heading', { name: 'Analyze', level: 1 })).toBeVisible();
  await expect(page.getByRole('img', { name: /Technical modeled exposure curve/i })).toBeVisible();
  await page.getByRole('button', { name: 'Schedule' }).last().click();

  const increase = page.getByRole('button', { name: /Increase 07:30 dose/i });
  await increase.click();
  await expect(page.getByText('225 mg')).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByTestId('right-now')).toBeVisible();

  await page.getByRole('button', { name: 'Schedule' }).last().click();
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByRole('heading', { name: 'Share or export', exact: true })).toBeVisible();
  await expect(page.getByText('Names, notes, symptoms, or hidden metadata.')).toBeVisible();

  expect(errors).toEqual([]);
});
