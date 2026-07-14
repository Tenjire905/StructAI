# StructAI — Manuelle Test-Checkliste (Expo)

**Stand:** develop nach Sprint 3 (`71f13a4`)  
**Vorbereitung:** Dev-Build starten, Guest-Modus (nicht eingeloggt), ggf. Progress löschen (Profil/Dev oder frische Install)

---

## A — Erststart & Onboarding

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| A1 | App cold start (Guest) | Onboarding Welcome erscheint | |
| A2 | Welcome → Weiter | Theme-Auswahl (Focus/Playful) | |
| A3 | Modus wählen → Bestätigen | **Loop-Screen** (3 Schritte), nicht direkt Home | |
| A4 | Loop-CTA | *(Sprint 4: pb-1)* / *(aktuell: Home)* | |

## B — Home & Einstieg

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| B1 | Home als frischer Guest | Begrüßung „Gast“, nicht „Alex“ | |
| B2 | Home ohne Progress | *(Sprint 4: Start-Card)* / *(aktuell: nur Text)* | |
| B3 | Tab Lernpfade | „Verfügbare Pfade“ mit 5 PathCards, tippbar | |
| B4 | prompt-basics öffnen | Kapitelliste, pb-1 = current, Rest locked | |

## C — Lektion & Progression (Sprint 1)

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| C1 | pb-1 starten & bestehen | Completion, Orbs > 0 | |
| C2 | Completion-Screen | Primary „Nächstes Kapitel“ → pb-2 | |
| C3 | Secondary | „Zurück zum Pfad“ funktioniert | |
| C4 | Deep-Link pb-10 ohne Progress | Lock-Screen, kein Spielen | |
| C5 | pb-1 Replay (completed) | Spielbar, 0 Extra-Orbs | |

## D — Streak (Sprint 2)

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| D1 | Erste Lektion heute | Streak ≥ 1, heutiger Tag markiert | |
| D2 | Replay gleiche Lektion | Streak unverändert | |

## E — Pfad-Detail

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| E1 | Nach pb-1 | pb-1 completed, pb-2 current | |
| E2 | Locked Kapitel tippen | Nicht klickbar (Lock-Icon) | |
| E3 | Progress-Bar | Fortschritt sichtbar | |

## F — Persistenz

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| F1 | App neu starten (Guest) | Progress bleibt (Dev-Reset aus) | |
| F2 | Onboarding | Nicht erneut (bereits completed) | |

## G — CI lokal

```bash
npm run verify:lessons
npx tsc --noEmit
```

Erwartung: 5/5 paths pass, tsc grün.

---

**Blocker notieren:** Schritt-ID + Screenshot + erwartet vs. ist
