# Build-Cursor-Prompt: Sprint 5 — Pfad-Freischaltung (Product Integration)

## Kontext

Sprints 1–4 + Expo-Go-Hotfixes sind gemergt. Der Guest-Lernloop funktioniert (Onboarding → pb-1 → Progression → Persistenz). **Alle 5 Pfade** sind im Tab „Lernpfade“ unter „Verfügbare Pfade“ frei tippbar — obwohl die Lernarchitektur sequenziell gedacht ist.

**develop tip:** `97377773ee4533aa41a29041d31424f6a520c2aa`

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-05
```

## Produktregel

**Lineare Unlock-Kette** — jeder Pfad schaltet genau den nächsten frei:

| Pfad | ID | Voraussetzung |
|------|-----|---------------|
| 1 | `prompt-basics` | *(keine — immer startbar)* |
| 2 | `structure-lab` | `prompt-basics` vollständig (pb-1…pb-45 completed) |
| 3 | `context-mastery` | `structure-lab` vollständig |
| 4 | `iteration-loops` | `context-mastery` vollständig |
| 5 | `eval-scoring` | `iteration-loops` vollständig |

**Vollständig** = `isPathFullyCompleted(pathId, record)` aus `lib/pathCompletion.ts` (nur `completedLessonIds`, nicht `failedLessonIds` allein).

Reihenfolge **nicht** neu erfinden — identisch zu `MOCK_PATHS` in `data/mockPaths.ts`.

---

## Auftrag (4 Tasks, ein Commit)

### Task 5a — Zentrale Unlock-Logik

**Neu:** `lib/pathUnlock.ts`

Exportiere mindestens:

```ts
/** Gleiche Reihenfolge wie MOCK_PATHS */
export const PATH_UNLOCK_ORDER: readonly string[];

export function getPrerequisitePathId(pathId: string): string | undefined;
// prompt-basics → undefined; structure-lab → prompt-basics; …

export function isPathUnlocked(
  pathId: string,
  pathProgress: Record<string, PathProgressRecord>,
): boolean;

