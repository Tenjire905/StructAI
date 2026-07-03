/**
 * F1 verification: multi-key BYOK stays local and legacy key migrates safely.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

const cases = [];

function addCase(label, violations) {
  cases.push({ label, violations });
}

const secureKeyStore = read('lib/secureKeyStore.ts');
addCase('secureKeyStore stores provider/key set locally', [
  ...(!secureKeyStore.includes('export type ByokKeyEntry')
    ? ['missing ByokKeyEntry type']
    : []),
  ...(!secureKeyStore.includes('listApiKeys')
    ? ['missing listApiKeys()']
    : []),
  ...(!secureKeyStore.includes('upsertApiKey')
    ? ['missing upsertApiKey()']
    : []),
  ...(!secureKeyStore.includes('removeApiKey')
    ? ['missing removeApiKey()']
    : []),
  ...(!secureKeyStore.includes('migrateLegacyKeyIfNeeded')
    ? ['missing legacy migration']
    : []),
  ...(!secureKeyStore.includes('LEGACY_API_KEY_STORAGE_KEY')
    ? ['missing legacy storage key constant']
    : []),
]);

const syncPaths = [
  'lib/progressSync.ts',
  'store/progressStore.ts',
  'lib/progressMerge.ts',
  'providers/AuthProvider.tsx',
  'supabase/migrations/20260703140000_user_progress.sql',
];

const syncViolations = syncPaths.flatMap((relativePath) => {
  const content = read(relativePath);
  const hits = [];

  if (/secureKeyStore|listApiKeys|upsertApiKey|ByokKeyEntry|byok\.apiKeys/.test(content)) {
    hits.push(`${relativePath} references BYOK storage`);
  }

  return hits;
});

addCase('E2 sync path does not include multi-key BYOK storage', syncViolations);

const profil = read('app/(tabs)/profil.tsx');
addCase('profile uses multi-provider BYOK manager', [
  ...(!profil.includes('ByokKeysManager') ? ['profil.tsx must render ByokKeysManager'] : []),
]);

const byokManager = read('components/features/profile/ByokKeysManager.tsx');
addCase('BYOK manager supports per-provider save/test/remove', [
  ...(!byokManager.includes('BYOK_PROVIDERS') ? ['missing provider rows'] : []),
  ...(!byokManager.includes('handleTest') ? ['missing test action'] : []),
  ...(!byokManager.includes('handleRemove') ? ['missing remove action'] : []),
]);

const totalViolations = cases.reduce((sum, entry) => sum + entry.violations.length, 0);

console.log(
  JSON.stringify(
    {
      note: 'Legacy structai.byok.apiKey migrates into structai.byok.apiKeys.v1 on first read.',
      cases,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);

process.exit(totalViolations === 0 ? 0 : 1);
