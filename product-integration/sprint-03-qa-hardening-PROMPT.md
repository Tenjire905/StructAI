# Build-Cursor-Prompt: Sprint 3 — QA-Härtung (Legacy-Keys, Source-Archive, Full-Verify)

## Kontext

Sprint 1+2 gemergt (Lesson-Loop, Lock-Guard, Streak, Onboarding-Loop, Guest-Name).  
Content-Ingestion: 185 Lektionen, 5 Pfade — aber `sl` und `cm` haben je 4 Verifier-Verstöße (unreferenced locale keys).

**develop tip:** `ba55147caca0e6f2d4031dcde9927fe3965bd3bb`

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-03
```

## Auftrag (3 Tasks, ein Commit)

### Task 3a — Legacy unreferenced Keys bereinigen

**Problem:** Catalog wurde refactored, alte Locale-Keys blieben:

| Pfad | Orphan Keys (nicht im Catalog referenziert) |
|---|---|
| sl-3 | `sl-3.s1.question`, `sl-3.s1.opt0`, `sl-3.s1.opt1`, `sl-3.s1.opt2` |
| cm-4 | `cm-4.s1.question`, `cm-4.s1.opt0`, `cm-4.s1.opt1`, `cm-4.s1.opt2` |

**Aktueller Catalog:**
- `sl-3` Step 1 = `true_false` → nutzt `sl-3.s1.statement` + `sl-3.s1.explanation`
- `cm-4` Step 1 = `reorder` → nutzt `cm-4.s1.instruction`, `cm-4.s1.item0`…`item3`, `cm-4.s1.explanation`

**Ziel:** Die 4 orphan Keys **pro Pfad** aus allen betroffenen Locale-Dateien **entfernen** (nicht whitelisten).

**Dateien:**
- `data/lessonContent/de.ts` (beide Key-Sets)
- `data/lessonContent/en_sl.ts`, `fr_sl.ts`, `ru_sl.ts` (sl-3 orphans)
- `data/lessonContent/en_cm.ts`, `fr_cm.ts`, `ru_cm.ts` (cm-4 orphans)

**Verifikation danach:**
```bash
node scripts/verify-lesson-content-locales.mjs --range sl-1..sl-35
node scripts/verify-lesson-content-locales.mjs --range cm-1..cm-35
# jeweils 0 Violations, pass: true
```

### Task 3b — Untracked Source-JSONs ins Repo committen

**Problem:** Historische Ingestion-Quellen fehlen noch auf `develop` (nur lokal untracked).

**Zum Commit hinzufügen (falls vorhanden, nicht erfinden):**
- `content-ingestion/es-batch-01.json`
- `content-ingestion/es-batch-01-PROMPT.md`
- `content-ingestion/cm-batch-01-PROMPT.md`
- `content-ingestion/cm-batch-05.json`
- `content-ingestion/cm-batch-05-PROMPT.md`
- `content-ingestion/cm-batch-05-2A.json`
- `content-ingestion/cm-batch-05-2B.json`
- `content-ingestion/cm-batch-05-2C.json`

**Nur** diese Dateien — keine anderen Ordner anfassen. Reine Archivierung, keine Inhaltsänderung.

### Task 3c — Full-Verify Script für alle 185 Lektionen

**Ziel:** Ein Script, das alle 5 Pfade in einem Lauf prüft.

**Neu:** `scripts/verify-all-lesson-content.mjs`
- Ruft intern die Ranges ab: `pb-1..pb-45`, `sl-1..sl-35`, `il-1..il-35`, `cm-1..cm-35`, `es-1..es-35`
- Aggregiert: total keys, total violations, pass/fail pro Pfad
- Exit code `0` nur wenn **alle** Pfade `pass: true`
- JSON-Summary auf stdout (wie bestehende Verifier)

**package.json** ergänzen:
```json
"verify:lessons": "node scripts/verify-all-lesson-content.mjs"
```

**Kein** GitHub Actions Workflow nötig (kein `.github/` im Repo) — nur Script + npm script.

## Verifikation (alle müssen grün sein)

```bash
npx tsc --noEmit
npm run verify:lessons
# Erwartung: 5/5 paths pass, 0 total violations
```

## Commit & Push

```bash
git add data/lessonContent/de.ts data/lessonContent/en_sl.ts data/lessonContent/fr_sl.ts data/lessonContent/ru_sl.ts data/lessonContent/en_cm.ts data/lessonContent/fr_cm.ts data/lessonContent/ru_cm.ts content-ingestion/ scripts/verify-all-lesson-content.mjs package.json
git commit -m "chore: clean legacy locale keys, archive source JSONs, add full lesson verify"
git push -u origin feature/product-integration-sprint-03
```

## Report zurück an Director

Melde:
- Commit-Hash
- `tsc --noEmit` Ergebnis
- Vollständige Ausgabe von `npm run verify:lessons` (5 Pfade, Key-Counts, pass)
- Liste der committed Source-JSON-Dateien
- **Kein Merge nach develop** ohne Freigabe
