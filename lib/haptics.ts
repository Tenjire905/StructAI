import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import type { ThemeMode } from '@/theme';

/**
 * Semantic haptics per HAPTICS.md ("Haptics Map v1"). Components must call
 * ONLY these named functions, never `Haptics.*` directly — that keeps the
 * Focus/Playful intensity mapping in one place and prevents haptic overuse
 * from spreading ad hoc across screens.
 *
 * Every function is fire-and-forget: it never returns a promise callers
 * should await, so a failing/unsupported haptic can never block or delay a
 * UI interaction. expo-haptics resolves to a no-op on web; the try/catch is
 * an extra safety net for unexpected native failures.
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

/** Richtige Antwort in einer Lektion. */
export function hapticCorrectAnswer(mode: ThemeMode): void {
  if (mode === 'focus') {
    fire(() => Haptics.selectionAsync());
    return;
  }

  fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** Falsche Antwort – nur aufrufen, wenn der Fehler wirklich vom Nutzer verursacht wurde. */
export function hapticWrongAnswer(_mode: ThemeMode): void {
  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

/** Lektion abgeschlossen (bestanden). */
export function hapticLessonComplete(): void {
  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** Pfad abgeschlossen, Zertifikat erzeugt — der stärkste Erfolgs-Moment der App. */
export function hapticPathComplete(mode: ThemeMode): void {
  fire(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (mode === 'playful') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  });
}

/** Orb-Gewinn. Focus bleibt bewusst zurückhaltend/stumm, das ist kein Bug. */
export function hapticOrbGained(mode: ThemeMode): void {
  if (mode === 'focus') {
    fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
    return;
  }

  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** BYOK-Key erfolgreich validiert — identisch in beiden Modi, kritischer Vertrauensmoment. */
export function hapticByokValidated(): void {
  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** Matching: nur beim finalen, erfolgreichen Zuordnen eines Paares aufrufen, nicht pro Zwischenschritt. */
export function hapticMatchSuccess(_mode: ThemeMode): void {
  fire(() => Haptics.selectionAsync());
}

/** Categorize: pro korrekt zugeordnetem Item. */
export function hapticCategorizeItemCorrect(_mode: ThemeMode): void {
  fire(() => Haptics.selectionAsync());
}

/** Categorize: einmalig beim Abschluss des gesamten Sets. */
export function hapticCategorizeSetComplete(): void {
  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** Prompt-Lab-Demo-Vergleich beendet — Erfolg oder Fehler, je nach Ursache. */
export function hapticPromptLabResult(
  outcome: 'success' | 'failure',
  cause?: PromptLabFailureCause,
): void {
  if (outcome === 'success') {
    fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
    return;
  }

  if (cause === 'network') {
    // Netzwerk-/Providerfehler sind nicht der Nutzer-Fehler des Nutzers — laut
    // Haptics Map v1 hier höchstens ein sehr leichtes Warning, keine Eskalation.
    fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
    return;
  }

  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}
