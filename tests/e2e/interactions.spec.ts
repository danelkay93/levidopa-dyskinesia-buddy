import { test, expect } from '@playwright/test';
import { openState } from './support';

test('select dose and continue to Analyze', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openState(page, '/?now=09:30');
  await page.getByRole('button', { name: /Next dose at 11:30/i }).click();
  await expect(page.getByText(/deterministic schedule model/i)).toBeVisible();
  await page.getByRole('button', { name: /See dose in Analyze/i }).click();
  await expect(page.getByRole('heading', { name: 'Analyze', level: 1 })).toBeVisible();
});

test('edit schedule with large stepper', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openState(page, '/?view=schedule&now=09:30');
  const increase = page.getByRole('button', { name: /Increase 07:30 dose/i });
  await increase.click();
  await expect(page.getByText('225 mg')).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByTestId('right-now')).toBeVisible();
});

test('duplicate times block saving and removal can be undone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openState(page, '/?view=schedule&now=09:30');

  const timeInputs = page.getByRole('textbox', { name: 'Dose time in 24-hour format' });
  await timeInputs.nth(1).fill('07:30');
  await expect(page.getByRole('alert')).toContainText('different time');
  await expect(page.getByRole('button', { name: 'Done' })).toBeDisabled();

  await timeInputs.nth(1).fill('11:45');
  await expect(page.getByRole('button', { name: 'Done' })).toBeEnabled();

  await page.getByRole('button', { name: 'Remove dose at 19:00' }).click();
  await expect(page.getByText('Dose at 19:00 removed.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('button', { name: 'Remove dose at 19:00' })).toBeVisible();
});

test('malformed shared URL explains recovery', async ({ page }) => {
  await openState(page, '/?s=bad');
  await expect(page.getByRole('alert')).toContainText('could not be read');
});

test('keyboard reaches primary navigation and chart alternatives', async ({ page }) => {
  await openState(page, '/?view=analyze');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  await expect(page.getByRole('button', { name: 'My Day' })).toBeVisible();
  await expect(page.getByRole('button', { name: /07:30/ }).first()).toBeVisible();
});
