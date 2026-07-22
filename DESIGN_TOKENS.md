# DESIGN_TOKENS.md
### StructAI – verbindliche Design-Tokens. Cursor MUSS diese Datei referenzieren, niemals eigene Werte erfinden.

---

## 1. Farben

Appearance (`dark` | `light`) steuert die Flächen/Text-Palette. Playful/Focus bleibt orthogonal dazu (Stil/Density). Akzent-Violett bleibt die Markenfarbe in beiden Appearances — Kontraste sind so kalibriert, dass Lila auf hellen Flächen nicht „beißt“ und Text/WCAG-tauglich bleibt.

### Dark Appearance (Default)
```
background-base:      #0A0612
background-elevated:   #120B1E
surface-card:          #1A1225
surface-card-hover:    #221831
surface-glass:         rgba(255,255,255,0.06)   // mit expo-blur intensity 40 kombinieren
border-subtle:         rgba(255,255,255,0.08)
border-strong:         rgba(255,255,255,0.16)
```

### Light Appearance (verbindlich — keine eigenen Hell-Werte erfinden)
```
background-base:      #F5F2FA   // kühles Lavendel-Weiß (kein Cream, kein Flach-Weiß)
background-elevated:   #FFFFFF
surface-card:          #FFFFFF
surface-card-hover:    #EDE6F8   // dezente Violett-Wäsche für Hover/Selected
surface-glass:         rgba(91,33,182,0.06)
border-subtle:         rgba(26,18,37,0.08)
border-strong:         rgba(26,18,37,0.16)
```

### Akzentfarben — Dark (unverändert)
```
accent-primary:         #8B5CF6   // Violett – Marken-Kernfarbe
accent-primary-dim:     #6D28D9
accent-structure:       #22D3EE   // Cyan – nur Scoring/Erfolg/Struktur
accent-structure-dim:   #0E7490
accent-warning:         #F59E0B
accent-danger:          #EF4444
accent-success:         #34D399
```

### Akzentfarben — Light (Kontrast auf Hellflächen)
```
accent-primary:         #7C3AED   // etwas tieferes Violett → klar auf Weiß, ohne Neon-Biss
accent-primary-dim:     #6D28D9
accent-structure:       #0891B2   // tieferes Cyan für Lesbarkeit auf Hell
accent-structure-dim:   #0E7490
accent-warning:         #D97706
accent-danger:          #DC2626
accent-success:         #059669
```

### Text
```
// Dark
text-primary:    #F5F3FA
text-secondary:  #9B93AA
text-tertiary:   #635B75
text-on-accent:  #FFFFFF

// Light
text-primary:    #1A1225
text-secondary:  #5B5270
text-tertiary:   #8B849C
text-on-accent:  #FFFFFF
```

### Regel für Cursor
> "accent-structure (Cyan) wird AUSSCHLIESSLICH für Prompt-Scoring, Erfolgs-Feedback im Prompt Lab und Fortschrittsanzeigen verwendet – niemals für generische UI-Elemente. Das ist das visuelle Signal 'hier passiert echte Bewertung', es darf nicht verwässert werden."
>
> "Appearance-Werte kommen ausschließlich aus dieser Datei / `theme/theme.ts`. Niemals ad-hoc Hellgrau oder Cream (#F4F1EA) einführen. Light muss überall über `tokens.colors.*` laufen — kein Screen darf Dark-Hex hardcoden."
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
- Keine Emoji im UI, auch nicht als "verspielte" Auflockerung – untergräbt Seriosität gegenüber der Kernzielgruppe Prompt-Power-User (siehe `PRODUCT_CONCEPT.md` Abschnitt 1; frühere Begründung über Altersgruppen ist überholt, die Regel selbst bleibt unverändert gültig)
- Orb-Icon ist die EINZIGE Ausnahme mit custom SVG-Illustration (eigenes Asset, kein Icon-Font)

---

## 8. Gradient-Definitionen

```
gradient-primary-button:  linear-gradient(135deg, accent-primary → accent-primary-dim)

// Dark hero
gradient-hero-bg-dark:    linear-gradient(180deg, #1A1225 0%, #0A0612 100%)
// Light hero
gradient-hero-bg-light:   linear-gradient(180deg, #FFFFFF 0%, #F5F2FA 100%)

gradient-orb-active:      radial-gradient(accent-structure → accent-primary)

// Dark overlay
gradient-card-overlay-dark:  linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)
// Light overlay
gradient-card-overlay-light: linear-gradient(180deg, transparent 0%, rgba(26,18,37,0.12) 100%)
```

### Light Elevation
```
elevation-1 light:  iOS shadowColor #1A1225, opacity 0.08, radius 8,  offset {0,2}
elevation-2 light:  iOS shadowColor #1A1225, opacity 0.12, radius 16, offset {0,6}
elevation-glow:     unverändert accent-primary (beide Appearances)
```