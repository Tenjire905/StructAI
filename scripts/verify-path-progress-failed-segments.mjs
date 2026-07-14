/**
 * Verification harness for path progress bar ratios and failed segments.
 * Keep logic in sync with lib/pathProgress.ts.
 */

function mergeAdjacentPathProgressSegments(segments) {
  if (segments.length === 0) {
    return [];
  }

  const sorted = [...segments].sort((a, b) => a.start - b.start);
  const merged = [{ ...sorted[0] }];

  for (let index = 1; index < sorted.length; index += 1) {
    const next = sorted[index];
    const current = merged[merged.length - 1];
    const currentEnd = current.start + current.width;

    if (next.start <= currentEnd + 0.000_001) {
      const nextEnd = next.start + next.width;
      current.width = Math.max(currentEnd, nextEnd) - current.start;
      continue;
    }

    merged.push({ ...next });
  }

  return merged;
}

function computePathProgressBarModel(totalChapters, chapters, record) {
  if (totalChapters === 0) {
    return { completedRatio: 0, failedRatio: 0, failedSegments: [] };
  }

  const slotWidth = 1 / totalChapters;
  const failedIds = new Set(record?.failedLessonIds ?? []);
  const completedSet = new Set(record?.completedLessonIds ?? []);
  const completedCount = record?.completedLessonIds?.length ?? 0;
  const failedCount = (record?.failedLessonIds ?? []).filter(
    (lessonId) => !completedSet.has(lessonId),
  ).length;

  const failedSegments = mergeAdjacentPathProgressSegments(
    chapters
      .map((chapterId, index) => ({ chapterId, index }))
      .filter(({ chapterId }) => failedIds.has(chapterId) && !completedSet.has(chapterId))
      .map(({ index }) => ({
        start: index * slotWidth,
        width: slotWidth,
      })),
  );

  return {
    completedRatio: Math.min(1, completedCount / totalChapters),
    failedRatio: Math.min(1, failedCount / totalChapters),
    failedSegments,
  };
}

const CHAPTERS = ['pb-1', 'pb-2', 'pb-3', 'pb-4', 'pb-5', 'pb-6', 'pb-7', 'pb-8'];

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
      failedSegments: [],
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
      failedSegments: [{ start: 0.125, width: 0.125 }],
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
      failedSegments: [{ start: 0.25, width: 0.25 }],
    },
  },
  {
    label: 'passed lesson removes failed segment',
    record: {
      completedLessonIds: ['pb-1', 'pb-2', 'pb-3'],
      failedLessonIds: ['pb-3'],
    },
    expect: {
      completedRatio: 0.375,
      failedRatio: 0,
      failedSegments: [],
    },
  },
  {
    label: 'non-adjacent failed lessons stay separate',
    record: {
      completedLessonIds: ['pb-1', 'pb-2', 'pb-5'],
      failedLessonIds: ['pb-3', 'pb-4'],
    },
    expect: {
      completedRatio: 0.375,
      failedRatio: 0.25,
      failedSegments: [{ start: 0.25, width: 0.25 }],
    },
  },
];

function segmentsEqual(actual, expected) {
  if (actual.length !== expected.length) {
    return false;
  }

  return actual.every((segment, index) => {
    const target = expected[index];
    return segment.start === target.start && segment.width === target.width;
  });
}

const results = cases.map((testCase) => {
  const actual = computePathProgressBarModel(8, CHAPTERS, testCase.record);
  const violations = [];

  if (actual.completedRatio !== testCase.expect.completedRatio) {
    violations.push('completedRatio-mismatch');
  }

  if (actual.failedRatio !== testCase.expect.failedRatio) {
    violations.push('failedRatio-mismatch');
  }

  if (!segmentsEqual(actual.failedSegments, testCase.expect.failedSegments)) {
    violations.push('failedSegments-mismatch');
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
      rule:
        'completedRatio counts passes; failedSegments mark skipped chapters at path positions',
      cases: results,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);
