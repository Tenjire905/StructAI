/**
 * Verifies resolveLocaleFromDevice mapping rules (mirrors theme/locale.ts).
 */

const LOCALES = ['de', 'en', 'fr', 'ru'];
const DEFAULT_LOCALE = 'de';

function isLocale(value) {
  return LOCALES.includes(value);
}

function resolveLocaleFromDevice(languageTag) {
  const raw = languageTag ?? 'de-DE';
  const normalized = raw.trim().toLowerCase().replace(/_/g, '-');
  const primary = normalized.split('-')[0] ?? '';
  return isLocale(primary) ? primary : DEFAULT_LOCALE;
}

const cases = [
  ['de-DE', 'de'],
  ['de', 'de'],
  ['en-US', 'en'],
  ['en_GB', 'en'],
  ['fr-FR', 'fr'],
  ['ru-RU', 'ru'],
  ['es-ES', 'de'],
  ['zh-Hans', 'de'],
  ['pt-BR', 'de'],
  ['  FR-ca ', 'fr'],
];

const failures = cases
  .map(([input, expected]) => {
    const actual = resolveLocaleFromDevice(input);
    return actual === expected ? null : { input, expected, actual };
  })
  .filter(Boolean);

console.log(
  JSON.stringify(
    {
      pass: failures.length === 0,
      failures,
      sampleCount: cases.length,
    },
    null,
    2,
  ),
);

process.exit(failures.length === 0 ? 0 : 1);
