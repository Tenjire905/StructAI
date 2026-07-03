const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/opt/cursor/artifacts/screenshots/f2-modelcomparer';
const BASE_URL = 'http://localhost:8081';

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const platforms = [
    { key: 'ios', device: devices['iPhone 14'] },
    { key: 'android', device: devices['Pixel 7'] },
  ];
  const modes = ['playful', 'focus'];

  for (const platform of platforms) {
    for (const mode of modes) {
      const context = await browser.newContext({ ...platform.device, locale: 'de-DE' });
      const page = await context.newPage();

      try {
        await page.goto(`${BASE_URL}/dev-f2-modelcomparer-preview?mode=${mode}`, {
          waitUntil: 'networkidle',
        });
        await page.waitForTimeout(2200);

        const file = path.join(OUT_DIR, `modelcomparer_${platform.key}_${mode}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log('saved', file);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  console.log('done', OUT_DIR);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
