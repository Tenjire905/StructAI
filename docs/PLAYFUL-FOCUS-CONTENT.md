# Playful / Focus — Inhaltstiefe

StructAI unterscheidet **Playful** und **Focus** nicht nur in UI-Ton und Feedback, sondern auch in der **Lerninhalt-Tiefe**. Gleiches Lernziel pro Lesson, unterschiedliche Exposition.

## Produktregeln

| Aspekt | Playful | Focus |
|--------|---------|-------|
| Sprache | Einfacher, direkter | Präziser, fachlicher |
| Info-Steps | Kürzere Bodies, weniger Nebenkonzepte | Dichtere Erklärungen, mehr Kontext |
| Choice / Reorder | Einfachere Fragen, weniger komplexe Distraktoren | Tiefere Nachfragen, anspruchsvollere Optionen |
| Lernziel | Identisch | Identisch |

Modus kommt aus `useThemeMode().mode`. Lesson-Texte werden bei Session-Start bzw. Reload über `getMockLesson(id, locale, mode)` aufgelöst.

## Authoring — drei Wege (abwärtskompatibel)

### 1. Key-Suffix (empfohlen für Pilot)

Legacy-Key = Focus-Fallback. Playful-Variante als `{baseKey}.playful` in `data/lessonContent/de.ts` (bzw. Locale-Map).

```
pb-1.s0.body          → Focus (oder Fallback für beide, wenn kein .playful existiert)
pb-1.s0.body.playful  → Playful
```

Keine Catalog-Änderung nötig.

### 2. Explizite Catalog-Keys

Pro Step optional `*KeyPlayful` / `*KeyFocus` (z. B. `bodyKeyPlayful`, `questionKeyFocus`). Überschreiben den Basis-Key für den jeweiligen Modus.

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

Teilvarianten möglich — fehlende Felder fallen auf Basis-Key + Suffix-Logik zurück.

## Auflösungsreihenfolge (`lib/resolveLessonContent.ts`)

1. Nested `content[mode].*Key` (wenn gesetzt)
2. Catalog `*KeyPlayful` / `*KeyFocus`
3. Lesson-Map `{baseKey}.{mode}`
4. Legacy `{baseKey}`

## Pilot-Lessons (DE)

Vollständig mit Playful-Varianten: **pb-1, pb-2, pb-3, pb-4, pb-5** (`prompt-basics`).

## Reorder-Hints (vorbereitet)

`LessonReorderCatalogStep` unterstützt `reorderHintKeyPlayful` / `reorderHintKeyFocus` — Engine folgt in Session 1B.

## QA

1. Einstellungen → Modus wechseln
2. Lesson neu öffnen (oder Session neu starten)
3. pb-1: Playful spürbar kürzer/einfacher als Focus
4. pb-6+: identischer Text in beiden Modi (Legacy-Fallback)
