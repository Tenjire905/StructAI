# Playful / Focus — Inhaltstiefe

StructAI unterscheidet **Playful** und **Focus** in UI-Ton, Feedback **und** in der **Lerninhalt-Tiefe**. Gleiches Lernziel pro Lesson, unterschiedliche Exposition.

## Produktregeln

| Aspekt | Playful | Focus |
|--------|---------|-------|
| Sprache | Einfacher, direkter | Präziser, fachlicher |
| Info-Steps | Kürzere Bodies, weniger Nebenkonzepte | Dichtere Erklärungen, mehr Kontext |
| Bewertete Schritte | **Weniger** (kürzere Sequenz) | **Mehr** Nachfragen / Vertiefung |
| Step-Typen | Einfachere Typen wo sinnvoll (z. B. Wahr/Falsch statt 2× Choice) | Vollständige Sequenz |
| Lernziel | Identisch | Identisch |

Modus kommt aus `useThemeMode().mode`. Lesson-Texte werden bei Session-Start bzw. Reload über `getMockLesson(id, locale, mode)` aufgelöst.

## Strukturelle Tiefe — `playfulSteps`

Zusätzlich zu sprachlichen Varianten kann der Catalog eine **kürzere Playful-Sequenz** definieren:

```ts
{
  id: 'pb-1',
  steps: [ /* Focus: info + 2 choice */ ],
  playfulSteps: [ /* Playful: info + 1 choice */ ],
}
```

`resolveCatalogLesson()` wählt bei `mode === 'playful'` automatisch `playfulSteps`, falls vorhanden. Die Lesson-UI zeigt ein **Tiefen-Badge** (`lesson.depthBadgePlayful` / `lesson.depthBadgeFocus`).

### Pilot (pb-1 … pb-5)

| Lesson | Focus | Playful |
|--------|-------|---------|
| pb-1 | info + 2 choice | info + 1 choice |
| pb-2 | info + fill_blank + choice | info + fill_blank |
| pb-3 | info + 2 choice | info + 1 choice |
| pb-4 | info + 2 choice | info + true_false |
| pb-5 | info + 2 choice | info + 1 choice |

pb-6+ nutzen weiterhin nur sprachliche Varianten (sofern vorhanden) oder Legacy-Fallback — **keine** `playfulSteps`.

## Authoring — sprachliche Varianten (abwärtskompatibel)

### 1. Key-Suffix (empfohlen für Pilot)

Legacy-Key = Focus-Fallback. Playful-Variante als `{baseKey}.playful` in `data/lessonContent/de.ts` (bzw. Locale-Map).

```
pb-1.s0.body          → Focus (oder Fallback für beide, wenn kein .playful existiert)
pb-1.s0.body.playful  → Playful
```

### 2. Explizite Catalog-Keys

Pro Step optional `*KeyPlayful` / `*KeyFocus` (z. B. `bodyKeyPlayful`, `questionKeyFocus`).

### 3. Nested `content`

```ts
{
  type: 'info',
  titleKey: 'pb-1.s0.title',
  bodyKey: 'pb-1.s0.body',
  content: {
    playful: { titleKey: 'pb-1.s0.title.playful', bodyKey: 'pb-1.s0.body.playful' },
    focus: { bodyKey: 'pb-1.s0.body.focus' },
  },
}
```

## Auflösungsreihenfolge (`lib/resolveLessonContent.ts`)

1. Nested `content[mode].*Key` (wenn gesetzt)
2. Catalog `*KeyPlayful` / `*KeyFocus`
3. Lesson-Map `{baseKey}.{mode}`
4. Legacy `{baseKey}`

Schrittliste: `playfulSteps` (Playful) oder `steps` (Focus / Fallback).

## QA

1. Profil → Modus wechseln (Playful / Fokussiert)
2. Lesson **neu öffnen** (zurück und erneut rein — Session cached nicht den Moduswechsel mid-step)
3. **pb-1 Playful:** 2 Schritte total (1 Info + 1 Frage), Badge „Kürzer · Einfacher“
4. **pb-1 Focus:** 3 Schritte (1 Info + 2 Fragen), Badge „Vertiefung · Mehr Fragen“
5. pb-6+: gleiche Schrittanzahl in beiden Modi (bis Content erweitert wird)
