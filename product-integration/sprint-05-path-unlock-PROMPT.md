# Build-Cursor-Prompt: Sprint 5 — Pfad-Freischaltung (Product Integration)

## Kontext

Sprints 1–4 + Expo-Go-Hotfixes sind gemergt. Der Guest-Lernloop funktioniert end-to-end:

- Onboarding Welcome → Modus → Loop → **pb-1**
- Lektions-Progression, Orbs, „Weiter zur nächsten Lektion“
- Persistenz (AsyncStorage 2.2.0 in Expo Go)
- Home Start-Card bei leerem Progress

**Offenes Problem:** Im Tab **Lernpfade** sind alle 5 Pfade unter „Verfügbare Pfade“ frei tippbar. Nutzer können `structure-lab`, `context-mastery` usw. öffnen, obwohl die Produktlogik eine **lineare Kette** vorsieht.

**develop tip:** `97377773ee4533aa41a29041d31424f6a520c2aa`

---

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-05
```

Cloud Agent alternativ: `cursor/path-unlock-sprint-05-fd20`

---

## Produktregel (verbindlich)

**Lineare Unlock-Kette** — jeder Pfad schaltet genau **einen** nächsten Pfad frei:

| # | Pfad-ID | Kapitel | Prefix | Voraussetzung |
|---|---------|---------|--------|---------------|
| 1 | `prompt-basics` | 45 | `pb` | *(keine — immer startbar)* |
| 2 | `structure-lab` | 35 | `sl` | `prompt-basics` **vollständig** (pb-1…pb-45 in `completedLessonIds`) |
| 3 | `context-mastery` | 35 | `cm` | `structure-lab` vollständig |
| 4 | `iteration-loops` | 35 | `il` | `context-mastery` vollständig |
| 5 | `eval-scoring` | 35 | `es` | `iteration-loops` vollständig |

**Vollständig** = `isPathFullyCompleted(pathId, record)` aus `lib/pathCompletion.ts`:

- Jede Lektion des Templates muss in `completedLessonIds` stehen
- `failedLessonIds` allein reichen **nicht**
- Bereits vorhanden: `getRequiredLessonIdsForPath`, `detectNewlyCompletedPathId`

Reihenfolge = `MOCK_PATHS` in `data/mockPaths.ts` — **nicht** neu sortieren.

---

## Betroffene Ist-Dateien (Referenz)

| Datei | Aktuelles Verhalten |
|-------|---------------------|
| `app/(tabs)/lernpfade.tsx` | `availablePaths = mergedPaths.filter(p => p.progress === undefined)` — alle tippbar |
| `app/lernpfad/[id].tsx` | Zeigt immer Kapitelliste + Start/Continue, kein Pfad-Lock |
| `app/lektion/[id].tsx` | Nur Kapitel-Lock via `getLessonChapterStatus` / `isLessonPlayable` |
| `components/features/PathCard.tsx` | Kein `locked`-Zustand |
| `lib/pathCompletion.ts` | `isPathFullyCompleted` — **wiederverwenden**, nicht duplizieren |

---

## Layout-Skizzen

### Lernpfade-Tab (frischer Guest)

```
┌─────────────────────────────────────┐
│ In Bearbeitung                      │
│ (leer — paths.emptyActive Text)     │
├─────────────────────────────────────┤
│ Verfügbare Lernpfade                │
│ ┌ PathCard: Prompt-Grundlagen ───┐ │  ← tippbar
│ │ 45 Kapitel                      │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Gesperrte Pfade                     │  ← NEU: paths.sectionLocked
│ ┌ PathCard [Gesperrt] 🔒 ─────────┐ │  ← disabled, kein onPress
│ │ Strukturlabor                   │ │
│ └─────────────────────────────────┘ │
│ … (3 weitere gesperrte Pfade)       │
└─────────────────────────────────────┘
```

### Pfad-Detail / Lektion — Path-Locked-View

```
┌─────────────────────────────────────┐
│                                     │
│     Dieser Pfad ist noch gesperrt   │  paths.lockedTitle
│                                     │
│  Schließe zuerst „Prompt-Grundlagen"│  paths.lockedBody + {{path}}
│  ab, um diesen Pfad freizuschalten. │
│                                     │
│  [ Zurück zu den Pfaden ]           │  paths.lockedCta
│                                     │
└─────────────────────────────────────┘
```

Pattern = `LockedLessonView` in `app/lektion/[id].tsx` (Zeilen ~842–884).

---

## Auftrag (4 Tasks, ein Commit)

### Task 5a — Zentrale Unlock-Logik

**Neu:** `lib/pathUnlock.ts`

Referenz-Implementierung (anpassen falls nötig, Logik beibehalten):

```ts
import { MOCK_PATHS } from '@/data/mockPaths';
import { isPathFullyCompleted } from '@/lib/pathCompletion';
import type { PathProgressRecord } from '@/store/progressStore';

