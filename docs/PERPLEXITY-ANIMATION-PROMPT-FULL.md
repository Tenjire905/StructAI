# StructAI — Perplexity Gesamt-Prompt (Tablet: alles kopieren & einfügen)

**Kein ZIP nötig** — diese eine Datei = Auftrag + Brief + DESIGN_TOKENS + THEME_MODES + Code-Referenz.

## Tablet-Anleitung
1. GitHub Raw öffnen (Link unten) **oder** diese Datei im Repo öffnen
2. Alles markieren → Kopieren
3. Perplexity → Neuer Thread → Einfügen
4. Optional: 3–5 App-Screenshots anhängen
5. Senden

**Raw-Link:** https://raw.githubusercontent.com/Tenjire905/StructAI/develop/docs/PERPLEXITY-ANIMATION-PROMPT-FULL.md

Bei Zeichenlimit: erst Abschnitt A senden, dann B–E als zweite Nachricht.

---

# ABSCHNITT A — AUFTAG AN PERPLEXITY

Du bist Senior Mobile-UX-Psychologe und Motion Designer. Du reviewst StructAI (Expo/React Native, Prompt-Lern-App, Duolingo-artige Pfade).

Lies Abschnitt B–E vollständig.

Problem: App funktioniert, wirkt aber zu STARR für Gamification. Celebrations existieren, Peak-Momente landen nicht. Zwischen Taps fühlt es sich wie Formular an, nicht Spiel.

Aufgabe — sag EXAKT: WO / WANN / WIE Motion (Spring/Timing nur aus DESIGN_TOKENS), Playful vs. Focus.

Constraints: Reanimated 3, Design-Tokens only, keine Emoji-UI-Icons, 60fps Android, keine neuen Features.

Lieferung: Top 5 Quick Wins + Tabelle P0–P2 pro Screen + 3 ASCII-Storyboards (Schritt-Wechsel, Capstone incomplete, Pfad 100%).

---

# ABSCHNITT B — PRODUCT & VISUAL BRIEF

## 1. What StructAI is

StructAI is a **mobile prompt-engineering learning app** (Duolingo-style linear paths). Users complete short interactive lessons, earn **Energy Orbs**, maintain **streaks**, unlock **learning paths** in sequence, and get **certificates** at 100% path completion.

**Target feel:** Premium dark UI, purple brand, cyan for “real scoring/progress”, gamified but **not childish** (no emoji UI icons, audience 25–45).

**Two presentation modes (same data, same flows):**
- **Playful** — brighter accents, confetti, bouncy springs, illustrated orb mascot with glow
- **Focus** — desaturated accents, no confetti, subtle pulse only, minimal orb ring

---

## 2. Visual identity (binding design system)

### Color palette (dark)
| Token | Hex | Usage |
|-------|-----|--------|
| background-base | `#0A0612` | Main screen background (deep purple-black) |
| background-elevated | `#120B1E` | Headers, tab bar |
| surface-card | `#1A1225` | Cards, list rows |
| border-subtle | `rgba(255,255,255,0.08)` | Dividers, progress track |
| accent-primary | `#8B5CF6` | Primary buttons, active tab, brand |
| accent-structure | `#22D3EE` | **Exclusive:** progress bars, lesson scores, success feedback |
| accent-warning | `#F59E0B` | Skipped lessons, low energy, lock badges |
| accent-success | `#34D399` | Completed chapter checkmarks |
| text-primary | `#F5F3FA` | Headlines |
| text-secondary | `#9B93AA` | Body, captions |

### Typography
- **Clash Display** — screen titles, large numbers
- **General Sans** — body, buttons
- **Space Mono** — orb counts, percentages, scores (anti-jitter)

### Shape language
- Rounded cards (20–28px radius), pill buttons, pill progress bars
- Cards have soft elevation shadow (not flat Material)
- Lucide icons, stroke 1.75, no emoji

### Motion tokens (current)
```
duration-instant: 100ms   (press)
duration-fast:    200ms   (toggles)
duration-medium:  300ms   (progress fill)
duration-celebration: 600ms (milestones only)

spring-default: { damping: 15, stiffness: 150 }
spring-bouncy:  { damping: 10, stiffness: 120 }  // Playful celebrations only
```

