# PROJECT_CONTEXT.md
### StructAI – persistentes Projekt-Gedächtnis für Cursor (ersetzt Claude als Kontext-Quelle)

Dieses Dokument existiert, damit **jede** Session mit Cursor sofort auf den vollen Projektstand zugreifen kann, ohne dass Claude zuerst den Kontext "vorlesen" muss. Es wird bei jeder größeren Entscheidung/Meilenstein aktualisiert – nicht nur am Anfang. Cursor liest diese Datei automatisch mit, wenn sie im Repo-Root liegt (siehe `.cursorrules`, das explizit auf `DESIGN_TOKENS.md` und `THEME_MODES.md` verweist – dieses Dokument ergänzt beide um den Projekt-Verlauf und die Roadmap).

**Wichtig zur Einordnung:** Dieses Dokument wurde aus dem tatsächlichen Repo-Zustand (Commit-Historie, Ordnerstruktur, bestehende Docs) rekonstruiert. Es ersetzt NICHT automatisch Wissen, das ausschließlich in Claude-Chatverläufen existiert (z. B. unverschriftlichte Produktentscheidungen, Diskussionen, verworfene Ideen). Dafür siehe Abschnitt 6 ("Was noch fehlt").

---

## 1. Produkt in einem Absatz

**StructAI** ist eine mobile Prompting-Lern-App (Expo/React Native), die Nutzern in strukturierten Lektionen und Lernpfaden beibringt, wie man gute Prompts für LLMs schreibt. Kernfeatures: Lernpfade mit Kapiteln/Lektionen (mehrere Übungstypen: fill_blank, true_false, reorder, matching, error_finding, categorize), ein "Prompt Lab" mit Live-Scoring eigener Prompts (BYOK – Bring Your Own Key, gegen echte Modelle), ein Begleiter-Charakter ("Orb") mit Zuständen/Energie, Streaks/XP, Zertifikate bei Pfad-Abschluss, sowie zwei visuelle Modi ("Playful" vs. "Focus", siehe `THEME_MODES.md`). Zielgruppe explizit auch 35+ (daher keine Emoji-UI, seriöse Focus-Variante).

## 2. Tech-Stack (Stand: `package.json`)

- **Expo SDK 57**, React Native 0.86, React 19.2, Expo Router (file-based routing unter `app/`)
- **State:** Zustand (`store/progressStore.ts`), MMKV für Persistenz
- **Styling/Motion:** Reanimated 3/4 + react-native-worklets (keine alte `Animated`-API), react-native-svg, expo-linear-gradient, expo-blur
- **Backend:** Supabase (`lib/supabase.ts`, `supabase/migrations/*.sql`) – Auth + `user_progress` + `app_events` (self-hosted minimal Analytics)
- **Icons:** lucide-react-native
- **Tests/Verify:** kein klassisches Jest-Setup aktuell aktiv genutzt – stattdessen eigene `scripts/verify-*.mjs` / `.cjs` Skripte pro Feature (Konvention, siehe Abschnitt 4) + Playwright für Screenshot-Captures (`scripts/capture-*.cjs`)
- TypeScript strict via `tsconfig.json`

## 3. Architektur-Überblick

```
app/                      → Expo Router Screens (Dateiname = Route)
  (tabs)/                 → Bottom-Tabs: Home, Lernpfade, Prompt Lab, Profil
  (dev)/                  → Dev-only Preview-Screens (nie in Prod-Build referenzieren)
  onboarding/              → Onboarding-Flow inkl. Modus-Auswahl (Playful/Focus)
  auth/, lektion/[id], lernpfad/[id]

components/
  ui/                     → Basis-Komponenten (Button, Card, Badge, ProgressBar, Avatar, PressableScale)
  features/               → Zusammengesetzte Komponenten (OrbCompanion, PathCard, CertificateView, ScoreChart, StreakTracker, ModelComparer, ...)

theme/                    → ThemeModeContext, theme.ts (Tokens), copy/ (i18n Copy je Modus & Sprache: de/en/fr/ru)
data/                     → Lerninhalte (lessonContent/ pro Locale+Pfad), mockPaths, Lesson-Catalog-Schema/Resolver
lib/                      → Business-Logik (Scoring, Progress-Merge/Sync, BYOK-Spending, Zertifikat-Export, Analytics, Auth-Routing)
store/                    → Zustand Stores
providers/                → React Context Provider (AuthProvider)
supabase/migrations/      → SQL-Migrationen
scripts/                  → verify-*.mjs (Logik-Verifikation ohne UI) + capture-*.cjs (Playwright-Screenshots für visuelle Verifikation)
```

**Kern-Prinzip Theme:** Ein Datenzustand pro Screen, Modus ändert nur Darstellung (`ThemeModeContext` → `useThemeMode()`), niemals Inhalte/Navigation. Copy-Strings sind `{ playful, focus }`-Objekte pro Sprache, nie hartcodiert im JSX.

## 4. Wiederkehrende Konventionen (aus Commit-Historie destilliert)

