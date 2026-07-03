/**
 * Ensures all locale copy catalogs expose the same keys.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const locales = ['de', 'en', 'fr', 'ru'];

function extractCopyKeys(relativePath) {
  const source = readFileSync(join(root, relativePath), 'utf8');
  const matches = source.matchAll(/^\s+'([^']+)':\s*\{/gm);
  return [...matches].map((match) => match[1]).sort();
}

const keysByLocale = Object.fromEntries(
  locales.map((locale) => [
    locale,
    extractCopyKeys(`theme/copy/${locale}.ts`),
  ]),
);

const referenceLocale = 'de';
const referenceKeys = keysByLocale[referenceLocale];
const cases = [];

for (const locale of locales) {
  if (locale === referenceLocale) {
    continue;
  }

  const keys = keysByLocale[locale];
  const missing = referenceKeys.filter((key) => !keys.includes(key));
  const extra = keys.filter((key) => !referenceKeys.includes(key));

  cases.push({
    locale,
    keyCount: keys.length,
    violations: [
      ...(missing.length === 0 ? [] : [`missing keys vs ${referenceLocale}: ${missing.join(', ')}`]),
      ...(extra.length === 0 ? [] : [`extra keys vs ${referenceLocale}: ${extra.join(', ')}`]),
    ],
  });
}

const totalViolations = cases.reduce((sum, entry) => sum + entry.violations.length, 0);

console.log(
  JSON.stringify(
    {
      referenceLocale,
      referenceKeyCount: referenceKeys.length,
      locales: keysByLocale,
      cases,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);

process.exit(totalViolations === 0 ? 0 : 1);
