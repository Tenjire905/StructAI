/**
 * P3.2 rework — value/pricing paywall screen (no IAP yet).
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const violations = [];

const pricing = readFileSync(join(root, 'lib/proPricing.ts'), 'utf8');
const paywall = readFileSync(join(root, 'app/paywall.tsx'), 'utf8');
const view = readFileSync(join(root, 'components/features/ProPaywallView.tsx'), 'utf8');
const strip = readFileSync(join(root, 'components/features/ProPlanStrip.tsx'), 'utf8');
const cert = readFileSync(join(root, 'components/features/CertificateShareAction.tsx'), 'utf8');
const lab = readFileSync(join(root, 'app/(tabs)/prompt-lab.tsx'), 'utf8');
const layout = readFileSync(join(root, 'app/_layout.tsx'), 'utf8');
const en = readFileSync(join(root, 'theme/copy/en.ts'), 'utf8');

if (!pricing.includes("priceLabel: '€9.99'") || !pricing.includes("priceLabel: '€59.99'")) {
  violations.push('proPricing must define monthly €9.99 and yearly €59.99');
}
if (!paywall.includes('ProPaywallView')) {
  violations.push('paywall route must render ProPaywallView');
}
if (!layout.includes('paywall')) {
  violations.push('root layout must register paywall screen');
}
if (!view.includes('pro.paywall.headline') || !view.includes('PRO_PRICE_OFFERS')) {
  violations.push('ProPaywallView must show value copy and price offers');
}
if (!strip.includes("router.push('/paywall')")) {
  violations.push('ProPlanStrip must open paywall');
}
if (!cert.includes("router.push('/paywall')")) {
  violations.push('Certificate export gate must open paywall');
}
if (!lab.includes("router.push('/paywall')")) {
  violations.push('Prompt Lab Pro gate must open paywall');
}
if (!en.includes("'pro.paywall.billingFootnote'")) {
  violations.push('EN copy must include billing footnote');
}

assert.equal(violations.length, 0, violations.join('\n'));
console.log('verify-pro-paywall: ok');
