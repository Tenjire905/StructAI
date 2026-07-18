import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import type { ThemeMode } from '@/theme';

/**
 * Semantic haptics per HAPTICS.md ("Haptics Map v1.2" — device-calibrated).
 * Components must call ONLY these named functions, never `Haptics.*` directly.
 *
 * Device finding (Expo Go): Impact-only pulses were imperceptible. The first
 * clearly felt pattern was Success/Warning Notification + Medium/Heavy Impact
 * (lesson/path complete). Answer feedback now uses that same notification+impact
 * unit so checks are actually tangible; path stays the peak.
 *
 * Fire-and-forget only — never await from UI handlers.
 */

type PromptLabFailureCause = 'user' | 'network';

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

async function impact(style: Haptics.ImpactFeedbackStyle): Promise<void> {
  await Haptics.impactAsync(style);
}

async function notify(
  type: Haptics.NotificationFeedbackType,
): Promise<void> {
  await Haptics.notificationAsync(type);
}

/** Felt unit on target devices: notification + body impact. */
function fireNotifyWithImpact(
  type: Haptics.NotificationFeedbackType,
  style: Haptics.ImpactFeedbackStyle,
): void {
  fire(async () => {
    await notify(type);
    await impact(style);
  });
}

function fireSuccessWithImpact(style: Haptics.ImpactFeedbackStyle): void {
  fireNotifyWithImpact(Haptics.NotificationFeedbackType.Success, style);
}

/** Richtige Antwort — notification+impact (Impact alone was invisible on device). */
export function hapticCorrectAnswer(_mode: ThemeMode): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
}

/** Falsche Antwort – nur bei echter Nutzerursache. */
export function hapticWrongAnswer(_mode: ThemeMode): void {
  fireNotifyWithImpact(
    Haptics.NotificationFeedbackType.Warning,
    Haptics.ImpactFeedbackStyle.Medium,
  );
}

/** Lektion abgeschlossen — slightly stronger than a single answer check. */
export function hapticLessonComplete(): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Heavy);
}

/** Pfadabschluss — Peak: success + heavy, then a second medium bump. */
export function hapticPathComplete(mode: ThemeMode): void {
  fire(async () => {
    await notify(Haptics.NotificationFeedbackType.Success);
    await impact(Haptics.ImpactFeedbackStyle.Heavy);

    if (mode === 'playful') {
      await impact(Haptics.ImpactFeedbackStyle.Medium);
    }
  });
}

/** Orb-Gewinn. */
export function hapticOrbGained(_mode: ThemeMode): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
}

/** BYOK-Key erfolgreich validiert. */
export function hapticByokValidated(): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
}

/** Matching: finales korrektes Paar. */
export function hapticMatchSuccess(_mode: ThemeMode): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
}

/** Categorize: pro korrekt zugeordnetem Item. */
export function hapticCategorizeItemCorrect(_mode: ThemeMode): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
}

/** Categorize: Set abgeschlossen. */
export function hapticCategorizeSetComplete(): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Heavy);
}

/** Prompt-Lab-Vergleich. */
export function hapticPromptLabResult(
  outcome: 'success' | 'failure',
  cause?: PromptLabFailureCause,
): void {
  if (outcome === 'success') {
    fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
    return;
  }

  if (cause === 'network') {
    fireNotifyWithImpact(
      Haptics.NotificationFeedbackType.Warning,
      Haptics.ImpactFeedbackStyle.Medium,
    );
    return;
  }

  fireNotifyWithImpact(
    Haptics.NotificationFeedbackType.Error,
    Haptics.ImpactFeedbackStyle.Medium,
  );
}
