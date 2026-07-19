# Build-Cursor-Prompt: prompt-mastery Batch 2 (pm-13…pm-24)

## Auftrag

Erstelle und ingestiere `content-ingestion/pm-batch-02.json` für den Pfad `prompt-mastery`. Gleiches Schema wie `pm-batch-01.json`.

## Themen pm-13…pm-24

| ID | Thema |
|----|-------|
| pm-13 | Komplexe Workflows zerlegen |
| pm-14 | Fallback-Strategien definieren |
| pm-15 | Output-Validierung automatisieren |
| pm-16 | Prompt-Templates für Teams |
| pm-17 | Review-Workflows etablieren |
| pm-18 | Sensible Domänen absichern |
| pm-19 | Modellwechsel planen |
| pm-20 | Zweite Zwischenbilanz |
| pm-21 | Prompt-Metriken in Produktion |
| pm-22 | Incident-Response für Prompts |
| pm-23 | Compliance-Anforderungen mappen |
| pm-24 | Dokumentation für Stakeholder |

## Qualität

- Genau 3 Steps pro Lektion (s0=info + 2 graded)
- Mix: choice / true_false / fill_blank / reorder
- DE/EN/FR/RU echte Pädagogik, nicht copy-paste locales
- orbsReward ~18–22
- mockPaths.totalChapters: 35

## Verifikation

```bash
node scripts/verify-lesson-content-locales.mjs --range pm-13..pm-24
npx tsc --noEmit
```
