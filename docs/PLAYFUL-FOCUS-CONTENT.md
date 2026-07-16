# Playful / Focus — Inhaltstiefe

StructAI unterscheidet **Playful** und **Focus** in UI-Ton, Feedback **und** in der **Lerninhalt-Tiefe**. Gleiches Lernziel pro Lesson, unterschiedliche Exposition.

## Produktregeln (alle 188 Lessons)

| Aspekt | Playful | Focus |
|--------|---------|-------|
| Sprache | Einfacher, direkter (autorisiert oder auto-vereinfacht) | Präziser, fachlicher |
| Bewertete Schritte | **Weniger** — nur Grundlagen-Step | **Mehr** Nachfragen / Vertiefung |
| Interaktion | Kürzer (z. B. 2 Matching-Paare statt 4) | Volle Aufgabe |
| Lernziel | Identisch | Identisch |

Modus aus `useThemeMode().mode`. Auflösung über `getMockLesson(id, locale, mode)`.

## Strukturelle Tiefe

### Explizit (`playfulSteps` im Catalog)

Pilot **pb-1 … pb-5** mit handkuratierten Sequenzen (pb-4: Wahr/Falsch statt 2× Choice).

### Automatisch (`lib/derivePlayfulSteps.ts`)

Alle übrigen Lessons ohne `playfulSteps`:

1. Info-Step behalten (falls vorhanden)
2. **Nur ersten** bewerteten Step behalten
3. Komplexe Steps kürzen: Matching ≤2 Paare, Reorder ≤3 Items, Categorize ≤3 Items
4. Lessons mit nur 2 Steps: gleiche Struktur, Copy-Unterschied

## Sprachliche Tiefe

Auflösungsreihenfolge (`lib/resolveLessonContent.ts`):

1. Nested `content[mode].*Key`
2. Catalog `*KeyPlayful` / `*KeyFocus`
3. Lesson-Map `{baseKey}.playful` (authoring, z. B. pb-1…5 in `de.ts`)
4. **`simplifyForPlayful()`** — kürzere Sätze, einfachere Begriffe (KI statt Modell, …)
5. Legacy `{baseKey}` (Focus-Fallback)

## UI

Jede Catalog-Lesson zeigt ein **Tiefen-Badge**:

- Playful: „Kürzer · Einfacher“
- Focus: „Vertiefung · Mehr Fragen“

## Audit

```bash
node scripts/audit-playful-coverage.mjs
```

## QA

1. Profil → Modus wechseln
2. Beliebige Lesson **neu öffnen**
3. Schrittanzahl + Textlänge + Badge vergleichen
4. Stichproben: `pb-12`, `sl-10`, `cm-15`, `il-20`, `es-8`, `pm-1`
