# Build-Cursor-Prompt: context-mastery Batch 5 FINAL (cm-28…cm-35)

## Auftrag

Ingestiere **exakt** den Inhalt aus `content-ingestion/cm-batch-05.json` für den Pfad `context-mastery`. Keine inhaltlichen Änderungen, keine Nachdichtung, keine fehlenden Keys improvisieren.

**Dies ist der finale cm-Batch** — danach ist context-mastery bei **35/35** Lektionen vollständig.

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/content-ingestion-cm-batch-05
```

## Dateien anpassen

1. **`data/mockLessons.catalog.ts`**
   - Füge die 8 Catalog-Einträge aus `catalog` im JSON **nach `cm-27`** ein (exakt wie geliefert).
   - Bestehende cm-1…cm-27 **nicht** ändern.

2. **`data/mockPaths.ts`** (Pfad `context-mastery`)
   - `totalChapters` von `27` auf `35` setzen.
   - Kapitel `cm-28`…`cm-35` aus `mockPaths.newChapters` anhängen (`status: 'locked'`).
   - **cm-7 umbenennen:** Titel von `"Abschlussprojekt"` auf `"Kontext meisterhaft dosieren"` (siehe `mockPaths.renameChapter` im JSON). cm-35 ist das echte Abschlussprojekt.

3. **Locale-Dateien** – Keys **exakt** aus `locales` übernehmen:
   - `data/lessonContent/de.ts` → `lessonDe`
   - `data/lessonContent/en_cm.ts` → `lessonEnCm`
   - `data/lessonContent/fr_cm.ts` → `lessonFrCm`
   - `data/lessonContent/ru_cm.ts` → `lessonRuCm`

## Step-Typen in diesem Batch

| Lektion | Typen | Hinweis |
|---|---|---|
| cm-28 | info, choice, true_false | |
| cm-29 | info, **matching**, choice | Block-J: 3 Term/Def-Paare |
| cm-30 | info, **error_finding**, choice | Block-J: seg1 ist Fehler (API-Key) |
| cm-31 | info, fill_blank, reorder | |
| cm-32 | info, choice, reorder | Zwischenbilanz |
| cm-33 | info, true_false, choice | |
| cm-34 | info, **categorize**, choice | Block-J: 2 Kategorien, 4 Items |
| cm-35 | info, choice, reorder | **Capstone** — reorder hat **5 Items** (item0…item4) |

## Spot-Checks vor Commit

- cm-29 matching: `correctIndex` nicht relevant — Paare sind fest verdrahtet; prüfe term/def-Zuordnung in UI.
- cm-30 error_finding: nur `cm-30.s1.seg1` hat `isError: true`.
- cm-34 categorize: cat0=Symptom, cat1=Gegenmaßnahme; item0→cat0, item1→cat1, item2→cat0, item3→cat1.
- cm-35 reorder: `correctOrder: [0,1,2,3,4]` — fünf Items, nicht vier.
- cm-7 in mockPaths: Titel umbenannt, **nicht** gelöscht.

## Verifikation (alle müssen grün sein)

```bash
node scripts/verify-lesson-content-locales.mjs --range cm-28..cm-35
# Erwartung: 109 Keys je Locale, 0 identische Übersetzungen, 0 Verstöße

npx tsc --noEmit
```

## Commit & Push

```bash
git add data/mockLessons.catalog.ts data/mockPaths.ts data/lessonContent/de.ts data/lessonContent/en_cm.ts data/lessonContent/fr_cm.ts data/lessonContent/ru_cm.ts
git commit -m "feat: ingest content batch 5 for context-mastery (cm-28 to cm-35, final)"
git push -u origin feature/content-ingestion-cm-batch-05
```

## Report zurück an Director

Melde:
- Commit-Hash
- Ergebnis `verify-lesson-content-locales.mjs` (Key-Counts, Violations)
- Ergebnis `tsc --noEmit`
- Keys je Locale (erwartet: **109**)
- Bestätigung cm-7 Umbenennung und totalChapters=35
- **Kein Merge nach develop** ohne Freigabe

## JSON-Quelle

Liegt im Repo: `content-ingestion/cm-batch-05.json`