**Rule:** Interactions ≤300ms except explicit celebrations. No bounce on standard navigation.

---

## 3. App structure (navigation)

**Bottom tabs (4):**
1. **Start (Home)** — greeting, orb counter, weekly streak tracker, stat cards, “continue learning” path card
2. **Lernpfade** — all 6 paths: active / available / locked
3. **Prompt-Werkstatt (Prompt Lab)** — prompt scoring playground (cyan-heavy)
4. **Profil** — guest/auth, certificates, settings (theme mode toggle)

**Onboarding (first launch):** Welcome → Theme pick (Focus/Playful preview cards) → 3-step loop → first lesson `pb-1`

**Core loop:** Home → Path detail (chapter list) → Lesson (multi-step) → Completion screen → next lesson or path

---

## 4. Screen-by-screen visual description

### 4.1 Home (Start)
```
┌─────────────────────────────────────┐
│ Start                          ⚙️  │
├─────────────────────────────────────┤
│ Willkommen zurück, Gast!    [GA]   │
│                    Energie-Orbs 281│
│                    (glowing orb)   │
│                                     │
│ Deine Woche                         │
│ Mo Di Mi Do Fr Sa So               │
│ ○  ●  ○  ○  ○  ○  ○   (Di active)  │
│                                     │
│ ┌──────────┐ ┌──────────┐          │
│ │ 16       │ │ 1        │          │
│ │ Lektionen│ │ Serie    │          │
│ └──────────┘ └──────────┘          │
│                                     │
│ Weiterlernen                        │
│ ┌─────────────────────────────────┐│
│ │ Prompt-Grundlagen               ││
│ │ Kapitel 17 von 45               ││
│ │ [türkis|orange|grau progress bar]││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```
**Psychology moment:** Return visit, endowed progress, “continue” CTA — needs **momentum**, not static cards.

### 4.2 Lernpfade
- Section “Deine aktiven Pfade” — PathCard with progress bar
- Section “Noch verschlossen” — dimmed cards, yellow “Verschlossen” badge, lock icon
- Tapping locked path → no navigation (visual affordance but blocked)

### 4.3 Path detail (Prompt-Grundlagen)
- Progress card: percentage (cyan), segmented progress bar, chapter count
- Purple CTA “Weiter geht es!”
- Chapter list: number + title + status icon
  - ✅ cyan check = completed (dimmed text)
  - ⚠️ orange = skipped/failed (bright text)
  - ▶ purple = current
  - 🔒 grey = locked

### 4.4 Lesson session
- Step progress bar (primary purple, not cyan)
- Step types: info card, multiple choice, matching, fill blank, reorder, etc.
- Orb companion **not always visible** on lesson screen (mainly completion screens)
- Primary bottom CTA “Prüfen” / “Weiter”

### 4.5 Completion states (critical for gamification)

| Trigger | Screen | Celebration intensity |
|---------|--------|----------------------|
| Normal lesson pass | Simple completion: orb + title + orbs earned + “Nächstes Kapitel” | Light overlay (`lesson_complete`) |
| Mid-path capstone (e.g. pb-8) | Section milestone: “Abschlussprojekt geschafft” | Medium (`section_milestone`) |
| Final capstone, path **incomplete** | State A: stats, missing count, locked next-path preview | Medium (`capstone_complete`), **no certificate** |
| Path **100% complete** | State B: certificate preview, confetti, “Nächsten Pfad starten” | Full (`path_complete`) |
| Lesson failed | Retry screen: score ratio, “Nochmal” / “Später weitermachen” | None |

### 4.6 Celebration overlay (global modal)
- **Playful:** 24–48 confetti particles, brand colors, short toast message
- **Focus:** purple pulse flash only, no particles
- Types: `orb_gain`, `lesson_complete`, `section_milestone`, `capstone_complete`, `path_complete`, `streak_milestone`

### 4.7 Orb Companion (mascot)
- Custom SVG orb with gradient (cyan → purple), eyes animate by state
- States: `idle`, `attentive`, `happy`, `low_energy`, `celebrating`, `sleepy`
- **Playful:** full illustration + glow shadow
- **Focus:** reduced ring style
- Used on: completion screens, path completion, some empty states

---

## 5. Progress bar (signature element)

