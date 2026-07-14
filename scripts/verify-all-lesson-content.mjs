/**
 * Runs lesson-content locale verification for all learning paths.
 * Exit 0 only when every path passes with zero violations.
 */

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const verifyScript = join(root, 'scripts', 'verify-lesson-content-locales.mjs');

const paths = [
  { id: 'pb', label: 'prompt-basics', range: 'pb-1..pb-45' },
  { id: 'sl', label: 'structured-language', range: 'sl-1..sl-35' },
  { id: 'il', label: 'iterative-loop', range: 'il-1..il-35' },
  { id: 'cm', label: 'context-management', range: 'cm-1..cm-35' },
  { id: 'es', label: 'eval-scoring', range: 'es-1..es-35' },
  { id: 'pm', label: 'prompt-mastery', range: 'pm-1..pm-3' },
];

const results = [];

for (const path of paths) {
  const child = spawnSync(process.execPath, [verifyScript, '--range', path.range], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });

  let parsed = null;
  if (child.stdout) {
    try {
      parsed = JSON.parse(child.stdout);
    } catch {
      parsed = null;
    }
  }

  const pass = child.status === 0 && parsed?.pass === true;
  results.push({
    path: path.id,
    label: path.label,
    range: path.range,
    pass,
    exitCode: child.status ?? 1,
    totalViolations: parsed?.totalViolations ?? null,
    lessonCount: parsed?.catalog?.lessonCount ?? null,
    referencedKeyCount: parsed?.catalog?.referencedKeyCount ?? null,
    stderr: child.stderr?.trim() || null,
    parseError: parsed === null && child.stdout ? 'Failed to parse verifier output' : null,
  });
}

const passedCount = results.filter((result) => result.pass).length;
const summary = {
  pathsChecked: paths.length,
  pathsPassed: passedCount,
  pathsFailed: paths.length - passedCount,
  allPass: passedCount === paths.length,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(summary.allPass ? 0 : 1);
