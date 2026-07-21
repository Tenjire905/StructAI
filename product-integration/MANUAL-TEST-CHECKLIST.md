# StructAI — Manuelle Test-Checkliste (Expo)

**Stand:** feature `cursor/week1-session-proof-fd20` (user-owned proof + Lab one-pattern + Daily Challenge proofReuse) · base develop `9cee37d98484f1e9b42f7ae4140af90175610257`  
**Gerät:** Expo Go **SDK 57** (nicht Play Store SDK 56); Evening-Reminders nur im **dev build**  
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
node scripts/verify-week1-session-proof.mjs
node scripts/verify-release-week1-polish.mjs
```

Erwartung: paths pass, tsc grün, Week-1 verify ok.

---

## J — Week-1 retention (founder review path)

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| J1 | pb-1 bestehen (erster Abschluss) | Completion zeigt **Skill-Card** („You can do this now“) + Come-back-Zeile | |
| J2 | Weiter nach erstem Abschluss | **`/onboarding/proof`**: **editierbarer** Vague-Draft → Kritik auf *deinen* Text → eigener Rewrite (optional Coach-Suggestion) → Compare *deiner* Scores → Summary; Locale = App-Sprache | |
| J3 | Proof fertig | Persistiert Proof-Completed; → Profil (`/onboarding/profil`) | |
| J4 | Profil speichern | → **Tagesziel** (`/onboarding/tagesziel`), Reminder-Toggle default ON (dev build) | |
| J5 | Tagesziel speichern | → Home; Daily Challenge mit **proofReuse**-Framing (Skill-Name + Rewrite-Muster) + **Prompt Lab** CTA | |
| J6 | Prompt Lab Demo (weak) | Weak-Prompt in App-Locale; Score-Ergebnis = **ein** Next-Pattern + kurzes Example (kein Secondary-Tip, keine Note-Liste) | |
| J7 | Paywall öffnen | CTA = **Pro preview** (kein „Unlock · €…“); Footnote: keine Store-Zahlung | |
| J8 | Evening reminder (dev build) | Body nennt zuletzt geübten Skill (nicht nur Orbs) | |

---

**Blocker notieren:** Schritt-ID + Screenshot + erwartet vs. ist
