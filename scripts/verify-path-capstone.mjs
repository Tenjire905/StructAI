/**
 * Verification harness for path capstone detection.
 * Keep logic in sync with lib/pathCapstone.ts.
 */

function isPathFinalCapstone(chapters, lessonId) {
  if (!chapters || chapters.length === 0) {
    return false;
  }

  return chapters[chapters.length - 1].id === lessonId;
}

function isPathMidCapstone(chapters, lessonId) {
  if (isPathFinalCapstone(chapters, lessonId)) {
    return false;
  }

  const chapter = chapters.find((entry) => entry.id === lessonId);

  return chapter?.title === 'Abschlussprojekt';
}

const PB_CHAPTERS = [
  { id: 'pb-8', title: 'Abschlussprojekt' },
  { id: 'pb-45', title: 'Großes Abschlussprojekt: Dein Prompt-Baukasten' },
];

const cases = [
  {
    label: 'pb-8 is mid capstone',
    lessonId: 'pb-8',
    expect: { final: false, mid: true },
  },
  {
    label: 'pb-45 is final capstone',
    lessonId: 'pb-45',
    expect: { final: true, mid: false },
  },
];

const results = cases.map((testCase) => {
  const actual = {
    final: isPathFinalCapstone(PB_CHAPTERS, testCase.lessonId),
    mid: isPathMidCapstone(PB_CHAPTERS, testCase.lessonId),
  };
  const violations = [];

  if (actual.final !== testCase.expect.final) {
    violations.push('final-mismatch');
  }

  if (actual.mid !== testCase.expect.mid) {
    violations.push('mid-mismatch');
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
      rule: 'final capstone = last chapter; mid capstone = title Abschlussprojekt but not last',
      cases: results,
      pass: totalViolations === 0,
      totalViolations,
    },
    null,
    2,
  ),
);
