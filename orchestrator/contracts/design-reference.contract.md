# StructAI – UI/UX Design-Referenz (visuell, ohne Fremd-Branding)

> Referenz-Mockups in `assets/` zeigen **nur** Kompositionsmuster (dunkle Premium-App mit Karten, Streaks, Fortschritt).
> Umsetzung immer mit **StructAI**-Copy und **theme.colors** aus `theme.contract.md`.

## Globale Ästhetik
- **Dark First:** `theme.colors.background.primary`
- **Glassmorphismus:** `background.card` + `border.subtle`, `borderRadius` 16–24
- **Press:** Scale `0.97` (Animated oder Reanimated)
- **Keine harten Schatten** – subtile Border/Glow über `accentColor` an Karten
- **Typografie-Hierarchie:** display → lg/xl Titel → sm/md Body → xs muted

## Screen-Mapping (StructAI)

### Profil (Dashboard-Muster aus Referenz)
- Begrüßung + Markenzeile (StructAI / Slogan)
- **Level-Karte:** „Level {n}“, „{xp} XP“, XP-Balken (`feedback.warning` als Gold-Akzent)
- **Stat-Grid (2 Spalten):** z. B. „Lernpfade: 3“, „Streak: {n} Tage“
- **Daily Streaks:** Wochenreihe M–S, gefüllte Kreise = erreicht (`accent.everyday`)
- **Energie:** Orb-Reihe + „{current}/{max} Orbs“
- **Premium-Banner:** GradientButton

### Akademie (Kurs-Karten-Muster)
- Header: „Deine Lernpfade“ + XP-Zeile
- Sektion „Weiterlernen“ optional als erster hervorgehobener Pfad
- Karten: Titel, Beschreibung, **dünner Progress-Balken** (Track: `background.secondary`, Fill: Pfad-Akzent), „{n}% abgeschlossen“
- **FlatList** für die Pfad-Liste (kein ScrollView + map)

### Prompt Lab (Continue-Learning / Input-Muster)
- Oben: **5 Orb-Kreise** (gefüllt = `accent.everyday`, leer = `background.card`)
- Großes **multiline TextInput** (card background, border subtle)
- **GradientButton** „Optimieren ✨“ (`accent.everyday` → `accent.code`)
- Score-Karte + **Fehler-Banner** (`feedback.danger` Border/Text)

### Tab Bar (Referenz: dunkle Leiste)
- Hintergrund `background.primary`, Border top `border.subtle`
- Aktiv `accent.everyday`, inaktiv `text.muted`
- Ionicons: `book-outline`, `flask-outline`, `person-outline` (outline inaktiv, gefüllt aktiv)

## Komponenten-Pflicht
- Karten: `PressableCard` (borderRadius 20)
- CTAs: `GradientButton` (borderRadius 16)
- Listen: `FlatList` + `keyExtractor` + `useCallback` renderItem
