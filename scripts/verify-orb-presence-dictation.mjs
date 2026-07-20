/**
 * Orb presence + Prompt Lab dictation contract.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const orb = readFileSync(join(root, 'components/features/OrbCompanion.tsx'), 'utf8');
const welcome = readFileSync(join(root, 'app/onboarding/index.tsx'), 'utf8');
const completion = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');
const retry = readFileSync(
  join(root, 'components/features/lesson-steps/RetryPromptView.tsx'),
  'utf8',
);
const dictation = readFileSync(join(root, 'hooks/usePromptDictation.ts'), 'utf8');
const input = readFileSync(join(root, 'components/features/PromptLabTextInput.tsx'), 'utf8');
const appJson = readFileSync(join(root, 'app.json'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');
const pkg = readFileSync(join(root, 'package.json'), 'utf8');

if (!orb.includes('GazeDirection') || !orb.includes('OrbMouth') || !orb.includes("'right'")) {
  violations.push('OrbCompanion must cycle idle gaze and draw a mouth');
}
if (!welcome.includes('OrbPresence') || !welcome.includes('orb.speech.onboarding.welcome')) {
  violations.push('Welcome onboarding must lead with animated OrbPresence');
}
if (!completion.includes("'celebrating'") || !completion.includes('orb.speech.lessonComplete')) {
  violations.push('Lesson completion must force celebrating/happy orb mimik');
}
if (!retry.includes("'worry'") || !retry.includes('orb.speech.lessonRetry')) {
  violations.push('Retry prompt must show worry orb mimik with speech');
}
if (!dictation.includes('expo-speech-recognition') || !dictation.includes('requestPermissionsAsync')) {
  violations.push('usePromptDictation must use expo-speech-recognition with permissions');
}
if (!input.includes('dictation') || !input.includes('Mic')) {
  violations.push('PromptLabTextInput must expose mic dictation control');
}
if (!appJson.includes('expo-speech-recognition')) {
  violations.push('app.json must register expo-speech-recognition plugin');
}
if (!pkg.includes('expo-speech-recognition')) {
  violations.push('package.json must depend on expo-speech-recognition');
}
if (!en.includes("'promptLab.dictationListening'") || !en.includes("'orb.speech.onboarding.welcome'")) {
  violations.push('EN copy must define dictation + onboarding orb lines');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-orb-presence-dictation: ok');
