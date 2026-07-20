# Build-Cursor-Prompt: context-mastery Batch 1 (cm-8…cm-12)

## Auftrag

Ingestiere **exakt** den Inhalt aus `content-ingestion/cm-batch-01.json` für den Pfad `context-mastery`. Keine inhaltlichen Änderungen, keine Nachdichtung, keine fehlenden Keys improvisieren.

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/content-ingestion-cm-batch-01
```

## Dateien anpassen

1. **`data/mockLessons.catalog.ts`**
   - Füge die 5 Catalog-Einträge aus `catalog` im JSON **nach `cm-7`** ein (exakt wie geliefert).
   - Bestehende cm-1…cm-7 **nicht** ändern.

2. **`data/mockPaths.ts`** (Pfad `context-mastery`)
   - `totalChapters` von `7` auf `12` setzen.
   - Kapitel `cm-8`…`cm-12` aus `mockPaths.newChapters` anhängen (`status: 'locked'`).
   - Bestehende cm-1…cm-7 **nicht** umbenennen (cm-7 bleibt vorerst „Abschlussprojekt" – Umbenennung kommt erst mit finalem cm-35).

3. **Locale-Dateien** – Keys **exakt** aus `locales` übernehmen:
   - `data/lessonContent/de.ts` → `lessonDe`
   - `data/lessonContent/en_cm.ts` → `lessonEnCm`
   - `data/lessonContent/fr_cm.ts` → `lessonFrCm`
   - `data/lessonContent/ru_cm.ts` → `lessonRuCm`

## Step-Typen in diesem Batch

| Lektion | Typen |
|---|---|
| cm-8 | info, choice, true_false |
| cm-9 | info, choice, fill_blank |
| cm-10 | info, reorder, choice |
| cm-11 | info, true_false, choice |
| cm-12 | info, choice, reorder |

Keine Block-J-Typen (matching, error_finding, categorize) in diesem Batch.

## Verifikation (alle müssen grün sein)

```bash
node scripts/verify-lesson-content-locales.mjs --range cm-8..cm-12
# Erwartung: 62 Keys je Locale, 0 identische Übersetzungen, 0 Verstöße

npx tsc --noEmit
```

## Commit & Push

```bash
git add data/mockLessons.catalog.ts data/mockPaths.ts data/lessonContent/de.ts data/lessonContent/en_cm.ts data/lessonContent/fr_cm.ts data/lessonContent/ru_cm.ts
git commit -m "feat: ingest content batch 1 for context-mastery (cm-8 to cm-12)"
git push -u origin feature/content-ingestion-cm-batch-01
```

## Report zurück an Director

Melde:
- Commit-Hash
- Ergebnis `verify-lesson-content-locales.mjs` (Key-Counts, Violations)
- Ergebnis `tsc --noEmit`
- Keys je Locale (erwartet: **62**)
- **Kein Merge nach develop** ohne Freigabe

## JSON-Quelle

Liegt im Repo-Root: `content-ingestion/cm-batch-01.json`
