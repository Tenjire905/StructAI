const { chromium, devices } = require('playwright');

const BASE_URL = 'http://localhost:8081';
const LESSON_URL = `${BASE_URL}/dev-j-new-types-lesson`;

const BADGE = {
  matching: /Zuordnen|Zuordnung/,
  error_finding: /Fehler finden|Fehlerstelle/,
  categorize: /Kategorien|Kategorisieren/,
};

const OTHER_BADGE_PATTERNS = {
  matching: [BADGE.error_finding, BADGE.categorize],
  error_finding: [BADGE.matching, BADGE.categorize],
  categorize: [BADGE.matching, BADGE.error_finding],
};

const checks = [];

function record(name, ok, detail = undefined) {
  checks.push({ name, ok, ...(detail !== undefined ? { detail } : {}) });
}

async function getCheckButton(page) {
  return page.getByRole('button', { name: /Prüfen|Antwort prüfen/i });
}

async function getNextButton(page) {
  return page.getByRole('button', { name: /Weiter/i });
}

async function assertCheckDisabled(page, label) {
  const button = await getCheckButton(page);
  const visible = await button.isVisible().catch(() => false);
  const disabled = visible ? await button.isDisabled() : null;
  record(label, visible && disabled === true, { visible, disabled });
}

async function assertCheckEnabled(page, label) {
  const button = await getCheckButton(page);
  const visible = await button.isVisible().catch(() => false);
  const disabled = visible ? await button.isDisabled() : null;
  record(label, visible && disabled === false, { visible, disabled });
}

async function assertBadge(page, stepType) {
  const badge = BADGE[stepType];
  await page.getByText(badge).first().waitFor({ timeout: 10000 });
  record(`StepTypeBadge shows ${stepType}`, true);

  for (const other of OTHER_BADGE_PATTERNS[stepType]) {
    const count = await page.getByText(other).count();
    record(`No stale badge from other type on ${stepType}`, count === 0, { staleCount: count });
  }
}

async function checkThenNext(page) {
  const check = page.getByRole('button', { name: /Prüfen|Antwort prüfen/i });
  await check.click();
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: /Weiter/i }).click();
  await page.waitForTimeout(250);
}

async function runMatchingStep(page, { wrong = false } = {}) {
  await page.getByText(/DEV J-Neu Matching:/).waitFor();
  await assertBadge(page, 'matching');
  await assertCheckDisabled(page, 'matching: Prüfen disabled before selection');

  if (wrong) {
    await page.getByRole('button', { name: 'Prompt' }).click();
    await page.getByRole('button', { name: 'Texteinheit' }).click();
    await page.getByRole('button', { name: 'Token' }).click();
    await page.getByRole('button', { name: 'Modell-Eingabe' }).click();
  } else {
    await page.getByRole('button', { name: 'Prompt' }).click();
    await page.getByRole('button', { name: 'Modell-Eingabe' }).click();
    await page.getByRole('button', { name: 'Token' }).click();
    await page.getByRole('button', { name: 'Texteinheit' }).click();
  }

  await assertCheckEnabled(page, 'matching: Prüfen enabled after full selection');
  record(
    'matching: no categorize pool on step 1',
    (await page.getByText('Zielgruppe nennen').count()) === 0,
  );
  await checkThenNext(page);
}

async function runErrorFindingStep(page) {
  await page.getByText(/DEV J-Neu Error-Finding:/).waitFor();
  await assertBadge(page, 'error_finding');
  await assertCheckDisabled(page, 'error_finding: Prüfen disabled before correct tap');

  await page.getByRole('button', { name: 'Schreibe' }).click();
  await page.waitForTimeout(200);
  await assertCheckDisabled(page, 'error_finding: Prüfen still disabled after wrong tap');

  record(
    'error_finding: wrong tap does not show categorize UI',
    (await page.getByText('Zielgruppe nennen').count()) === 0,
  );

  await page.getByRole('button', { name: 'irgendwie' }).click();
  await page.waitForTimeout(200);
  record(
    'error_finding: Weiter visible after correct segment (no separate Prüfen)',
    await page.getByRole('button', { name: /Weiter/i }).isVisible(),
  );
  await page.getByRole('button', { name: /Weiter/i }).click();
  await page.waitForTimeout(250);
}

async function runCategorizeStep(page, { wrong = false } = {}) {
  await page.getByText(/DEV J-Neu Categorize:/).waitFor();
  await assertBadge(page, 'categorize');
  await assertCheckDisabled(page, 'categorize: Prüfen disabled before assignments');

  record(
    'categorize: no matching-only instruction from step 1',
    (await page.getByText(/DEV J-Neu Matching:/).count()) === 0,
  );

  if (wrong) {
    await page.getByRole('button', { name: 'Zielgruppe nennen' }).click();
    await page.getByRole('button', { name: 'Format', exact: true }).click();
    await page.getByRole('button', { name: 'Bulletpoints nutzen' }).click();
    await page.getByRole('button', { name: 'Ziel', exact: true }).click();
  } else {
    await page.getByRole('button', { name: 'Zielgruppe nennen' }).click();
    await page.getByRole('button', { name: 'Ziel', exact: true }).click();
    await page.getByRole('button', { name: 'Bulletpoints nutzen' }).click();
    await page.getByRole('button', { name: 'Format', exact: true }).click();
  }

  await assertCheckEnabled(page, 'categorize: Prüfen enabled after all assignments');
  await checkThenNext(page);
}

async function assertMatchingStepCleanAfterRetry(page) {
  await page.getByText(/DEV J-Neu Matching:/).waitFor();
  await assertBadge(page, 'matching');
  await assertCheckDisabled(page, 'retry: matching Prüfen disabled (no categorize leak)');
  record(
    'retry: categorize item not visible on matching step',
    (await page.getByText('Zielgruppe nennen').count()) === 0,
  );
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 14'], locale: 'de-DE' });
  const page = await context.newPage();

  try {
    await page.goto(LESSON_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    await runMatchingStep(page);
    await runErrorFindingStep(page);
    await runCategorizeStep(page);

    await page.getByText(/Lektion geschafft|Lektion abgeschlossen/).first().waitFor({ timeout: 10000 });
    record('first run completes to completion screen', true);

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await assertMatchingStepCleanAfterRetry(page);
    record('reload after pass: step 1 clean', true);

    await runMatchingStep(page, { wrong: true });
    await runErrorFindingStep(page);
    await runCategorizeStep(page, { wrong: true });

    await page.getByText(/Schwelle nicht erreicht|Noch nicht geschafft/).first().waitFor({ timeout: 10000 });
    record('failed run shows retry screen', true);

    await page.getByRole('button', { name: /Erneut versuchen|Nochmal versuchen/i }).click();
    await page.waitForTimeout(500);
    await assertMatchingStepCleanAfterRetry(page);
    record('lesson retry resets to clean matching step', true);
  } catch (error) {
    record('unexpected failure', false, { error: error.message });
    process.exitCode = 1;
  } finally {
    const failed = checks.filter((entry) => !entry.ok);
    console.log(
      JSON.stringify(
        {
          lessonUrl: LESSON_URL,
          lessonId: 'dev-j-new-types',
          stepSequence: ['matching', 'error_finding', 'categorize'],
          checks,
          pass: failed.length === 0,
          failedCount: failed.length,
        },
        null,
        2,
      ),
    );
    await context.close();
    await browser.close();

    if (failed.length > 0) {
      process.exitCode = 1;
    }
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
