# Build-Cursor-Prompt: Sprint 7 — 6. Pfad „Prompt Mastery“ (Scoping + Ingestion)

## Kontext

**Voraussetzung:** Sprints 5–6 abgeschlossen; 5-Pfad-Guest-Loop manuell grün (`MANUAL-TEST-CHECKLIST.md` + `RETEST-LOG.md`).

Der 6. Pfad **`prompt-mastery`** (Arbeitstitel) bündelt fortgeschrittene Themen — **30–35 Lektionen**, Prefix-Vorschlag `pm` (pm-1…pm-35). Er schaltet frei nach vollständigem **`eval-scoring`**.

**develop tip:** *(nach Sprint-6-Merge eintragen)*

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-07
```

## Scope dieses Sprints

**Phase A only** — Infrastruktur + Content-Skeleton, **kein** vollständiger 35-Lektionen-Content in einem Commit.

Spätere Batches (07b, 07c…) können Content-Ingestion-PROMPTs in `content-ingestion/` folgen — analog zu `es-batch-*` / `cm-batch-*`.

---

## Auftrag (5 Tasks, ein oder zwei Commits)

### Task 7a — Pfad in Datenmodell

**Dateien:**
- `data/mockPaths.ts` — neuer Eintrag `prompt-mastery`, 35 Kapitel-Platzhalter (IDs `pm-1`…`pm-35`, Titel aus Catalog oder „TBD“-Titel aus erstem Batch)
- `lib/pathLessonUtils.ts` — `pm: 'prompt-mastery'` in `LESSON_PREFIX_TO_PATH`
- `lib/pathUnlock.ts` — `prompt-mastery` ans Ende von `PATH_UNLOCK_ORDER`; Prerequisite = `eval-scoring`

**Unlock-Kette danach:**
```
… → eval-scoring → prompt-mastery
```

---

### Task 7b — Copy-Keys Pfad-Titel

**4 Locales:** `paths.title.prompt_mastery` (focus + playful)

DE focus Richtung: „Prompt-Meisterschaft“ / EN: „Prompt Mastery“

---

### Task 7c — Lesson-Content Skeleton

**Minimal:** Erste **3 Lektionen** vollständig (Catalog + DE + en_pm.ts + fr_pm.ts + ru_pm.ts) als Muster — Rest als Stub-Einträge im Catalog mit `// TODO batch 07b` **oder** nur pm-1…pm-3 committen und Verifier-Range anpassen.

**Wichtig:** `npm run verify:lessons` muss grün bleiben — entweder:
- Range `pm-1..pm-3` im Full-Verify-Script ergänzen **wenn** alle 35 existieren, oder
- Erst pm-1..pm-3 anlegen und Script um optionalen 6. Pfad erweitern wenn `pm-4` fehlt noch nicht im Catalog referenziert wird

**Skript:** `scripts/verify-all-lesson-content.mjs` — 6. Pfad `pm-1..pm-35` (oder gestaffelt dokumentieren)

---

### Task 7d — UI-Smoke

Keine neuen Screens — bestehende Pfad-Liste zeigt 6. Pfad automatisch via `MOCK_PATHS`.

**Prüfen:**
- Gesperrt bis `eval-scoring` complete
- Nach Unlock: Pfad-Detail + pm-1 startbar
- Home/Lernpfade: 6 Karten, kein Layout-Bruch

---

### Task 7e — Content-Ingestion Prompt für Rest

**Neu:** `content-ingestion/pm-batch-01-PROMPT.md`

Enthält:
- Themen-Gliederung pm-4…pm-35 (Director liefert Outline oder Build-Cursor schlägt 32 Themen vor)
- JSON-Schema wie bestehende Batches
- Verifier-Ranges pro Batch
- Regeln: Step-Typen aus Catalog, keine choice→fill_blank Morphing in Session

**Nicht** in Sprint 7 ausführen — nur Prompt-Datei für Folge-Sessions.

---

## Design-Regeln

- Wie alle Pfade: Tokens, Theme-Modi, Lucide-Icons
- Keine neuen UI-Komponenten unless PathCard/ChapterRow reichen

---

## Verifikation

```bash
npx tsc --noEmit
npm run verify:lessons
```

**Manuell:**
1. Frischer Guest: `prompt-mastery` unter „Gesperrt“
2. Dev: ES vollständig → PM unter „Verfügbar“
3. pm-1 spielbar, pm-2 locked bis pm-1 done

---

## Commit & Push

```bash
git add data/mockPaths.ts lib/pathLessonUtils.ts lib/pathUnlock.ts theme/copy/*.ts theme/copy/types.ts data/lessonContent/* scripts/verify-all-lesson-content.mjs content-ingestion/pm-batch-01-PROMPT.md
git commit -m "feat: add prompt-mastery path skeleton, unlock chain, and ingestion prompt"
git push -u origin feature/product-integration-sprint-07
```

---

## Report zurück an Director

- Commit-Hash
- Wie viele PM-Lektionen vollständig vs. geplant
- verify:lessons Output (6 Pfade?)
- Outline pm-4…pm-35 in `pm-batch-01-PROMPT.md`
- **Kein Merge** ohne Freigabe — **besonders:** Sprint 7 erst freigeben wenn Sprint 5+6 produktiv grün
