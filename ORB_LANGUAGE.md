# ORB_LANGUAGE.md
### StructAI – Orb Language v1 (verbindlich). Cursor MUSS diese Zuordnung nutzen.

Grundregel: **Der Orb ist ein lokaler Coach** — abstrakte Energie-Präsenz (kein Gesicht), sparsame Stimme, reagiert auf Lernmomente, erklärt nie die UI-Buttons.

---

## 1. Entscheidungen (v1 — gesetzt)

| Frage | Entscheidung |
|---|---|
| Look | **Abstrakt** — dunkler Kern + violette Corona / Rim (Eclipse), kein menschliches Gesicht |
| Assets | **SVG + Reanimated** (kein Rive-Abo, kein Lottie in v1) |
| Ausdruck | Energie-Profile (`lib/orbExpressions.ts`): Aura, Rim, Spin-Tempo (Idle vs Calcul), Bloom — **keine Mimik** |
| Playful-Stimme | Text-Bubble + paralleles **Audio** (`expo-speech`) während Lesen / Üben / Feedback |
| Focus-Stimme | **Schweigt** beim Lesen/Üben (`soundEnabled: false`); nach Check ein **kluger Tipp** als Text |
| Onboarding | Motion-first (keine Bubble-Stapel); optional `voiceKey` für eine kurze Audio-Zeile parallel zum UI-Text |
| Präsenz | Orb während der ganzen aktiven Lektion sichtbar |

### State-Machine (visuell)

| App-State | Visuelles Verhalten |
|---|---|
| Entry (`interaction="enter"`) | Scale-In + Bloom-Punch |
| Idle | Langsames Atmen + langsame Corona-Rotation |
| Calcul (`think`) | Schneller Spin, schärferes Flackern |
| Happy / Celebrating | Helleres Bloom, schnellerer Pulse |
| Worry / Low energy | Gedimmte Aura, langsamer |
| Exit | (Screen-Leave — Presence unmount / fade via Navigation) |

---

## 2. Zustände

```
idle | attentive | think | happy | worry | low_energy | celebrating | sleepy
```

Lektions-Momente → State: `reading_start`→attentive, `reading`→think, `practicing`→attentive, correct→happy, wrong→worry.

---

## 3. Stimme (Copy + Audio)

- Copy nur über `orb.speech.*` in `theme/copy/*`.
- Varianten (a/b/c) rotieren über `stepIndex` / Seed.
- Playful-Keys: `readingStart`, `reading`, `practicing`, `correct`, `wrong`, `celebrating`, `lowEnergy`.
- Focus-Keys: `focus.correctTip`, `focus.wrongTip`, `focus.celebrating`, `focus.lowEnergy`.
- Resolver: `lib/orbLanguage.ts` → `resolveLessonSpeechCopyKey(moment, mode, seed)`.
- UI: `OrbPresence` — Bubble optional; Audio über `lib/orbCoachVoice.ts` (gated by `tokens.presentation.soundEnabled`).
- `voiceKey`: Audio ohne Bubble (Onboarding parallel zum Lesen).

---

## 4. Technik

1. **SVG-Coach:** `OrbSvgCompanion.tsx` + `lib/orbExpressions.ts` + `lib/orbChoreography.ts`.
2. **Facade:** `OrbCompanion.tsx` → SVG only (kein Rive).
3. **Präsenz:** `OrbPresence.tsx` — `layout="hero"`, `interaction`, `voiceKey`.
4. **Voice:** `expo-speech` via `speakOrbCoachLine` (Reduce-Motion respektieren).
5. Verify: `scripts/verify-orb-coach.mjs`, `scripts/verify-orb-rich-presence.mjs`.
