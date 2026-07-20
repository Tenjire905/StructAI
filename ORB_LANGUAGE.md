# ORB_LANGUAGE.md
### StructAI – Orb Language v1 (verbindlich). Cursor MUSS diese Zuordnung nutzen.

Grundregel: **Der Orb ist ein lokaler Coach** — abstrakte Energie-Präsenz (kein Gesicht), echte Voiceover-Clips an den richtigen Momenten, erklärt nie die UI-Buttons.

---

## 1. Entscheidungen (v1 — gesetzt)

| Frage | Entscheidung |
|---|---|
| Look | **Abstrakt** — dunkler Kern + violette Corona / Wellen (Eclipse), kein menschliches Gesicht |
| Assets | **SVG + Reanimated** (kein Rive-Abo) |
| Ausdruck | Energie-Wellen (`lib/orbExpressions.ts`): Spin, Counter-Spin, Dash-Dichte, Ellipse-Form — Idle vs Calcul |
| Voice (Dev) | **Lokale MP3-Clips** (`assets/orb-voice`) via `expo-audio` — **$0 Runtime**, Expo Go, Edge-TTS |
| Voice (Release später) | Clips austauschen (Studio / bezahlte Stimme) — gleiche Keys, kein API-Umbau nötig |
| Kein Runtime-Cloud-TTS | Keine ElevenLabs/OpenAI-API im Client (Kosten + Offline + Privacy) |
| Playful | Bubbles + Audio an Lehr-Momenten (`soundEnabled`) |
| Focus | Weniger Bubbles; **explizite `voiceKey`** (Onboarding) spielen Clip trotzdem |
| Onboarding | Motion-first (keine Bubble-Stapel); `voiceKey` = paralleles Voiceover |

### State-Machine (visuell)

| App-State | Visuelles Verhalten |
|---|---|
| Entry (`interaction="enter"`) | Scale-In + Bloom + dichte Wellen |
| Idle | Langsames Atmen + langsame Dual-Spin + weiche Ellipse-Morph |
| Calcul (`think`) | Schneller Counter-Spin, mehr Segmente, gedrängte Form |
| Happy / Celebrating | Helleres Bloom, schnellerer Pulse |
| Worry / Low energy | Gedimmte Aura, wenige Wellen, langsame Rotation |

---

## 2. Zustände

```
idle | attentive | think | happy | worry | low_energy | celebrating | sleepy
```

Lektions-Momente → State: `reading_start`→attentive, `reading`→think, `practicing`→attentive, correct→happy, wrong→worry.

---

## 3. Stimme (Copy + Audio)

- Copy nur über `orb.speech.*` in `theme/copy/*`.
- Audio: `lib/orbVoiceAssets.ts` mappt Keys → MP3; Player: `lib/orbCoachVoice.ts`.
- Generieren: `pip3 install --user edge-tts && node scripts/generate-orb-voice.mjs`
- Fallback: Gerät-TTS nur wenn Clip fehlt **und** `ExpoSpeech` native existiert.
- `voiceKey`: Audio ohne Bubble (Onboarding parallel zum Lesen).

---

## 4. Technik

1. **SVG-Coach:** `OrbSvgCompanion.tsx` + `lib/orbExpressions.ts` + `lib/orbChoreography.ts`.
2. **Facade:** `OrbCompanion.tsx` → SVG only.
3. **Präsenz:** `OrbPresence.tsx` — `layout="hero"`, `interaction`, `voiceKey`.
4. **Audio:** `expo-audio` + bundled MP3s (probe `ExpoAudio` first).
5. Verify: `scripts/verify-orb-coach.mjs`, `scripts/verify-orb-rich-presence.mjs`.
