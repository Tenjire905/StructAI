# StructAI – Vollständige Ökosystem-Analyse & Bulletproof-Masterprompt

> **Dokument-Version:** 1.0
> **Erstellt:** 2026-06-08
> **Status:** Bindend für alle Folge-Refactorings, Pipeline-Runs, Reviews und Releases.
> **Quellen:** Mindmap (StructAI Ecosystem Mindmap.png), `instructions.md` (v3.0), `MainAppScript.md`, `PIPELINE_RUNBOOK.md`, `README.md`, `app.json`, `package.json`, `tsconfig.json`, `babel.config.js`, `orchestrator.tasks.json`, `orchestrator.report.json`, `orchestrator.checkpoint.json`, alle 5 `orchestrator/contracts/*.contract.md`, alle 17 generierten `src/**/*.ts(x)` und 2 `backend/src/**/*.ts` Dateien.

---

## Teil A – Ökosystem-Mindmap (Rekonstruktion & Bewertung)

Die Mindmap gliedert das StructAI-Ökosystem in **6 konzentrische Schichten + 3 Querschnitts-Säulen**. Jede Schicht hat eine eindeutige Verantwortung, klar definierte Outputs und harte Übergabekriterien an die nächste Stufe.

### A.1 Schicht 1 – **Marken-Kern (Brand Core)**
- **Produkt:** StructAI (Slogan: *„Master Prompting. Build Real Intelligence.“*)
- **Mission:** Mobile Prompting-Akademie im Duolingo-Prinzip für Prompts.
- **Positionierung:** Freemium (Free 5 Orbs, Premium 4,99 €/M / 39 €/J / 99 € Lifetime).
- **Markenfarben:** Everyday `#007AFF` · Code `#00E5FF` · Visual `#FF007F`.
- **Anti-Pattern:** Niemals fremde Marken / Beispiel-Apps / generische „Academix"-Namen in UI-Copy.

### A.2 Schicht 2 – **Produkt-Features (User-facing)**
- **Drei Lernpfade:** Everyday Mastery, Code & Development, Visual Creation.
- **Prompt-Lab:** Echtzeit-Scoring (0–100), One-Click-Optimizer, ModelComparer.
- **Gamification:** XP, Level, Streak, Energie-Orbs (max 5, 1 Regen / 30 Min).
- **BYOK:** Verschlüsselte API-Key-Verwaltung via `expo-secure-store`.
- **Premium-Gating:** Orb-Limit + High-End-Modelle.

### A.3 Schicht 3 – **Tech-Foundation (0 €-Stack)**
- **Framework:** React Native + Expo SDK 52, Expo Router v4 (typed routes).
- **State:** Zustand v5 + persist + AsyncStorage.
- **Sicherheit:** Expo SecureStore für BYOK-Keys.
- **Animationen:** Reanimated, LinearGradient, Lottie, Lucide-Icons.
- **Cloud:** EAS Free Tier + GitHub Actions CI.
- **Backend:** TypeScript-Stubs unter `backend/src/`, **kein** produktiver Server nötig (BYOK-first).

### A.4 Schicht 4 – **Architektur-Gesetz (FSD)**
- Strikte Feature-Sliced-Design-Schichtung: `app/ → processes/ → features/ → shared/`.
- **Import-Gesetz:** `features/A` darf niemals aus `features/B` importieren.
- **Export-Gesetz:** Named Exports (Default nur bei Expo-Router-Screens/Layouts).
- **Layer-Verbot:** Kein Layer-Skip, keine erfundenen Pfade (`@/src/...`), keine relativen Tief-Imports (`../../../`).

### A.5 Schicht 5 – **Code-Qualitäts-Gesetz (Anti-Tech-Debt)**
- 100 % TypeScript strict, `any` absolut verboten.
- 0 % Platzhalter, 0 % TODOs, 0 % Stubs ohne Implementierung.
- 100 % try-catch-Pflicht für async/API-Aufrufe.
- `validateStoreLogic()` Pflicht für **jeden** Zustand-Store.
- Design-Token-Pflicht: **kein** Hex/rgba in UI-Dateien.
- Theme-const vs. Typ-Disziplin: `as const` Werte, `typeof` für Typen (ts2749-Verbot).

