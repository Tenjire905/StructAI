# Build-Cursor-Prompt: Sprint 6 — QA-Checkliste & Retest (Product Integration)

## Kontext

Sprint 5 (Pfad-Freischaltung) ist gemergt. Die manuelle Test-Checkliste ist veraltet:

- Stand noch Sprint 3 (`71f13a4`)
- A4/B2 mit „aktuell/Sprint 4“-Platzhaltern statt fester Erwartung
- B3 veraltet (5 tippbare Pfade statt 1+4 gesperrt)
- Keine Sektion für Pfad-Unlock
- Lock-Guard C4 und Streak D1/D2 nie formal nach Hotfixes retestet

**develop tip:** *(nach Sprint-5-Merge eintragen — z. B. `git rev-parse develop`)*

---

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-06
```

Cloud Agent alternativ: `cursor/qa-checklist-retest-fd20`

---

## Auftrag (2 Tasks, ein oder zwei Commits)

### Task 6a — MANUAL-TEST-CHECKLIST.md komplett ersetzen

**Datei:** `product-integration/MANUAL-TEST-CHECKLIST.md`

**Ersetze den gesamten Inhalt** durch:

```markdown
# StructAI — Manuelle Test-Checkliste (Expo)

**Stand:** develop nach Sprint 5 + Expo-Go-Hotfixes (`<TIP-HASH EINTRAGEN>`)  
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
| B1 | Home als frischer Guest | Begrüßung „Gast" (bzw. `profile.guestDisplayName`), nicht „Alex" | |
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

## H — CI lokal

```bash
npm run verify:lessons
npx tsc --noEmit
```

Erwartung: 5/5 paths pass, tsc grün.

---

**Blocker notieren:** Schritt-ID + Screenshot + erwartet vs. ist
```

**Wichtig:** `<TIP-HASH EINTRAGEN>` durch echten develop-Hash ersetzen vor Commit.

Keine anderen Dateien in Task 6a ändern.

---

### Task 6b — Retest durchführen und RETEST-LOG.md anlegen

**Neu:** `product-integration/RETEST-LOG.md`

Initialer Inhalt (Tester füllt Spalten aus):

```markdown
# StructAI — Retest-Log

Protokoll für Regressionstests nach größeren Merges.

| Datum | Tester | develop tip | Tests | Ergebnis | Notizen |
|-------|--------|-------------|-------|----------|---------|
| YYYY-MM-DD | | `<hash>` | C4, D1, D2 | | |

---

## C4 — Kapitel-Lock Deep-Link

**Voraussetzung:** Frischer Guest, kein Progress, Pfad `prompt-basics` ist unlocked.

| Schritt | Aktion |
|---------|--------|
| 1 | App starten, Onboarding überspringen oder Dev-Reset |
| 2 | Manuell navigieren zu `/lektion/pb-10` (Deep-Link, Dev-Menü oder Router) |
| 3 | Prüfen |

**Erwartung:** Screen zeigt `lesson.lockedTitle` / `lesson.lockedBody`, Button „Zurück zum Pfad". **Kein** Quiz, **kein** Path-Lock (`paths.lockedTitle`).

| Pass/Fail | |
|-----------|---|

---

## D1 — Streak bei erster Lektion des Tages

| Schritt | Aktion |
|---------|--------|
| 1 | Guest, kein Streak heute (frischer Tag oder Reset) |
| 2 | pb-1 **erstmals** abschließen |
| 3 | Home öffnen |

**Erwartung:** `currentStreak` ≥ 1, heutiger Wochentag im StreakTracker hervorgehoben.

| Pass/Fail | |
|-----------|---|

---

## D2 — Streak bei Replay

| Schritt | Aktion |
|---------|--------|
| 1 | Direkt nach D1: pb-1 erneut öffnen und abschließen |
| 2 | Home prüfen |

**Erwartung:** `currentStreak` identisch zu D1, kein Doppel-Inkrement.

| Pass/Fail | |
|-----------|---|

---

## Bugfix-Regel

Bei **Fail:** Ursache in „Notizen" dokumentieren. Minimaler Fix im selben Branch nur wenn klarer Code-Bug — kein Scope-Creep. Separater Commit `fix: …` wenn Code betroffen.
```

**Durchführung:** Tests C4, D1, D2 auf Gerät ausführen und Pass/Fail eintragen.

---

## Verifikation

```bash
npx tsc --noEmit
npm run verify:lessons
```

Bei reiner Dokumentation ohne Bugfix: muss grün bleiben.

Bei Bugfix: gleiche Checks + betroffene Tests erneut.

---

## Commit & Push

**Nur Docs (kein Bugfix):**

```bash
git add product-integration/MANUAL-TEST-CHECKLIST.md product-integration/RETEST-LOG.md
git commit -m "docs: refresh manual test checklist and add retest log for C4/D streak"
git push -u origin feature/product-integration-sprint-06
```

**Mit Bugfix (Beispiel):**

```bash
git add store/progressStore.ts lib/streak.ts product-integration/MANUAL-TEST-CHECKLIST.md product-integration/RETEST-LOG.md
git commit -m "fix: streak not incrementing on first daily completion"
git push -u origin feature/product-integration-sprint-06
```

---

## Report zurück an Director

Melde:

1. Commit-Hash(es)
2. develop tip in Checkliste eingetragen
3. RETEST-LOG: C4 / D1 / D2 jeweils Pass oder Fail + Notizen
4. Liste der Checklisten-Änderungen (kurz)
5. Falls Bugfix: Was war kaputt, welche Dateien geändert
6. **Kein Merge nach develop ohne Freigabe**
