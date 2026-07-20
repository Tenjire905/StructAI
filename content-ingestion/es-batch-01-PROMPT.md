# Build-Cursor-Prompt: eval-scoring Batch 1 (es-7…es-11)

## Auftrag

Ingestiere **exakt** den Inhalt aus `content-ingestion/es-batch-01.json` für den Pfad `eval-scoring`. Keine inhaltlichen Änderungen, keine Nachdichtung, keine fehlenden Keys improvisieren.

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/content-ingestion-es-batch-01
```

## Dateien anpassen

1. **`data/mockLessons.catalog.ts`**
   - Füge die 5 Catalog-Einträge aus `catalog` im JSON **nach `es-6`** ein (exakt wie geliefert).
   - Bestehende es-1…es-6 **nicht** ändern.

2. **`data/mockPaths.ts`** (Pfad `eval-scoring`)
   - `totalChapters` von `6` auf `11` setzen.
   - Kapitel `es-7`…`es-11` aus `mockPaths.newChapters` anhängen (`status: 'locked'`).
   - **es-6 bleibt vorerst „Abschlussprojekt"** – Umbenennung kommt erst mit finalem es-35.

3. **Locale-Dateien** – Keys **exakt** aus `locales` übernehmen:
   - `data/lessonContent/de.ts` → `lessonDe`
   - `data/lessonContent/en_es.ts` → `lessonEnEs`
   - `data/lessonContent/fr_es.ts` → `lessonFrEs`
   - `data/lessonContent/ru_es.ts` → `lessonRuEs`

## Step-Typen in diesem Batch

| Lektion | Typen |
|---|---|
| es-7 | info, choice, true_false |
| es-8 | info, choice, fill_blank |
| es-9 | info, reorder, choice |
| es-10 | info, true_false, choice |
| es-11 | info, choice, reorder |

Keine Block-J-Typen (matching, error_finding, categorize) in diesem Batch.

## Verifikation (alle müssen grün sein)

```bash
node scripts/verify-lesson-content-locales.mjs --range es-7..es-11
# Erwartung: 62 Keys je Locale, 0 identische Übersetzungen, 0 Verstöße

npx tsc --noEmit
```

## Commit & Push

```bash
git add data/mockLessons.catalog.ts data/mockPaths.ts data/lessonContent/de.ts data/lessonContent/en_es.ts data/lessonContent/fr_es.ts data/lessonContent/ru_es.ts
git commit -m "feat: ingest content batch 1 for eval-scoring (es-7 to es-11)"
git push -u origin feature/content-ingestion-es-batch-01
```

## Report zurück an Director

Melde:
- Commit-Hash
- Ergebnis `verify-lesson-content-locales.mjs` (Key-Counts, Violations)
- Ergebnis `tsc --noEmit`
- Keys je Locale (erwartet: **62**)
- **Kein Merge nach develop** ohne Freigabe

## JSON-Quelle

Liegt im Repo: `content-ingestion/es-batch-01.json`