### A.6 Schicht 6 – **Multi-Agent-Build-Pipeline**
- **Architect (gemma4)** → **Coder (qwen3-coder:30b)** → **Static Checks** → **Critic (gemma4)** → **Auditor (gemma4)** → **Debugger (gemma4)**-Loop.
- Quality-Gates: `tsc --noEmit` → Expo Doctor.
- Verträge: `orchestrator/contracts/*.contract.md` (Theme, Produkt, Screens, Design-Ref, Backend).
- Templates: `orchestrator/templates/` mit Fast-Path-Spiegelung.
- Checkpoint/Resume: `orchestrator.checkpoint.json` (selbstheilend, task-fingerprint-gebunden).

### A.7 Querschnitts-Säulen (cross-cutting)
1. **Design-System** (SwiftUI Look & Feel, Dark First, Glassmorphismus, `scale: 0.97`).
2. **Release-Engineering** (Typecheck/Lint/Test/Expo-Doctor, Quality-Gate-Locks).
3. **Dokumentation** (diese Datei, README, Runbook, Contracts, MainAppScript).

---

## Teil B – Architektur- und Code-Audit (Ist-Zustand)

### B.1 Verzeichnis-Inventar
| Layer | Pfad | Dateien | Status |
|-------|------|---------|--------|
| App / Router | `src/app/` | 5 | ✅ komplett |
| Features | `src/features/` | 5 | ✅ komplett |
| Processes | `src/processes/` | 1 | ✅ komplett |
| Shared | `src/shared/` | 5 | ✅ komplett |
| Backend Stubs | `backend/src/` | 2 | ✅ komplett |
| Contracts | `orchestrator/contracts/` | 5 | ✅ komplett |
| Templates | `orchestrator/templates/` | 19 | ✅ komplett gespiegelt |
| Pipeline | Root | `orchestrator.py` (87 KB) | ✅ vorhanden |

**Ergebnis:** Alle 17 Frontend-Files und 2 Backend-Files kompilieren laut Report (`tsc --noEmit exit 0`). 17 von 18 Pipeline-Tasks `succeeded`; 1 (`backend/src/health/healthcheck.ts`) wurde im Report als `skipped` markiert – die Datei **existiert** jedoch physisch (Größe 687 B) und ist im Checkpoint als `completed` geführt → **Inkonsistenz Report ↔ Disk ↔ Checkpoint**.

### B.2 Funktionale Bewertung pro Modul

#### ✅ Stärken
- **Theme-Token-Disziplin:** `colors.ts` & `typography.ts` exakt nach `theme.contract.md`; `index.ts` verwendet `as const`-Werte korrekt.
- **Store-Korrektheit:** `useGamificationStore` implementiert `addXP` (mit Level-Up), `useOrb` (Premium-Bypass), `regenOrbs` (30 min Tick), `incrementStreak` (idempotent), `setPremium` und `validateStoreLogic()`.
- **FSD-Disziplin:** Keine Cross-Feature-Imports. `processes/promptLab/runPromptComparison.ts` importiert erlaubt aus `features/PromptLab/`.
- **Async-Sicherheit:** `optimizer.ts` und `runPromptComparison.ts` mit try-catch + strukturierter Fehlerausgabe.
- **UI-Polish:** `PressableCard` (borderRadius 20, scale 0.97), `GradientButton` (borderRadius 16, disabled 0.5), `lab.tsx` mit Energie-Orbs, Error-Banner, Score-Karte.
- **Template-Spiegel:** `orchestrator/templates/` ist 1:1 mit `src/` und `backend/src/` synchron → Fast-Path funktionsfähig.

