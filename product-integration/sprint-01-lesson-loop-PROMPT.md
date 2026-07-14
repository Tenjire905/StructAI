# Build-Cursor-Prompt: Sprint 1 — Lesson-Loop schließen (Product Integration)

## Kontext

Content-Ingestion ist abgeschlossen (185 Lektionen, 5 Pfade). Der Unlock-Motor existiert bereits in `lib/pathProgress.ts` + `progressStore`. Was fehlt: nahtloser Nutzerloop und erzwungene Locks.

**develop tip:** `3226a52ad964a2506783ab4a6451aa59b669f2cf`

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-01
```

## Auftrag (3 Tasks, ein Commit)

### Task 1a — „Weiter zum nächsten Kapitel“ nach Lektionsabschluss

**Problem:** Nach Pass zeigt `CompletionView` nur „Zurück zum Pfad“ (`router.back()`). Der Progressions-Loop bricht ab.

**Ziel:**
- Wenn `getNextLessonId(pathId, lessonId)` einen nächsten Chapter-ID liefert → **Primary CTA** „Nächstes Kapitel“ → `router.replace('/lektion/' + nextId)` (oder expo-router-Äquivalent)
- **Secondary CTA** „Zurück zum Pfad“ bleibt (outline/secondary variant)
- Wenn kein nächstes Kapitel (letzte Lektion, aber Pfad noch nicht komplett — edge case) oder nur `path_complete` → Verhalten wie bisher
- `PathCompletionView` unverändert lassen (Pfad komplett = eigenes Finish)

**Dateien:**
- `app/lektion/[id].tsx` — `CompletionView` erweitern: `lessonId` + `pathId` props; zwei Buttons
- `lib/pathLessonUtils.ts` — `getNextLessonId` bereits vorhanden, nutzen
- `theme/copy/de.ts`, `en.ts`, `fr.ts`, `ru.ts` — neue Keys:
  - `lesson.continueNext` (focus: „Nächstes Kapitel“, playful: „Weiter zur nächsten Lektion!“)
  - EN/FR/RU analog, **0 identische Strings** über Sprachen hinweg wo vermeidbar

### Task 1b — Lock-Guard im Lesson-Player

**Problem:** `ChapterRow` zeigt locked, aber `app/lektion/[id].tsx` prüft Status nicht — Deep-Link / manuelle ID kann locked Lektionen spielen und `completeLesson()` persistiert.

**Ziel:**
- Neue Helper in `lib/pathProgress.ts`:
  - `getLessonChapterStatus(lessonId, pathProgress)` → `'completed' | 'current' | 'failed' | 'locked' | undefined`
  - `isLessonPlayable(status)` → true für `completed`, `current`, `failed`; false für `locked` / undefined
- In `LessonSessionScreen` **vor** dem aktiven Step-Flow:
  - Wenn `!isLessonPlayable(status)` → Block-Screen mit Copy + Button „Zurück zum Pfad“
  - Replay erlaubt: `completed` und `failed` dürfen gespielt werden
  - `locked` blockiert komplett (kein `recordLessonOpened`, kein `completeLesson`)

**Copy-Keys (alle 4 Locales):**
- `lesson.lockedTitle` (z. B. DE focus: „Kapitel gesperrt“)
- `lesson.lockedBody` (z. B. „Schließe zuerst die vorherigen Kapitel ab.“)

**Dateien:**
- `lib/pathProgress.ts`
- `app/lektion/[id].tsx`

### Task 1c — Dev-Session-Reset default aus

**Problem:** `DEV_FRESH_SESSION_ON_LAUNCH = true` in `lib/devSession.ts` löscht Guest-Progress bei jedem Dev-Cold-Start → Unlock-Demo unmöglich.

**Ziel:**
- `DEV_FRESH_SESSION_ON_LAUNCH` auf **`false`** setzen
- Kommentar ergänzen: bei Bedarf manuell auf `true` für Fresh-State-Tests
- **Kein** Verhalten in Production ändern (`__DEV__`-Gate bleibt)

## Design-Regeln

- Design Tokens aus `DESIGN_TOKENS.md`, Copy über `theme/copy/*`, keine Hardcoded-Farben
- Reanimated 3 falls Animation nötig; bestehende `CompletionView`-Struktur erweitern, nicht neu erfinden
- Focus + Playful Modus für alle neuen Copy-Keys

## Verifikation

```bash
npx tsc --noEmit
```

**Manuell testen (im Report dokumentieren):**
1. Frischer Guest: `pb-1` spielen → Pass → „Nächstes Kapitel“ → landet auf `pb-2`
2. Deep-Link `/lektion/pb-5` ohne Progress → Lock-Screen, kein Spielen
3. `pb-1` completed → Replay `pb-1` funktioniert
4. Dev-Restart: Progress bleibt erhalten (Guest)

## Commit & Push

```bash
git add app/lektion/[id].tsx lib/pathProgress.ts lib/devSession.ts theme/copy/de.ts theme/copy/en.ts theme/copy/fr.ts theme/copy/ru.ts
git commit -m "feat: close lesson progression loop with next-chapter CTA and lock guard"
git push -u origin feature/product-integration-sprint-01
```

## Report zurück an Director

Melde:
- Commit-Hash
- `tsc --noEmit` Ergebnis
- Screenshot-Beschreibung oder Schritt-für-Schritt der 4 Manual-Tests
- **Kein Merge nach develop** ohne Freigabe
