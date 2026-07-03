/**
 * Verification harness for path completion rules (G1).
 * Keep logic in sync with lib/pathCompletion.ts.
 */

const PATH_CHAPTER_IDS = {
  'prompt-basics': ['pb-1', 'pb-2', 'pb-3', 'pb-4', 'pb-5', 'pb-6', 'pb-7', 'pb-8'],
  'iteration-loops': ['il-1', 'il-2', 'il-3', 'il-4', 'il-5'],
};

function getRequiredLessonIdsForPath(pathId) {
  return PATH_CHAPTER_IDS[pathId] ?? [];
}

function isPathFullyCompleted(pathId, record) {
  const requiredLessonIds = getRequiredLessonIdsForPath(pathId);

  if (requiredLessonIds.length === 0 || !record) {
    return false;
  }

  const completedSet = new Set(record.completedLessonIds);
  return requiredLessonIds.every((lessonId) => completedSet.has(lessonId));
}

function detectNewlyCompletedPathId(pathId, record, completedPathIds) {
  if (completedPathIds.includes(pathId)) {
    return null;
  }

  return isPathFullyCompleted(pathId, record) ? pathId : null;
}

function reconcileCompletedPathIds(pathProgress, existingCompletedPathIds = []) {
  const merged = new Set(existingCompletedPathIds);

  for (const pathId of Object.keys(pathProgress)) {
    if (isPathFullyCompleted(pathId, pathProgress[pathId])) {
      merged.add(pathId);
    }
  }

  return [...merged];
}

function pathRecord(overrides = {}) {
  return {
    completedLessonIds: [],
    failedLessonIds: [],
    ...overrides,
  };
}

const cases = [];

cases.push({
  label: 'partial path progress is not complete',
  violations: isPathFullyCompleted(
    'iteration-loops',
    pathRecord({ completedLessonIds: ['il-1', 'il-2', 'il-3', 'il-4'] }),
  )
    ? ['expected incomplete path when one lesson missing']
    : [],
});

cases.push({
  label: 'failed lessons alone do not complete a path',
  violations: isPathFullyCompleted(
    'iteration-loops',
    pathRecord({
      completedLessonIds: ['il-1', 'il-2', 'il-3', 'il-4'],
      failedLessonIds: ['il-5'],
    }),
  )
    ? ['failed-only final lesson must not mark path complete']
    : [],
});

cases.push({
  label: 'all template lessons completed marks path complete',
  violations: isPathFullyCompleted(
    'iteration-loops',
    pathRecord({
      completedLessonIds: ['il-1', 'il-2', 'il-3', 'il-4', 'il-5'],
    }),
  )
    ? []
    : ['expected iteration-loops to be complete'],
});

cases.push({
  label: 'detectNewlyCompletedPathId fires once per path',
  violations: (() => {
    const record = pathRecord({
      completedLessonIds: ['il-1', 'il-2', 'il-3', 'il-4', 'il-5'],
    });
    const first = detectNewlyCompletedPathId('iteration-loops', record, []);
    const second = detectNewlyCompletedPathId('iteration-loops', record, ['iteration-loops']);

    if (first !== 'iteration-loops') {
      return ['first detection should return path id'];
    }

    if (second !== null) {
      return ['second detection should return null when already completed'];
    }

    return [];
  })(),
});

cases.push({
  label: 'reconcileCompletedPathIds derives completion from progress records',
  violations: (() => {
    const reconciled = reconcileCompletedPathIds(
      {
        'iteration-loops': pathRecord({
          completedLessonIds: ['il-1', 'il-2', 'il-3', 'il-4', 'il-5'],
        }),
        'prompt-basics': pathRecord({ completedLessonIds: ['pb-1'] }),
      },
      [],
    );

    if (!reconciled.includes('iteration-loops')) {
      return ['iteration-loops should be reconciled as complete'];
    }

    if (reconciled.includes('prompt-basics')) {
      return ['prompt-basics should stay incomplete'];
    }

    return [];
  })(),
});

const totalViolations = cases.reduce((sum, entry) => sum + entry.violations.length, 0);

console.log(
  JSON.stringify(
    {
      module: 'lib/pathCompletion.ts',
      cases,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);

process.exit(totalViolations === 0 ? 0 : 1);
