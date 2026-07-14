# Build-Cursor-Prompt: Sprint 6 — QA-Checkliste & Retest (Product Integration)

## Kontext

Sprint 5 (Pfad-Freischaltung) ist gemergt. Die manuelle Test-Checkliste (`MANUAL-TEST-CHECKLIST.md`) ist veraltet (Stand Sprint 3, falsche Erwartungen bei A4/B2). Lock-Guard (C4) und Streak (D1/D2) sind im Code, wurden nach den Hotfixes nicht formal dokumentiert.

**develop tip:** *(nach Sprint-5-Merge eintragen)*

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-06
```

## Auftrag (2 Tasks, ein Commit)

### Task 6a — MANUAL-TEST-CHECKLIST.md aktualisieren

**Datei:** `product-integration/MANUAL-TEST-CHECKLIST.md`

**Aktualisieren:**

1. **Header:** develop-Tip-Hash + „Stand nach Sprint 5 + Expo-Go-Hotfixes“
2. **A4:** Erwartung = Loop-CTA → **`pb-1`** (nicht Home)
3. **B2:** Erwartung = **Start-Card** mit Button (Sprint 4)
4. **Neue Sektion H — Pfad-Freischaltung (Sprint 5):**

| # | Schritt | Erwartung |
|---|---------|-----------|
| H1 | Frischer Guest → Lernpfade | Nur `prompt-basics` verfügbar, Rest gesperrt |
| H2 | Gesperrten Pfad tippen | Keine Navigation |
| H3 | `/lektion/sl-1` Deep-Link ohne PB | Path-Lock-Screen |
| H4 | Nach PB vollständig | `structure-lab` frei |

5. **C4** präzisieren: Pfad muss unlocked sein; Test = `/lektion/pb-10` **ohne** pb-1…pb-9 Progress → Kapitel-Lock
6. **F** ergänzen: AsyncStorage 2.2.0 / Expo Go — Persistenz nach Kill+Restart
7. **G** unverändert lassen (`tsc`, `verify:lessons`)

Keine funktionalen Code-Änderungen in diesem Task — nur Dokumentation.

---

### Task 6b — Retest-Protokoll (C4, D1, D2)

**Ziel:** Kurzes Retest-Protokoll als Markdown anlegen.

**Neu:** `product-integration/RETEST-LOG.md`

Struktur:

```markdown
# Retest-Log

| Datum | Tester | Build (develop tip) | Tests | Ergebnis | Notizen |
```

**Durchführung (manuell auf Gerät, Expo Go SDK 57):**

| ID | Test | Schritte | Pass/Fail |
|----|------|----------|-----------|
| C4 | Kapitel-Lock Deep-Link | Guest, kein Progress → manuell `/lektion/pb-10` öffnen (Expo Router URL oder Dev) | |
| D1 | Streak erste Lektion | Erste Lektion heute abschließen → Streak ≥ 1, heutiger Tag markiert | |
| D2 | Streak Replay | Dieselbe Lektion nochmal → Streak unverändert | |

**Bei Fail:** Issue in Retest-Log notieren + **minimaler Fix** im selben Branch nur wenn klarer Bug (z. B. Streak schreibt nicht). Kein Scope-Creep.

Falls Bugfix nötig: separater Commit `fix: …` im gleichen Branch, im Report erwähnen.

---

## Verifikation

```bash
npx tsc --noEmit
npm run verify:lessons
```

(Dokumentations-Sprint — sollte ohne Code-Änderung grün bleiben; bei Bugfix gleiche Checks.)

---

## Commit & Push

**Nur Docs:**
```bash
git add product-integration/MANUAL-TEST-CHECKLIST.md product-integration/RETEST-LOG.md
git commit -m "docs: refresh manual test checklist and add retest log for C4/D streak"
git push -u origin feature/product-integration-sprint-06
```

**Mit Bugfix:**
```bash
git add … # betroffene Code-Dateien + docs
git commit -m "fix: …"  # ggf. zweiter Commit für docs
git push -u origin feature/product-integration-sprint-06
```

---

## Report zurück an Director

- Commit-Hash(es)
- Ausgefüllte Zeilen in `RETEST-LOG.md` (C4, D1, D2)
- Liste der Checklisten-Änderungen
- Falls Bugfix: Was war kaputt, was geändert
- **Kein Merge** ohne Freigabe
