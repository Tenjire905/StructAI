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
const orbSvg = read('components/features/OrbSvgCompanion.tsx');
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

if (!orbLanguage.includes('resolveLessonSpeechCopyKey')) {
  violations.push('lib/orbLanguage.ts must export resolveLessonSpeechCopyKey');
}

if (!orbLanguage.includes("mode === 'focus'")) {
  violations.push('Focus speech must be gated to post-check tips');
}

if (!orbLanguage.includes('FOCUS_FEEDBACK_SPEECH') && !orbLanguage.includes('focus.correctTip')) {
  violations.push('Focus tip speech variants are missing');
}

if (!orbCompanion.includes('OrbSvgCompanion')) {
  violations.push('OrbCompanion must render OrbSvgCompanion');
}

if (orbSvg.includes('showFace') || orbSvg.includes('browLeft')) {
  violations.push('OrbSvgCompanion must stay abstract (no face/brows)');
}

if (!orbSvg.includes('energyForState') || !orbSvg.includes('spin')) {
  violations.push('OrbSvgCompanion must implement abstract energy spin/pulse');
}

if (!orbPresence.includes('speechKey')) {
  violations.push('OrbPresence must accept explicit speechKey for coach bubbles');
}

if (orbPresence.includes('voiceKey') || orbPresence.includes('speakOrbCoachLine')) {
  violations.push('OrbPresence must not use voiceover / voiceKey');
}

if (!lesson.includes('resolveLessonSpeechCopyKey') || !lesson.includes('OrbPresence')) {
  violations.push('Lesson screen must drive OrbPresence speech from lesson moments');
}

if (!doc.includes('Liftoff') && !doc.includes('Jimbo')) {
  violations.push('ORB_LANGUAGE.md must document Liftoff-style coach onboarding');
}

if (!doc.toLowerCase().includes('abstrakt') && !doc.toLowerCase().includes('abstract')) {
  violations.push('ORB_LANGUAGE.md must document abstract (non-human) orb');
}

const requiredKeys = [
  'orb.speech.readingStart.a',
  'orb.speech.reading.a',
  'orb.speech.practicing.a',
  'orb.speech.correct.a',
  'orb.speech.wrong.a',
  'orb.speech.focus.correctTip.a',
  'orb.speech.focus.wrongTip.a',
];

for (const key of requiredKeys) {
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
