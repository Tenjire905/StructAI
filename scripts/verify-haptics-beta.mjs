#!/usr/bin/env node
/**
 * Guards Haptics Map v1.3 (5× Heavy burst) + UI press wiring + no onboarding skip.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

const violations = [];

const haptics = read('lib/haptics.ts');
const hapticsDoc = read('HAPTICS.md');
const button = read('components/ui/Button.tsx');
const pressable = read('components/ui/PressableScale.tsx');
const tabBar = read('components/ui/FloatingTabBar.tsx');
const chrome = read('components/features/onboarding/OnboardingChrome.tsx');
const eas = read('eas.json');
const betaDoc = read('BETA_INSTALL.md');

if (!haptics.includes('HAPTIC_INTENSITY_MULTIPLIER = 5') || !haptics.includes('heavyBurst')) {
  violations.push('lib/haptics.ts must expose 5× heavyBurst intensity');
}
if (!haptics.includes('export function hapticUIPress')) {
  violations.push('lib/haptics.ts must export hapticUIPress');
}
if (!hapticsDoc.includes('v1.3') || !hapticsDoc.includes('×5')) {
  violations.push('HAPTICS.md must document v1.3 5× calibration');
}
if (!button.includes('hapticUIPress') || !pressable.includes('hapticUIPress') || !tabBar.includes('hapticUIPress')) {
  violations.push('Button, PressableScale, FloatingTabBar must call hapticUIPress');
}
if (chrome.includes('skipLabel') || chrome.includes('onSkip')) {
  violations.push('OnboardingChrome must not expose skip');
}
if (!eas.includes('"buildType": "apk"')) {
  violations.push('eas.json preview must build Android APK for sideload beta');
}
if (!betaDoc.includes('eas-cli build --profile preview') || !betaDoc.includes('ohne Expo-Go-Tunnel')) {
  violations.push('BETA_INSTALL.md must document standalone preview builds');
}

if (violations.length) {
  console.error('verify-haptics-beta failed:');
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

console.log('verify-haptics-beta: ok');
