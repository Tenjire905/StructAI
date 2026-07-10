/**
 * Static checks: Block J step state isolation in app/lektion/[id].tsx
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const source = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');

const violations = [];

function requirePattern(label, pattern) {
  if (!pattern.test(source)) {
    violations.push(label);
  }
}

requirePattern(
  'resetStepInput clears matchingPairs',
  /setMatchingPairs\(\{\}\)/,
);
requirePattern(
  'resetStepInput clears categorizeAssignments',
  /setCategorizeAssignments\(\{\}\)/,
);
requirePattern(
  'resetStepInput clears errorFinding state',
  /setErrorFindingSelectedIndex\(null\)/,
);
requirePattern(
  'resetStepInput clears isChecked',
  /setIsChecked\(false\)/,
);
requirePattern(
  'resetLessonSession clears stepAttempts',
  /setStepAttempts\(\{\}\)/,
);
requirePattern(
  'stepAttempts keyed by stepIndex on check',
  /\[stepIndex\]: \(previous\[stepIndex\] \?\? 0\) \+ 1/,
);
requirePattern(
  'error_finding attempts keyed by stepIndex',
  /handleSelectErrorFindingSegment[\s\S]*?\[stepIndex\]: \(previous\[stepIndex\] \?\? 0\) \+ 1/,
);
requirePattern(
  'hasSelection uses matchingPairs only for matching type',
  /case 'matching':[\s\S]*?matchingPairs/,
);
requirePattern(
  'hasSelection uses categorizeAssignments only for categorize type',
  /case 'categorize':[\s\S]*?categorizeAssignments/,
);
requirePattern(
  'StepTypeBadge maps all graded types including new Block J types',
  /matching: 'lesson\.typeMatching'/,
);
if (readFileSync(join(root, 'data/mockLessons.catalog.ts'), 'utf8').includes('dev-j-new-types')) {
  violations.push('dev-j-new-types must not appear in mockLessons.catalog.ts');
}

const devLessonSource = readFileSync(join(root, 'data/devBlockJNewTypesLesson.ts'), 'utf8');
const stepTypes = [...devLessonSource.matchAll(/type: '([a-z_]+)'/g)].map((match) => match[1]);
const expectedSequence = ['matching', 'error_finding', 'categorize'];

if (JSON.stringify(stepTypes) !== JSON.stringify(expectedSequence)) {
  violations.push(`dev-j-new-types step sequence expected ${expectedSequence.join('→')}, got ${stepTypes.join('→')}`);
}

console.log(
  JSON.stringify(
    {
      scope: 'block-j-new-types step state isolation (static)',
      devLessonId: 'dev-j-new-types',
      devRoute: '/dev-j-new-types-lesson',
      stepSequence: stepTypes,
      notInProductionCatalog: !readFileSync(join(root, 'data/mockLessons.catalog.ts'), 'utf8').includes('dev-j-new-types'),
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
