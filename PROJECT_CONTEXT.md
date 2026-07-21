# PROJECT_CONTEXT.md
### StructAI – persistentes Projekt-Gedächtnis für Cursor (ersetzt Claude als Kontext-Quelle)

Dieses Dokument existiert, damit **jede** Session mit Cursor sofort auf den vollen Projektstand zugreifen kann, ohne dass Claude zuerst den Kontext "vorlesen" muss. Es wird bei jeder größeren Entscheidung/Meilenstein aktualisiert – nicht nur am Anfang. Cursor liest diese Datei automatisch mit, wenn sie im Repo-Root liegt (siehe `.cursorrules`, das explizit auf `DESIGN_TOKENS.md` und `THEME_MODES.md` verweist – dieses Dokument ergänzt beide um den Projekt-Verlauf und die Roadmap).

**Wichtig zur Einordnung:** Dieses Dokument wurde aus dem tatsächlichen Repo-Zustand (Commit-Historie, Ordnerstruktur, bestehende Docs) rekonstruiert. Es ersetzt NICHT automatisch Wissen, das ausschließlich in Claude-Chatverläufen existiert (z. B. unverschriftlichte Produktentscheidungen, Diskussionen, verworfene Ideen). Dafür siehe Abschnitt 6 ("Was noch fehlt").

---

## 1. Produkt in einem Absatz

**StructAI** ist eine mobile Prompting-Lern-App (Expo/React Native), die Nutzern in strukturierten Lektionen und Lernpfaden beibringt, wie man gute Prompts für LLMs schreibt. Kernfeatures: Lernpfade mit Kapiteln/Lektionen (mehrere Übungstypen: fill_blank, true_false, reorder, matching, error_finding, categorize), ein "Prompt Lab" mit Live-Scoring eigener Prompts (BYOK – Bring Your Own Key, gegen echte Modelle), ein Begleiter-Charakter ("Orb") mit Zuständen/Energie, Streaks/XP, Zertifikate bei Pfad-Abschluss, sowie zwei visuelle Modi ("Playful" vs. "Focus", siehe `THEME_MODES.md`). **Kernzielgruppe: ausschließlich Prompt-Power-User** (Menschen, die bereits regelmäßig mit KI-Modellen arbeiten) – keine Altersgruppen-Segmentierung, Playful/Focus ist reine Stil-Präferenz. Details zur Positionierung, BYOK-Philosophie und Geschäftslogik siehe **`PRODUCT_CONCEPT.md`**.

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
8. **Content-Ingestion (`main`):** Prompt-Basics-Pfad auf 45 Lektionen erweitert (`pb-9` bis `pb-45`), in 4 Batches eingepflegt. `main` und `develop` waren zu diesem Zeitpunkt gleich.
9. **Structure-Lab-Ausbau (aktuellster Stand, nur `develop`, NICHT in `main`):** `structure-lab`-Pfad von 6 auf **35/35 Zielumfang** erweitert (`sl-7` bis `sl-35`, 4 Batches). Ein Content-Qualitätsfehler dabei aufgedeckt und behoben (sl-11 categorize-Step war von Cursor eigenständig nachgedichtet statt aus Quelle übernommen → führte zur harten Prozessregel in `PRODUCT_CONCEPT.md` Abschnitt 3: nie improvisieren, Lücken melden). `main` ist Stand dieser Analyse **9 Commits hinter `develop`** – ein kuratierter Merge nach `main` steht noch aus.

