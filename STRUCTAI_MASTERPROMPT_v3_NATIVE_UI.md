# StructAI Masterprompt v3 — Native-UI-Pivot & Vision-Lücken-Schließung

> **Status:** Bindend. Überschreibt explizit benannte Teile von `instructions.md` (§4),
> `orchestrator/contracts/theme.contract.md`, `orchestrator/contracts/design-reference.contract.md`
> und `orchestrator/contracts/screens.contract.md`. Ersetzt `STRUCTAI_MASTERPROMPT_v2.1.md` für
> alles UI-Bezogene, behält aber dessen Budget-Disziplin als Prinzip.
> **Zielgruppe:** Cursor (Composer/Agent). Dieses Dokument ist die einzige Quelle der Wahrheit
> für den UI-Layer und für die als P0/P1 markierten Feature-Lücken.

---

## 0. Warum dieses Dokument existiert (Kontext für Cursor)

Der letzte Vollbau-Durchlauf hat zwei Dinge zerstört: das Budget und das Design. Ursache:
Die komplette "SwiftUI-Optik" wurde **von Hand** in React-Native-`StyleSheet` nachgebaut
(`BlurView` + `borderRadius` + `Animated.spring(scale)` als Fake-Glassmorphismus) und von einem
**textbasierten LLM-Kritiker** abgenommen, der Optik nicht wirklich sehen, sondern nur Code lesen
kann. Ergebnis: Inkonsistenzen, die erst nach dem Build auffielen (Beispiel aus dem aktuellen
Code-Stand: `FloatingTabBar.tsx` wurde gebaut und vom Report als `PROVED` abgenommen, ist aber in
`(tabs)/_layout.tsx` nie tatsächlich verdrahtet — Report und Realität liefen auseinander).

**Korrektur-Prinzip ab sofort:** Wo eine **echte native Komponente** existiert (SwiftUI auf iOS,
Jetpack Compose/Material auf Android, beide über `@expo/ui` bzw. `expo-router`s native Tabs
erreichbar), wird sie verwendet — nicht nachgebaut. Das eliminiert eine ganze Fehlerklasse:
Es gibt kein "hat der Kritiker den Schatten richtig bewertet" mehr, weil das Betriebssystem die
Optik liefert, nicht eine vom LLM geschriebene `StyleSheet`.

---

## 1. Vorrang-Kette (bindend, zuerst lesen)

1. **Dieses Dokument** (UI-Architektur + Feature-Gaps)
2. `instructions.md` v3.0 — gilt vollständig, **außer** §4 (SwiftUI Look & Feel), das durch
   Abschnitt 2 hier ersetzt wird
3. `MainAppScript.md` — Produktvision, weiterhin bindend für Copy/Branding/Monetarisierung
4. `orchestrator/contracts/*.md` — bindend, **außer** den in Abschnitt 4 hier explizit
   geänderten Passagen

**Sofortmaßnahme für Cursor — veraltete Regeln neutralisieren:**
Die Dateien `.cursor/rules/global.mdc`, `.cursor/rules/orchestrator.mdc`,
`.cursor/rules/swiftui-components.mdc` und `.cursor/rules/byok-security.mdc` beschreiben einen
**komplett anderen, nicht existierenden Stack** (Next.js App Router, Tailwind/shadcn, Supabase,
helles iOS-Theme mit `#F2F2F7`). Das ist Altlast aus einer früheren, verworfenen Projektrichtung
und widerspricht der echten App (React Native/Expo, Zustand, Dark-Mode-First `#0F172A`).
Cursor MUSS diese vier Dateien **vor Beginn jeder Arbeit** entweder löschen oder durch einen
Verweis auf dieses Dokument ersetzen (z. B. `# Siehe STRUCTAI_MASTERPROMPT_v3_NATIVE_UI.md`).
Solange sie mit `alwaysApply: true` aktiv bleiben, widersprechen sie aktiv jeder Anweisung hier
und reproduzieren exakt das Chaos vom letzten Durchlauf. `ecosystem-north-star.mdc` bleibt gültig
(Vision/Phasen-Logik ist korrekt), `.cursor/skills/*` (architect/coder/critic/debugger) sind
generische Vorlagen und dürfen bleiben, aber ihre Inhalte werden durch dieses Dokument fachlich
überschrieben, wo sie sich widersprechen.

---

## 2. Architektur-Entscheidung: Native-First-UI (ersetzt `instructions.md` §4)

