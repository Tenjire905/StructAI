/**
 * Static + runtime smoke checks for Block J mixed lesson dispatch.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const lektionSource = readFileSync(join(root, 'app/lektion/[id].tsx'), 'utf8');

const STEP_TYPES = [
  'info',
  'choice',
  'fill_blank',
  'true_false',
  'reorder',
  'matching',
  'error_finding',
  'categorize',
];

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

const renderChecks = STEP_TYPES.map((type) => ({
  type,
  rendered: lektionSource.includes(`step.type === '${type}'`),
}));

const gradedTypes = STEP_TYPES.filter((type) => type !== 'info');
const switchBlocks = ['isAnswerCorrect', 'hasSelection'];

const switchChecks = switchBlocks.map((label) => {
  const blockMatch = lektionSource.match(
    new RegExp(`const ${label}[\\s\\S]*?switch \\(gradedStep\\.type\\) \\{([\\s\\S]*?)\\n    \\}`),
  );
  const block = blockMatch?.[1] ?? '';

  return {
    label,
    coversAllGraded: gradedTypes.every((type) => block.includes(`case '${type}':`)),
  };
});

const viewImports = [
  'ChoiceStepView',
  'FillBlankStepView',
  'TrueFalseStepView',
  'ReorderStepView',
  'MatchingStepView',
  'ErrorFindingStepView',
  'CategorizeStepView',
].map((name) => ({
  name,
  imported: lektionSource.includes(name),
}));

const violations = [
  ...renderChecks.filter((entry) => !entry.rendered).map((entry) => `missing render: ${entry.type}`),
  ...switchChecks.filter((entry) => !entry.coversAllGraded).map((entry) => `incomplete switch: ${entry.label}`),
  ...viewImports.filter((entry) => !entry.imported).map((entry) => `missing import: ${entry.name}`),
];

const mixedLessonSource = readFileSync(join(root, 'data/devBlockJMixedLesson.ts'), 'utf8');
const mixedStepTypes = [...mixedLessonSource.matchAll(/type: '([a-z_]+)'/g)].map((match) => match[1]);
const mixedHasAllEight = STEP_TYPES.every((type) => mixedStepTypes.includes(type));
const mixedHasAllGradedNew = ['matching', 'error_finding', 'categorize'].every((type) =>
  mixedStepTypes.includes(type),
);

console.log(
  JSON.stringify(
    {
      branch: 'feature/schritt-j4-categorize-view',
      staticDispatch: {
        renderChecks,
        switchChecks,
        viewImports,
        violations,
      },
      devMixedLesson: {
        id: 'dev-j-mixed',
        stepCount: mixedStepTypes.length,
        stepTypes: mixedStepTypes,
        includesAllEightTypes: mixedHasAllEight,
        includesNewBlockJTypes: mixedHasAllGradedNew,
      },
      pass: violations.length === 0 && mixedHasAllEight && mixedHasAllGradedNew,
    },
    null,
    2,
  ),
);

if (violations.length > 0) {
  process.exitCode = 1;
}
