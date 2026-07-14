# Build-Cursor-Prompt: Sprint 4 — First-Run CTA (Product Integration)

## Kontext

Sprints 1–3 gemergt. Frischer Guest landet nach Onboarding auf Home mit `activePaths.length === 0` — nur Fließtext `paths.emptyActive`, kein klickbarer Einstieg. Tab „Lernpfade“ zeigt zwar verfügbare Pfade, aber der Aha-Moment soll ohne Umweg starten.

**develop tip:** `71f13a48618d853efffeaa18c26ec2a4faa616a9`

## Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-integration-sprint-04
```

## Auftrag (2 Tasks, ein Commit)

### Task 4a — Home: Empty-State mit Start-CTA

**Problem:** `app/(tabs)/index.tsx` zeigt bei `activePaths.length === 0` nur Text — kein Button, keine PathCard.

**Ziel:**
- Wenn **keine** active paths: statt nur Text eine **Card** (bestehende `Card`-Komponente) mit:
  - Titel: erster empfohlener Pfad (`prompt-basics` / Copy-Key `paths.title.prompt_basics`)
  - Kurzer Hinweis (neuer Copy-Key `home.startHint`)
  - Primary Button → `router.push('/lernpfad/prompt-basics')`
- Wenn active paths vorhanden: **unverändert** (bestehende PathCards)
- Konstante zentral: z. B. `DEFAULT_START_PATH_ID = 'prompt-basics'` in `lib/pathLessonUtils.ts` (oder neue kleine `lib/firstRun.ts`) — nicht hardcoded an 3 Stellen

**Copy-Keys (4 Locales, focus/playful):**
- `home.startHint` — z. B. DE focus: „Starte mit den Prompt-Grundlagen — dein erster Schritt zum strukturierten Prompting.“
- `home.startCta` — z. B. DE focus: „Ersten Pfad öffnen“, playful: „Los geht's!“

**Dateien:** `app/(tabs)/index.tsx`, `lib/pathLessonUtils.ts` (Konstante), `theme/copy/*.ts`

### Task 4b — Onboarding-Loop: Direkt in erste Lektion

**Problem:** `app/onboarding/loop.tsx` CTA → `router.replace('/')` — Nutzer muss Home → Tab finden → Pfad wählen.

**Ziel:**
- Primary CTA → `router.replace('/lektion/pb-1')` (erste Lektion des Default-Pfads)
- Nutze `getFirstLessonIdForPath(DEFAULT_START_PATH_ID)` statt hardcoded `'pb-1'` wenn möglich
- Optional Secondary (ghost): `router.replace('/')` mit Copy `onboarding.loopHomeCta` — nur wenn Layout sauber; sonst nur Primary ändern

**Copy-Keys (4 Locales):**
- `onboarding.loopCta` Text anpassen auf „Erste Lektion starten“ / EN „Start first lesson“ (bestehenden Key **wert** ändern, kein neuer Key nötig wenn sinnvoll)
- Falls Secondary: `onboarding.loopHomeCta`

**Dateien:** `app/onboarding/loop.tsx`, ggf. `theme/copy/*.ts`

## Design-Regeln

- Tokens aus `DESIGN_TOKENS.md`, bestehende `Card` + `Button` Patterns
- Keine neuen Pfad-Prerequisites in diesem Sprint (alle 5 Pfade bleiben startbar)

## Verifikation

```bash
npx tsc --noEmit
npm run verify:lessons
```

**Manuell (im Report):**
1. Frischer Guest nach Onboarding → Loop-CTA → landet auf `pb-1` (nicht Home)
2. Guest ohne Progress: Home zeigt Start-Card + Button → öffnet `prompt-basics` Pfad-Detail
3. Nach `pb-1` abgeschlossen: Home zeigt active PathCard (wie bisher)

## Commit & Push

```bash
git add app/(tabs)/index.tsx app/onboarding/loop.tsx lib/pathLessonUtils.ts theme/copy/de.ts theme/copy/en.ts theme/copy/fr.ts theme/copy/ru.ts
git commit -m "feat: add first-run start CTA on home and onboarding loop"
git push -u origin feature/product-integration-sprint-04
```

## Report zurück an Director

- Commit-Hash, `tsc`, `verify:lessons`
- 3 Manual-Tests
- **Kein Merge** ohne Freigabe
