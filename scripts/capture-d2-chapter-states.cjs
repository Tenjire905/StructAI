const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/opt/cursor/artifacts/screenshots/d2-chapter-states';
const BASE_URL = 'http://localhost:8081';

fs.mkdirSync(OUT_DIR, { recursive: true });

const PLATFORMS = [
  { key: 'ios', device: devices['iPhone 14'] },
  { key: 'android', device: devices['Pixel 7'] },
];

const MODES = ['playful', 'focus'];

async function captureScreenshot(page, platform, mode) {
  await page.goto(`${BASE_URL}/dev-d2-chapter-states-preview?mode=${mode}`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(1200);
  await page.getByText(/Kapitel|Chapters|Lecons|Главы/i).first().waitFor({ timeout: 15000 });

  const file = path.join(OUT_DIR, `path_detail_${platform.key}_${mode}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('saved', file);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const platform of PLATFORMS) {
    for (const mode of MODES) {
      const context = await browser.newContext({ ...platform.device, locale: 'de-DE' });
      const page = await context.newPage();

      try {
        await captureScreenshot(page, platform, mode);
      } catch (error) {
        console.error('capture failed', platform.key, mode, error.message);
        process.exitCode = 1;
      }

      await context.close();
    }
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
