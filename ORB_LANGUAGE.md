# ORB_LANGUAGE.md
### StructAI – Orb Language v1 (verbindlich). Cursor MUSS diese Zuordnung nutzen.

Grundregel: **Der Orb ist ein lokaler Coach** (Jimbo/Liftoff-Nähe) — abstrakte Präsenz, Speech-Bubbles mit Tips & Smalltalk, erklärt nie die UI-Buttons. **Kein Voiceover in v1.**

---

## 1. Entscheidungen (v1 — gesetzt)

| Frage | Entscheidung |
|---|---|
| Look | **Abstrakt** — dunkler Kern + violette Corona / Wellen (kein Gesicht) |
| Assets | **SVG + Reanimated** |
| Stimme | **Text-Bubbles only** (kein Audio/TTS-Pfad in der UI) |
| Onboarding | **Liftoff-Style:** Marketing-Carousel → Orb-Meet → Coach-Fragen; UI-Copy kurz; eine Idee pro Screen |
| Playful | Bubbles während Lesen / Üben / Feedback + Onboarding |
| Focus | Weniger Bubbles in Lektionen (Tips nach Check); Onboarding trotzdem Orb-geführt |
| Präsenz | Orb in aktiver Lektion + Onboarding-Hero |
| SFX | Kurze Game-UI-Sounds (`lib/sfx.ts`: start/tap/success) — **kein** Coach-Voiceover |

### Onboarding (Liftoff-Muster)

**A — Marketing-Carousel** (`/onboarding`): Brand, **unten abgeschnittene** iPhone-Mocks (Prompt Lab / Home / Lektion+Orb), Caption + Dots in eigener Zone (keine Overlaps), CTA + Anmelden; swipebar  
**B — Coach-Q&A** (Segment-Progress + Skip + vollbreite CTA):

1. Meet — Orb-Bubble `orb.speech.onboarding.welcome` → `meetReady`  
2. Mode — Orb reagiert (`mode` → `modePlayful` / `modeFocus`)  
3. Loop — Orb erklärt den Rhythmus  
4. Profil → Tagesziel — Orb-Bubble `dailyGoal`

---

## 2. Zustände

```
idle | attentive | think | happy | worry | low_energy | celebrating | sleepy
```

Lektions-Momente → State: `reading_start`→attentive, `reading`→think, `practicing`→attentive, correct→happy, wrong→worry.

---

## 3. Stimme (Copy)

- Copy nur über `orb.speech.*` in `theme/copy/*`.
- UI: `OrbPresence` mit `showSpeech` + `speechKey` (Hero-Bubble im Onboarding).
- Kein `voiceKey` / kein `expo-audio` Playback in der Coach-UI.
- Game-SFX laufen separat über `playSfx` und respektieren `presentation.soundEnabled` (Focus standardmäßig aus).

---

## 4. Technik

1. **SVG-Coach:** `OrbSvgCompanion.tsx` + `lib/orbExpressions.ts`
2. **Präsenz:** `OrbPresence.tsx` — `layout="hero" | "coach"`, `speechKey`, `interaction`
3. **Chrome:** `OnboardingChrome`, Segment-Progress, Feature-Visuals unter `components/features/onboarding/`
4. **SFX:** `lib/sfx.ts` — probed `ExpoAudio`, Expo-Go-sicher (No-Op wenn Modul fehlt)
5. Verify: `scripts/verify-orb-coach.mjs`, `scripts/verify-orb-rich-presence.mjs`