Positional segments on path cards and path detail:
- **Turquoise (cyan)** = passed chapters at their index (can be non-contiguous)
- **Orange** = skipped/failed chapters
- **Grey track** = not yet reached

Percent number = completed count / total (not linear position).

---

## 6. Path unlock chain

```
prompt-basics (45) → structure-lab (35) → context-mastery (35)
→ iteration-loops (35) → eval-scoring (35) → prompt-mastery (35)
```

100% of lessons must be **passed** (not skipped) to unlock next path.

---

## 7. Current animation inventory (what exists today)

| Component | Animation | Issue / rigidity |
|-----------|-----------|------------------|
| `Button` / `PressableScale` | scale 0.97 on press, spring back | OK for buttons, not enough elsewhere |
| `PathCard` | press scale 0.97 | Cards feel static when idle |
| `ProgressBar` | `withTiming` width only | Segments pop in, no stagger/spring |
| `CelebrationOverlay` | confetti fall + scale in message | Short (~600ms), no choreographed sequence |
| `OrbCompanion` | blink, bounce when celebrating, idle breathe | **Underused** — rarely on lesson flow |
| `StreakTracker` | day fill on complete | Minimal delight on check |
| Screen transitions | Default Expo Router stack | **No custom shared-element or hero motion** |
| Lesson step change | Instant content swap | **No slide/fade between steps** |
| Chapter list | Static rows | No stagger reveal, no status change animation |
| Path unlock | Instant badge change | No unlock reveal animation |

**User feedback:** “Still too rigid for a gamified app” — celebrations exist but **peak moments don’t land**; between interactions feels like a form, not a game.

---

## 8. Psychology framework — where animation should work

Please map recommendations to these moments:

1. **Endowed progress** — progress bar + chapter count on return (Home)
2. **Peak-end rule** — lesson complete, capstone, path complete (strongest animation at end)
3. **Variable reward** — orb count increment, not always same animation
4. **Loss aversion** — streak tracker, low orb energy state
5. **Goal gradient** — accelerate visual feedback near path completion
6. **Zeigarnik effect** — skipped chapters (orange) should pull attention without punishing
7. **Flow state** — lesson steps should feel continuous, not disjoint taps
8. **Autonomy** — Playful vs Focus: same rewards, different intensity

---

## 9. Technical constraints (must respect)

- **Reanimated 3 only** (`useAnimatedStyle`, `withSpring`, `withTiming`) — no legacy `Animated` API
- All colors/spacing/motion from **design tokens** — no invented hex values
- Must work in **Playful AND Focus** modes
- No emoji as UI icons
- No remote placeholder images — local SVG/assets only
- Performance: 60fps on mid-range Android (Expo Go)
- Haptics: optional enhancement, not required for first pass

---

## 10. What we need from you (Perplexity)

For **each screen/moment** in section 4 and 8, provide:

1. **When** to animate (trigger)
2. **What** should move (element, property: scale/opacity/translate/color)
3. **How** (easing/spring params aligned to our tokens)
4. **Duration tier** (instant / fast / medium / celebration)
5. **Playful vs Focus** intensity difference
6. **Psychology principle** cited (one line)
7. **Priority** (P0–P2) and **implementation complexity** (S/M/L)

Output format:
- Executive summary (top 5 highest-impact changes)
- Table per screen
- Optional: storyboard ASCII for top 3 moments (lesson complete, capstone, path unlock)

**Do NOT** suggest redesigning information architecture or adding new features (leaderboards, social, etc.) unless tied to existing UI.

---


---

# ABSCHNITT C — DESIGN_TOKENS.md

# DESIGN_TOKENS.md
### StructAI – verbindliche Design-Tokens. Cursor MUSS diese Datei referenzieren, niemals eigene Werte erfinden.

---

## 1. Farben

### Basis (beide Modi gemeinsam – niemals verändern)
```
background-base:      #0A0612
background-elevated:   #120B1E
surface-card:          #1A1225
surface-card-hover:    #221831
surface-glass:         rgba(255,255,255,0.06)   // mit expo-blur intensity 40 kombinieren
border-subtle:         rgba(255,255,255,0.08)
border-strong:         rgba(255,255,255,0.16)
```

