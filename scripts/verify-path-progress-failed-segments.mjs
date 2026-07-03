/**
 * Verification harness for failed-lesson progress bar segments.
 * Keep logic in sync with lib/pathProgress.ts.
 */

const MOCK_CHAPTERS = [
  { id: 'pb-1' },
  { id: 'pb-2' },
  { id: 'pb-3' },
  { id: 'pb-4' },
  { id: 'pb-5' },
  { id: 'pb-6' },
  { id: 'pb-7' },
  { id: 'pb-8' },
];

function computePathProgressBarModel(totalChapters, record) {
  if (totalChapters === 0) {
    return { completedRatio: 0, failedSegments: [] };
  }

  const slotWidth = 1 / totalChapters;
  const failedIds = new Set(record?.failedLessonIds ?? []);
  const completedCount = record?.completedLessonIds?.length ?? 0;

  const failedSegments = MOCK_CHAPTERS.map((chapter, index) => ({ chapter, index }))
    .filter(({ chapter }) => failedIds.has(chapter.id))
    .map(({ index }) => ({
      start: Number((index * slotWidth).toFixed(4)),
      width: Number(slotWidth.toFixed(4)),
    }));

  return {
    completedRatio: Math.min(1, completedCount / totalChapters),
    failedSegments,
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
      failedCount: 0,
    },
  },
  {
    label: 'failed lesson at chapter 3 (pb-3)',
    record: {
      completedLessonIds: ['pb-1', 'pb-2'],
      failedLessonIds: ['pb-3'],
    },
    expect: {
      completedRatio: 0.25,
      failedCount: 1,
      failedStart: 0.25,
      failedWidth: 0.125,
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
      failedCount: 1,
      failedStart: 0.125,
    },
  },
  {
    label: 'completed lesson clears failed slot overlap expectation',
    record: {
      completedLessonIds: ['pb-1', 'pb-2', 'pb-3'],
      failedLessonIds: ['pb-3'],
    },
    expect: {
      completedRatio: 0.375,
      failedCount: 1,
      failedStart: 0.25,
    },
  },
];

const results = cases.map((testCase) => {
  const actual = computePathProgressBarModel(8, testCase.record);
  const violations = [];

  if (actual.completedRatio !== testCase.expect.completedRatio) {
    violations.push('completedRatio-mismatch');
  }

  if (actual.failedSegments.length !== testCase.expect.failedCount) {
    violations.push('failedCount-mismatch');
  }

  if (testCase.expect.failedStart !== undefined) {
    const segment = actual.failedSegments[0];
    if (!segment || segment.start !== testCase.expect.failedStart) {
      violations.push('failedStart-mismatch');
    }
  }

  if (testCase.expect.failedWidth !== undefined) {
    const segment = actual.failedSegments[0];
    if (!segment || segment.width !== testCase.expect.failedWidth) {
      violations.push('failedWidth-mismatch');
    }
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
      rule: 'failed lessons render warning segments at chapter index; they do not add to completedRatio',
      cases: results,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);
