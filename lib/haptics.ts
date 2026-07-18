import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import type { ThemeMode } from '@/theme';

/**
 * Semantic haptics per HAPTICS.md ("Haptics Map v1.1" — device-calibrated).
 * Components must call ONLY these named functions, never `Haptics.*` directly.
 *
 * Intensity ladder (device-tested): Selection was too weak on Expo Go phones.
 * Everyday moments use Light/Medium Impact; path complete stays the peak.
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

/** Success notification followed by a body impact so the moment is clearly felt. */
function fireSuccessWithImpact(style: Haptics.ImpactFeedbackStyle): void {
  fire(async () => {
    await notify(Haptics.NotificationFeedbackType.Success);
    await impact(style);
  });
}

/** Richtige Antwort in einer Lektion. */
export function hapticCorrectAnswer(mode: ThemeMode): void {
  if (mode === 'focus') {
    fire(() => impact(Haptics.ImpactFeedbackStyle.Light));
    return;
  }

  fire(() => impact(Haptics.ImpactFeedbackStyle.Medium));
}

/** Falsche Antwort – nur aufrufen, wenn der Fehler wirklich vom Nutzer verursacht wurde. */
export function hapticWrongAnswer(_mode: ThemeMode): void {
  fire(async () => {
    await notify(Haptics.NotificationFeedbackType.Warning);
    await impact(Haptics.ImpactFeedbackStyle.Light);
  });
}

/** Lektion abgeschlossen (bestanden). */
export function hapticLessonComplete(): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
}

/** Pfad abgeschlossen, Zertifikat erzeugt — der stärkste Erfolgs-Moment der App. */
export function hapticPathComplete(mode: ThemeMode): void {
  fireSuccessWithImpact(
    mode === 'playful'
      ? Haptics.ImpactFeedbackStyle.Heavy
      : Haptics.ImpactFeedbackStyle.Medium,
  );
}

/** Orb-Gewinn. Focus bleibt etwas zurückhaltender als Playful. */
export function hapticOrbGained(mode: ThemeMode): void {
  if (mode === 'focus') {
    fire(() => impact(Haptics.ImpactFeedbackStyle.Light));
    return;
  }

  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
}

/** BYOK-Key erfolgreich validiert — identisch in beiden Modi. */
export function hapticByokValidated(): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
}

/** Matching: nur beim finalen, erfolgreichen Zuordnen eines Paares. */
export function hapticMatchSuccess(_mode: ThemeMode): void {
  fire(() => impact(Haptics.ImpactFeedbackStyle.Light));
}

/** Categorize: pro korrekt zugeordnetem Item. */
export function hapticCategorizeItemCorrect(_mode: ThemeMode): void {
  fire(() => impact(Haptics.ImpactFeedbackStyle.Light));
}

/** Categorize: einmalig beim Abschluss des gesamten Sets. */
export function hapticCategorizeSetComplete(): void {
  fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
}

/** Prompt-Lab-Vergleich beendet — Erfolg oder Fehler, je nach Ursache. */
export function hapticPromptLabResult(
  outcome: 'success' | 'failure',
  cause?: PromptLabFailureCause,
): void {
  if (outcome === 'success') {
    fireSuccessWithImpact(Haptics.ImpactFeedbackStyle.Medium);
    return;
  }

  if (cause === 'network') {
    fire(async () => {
      await notify(Haptics.NotificationFeedbackType.Warning);
      await impact(Haptics.ImpactFeedbackStyle.Light);
    });
    return;
  }

  fire(async () => {
    await notify(Haptics.NotificationFeedbackType.Error);
    await impact(Haptics.ImpactFeedbackStyle.Medium);
  });
}
