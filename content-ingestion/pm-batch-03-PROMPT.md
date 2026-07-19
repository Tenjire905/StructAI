# Build-Cursor-Prompt: prompt-mastery Batch 3 (pm-25…pm-35)

## Auftrag

Erstelle und ingestiere `content-ingestion/pm-batch-03.json` für den Pfad `prompt-mastery`. Gleiches Schema wie `pm-batch-01/02.json`.

## Themen pm-25…pm-35

| ID | Thema |
|----|-------|
| pm-25 | Dritte Zwischenbilanz |
| pm-26 | Skalierung über Teams |
| pm-27 | Prompt-Ownership klären |
| pm-28 | Legacy-Prompts migrieren |
| pm-29 | Vierte Zwischenbilanz |
| pm-30 | Advanced Chain-of-Thought |
| pm-31 | Self-Critique einbauen |
| pm-32 | Ensemble-Prompts |
| pm-33 | Fünfte Zwischenbilanz |
| pm-34 | Checkliste vor Abschlussprojekt |
| pm-35 | Großes Abschlussprojekt: Dein Mastery-Stack |

## Qualität

- Zwischenbilanzen (pm-25, pm-29, pm-33) synthetisieren vorherige Themen
- pm-35 ist Capstone: reicherer Info-Body + praktische Synthese (weiterhin exakt 3 Steps)
- Genau 3 Steps pro Lektion (s0=info + 2 graded)
- Mix: choice / true_false / fill_blank / reorder
- DE/EN/FR/RU echte Pädagogik, nicht copy-paste locales
- orbsReward 18–22 (pm-35: 22–25, hier 24)
- mockPaths.totalChapters: 35

## Verifikation

```bash
node scripts/verify-lesson-content-locales.mjs --range pm-25..pm-35
npx tsc --noEmit
```
