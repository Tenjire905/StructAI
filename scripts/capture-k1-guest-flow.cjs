const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/opt/cursor/artifacts/screenshots/k1-guest-flow';
const BASE_URL = 'http://localhost:8081';

fs.mkdirSync(OUT_DIR, { recursive: true });

const PLATFORMS = [
  { key: 'ios', device: devices['iPhone 14'] },
  { key: 'android', device: devices['Pixel 7'] },
];

const MODES = ['playful', 'focus'];

async function completeOnboarding(page, mode) {
  await page.getByRole('button', { name: /Los geht's|Starten/i }).click();
  await page.waitForTimeout(400);
  await page.getByText(/Wie würdest du gerne lernen/i).waitFor({ timeout: 15000 });
  const modeLabel = mode === 'playful' ? /Verspielt/i : /Fokussiert/i;
  await page.getByText(modeLabel).click();
  await page.getByRole('button', { name: /Auswahl bestätigen|Bestätigen/i }).click();
  await page.waitForTimeout(1500);
}

async function captureGuestFlow(page, platform, mode) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  await page.getByText(/Lerne Prompting|KI-Prompting strukturiert/i).first().waitFor({ timeout: 15000 });
  const onboardingFile = path.join(OUT_DIR, `guest_onboarding_${platform.key}_${mode}.png`);
  await page.screenshot({ path: onboardingFile, fullPage: false });
  console.log('saved', onboardingFile);

  await completeOnboarding(page, mode);

  await page.getByText(/Willkommen zurück|Guten Tag/i).first().waitFor({ timeout: 15000 });
  const homeFile = path.join(OUT_DIR, `guest_home_${platform.key}_${mode}.png`);
  await page.screenshot({ path: homeFile, fullPage: false });
  console.log('saved', homeFile);

  await page.goto(`${BASE_URL}/lektion/pb-1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.getByText(/Schritt|Step/i).first().waitFor({ timeout: 15000 });
  const lessonFile = path.join(OUT_DIR, `guest_lesson_${platform.key}_${mode}.png`);
  await page.screenshot({ path: lessonFile, fullPage: false });
  console.log('saved', lessonFile);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const platform of PLATFORMS) {
    for (const mode of MODES) {
      const context = await browser.newContext({ ...platform.device, locale: 'de-DE' });
      const page = await context.newPage();

      try {
        await captureGuestFlow(page, platform, mode);
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