### Akzentfarben
```
accent-primary:         #8B5CF6   // Violett – Marken-Kernfarbe, für primäre Buttons/aktive Zustände
accent-primary-dim:     #6D28D9   // gedimmte Variante für Gradient-Enden
accent-structure:       #22D3EE   // Cyan – Signature-Zweitfarbe, exklusiv für Scoring/Erfolg/Struktur-Feedback
accent-structure-dim:   #0E7490
accent-warning:         #F59E0B   // niedrige Orb-Energie, Achtung-Zustände
accent-danger:          #EF4444   // Fehler, kritische Zustände (sparsam einsetzen)
accent-success:         #34D399   // erfolgreicher Abschluss, richtige Antwort
```

### Text
```
text-primary:    #F5F3FA
text-secondary:  #9B93AA
text-tertiary:   #635B75
text-on-accent:  #FFFFFF   // Text auf gefüllten Buttons/Gradients
```

### Regel für Cursor
> "accent-structure (Cyan) wird AUSSCHLIESSLICH für Prompt-Scoring, Erfolgs-Feedback im Prompt Lab und Fortschrittsanzeigen verwendet – niemals für generische UI-Elemente. Das ist das visuelle Signal 'hier passiert echte Bewertung', es darf nicht verwässert werden."

---

## 2. Typografie

```
font-display:  "ClashDisplay-Semibold"   // Screen-Titel, große Zahlen (XP, Score)
font-heading:  "ClashDisplay-Medium"     // Karten-Titel, Section-Header
font-body:     "GeneralSans-Regular"     // Fließtext, Beschreibungen
font-body-medium: "GeneralSans-Medium"   // Button-Labels, wichtige UI-Texte
font-mono:     "SpaceMono-Regular"       // Zahlen/Scores/Timer, damit Ziffern nicht "springen"
```

### Größen-Skala (px, entspricht RN fontSize)
```
display-xl:  40   // Onboarding-Headlines
display-lg:  32   // Screen-Titel
heading-lg:  22   // Card-Titel
heading-md:  18   // Section-Header
body-lg:     16   // Standard-Fließtext
body-md:     14   // Sekundärtext, Captions
body-sm:     12   // Meta-Infos, Timestamps
```

### Regel für Cursor
> "Verwende niemals die System-Standardschrift. Fonts müssen über expo-font mit useFonts geladen werden, der Splash-Screen bleibt aktiv, bis alle Fonts geladen sind (SplashScreen.preventAutoHideAsync)."

---

## 3. Spacing (striktes 4px-Grid)

```
space-1:  4
space-2:  8
space-3:  12
space-4:  16
space-5:  24
space-6:  32
space-7:  48
space-8:  64
```

Bildschirm-Außenabstand (horizontal padding): immer `space-4` (16px), außer bei Vollbild-Hero-Screens (Onboarding): `space-5` (24px).

---

## 4. Radius

```
radius-sm:    12   // Chips, kleine Badges
radius-md:    16   // Buttons (nicht-Pill), Input-Felder
radius-lg:    20   // Standard-Karten
radius-xl:    28   // große Hero-Karten
radius-pill:  999  // Buttons, Progress-Bars, Tags
```

---

## 5. Elevation / Schatten (Cross-Platform-Utility – Pflicht)

Cursor muss eine gemeinsame Utility-Funktion `getShadow(level)` bauen, die auf iOS `shadowColor/shadowOpacity/shadowRadius/shadowOffset` und auf Android `elevation` zurückgibt. Nie inline im JSX unterschiedlich behandeln.

```
elevation-1 (Karten, ruhend):
  iOS:     shadowColor #000, opacity 0.20, radius 8,  offset {0,2}
  Android: elevation 3

elevation-2 (Karten, gehoben/aktiv):
  iOS:     shadowColor #000, opacity 0.30, radius 16, offset {0,6}
  Android: elevation 8

elevation-glow (Akzent-Elemente, z. B. aktiver Orb):
  iOS:     shadowColor accent-primary, opacity 0.45, radius 20, offset {0,0}
  Android: elevation 6 + zusätzlicher Glow-Layer via LinearGradient-Border
```

---

## 6. Motion / Animation-Timing

