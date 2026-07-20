/**
 * Rive Orb wiring: contract + facade + Metro .riv support.
 */

import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const contract = readFileSync(join(root, 'lib/orbRiveContract.ts'), 'utf8');
const facade = readFileSync(join(root, 'components/features/OrbCompanion.tsx'), 'utf8');
const riveComp = readFileSync(join(root, 'components/features/OrbRiveCompanion.tsx'), 'utf8');
const svg = readFileSync(join(root, 'components/features/OrbSvgCompanion.tsx'), 'utf8');
const source = readFileSync(join(root, 'assets/rive/source.ts'), 'utf8');
const metro = readFileSync(join(root, 'metro.config.js'), 'utf8');
const pkg = readFileSync(join(root, 'package.json'), 'utf8');
const spec = existsSync(join(root, 'assets/rive/ORB_RIVE_SPEC.md'));

if (!contract.includes('ORB_RIVE_STATE_MACHINE') || !contract.includes('moodValueForState')) {
  violations.push('orbRiveContract must define SM name + mood mapping');
}
if (!facade.includes('isRunningInExpoGo') || !facade.includes('OrbRiveCompanion')) {
  violations.push('OrbCompanion facade must lazy-load Rive and stay Expo Go safe');
}
if (!riveComp.includes('setNumberInputValue') || !riveComp.includes('ORB_RIVE_MOOD_INPUT')) {
  violations.push('OrbRiveCompanion must drive mood via Rive number input');
}
if (!svg.includes('export function OrbSvgCompanion')) {
  violations.push('OrbSvgCompanion fallback must remain available');
}
if (!source.includes('structAiOrbRiv') || !source.includes('isOrbRiveAssetConfigured')) {
  violations.push('assets/rive/source.ts must gate the .riv require');
}
if (!metro.includes("'riv'") && !metro.includes('"riv"')) {
  violations.push('metro.config.js must register .riv as an asset extension');
}
if (!pkg.includes('@rive-app/react-native') || !pkg.includes('react-native-nitro-modules')) {
  violations.push('package.json must depend on Rive + nitro-modules');
}
if (!spec) {
  violations.push('assets/rive/ORB_RIVE_SPEC.md missing');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-orb-rive: ok');