### 2.0 Paket-Lage (bereits vorhanden, nichts Neues installieren)
`package.json` enthält bereits `@expo/ui ^56.0.18`, `expo ^56.0.12`, `expo-router ~56.2.11`,
`react-native-screens 4.25.2`. Das ist exakt der Versionsstand, der für `NativeTabs` und
`@expo/ui/swift-ui` benötigt wird. **Keine Versions-Bumps nötig**, nur tatsächliche Nutzung.

### 2.1 Entscheidungs-Matrix — was wird womit gebaut

| UI-Muster | Bisher (Hand-Bau, fehleranfällig) | Jetzt (Native-First) | Quelle |
|---|---|---|---|
| Tab-Bar | `FloatingTabBar.tsx` (BlurView-Fake, nie verdrahtet) | `NativeTabs` — echte System-Tabbar, Liquid Glass auf iOS 26+, Material auf Android | `expo-router/unstable-native-tabs` |
| Primäre CTAs (Optimieren, Premium wählen, Speichern) | `GradientButton.tsx` | `Button` mit `buttonStyle('glassProminent')` oder `buttonStyle('borderedProminent')`, `tint(...)` | `@expo/ui/swift-ui` (+ `Host`) |
| Sekundär-Aktionen (Settings-Zeilen, Schließen-Button) | `PressableCard`/`SFListRow` mit `onPress` | `Button` mit `buttonStyle('bordered')` oder weiterhin `SFListRow`, wenn Listen-Kontext FlashList ist (siehe 2.2) | `@expo/ui/swift-ui` |
| Verlauf lang drücken (Prompt löschen/erneut nutzen) | nicht vorhanden | `ContextMenu` | `@expo/ui/swift-ui` |
| Modell-/Provider-Auswahl (BYOK, ModelComparer) | nicht vorhanden | `Picker` / `Menu` | `@expo/ui/swift-ui` |
| Lade-Zustand beim Optimieren | eigener Spinner | `CircularProgress` | `@expo/ui/swift-ui` |
| Lange/virtualisierte Listen (Lernpfade, Prompt-Verlauf, ModelComparer-Spalten) | `FlashList` | **bleibt** `FlashList` — `@expo/ui` hat aktuell keine virtualisierte Listen-Komponente | `@shopify/flash-list` |
| Marken-Flächen mit Glow/Gradient (Level-Karte, Score-Karte, Lernpfad-Karten) | `GlassCard`/`SFProgressPill` | **bleibt** themed RN — kein 1:1-natives Äquivalent für Marken-Gradient | `expo-linear-gradient` + `theme.colors.*` |

**Faustregel für Cursor:** Native-First gilt für *Steuerelemente* (Buttons, Tabs, Menüs, Picker,
Progress). Für *Marken-Branding-Flächen* (Gradient-Karten mit Akzentfarbe pro Lernpfad) bleibt
das bestehende `shared/ui`-Theme-System bestehen — das ist kein Rückschritt, sondern korrekt:
`@expo/ui` ist eine Primitiven-Bibliothek für native Controls, kein Ersatz für Marken-Design.

### 2.2 Die "Identisch iOS/Android"-Regel wird aufgehoben
`design-reference.contract.md` und `screens.contract.md` fordern aktuell wörtlich "Identisch
iOS/Android. Kein Material You." Das widerspricht Native-First per Definition — `NativeTabs` und
`@expo/ui` rendern auf Android bewusst Material-Komponenten. **Neue Regel:** Branding (Akzentfarben
`everyday`/`code`/`visual` als `tintColor`, Slogan-Copy, Markenname) bleibt plattformübergreifend
identisch. Die native Chrome (Tab-Bar-Optik, Button-Stil, System-Schatten/-Blur) darf und soll pro
Plattform divergieren. Cursor aktualisiert beide Contract-Dateien entsprechend, statt die alte
Regel zu ignorieren — sonst widersprechen sich Contract und Code erneut.

### 2.3 Technische Leitplanken (Pflicht, verhindert den letzten Fehlschlag)
- **API ist "fast-moving":** `@expo/ui` und `expo-router/unstable-native-tabs` ändern sich noch.
  Vor jeder Implementierung MUSS Cursor die aktuelle Doku unter `docs.expo.dev/versions/latest/sdk/ui/`
  bzw. `docs.expo.dev/router/advanced/native-tabs/` konsultieren (Web-Suche erlaubt/Pflicht) statt
  Komponenten/Props aus dem Trainingsgedächtnis zu raten. Bei Unsicherheit: offene Frage an den
  Nutzer stellen, **nicht** eine plausibel aussehende, aber erfundene Prop verwenden.
