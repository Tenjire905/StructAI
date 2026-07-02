# StructAI – Screen-Spezifikationen (bindend)

## `src/app/_layout.tsx`
- `StatusBar` light
- `useGamificationStore`: `regenOrbs` + `incrementStreak` in `useEffect`
- Stack `headerShown: false`, `contentStyle.backgroundColor`: `theme.colors.background.primary`
- Font-Loading mit dunklem Loader (`ActivityIndicator` + theme)

## `src/app/(tabs)/_layout.tsx`
- **Native-First:** `NativeTabs` aus `expo-router/unstable-native-tabs` (kein custom `FloatingTabBar`, kein JS-`Tabs.tabBar`)
- Routen: `akademie` (Akademie), `lab` (Prompt Lab), `profil` (Profil)
- `tintColor`: `theme.colors.accent.everyday`; Labels wie oben
- Icons: `NativeTabs.Trigger.Icon` mit `sf` (iOS) + `md` (Android Material Symbols) — siehe `design-reference.contract.md`
- Default Export

## `src/app/(tabs)/akademie.tsx`
- Copy: „Deine Lernpfade“, Untertitel mit XP aus Store-Selektor
- 3 Pfade: Everyday Mastery, Code & Development, Visual Creation (Beschreibungen aus product.contract)
- `FlatList`, `PressableCard` mit `accentColor` pro Pfad
- Progress 0% Platzhalter, Balken borderRadius 8

## `src/app/(tabs)/lab.tsx`
- Titelbereich: „Prompt-Lab“
- Energie-Orbs + Label „{current}/{max} Energie“
- Optimieren: `isPremium || useOrb()`; sonst `Alert` „Keine Energie“ / Premium-Hinweis
- `optimizePrompt` in try-catch, Fehler-Banner
- Score-State `number | null`

## `src/app/(tabs)/profil.tsx`
- StructAI-Slogan sichtbar (sekundärer Text)
- Level + XP + Fortschrittsbalken
- Stat-Zeile (2 Karten): Lernpfade-Anzahl 3, Streak
- Streak-Woche + Energie-Karte + Premium-Button
- Präzise Store-Selektoren (kein ganzes `useGamificationStore()`)

## `src/app/index.tsx`
- Redirect zu `/(tabs)/akademie`
