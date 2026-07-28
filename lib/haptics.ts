import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import type { ThemeMode } from '@/theme';

/**
 * Semantic haptics per HAPTICS.md ("Haptics Map v1.3 — 5× felt intensity").
 * Components must call ONLY these named functions, never `Haptics.*` directly.
 *
 * Device finding: single Impact/Notification pulses feel soft on many phones.
 * v1.3 amplifies every semantic event with a Heavy-impact burst (default ×5)
 * so feedback is unmistakably physical in a standalone beta build.
 *
 * Fire-and-forget only — never await from UI handlers.
 */

type PromptLabFailureCause = 'user' | 'network';

/** Felt intensity multiplier vs. a single Heavy impact. */
export const HAPTIC_INTENSITY_MULTIPLIER = 5;

const BURST_GAP_MS = 38;

function fire(action: () => Promise<void> | void): void {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    void action();
  } catch {
    // Haptics are a non-critical enhancement — never surface a failure to the user.
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function impact(style: Haptics.ImpactFeedbackStyle): Promise<void> {
  await Haptics.impactAsync(style);
}

async function notify(
  type: Haptics.NotificationFeedbackType,
): Promise<void> {
  await Haptics.notificationAsync(type);
}

/** Rapid Heavy train — the primary 5× amplifier (API max is Heavy). */
async function heavyBurst(
  count: number = HAPTIC_INTENSITY_MULTIPLIER,
): Promise<void> {
  for (let i = 0; i < count; i += 1) {
    await impact(Haptics.ImpactFeedbackStyle.Heavy);
    if (i < count - 1) {
      await delay(BURST_GAP_MS);
    }
  }
}

/** Notification + 5× Heavy body — default semantic unit. */
function fireNotifyWithBurst(
  type: Haptics.NotificationFeedbackType,
  burstCount: number = HAPTIC_INTENSITY_MULTIPLIER,
): void {
  fire(async () => {
    await notify(type);
    await heavyBurst(burstCount);
  });
}

function fireSuccessBurst(
  burstCount: number = HAPTIC_INTENSITY_MULTIPLIER,
): void {
  fireNotifyWithBurst(Haptics.NotificationFeedbackType.Success, burstCount);
}

/** Primary / card / tab press — strong selection feel (no notification spam). */
export function hapticUIPress(): void {
  fire(async () => {
    await heavyBurst(HAPTIC_INTENSITY_MULTIPLIER);
  });
}

/** Richtige Antwort — Success + 5× Heavy. */
export function hapticCorrectAnswer(_mode: ThemeMode): void {
  fireSuccessBurst();
}

/** Falsche Antwort – nur bei echter Nutzerursache. */
export function hapticWrongAnswer(_mode: ThemeMode): void {
  fireNotifyWithBurst(Haptics.NotificationFeedbackType.Warning);
}

/** Lektion abgeschlossen — 5× Heavy, then a second full burst (clearer peak). */
export function hapticLessonComplete(): void {
  fire(async () => {
    await notify(Haptics.NotificationFeedbackType.Success);
    await heavyBurst();
    await delay(70);
    await heavyBurst();
  });
}

/** Pfadabschluss — Peak: double Success + stacked 5× bursts. */
export function hapticPathComplete(mode: ThemeMode): void {
  fire(async () => {
    await notify(Haptics.NotificationFeedbackType.Success);
    await heavyBurst();
    await delay(60);
    await notify(Haptics.NotificationFeedbackType.Success);
    await heavyBurst();

    if (mode === 'playful') {
      await delay(60);
      await heavyBurst();
    }
  });
}

/** Orb-Gewinn. */
export function hapticOrbGained(_mode: ThemeMode): void {
  fireSuccessBurst();
}

/** BYOK-Key erfolgreich validiert. */
export function hapticByokValidated(): void {
  fireSuccessBurst();
}

/** Matching: finales korrektes Paar. */
export function hapticMatchSuccess(_mode: ThemeMode): void {
  fireSuccessBurst();
}

/** Categorize: pro korrekt zugeordnetem Item. */
export function hapticCategorizeItemCorrect(_mode: ThemeMode): void {
  fireSuccessBurst();
}

/** Categorize: Set abgeschlossen. */
export function hapticCategorizeSetComplete(): void {
  fire(async () => {
    await notify(Haptics.NotificationFeedbackType.Success);
    await heavyBurst();
    await delay(70);
    await heavyBurst();
  });
}

/** Prompt-Lab-Vergleich. */
export function hapticPromptLabResult(
  outcome: 'success' | 'failure',
  cause?: PromptLabFailureCause,
): void {
  if (outcome === 'success') {
    fireSuccessBurst();
    return;
  }

  if (cause === 'network') {
    fireNotifyWithBurst(Haptics.NotificationFeedbackType.Warning);
    return;
  }

  fireNotifyWithBurst(Haptics.NotificationFeedbackType.Error);
}
