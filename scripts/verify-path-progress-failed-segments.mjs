/**
 * Verification harness for path progress bar ratios.
 * Keep logic in sync with lib/pathProgress.ts.
 */

function computePathProgressBarModel(totalChapters, record) {
  if (totalChapters === 0) {
    return { completedRatio: 0, failedRatio: 0 };
  }

  const completedSet = new Set(record?.completedLessonIds ?? []);
  const completedCount = record?.completedLessonIds?.length ?? 0;
  const failedCount = (record?.failedLessonIds ?? []).filter(
    (lessonId) => !completedSet.has(lessonId),
  ).length;

  return {
    completedRatio: Math.min(1, completedCount / totalChapters),
    failedRatio: Math.min(1, failedCount / totalChapters),
  };
}

const cases = [
  {
    label: 'no failed lessons',
    record: {
      completedLessonIds: ['pb-1', 'pb-2'],
      failedLessonIds: [],
    },
    expect: {
      completedRatio: 0.25,
      failedRatio: 0,
    },
  },
  {
    label: 'failed lesson does not increase completed ratio',
    record: {
      completedLessonIds: ['pb-1'],
      failedLessonIds: ['pb-2'],
    },
    expect: {
      completedRatio: 0.125,
      failedRatio: 0.125,
    },
  },
  {
    label: 'multiple failed lessons aggregate',
    record: {
      completedLessonIds: ['pb-1', 'pb-2'],
      failedLessonIds: ['pb-3', 'pb-4'],
    },
    expect: {
      completedRatio: 0.25,
      failedRatio: 0.25,
    },
  },
  {
    label: 'passed lesson removes failed ratio contribution',
    record: {
      completedLessonIds: ['pb-1', 'pb-2', 'pb-3'],
      failedLessonIds: ['pb-3'],
    },
    expect: {
      completedRatio: 0.375,
      failedRatio: 0,
    },
  },
];

const results = cases.map((testCase) => {
  const actual = computePathProgressBarModel(8, testCase.record);
  const violations = [];

  if (actual.completedRatio !== testCase.expect.completedRatio) {
    violations.push('completedRatio-mismatch');
  }

  if (actual.failedRatio !== testCase.expect.failedRatio) {
    violations.push('failedRatio-mismatch');
  }

  return {
    label: testCase.label,
    actual,
    expected: testCase.expect,
    violations,
  };
});

const totalViolations = results.reduce((sum, entry) => sum + entry.violations.length, 0);

console.log(
  JSON.stringify(
    {
      rule: 'completedRatio counts passes; failedRatio counts skipped lessons not yet passed',
      cases: results,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);
