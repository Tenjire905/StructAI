/**
 * P3.2 — Free vs Pro framing (no IAP). Lessons stay free; soft-gate Lab live + cert export.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const entitlements = readFileSync(join(root, 'lib/entitlements.ts'), 'utf8');
const storage = readFileSync(join(root, 'lib/appStorage.ts'), 'utf8');
const lab = readFileSync(join(root, 'app/(tabs)/prompt-lab.tsx'), 'utf8');
const cert = readFileSync(join(root, 'components/features/CertificateShareAction.tsx'), 'utf8');
const profile = readFileSync(join(root, 'app/(tabs)/profil.tsx'), 'utf8');
const strip = readFileSync(join(root, 'components/features/ProPlanStrip.tsx'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');
const lesson = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');

if (!entitlements.includes('canUseProFeature')) {
  violations.push('entitlements must export canUseProFeature');
}
if (!storage.includes('PRO_PREVIEW_UNLOCKED_KEY') && !storage.includes('pro-preview-unlocked')) {
  violations.push('appStorage must persist pro preview unlock');
}
if (!lab.includes("canUseProFeature('liveLabGrades')")) {
  violations.push('Prompt Lab must soft-gate live AI grades');
}
if (!lab.includes('scorePrompt(')) {
  violations.push('Prompt Lab must keep local Free coach path');
}
if (!cert.includes("canUseProFeature('certificateExport')")) {
  violations.push('Certificate share must soft-gate export');
}
if (!profile.includes('ProPlanStrip')) {
  violations.push('Profile must show ProPlanStrip');
}
if (!strip.includes('unlockProPreview')) {
  violations.push('ProPlanStrip must offer preview unlock');
}
if (!en.includes("'pro.planBodyFree'")) {
  violations.push('EN copy must define Free vs Pro framing');
}
if (lesson.includes('canUseProFeature') || lesson.includes('isProUnlocked')) {
  violations.push('Lessons must never check Pro entitlements');
}
if (en.includes('unlock certificates') || en.includes('Sync and certificates')) {
  violations.push('Guest copy must not claim sign-in unlocks certificates');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-entitlements-framing: ok');