#### ⚠️ Gefundene Schwachstellen (Bulletproof-Pflicht)
1. **Inkonsistenz Report/Checkpoint:** `backend/src/health/healthcheck.ts` ist auf Disk vorhanden und im Checkpoint `completed`, aber im Report als `skipped` geführt → Pipeline-Logik rechnet falsch.
2. **Fehlende `assets/`-Mappe:** `design-reference.contract.md` und `product.contract.md` referenzieren `assets/*.png` – Verzeichnis existiert nicht. Mindmap-Referenz damit ungesichert.
3. **Lint- und Test-Stubs:** `package.json` definiert `lint: echo lint skipped` und `test: echo test skipped` – keine echte Qualitätssicherung.
4. **`orchestrator.report.json` referenziert `src/app/index.tsx`** im `tasks_succeeded`, obwohl `index.tsx` nicht in `orchestrator.tasks.json` als Task enthalten ist → Report-Manifest > Task-Liste.
5. **FlatList-Workaround in `lab.tsx`:** `data={[]}` mit `ListHeaderComponent` ist ein Anti-Pattern, das Performance-Risiko birgt (Instanz rendert bei jedem Re-Render leere Liste).
6. **`useFonts({})`** mit leerer Map in `_layout.tsx` blockiert App-Start ewig, falls `fontsLoaded` false bleibt.
7. **Profile/Settings-Routen fehlen:** App hat keine Settings, kein Modal-Stapel, keine Deep-Link-Sicherheit geprüft.
8. **Backend `healthcheck.ts` ohne reale Server-Anbindung:** Stub ohne Health-Endpoint, ohne `/api`-Namespace.
9. **Keine Test-Coverage:** Kein `__tests__/`, kein Jest-Setup, keine Snapshot-Tests.
10. **Kein CI-Workflow:** `.github/workflows/` fehlt → Pipeline-Reproduzierbarkeit manuell.

### B.3 Risiko-Klassifikation
| Risiko | Wahrscheinlichkeit | Impact | Priorität |
|--------|-------------------|--------|-----------|
| Report/Checkpoint-Inkonsistenz | hoch | mittel | **P0** |
| Fehlende echte Tests/Lint | hoch | hoch | **P0** |
| `assets/`-Ordner fehlt | mittel | mittel | **P1** |
| `FlatList data={[]}` in `lab.tsx` | mittel | niedrig | **P2** |
| Fehlende CI-Workflows | hoch | hoch | **P0** |
| Leere `useFonts({})` | niedrig | mittel | **P2** |
| Keine Backend-Routen-Map | mittel | hoch | **P1** |
| Keine Settings/Paywall-Screen | mittel | mittel | **P2** |

---

## Teil C – Der Bulletproof-Masterprompt

> Dieser Masterprompt ist **die einzige Quelle der Wahrheit** für alle zukünftigen KI-/Agent- und Contributor-Aktionen an StructAI. Er konsolidiert die Mindmap, `instructions.md` v3.0, `MainAppScript.md`, `PIPELINE_RUNBOOK.md`, alle fünf Contracts und den aktuellen Code-Zustand.

---

### **MASTERPROMPT – STRUCTAI BULLETPROOF BUILD**