- **Kein verlässliches Testen in reinem Expo Go für alle Komponenten:** `Menu`/`ContextMenu` laufen
  in Expo Go, viele andere `@expo/ui`-Komponenten und `NativeTabs` brauchen einen Dev-Build
  (`npx expo run:ios` / EAS-Dev-Client). **`tsc --noEmit`, ESLint und Jest können native
  Rendering-Fehler nicht erkennen.** Deshalb gilt zusätzlich zu den bisherigen Quality-Gates:
  **Pflicht-Gate "Visuelle Verifikation"** — nach jeder UI-Phase (siehe Abschnitt 3) muss ein
  echter Dev-Build/EAS-Preview erzeugt und vom Nutzer per Screenshot/Simulator freigegeben werden,
  bevor die nächste Phase beginnt. Ein "PROVED" vom Critic-Agent reicht für UI-Tasks ab jetzt
  **nicht mehr** als alleiniges Abnahmekriterium.
- **Android-Icon-Assets:** `NativeTabs`/`Icon` nutzt auf SDK 56 primär `md` (Material Symbols).
  Fallback-PNGs liegen unter `assets/android/` für `src`-Prop, falls ein Dev-Client keine Symbols
  auflöst.

---

## 3. Stufenplan (klein, budget-sicher, jede Stufe einzeln abgenommen)

Kein "Vollbau" mehr. Jede Stufe ist ein eigener, eng begrenzter Cursor-Auftrag mit eigenem
Kosten-Deckel und eigenem visuellem Check, bevor die nächste Stufe beginnt.

**Phase A — Native Tabs (kleinstes Risiko, größter sichtbarer Gewinn)** ✅ Code umgesetzt
- Scope: `src/app/(tabs)/_layout.tsx` auf `NativeTabs`, `FloatingTabBar.tsx` entfernt.
- Abnahme: Dev-Build iOS + Android, Screenshots vom Nutzer.

**Phase B — Native Buttons, Pilot auf 2 Screens**
- Scope: `PaywallScreen.tsx` + `lab.tsx` auf `@expo/ui/swift-ui` `Button` + `Host`.
- Abnahme: Dev-Build-Screenshots, dann Freigabe für Phase C.

**Phase C — Rollout auf restliche Screens**
- Scope: Settings, Profil, Akademie-Pfeil-Buttons.

**Phase D — Inhaltliche Vision-Lücken (separates Budget)**
Siehe Abschnitt 5.

---

## 4. Konkrete Contract-Änderungen (Cursor führt diese Edits aus)

- `orchestrator/contracts/design-reference.contract.md`: Tab-Bar + Plattform-Regel ✅
- `orchestrator/contracts/screens.contract.md`: `NativeTabs` ✅
- `instructions.md` §4: Native-First ergänzt ✅
- `instructions.md` §5: Library-Whitelist ergänzt ✅

---

## 5. Inhaltliche Vision-Lücken (Phase D, getrennt budgetiert)

Aus dem Abgleich mit `MainAppScript.md` fehlt im Code: Lektions-Datenmodell, ModelComparer-UI,
Achievements, tägliche Challenges, AI Coach.

**Vor Umsetzung mit dem Nutzer bestätigen:**

1. **Lesson-Datenmodell + Akademie-Detailscreen**
2. **ModelComparer-Screen**
3. **Cloud-Sync in Paywall-Copy** — entfernen oder als „geplant“ markieren?
4. **AI Coach** — Phase E im Roadmap-Dokument, nicht still ignorieren.

---

## 6. Abnahme-Kriterium für diesen gesamten Auftrag

Phase A–C gelten erst als erledigt, wenn: (1) `NativeTabs` und mindestens die Phase-B-Buttons auf
einem echten iOS-Simulator UND Android-Emulator als Screenshot vom Nutzer freigegeben wurden, (2)
`orchestrator.report.json`/Quality Gates weiterhin grün sind, (3) die vier veralteten
`.cursor/rules/*.mdc`-Dateien aus Abschnitt 1 bereinigt sind, (4) die Contract-Edits aus
Abschnitt 4 committet sind. Phase D gilt erst nach expliziter Nutzer-Entscheidung zu den zwei
offenen Punkten in Abschnitt 5 als startbar.
