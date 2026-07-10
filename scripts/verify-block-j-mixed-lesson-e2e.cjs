const { chromium, devices } = require('playwright');

const BASE_URL = 'http://localhost:8081';
const LESSON_URL = `${BASE_URL}/dev-j-mixed-lesson`;

async function clickPrimary(page) {
  const check = page.getByRole('button', { name: /Prüfen|Antwort prüfen/i });
  const next = page.getByRole('button', { name: /Weiter/i });

  if (await check.isVisible().catch(() => false)) {
    if (await check.isEnabled().catch(() => false)) {
      await check.click();
      return 'check';
    }
  }

  if (await next.isVisible().catch(() => false)) {
    await next.click();
    return 'next';
  }

  throw new Error('No primary button found');
}

async function checkThenNext(page) {
  await clickPrimary(page);
  await page.waitForTimeout(300);
  await clickPrimary(page);
}

async function advanceInfo(page) {
  await page.getByText(/DEV Info Step/).waitFor({ timeout: 15000 });
  await clickPrimary(page);
}

async function advanceChoice(page) {
  await page.getByText(/DEV Choice:/).waitFor();
  await page.getByRole('button', { name: 'Korrekt' }).click();
  await checkThenNext(page);
}

async function advanceFillBlank(page) {
  await page.getByText(/DEV Lücke:/).waitFor();
  await page.getByText('Prompt', { exact: true }).click();
  await checkThenNext(page);
}

async function advanceTrueFalse(page) {
  await page.getByText(/DEV Wahr\/Falsch:/).waitFor();
  await page.getByRole('button', { name: 'Wahr' }).click();
  await checkThenNext(page);
}

async function advanceReorder(page) {
  await page.getByText(/DEV Reorder:/).waitFor();
  await checkThenNext(page);
}

async function advanceMatching(page) {
  await page.getByText(/DEV Matching:/).waitFor();
  await page.getByRole('button', { name: 'Prompt' }).click();
  await page.getByRole('button', { name: 'Modell-Eingabe' }).click();
  await page.getByRole('button', { name: 'Token' }).click();
  await page.getByRole('button', { name: 'Texteinheit' }).click();
  await checkThenNext(page);
}

async function advanceErrorFinding(page) {
  await page.getByText(/DEV Error-Finding:/).waitFor();
  await page.getByRole('button', { name: 'irgendwie' }).click();
  await clickPrimary(page);
}

async function advanceCategorize(page) {
  await page.getByText(/DEV Categorize:/).waitFor();
  await page.getByRole('button', { name: 'Zielgruppe nennen' }).click();
  await page.getByRole('button', { name: 'Ziel', exact: true }).click();
  await page.getByRole('button', { name: 'Bulletpoints nutzen' }).click();
  await page.getByRole('button', { name: 'Format', exact: true }).click();
  await checkThenNext(page);
}

const STEPS = [
  { type: 'info', run: advanceInfo },
  { type: 'choice', run: advanceChoice },
  { type: 'fill_blank', run: advanceFillBlank },
  { type: 'true_false', run: advanceTrueFalse },
  { type: 'reorder', run: advanceReorder },
  { type: 'matching', run: advanceMatching },
  { type: 'error_finding', run: advanceErrorFinding },
  { type: 'categorize', run: advanceCategorize },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 14'], locale: 'de-DE' });
  const page = await context.newPage();
  const results = [];

  try {
    await page.goto(LESSON_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);

    for (const step of STEPS) {
      await step.run(page);
      results.push({ type: step.type, ok: true });
    }

    await page.getByText(/Lektion geschafft|Lektion abgeschlossen/).first().waitFor({ timeout: 10000 });
  } catch (error) {
    results.push({ ok: false, error: error.message });
    process.exitCode = 1;
  } finally {
    console.log(JSON.stringify({ lessonUrl: LESSON_URL, results }, null, 2));
    await context.close();
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