/** Gleiche Reihenfolge wie MOCK_PATHS */
export const PATH_UNLOCK_ORDER: readonly string[] = MOCK_PATHS.map((path) => path.id);

export function getPrerequisitePathId(pathId: string): string | undefined {
  const index = PATH_UNLOCK_ORDER.indexOf(pathId);
  if (index <= 0) {
    return undefined;
  }
  return PATH_UNLOCK_ORDER[index - 1];
}

export function isPathUnlocked(
  pathId: string,
  pathProgress: Record<string, PathProgressRecord>,
): boolean {
  const prerequisiteId = getPrerequisitePathId(pathId);
  if (!prerequisiteId) {
    return true;
  }
  return isPathFullyCompleted(prerequisiteId, pathProgress[prerequisiteId]);
}

export function getPathUnlockBlockReason(
  pathId: string,
  pathProgress: Record<string, PathProgressRecord>,
): { prerequisitePathId: string } | null {
  if (isPathUnlocked(pathId, pathProgress)) {
    return null;
  }
  const prerequisitePathId = getPrerequisitePathId(pathId);
  if (!prerequisitePathId) {
    return null;
  }
  return { prerequisitePathId };
}
```

**Regeln:**
- Keine React-Imports
- Keine hardcoded Pfad-ID-Listen außer via `MOCK_PATHS`
- Export aus `lib/` — kein Import aus Screens in pathUnlock

---

### Task 5b — PathCard: Locked-Zustand

**Datei:** `components/features/PathCard.tsx`

**Neue Props:**

```ts
type PathCardProps = {
  // … bestehend …
  locked?: boolean;
};
```

**Verhalten wenn `locked === true`:**

1. `onPress` nicht übergeben (Parent-Entscheidung) **oder** intern `disabled={true}`
2. `handlePressIn` / `handlePressOut` nur wenn `onPress && !locked`
3. Lock-Icon rechts neben Titel: `import { Lock } from 'lucide-react-native'` — wie `ChapterRow`
4. Titel-Farbe: `tokens.colors.text.tertiary` statt `text.primary`
5. Untertitel-Farbe: ebenfalls tertiary
6. Badge: `badgeLabel={t('paths.lockedBadge')}`, `badgeTone="warning"` (wenn locked und kein anderes Badge)
7. Kein ProgressBar (locked Pfade sind nie „started“ in UI)
8. `accessibilityRole` undefined wenn locked (nicht als Button markieren)
9. Optional: `opacity` über Theme — **kein** hardcoded `#999`

**Beispiel-Aufruf (lernpfade.tsx):**

```tsx
<PathCard
  badgeLabel={t('paths.lockedBadge')}
  badgeTone="warning"
  locked
  title={t(pathTitleKey(path.id))}
  totalChapters={path.totalChapters}
/>
```

---

### Task 5c — UI-Anpassungen

#### 5c-1 — Shared Component (empfohlen)

**Neu:** `components/features/LockedPathView.tsx`

Extrahiere das Layout aus `LockedLessonView` + Path-Lock-Inhalt:

```tsx
type LockedPathViewProps = {
  prerequisitePathTitle: string;
  onBack: () => void;
};
```

- `paths.lockedTitle` als Headline
- `t('paths.lockedBody', { path: prerequisitePathTitle })` als Body
- Button `paths.lockedCta` → `onBack`
- Tokens wie `LockedLessonView`

Export in `components/features/index.ts`.

#### 5c-2 — `app/(tabs)/lernpfade.tsx`

