/**
 * P3.1 — App Store one-liner surfaces + Focus density presentation tokens.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

const violations = [];

const theme = readFileSync(join(root, 'theme/theme.ts'), 'utf8');
const card = readFileSync(join(root, 'components/ui/Card.tsx'), 'utf8');
const onboarding = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');
const home = readFileSync(join(root, 'app/(tabs)/index.tsx'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');
const de = readFileSync(join(root, 'theme/copy/de.ts'), 'utf8');
const fr = readFileSync(join(root, 'theme/copy/fr.ts'), 'utf8');
const ru = readFileSync(join(root, 'theme/copy/ru.ts'), 'utf8');

if (!theme.includes('preferredCardPadding')) {
  violations.push('theme presentation must define preferredCardPadding');
}
if (!theme.includes('preferredSectionGap')) {
  violations.push('theme presentation must define preferredSectionGap');
}
if (!card.includes('preferredCardPadding')) {
  violations.push('Card must use preferredCardPadding');
}
if (!home.includes('preferredSectionGap')) {
  violations.push('Home must use preferredSectionGap');
}
if (!onboarding.includes('StructAI')) {
  violations.push('Onboarding welcome must show StructAI brand hero');
}

const storeLineNeedle =
  'StructAI teaches you to write better prompts and judge AI answers through short lessons, live scoring, and a BYOK Prompt Lab.';

if (!en.includes(storeLineNeedle)) {
  violations.push('EN welcomeSub must carry the App Store one-liner');
}

for (const [locale, source] of [
  ['de', de],
  ['fr', fr],
  ['ru', ru],
]) {
  if (!source.includes("'onboarding.welcomeSub'")) {
    violations.push(`${locale}: missing onboarding.welcomeSub`);
  }
  if (!source.includes('BYOK')) {
    violations.push(`${locale}: welcomeSub should mention BYOK Prompt Lab`);
  }
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-store-line-focus-density: ok');
