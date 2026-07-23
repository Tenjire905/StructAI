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
background-base:      #F3F0F8   // recessed page wash (kühles Lavendel-Grau, kein Cream)
background-elevated:   #FAF8FC   // Chrome (Tabs/Header) — NICHT reines Weiß
surface-card:          #FFFFFF   // raised cards
surface-inset:         #F0ECF6   // nested recessed blocks inside cards
surface-card-hover:    #EFEAF7   // quiet selection wash
surface-glass:         rgba(255,255,255,0.78)  // white frost (nie violettes Mud)
border-subtle:         rgba(26,18,37,0.10)
border-strong:         rgba(26,18,37,0.18)
```

### Akzentfarben — Dark (unverändert Kern + Soft-Fills)
```
accent-primary:         #8B5CF6   // Violett – Marken-Kernfarbe
accent-primary-dim:     #6D28D9
accent-primary-soft:    rgba(139,92,246,0.22)
accent-structure:       #22D3EE   // Cyan – nur Scoring/Erfolg/Struktur
accent-structure-dim:   #0E7490
accent-structure-soft:  rgba(34,211,238,0.18)
accent-warning:         #F59E0B
accent-warning-soft:    rgba(245,158,11,0.20)
accent-danger:          #EF4444
accent-danger-soft:     rgba(239,68,68,0.18)
accent-success:         #34D399
accent-success-soft:    rgba(52,211,153,0.18)
```

### Akzentfarben — Light (tief, knapp, WCAG-tauglich auf Weiß)
```
accent-primary:         #6D28D9   // deep violet — CTA/Brand, nicht Neon
accent-primary-dim:     #5B21B6
accent-primary-soft:    rgba(109,40,217,0.10)  // Soft-Badges / Chips
accent-structure:       #0E7490
accent-structure-dim:   #155E75
accent-structure-soft:  rgba(14,116,144,0.12)
accent-warning:         #B45309
accent-warning-soft:    rgba(180,83,9,0.12)
accent-danger:          #DC2626
accent-danger-soft:     rgba(220,38,38,0.10)
accent-success:         #047857
accent-success-soft:    rgba(4,120,87,0.10)
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
text-secondary:  #4F4763
text-tertiary:   #6B6478   // ≥ AA auf Weiß für Captions
text-on-accent:  #FFFFFF
```

### Regel für Cursor
> "accent-structure (Cyan) wird AUSSCHLIESSLICH für Prompt-Scoring, Erfolgs-Feedback im Prompt Lab und Fortschrittsanzeigen verwendet – niemals für generische UI-Elemente. Das ist das visuelle Signal 'hier passiert echte Bewertung', es darf nicht verwässert werden."
>
> "Appearance-Werte kommen ausschließlich aus dieser Datei / `theme/theme.ts`. Niemals ad-hoc Hellgrau oder Cream (#F4F1EA) einführen. Light muss überall über `tokens.colors.*` laufen — kein Screen darf Dark-Hex hardcoden."
>
> "Light: elevated ≠ card ≠ inset. Soft-Badges (accent-*Soft + Accent-Text) sind Default; Solid-Fill nur für hohe Betonung. Accent knapp halten — nicht als Flächenfarbe."
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
gradient-hero-bg-light:   linear-gradient(180deg, #FAF8FC 0%, #F3F0F8 100%)

gradient-orb-active:      radial-gradient(accent-structure → accent-primary)

// Dark overlay
gradient-card-overlay-dark:  linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)
// Light overlay
gradient-card-overlay-light: linear-gradient(180deg, transparent 0%, rgba(26,18,37,0.18) 100%)
```

### Light Elevation
```
elevation-1 light:  iOS shadowColor #1A1225, opacity 0.12, radius 12, offset {0,3}
elevation-2 light:  iOS shadowColor #1A1225, opacity 0.16, radius 20, offset {0,8}
elevation-glow light: accent-primary, opacity 0.14 (deutlich leiser als Dark)
blur glass light: intensity 26 (Dark 40)
```