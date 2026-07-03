import { appStorage } from '@/lib/appStorage';

const SETTINGS_KEY = 'structai.byok.spending.settings.v1';
const TOTALS_KEY = 'structai.byok.spending.totals.v1';

export type SpendingLimitSettings = {
  dailyLimitUsd: number | null;
  monthlyLimitUsd: number | null;
};

export type SpendingTotals = {
  dayKey: string;
  monthKey: string;
  dailyUsd: number;
  monthlyUsd: number;
};

export type SpendingWarning = 'none' | 'daily' | 'monthly' | 'both';

const DEFAULT_SETTINGS: SpendingLimitSettings = {
  dailyLimitUsd: null,
  monthlyLimitUsd: null,
};

function currentDayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

function parseLimit(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function normalizeSettings(raw: Partial<SpendingLimitSettings> | null): SpendingLimitSettings {
  return {
    dailyLimitUsd: parseLimit(raw?.dailyLimitUsd),
    monthlyLimitUsd: parseLimit(raw?.monthlyLimitUsd),
  };
}

function readTotalsRaw(): SpendingTotals {
  const raw = appStorage.getString(TOTALS_KEY);

  if (!raw) {
    return {
      dayKey: currentDayKey(),
      monthKey: currentMonthKey(),
      dailyUsd: 0,
      monthlyUsd: 0,
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SpendingTotals>;
    const dayKey = parsed.dayKey ?? currentDayKey();
    const monthKey = parsed.monthKey ?? currentMonthKey();
    const dailyUsd = dayKey === currentDayKey() ? Number(parsed.dailyUsd ?? 0) : 0;
    const monthlyUsd = monthKey === currentMonthKey() ? Number(parsed.monthlyUsd ?? 0) : 0;

    return {
      dayKey: currentDayKey(),
      monthKey: currentMonthKey(),
      dailyUsd: Number.isFinite(dailyUsd) ? dailyUsd : 0,
      monthlyUsd: Number.isFinite(monthlyUsd) ? monthlyUsd : 0,
    };
  } catch {
    return {
      dayKey: currentDayKey(),
      monthKey: currentMonthKey(),
      dailyUsd: 0,
      monthlyUsd: 0,
    };
  }
}

function writeTotals(totals: SpendingTotals): void {
  appStorage.set(TOTALS_KEY, JSON.stringify(totals));
}

export function readSpendingSettings(): SpendingLimitSettings {
  const raw = appStorage.getString(SETTINGS_KEY);

  if (!raw) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    return normalizeSettings(JSON.parse(raw) as Partial<SpendingLimitSettings>);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSpendingSettings(settings: SpendingLimitSettings): void {
  appStorage.set(SETTINGS_KEY, JSON.stringify(normalizeSettings(settings)));
}

export function readSpendingTotals(): SpendingTotals {
  const totals = readTotalsRaw();
  writeTotals(totals);
  return totals;
}

/** Clientseitige Schätzung — keine Abrechnungsgarantie. */
export function recordEstimatedSpend(amountUsd: number): SpendingTotals {
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    return readSpendingTotals();
  }

  const totals = readTotalsRaw();

  totals.dailyUsd += amountUsd;
  totals.monthlyUsd += amountUsd;
  writeTotals(totals);

  return totals;
}

export function getSpendingWarning(
  settings: SpendingLimitSettings = readSpendingSettings(),
  totals: SpendingTotals = readSpendingTotals(),
): SpendingWarning {
  const dailyHit =
    settings.dailyLimitUsd !== null && totals.dailyUsd >= settings.dailyLimitUsd;
  const monthlyHit =
    settings.monthlyLimitUsd !== null && totals.monthlyUsd >= settings.monthlyLimitUsd;

  if (dailyHit && monthlyHit) {
    return 'both';
  }

  if (dailyHit) {
    return 'daily';
  }

  if (monthlyHit) {
    return 'monthly';
  }

  return 'none';
}

export function formatSpendUsd(amount: number): string {
  if (amount < 0.01) {
    return `$${amount.toFixed(4)}`;
  }

  return `$${amount.toFixed(2)}`;
}