export function getPathUnlockBlockReason(
  pathId: string,
  pathProgress: Record<string, PathProgressRecord>,
): { prerequisitePathId: string } | null;
// null = freigeschaltet; sonst welcher Pfad noch fehlt
```

**Implementierung:**
- `isPathUnlocked`: erster Pfad in `PATH_UNLOCK_ORDER` immer `true`; sonst `isPathFullyCompleted(prerequisite, pathProgress[prerequisite])`
- Keine React-Imports — reine Logik wie `lib/streak.ts` / `lib/pathCompletion.ts`
- Pfad-IDs aus `lib/pathLessonUtils` / `MOCK_PATHS` ableiten, nicht hardcoded duplizieren (z. B. `MOCK_PATHS.map(p => p.id)`)

**Optional (empfohlen):** Kleine Unit-Tests nur wenn bereits Test-Infrastruktur existiert — sonst weglassen.

---

### Task 5b — PathCard: Locked-Zustand

**Problem:** `PathCard` hat keinen gesperrten Zustand — alle „Verfügbaren“ Pfade wirken gleichwertig klickbar.

**Ziel in `components/features/PathCard.tsx`:**
- Neue optionale Props: `locked?: boolean`, `lockedHint?: string` (oder nur `locked`, Hint kommt vom Screen)
- Wenn `locked === true`:
  - `onPress` ignorieren / `disabled={true}` (kein Scale-Press-Feedback)
  - Lock-Icon (Lucide `Lock` — wie `ChapterRow`, **kein Emoji**)
  - Titel/Text mit `tokens.colors.text.tertiary` / reduzierter Opacity über Theme-Tokens
  - Optional kleines Badge „Gesperrt“ via bestehende `Badge`-Komponente (`tone="warning"` oder passend zu Tokens)
- Focus + Playful über Theme-Context — keine hardcoded Farben

**Nicht** PathCard duplizieren — bestehende Komponente erweitern.

---

### Task 5c — UI: Lernpfade-Tab + Pfad-Detail + Lektion

#### `app/(tabs)/lernpfade.tsx`

Aktuell: `availablePaths = mergedPaths.filter(path => path.progress === undefined)` — alle tippbar.

**Ziel:**
- Für jeden Pfad ohne Progress: `isPathUnlocked(path.id, pathProgress)` prüfen
- **Freigeschaltet + nicht gestartet** → bisherige „Verfügbare Pfade“-Sektion, `onPress` → `/lernpfad/{id}`
- **Gesperrt** → neue Sektion `paths.sectionLocked` (Copy-Key), PathCard mit `locked`, **kein** `onPress`
- `prompt-basics` bei frischem Guest: weiterhin unter „Verfügbar“ (nicht unter „Gesperrt“)
- Aktive Pfade (`progress !== undefined`): **unverändert** — auch wenn theoretisch unlocked; Progress impliziert bereits Zugang

#### `app/lernpfad/[id].tsx`

**Ziel:** Wenn Pfad existiert aber **nicht unlocked** (und nicht bereits Progress hat):
- Statt Kapitelliste: **Locked-Path-View** (Pattern wie `LockedLessonView` in `app/lektion/[id].tsx`)
- Zeigt: `paths.lockedTitle`, `paths.lockedBody` mit Interpolation `{{path}}` = Titel des Vorgänger-Pfads (`pathTitleKey(getPrerequisitePathId(...))`)
- Primary Button „Zurück“ → `router.back()` oder `router.replace('/(tabs)/lernpfade')`
- **Kein** Start-/Continue-CTA, keine ChapterRows

Edge case: Deep-Link `/lernpfad/structure-lab` ohne PB-Abschluss → Locked-View.

#### `app/lektion/[id].tsx`

**Ziel:** **Vor** `getLessonChapterStatus` / `isLessonPlayable`:
- `pathId = getPathIdForLesson(lessonId)`
- Wenn `pathId` und `!isPathUnlocked(pathId, pathProgress)` → **Path-Locked-View** (gleiche Copy wie Pfad-Detail, oder dedizierter Key `lesson.pathLockedBody`)
- Erst danach bestehender Lektions-Lock (pb-10 ohne Progress → C4)

Reihenfolge: **Pfad-Lock > Kapitel-Lock > Spielen**

---

### Task 5d — Copy-Keys (4 Locales)

In `theme/copy/de.ts`, `en.ts`, `fr.ts`, `ru.ts` — jeweils **focus + playful**:

| Key | Inhalt (DE focus, Richtung) |
|-----|-----------------------------|
| `paths.sectionLocked` | „Gesperrte Pfade“ |
| `paths.lockedBadge` | „Gesperrt“ |
| `paths.lockedTitle` | „Dieser Pfad ist noch gesperrt“ |
| `paths.lockedBody` | „Schließe zuerst „{{path}}“ ab, um diesen Pfad freizuschalten.“ |
| `paths.lockedCta` | „Zurück zu den Pfaden“ |

`{{path}}` = bereits übersetzter Pfad-Titel (Screen übergibt `t(pathTitleKey(prerequisiteId))`, nicht rohe ID).

Keys in `theme/copy/types.ts` ergänzen falls dort Typ-Union gepflegt wird.

---

## Design-Regeln

- `DESIGN_TOKENS.md`, `THEME_MODES.md`
- Lock-Icon: Lucide `Lock` (wie `ChapterRow`)
- Schatten über `getShadow`, keine Inline-Platform-Shadows
- Bestehende `Card`, `Button`, `Badge`, `PathCard` wiederverwenden

---

## Verifikation

```bash
npx tsc --noEmit
npm run verify:lessons
```

**Manuell (im Report dokumentieren):**

| # | Schritt | Erwartung |
|---|---------|-----------|
| 5.1 | Frischer Guest → Tab Lernpfade | Nur `prompt-basics` unter „Verfügbar“; Pfade 2–5 unter „Gesperrt“, nicht tippbar |
| 5.2 | Tap gesperrte PathCard | Keine Navigation |
| 5.3 | Deep-Link `/lernpfad/structure-lab` | Locked-View mit Hinweis auf Prompt-Grundlagen |
| 5.4 | Deep-Link `/lektion/sl-1` ohne PB-Abschluss | Path-Locked-View (nicht Lektions-UI) |
| 5.5 | Deep-Link `/lektion/pb-10` ohne Progress | Weiterhin **Kapitel**-Lock (C4 — unverändert) |
| 5.6 | Dev: alle pb-1…pb-45 completed simulieren | `structure-lab` wandert nach „Verfügbar“, tippbar |
| 5.7 | Home Start-CTA (kein Progress) | Weiterhin nur `prompt-basics` — kein Regression |

**Dev-Hilfe:** Profil/Dev-Reset oder gezielt Progress in Dev-Screen setzen — nicht neues Dev-Tool bauen, außer minimal nötig.

---

## Commit & Push

```bash
git add lib/pathUnlock.ts components/features/PathCard.tsx app/(tabs)/lernpfade.tsx app/lernpfad/[id].tsx app/lektion/[id].tsx theme/copy/de.ts theme/copy/en.ts theme/copy/fr.ts theme/copy/ru.ts theme/copy/types.ts
git commit -m "feat: gate learning paths behind linear path completion unlock chain"
git push -u origin feature/product-integration-sprint-05
```

---

## Report zurück an Director

- Commit-Hash
- `tsc --noEmit` + `npm run verify:lessons`
- Ergebnis der 7 Manual-Tests (5.1–5.7)
- Kurz: welche Screens PathCard `locked` nutzen
- **Kein Merge** ohne Freigabe
