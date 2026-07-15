# StructAI — Perplexity Brief: Visual UX, Gamification & Animation Audit

**Use this document as the main prompt/context when uploading StructAI to Perplexity.**  
**Branch snapshot:** `develop` · **Stack:** Expo SDK 57, React Native, Reanimated 3  
**Language:** German UI (DE/EN/FR/RU copy), dark theme only

---

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

## 11. Tablet / ohne ZIP

**Eine Datei zum Kopieren:** `docs/PERPLEXITY-ANIMATION-PROMPT-FULL.md`  
Enthält: Auftrag + Brief + DESIGN_TOKENS + THEME_MODES + Code-Referenz.  
Generieren: `./scripts/export-perplexity-tablet-prompt.sh`

GitHub Raw (Tablet):  
`https://raw.githubusercontent.com/Tenjire905/StructAI/develop/docs/PERPLEXITY-ANIMATION-PROMPT-FULL.md`

---

## 12. Suggested Perplexity prompt (Desktop mit ZIP)

```
You are a senior mobile UX psychologist and motion designer reviewing StructAI.

I attached:
1) PERPLEXITY-ANIMATION-BRIEF.md (full product + visual context)
2) structai-perplexity-bundle.zip (source code snapshot from develop)

Read the brief first, then scan the animation-related files listed in section 11.

Our problem: the app works but feels too RIGID for a gamified learning product.
Celebrations exist but peak moments (lesson complete, capstone, path unlock) don't
feel rewarding enough. Between interactions feels static.

Using learning-app psychology (Duolingo, Codecademy, peak-end rule, endowed progress,
variable reward, flow), tell us EXACTLY:
- WHERE to add motion (which screen, which element)
- WHEN it triggers
- HOW it should behave (spring/timing aligned to our tokens in section 2)
- Playful vs Focus differences

Respect all constraints in section 9. No new hex colors. Reanimated 3 only.

Deliver: prioritized table P0–P2 + top 5 quick wins + 3 detailed storyboards for
(1) lesson step transition, (2) final capstone incomplete, (3) path 100% unlock.
```

---

*Generated for StructAI develop — animation & gamification audit.*
