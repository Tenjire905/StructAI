# StructAI Orb — Rive Spec

Build the mascot in [Rive Editor](https://rive.app), then drop `structai-orb.riv` here.

## App wiring (already done)

- Runtime: `@rive-app/react-native` (dev client only — not Expo Go)
- Facade: `OrbCompanion` → Rive when asset + native are ready, else SVG fallback
- Enable asset: uncomment `require('./structai-orb.riv')` in `assets/rive/source.ts`
- Rebuild: `eas build --profile development --platform android` (and iOS when needed)

## Required Rive setup

| Item | Exact name |
|------|------------|
| Artboard | `StructAI Orb` |
| State Machine | `Orb Mood` |
| Number input | `mood` |
| Boolean input (optional) | `watch` |
| Trigger (optional) | `react` |

### `mood` values

| Value | App state | Suggested motion |
|------:|-----------|------------------|
| 0 | idle | Curiosity / soft loop — scanning, alive, not blinking nonsense |
| 1 | attentive | Locked on user / lean in |
| 2 | think | Evaluating — slower, focused |
| 3 | happy | Clean win beat (no cheesy endless smile) |
| 4 | worry | Soft miss / coaching concern |
| 5 | low_energy | Daily goal lagging |
| 6 | celebrating | Lesson/path clear — short punchy celebration |
| 7 | sleepy | Background idle (Playful) |

### Transitions

Prefer **blend / short crossfades** between moods (120–280ms).  
App sets `mood` whenever `OrbCompanionState` changes; keep loops seamless.

### Visual direction

- Own StructAI identity (violet + structure cyan), **not** a Duolingo bird clone
- Readable at **24–96px** (home counter → onboarding hero)
- No speech balloons inside the `.riv` — copy stays in the app

## Checklist before shipping

- [ ] All 8 mood loops play from the number input
- [ ] Idle loop never freezes
- [ ] Celebrating returns to idle/happy without getting stuck
- [ ] Reduce-motion: app still falls back / respects OS (SVG path when Rive off)
- [ ] New EAS development build installed and Prompt Lab + Orb verified
