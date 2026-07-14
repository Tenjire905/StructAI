# Build-Cursor-Prompt: eval-scoring Batch 5 FINAL (es-28…es-35)

## JSON-Quelle — **bereits im Repo, nicht im Chat**

> **WICHTIG:** Die Inhalts-JSON liegt **bereits committed** auf dem Feature-Branch.  
> **Nicht** auf eine JSON im Chat warten und **nichts** improvisieren.

| Feld | Wert |
|---|---|
| Pfad | `content-ingestion/es-batch-05.json` |
| Branch | `feature/content-ingestion-es-batch-05` |
| Source-Commit | *(wird nach Push gesetzt)* |

**Erster Schritt:** Branch auschecken und Datei lesen:

```bash
git fetch origin feature/content-ingestion-es-batch-05
git checkout feature/content-ingestion-es-batch-05
test -f content-ingestion/es-batch-05.json && echo "JSON OK"
```

## Auftrag

Ingestiere **exakt** den Inhalt aus `content-ingestion/es-batch-05.json` für den Pfad `eval-scoring`. Keine inhaltlichen Änderungen, keine Nachdichtung, keine fehlenden Keys improvisieren.

## Branch (falls noch nicht ausgecheckt)

```bash
git checkout develop
git pull origin develop
git checkout feature/content-ingestion-es-batch-05
```

## Dateien anpassen

1. **`data/mockLessons.catalog.ts`**
   - Füge die 8 Catalog-Einträge aus `catalog` im JSON **nach `es-27`** ein (exakt wie geliefert).
   - Bestehende es-1…es-27 **nicht** ändern.

2. **`data/mockPaths.ts`** (Pfad `eval-scoring`)
   - `totalChapters` von `27` auf `35` setzen.
   - Kapitel `es-28`…`es-35` aus `mockPaths.newChapters` anhängen (`status: 'locked'`).
   - **es-6 umbenennen:** Titel von `"Abschlussprojekt"` auf `"Prompt-Qualität messbar machen"` (siehe `mockPaths.renameChapter` im JSON). es-35 ist das echte Abschlussprojekt.
   - **Hinweis:** `renameChapter` betrifft nur den Kapitel-Titel in `mockPaths` — `es-6.title` in den Locale-Dateien bleibt unverändert (wie bei cm-7).

3. **Locale-Dateien** – Keys **exakt** aus `locales` übernehmen:
   - `data/lessonContent/de.ts` → `lessonDe`
   - `data/lessonContent/en_es.ts` → `lessonEnEs`
   - `data/lessonContent/fr_es.ts` → `lessonFrEs`
   - `data/lessonContent/ru_es.ts` → `lessonRuEs`

## Step-Typen in diesem Batch

| Lektion | Typen |
|---|---|
| es-28 | info, choice, true_false |
| es-29 | info, reorder, choice |
| es-30 | info, matching, choice |
| es-31 | info, choice, reorder |
| es-32 | info, fill_blank, choice |
| es-33 | info, true_false, choice |
| es-34 | info, categorize, choice |
| es-35 | info, choice, reorder (5 Items) |

**Capstone:** es-35 — „Großes Abschlussprojekt: Dein Bewertungs-Stack“  
**Zweite `categorize` im es-Pfad:** es-34 (Symptom/Gegenmaßnahme beim Eval-Debug)

## Verifikation (alle müssen grün sein)

```bash
node scripts/verify-lesson-content-locales.mjs --range es-28..es-35
# Erwartung: 109 Keys je Locale, 0 identische Übersetzungen, 0 Verstöße

npx tsc --noEmit
```

## Commit & Push

```bash
git add data/mockLessons.catalog.ts data/mockPaths.ts data/lessonContent/de.ts data/lessonContent/en_es.ts data/lessonContent/fr_es.ts data/lessonContent/ru_es.ts
git commit -m "feat: ingest content batch 5 FINAL for eval-scoring (es-28 to es-35)"
git push -u origin feature/content-ingestion-es-batch-05
```

## Report zurück an Director

Melde:
- Commit-Hash
- Ergebnis `verify-lesson-content-locales.mjs` (Key-Counts, Violations)
- Ergebnis `tsc --noEmit`
- Keys je Locale (erwartet: **109**)
- Bestätigung: es-6 in mockPaths umbenannt, es-35 Capstone live
- **Kein Merge nach develop** ohne Freigabe

## JSON-Quelle (Reminder)

Siehe Abschnitt oben — Datei liegt im Repo auf `feature/content-ingestion-es-batch-05`, **nicht** im Chat.
