# StructAI – UI/UX Design-Referenz v2.1 (Academix-Layout, StructAI-Branding)

> Mockups in `assets/` = Layout/Hierarchie only. Copy + Farben = StructAI.
> Markenfarben: Everyday `#007AFF` · Code `#00E5FF` · Visual `#FF007F`.
> Hintergrund: `#0F172A` + radialer Glow (`gradient.hero`, `glow.ambient`).

## Globale Ästhetik
- **Dark First:** `theme.colors.background.primary`
- **Glassmorphismus:** `GlassCard` + `background.card` + `border.subtle`, `borderRadius` 24–32
- **Press:** Scale `0.97` (Animated)
- **Tab Bar:** `NativeTabs` (`expo-router/unstable-native-tabs`) — native System-Chrome (Liquid Glass iOS / Material Android)
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
| Tab Bar | `NativeTabs` (expo-router) |

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
`NativeTabs` in `src/app/(tabs)/_layout.tsx`. SF Symbols (`book`/`flask`/`person`) auf iOS, Material Symbols (`menu_book`/`science`/`person`) auf Android via `md`-Prop. **Branding** (Akzent `tintColor`, Tab-Labels) plattformübergreifend identisch; **native Chrome** (Blur, Schatten, Tab-Bar-Form) darf pro Plattform divergieren — kein erzwungenes „identisches RN-StyleSheet“ mehr.

## Listen
FlashList oder FlatList mit `keyExtractor` + `useCallback` renderItem.