Ersetze die einfache `availablePaths`-Filterlogik:

```ts
const notStartedPaths = mergedPaths.filter((path) => path.progress === undefined);

const unlockedAvailablePaths = notStartedPaths.filter((path) =>
  isPathUnlocked(path.id, pathProgress),
);

const lockedPaths = notStartedPaths.filter(
  (path) => !isPathUnlocked(path.id, pathProgress),
);
```

- Sektion „Verfügbare Lernpfade“: nur `unlockedAvailablePaths` mit `onPress`
- **Neue** Sektion `paths.sectionLocked`: `lockedPaths` mit `locked` PathCard, **ohne** `onPress`
- `activePaths` (progress !== undefined): **unverändert**

**B3-Regression beachten:** Frischer Guest sieht 1 verfügbar + 4 gesperrt (nicht mehr „5 tippbar“).

#### 5c-3 — `app/lernpfad/[id].tsx`

Nach `getMergedPath`, vor dem normalen ScrollView:

```ts
const hasStarted = path.currentChapter !== undefined && path.progress !== undefined;
const blockReason = getPathUnlockBlockReason(pathId, pathProgress);

if (!hasStarted && blockReason) {
  const prerequisiteTitle = t(pathTitleKey(blockReason.prerequisitePathId));
  return (
    <>
      <Stack.Screen options={headerOptions} />
      <LockedPathView
        onBack={() => router.replace('/(tabs)/lernpfade')}
        prerequisitePathTitle={prerequisiteTitle}
      />
    </>
  );
}
```

#### 5c-4 — `app/lektion/[id].tsx`

In `LessonSessionScreen`, **vor** dem Check `if (!canPlayLesson)`:

```ts
const pathBlockReason = pathId
  ? getPathUnlockBlockReason(pathId, pathProgress)
  : null;

if (pathBlockReason) {
  const prerequisiteTitle = t(pathTitleKey(pathBlockReason.prerequisitePathId));
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: … }} />
      <LockedPathView
        onBack={goBackToPath}
        prerequisitePathTitle={prerequisiteTitle}
      />
    </>
  );
}
```

**Reihenfolge der Guards:**

1. Pfad existiert / Lektion existiert
2. **Pfad unlocked** (Sprint 5)
3. Kapitel playable (Sprint 1 / C4)
4. Aktive Session

**C4 bleibt:** `/lektion/pb-10` ohne pb-1…9 → **Kapitel**-Lock (`lesson.lockedTitle`), nicht Path-Lock.

---

### Task 5d — Copy-Keys (4 Locales, vollständig eintragen)

In `theme/copy/de.ts`, `en.ts`, `fr.ts`, `ru.ts` — jeweils **focus + playful**.

#### Deutsch (`de.ts`)

```ts
  'paths.sectionLocked': {
    playful: 'Noch verschlossen',
    focus: 'Gesperrte Pfade',
  },
  'paths.lockedBadge': {
    playful: 'Verschlossen',
    focus: 'Gesperrt',
  },
  'paths.lockedTitle': {
    playful: 'Dieser Pfad ist noch zu',
    focus: 'Pfad gesperrt',
  },
  'paths.lockedBody': {
    playful: 'Erst „{{path}}" abschließen — dann geht's hier weiter!',
    focus: 'Schließe zuerst „{{path}}" ab, um diesen Pfad freizuschalten.',
  },
  'paths.lockedCta': {
    playful: 'Zurück zu den Pfaden',
    focus: 'Zurück zu den Pfaden',
  },
```

#### Englisch (`en.ts`)

```ts
  'paths.sectionLocked': {
    playful: 'Still locked',
    focus: 'Locked paths',
  },
  'paths.lockedBadge': {
    playful: 'Locked',
    focus: 'Locked',
  },
  'paths.lockedTitle': {
    playful: 'This path is still locked',
    focus: 'Path locked',
  },
  'paths.lockedBody': {
    playful: 'Finish "{{path}}" first — then you can continue here!',
    focus: 'Complete "{{path}}" first to unlock this learning path.',
  },
  'paths.lockedCta': {
    playful: 'Back to paths',
    focus: 'Back to paths',
  },
```

#### Französisch (`fr.ts`)

