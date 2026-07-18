/**
 * Static checks for Orb Language v1 (ORB_LANGUAGE.md).
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

const violations = [];

const orbLanguage = read('lib/orbLanguage.ts');
const orbCompanion = read('components/features/OrbCompanion.tsx');
const orbPresence = read('components/features/OrbPresence.tsx');
const lesson = read('app/lektion/[id].tsx');
const hook = read('hooks/useOrbCompanionState.ts');
const doc = read('ORB_LANGUAGE.md');
const copyEn = read('theme/copy/en.ts');

for (const state of ['think', 'worry']) {
  if (!hook.includes(`'${state}'`)) {
    violations.push(`useOrbCompanionState must include '${state}'`);
  }
}

if (!orbLanguage.includes('resolveLessonOrbState')) {
  violations.push('lib/orbLanguage.ts must export resolveLessonOrbState');
}

if (!orbLanguage.includes('resolveOrbSpeechCopyKey')) {
  violations.push('lib/orbLanguage.ts must export resolveOrbSpeechCopyKey');
}

if (!orbLanguage.includes("mode !== 'playful'")) {
  violations.push('speech must stay Playful-only');
}

if (!orbCompanion.includes('withDelay') || !orbCompanion.includes('blink')) {
  violations.push('OrbCompanion must implement a Playful blink loop');
}

if (!orbCompanion.includes("state === 'think'") && !orbCompanion.includes("case 'think'")) {
  violations.push('OrbCompanion must render a think expression');
}

if (!orbCompanion.includes("case 'worry'")) {
  violations.push('OrbCompanion must render a worry expression');
}

if (!orbPresence.includes('resolveOrbSpeechCopyKey')) {
  violations.push('OrbPresence must resolve speech via orbLanguage helper');
}

if (!lesson.includes('OrbPresence') || !lesson.includes('resolveLessonMoment')) {
  violations.push('Lesson screen must drive OrbPresence from lesson moments');
}

if (!doc.includes('Orb Language v1')) {
  violations.push('ORB_LANGUAGE.md must document v1 decisions');
}

for (const key of [
  'orb.speech.think',
  'orb.speech.happy',
  'orb.speech.worry',
  'orb.speech.celebrating',
  'orb.speech.lowEnergy',
]) {
  if (!copyEn.includes(`'${key}'`)) {
    violations.push(`en copy missing ${key}`);
  }
}

console.log(
  JSON.stringify(
    {
      scope: 'orb-language-v1',
      violations,
      pass: violations.length === 0,
    },
    null,
    2,
  ),
);

if (violations.length > 0) {
  process.exitCode = 1;
}
