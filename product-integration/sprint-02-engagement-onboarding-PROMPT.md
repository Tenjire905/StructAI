# Build-Cursor-Prompt: Sprint 2 — Streak, Onboarding-Loop, Guest-Name (Product Integration)

## Kontext

Sprint 1 ist gemergt: Lesson-Loop mit „Nächstes Kapitel“, Lock-Guard, Dev-Reset aus.

**develop tip:** `d6c86a382efb905ea3c34544df7395be8c4c7799`

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-02
```

## Auftrag (3 Tasks, ein Commit)

### Task 2a — Streak bei erster Lektion des Tages schreiben

**Problem:** `currentStreak` und `streakDays` werden in `completeLesson` unverändert durchgereicht (Zeile ~324). Home/Profil zeigen immer 0.

**Ziel:**
- Neue Datei `lib/streak.ts` mit reiner Logik (testbar, keine React-Imports):
  - `getStreakWeekdayIndex(date: Date): number` — Mo=0 … So=6 (passt zu `streakWeekdayCopyKeys` in `theme/copy/types.ts`)
  - `applyLessonCompletionStreak(snapshot, options: { now?: Date; isNewCompletion: boolean })` → `{ currentStreak, streakDays }`
- **Nur** bei `isNewCompletion === true` (kein Replay, kein erneutes Orbs-Award) Streak aktualisieren
- Logik-Vorschlag:
  - Heutigen Index in `streakDays` auf `true` setzen
  - Wenn heute bereits `true` war → Streak unverändert lassen
  - Wenn heute erstmals → `currentStreak`: wenn gestern auch aktiv war → `+1`, sonst `1`
  - „Gestern aktiv“ = Index `(todayIndex + 6) % 7` in `streakDays` (gleiche Kalenderwoche-Ansicht wie UI)
- In `store/progressStore.ts` → `completeLesson`: nach `wasAlreadyCompleted` prüfen, `applyLessonCompletionStreak` aufrufen, Werte ins Snapshot schreiben
- `StreakTracker` auf Home soll nach erster Lektion des Tages den heutigen Tag als completed zeigen; bei 7/7 triggert bestehendes `celebrate('streak_milestone')` weiterhin

**Dateien:** `lib/streak.ts` (neu), `store/progressStore.ts`

### Task 2b — Onboarding: Produkt-Loop erklären (1 Screen)

**Problem:** Onboarding endet nach Theme-Wahl — Nutzer versteht Pfad → Lektion → Orbs → Freischaltung nicht.

**Ziel:**
- Neuer Screen `app/onboarding/loop.tsx` (oder `how-it-works.tsx`)
- Flow anpassen: `app/onboarding/modus.tsx` → nach `setOnboardingCompleted()` **nicht** direkt `router.replace('/')`, sondern `router.push('/onboarding/loop')`
- Loop-Screen: kurze 3-Schritt-Erklärung (Pfad wählen → Lektion abschließen → nächstes Kapitel freischalten / Orbs sammeln)
- Primary CTA → `router.replace('/')` (oder optional `router.replace('/lernpfade')` — nur wenn sinnvoll im Routing)
- **Kein** BYOK, **kein** Login-Zwang auf diesem Screen
- Copy-Keys in allen 4 Locales (`theme/copy/de.ts`, `en.ts`, `fr.ts`, `ru.ts`):
  - `onboarding.loopTitle`
  - `onboarding.loopStep1` … `onboarding.loopStep3`
  - `onboarding.loopCta`
  - focus + playful, sprachlich unterschiedlich

**Design:** Bestehende Onboarding-Patterns (Spacing/Typo aus Tokens), keine neuen Farben.

### Task 2c — Home: Guest-Name statt MOCK_USER

**Problem:** `app/(tabs)/index.tsx` nutzt hardcoded `MOCK_USER = { name: 'Alex', ... }`.

**Ziel:**
- Pattern von `app/(tabs)/profil.tsx` übernehmen:
  - `useAuth()` für `session` / `user`
  - `displayName = session ? resolveProfileDisplayName(user) : t('profile.guestDisplayName')`
  - Avatar `initialsName`: displayName (oder `profile.guestDisplayName` für Guest)
- `MOCK_USER` Konstante entfernen
- `lib/profileDisplayName.ts` unverändert lassen (Fallback für Auth bleibt)

**Dateien:** `app/(tabs)/index.tsx`

## Design-Regeln

- `DESIGN_TOKENS.md`, `THEME_MODES.md`, Reanimated 3 falls Animation
- Keine Emoji-Icons — Lucide/OrbIcon wie bestehend

## Verifikation

```bash
npx tsc --noEmit
```

**Manuell (im Report dokumentieren):**
1. Guest: erste Lektion heute abschließen → `currentStreak` ≥ 1, heutiger Streak-Tag aktiv
2. Replay derselben Lektion → Streak ändert sich nicht
3. Frisches Onboarding → Welcome → Modus → **Loop-Screen** → Home
4. Home als Guest zeigt `profile.guestDisplayName`, nicht „Alex“

## Commit & Push

```bash
git add lib/streak.ts store/progressStore.ts app/onboarding/modus.tsx app/onboarding/loop.tsx app/(tabs)/index.tsx theme/copy/de.ts theme/copy/en.ts theme/copy/fr.ts theme/copy/ru.ts
git commit -m "feat: wire streak on lesson completion, onboarding loop screen, guest home name"
git push -u origin feature/product-integration-sprint-02
```

## Report zurück an Director

- Commit-Hash
- `tsc --noEmit`
- Ergebnis der 4 Manual-Tests
- **Kein Merge** ohne Freigabe
