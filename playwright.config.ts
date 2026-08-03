import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/e2e', fullyParallel:true, forbidOnly:Boolean(process.env.CI), retries:process.env.CI?1:0, workers:process.env.CI?2:undefined, timeout:45_000,
  expect:{timeout:10_000,toHaveScreenshot:{animations:'disabled',caret:'hide',maxDiffPixelRatio:.02}},
  reporter:[['list'],['html',{outputFolder:'artifacts/playwright-report',open:'never'}],['json',{outputFile:'artifacts/reports/playwright-results.json'}],['junit',{outputFile:'artifacts/reports/junit.xml'}]],
  outputDir:'artifacts/test-results', snapshotPathTemplate:'{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure',screenshot:'only-on-failure',video:'retain-on-failure',colorScheme:'light',locale:'en-US',timezoneId:'America/New_York'},
  projects:[{name:'webkit',use:{...devices['Desktop Safari'],browserName:'webkit'}}],
  webServer:{command:'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI,timeout:30_000},
});