```ts
  'paths.sectionLocked': {
    playful: 'Encore verrouillés',
    focus: 'Parcours verrouillés',
  },
  'paths.lockedBadge': {
    playful: 'Verrouillé',
    focus: 'Verrouillé',
  },
  'paths.lockedTitle': {
    playful: 'Ce parcours est encore fermé',
    focus: 'Parcours verrouillé',
  },
  'paths.lockedBody': {
    playful: 'Termine d'abord « {{path}} » — ensuite tu pourras continuer ici !',
    focus: 'Terminez d'abord « {{path}} » pour débloquer ce parcours.',
  },
  'paths.lockedCta': {
    playful: 'Retour aux parcours',
    focus: 'Retour aux parcours',
  },
```

#### Russisch (`ru.ts`)

```ts
  'paths.sectionLocked': {
    playful: 'Пока закрыто',
    focus: 'Закрытые пути',
  },
  'paths.lockedBadge': {
    playful: 'Закрыто',
    focus: 'Закрыто',
  },
  'paths.lockedTitle': {
    playful: 'Этот путь пока закрыт',
    focus: 'Путь закрыт',
  },
  'paths.lockedBody': {
    playful: 'Сначала заверши «{{path}}» — потом откроется этот путь!',
    focus: 'Сначала завершите «{{path}}», чтобы открыть этот путь обучения.',
  },
  'paths.lockedCta': {
    playful: 'К списку путей',
    focus: 'К списку путей',
  },
```

**Interpolation:** `t('paths.lockedBody', { path: prerequisiteTitle })` — Titel ist bereits lokalisiert via `pathTitleKey`.

---

## Design-Regeln

- `DESIGN_TOKENS.md`, `THEME_MODES.md`
- Lock-Icon: Lucide `Lock` (wie `ChapterRow`) — **keine Emoji**
- Schatten: `getShadow()` — nie plattformspezifisch inline
- Focus + Playful: Werte aus Theme-Context
- Bestehende Komponenten erweitern, nicht duplizieren

---

## Verifikation

```bash
npx tsc --noEmit
npm run verify:lessons
```

### Manuelle Tests (im Report alle 7 dokumentieren)

| # | Schritt | Erwartung |
|---|---------|-----------|
| 5.1 | Frischer Guest → Tab Lernpfade | 1× „Verfügbar“ (`prompt-basics`), 4× „Gesperrt" |
| 5.2 | Tap gesperrte PathCard | Keine Navigation, kein Scale-Feedback |
| 5.3 | URL `/lernpfad/structure-lab` | LockedPathView, Hinweis auf Prompt-Grundlagen |
| 5.4 | URL `/lektion/sl-1` ohne PB-Abschluss | LockedPathView (nicht Lektions-UI) |
| 5.5 | URL `/lektion/pb-10` ohne Progress | **Kapitel**-Lock (`lesson.lockedTitle`) — C4 |
| 5.6 | Dev: pb-1…pb-45 completed | `structure-lab` → „Verfügbar", tippbar |
| 5.7 | Home Start-CTA (kein Progress) | Öffnet weiterhin `prompt-basics` |

**Dev-Hilfe pb-45 simulieren:** Bestehenden Dev-Reset / Progress-Store — kein neues Dev-Tool unless zwingend.

---

## Commit & Push

```bash
git add lib/pathUnlock.ts components/features/PathCard.tsx components/features/LockedPathView.tsx components/features/index.ts app/(tabs)/lernpfade.tsx app/lernpfad/[id].tsx app/lektion/[id].tsx theme/copy/de.ts theme/copy/en.ts theme/copy/fr.ts theme/copy/ru.ts
git commit -m "feat: gate learning paths behind linear path completion unlock chain"
git push -u origin feature/product-integration-sprint-05
```

---

## Report zurück an Director

Melde:

1. Commit-Hash
2. `npx tsc --noEmit` — grün/rot
3. Vollständige `npm run verify:lessons` Ausgabe
4. Tabelle 5.1–5.7 mit Pass/Fail
5. Kurz: wurde `LockedPathView` extrahiert? Welche Screens nutzen `PathCard locked`?
6. **Kein Merge nach develop ohne Freigabe**