```
duration-instant:   100ms   // Press-Feedback (scale down)
duration-fast:      200ms   // Standard-Übergänge, Toggle-States
duration-medium:    300ms   // Card-Expand, Screen-Transitions
duration-celebration: 600ms // XP-Gewinn, Streak-Erfolg, Zertifikat-Unlock (einziger Ort für längere Animation)

spring-default:  { damping: 15, stiffness: 150 }   // Standard-Bounce für Buttons/Cards
spring-bouncy:   { damping: 10, stiffness: 120 }   // NUR für Celebration-Momente (Orb-Pop, Streak-Badge)
```

### Regel für Cursor
> "Jede Interaktion unter 300ms, außer explizit als Celebration markiert. Kein Bounce/Spring auf Standard-Navigationsübergängen – das wirkt unruhig, nicht hochwertig."

---

## 7. Icon-Regeln

- Ausschließlich Lucide oder Phosphor Icons, Stroke-Width einheitlich 1.75
- Icon-Größen-Skala: 16 / 20 / 24 / 32 (keine Zwischengrößen)
- Keine Emoji im UI, auch nicht als "verspielte" Auflockerung – untergräbt Seriosität bei 35+ Zielgruppe
- Orb-Icon ist die EINZIGE Ausnahme mit custom SVG-Illustration (eigenes Asset, kein Icon-Font)

---

## 8. Gradient-Definitionen

```
gradient-primary-button:  linear-gradient(135deg, accent-primary → accent-primary-dim)
gradient-hero-bg:         linear-gradient(180deg, #1A1225 0%, #0A0612 100%)
gradient-orb-active:      radial-gradient(accent-structure → accent-primary)
gradient-card-overlay:    linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)  // für Bild-Karten, Lesbarkeit von Text
```

---

# ABSCHNITT D — THEME_MODES.md

# THEME_MODES.md
### StructAI – Playful vs. Focus Modus. Gleiche Daten, gleiche Logik, unterschiedliche Hülle.

Grundprinzip für Cursor: **Es gibt nur EINEN Datenzustand pro Screen.** Der Modus verändert ausschließlich Darstellung (Farbintensität, Copy, Animation, Icon-Stil), niemals Inhalte, Werte oder Navigationsstruktur. Implementierung über einen `ThemeModeContext`, der ein Set von Override-Tokens auf die Basis-Tokens aus DESIGN_TOKENS.md legt.

---

## 1. Architektur-Vorgabe

```
ThemeModeContext liefert: { mode: 'playful' | 'focus', tokens: ResolvedTokens, copy: ResolvedCopy }

ResolvedTokens = merge(BASE_TOKENS, MODE_OVERRIDES[mode])
ResolvedCopy   = merge(BASE_COPY, MODE_COPY[mode])
```

Jede Komponente liest NUR aus `useThemeMode()`, nie direkt aus DESIGN_TOKENS.md-Werten fest verdrahtet. So bleibt ein Umschalten zur Laufzeit (Einstellungen) möglich, ohne App-Neustart.

---

## 2. Visuelle Unterschiede

| Parameter | Playful | Focus |
|---|---|---|
| Sättigung Akzentfarben | 100% (volle accent-primary/accent-structure) | -15% Sättigung, etwas gedämpfter |
| Orb-Darstellung | Volle Illustration mit Glow-Animation | Reduziert auf schlichten Ring/Prozent-Indikator |
| Card-Radius | radius-xl (28px) bevorzugt | radius-lg (20px), kompakter |
| Animation-Intensität | spring-bouncy erlaubt bei Erfolg | ausschließlich spring-default, kürzere Distanzen |
| Streak-Darstellung | Badge-Icons mit Mini-Bounce beim Abhaken | Schlichte Checkmarks, kein Bounce |
| Sound-Feedback | An (dezente UI-Sounds bei Erfolg) | Aus (Standard) |
| Confetti/Celebration-Layer | Bei Meilensteinen aktiv | Nur dezenter Farb-Puls, kein Partikel-Effekt |
| Leaderboard-Sichtbarkeit | Standardmäßig eingeblendet | Standardmäßig ausgeblendet, opt-in |

---

## 3. Copy-Unterschiede (Tonalität, NICHT Inhalt)

Wichtig: Beide Varianten beschreiben denselben Sachverhalt – nur die Sprache ändert sich. Keine Variante darf weniger Information enthalten.

