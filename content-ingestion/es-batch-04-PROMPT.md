# Build-Cursor-Prompt: eval-scoring Batch 4 (es-23…es-27)

## JSON-Quelle — **bereits im Repo, nicht im Chat**

> **WICHTIG:** Die Inhalts-JSON liegt **bereits committed** auf dem Feature-Branch.  
> **Nicht** auf eine JSON im Chat warten und **nichts** improvisieren.

| Feld | Wert |
|---|---|
| Pfad | `content-ingestion/es-batch-04.json` |
| Branch | `feature/content-ingestion-es-batch-04` |
| Source-Commit | `71014a3` (`chore: add es-batch-04 content source JSON for ingestion`) |

**Erster Schritt:** Branch auschecken und Datei lesen:

```bash
git fetch origin feature/content-ingestion-es-batch-04
git checkout feature/content-ingestion-es-batch-04
test -f content-ingestion/es-batch-04.json && echo "JSON OK"
```

## Auftrag

Ingestiere **exakt** den Inhalt aus `content-ingestion/es-batch-04.json` für den Pfad `eval-scoring`. Keine inhaltlichen Änderungen, keine Nachdichtung, keine fehlenden Keys improvisieren.

## Branch (falls noch nicht ausgecheckt)

```bash
git checkout develop
git pull origin develop
git checkout feature/content-ingestion-es-batch-04
```

## Dateien anpassen

1. **`data/mockLessons.catalog.ts`**
   - Füge die 5 Catalog-Einträge aus `catalog` im JSON **nach `es-22`** ein (exakt wie geliefert).
   - Bestehende es-1…es-22 **nicht** ändern.

2. **`data/mockPaths.ts`** (Pfad `eval-scoring`)
   - `totalChapters` von `22` auf `27` setzen.
   - Kapitel `es-23`…`es-27` aus `mockPaths.newChapters` anhängen (`status: 'locked'`).
   - **es-6 bleibt vorerst „Abschlussprojekt"** – Umbenennung kommt erst mit finalem es-35.

3. **Locale-Dateien** – Keys **exakt** aus `locales` übernehmen:
   - `data/lessonContent/de.ts` → `lessonDe`
   - `data/lessonContent/en_es.ts` → `lessonEnEs`
   - `data/lessonContent/fr_es.ts` → `lessonFrEs`
   - `data/lessonContent/ru_es.ts` → `lessonRuEs`

## Step-Typen in diesem Batch

| Lektion | Typen |
|---|---|
| es-23 | info, fill_blank, choice |
| es-24 | info, **matching**, choice |
| es-25 | info, true_false, choice |
| es-26 | info, **error_finding**, choice |
| es-27 | info, choice, reorder |

**Zweite `matching`-Lektion im es-Pfad:** es-24 (Dashboard-Elemente)  
**Zweite `error_finding`-Lektion im es-Pfad:** es-26 (falsches Reaktionsmuster bei Ausreißer)

## Verifikation (alle müssen grün sein)

```bash
node scripts/verify-lesson-content-locales.mjs --range es-23..es-27
# Erwartung: 67 Keys je Locale, 0 identische Übersetzungen, 0 Verstöße

npx tsc --noEmit
```

## Commit & Push

```bash
git add data/mockLessons.catalog.ts data/mockPaths.ts data/lessonContent/de.ts data/lessonContent/en_es.ts data/lessonContent/fr_es.ts data/lessonContent/ru_es.ts
git commit -m "feat: ingest content batch 4 for eval-scoring (es-23 to es-27)"
git push -u origin feature/content-ingestion-es-batch-04
```

## Report zurück an Director

Melde:
- Commit-Hash
- Ergebnis `verify-lesson-content-locales.mjs` (Key-Counts, Violations)
- Ergebnis `tsc --noEmit`
- Keys je Locale (erwartet: **67**)
- **Kein Merge nach develop** ohne Freigabe

## JSON-Quelle (Reminder)

Siehe Abschnitt oben — Datei liegt im Repo auf `feature/content-ingestion-es-batch-04`, **nicht** im Chat.
