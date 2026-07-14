# StructAI — Manuelle Test-Checkliste (Expo)

**Stand:** develop `7a341161052b21fd009cbc6726b4c0b0b8959452` (Sprint 5–7)  
**Gerät:** Expo Go **SDK 57** (nicht Play Store SDK 56)  
**Vorbereitung:** Guest-Modus (nicht eingeloggt), ggf. Progress löschen (Profil/Dev oder frische Install)

---

## A — Erststart & Onboarding

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| A1 | App cold start (Guest) | Onboarding Welcome erscheint | |
| A2 | Welcome → Weiter | Theme-Auswahl (Focus/Playful) | |
| A3 | Modus wählen → Bestätigen | **Loop-Screen** (3 Schritte), nicht direkt Home | |
| A4 | Loop Primary-CTA | Landet auf **`/lektion/pb-1`**, nicht Home | |
| A5 | Loop Secondary (ghost) | Landet auf Home | |

## B — Home & Einstieg

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| B1 | Home als frischer Guest | Begrüßung „Gast", nicht „Alex" | |
| B2 | Home ohne Progress | **Start-Card** mit Pfad-Titel + `home.startHint` + Button → `prompt-basics` | |
| B3 | Tab Lernpfade | 1 Pfad „Verfügbar", 4 Pfade „Gesperrt" (Sprint 5) | |
| B4 | prompt-basics öffnen | Kapitelliste, pb-1 = current, Rest locked | |

## C — Lektion & Progression

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| C1 | pb-1 starten & bestehen | Completion, Orbs > 0 | |
| C2 | Completion-Screen | Primary „Nächstes Kapitel" → pb-2 | |
| C3 | Secondary | „Zurück zum Pfad" → `/lernpfad/prompt-basics` | |
| C4 | Deep-Link `/lektion/pb-10` ohne Progress | **Kapitel**-Lock (`lesson.lockedTitle`), kein Spielen | |
| C5 | pb-1 Replay (completed) | Spielbar, 0 Extra-Orbs | |

## D — Streak

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| D1 | Erste **neue** Lektion heute | `currentStreak` ≥ 1, heutiger Tag im StreakTracker markiert | |
| D2 | Replay dieselbe Lektion | Streak unverändert | |

## E — Pfad-Detail

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| E1 | Nach pb-1 | pb-1 completed, pb-2 current | |
| E2 | Locked Kapitel tippen | Nicht klickbar (Lock-Icon) | |
| E3 | Progress-Bar | Fortschritt sichtbar | |

## F — Persistenz

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| F1 | App kill + neu starten (Guest) | Progress bleibt (Dev-Reset aus) | |
| F2 | Onboarding | Nicht erneut (`onboardingCompleted` persistiert) | |
| F3 | Expo Go | AsyncStorage 2.2.0 — kein NitroModules/MMKV-Crash | |

## G — Pfad-Freischaltung (Sprint 5)

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| G1 | Frischer Guest → Lernpfade | Nur `prompt-basics` verfügbar | |
| G2 | Gesperrten Pfad tippen | Keine Navigation | |
| G3 | `/lektion/sl-1` ohne PB-Abschluss | Path-Lock-Screen (`paths.lockedTitle`) | |
| G4 | PB vollständig (Dev-Sim) | `structure-lab` unter „Verfügbar" | |

## H — Prompt Mastery (Sprint 7)

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| H1 | Frischer Guest | `prompt-mastery` unter „Gesperrt" | |
| H2 | ES vollständig (Dev-Sim) | PM unter „Verfügbar" | |
| H3 | pm-1 starten | Spielbar, pm-2 locked | |

## I — CI lokal

```bash
npm run verify:lessons
npx tsc --noEmit
```

Erwartung: 6/6 paths pass, tsc grün.

---

**Blocker notieren:** Schritt-ID + Screenshot + erwartet vs. ist
