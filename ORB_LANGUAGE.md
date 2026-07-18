# ORB_LANGUAGE.md
### StructAI – Orb Language v1 (verbindlich). Cursor MUSS diese Zuordnung nutzen.

Herkunft: Produktentscheidung nach Companion-Sparring (Jul 2026). Ziel: Der Orb bekommt eine **eigene, knappe Körpersprache** — wie gamifizierte Lern-Apps — ohne Instruktionen zu übernehmen und ohne Focus zu vermüllen.

Grundregel: **Der Orb reagiert auf Gefühlsmomente, er erklärt nie die UI.** Kein „Tippe Prüfen“, kein Tutorial-Geschwätz.

---

## 1. Entscheidungen (v1 — gesetzt)

| Frage | Entscheidung | Warum |
|---|---|---|
| Assets | **SVG + Reanimated 3** (procedural), kein Lottie/Frame-Sheet in v1 | Passt zum Stack, tokensicher, schnell iterierbar; Frames später nur wenn Playful noch flach wirkt |
| Stimme | **Playful: seltene Einzeiler.** **Focus: stumm** | Gleiche Logik, unterschiedliche Lautstärke (wie Copy-System) |
| Präsenz in Lektionen | Orb **während Lesen + Üben + Feedback** sichtbar | Nicht nur am Abschluss — sonst fehlt die „Sprache beim Lesen“ |
| Focus-Look | **Minimal-Orb ohne Augen**, ruhiger Atem; **kein Ring-Redesign in v1** | Ring bleibt laut `THEME_MODES.md` §7 zurückgestellt bis Interviews |
| Scope | Gesicht + Motion + optionale Playful-Zeile | Volle Narrative-Engine bewusst später |

---

## 2. Zustände (erweitert)

```
idle | attentive | think | happy | worry | low_energy | celebrating | sleepy
```

| State | Bedeutung | Playful Gesicht/Motion | Focus | Stimme (nur Playful) |
|---|---|---|---|---|
| `idle` | bereit | atmen + Blink | leiser Atem, keine Augen | — |
| `attentive` | „ich höre zu“ | größere Augen, kein Bounce | leichter Highlight | — |
| `think` | liest / verarbeitet | Blick leicht zur Seite, Blink | ruhiger Puls | kurze Zeile |
| `happy` | richtig / Meilenstein | Smile-Augen + Soft-Pop | kurzer Puls | kurze Zeile |
| `worry` | falsch, aber freundlich | weichere, besorgte Augen | kurzer Puls | kurze Zeile |
| `celebrating` | Lektion/Pfad geschafft | stärkerer Pop | Success-Puls | kurze Zeile |
| `low_energy` | Tagesziel schwach | gedimmt, gequetschte Augen | gedimmt | kurze Zeile |
| `sleepy` | App lange im Hintergrund (Playful) | Linien-Augen | n/a | — |

Priorität im Hook: `celebrating` → Override → `low_energy` → `sleepy` → `idle`.

---

## 3. Lektions-Momente → State

| Moment | State |
|---|---|
| Info-Step, Text gerade erschienen (&lt; ~2s) | `attentive` |
| Info-Step, Lesen läuft (≥ ~2s) | `think` |
| Übungs-Step, noch nicht geprüft | `attentive` |
| Feedback richtig | `happy` |
| Feedback falsch | `worry` |
| Abschluss / Celebration aktiv | `celebrating` (Hook) |

---

## 4. Stimme — Regeln

1. Maximal **ein Satz**, ideal ≤ 6 Wörter.
2. Nur Playful; Focus rendert **keine** Speech-Chip.
3. Nie UI-Anweisungen, nie Spoiler zur richtigen Antwort.
4. Nur bei: `think`, `happy`, `worry`, `celebrating`, `low_energy`.
5. Copy ausschließlich über `theme/copy/*` Keys `orb.speech.*`.

---

## 5. Technische Vorgabe

1. Gesicht/Motion: `components/features/OrbCompanion.tsx` — Komponenten rufen **keine** ad-hoc Augen-Pfade außerhalb.
2. Präsenz + Speech: `components/features/OrbPresence.tsx`.
3. Moment→State / Speech-Key: `lib/orbLanguage.ts`.
4. Mood-Ableitung global: `hooks/useOrbCompanionState.ts`.
5. Animationen: nur Reanimated 3 (`withSpring` / `withTiming` / `withRepeat`).
6. Tokens: nur `DESIGN_TOKENS.md` / `useThemeMode()`.
7. Verify: `scripts/verify-orb-language.mjs` (+ bestehende Lifecycle-Checks erweitern).

---

## 6. Explizit später (kein Bug)

- Lottie/Frame-Sheet-Charakter
- Focus-Ring-Darstellung
- Granulare Matching-Paar-Reaktionen
- Persistente Dialogue-History / Chat mit dem Orb
