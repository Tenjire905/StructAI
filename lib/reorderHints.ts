export type ReorderHintRules = {
  swappedPairs?: { swappedPair: [number, number]; hintKey: string }[];
  tooEarly?: { itemIndex: number; hintKey: string }[];
  tooLate?: { itemIndex: number; hintKey: string }[];
  fallbackExplanationKey?: string;
};

export type ResolvedReorderHintRules = {
  swappedPairs: { swappedPair: [number, number]; hint: string }[];
  tooEarly: { itemIndex: number; hint: string }[];
  tooLate: { itemIndex: number; hint: string }[];
};

function correctPosition(correctOrder: number[], itemIndex: number): number {
  return correctOrder.indexOf(itemIndex);
}

function userPosition(userOrder: number[], itemIndex: number): number {
  return userOrder.indexOf(itemIndex);
}

function isSwappedPair(
  correctOrder: number[],
  userOrder: number[],
  itemA: number,
  itemB: number,
): boolean {
  const posA = correctPosition(correctOrder, itemA);
  const posB = correctPosition(correctOrder, itemB);

  if (posA < 0 || posB < 0) {
    return false;
  }

  return userOrder[posA] === itemB && userOrder[posB] === itemA;
}

function isTooEarly(correctOrder: number[], userOrder: number[], itemIndex: number): boolean {
  const correctPos = correctPosition(correctOrder, itemIndex);
  const userPos = userPosition(userOrder, itemIndex);

  if (correctPos < 0 || userPos < 0) {
    return false;
  }

  return userPos < correctPos;
}

function isTooLate(correctOrder: number[], userOrder: number[], itemIndex: number): boolean {
  const correctPos = correctPosition(correctOrder, itemIndex);
  const userPos = userPosition(userOrder, itemIndex);

  if (correctPos < 0 || userPos < 0) {
    return false;
  }

  return userPos > correctPos;
}

/**
 * Returns the best-matching hint text for a wrong reorder answer.
 * Priority: swapped pair > too early > too late > undefined (use fallback explanation).
 */
export function matchReorderHint(
  correctOrder: number[],
  userOrder: number[],
  rules: ResolvedReorderHintRules | undefined,
): string | undefined {
  if (!rules) {
    return undefined;
  }

  for (const rule of rules.swappedPairs) {
    const [itemA, itemB] = rule.swappedPair;
    if (isSwappedPair(correctOrder, userOrder, itemA, itemB)) {
      return rule.hint;
    }
  }

  for (const rule of rules.tooEarly) {
    if (isTooEarly(correctOrder, userOrder, rule.itemIndex)) {
      return rule.hint;
    }
  }

  for (const rule of rules.tooLate) {
    if (isTooLate(correctOrder, userOrder, rule.itemIndex)) {
      return rule.hint;
    }
  }

  return undefined;
}
