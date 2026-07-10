/**
 * Verification harness for lessonSession shuffle/remap logic.
 * Keep shuffle helpers in sync with lib/lessonSession.ts.
 */

function mulberry32(seed) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed(items, seed) {
  const random = mulberry32(seed);
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function shuffleChoiceLike(step, seed) {
  const indexed = step.options.map((option, index) => ({ option, index }));
  const shuffled = shuffleWithSeed(indexed, seed);
  const correctIndex = shuffled.findIndex((entry) => entry.index === step.correctIndex);
  return {
    ...step,
    options: shuffled.map((entry) => entry.option),
    correctIndex,
  };
}

function shuffleReorder(step, seed) {
  const indexed = step.items.map((item, index) => ({ item, index }));
  let shuffled = shuffleWithSeed(indexed, seed);

  if (shuffled.every((entry, index) => entry.index === step.correctOrder[index])) {
    shuffled = shuffleWithSeed(indexed, seed + 1);
  }

  return {
    ...step,
    items: shuffled.map((entry) => entry.item),
    correctOrder: step.correctOrder.map((originalIndex) =>
      shuffled.findIndex((entry) => entry.index === originalIndex),
    ),
  };
}

function shuffleMatching(step, seed) {
  return {
    ...step,
    definitionOrder: shuffleWithSeed(step.definitionOrder, seed),
  };
}

function shuffleIndexedEntries(entries, seed) {
  const indexed = entries.map((entry, index) => ({ entry, index }));
  const shuffled = shuffleWithSeed(indexed, seed);

  return shuffled.map((item) => item.entry);
}

function shuffleCategorize(step, seed) {
  return {
    ...step,
    items: shuffleIndexedEntries(step.items, seed),
  };
}

function pickVariantKind(seed, stepIndex) {
  const random = mulberry32(seed + stepIndex * 31);
  const roll = random();
  if (roll < 0.45) return 'choice';
  if (roll < 0.7) return 'fill_blank';
  if (roll < 0.85) return 'true_false';
  return 'reorder';
}

function toReorder(step, instruction) {
  return {
    type: 'reorder',
    instruction,
    items: [...step.options],
    correctOrder: step.options.map((_, index) => index),
    explanation: step.explanation,
  };
}

function isReorderCorrect(step, reorderIndices) {
  return reorderIndices.every((value, index) => value === step.correctOrder[index]);
}

function isMatchingCorrect(step, matchingPairs) {
  return step.pairs.every(
    (_, termIndex) =>
      matchingPairs[termIndex] !== undefined &&
      step.definitionOrder[matchingPairs[termIndex]] === termIndex,
  );
}

function isCategorizeCorrect(step, assignments) {
  return step.items.every(
    (item, itemIndex) =>
      assignments[itemIndex] !== undefined &&
      assignments[itemIndex] === item.correctCategoryIndex,
  );
}

function computeExpectedUserOrder(step) {
  return step.correctOrder.map((originalIndex) =>
    step.items.findIndex((item, index) => {
      const indexed = step.items.map((value, idx) => ({ value, idx }));
      return indexed.find((entry) => entry.idx === originalIndex)?.value === item;
    }),
  );
}

function computeSemanticCorrectOrder(step, originalItems) {
  return step.correctOrder.map((originalIndex) =>
    step.items.indexOf(originalItems[originalIndex]),
  );
}

function computeLessonOrbReward(baseReward, results) {
  const graded = results.filter((result) =>
    ['choice', 'fill_blank', 'true_false', 'reorder'].includes(result.kind),
  );
  if (graded.length === 0) return baseReward;
  const scoreSum = graded.reduce((sum, result) => {
    if (!result.correct) return sum + 0.25;
    if (result.attempts === 1) return sum + 1;
    if (result.attempts === 2) return sum + 0.7;
    return sum + 0.45;
  }, 0);
  const ratio = scoreSum / graded.length;
  const scaled = 0.4 + (1 - 0.4) * ratio;
  return Math.max(1, Math.round(baseReward * scaled));
}

function verifyFillBlankRemap(seedCount = 500) {
  const failures = [];
  const base = {
    type: 'fill_blank',
    prefix: 'Prefix ',
    suffix: ' suffix',
    options: ['Verbessere', 'Kürze', 'Mach'],
    correctIndex: 1,
    explanation: 'x',
  };

  for (let seed = 1; seed <= seedCount; seed += 1) {
    const shuffled = shuffleChoiceLike(base, seed);
    const correctLabel = base.options[base.correctIndex];
    if (shuffled.options[shuffled.correctIndex] !== correctLabel) {
      failures.push({ seed, kind: 'label-mismatch' });
    }
    for (let selected = 0; selected < shuffled.options.length; selected += 1) {
      const expected = selected === shuffled.correctIndex;
      const actual = selected === shuffled.correctIndex;
      if (expected !== actual) failures.push({ seed, selected });
    }
  }

  return failures.length;
}

function verifyReorderRemap(seedCount = 500, step = null) {
  const failures = [];
  const base =
    step ??
    ({
      type: 'reorder',
      instruction: 'Order me',
      items: ['A', 'B', 'C', 'D'],
      correctOrder: [0, 1, 2, 3],
      explanation: 'x',
    });

  const originalItems = [...base.items];

  for (let seed = 1; seed <= seedCount; seed += 1) {
    const prepared = shuffleReorder(base, seed);
    const userOrder = base.correctOrder.map((originalIndex) =>
      prepared.items.indexOf(originalItems[originalIndex]),
    );

    if (userOrder.some((index) => index < 0)) {
      failures.push({ seed, kind: 'missing-item-index' });
      continue;
    }

    if (!isReorderCorrect(prepared, userOrder)) {
      failures.push({
        seed,
        kind: 'semantic-order-marked-wrong',
        userOrder,
        correctOrder: prepared.correctOrder,
      });
    }
  }

  return failures.length;
}

function verifyMatchingRemap(seedCount = 500) {
  const failures = [];
  const base = {
    type: 'matching',
    instruction: 'Match each term to its definition.',
    pairs: [
      { term: 'Prompt', definition: 'Input to a model' },
      { term: 'Token', definition: 'Smallest text unit' },
      { term: 'Context', definition: 'Prior conversation' },
      { term: 'Hallucination', definition: 'Invented answer' },
    ],
    definitionOrder: [0, 1, 2, 3],
    explanation: 'x',
  };

  for (let seed = 1; seed <= seedCount; seed += 1) {
    const prepared = shuffleMatching(base, seed);

    const matchingPairs = {};
    for (let termIndex = 0; termIndex < base.pairs.length; termIndex += 1) {
      const displayIndex = prepared.definitionOrder.indexOf(termIndex);

      if (displayIndex < 0) {
        failures.push({ seed, kind: 'missing-definition-display-index', termIndex });
        continue;
      }

      matchingPairs[termIndex] = displayIndex;
    }

    if (!isMatchingCorrect(prepared, matchingPairs)) {
      failures.push({
        seed,
        kind: 'semantic-pair-marked-wrong',
        matchingPairs,
        definitionOrder: prepared.definitionOrder,
      });
    }

    for (let termIndex = 0; termIndex < base.pairs.length; termIndex += 1) {
      const displayIndex = matchingPairs[termIndex];

      if (displayIndex === undefined) {
        continue;
      }

      const pairIndexAtDisplay = prepared.definitionOrder[displayIndex];
      const shownDefinition = prepared.pairs[pairIndexAtDisplay]?.definition;
      const expectedDefinition = base.pairs[termIndex].definition;

      if (shownDefinition !== expectedDefinition) {
        failures.push({
          seed,
          kind: 'definition-label-mismatch',
          termIndex,
          shownDefinition,
          expectedDefinition,
        });
      }

      if (prepared.pairs[termIndex]?.term !== base.pairs[termIndex].term) {
        failures.push({
          seed,
          kind: 'term-column-shuffled',
          termIndex,
          shownTerm: prepared.pairs[termIndex]?.term,
          expectedTerm: base.pairs[termIndex].term,
        });
      }
    }
  }

  return failures.length;
}

function verifyCategorizeRemap(seedCount = 500) {
  const failures = [];
  const base = {
    type: 'categorize',
    instruction: 'Assign each item to the correct category.',
    categories: ['Goals', 'Constraints', 'Examples'],
    items: [
      { text: 'Define the audience', correctCategoryIndex: 0 },
      { text: 'Keep under 120 words', correctCategoryIndex: 1 },
      { text: 'Show a sample output', correctCategoryIndex: 2 },
      { text: 'State the main task', correctCategoryIndex: 0 },
      { text: 'Use bullet points only', correctCategoryIndex: 1 },
      { text: 'Include one counterexample', correctCategoryIndex: 2 },
    ],
    explanation: 'x',
  };

  for (let seed = 1; seed <= seedCount; seed += 1) {
    const prepared = shuffleCategorize(base, seed);
    const assignments = {};

    for (let itemIndex = 0; itemIndex < prepared.items.length; itemIndex += 1) {
      assignments[itemIndex] = prepared.items[itemIndex].correctCategoryIndex;
    }

    if (!isCategorizeCorrect(prepared, assignments)) {
      failures.push({
        seed,
        kind: 'semantic-assignment-marked-wrong',
        assignments,
      });
    }

    for (const baseItem of base.items) {
      const matches = prepared.items.filter((item) => item.text === baseItem.text);

      if (matches.length !== 1) {
        failures.push({
          seed,
          kind: 'item-label-count-mismatch',
          text: baseItem.text,
          count: matches.length,
        });
        continue;
      }

      if (matches[0].correctCategoryIndex !== baseItem.correctCategoryIndex) {
        failures.push({
          seed,
          kind: 'correct-category-index-corrupted',
          text: baseItem.text,
          expected: baseItem.correctCategoryIndex,
          actual: matches[0].correctCategoryIndex,
        });
      }
    }
  }

  return failures.length;
}

function verifyVariantDistribution(trials = 10000, stepsPerTrial = 2) {
  const aggregate = { choice: 0, fill_blank: 0, true_false: 0, reorder: 0 };
  for (let t = 0; t < trials; t += 1) {
    for (let stepIndex = 0; stepIndex < stepsPerTrial; stepIndex += 1) {
      aggregate[pickVariantKind(t, stepIndex)] += 1;
    }
  }
  const total = trials * stepsPerTrial;
  return Object.fromEntries(
    Object.entries(aggregate).map(([key, value]) => [key, Number((value / total).toFixed(3))]),
  );
}

function verifyDynamicReorderFromChoice(seedCount = 500) {
  const choiceStep = {
    type: 'choice',
    question: 'Which is clearest?',
    options: ['Option A', 'Option B', 'Option C'],
    correctIndex: 1,
    explanation: 'Because B.',
  };

  let reorderSeedsFound = 0;
  let failures = 0;

  for (let seed = 1; seed <= seedCount; seed += 1) {
    for (let stepIndex = 0; stepIndex < 8; stepIndex += 1) {
      if (pickVariantKind(seed, stepIndex) !== 'reorder') {
        continue;
      }

      reorderSeedsFound += 1;
      const stepSeed = seed + stepIndex * 17;
      const shuffledChoice = shuffleChoiceLike(choiceStep, stepSeed);
      const reorderStep = shuffleReorder(
        toReorder(shuffledChoice, 'Arrange in the correct order.'),
        stepSeed + 7,
      );
      const userOrder = shuffledChoice.options.map((option) =>
        reorderStep.items.indexOf(option),
      );

      if (!isReorderCorrect(reorderStep, userOrder)) {
        failures += 1;
      }
    }
  }

  return { reorderSeedsFound, failures };
}

function verifyCm4Reward() {
  const cm4Items = [
    'Messbare Merkmale festlegen (Satzlänge, Anrede, Fachgrad)',
    'Vage Adjektive durch konkrete Regeln ersetzen',
    'Mini-Beispielsatz im Zielton ergänzen',
    'Widersprüchliche Beispiele in anderem Stil entfernen',
  ];
  const base = {
    type: 'reorder',
    instruction: 'Bringe die Schritte für präzise Stilvorgaben in die sinnvolle Reihenfolge.',
    items: cm4Items,
    correctOrder: [0, 1, 2, 3],
    explanation: 'x',
  };

  const prepared = shuffleReorder(base, 42);
  const userOrder = [0, 1, 2, 3].map((originalIndex) =>
    prepared.items.indexOf(cm4Items[originalIndex]),
  );
  const reorderCorrect = isReorderCorrect(prepared, userOrder);
  const reward = computeLessonOrbReward(18, [
    { kind: 'reorder', correct: reorderCorrect, attempts: 1 },
    { kind: 'choice', correct: true, attempts: 1 },
  ]);

  return { reorderCorrect, reward };
}

const fillBlankFailures = verifyFillBlankRemap(500);
const reorderFailures = verifyReorderRemap(500);
const matchingFailures500 = verifyMatchingRemap(500);
const categorizeFailures500 = verifyCategorizeRemap(500);
const distribution = verifyVariantDistribution(10000, 2);
const dynamicReorder = verifyDynamicReorderFromChoice(500);
const cm4Reward = verifyCm4Reward();

console.log(
  JSON.stringify(
    {
      scope: {
        sharedShuffleReorder:
          'prepareChoiceStep reorder branch and prepareNativeStep reorder branch both call shuffleReorder()',
        sharedShuffleMatching:
          'prepareNativeStep matching branch calls shuffleMatching() — shuffles definitionOrder only, pairs stay fixed for left column',
        sharedShuffleCategorize:
          'prepareNativeStep categorize branch calls shuffleCategorize() — shuffles items display order only, correctCategoryIndex stays on each item',
        affectedNativeCatalog: ['cm-4'],
        affectedRuntimeChoiceVariant: 'any choice step where pickVariantKind returns reorder (~15%)',
      },
      fillBlankFailures500: fillBlankFailures,
      reorderFailures500: reorderFailures,
      matchingFailures500,
      categorizeFailures500,
      cm4Reward,
      distribution10000: distribution,
      dynamicReorderFromChoice500: dynamicReorder,
    },
    null,
    2,
  ),
);
