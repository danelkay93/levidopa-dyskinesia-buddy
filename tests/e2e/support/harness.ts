import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';
import type { DoseFixture } from '../fixtures/schedules';

const require = createRequire(import.meta.url);
const echartsBundlePath = require.resolve('echarts/dist/echarts.min.js');

const defaultDoseDeclaration = `  var doses = [
    { time: "07:30", mg: 200 },
    { time: "11:30", mg: 100 },
    { time: "15:00", mg: 100 },
    { time: "19:00", mg: 100 }
  ];`;

const instrumentedDoseDeclaration = `  var doses = Array.isArray(window.__LDM_TEST_SCHEDULE__)
    ? window.__LDM_TEST_SCHEDULE__.map(function (dose) {
        return { time: String(dose.time), mg: Number(dose.mg) };
      })
    : [
        { time: "07:30", mg: 200 },
        { time: "11:30", mg: 100 },
        { time: "15:00", mg: 100 },
        { time: "19:00", mg: 100 }
      ];`;

const echartsUrl = 'https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.min.js';
const echartsTag = `<script src="${echartsUrl}"></script>`;
const instrumentation = `${echartsTag}
<script data-ldm-test-harness>
(function () {
  var originalInit = window.echarts && window.echarts.init;
  if (!originalInit) return;
  window.echarts.init = function () {
    var chart = originalInit.apply(this, arguments);
    window.__LDM_TEST_CHART__ = chart;
    var originalOn = chart.on.bind(chart);
    chart.on = function (eventName, handler) {
      if (eventName === "click") window.__LDM_TEST_CLICK_HANDLER__ = handler;
      return originalOn.apply(chart, arguments);
    };
    return chart;
  };
})();
</script>`;

export type BrowserIssue = {
  type: 'console' | 'pageerror' | 'requestfailed';
  message: string;
};

export async function installHarness(page: Page, schedule?: DoseFixture[]): Promise<BrowserIssue[]> {
  const issues: BrowserIssue[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') issues.push({ type: 'console', message: message.text() });
  });
  page.on('pageerror', (error) => issues.push({ type: 'pageerror', message: error.message }));
  page.on('requestfailed', (request) => {
    const failure = request.failure();
    issues.push({
      type: 'requestfailed',
      message: `${request.method()} ${request.url()} — ${failure?.errorText ?? 'unknown failure'}`,
    });
  });

  await page.addInitScript(({ fixture }) => {
    Object.defineProperty(window, '__LDM_TEST_SCHEDULE__', {
      configurable: true,
      value: fixture,
    });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async () => {
        Object.defineProperty(window, '__LDM_TEST_SHARE_CALLED__', {
          configurable: true,
          value: true,
        });
      },
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          Object.defineProperty(window, '__LDM_TEST_CLIPBOARD__', {
            configurable: true,
            value,
          });
        },
      },
    });
  }, { fixture: schedule ?? null });

  await page.route(echartsUrl, async (route) => {
    const body = await readFile(echartsBundlePath, 'utf8');
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      body,
    });
  });

  await page.route('http://127.0.0.1:4173/**', async (route) => {
    if (route.request().resourceType() !== 'document') {
      await route.continue();
      return;
    }

    const response = await route.fetch();
    let body = await response.text();
    if (!body.includes(defaultDoseDeclaration)) {
      throw new Error('Verification harness could not find the production dose declaration.');
    }
    if (!body.includes(echartsTag)) {
      throw new Error('Verification harness could not find the ECharts script tag.');
    }

    body = body
      .replace(defaultDoseDeclaration, instrumentedDoseDeclaration)
      .replace(echartsTag, instrumentation);

    await route.fulfill({ response, body });
  });

  return issues;
}

export async function openApp(page: Page, query = ''): Promise<void> {
  await page.goto(`/${query}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => {
    return Boolean(
      document.querySelector('#levodopa-day-map') &&
      document.body.innerText.trim().length > 100 &&
      (window as typeof window & { __LDM_TEST_CHART__?: unknown }).__LDM_TEST_CHART__
    );
  });
  await page.locator('#ldm-chart canvas').first().waitFor({ state: 'visible' });
}

export async function invokeChartClick(
  page: Page,
  payload: { seriesName: string; value: unknown[] },
): Promise<void> {
  await page.evaluate((clickPayload) => {
    const handler = (window as typeof window & {
      __LDM_TEST_CLICK_HANDLER__?: (value: unknown) => void;
    }).__LDM_TEST_CLICK_HANDLER__;
    if (!handler) throw new Error('Chart click handler was not captured.');
    handler(clickPayload);
  }, payload);
}

export async function captureScreenshot(page: Page, name: string): Promise<string> {
  const directory = path.join(process.cwd(), 'artifacts', 'screenshots');
  await mkdir(directory, { recursive: true });
  const output = path.join(directory, `${name}.png`);
  await page.screenshot({ path: output, fullPage: true, animations: 'disabled' });
  return output;
}

export async function captureMetrics(page: Page, name: string, testInfo: TestInfo): Promise<void> {
  const metrics = await page.evaluate(() => {
    const interactive = Array.from(
      document.querySelectorAll<HTMLElement>('button, input, summary, a, [role="button"], [tabindex]'),
    ).filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    }).map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        role: element.getAttribute('role'),
        label: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 80) || null,
        width: Math.round(rect.width * 10) / 10,
        height: Math.round(rect.height * 10) / 10,
      };
    });

    const landmarks = Array.from(
      document.querySelectorAll('main, nav, header, footer, aside, [role="main"], [role="navigation"]'),
    ).map((element) => ({ tag: element.tagName.toLowerCase(), role: element.getAttribute('role') }));

    return {
      title: document.title,
      url: location.href,
      bodyTextLength: document.body.innerText.trim().length,
      viewport: { width: innerWidth, height: innerHeight },
      document: {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        clientHeight: document.documentElement.clientHeight,
        scrollHeight: document.documentElement.scrollHeight,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      },
      semanticStructure: {
        headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((heading) => ({
          level: heading.tagName.toLowerCase(),
          text: heading.textContent?.trim() ?? '',
        })),
        landmarks,
        canvasCount: document.querySelectorAll('canvas').length,
        roleImageCount: document.querySelectorAll('[role="img"]').length,
        chartFocusableDescendants: document.querySelectorAll('#ldm-chart [tabindex], #ldm-chart button, #ldm-chart a').length,
      },
      interactive,
      targetsBelow44: interactive.filter((target) => target.width < 44 || target.height < 44),
      targetsBelow52: interactive.filter((target) => target.width < 52 || target.height < 52),
      chartAriaLabel: document.getElementById('ldm-chart')?.getAttribute('aria-label') ?? null,
      inspectorText: document.querySelector('.ldm-inspector')?.textContent?.trim() ?? null,
    };
  });

  const directory = path.join(process.cwd(), 'artifacts', 'metrics');
  await mkdir(directory, { recursive: true });
  const output = path.join(directory, `${name}.json`);
  await writeFile(output, JSON.stringify(metrics, null, 2));
  await testInfo.attach(`${name}-metrics`, { path: output, contentType: 'application/json' });
}

export async function attachBrowserIssues(
  issues: BrowserIssue[],
  name: string,
  testInfo: TestInfo,
): Promise<void> {
  const directory = path.join(process.cwd(), 'artifacts', 'browser');
  await mkdir(directory, { recursive: true });
  const output = path.join(directory, `${name}.json`);
  await writeFile(output, JSON.stringify(issues, null, 2));
  await testInfo.attach(`${name}-browser-issues`, { path: output, contentType: 'application/json' });
}