10. **Haptic Feedback (`lib/haptics.ts`, `expo-haptics`):** Umgesetzt gemäß `HAPTICS.md` – Lektions-Antwort richtig/falsch, Lektion/Pfad abgeschlossen, BYOK-Key validiert, Prompt-Lab-Vergleich erfolgreich/fehlgeschlagen.
11. **Orb Language v1 (`ORB_LANGUAGE.md`):** Procedural SVG+Reanimated, States `think`/`worry`, Gesicht in beiden Modi, Playful-Coach-Stimme während der Lektion, Focus-Tipps nach Check (`lib/orbLanguage.ts`, `OrbPresence`).
12. **Identity Certificates (P2.1):** Zertifikat zeigt Skill-Claim pro Pfad, Evidenz (Kapitel), Credential-ID; Share-Titel = Skill-Win (`lib/certificateIdentity.ts`, `lib/buildCertificateViewModel.ts`).
13. **Soft XP / Ranks (P2.2):** Abgeleiteter XP aus Lektionen+Orbs+Pfadabschlüssen, Level/Rang-Strip auf Home+Profil, XP-Hinweis nach Lektion (`lib/skillRank.ts`, `SkillRankStrip`).
14. **App Store one-liner + Focus density (P3.1):** Welcome trägt die kanonische Store-Zeile (DE/EN/FR/RU) mit StructAI als Brand-Hero; Focus bekommt dichtere Presentation-Tokens (`preferredCardPadding`, `preferredSectionGap`, kleinerer Card-Radius) gemäß `THEME_MODES.md` §7 — erster systematischer Density-Schritt, kein Full Redesign.
15. **Free vs Pro framing (P3.2):** Soft-Gates ohne IAP — Free: Lektionen + lokaler Lab-Coach; Pro: Live-Lab-Grades + Zertifikat-Export (`lib/entitlements.ts`, `ProPlanStrip`, lokaler Preview-Unlock).
16. **Onboarding locale + glossary once:** Device-Locale beim Erststart (`resolveLocaleFromDevice`), dezenter Language-Chip oben rechts im Welcome; Glossary markiert jeden Term (`id`) nur einmal pro Textblock bzw. step-weit über `splitTextsWithGlossary` (Info-Titel/Body, Fill-Blank Prefix/Suffix, Coaching).
17. **First-session skill-proof removed:** Der critique→rewrite→compare-Loop (`/onboarding/proof`) ist entfernt — nach der ersten Lektion geht’s direkt zu `/onboarding/profil`. Die kompakte `SessionSkillSummaryCard` am Lektionsende bleibt.
18. **Lesson/profile nav crash guard:** `runAfterUISettles` ohne `requestIdleCallback`; First-Lesson-Handoff über Outcome `handoff_profile`; Profil-/Tagesziel-Submit mit Keyboard-dismiss + deferred `router.replace`.
19. **Crash hardening + onboarding crop:** Orb bricht alle `withRepeat`-SharedValues beim Unmount ab (`stopAllOrbMotion`); globales `routeTransitionLock` blockiert konkurrierende AuthNav-Replaces; Profil wendet `setMode` erst nach `replace` an; Welcome-Carousel: Caption wrappt 3 Zeilen, Phone-Crop mit `maxHeight: '100%'` + Compact-Skalierung.

## 6. Nächste geplante Schritte (Stand dieser Analyse, aus Claude/Perplexity-Sparring)

Priorisierung folgt `product-integration/SUCCESS-PRIORITIES.md`: P0.1 mastery content (wenn Batch-JSON da), P0.2 Expo Go retest A–H, P2.3 widgets/notifications. Focus-Mode Rules v1 (`THEME_MODES.md` §7) werden schrittweise über Presentation-Tokens ausgerollt, nicht als Big-Bang-Redesign. Offene Fäden siehe `PRODUCT_CONCEPT.md` Abschnitt 6.

**Offene Remote-Branches** (Stand dieser Analyse, ggf. inzwischen gemerged – vor neuer Arbeit prüfen): `feature/content-lektionen-katalog`, `feature/dev-progress-i18n-lessons`, `feature/schritt-6-motion-pass`, `feature/schritt-j1..j4-*`. (`feature/content-ingestion-sl-batch-01/02/03` und `feature/schritt-k1/k2-*` sind bereits in `develop` gemerged, siehe Abschnitt 5 Punkt 7 und 9.)

## 7. Was inzwischen übertragen wurde – und was ggf. noch fehlt

Aus dem hochgeladenen Claude-Chatverlauf und dem Perplexity-Sparring-Export übertragen (Stand dieser Analyse): Produktpositionierung, BYOK-Philosophie, Content-Strategie, Feature-Nicht-Ziele → **`PRODUCT_CONCEPT.md`**. Konkrete Focus-Mode- und Haptics-Spezifikationen → **`THEME_MODES.md`** Abschnitt 7 und **`HAPTICS.md`**.

Weiterhin nur im Kopf des Gründers bzw. in nicht hochgeladenen Quellen vorhanden (bei Bedarf nachliefern):
- Falls es Interview-Ergebnisse aus den geplanten 5–8 Power-User-Interviews zur Focus-Modus-Validierung gibt (siehe `PRODUCT_CONCEPT.md` Abschnitt 6) – bisher nur der Interview-Leitfaden erwähnt, keine Ergebnisse gesehen.
- Nicht committete Design-Artefakte (Mockups, Figma-Links, Bild-Assets).

---

**Pflege-Regel:** Nach jedem abgeschlossenen Feature-Block oder jeder wichtigen Architektur-Entscheidung wird Abschnitt 5 (Zeitstrahl) ergänzt – direkt im selben Commit/PR wie die Änderung, nicht nachträglich. So bleibt dieses Dokument die "single source of truth" statt eines Chat-Verlaufs.
