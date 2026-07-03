/**
 * Verification harness for lesson completion threshold + reward gating.
 * Keep logic in sync with lib/lessonRewards.ts and app/lektion/[id].tsx finishLesson().
 */

const GRADED_ANSWER_KINDS = ['choice', 'fill_blank', 'true_false', 'reorder'];
const LESSON_PASS_THRESHOLD = 0.6;
const BASE_REWARD = 18;

function filterGradedResults(results) {
  return results.filter((result) => GRADED_ANSWER_KINDS.includes(result.kind));
}

function computeLessonPassRatio(results) {
  const graded = filterGradedResults(results);

  if (graded.length === 0) {
    return { passRatio: 1, correctCount: 0, gradedCount: 0 };
  }

  const correctCount = graded.filter((result) => result.correct).length;

  return {
    passRatio: correctCount / graded.length,
    correctCount,
    gradedCount: graded.length,
  };
}

function hasPassedLessonThreshold(results) {
  const { passRatio } = computeLessonPassRatio(results);
  return passRatio > LESSON_PASS_THRESHOLD;
}

function computeLessonOrbReward(baseReward, results) {
  const graded = filterGradedResults(results);

  if (graded.length === 0) {
    return baseReward;
  }

  const scoreSum = graded.reduce((sum, result) => {
    if (!result.correct) {
      return sum + 0.25;
    }

    if (result.attempts === 1) {
      return sum + 1;
    }

    if (result.attempts === 2) {
      return sum + 0.7;
    }

    return sum + 0.45;
  }, 0);

  const ratio = scoreSum / graded.length;
  const minRatio = 0.4;
  const scaled = minRatio + (1 - minRatio) * ratio;

  return Math.max(1, Math.round(baseReward * scaled));
}

function evaluateCompletion(results, baseReward = BASE_REWARD) {
  const { passRatio, correctCount, gradedCount } = computeLessonPassRatio(results);
  const passed = hasPassedLessonThreshold(results);

  return {
    passRatio: Number(passRatio.toFixed(4)),
    correctCount,
    gradedCount,
    passed,
    shouldCompleteLesson: passed,
    orbsAwarded: passed ? computeLessonOrbReward(baseReward, results) : 0,
  };
}

function result(kind, correct, attempts = 1) {
  return { stepIndex: 0, kind, correct, attempts };
}

const thresholdCases = [
  {
    label: '0/3 correct',
    results: [
      result('choice', false),
      result('true_false', false),
      result('fill_blank', false),
    ],
    expectedPassed: false,
    expectedOrbs: 0,
  },
  {
    label: '1/3 correct (33.3%)',
    results: [
      result('choice', true),
      result('true_false', false),
      result('fill_blank', false),
    ],
    expectedPassed: false,
    expectedOrbs: 0,
  },
  {
    label: '2/3 correct (66.7%)',
    results: [
      result('choice', true),
      result('true_false', true),
      result('fill_blank', false),
    ],
    expectedPassed: true,
    expectedOrbs: computeLessonOrbReward(BASE_REWARD, [
      result('choice', true),
      result('true_false', true),
      result('fill_blank', false),
    ]),
  },
  {
    label: '3/3 correct',
    results: [
      result('choice', true),
      result('true_false', true),
      result('reorder', true),
    ],
    expectedPassed: true,
    expectedOrbs: BASE_REWARD,
  },
  {
    label: '3/5 correct exactly 60% boundary',
    results: [
      result('choice', true),
      result('true_false', true),
      result('fill_blank', true),
      result('reorder', false),
      result('choice', false),
    ],
    expectedPassed: false,
    expectedOrbs: 0,
  },
  {
    label: '4/5 correct (80%)',
    results: [
      result('choice', true),
      result('true_false', true),
      result('fill_blank', true),
      result('reorder', true),
      result('choice', false),
    ],
    expectedPassed: true,
    expectedOrbs: computeLessonOrbReward(BASE_REWARD, [
      result('choice', true),
      result('true_false', true),
      result('fill_blank', true),
      result('reorder', true),
      result('choice', false),
    ]),
  },
];

const attemptSensitivityCase = {
  label: '2/3 correct with extra attempts still passes threshold',
  results: [
    result('choice', true, 3),
    result('true_false', true, 2),
    result('fill_blank', false, 1),
  ],
  expectedPassed: true,
};

const thresholdResults = thresholdCases.map((testCase) => {
  const actual = evaluateCompletion(testCase.results);
  const violations = [];

  if (actual.passed !== testCase.expectedPassed) {
    violations.push('passed-mismatch');
  }

  if (actual.orbsAwarded !== testCase.expectedOrbs) {
    violations.push('orbs-mismatch');
  }

  if (actual.shouldCompleteLesson !== testCase.expectedPassed) {
    violations.push('completion-gating-mismatch');
  }

  return {
    label: testCase.label,
    actual,
    expected: {
      passed: testCase.expectedPassed,
      orbsAwarded: testCase.expectedOrbs,
    },
    violations,
  };
});

const attemptCase = evaluateCompletion(attemptSensitivityCase.results);
const attemptViolations =
  attemptCase.passed !== attemptSensitivityCase.expectedPassed ? ['passed-mismatch'] : [];

const totalViolations =
  thresholdResults.reduce((sum, entry) => sum + entry.violations.length, 0) +
  attemptViolations.length;

console.log(
  JSON.stringify(
    {
      constants: {
        LESSON_PASS_THRESHOLD,
        rule: 'passRatio > 0.6 required; passRatio uses result.correct only',
      },
      thresholdCases: thresholdResults,
      attemptSensitivityCase: {
        label: attemptSensitivityCase.label,
        actual: attemptCase,
        violations: attemptViolations,
      },
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);
