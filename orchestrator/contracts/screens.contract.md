# StructAI – Screen-Spezifikationen (bindend)

## `src/app/_layout.tsx`
- `StatusBar` light
- `useGamificationStore`: `regenOrbs` + `incrementStreak` in `useEffect`
- Stack `headerShown: false`, `contentStyle.backgroundColor`: `theme.colors.background.primary`
- Font-Loading mit dunklem Loader (`ActivityIndicator` + theme)

## `src/app/(tabs)/_layout.tsx`
- Tabs: `akademie` (Akademie), `lab` (Prompt Lab), `profil` (Profil)
- Tab-Bar nur via `theme.colors.*` (keine Hex-Literale)
- Ionicons wie in `design-reference.contract.md`

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
