/**
 * Prevents mixed-language lessons: DE playful must never leak into en/fr/ru chrome sessions.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const indexSrc = readFileSync(join(root, 'data/lessonContent/index.ts'), 'utf8');
const resolveSrc = readFileSync(join(root, 'lib/resolveLessonContent.ts'), 'utf8');
const deSrc = readFileSync(join(root, 'data/lessonContent/de.ts'), 'utf8');
const frPb = readFileSync(join(root, 'data/lessonContent/fr_pb.ts'), 'utf8');
const enPb = readFileSync(join(root, 'data/lessonContent/en_pb.ts'), 'utf8');
const ruPb = readFileSync(join(root, 'data/lessonContent/ru_pb.ts'), 'utf8');

if (!indexSrc.includes('export function hasOwnLessonText')) {
  violations.push('lessonContent index must export hasOwnLessonText');
}
if (indexSrc.includes('LOCALE_LESSON_MAP.de[key]')) {
  violations.push('getLocalizedLessonText must not fall back to German for other locales');
}
if (!resolveSrc.includes('hasOwnLessonText')) {
  violations.push('resolveLessonContent must use hasOwnLessonText for existence checks');
}
if (resolveSrc.includes('getLocalizedLessonText(key, locale);\n  return localized !== key')) {
  violations.push('lessonTextExists must not treat DE fallback as own-locale existence');
}

function extractKeys(source) {
  return new Set([...source.matchAll(/^\s*['"]([^'"]+)['"]\s*:/gm)].map((match) => match[1]));
}

function extractValue(source, key) {
  const pattern = new RegExp(
    `['"]${key.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}['"]\\s*:\\s*['\`]([^'\`\\\\]*(?:\\\\.[^'\`\\\\]*)*)['\`]`,
  );
  const match = pattern.exec(source);
  return match?.[1] ?? null;
}

const deKeys = extractKeys(deSrc);
const frKeys = extractKeys(frPb);
const enKeys = extractKeys(enPb);
const ruKeys = extractKeys(ruPb);

const dePlayfulPb3 = [...deKeys].filter(
  (key) => key.startsWith('pb-3.') && key.endsWith('.playful'),
);

if (dePlayfulPb3.length === 0) {
  violations.push('expected DE playful keys for pb-3 (regression fixture)');
}

for (const key of dePlayfulPb3) {
  if (frKeys.has(key) || enKeys.has(key) || ruKeys.has(key)) {
    continue;
  }

  // Simulate fixed resolver: mode suffix missing in FR → must use FR base, not DE playful.
  const baseKey = key.replace(/\.playful$/, '');
  if (!frKeys.has(baseKey)) {
    violations.push(`FR missing base key ${baseKey} required when playful suffix is DE-only`);
    continue;
  }

  const frBase = extractValue(frPb, baseKey);
  const dePlayful = extractValue(deSrc, key);

  if (frBase && dePlayful && frBase === dePlayful) {
    violations.push(`FR base ${baseKey} unexpectedly equals DE playful text`);
  }

  // German marker from screenshot regression
  if (dePlayful?.includes('Zieldefinition') && frBase?.includes('Zieldefinition')) {
    violations.push('FR pb-3 must not resolve to German Zieldefinition');
  }
}

const frTitle = extractValue(frPb, 'pb-3.title');
const dePlayfulTitle = extractValue(deSrc, 'pb-3.title.playful');

if (!frTitle || frTitle.includes('Zieldefinition')) {
  violations.push(`FR pb-3.title must be French, got: ${frTitle}`);
}
if (dePlayfulTitle?.includes('Zieldefinition') && frTitle?.includes('Zieldefinition')) {
  violations.push('locale mix still present for pb-3 title');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-lesson-locale-consistency: ok');