```
Beispiel – Score-Feedback nach einem Prompt:

playful: "🔥 Starker Prompt! Deine Struktur sitzt – noch mehr Constraints und du holst Top-Score."
focus:   "Score: 87/100. Struktur und Zieldefinition sind stark. Verbesserungspotenzial: präzisere Constraints."

Beispiel – Streak-Erinnerung:

playful: "Dein Orb wartet auf dich! Noch heute üben und die Serie retten."
focus:   "Tägliche Übung ausstehend. 4 Tage Serie aktiv."

Beispiel – Empty State (noch keine Lernpfade gestartet):

playful: "Bereit für dein erstes Abenteuer? Wähl deinen Lernpfad und leg los!"
focus:   "Wähle einen Lernpfad, um zu beginnen."
```

### Regel für Cursor
> "Jeder Text-String im UI existiert als Objekt `{ playful: string, focus: string }` in einer zentralen `copy.ts`-Datei, referenziert über einen Key. Niemals Copy direkt im JSX hardcoden."

---

## 4. Onboarding-Steuerung des Modus

Frage im Onboarding (siehe Produktkonzept, Abschnitt 9): "Wie würdest du gerne lernen?" mit zwei Optionen, visuell als Mini-Preview beider Modi dargestellt (kein reiner Text-Toggle) – der Nutzer sieht sofort, was ihn erwartet, bevor er wählt.

```
Cursor-Vorgabe: Baue diesen Auswahlscreen als zwei nebeneinander liegende Card-Previews,
die jeweils eine Miniatur des Home-Screens im entsprechenden Modus zeigen (kein Icon, kein Textlabel allein).
Auswahl setzt ThemeModeContext global und wird in Persistenz (MMKV) gespeichert.
```

Modus ist jederzeit in den Einstellungen wechselbar, nicht nur beim Onboarding.

---

## 5. Was sich NIEMALS zwischen den Modi unterscheiden darf

- Score-Werte, XP-Zahlen, Fortschrittsprozente (Zahlen sind immer identisch, nur anders eingerahmt)
- Navigationsstruktur (keine unterschiedlichen Screen-Flows je Modus)
- Verfügbare Funktionen (Focus-Modus ist keine "abgespeckte" Version, nur ruhiger dargestellt)
- Lerninhalte selbst (Lektionstext bleibt gleich, nur Feedback-Ton variiert)

### Regel für Cursor
> "Wenn du unsicher bist, ob ein Unterschied zwischen den Modi 'nur Stil' oder 'auch Funktion' ist: es darf NUR Stil sein. Bei jedem Zweifel: beide Modi müssen exakt dieselben Daten und Aktionen anbieten."

---

## 6. Technische Umsetzung – Reihenfolge für Cursor

1. `ThemeModeContext.tsx` mit Provider, State (playful/focus), Persistenz via MMKV
2. `tokens.ts`: BASE_TOKENS + MODE_OVERRIDES (playful, focus) + Resolver-Funktion
3. `copy.ts`: zentrale Copy-Objekte pro Screen/Komponente
4. `useThemeMode()`-Hook, der resolved tokens + copy zurückgibt
5. Erst danach: bestehende Komponenten aus Abschnitt "Basis-Komponenten" (siehe Cursor-Direktionsguide) auf den Hook umstellen, statt hardcodierte Werte

---

# ABSCHNITT E — ANIMATION CODE-REFERENZ

## Celebration-Typen
- orb_gain, lesson_complete, section_milestone, capstone_complete, path_complete, streak_milestone
- Playful: Confetti 24–48 Partikel | Focus: nur Lila-Puls

## Orb Companion States
idle, attentive, happy, low_energy, celebrating, sleepy

## Completion Screens
1. SectionMilestoneView (pb-8) — mittel
2. CapstoneIncompleteView (pb-45 + Skips) — State A
3. PathCompletionView (100%) — State B + Zertifikat

## Rigidity-Lücken
- Lektions-Schritte: kein Slide/Fade
- Kapitelliste: kein Status-Anim
- Pfad-Unlock: instant
- Orb selten in Lektion sichtbar
- Stack-Transitions: Standard Expo Router

*Ende — StructAI develop*

