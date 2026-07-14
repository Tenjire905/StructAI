# Build-Cursor-Prompt: eval-scoring Batch 3 (es-17…es-22)

## Auftrag

Ingestiere **exakt** den Inhalt aus `content-ingestion/es-batch-03.json` für den Pfad `eval-scoring`. Keine inhaltlichen Änderungen, keine Nachdichtung, keine fehlenden Keys improvisieren.

## Branch

```bash
git checkout develop
git pull origin develop
git checkout feature/content-ingestion-es-batch-03
# JSON-Quelle liegt bereits auf diesem Branch
```

## Dateien anpassen

1. **`data/mockLessons.catalog.ts`**
   - Füge die 6 Catalog-Einträge aus `catalog` im JSON **nach `es-16`** ein (exakt wie geliefert).
   - Bestehende es-1…es-16 **nicht** ändern.

2. **`data/mockPaths.ts`** (Pfad `eval-scoring`)
   - `totalChapters` von `16` auf `22` setzen.
   - Kapitel `es-17`…`es-22` aus `mockPaths.newChapters` anhängen (`status: 'locked'`).
   - **es-6 bleibt vorerst „Abschlussprojekt"** – Umbenennung kommt erst mit finalem es-35.

3. **Locale-Dateien** – Keys **exakt** aus `locales` übernehmen:
   - `data/lessonContent/de.ts` → `lessonDe`
   - `data/lessonContent/en_es.ts` → `lessonEnEs`
   - `data/lessonContent/fr_es.ts` → `lessonFrEs`
   - `data/lessonContent/ru_es.ts` → `lessonRuEs`

## Step-Typen in diesem Batch

| Lektion | Typen |
|---|---|
| es-17 | info, choice, true_false |
| es-18 | info, fill_blank, choice |
| es-19 | info, reorder, choice |
| es-20 | info, true_false, choice |
| es-21 | info, **categorize**, choice |
| es-22 | info, choice, reorder |

**Erste `categorize`-Lektion im es-Pfad:** es-21  
- cat0 = Symptom / Observed symptom / Symptôme / Симптом  
- cat1 = Gegenmaßnahme / Countermeasure / Contre-mesure / Мера  
- item0→cat0, item1→cat1, item2→cat0, item3→cat1

## Verifikation (alle müssen grün sein)

```bash
node scripts/verify-lesson-content-locales.mjs --range es-17..es-22
# Erwartung: 78 Keys je Locale, 0 identische Übersetzungen, 0 Verstöße

npx tsc --noEmit
```

## Commit & Push

```bash
git add data/mockLessons.catalog.ts data/mockPaths.ts data/lessonContent/de.ts data/lessonContent/en_es.ts data/lessonContent/fr_es.ts data/lessonContent/ru_es.ts
git commit -m "feat: ingest content batch 3 for eval-scoring (es-17 to es-22)"
git push -u origin feature/content-ingestion-es-batch-03
```

## Report zurück an Director

Melde:
- Commit-Hash
- Ergebnis `verify-lesson-content-locales.mjs` (Key-Counts, Violations)
- Ergebnis `tsc --noEmit`
- Keys je Locale (erwartet: **78**)
- **Kein Merge nach develop** ohne Freigabe

## JSON-Quelle

Liegt im Repo: `content-ingestion/es-batch-03.json`
