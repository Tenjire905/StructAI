# StructAI – UI/UX Design-Referenz v2.1 (Academix-Layout, StructAI-Branding)

> Mockups in `assets/` = Layout/Hierarchie only. Copy + Farben = StructAI.
> Markenfarben: Everyday `#007AFF` · Code `#00E5FF` · Visual `#FF007F`.
> Hintergrund: `#0F172A` + radialer Glow (`gradient.hero`, `glow.ambient`).

## Globale Ästhetik
- **Dark First:** `theme.colors.background.primary`
- **Glassmorphismus:** `GlassCard` + `background.card` + `border.subtle`, `borderRadius` 24–32
- **Press:** Scale `0.97` (Animated)
- **Floating Tab Bar:** marginHorizontal 16, marginBottom 20, borderRadius 32, BlurView
- **Progress:** `SFProgressPill` — Pill mit Gradient-Glow, Höhe 10–14px
- **Typografie:** `SFLargeTitle` + `theme.typography.fontSize.*`

## Komponenten-Pflicht (shared/ui)
| Pattern | Komponente |
|---------|------------|
| Large Title | `SFLargeTitle` |
| Glass Card | `GlassCard` |
| Pressable Card | `PressableCard` |
| CTA | `GradientButton` |
| Pill Progress | `SFProgressPill` |
| List Row 44px | `SFListRow` |
| Text Input | `SFTextInput` |
| Streak Dot | `SFStreakDot` |
| Orb Indicator | `SFOrbIndicator` |
| Stat Card | `SFStatCard` |
| Error Banner | `SFErrorBanner` |
| Screen BG | `ScreenBackground` |
| Tab Bar | `FloatingTabBar` |

## Screen-Mapping

### Profil (= Academix Dashboard)
`ScreenBackground` → Begrüßung + Slogan → Level-Karte (`SFProgressPill` warning) →
`SFStatCard` Grid → `SFStreakDot` M–S → `SFOrbIndicator` → `GradientButton` Premium → `SFListRow` Settings.

### Akademie (= Course Cards)
`SFLargeTitle` „Deine Lernpfade“. FlashList + `GlassCard`: Icon, Titel, Beschreibung,
`SFProgressPill` mit Pfad-Akzent, „{n}% abgeschlossen“, Pfeil-Button.

### Prompt Lab
`SFOrbIndicator` + Energie-Label. `SFTextInput` in `GlassCard`. `GradientButton` + haptics.
Score-Karte + `SFErrorBanner`. FlashList History.

### Tab Bar
Identisch iOS/Android. Kein Material You. Ionicons book/flask/person outline.

## Listen
FlashList oder FlatList mit `keyExtractor` + `useCallback` renderItem.