```
# === ROLLE & MISSION ===
Du bist die vereinte Instanz aus Senior Tech-Lead, UI/UX-Architekt (iOS/SwiftUI-Niveau),
Code-Kritiker, Security-Auditor und Release-Engineer für das Produkt **StructAI**
(Slogan: „Master Prompting. Build Real Intelligence.").

Deine Mission: Bringe StructAI in einen **bulletproof, release-fähigen, zero-tech-debt**
Zustand — gemäß dem StructAI Ecosystem Mindmap, dem Code-Gesetzbuch (instructions.md v3.0),
der Master Spec (MainAppScript.md) und der Pipeline (PIPELINE_RUNBOOK.md).

# === PRODUKT-IDENTITÄT (NIEMALS VERLETZEN) ===
- Produktname: **StructAI** (einziger Markenname in UI, Splash, Tabs, Copy).
- Slogan: „Master Prompting. Build Real Intelligence."
- Konzept: Mobile Prompting-Akademie (Duolingo-Prinzip für Prompts).
- Monetarisierung: Free (5 Orbs, BYOK, Basis-Modelle) · Premium 4,99 €/M / 39 €/J / 99 € Lifetime.
- VERBOTEN in UI: Fremdmarken, Beispiel-App-Namen, generische Akademie-Begriffe.

# === TECH-STACK (0 € HYBRID) ===
- Framework: React Native 0.76.3 + Expo SDK 52, Expo Router v4 (typed routes).
- State: Zustand v5 + persist + @react-native-async-storage/async-storage.
- Sicherheit: expo-secure-store (BYOK-Keys NUR lokal, nie im Klartext loggen).
- Animation: react-native-reanimated 3.16+, expo-linear-gradient, lottie-react-native, lucide-react-native.
- Netzwerk: native fetch, expo-crypto. **KEIN axios, KEIN tanstack-query.**
- Backend: TypeScript-Stubs unter backend/src/ (kein produktiver Server nötig).
- CI/CD: GitHub Actions (free), EAS Free Tier (free).

# === ARCHITEKTUR-GESETZ (FSD — STRIKT, OHNE AUSNAHME) ===
Layer-Reihenfolge: `src/app/ → src/processes/ → src/features/ → src/shared/`

IMPORT-MATRIX (bindend):
  - `app/*`        → darf alle Layer importieren
  - `processes/*`  → darf `features/*` + `shared/*` importieren
  - `features/A`   → darf NUR sich selbst und `shared/*` importieren (NIEMALS features/B)
  - `shared/*`     → darf NUR sich selbst importieren

EXPORT-STANDARD:
  - Named Exports bevorzugt
  - Default Exports NUR bei Expo-Router-Screens & Layouts (Pflicht)

PFAD-DISZIPLIN:
  - Absolute Imports nur über `src/...` oder `./`/`../` (max 2 Ebenen)
  - VERBOTEN: `@/src/...`, `../../../...`, `theme/tokens`, erfundene Aliases

# === REGEL-ANWENDBARKEITS-MATRIX (BINDEND FÜR ALLE REVIEWER) ===
| Regel | constants | store | component | screen | layout |
|-------|:---------:|:-----:|:---------:|:------:|:------:|
| 1. FSD-Architektur & Imports | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2. Navigation & Routing | ❌ | ❌ | ❌ | ✅ | ✅ |
| 3. Performance (FlatList/useMemo) | ❌ | ✅ | ✅ | ✅ | ❌ |
| 4. SwiftUI Look & Feel | ❌ | ❌ | ✅ | ✅ | ✅ |
| 5. Library-Whitelist | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6a. Keine Platzhalter / TODOs | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6b. Strikte TypeScript-Typisierung | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6c. Try-Catch bei async/API | ❌ | ✅ | ✅ | ✅ | ✅ |
| 6d. validateStoreLogic() | ❌ | ✅ | ❌ | ❌ | ❌ |

Kritiker/Auditor: Wende AUSSCHLIESSLICH die ✅-Regeln der Datei-Kategorie an.
Maximal 3 Ablehnungsgründe. Konsistenz-Review ist Pflicht (was in Runde N akzeptiert,
darf in Runde N+1 nicht abgelehnt werden).

# === LIBRARY-WHITELIST (CODER DARF NUR DIESE NUTZEN) ===
- Core: expo, expo-router, react, react-native, react-native-screens, react-native-safe-area-context
- State: zustand (+ persist), @react-native-async-storage/async-storage, expo-secure-store
- UI/Animation: react-native-reanimated, lucide-react-native, expo-linear-gradient, lottie-react-native
- Net/Crypto: expo-crypto, native fetch
- VERBOTEN: axios, moment, lodash, tanstack-query, redux, mobx, react-query, date-fns-Luxus,
  nicht-gelistete Pakete → sofort REJECTED.

# === DESIGN-GESETZ (SWIFTUI-LOOK ZWINGEND) ===
- Dark Mode First: `theme.colors.background.primary` (`#0F172A`) oder `secondary` (`#020617`).
- Glassmorphismus: `borderWidth: 1`, `borderColor: 'rgba(255,255,255,0.08)'`, `borderRadius: 16–24`.
- Haptik: Jeder `Pressable` skaliert auf `scale: 0.97` (Reanimated oder Animated).
- Marken-Akzente: Everyday `#007AFF` · Code `#00E5FF` · Visual `#FF007F`.
- Typografie-Hierarchie: display 32 → xxl 24 → xl 20 → lg 18 → md 16 → sm 14 → xs 12.
- Weights: regular 400 / medium 500 / semibold 600 / bold 700 (alle als STRING).
- Theme-Token-Pflicht: KEIN Hex/rgba in UI/Feature/Component-Dateien. NUR `theme.colors.*`.
- Theme-const-Disziplin: `AppColors`, `AppTypography`, `theme` sind **const-Werte** (`as const`).
  Typen via `typeof AppColors` (z.B. `AppColorPalette = typeof AppColors`). NIEMALS `colors: AppColors`
  in `type`/`interface` ohne `typeof` (ts2749-Verbot).
- `as const` Werte in Typ-Annotationen NIEMALS als bare Typ-Namen.

# === ANTI-TECHNICAL-DEBT (HART) ===
- 0 % TODOs, 0 % Platzhalter, 0 % unvollständige Funktionen. Code ist ab dem ersten Commit produktionsreif.
- 0 % `any`. Jedes Objekt/Prop/API-Response braucht `interface` oder `type`.
- 100 % try-catch für async + API. Fehler in SwiftUI-artigem Banner-UI, kein Crash.
- 100 % strict TypeScript: `strict: true`, `noImplicitAny: true`, `moduleResolution: "bundler"`.
- 100 % Store-Validierung: Jeder `features/*/model/store.ts` exportiert `validateStoreLogic()`.
- 100 % FlatList statt ScrollView+map für dynamische Listen.
- Zustand-Selektoren: `useStore(s => s.field)` – NIEMALS `useStore()`.

# === MARKENSICHERHEIT & DESIGN-REFERENZ ===
- `assets/*.png` (falls vorhanden) sind NUR Layout-/Hierarchie-Vorlagen. **KEIN** Branding übernehmen.
- Alle UI-Copies müssen **StructAI**-Sprache sprechen.
- Design-Verträge (`design-reference.contract.md`, `screens.contract.md`) sind bindend.

# === MULTI-AGENT-PIPELINE-PROTOKOLL ===
Reihenfolge: **Preflight → Frontend-first (shared → features/model → features/api → app → processes → backend)**
PRO Phase: **Architect → Coder → Static Checks → Critic → Auditor → (optional Debugger-Loop)**
Doppelt-Gate: Critic UND Auditor müssen `PROVED` liefern, sonst Debugger.
Debug-Loop: Max `STRUCTAI_MAX_CYCLES=7`, `STRUCTAI_DEBUG_PASSES=3`.
Output pro Agent strikt maschinenlesbar (STATUS + BEGRÜNDUNG).

# === QUALITY-GATES (RELEASE-LOCK) ===
Vor Release MÜSSEN alle folgenden Gates GRÜN sein:
1. `tsc --noEmit` → 0 Fehler
2. ESLint mit `eslint-config-expo` → 0 Errors
3. Jest Unit Tests für Stores (`validateStoreLogic` real ausgeführt) → 100 % grün
4. `npx expo doctor` → 0 Probleme
5. Pipeline-Report (`orchestrator.report.json`) → `release_ready: true`
6. Checkpoint/Report/Disk-Triple-Konsistenz verifiziert

# === BULLETPROOF-PFLICHTEN (P0 BIS P2) ===

P0 (sofort, blockiert Release):
  1. Report/Checkpoint/Disk-Triple-Konsistenz herstellen:
     - `orchestrator.report.json` darf `tasks_succeeded`/`tasks_skipped` nur enthalten, wenn sie
       mit `orchestrator.checkpoint.json` und dem realen Disk-Stand übereinstimmen.
  2. Echte Tests: `__tests__/`-Verzeichnis mit Jest-Setup, Tests für `validateStoreLogic()`,
     Tests für `optimizePrompt` (Mock fetch), Tests für `secureKeyStore` (Mock SecureStore).
  3. Echter Lint: ESLint-Konfig (`eslint-config-expo` + Custom-Regeln für `any`-Verbot,
     `TODO`-Verbot, Theme-Token-Pflicht, FSD-Import-Verbot). `package.json` umstellen.
  4. CI-Workflow: `.github/workflows/ci.yml` führt typecheck + lint + test + expo doctor aus.
  5. Settings-Screen + Paywall-Stub anlegen (FSD-konform in `features/Settings/ui/`,
     `features/Paywall/ui/`) und in `(tabs)/_layout.tsx` verlinkbar machen.

P1 (nächste Iteration):
  6. `assets/`-Ordner anlegen, mit Design-Reference-Mockups bestücken ODER explizit dokumentieren,
     dass `assets/` extern nachgereicht wird (siehe `design-reference.contract.md`).
  7. Backend `healthcheck.ts` um `/api/health` HTTP-Route und `version`/`uptime`-Broadcast erweitern.
  8. `lab.tsx`: `FlatList data={[]}` durch echte Liste (History + Empfehlungen) ersetzen ODER
     auf `ScrollView` mit dokumentierter Begründung migrieren.
  9. `_layout.tsx`: `useFonts({})` durch echte Font-Map (z.B. Inter-Family) ersetzen, Fallback
     dokumentieren, Timeout (3 s) für Loader.

P2 (Polish):
  10. Optionale Lottie-Animationen für Streak-Feuer und Orb-Recovery.
  11. SnapShot-Tests für PressableCard und GradientButton.
  12. Performance-Profil (FlashList-Option evaluieren).

# === SELF-CHECK VOR JEDER AUSGABE (BINDEND) ===
Bevor du Code, Review oder Fix abgibst, führe diesen Checklisten-Lauf durch:
  [ ] Datei-Kategorie bestimmt? (constants / store / component / screen / layout)
  [ ] Nur die ✅-Regeln der Matrix angewendet?
  [ ] FSD-Import-Gesetz geprüft?
  [ ] Library-Whitelist geprüft (keine nicht-gelisteten Pakete)?
  [ ] Keine `any`, keine TODOs, keine Platzhalter?
  [ ] Alle async/API in try-catch?
  [ ] validateStoreLogic() bei jeder store.ts vorhanden?
  [ ] Theme nur über `theme.colors.*` (kein Hex in UI-Dateien)?
  [ ] `as const` Werte → `typeof` für Typen (kein ts2749)?
  [ ] Exports korrekt (Named bevorzugt, Default nur Screens/Layouts)?
  [ ] Markensicherheit: „StructAI" in Copy, keine Fremdmarken?
  [ ] Output strikt maschinenlesbar (STATUS + BEGRÜNDUNG max 3 Punkte)?

# === REVIEW-/FIX-OUTPUT-FORMAT (BINDEND) ===
```
STATUS: [PROVED oder REJECTED]
BEGRÜNDUNG: [Bei PROVED: "Perfekt." | Bei REJECTED: max. 3 nummerierte Punkte]
```

Architect-Output-Format:
```
PLAN:
1) ...
2) ...
3) ...
RISIKEN:
- ...
ABNAHMEKRITERIEN:
- ...
```

# === UMGANG MIT DEM ÖKOSYSTEM ===
- Bei **jedem** Eingriff: `orchestrator.tasks.json` und ggf. `orchestrator.checkpoint.json`
  konsistent halten.
- Templates in `orchestrator/templates/` müssen nach jedem Source-Build gespiegelt werden
  (siehe Template-Refresh-Snippet im `PIPELINE_RUNBOOK.md`).
- Verträge in `orchestrator/contracts/` sind **Single Source of Truth** für Theme/Produkt/
  Screens/Design/Backend. Sie werden nur durch formellen Contract-Change angepasst.
- Diese Datei (`STRUCTAI_MASTER_ANALYSIS_AND_PROMPT.md`) ist die Meta-Wahrheit und dominiert
  bei Konflikten mit anderen Dokumenten, sofern kein neuerer formeller Beschluss vorliegt.

# === ERFOLGSKRITERIUM (DEFINITION OF DONE) ===
StructAI gilt als **bulletproof**, wenn:
1. Alle P0-Punkte dieses Masterprompts abgearbeitet UND im Code sichtbar sind.
2. Pipeline-Report `release_ready: true` mit Triple-Konsistenz (Report ≡ Checkpoint ≡ Disk).
3. CI-Workflow läuft grün (typecheck + lint + test + expo doctor).
4. Jeder Store hat `validateStoreLogic()` und einen Jest-Test, der sie aufruft.
5. Mindmap-Schichten 1–6 sind in der Codebasis eindeutig wiederzufinden (FSD reflektiert
   Markenkern → Produkt → Tech → Architektur → Qualität → Pipeline).
```

---

## Teil D – Operativer Action-Plan (Road to Reality)

### D.1 Phase 0 – Sofortmaßnahmen (≤ 1 h)
| # | Aktion | Datei/Tool | Verifikation |
|---|--------|------------|--------------|
| 0.1 | `orchestrator.report.json` mit Disk-/Checkpoint-Stand synchronisieren | manuelles Edit | Triple-Check-Script |
| 0.2 | `assets/README.md` anlegen, das die externe Quelle der Design-Mockups dokumentiert | neue Datei | Datei existiert |
| 0.3 | CI-Workflow-Datei `.github/workflows/ci.yml` mit `npm ci` + typecheck + lint + test erstellen | neue Datei | YAML valide |
| 0.4 | ESLint-Konfig `.eslintrc.cjs` + Pre-Commit-Hook | neue Dateien | `npx eslint .` läuft |
| 0.5 | Jest-Setup (`jest.config.js`, `jest.setup.ts`, `__tests__/`) | neue Dateien | `npm test` läuft |

### D.2 Phase 1 – Struktur & Tests (≤ 4 h)
| # | Aktion | Verifikation |
|---|--------|--------------|
| 1.1 | `features/Settings` (ui + model) anlegen, in `profil.tsx` verlinken | Build erfolgreich |
| 1.2 | `features/Paywall` (ui) anlegen, Premium-Button bindet | Build erfolgreich |
| 1.3 | Jest-Tests: `validateStoreLogic()` für `Gamification` | grün |
| 1.4 | Jest-Tests: `optimizePrompt` (Mock fetch) | grün |
| 1.5 | Jest-Tests: `secureKeyStore` (Mock SecureStore) | grün |
| 1.6 | ESLint-Custom-Regel: `no-restricted-syntax` für `any`, `TODO` | Lint grün |
| 1.7 | ESLint-Custom-Regel: `no-restricted-imports` für Cross-Feature-Imports | Lint grün |

### D.3 Phase 2 – Polish & Pipeline (≤ 8 h)
| # | Aktion | Verifikation |
|---|--------|--------------|
| 2.1 | Echte Font-Map in `_layout.tsx` + Loader-Timeout | App startet < 3 s |
| 2.2 | `lab.tsx` `FlatList data={[]}` → echte History-Liste | UI nutzt FlashList/FlatList korrekt |
| 2.3 | Backend `healthcheck.ts` um HTTP-Stub-Route erweitern | Stub kompiliert, Typen sauber |
| 2.4 | Pipeline-Run end-to-end: Preflight → 18 Tasks → Quality-Gates | `release_ready: true` |
| 2.5 | `orchestrator.py` Pre-Flight: Triple-Consistenz-Check als Hard-Stop | Pre-Flight blockt bei Inkonsistenz |
| 2.6 | Lottie-Animationen für Streak-Feuer (Assets, Loader) | App rendert |

### D.4 Phase 3 – Release-Engineering (≤ 1 Tag)
| # | Aktion | Verifikation |
|---|--------|--------------|
| 3.1 | `expo prebuild` + EAS-Build-Konfig (`eas.json`) | EAS-Profile existieren |
| 3.2 | GitHub-Release-Workflow (Tag → Build → TestFlight/Play-Inernal) | Workflow läuft auf Tag |
| 3.3 | App-Icons, Splash, Store-Listings-Struktur | `assets/icon.png`, `assets/splash.png` |
| 3.4 | Datenschutz-/Impressum-Stubs für Store-Compliance | Markdown vorhanden |
| 3.5 | CHANGELOG + Semantic Versioning (1.0.0 → 1.1.0) | `CHANGELOG.md` |

---

## Teil E – Verifikations-Toolkit (jederzeit ausführbar)

```powershell
# Triple-Consistenz Disk ↔ Checkpoint ↔ Report
Get-Content orchestrator.checkpoint.json | ConvertFrom-Json | ForEach-Object { $_.completed_paths | Sort-Object } > .tmp.checkpoint.txt
Get-Content orchestrator.report.json   | ConvertFrom-Json | ForEach-Object { $_.tasks_succeeded + $_.tasks_skipped | Sort-Object } > .tmp.report.txt
Get-ChildItem -Recurse src,backend -File -Filter "*.ts*" | ForEach-Object { $_.FullName.Replace("C:\Users\Hotspot\Desktop\StructAI\", "").Replace("\", "/") } | Sort-Object > .tmp.disk.txt
Compare-Object (Get-Content .tmp.disk.txt) (Get-Content .tmp.checkpoint.txt)
Compare-Object (Get-Content .tmp.disk.txt) (Get-Content .tmp.report.txt)

# Quality-Gate-Lauf
npm ci
npm run typecheck
npm run lint
npm test
npx expo doctor
```

---

## Teil F – Erfolgsmetriken (KPIs)

| KPI | Zielwert | Aktueller Stand | Lücke |
|-----|----------|----------------|-------|
| Pipeline-Tasks `succeeded` / total | 18 / 18 | 17 / 18 (1 inkonsistent) | 1 |
| TypeScript-Strict-Fehler | 0 | 0 | 0 |
| Lint-Errors | 0 | n/a (skipped) | Stub aktivieren |
| Unit-Tests grün | 100 % | 0 | Suite anlegen |
| FSD-Import-Verstöße | 0 | 0 | 0 |
| `any`-Verstöße | 0 | 0 | 0 |
| TODO-/Placeholder-Verstöße | 0 | 0 | 0 |
| `validateStoreLogic()`-Coverage | 100 % (1/1) | 100 % | 0 |
| Theme-Token-Verstöße in UI | 0 | 0 | 0 |
| CI-Workflow grün | ✅ | ❌ | erstellen |
| Bulletproof-P0 erledigt | 5/5 | 0/5 | alle P0 |

---

## Teil G – Schluss-Statement (Mindmap → Realität)

Die Mindmap ist **kein Wunschzettel**, sondern ein **Pflichtenheft in Bildform**.
Die sechs Schichten (Markenkern → Produkt → Tech → Architektur → Qualität → Pipeline)
sind die Säulen, die drei Querschnitts-Säulen (Design, Release, Doku) sind die Balken.
Was in `instructions.md` v3.0 und in `MainAppScript.md` steht, ist die Grammatik;
was in `orchestrator/contracts/*.contract.md` steht, ist das Vokabular;
was in `src/` und `backend/src/` liegt, ist der Körper.
Was bisher fehlt, ist **die lebende Test-Schicht, die echte Lint-Schicht,
die CI-Schicht, die Settings-/Paywall-Schicht, und die Triple-Konsistenz** —
alles P0 lt. Teil C dieses Dokuments.

Mit Abarbeitung der **Phase 0 + Phase 1 + Phase 2** aus Teil D und strikter Anwendung
des **Masterprompts in Teil C** ist StructAI bulletproof, release-ready und
skaliert reproduzierbar durch die Pipeline.

> **Nächster konkreter Schritt:** Phase 0, Aktion 0.1 – Triple-Consistenz herstellen.
> Soll ich diesen Schritt direkt ausführen?

---

*Ende der Analyse. Dieses Dokument ist die kanonische Referenz für alle weiteren
Arbeiten an StructAI und ersetzt keine der bestehenden Dateien, sondern überwölbt sie.*
