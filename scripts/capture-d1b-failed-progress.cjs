const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/opt/cursor/artifacts/screenshots/d1b-failed-progress';
const BASE_URL = 'http://localhost:8081';

fs.mkdirSync(OUT_DIR, { recursive: true });

const PLATFORMS = [
  { key: 'ios', device: devices['iPhone 14'] },
  { key: 'android', device: devices['Pixel 7'] },
];

const MODES = ['playful', 'focus'];
const SCREENS = [
  { key: 'home', screen: 'home' },
  { key: 'path_detail', screen: 'detail' },
];

async function captureScreenshot(page, platform, mode, screen) {
  await page.goto(
    `${BASE_URL}/dev-d1b-progress-preview?mode=${mode}&screen=${screen.screen}`,
    { waitUntil: 'networkidle' },
  );
  await page.waitForTimeout(1200);

  const file = path.join(OUT_DIR, `${screen.key}_${platform.key}_${mode}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('saved', file);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const platform of PLATFORMS) {
    for (const mode of MODES) {
      for (const screen of SCREENS) {
        const context = await browser.newContext({ ...platform.device, locale: 'de-DE' });
        const page = await context.newPage();

        try {
          await captureScreenshot(page, platform, mode, screen);
        } catch (error) {
          console.error('capture failed', platform.key, mode, screen.key, error.message);
          process.exitCode = 1;
        }

        await context.close();
      }
    }
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
