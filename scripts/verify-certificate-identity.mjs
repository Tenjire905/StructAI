/**
 * Static checks for identity-forward certificates (P2.1).
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

const violations = [];
const identity = read('lib/certificateIdentity.ts');
const viewModel = read('lib/buildCertificateViewModel.ts');
const certificateView = read('components/features/CertificateView.tsx');
const share = read('components/features/CertificateShareAction.tsx');
const copyEn = read('theme/copy/en.ts');

if (!identity.includes('certificateSkillCopyKey')) {
  violations.push('certificateIdentity must map paths to skill copy keys');
}

if (!identity.includes('buildCertificateCredentialId')) {
  violations.push('certificateIdentity must build a credential id');
}

if (!viewModel.includes('skillStatement') || !viewModel.includes('credentialId')) {
  violations.push('buildCertificateViewModel must expose skill + credential');
}

if (!certificateView.includes('skillStatement') || !certificateView.includes('credentialId')) {
  violations.push('CertificateView must render skill claim and credential');
}

if (!share.includes('buildCertificateViewModel')) {
  violations.push('CertificateShareAction must use identity view model');
}

for (const key of [
  'certificate.skillLabel',
  'certificate.skill.prompt_basics',
  'certificate.skill.structure_lab',
  'certificate.evidence',
  'certificate.credentialLabel',
  'pathCompletion.identityLine',
]) {
  if (!copyEn.includes(`'${key}'`)) {
    violations.push(`en copy missing ${key}`);
  }
}

console.log(
  JSON.stringify(
    {
      scope: 'certificate-identity-p2.1',
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