- **Verify-Skripte statt/zusätzlich zu klassischen Unit-Tests:** Für jedes nicht-triviale Feature gibt es ein `scripts/verify-<feature>.mjs`, das die Kernlogik isoliert prüft (z. B. `verify-lesson-completion-threshold.mjs`, `verify-progress-sync-merge.mjs`, `verify-guest-mode.mjs`). Neue Logik-Features sollten dieses Muster fortsetzen.
- **Capture-Skripte für visuelle Abnahme:** `scripts/capture-*.cjs` nutzen Playwright, um Screenshots von Dev-Preview-Screens (`app/(dev)/dev-*.tsx`) zu erzeugen – Basis für visuelle Reviews ohne echtes Gerät.
- **"Block"-/"Schritt"-Nomenklatur:** Feature-Batches wurden in Blöcken (A, B, D, E, F, G, J, K…) und Branches wie `feature/schritt-k1-gastmodus` entwickelt, jeweils mit `merge:`-Commit nach `develop`. Ein neues größeres Feature-Paket sollte diesem Muster folgen (Branch → Commits → merge-Commit mit Block-Referenz).
- **i18n:** 4 Sprachen (de/en/fr/ru), Lektionsinhalte pro Pfad-Kürzel (`pb`=Prompt Basics, `cm`=Context Mastery, `es`, `il`, `sl`) getrennt unter `data/lessonContent/`. Es gibt `verify-locale-parity.mjs`, um sicherzustellen, dass alle Sprachen inhaltlich synchron bleiben.
- **Git-Disziplin (siehe `.cursorrules` #11/#12):** Jeder Feature-Branch wird nach jedem Commit sofort zu `origin` gepusht (Datensicherung, keine Merge-Freigabe). Nach jedem lokalen Merge nach `develop` wird der neue Tip-Hash unaufgefordert im selben Bericht gemeldet.

## 5. Feature-Zeitstrahl (aus `git log`, chronologisch verdichtet)

1. **Fundament (Juli 2026, ab `e339b29`):** Theme-Tokens, Basis-UI-Komponenten, Home-Screen, Lernpfad-Übersicht/Detail, Lektion-Screen, Profil, Prompt Lab mit BYOK-Live-Scoring, Onboarding mit Modus-Auswahl.
2. **Content & i18n:** Vollständiger Lektionskatalog für 32 Kapitel über 5 Pfade, Lokalisierung aller Lektions-Strings (DE/EN/FR/RU), native Step-Typen (fill_blank, true_false, reorder) mit Shuffle-Verifikation.
3. **Orb Companion:** Eigener Zustands-Hook (`useOrbCompanionState`), animierte Zustände, Integration in Home/Lektion/Prompt-Lab, Energie-/Breathing-Loop für `low_energy`.
4. **Block A/B:** Integration nativer Lektionsinhalte + Companion-Lifecycle, Lesson-Completion-Threshold (>60% richtig) mit Retry-Flow, wiederholbare fehlgeschlagene/abgeschlossene Lektionen.
5. **Block D–G (`8244efa`):** Auth-Flow mit Supabase, Offline-first Progress-Sync mit Merge-Strategie (Timestamps, Dedupe), BYOK-Profil + Model-Comparer, Pfad-Abschluss-Flow, Zertifikat-Export (inkl. PNG-Fallback für Web ohne native Share).
6. **Block J:** Neue Übungstypen – Matching, Error-Finding, Categorize (Schema-Erweiterung + Resolver + eigene Views), inkl. Step-State-Isolation-Verifikation bei gemischten Lektionen.
7. **Block K (Aktivierungs-Funnel, K1–K3b):** Gastmodus (volle Nutzung ohne Account, Auth erst bei Sync-Bedarf), lokale Prompt-Heuristik verstärkt (überzeugende Gast-Demo ohne LLM-Call), minimales self-hosted Event-Tracking (`app_events`), Rückkehrer-Routing (Onboarding wird für Nutzer mit Server-Progress übersprungen).
8. **Content-Ingestion (aktuellster Stand, `main`):** Prompt-Basics-Pfad auf 45 Lektionen erweitert (`pb-9` bis `pb-45`), in 4 Batches eingepflegt.

**Offene Remote-Branches** (noch nicht in `main`/`develop` gemerged, Stand dieser Analyse): `feature/content-ingestion-sl-batch-01/02/03`, `feature/content-lektionen-katalog`, `feature/dev-progress-i18n-lessons`, `feature/schritt-6-motion-pass`, `feature/schritt-j1..j4-*`, `feature/schritt-k1-gastmodus`, `feature/schritt-k2-heuristik-staerken`. Vor neuer Arbeit prüfen, ob diese noch relevant/gemerged sind.

## 6. Was in diesem Dokument NICHT abgedeckt ist (manuelle Übertragung nötig)

Dinge, die ausschließlich in Claude-Chatverläufen/Artefakten existieren und NICHT aus dem Repo rekonstruierbar sind:
- Das ursprüngliche **Produktkonzept-Dokument** (in `THEME_MODES.md` referenziert als "Produktkonzept, Abschnitt 9") – falls dieses nur bei Claude existiert, bitte als `PRODUCT_CONCEPT.md` ins Repo exportieren.
- Business-/Monetarisierungs-Entscheidungen, Zielgruppen-Research (ggf. von Perplexity), Marketing-Copy-Vorgaben jenseits der App-UI.
- Verworfene Ansätze und WARUM sie verworfen wurden (nicht im Code sichtbar, nur in Diskussion).
- Nicht committete Design-Artefakte (Mockups, Figma-Links, Bild-Assets, die Claude ggf. beschrieben/generiert hat).

Siehe die Meldung im Chat für den konkreten Übertragungsprozess für diese Punkte.

---

**Pflege-Regel:** Nach jedem abgeschlossenen Feature-Block oder jeder wichtigen Architektur-Entscheidung wird Abschnitt 5 (Zeitstrahl) ergänzt – direkt im selben Commit/PR wie die Änderung, nicht nachträglich. So bleibt dieses Dokument die "single source of truth" statt eines Chat-Verlaufs.
