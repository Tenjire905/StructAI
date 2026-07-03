import type { CompareModelResult, CompareModelSuccess } from '@/lib/modelCompare';

export type CompareInsight = {
  copyKey: string;
  vars: Record<string, string | number>;
};

function successfulResults(results: CompareModelResult[]): CompareModelSuccess[] {
  return results.filter((result): result is CompareModelSuccess => result.status === 'success');
}

/**
 * Erzeugt einen kurzen Vergleichssatz pro erfolgreicher Antwort
 * relativ zum Durchschnitt der anderen gewählten Modelle.
 */
export function buildCompareInsight(
  result: CompareModelSuccess,
  allSuccesses: CompareModelSuccess[],
): CompareInsight | null {
  const peers = allSuccesses.filter((entry) => entry.provider !== result.provider);

  if (peers.length === 0) {
    return null;
  }

  const avgCost =
    peers.reduce((sum, entry) => sum + entry.estimatedCostUsd, 0) / peers.length;
  const avgLength =
    peers.reduce((sum, entry) => sum + entry.responseText.length, 0) / peers.length;
  const avgLatency = peers.reduce((sum, entry) => sum + entry.latencyMs, 0) / peers.length;

  const safeAvgCost = Math.max(avgCost, 0.0000001);
  const safeAvgLength = Math.max(avgLength, 1);
  const safeLatency = Math.max(result.latencyMs, 1);

  const costRatio = result.estimatedCostUsd / safeAvgCost;
  const detailPercent = Math.round((result.responseText.length / safeAvgLength - 1) * 100);
  const speedRatio = avgLatency / safeLatency;

  const costMultiplier = Math.round(costRatio * 10) / 10;
  const cheapMultiplier = Math.round((1 / costRatio) * 10) / 10;
  const speedMultiplier = Math.round(speedRatio * 10) / 10;
  const slowMultiplier = Math.round((1 / speedRatio) * 10) / 10;

  const costExpensive = costRatio >= 1.25;
  const costCheap = costRatio <= 0.8;
  const detailMuchMore = detailPercent >= 15;
  const detailSlightlyMore = detailPercent >= 5 && detailPercent < 15;
  const detailLess = detailPercent <= -10;
  const muchFaster = speedRatio >= 1.25;
  const muchSlower = speedRatio <= 0.8;

  if (costExpensive && detailSlightlyMore) {
    return {
      copyKey: 'modelComparer.insightMoreExpensiveSlightlyDetailed',
      vars: { costMultiplier, detailPercent },
    };
  }

  if (costExpensive && detailMuchMore) {
    return {
      copyKey: 'modelComparer.insightMoreExpensiveMuchDetailed',
      vars: { costMultiplier, detailPercent },
    };
  }

  if (costExpensive && detailLess) {
    return {
      copyKey: 'modelComparer.insightMoreExpensiveShorter',
      vars: { costMultiplier, detailPercent: Math.abs(detailPercent) },
    };
  }

  if (costExpensive) {
    return {
      copyKey: 'modelComparer.insightMoreExpensiveSimilarDetail',
      vars: { costMultiplier },
    };
  }

  if (costCheap && detailMuchMore) {
    return {
      copyKey: 'modelComparer.insightCheaperMoreDetailed',
      vars: { costMultiplier: cheapMultiplier, detailPercent },
    };
  }

  if (costCheap && detailLess) {
    return {
      copyKey: 'modelComparer.insightCheaperShorter',
      vars: { costMultiplier: cheapMultiplier, detailPercent: Math.abs(detailPercent) },
    };
  }

  if (costCheap) {
    return {
      copyKey: 'modelComparer.insightCheaperSimilarDetail',
      vars: { costMultiplier: cheapMultiplier },
    };
  }

  if (muchFaster) {
    return {
      copyKey: 'modelComparer.insightFaster',
      vars: { speedMultiplier },
    };
  }

  if (muchSlower) {
    return {
      copyKey: 'modelComparer.insightSlower',
      vars: { speedMultiplier: slowMultiplier },
    };
  }

  return {
    copyKey: 'modelComparer.insightSimilar',
    vars: {},
  };
}

export function buildCompareInsightsByProvider(
  results: CompareModelResult[],
): Map<string, CompareInsight> {
  const successes = successfulResults(results);
  const insights = new Map<string, CompareInsight>();

  for (const result of successes) {
    const insight = buildCompareInsight(result, successes);

    if (insight) {
      insights.set(result.provider, insight);
    }
  }

  return insights;
}
