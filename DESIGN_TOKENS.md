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
- Keine Emoji im UI, auch nicht als "verspielte" Auflockerung – untergräbt Seriosität gegenüber der Kernzielgruppe Prompt-Power-User (siehe `PRODUCT_CONCEPT.md` Abschnitt 1; frühere Begründung über Altersgruppen ist überholt, die Regel selbst bleibt unverändert gültig)
- Orb-Icon ist die EINZIGE Ausnahme mit custom SVG-Illustration (eigenes Asset, kein Icon-Font)

---

## 8. Gradient-Definitionen

```
gradient-primary-button:  linear-gradient(135deg, accent-primary → accent-primary-dim)
gradient-hero-bg:         linear-gradient(180deg, #1A1225 0%, #0A0612 100%)
gradient-orb-active:      radial-gradient(accent-structure → accent-primary)
gradient-card-overlay:    linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)  // für Bild-Karten, Lesbarkeit von Text
```
