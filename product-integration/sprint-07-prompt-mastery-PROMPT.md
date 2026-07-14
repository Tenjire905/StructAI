# Build-Cursor-Prompt: Sprint 7 — 6. Pfad „Prompt Mastery“ (Scoping + Skeleton)

## Kontext

**Voraussetzung (hart):**

- Sprint 5 gemergt (Pfad-Unlock-Kette)
- Sprint 6 gemergt (Checkliste + Retest C4/D grün)
- 5-Pfad-Guest-Loop manuell validiert

Der 6. Pfad **`prompt-mastery`** bündelt fortgeschrittene Prompt-Themen:

- **35 Lektionen** (wie SL/CM/IL/ES)
- Prefix: **`pm`** → `pm-1` … `pm-35`
- Freischaltung: erst nach **vollständigem** `eval-scoring`

**develop tip:** *(nach Sprint-6-Merge eintragen)*

---

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-07
```

Cloud Agent alternativ: `cursor/prompt-mastery-skeleton-fd20`

---

## Scope Sprint 7 (Phase A)

In **einem** Sprint:

1. Datenmodell + Unlock-Kette erweitern
2. Copy-Keys Pfad-Titel
3. **Erste 3 Lektionen** vollständig (Catalog + 4 Locales)
4. Verify-Script auf 6 Pfade
5. Ingestion-Prompt für pm-4…pm-35 **nur als Datei** (nicht ausführen)

**Nicht** in Sprint 7: alle 35 Lektionen content-complete.

---

## Unlock-Kette nach Sprint 7

```
prompt-basics → structure-lab → context-mastery → iteration-loops → eval-scoring → prompt-mastery
```

In `lib/pathUnlock.ts`: automatisch via `MOCK_PATHS`-Reihenfolge — neuer Eintrag **ans Ende** von `data/mockPaths.ts`.

---

## Auftrag (5 Tasks)

### Task 7a — Pfad in Datenmodell

#### `data/mockPaths.ts`

Neuen Eintrag **nach** `eval-scoring` anfügen:

```ts
{
  id: 'prompt-mastery',
  title: 'Prompt-Meisterschaft', // Mock-Titel; UI nutzt paths.title.prompt_mastery
  totalChapters: 35,
  isNew: true,
  chapters: [
    { id: 'pm-1', title: '…', status: 'locked' },
    // … pm-2 … pm-35
  ],
},
```

Titel in `chapters` = Platzhalter aus Catalog/`pm-1.title`-Keys oder kurze DE-Titel aus Task 7c.

#### `lib/pathLessonUtils.ts`

```ts
const LESSON_PREFIX_TO_PATH: Record<string, string> = {
  pb: 'prompt-basics',
  sl: 'structure-lab',
  cm: 'context-mastery',
  il: 'iteration-loops',
  es: 'eval-scoring',
  pm: 'prompt-mastery', // NEU
};
```

#### `lib/pathUnlock.ts`

Keine manuelle Änderung nötig wenn `PATH_UNLOCK_ORDER = MOCK_PATHS.map(p => p.id)`.

---

### Task 7b — Copy-Keys Pfad-Titel (4 Locales)

```ts
// de.ts
'paths.title.prompt_mastery': {
  playful: 'Prompt-Meisterschaft',
  focus: 'Prompt-Meisterschaft',
},

// en.ts
'paths.title.prompt_mastery': {
  playful: 'Prompt Mastery',
  focus: 'Prompt Mastery',
},

// fr.ts
'paths.title.prompt_mastery': {
  playful: 'Maîtrise du prompt',
  focus: 'Maîtrise du prompt',
},

