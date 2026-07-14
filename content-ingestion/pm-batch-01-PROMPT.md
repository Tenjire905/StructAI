# Build-Cursor-Prompt: prompt-mastery Batch 1 (pm-4…pm-12)

## Auftrag

Ingestiere Inhalt aus `content-ingestion/pm-batch-01.json` für den Pfad `prompt-mastery`. Keine inhaltlichen Änderungen am gelieferten JSON.

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/content-ingestion-pm-batch-01
```

## Dateien

1. `data/mockLessons.catalog.ts` — Einträge nach `pm-3` einfügen
2. `data/mockPaths.ts` — Kapitel-Titel pm-4…pm-12 aktualisieren (falls im JSON)
3. Locale: `de.ts`, `en_pm.ts`, `fr_pm.ts`, `ru_pm.ts`

## Themen pm-4…pm-12

| ID | Thema |
|----|-------|
| pm-4 | Tool-Use in Prompts |
| pm-5 | System vs. Developer vs. User Messages |
| pm-6 | Prompt-Injection erkennen |
| pm-7 | Guardrails formulieren |
| pm-8 | Multi-Agent-Orchestrierung |
| pm-9 | Prompt-Bibliotheken versionieren |
| pm-10 | A/B-Tests in Produktion |
| pm-11 | Kosten-Nutzen pro Prompt-Variante |
| pm-12 | Erste Zwischenbilanz |

## Verifikation

```bash
node scripts/verify-lesson-content-locales.mjs --range pm-4..pm-12
npm run verify:lessons
npx tsc --noEmit
```

## Kein Merge ohne Freigabe

Weitere Batches: pm-13…pm-24 (Batch 2), pm-25…pm-35 (Batch 3 + Abschlussprojekt).
