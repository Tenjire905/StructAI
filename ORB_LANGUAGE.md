# ORB_LANGUAGE.md
### StructAI – Orb Language v1 (verbindlich). Cursor MUSS diese Zuordnung nutzen.

Grundregel: **Der Orb ist ein Coach mit eigener Stimme** (Duolingo/Mimo-Nähe) — er reagiert auf Lernmomente, erklärt aber nie die UI-Buttons.

---

## 1. Entscheidungen (v1 — gesetzt)

| Frage | Entscheidung |
|---|---|
| Assets | SVG + Reanimated (kein Lottie in v1) |
| Gesicht | **Beide Modi** animiertes Gesicht (Focus etwas ruhigere Motion) |
| Playful-Stimme | Spricht während Lesen / Üben / Feedback — warm, charaktervoll |
| Focus-Stimme | **Schweigt** beim Lesen/Üben; nach Check ein **kluger Tipp** (richtig → nächster Schritt; falsch → was schiefging / wie weiter) |
| Präsenz | Orb während der ganzen aktiven Lektion sichtbar |

---

## 2. Zustände

```
idle | attentive | think | happy | worry | low_energy | celebrating | sleepy
```

Lektions-Momente → State: `reading_start`→attentive, `reading`→think, `practicing`→attentive, correct→happy, wrong→worry.

---

## 3. Stimme

- Copy nur über `orb.speech.*` in `theme/copy/*`.
- Varianten (a/b/c) rotieren über `stepIndex` / Seed.
- Playful-Keys: `readingStart`, `reading`, `practicing`, `correct`, `wrong`, `celebrating`, `lowEnergy`.
- Focus-Keys: `focus.correctTip`, `focus.wrongTip`, `focus.celebrating`, `focus.lowEnergy`.
- Resolver: `lib/orbLanguage.ts` → `resolveLessonSpeechCopyKey(moment, mode, seed)`.
- UI: `OrbPresence` (große Sprechblase neben dem Orb).

---

## 4. Technik

1. **Rive (Zielbild):** `@rive-app/react-native` + `assets/rive/ORB_RIVE_SPEC.md`. `OrbCompanion` lazy-loadet Rive nur mit Dev-Client + konfigurierter `.riv`; sonst SVG-Fallback. Nie Expo-Go-Crash durch starren Rive-Import.
2. **SVG-Fallback:** `OrbSvgCompanion.tsx` + `lib/orbChoreography.ts` — Gaze/Ring/Iris bis das `.riv` liegt.
3. **Präsenz:** `OrbPresence.tsx` — `layout="hero"` motion-first (Onboarding ohne Speech-Stapel).
4. Verify: `scripts/verify-orb-rive.mjs`, `scripts/verify-orb-rich-presence.mjs`.