// ru.ts
'paths.title.prompt_mastery': {
  playful: 'Мастерство промптов',
  focus: 'Мастерство промптов',
},
```

---

### Task 7c — Lesson-Content: pm-1, pm-2, pm-3 vollständig

**Analog zu** bestehenden Pfaden (z. B. `es-1`):

1. **`data/mockLessons.catalog.ts`** — 3 Einträge `pm-1`, `pm-2`, `pm-3`
2. **`data/lessonContent/de.ts`** — Keys in `lessonDe`
3. **Neu:** `data/lessonContent/en_pm.ts`, `fr_pm.ts`, `ru_pm.ts` (Pattern wie `en_es.ts`)
4. In `data/mockLessons.ts` (falls Locale-Routing) pm-Prefix registrieren wie andere Pfade

**Themen-Vorschlag (Director kann anpassen):**

| ID | Titel (DE) | Step-Typen |
|----|------------|------------|
| pm-1 | Multi-Step-Prompts planen | info, choice, true_false |
| pm-2 | Prompt-Ketten und Abhängigkeiten | info, reorder, choice |
| pm-3 | Qualitäts-Gates vor dem Senden | info, fill_blank, choice |

**Regeln:**

- Step-Typen aus Catalog — **kein** choice→fill_blank Morphing in `prepareLessonSession`
- Alle Keys in 4 Locales referenziert
- `node scripts/verify-lesson-content-locales.mjs --range pm-1..pm-3` → 0 Violations

**pm-4…pm-35:** Nur IDs + Platzhalter-Titel in `mockPaths.ts` (`status: 'locked'`). **Kein** Catalog-Eintrag bis Batch-Ingestion — Verifier darf pm-4+ nicht erwarten.

---

### Task 7d — Verify-Script erweitern

**Datei:** `scripts/verify-all-lesson-content.mjs`

6. Eintrag:

```js
{ path: 'pm', label: 'prompt-mastery', range: 'pm-1..pm-3' }, // erst pm-1..3; später pm-1..pm-35
```

Erwartung nach Sprint 7: **6 paths checked, 6 passed** (pb, sl, il, cm, es, pm mit Range 3).

---

### Task 7e — Ingestion-Prompt für Rest-Content

**Neu:** `content-ingestion/pm-batch-01-PROMPT.md`

Vollständiger Prompt für Folge-Session (pm-4…pm-12, Batch-Größe 9):

```markdown
# Build-Cursor-Prompt: prompt-mastery Batch 1 (pm-4…pm-12)

## Auftrag
Ingestiere Inhalt aus `content-ingestion/pm-batch-01.json` für Pfad `prompt-mastery`.

## Branch
git checkout -b feature/content-ingestion-pm-batch-01

## Dateien
- data/mockLessons.catalog.ts — nach pm-3 einfügen
- data/mockPaths.ts — totalChapters bleibt 35, pm-4…pm-12 Kapitel-Titel aktualisieren
- data/lessonContent/de.ts, en_pm.ts, fr_pm.ts, ru_pm.ts

## Themen pm-4…pm-12 (Outline)
| ID | Thema |
|----|-------|
| pm-4 | Tool-Use in Prompts |
| pm-5 | System vs. Developer vs. User Messages |
| pm-6 | Prompt-Injection erkennen |
| pm-7 | Guardrails formulieren |
| pm-8 | Multi-Agent-Orchestrierung (Konzept) |
| pm-9 | Prompt-Bibliotheken versionieren |
| pm-10 | A/B-Tests in Produktion |
| pm-11 | Kosten-Nutzen pro Prompt-Variante |
| pm-12 | Erste Zwischenbilanz Prompt Mastery |

## Verifikation
node scripts/verify-lesson-content-locales.mjs --range pm-4..pm-12
npm run verify:lessons

## Kein Merge ohne Freigabe
```

JSON-Datei `pm-batch-01.json` **nicht** in Sprint 7 erfinden — nur PROMPT + Outline.

Weitere Batches in Outline erwähnen:

- pm-batch-02: pm-13…pm-24
- pm-batch-03: pm-25…pm-35 (Abschlussprojekt pm-35)

---

## UI-Smoke (kein neuer Screen)

| Check | Erwartung |
|-------|-----------|
| Lernpfade (frischer Guest) | `prompt-mastery` unter „Gesperrt" |
| Nach ES vollständig (Dev) | PM unter „Verfügbar" |
| `/lernpfad/prompt-mastery` | pm-1 startbar, pm-2 locked |
| `/lektion/pm-1` ohne ES | Path-Lock |

---

## Design-Regeln

- Wie alle Pfade: Tokens, Theme-Modi, Lucide
- Keine neuen UI-Komponenten

---

## Verifikation

```bash
npx tsc --noEmit
npm run verify:lessons
node scripts/verify-lesson-content-locales.mjs --range pm-1..pm-3
```

---

## Commit & Push

```bash
git add data/mockPaths.ts data/mockLessons.catalog.ts data/mockLessons.ts data/lessonContent/de.ts data/lessonContent/en_pm.ts data/lessonContent/fr_pm.ts data/lessonContent/ru_pm.ts lib/pathLessonUtils.ts scripts/verify-all-lesson-content.mjs theme/copy/de.ts theme/copy/en.ts theme/copy/fr.ts theme/copy/ru.ts content-ingestion/pm-batch-01-PROMPT.md
git commit -m "feat: add prompt-mastery path skeleton with pm-1..3 and ingestion prompt"
git push -u origin feature/product-integration-sprint-07
```

---

## Report zurück an Director

1. Commit-Hash
2. verify:lessons — 6/6 paths?
3. pm-1..3 Key-Counts je Locale
4. Link zu `content-ingestion/pm-batch-01-PROMPT.md`
5. **Kein Merge ohne Freigabe** — Sprint 7 erst wenn Sprint 5+6 produktiv grün
