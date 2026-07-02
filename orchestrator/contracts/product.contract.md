# StructAI – Produktvertrag (bindend für alle Agenten)

## Marke (NIEMALS verwechseln)
- **App-Name:** StructAI (einziger Produktname in UI, Splash, Tabs, Copy)
- **Slogan:** „Master Prompting. Build Real Intelligence.“
- **VERBOTEN in Nutzer-sichtbarem Text:** Fremdmarken, Beispiel-Apps aus Design-Mockups, generische „Academix“- oder Kurs-App-Namen
- **Design-Referenzbilder** (`assets/*.png`): Nur Layout, Hierarchie, Glassmorphismus, Gamification-Muster – **kein** fremdes Branding übernehmen

## Vision (aus MainAppScript.md)
Mobile Prompting-Akademie (Duolingo-Prinzip für Prompts): gamifiziertes Lernen + Praxis im **Prompt-Lab**.

## Tabs (Expo Router)
| Route | Label | Inhalt |
|-------|-------|--------|
| `akademie` | Akademie | 3 Lernpfade (Everyday / Code / Visual) |
| `lab` | Prompt Lab | Prompt eingeben, optimieren, Score, Energie-Orbs |
| `profil` | Profil | Level, XP, Streak, Orbs, Premium |

## Lernpfade (Akademie)
1. **Everyday Mastery** – Alltags-Prompting → `theme.colors.accent.everyday`
2. **Code & Development** – Dev-Prompting → `theme.colors.accent.code`
3. **Visual Creation** – Bild/KI-Design → `theme.colors.accent.visual`

## Prompt-Lab
- Echtzeit-Scoring 0–100 (Struktur, Kontext, Rolle, Beispiele)
- One-Click Optimizer (Before/After vorbereitet)
- ModelComparer via `runPromptComparison` (Promise.all, Fehlerisolierung)
- Energie: max 5 Orbs, 1 Regen / 30 Min; Premium = unbegrenzt

## Gamification
- XP, Level (Level-Up bei `xp >= 100 * level`, dann `xp = 0`, `level++`)
- Daily Streak (`incrementStreak` beim App-Start)
- Persist-Key: `structai-gamification`

## Monetarisierung (UI-Copy)
- Free: Orb-Limit, Basis-Modelle, BYOK
- Premium: „Upgrade auf Premium“ / „Premium Aktiv ✨“ (Demo: lokales `setPremium`)

## FSD-Module
`PromptLab`, `Gamification`, `Lernpfade` (zukünftig), `Paywall` (zukünftig), `APIKeyManager`

## BYOK
`secureKeyStore` – Keys nur lokal in `expo-secure-store`, nie im Klartext loggen.
