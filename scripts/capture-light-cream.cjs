/**
 * Capture Home + Profile in Light appearance for visual review.
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/opt/cursor/artifacts/screenshots/light-cream';
const BASE_URL = process.env.EXPO_WEB_URL || 'http://127.0.0.1:8081';

fs.mkdirSync(OUT_DIR, { recursive: true });

async function forceLight(page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('structai.theme-appearance', 'light');
      window.localStorage.setItem('@structai/structai.theme-appearance', 'light');
    } catch {
      // ignore
    }
  });
}

async function skipToTabs(page) {
  // Best-effort: finish welcome / land on tabs if already onboarded.
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  const start = page.getByRole('button', { name: /Los geht's|Starten|Get started/i });
  if (await start.count()) {
    await start.first().click().catch(() => undefined);
    await page.waitForTimeout(800);
  }

  // Appearance chip (sun/moon) — prefer light if toggle visible.
  const lightChip = page.getByRole('button', { name: /Hell|Light|Erscheinungsbild/i });
  if (await lightChip.count()) {
    await lightChip.first().click().catch(() => undefined);
  }

  const modePlayful = page.getByText(/Verspielt|Playful/i);
  if (await modePlayful.count()) {
    await modePlayful.first().click().catch(() => undefined);
    const confirm = page.getByRole('button', { name: /Auswahl bestätigen|Bestätigen|Confirm/i });
    if (await confirm.count()) {
      await confirm.first().click().catch(() => undefined);
      await page.waitForTimeout(1200);
    }
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPhone 14'],
    locale: 'de-DE',
  });
  const page = await context.newPage();
  await forceLight(page);

  try {
    await skipToTabs(page);

    // Direct tab routes (Expo Router web)
    await page.goto(`${BASE_URL}/(tabs)`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => undefined);
    await page.waitForTimeout(2000);
    const homePath = path.join(OUT_DIR, 'home-light.png');
    await page.screenshot({ path: homePath, fullPage: true });
    console.log('saved', homePath);

    await page.goto(`${BASE_URL}/(tabs)/profil`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);

    // Ensure light via profile control if present
    const appearanceLight = page.getByText(/^Hell$|^Light$/i);
    if (await appearanceLight.count()) {
      await appearanceLight.first().click().catch(() => undefined);
      await page.waitForTimeout(600);
    }

    const profilePath = path.join(OUT_DIR, 'profile-light.png');
    await page.screenshot({ path: profilePath, fullPage: true });
    console.log('saved', profilePath);

    // Close-up of stats row if visible
    const stats = page.getByText(/Abgeschlossene Lektionen|Completed lessons|Aktuelle Serie|Current streak/i).first();
    if (await stats.count()) {
      const box = await stats.boundingBox();
      if (box) {
        const closeup = path.join(OUT_DIR, 'profile-stats-closeup.png');
        await page.screenshot({
          path: closeup,
          clip: {
            x: Math.max(0, box.x - 20),
            y: Math.max(0, box.y - 80),
            width: Math.min(390, box.width + 200),
            height: 160,
          },
        });
        console.log('saved', closeup);
      }
    }
  } catch (error) {
    console.error('capture failed', error);
    process.exitCode = 1;
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
