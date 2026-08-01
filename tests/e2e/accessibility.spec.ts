import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { schedules } from './fixtures/schedules';
import { installHarness, invokeChartClick, openApp } from './support/harness';

const accessibilityCases = [
  { id: 'default-320x568', width: 320, height: 568, fixture: schedules.defaultDay.doses },
  { id: 'default-390x844', width: 390, height: 844, fixture: schedules.defaultDay.doses },
  { id: 'default-768x1024', width: 768, height: 1024, fixture: schedules.defaultDay.doses },
  { id: 'dense-390x844', width: 390, height: 844, fixture: schedules.dense.doses },
] as const;

for (const accessibilityCase of accessibilityCases) {
  test(`axe capture · ${accessibilityCase.id}`, async ({ page }, testInfo) => {
    await page.setViewportSize({
      width: accessibilityCase.width,
      height: accessibilityCase.height,
    });
    await installHarness(page, accessibilityCase.fixture);
    await openApp(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const report = {
      id: accessibilityCase.id,
      url: page.url(),
      viewport: { width: accessibilityCase.width, height: accessibilityCase.height },
      violations: results.violations,
      incomplete: results.incomplete,
      passes: results.passes.map((pass) => ({
        id: pass.id,
        impact: pass.impact,
        description: pass.description,
        nodes: pass.nodes.length,
      })),
      summary: {
        violations: results.violations.length,
        seriousOrCritical: results.violations.filter((violation) =>
          violation.impact === 'serious' || violation.impact === 'critical'
        ).length,
        incomplete: results.incomplete.length,
      },
    };

    const directory = path.join(process.cwd(), 'artifacts', 'accessibility');
    await mkdir(directory, { recursive: true });
    const output = path.join(directory, `${accessibilityCase.id}.json`);
    await writeFile(output, JSON.stringify(report, null, 2));
    await testInfo.attach(`${accessibilityCase.id}-axe`, {
      path: output,
      contentType: 'application/json',
    });

    expect(results.testEngine.name).toBe('axe-core');
    if (process.env.AXE_ENFORCE === '1') {
      expect(report.summary.seriousOrCritical).toBe(0);
    } else if (report.summary.seriousOrCritical > 0) {
      testInfo.annotations.push({
        type: 'captured-accessibility-debt',
        description: `${report.summary.seriousOrCritical} serious/critical axe findings captured without treating the current prototype as an approved baseline.`,
      });
    }
  });
}

test('axe capture · selected dose and open editor', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await installHarness(page, schedules.defaultDay.doses);
  await openApp(page);
  await invokeChartClick(page, { seriesName: 'Dose pills', value: [450, 200, 0] });
  await page.locator('.ldm-schedule summary').click();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const directory = path.join(process.cwd(), 'artifacts', 'accessibility');
  await mkdir(directory, { recursive: true });
  const output = path.join(directory, 'selected-dose-editor-390x844.json');
  await writeFile(output, JSON.stringify(results, null, 2));
  await testInfo.attach('selected-dose-editor-axe', {
    path: output,
    contentType: 'application/json',
  });

  expect(results.testEngine.name).toBe('axe-core');
  if (process.env.AXE_ENFORCE === '1') {
    const seriousOrCritical = results.violations.filter((violation) =>
      violation.impact === 'serious' || violation.impact === 'critical'
    );
    expect(seriousOrCritical).toEqual([]);
  }
});
