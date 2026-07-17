# StructAI — Success Priorities (Learning Feeling)

**Stand:** Jul 2026 · Integrationsbranch `cursor/lesson-glossary-terms-fd20`  
**North star:** Users should leave every session thinking *“I actually learned something”* — Mimo-level *feeling*, StructAI *category* (prompting skill).

**Primary competitors for category:** Iro AI, PromptPal, AiQ-style apps (“Duolingo for AI”).  
**Craft reference only:** Mimo (habit, clarity, session dopamine — not coding).

Perplexity research prompt: `docs/PERPLEXITY-COMPETITOR-RESEARCH-PROMPT.md`

---

## Honest baseline

We already have the skeleton of a learning product: paths, varied exercises, Focus/Playful, orbs, streaks, daily goals, Prompt Lab, glossary, certificates, activity chart.

What Mimo/Iro still beat us on for *feeling*:
1. **One obvious job today** (daily challenge / “Start” that is unmistakable)
2. **Instant judgment on freeform work** (write a prompt → graded now)
3. **Wrong-answer coaching beat** (pattern to remember, not only explanation)
4. **Visible rank / XP arc** beyond orbs
5. **Shareable proof** that friends understand without installing the app

---

## Priority ladder (do in order)

### P0 — Trust & completeness (foundation)
Without this, polish feels fake.

| # | Initiative | Why | Status |
|---|------------|-----|--------|
| P0.1 | Finish **prompt-mastery** lessons pm-4…pm-35 | Incomplete paths kill trust | ROADMAP #1 open |
| P0.2 | Expo Go device retest A–H | Crashes erase learning feeling instantly | ROADMAP #2 open |
| P0.3 | Keep crash/nav fixes merged to develop | Stability is part of pedagogy | Integration branch ready |

### P1 — “I learned something” every session (Mimo feeling)
Highest ROI for the emotion you care about.

| # | Initiative | Feeling it creates | Build shape |
|---|------------|--------------------|-------------|
| **P1.1** | **Post-check Learning Beat** | Wrong/right → tiny “pattern to remember” line + optional glossary deep-link | Extend FeedbackBanner / explanation with `takeaway` field or heuristic from glossary terms in explanation |
| **P1.2** | **End-of-lesson Skill Card** | “Today you practiced: Grounding, Constraints” | Derive tags from lesson id / glossary hits in session; show on completion view |
| **P1.3** | **Home Daily Challenge CTA** | One clear 5-minute job | Card on Home: continue current lesson OR “today’s challenge” = next unfinished graded step |
| **P1.4** | Wire Prompt Lab into the loop | Lab stops being a separate room | After N lessons or path section: “Try this in Prompt Lab” with prefilled task |

### P2 — Habit machine (Iro/PromptPal parity, selective)
Only after P1 feels good.

| # | Initiative | Note |
|---|------------|------|
| P2.1 | Soft XP / ranks on top of orbs | Don’t replace orbs — add a readable level strip |
| P2.2 | Hearts/lives OR energy for failed checks | Optional; can feel punishing in Focus — careful |
| P2.3 | Widgets / richer notifications | After daily goal is stable |
| P2.4 | Shareable “before/after prompt” artifact | Stronger than certificate alone |

### P3 — Growth & money (later)
| # | Initiative |
|---|------------|
| P3.1 | One-sentence App Store positioning |
| P3.2 | Free vs Pro: Lab AI grades, certificates, duels — **not** walling lesson 1 |
| P3.3 | Light social (optional friend streaks) — only if retention data asks for it |

---

## Recommended next 30 days (only 3)

1. **P1.1 Learning Beat** on check feedback (ship this week)  
2. **P1.2 Skill Card** on lesson complete (same week / next)  
3. **P0.1 Mastery content ingestion** in parallel (content track)

Everything else waits.

---

## What we will NOT chase (yet)

- Coding IDE / portfolio apps (Mimo’s moat)
- Full duel/leaderboard social (expensive, not core pedagogy)
- Matching Iro’s 18 tool-touring paths (dilutes StructAI’s structure/eval edge)
- Paywall before habit works

---

## Director rule

After each P1 ship: ask one user (or yourself cold)  
> “What did you learn in the last 5 minutes?”  

If the answer is “I earned orbs” → failed.  
If the answer names a prompting pattern → succeeded.
