# StructAI — Success Priorities (Learning Feeling)

**Stand:** Jul 2026 · P3.1 on develop; P3.2 Free vs Pro framing in flight  
**North star:** Users leave every session thinking *“I actually learned something”* — Mimo-level *feeling*, StructAI *category* (prompt skill).

**Teach-by-doing peers:** Iro AI (threat 5), AiQ (4), PromptFluent (3), PromptSpar (3).  
**Not learning apps:** PromptPal / God of Prompt (libraries), PromptJam (collab infra), Learn Prompting (guide).  
**Craft reference only:** Mimo (habit clarity — not coding).

Research: `docs/PERPLEXITY-COMPETITOR-RESEARCH-PROMPT.md` · Category map Jul 2026.

---

## App Store one-liner (cold user)

> **StructAI teaches you to write better prompts and judge AI answers through short lessons, live scoring, and a BYOK Prompt Lab.**

Sharper than “learn AI” — names the skill and the how.

---

## White space we own

Not another “Duolingo for AI” clone. Own:

- prompt **quality** + output **critique**
- hallucination resistance
- model comparison
- BYOK Prompt Lab inside a learning app
- Focus vs Playful as dual pedagogy (density/seriousness, not only color)

---

## Honest baseline

Skeleton exists: paths, exercises, Focus/Playful, orbs, streaks, daily goals, Prompt Lab, glossary, certificates, activity chart, Learning Beat.

Iro still beats us on scaffolding: duels, leagues, ranks, daily-game loop, exercise volume.  
We do **not** need to match content volume to win — feedback loops + session closure + identity beat volume (Perplexity caveat).

---

## Competitor snapshot (threat)

| Product | Learning feel | StructAI threat |
|---------|---------------|-----------------|
| Iro AI | Daily lessons, AI grading, duels/leagues/streaks, deep content | **5** |
| AiQ | Side-by-side bad/good, real AI grades, rewrites | **4** |
| PromptFluent | Lessons + habit hybrid; drifts to templates/LL | **3** |
| PromptSpar | Missions, AI-graded prompts, pro tracks | **3** |
| PromptJam | Collab tool, not curriculum | **2** |
| PromptPal / GoP | Library / manager | **1** |

---

## Priority ladder

### P0 — Trust & completeness
| # | Initiative | Status |
|---|------------|--------|
| P0.1 | Finish prompt-mastery pm-4…pm-35 | ROADMAP #1 open |
| P0.2 | Expo Go retest A–H | ROADMAP #2 open |
| P0.3 | Crash/nav + home UX on develop | Integration branch; merge when approved |

### P1 — “I learned something” every session
| # | Initiative | Feeling | Status |
|---|------------|---------|--------|
| **P1.1** | Post-check **Learning Beat** | Pattern to remember under feedback | **Shipped** |
| **P1.2** | End-of-lesson **Skill Card** | Glossary-heuristic skill tags | **Removed** (noisy / inaccurate) |
| **P1.3** | Home **Daily Challenge** CTA | One clear job today | **Shipped** |
| **P1.4** | Home progress = competence strip | Auto skill tags from lessons | **Removed** (same heuristic) |
| **P1.5** | Prompt Lab feedback tightening | Concrete missing: context / format / role / constraints | **Shipped** |
| **P1.6** | Wrong-answer coaching beat (“why + next pattern”) | Deepen beyond Learning Beat | **Shipped** |
| **P1.7** | Instant settlement micro-motion on checks | Correct/incorrect dopamine | **Shipped** (feedback settle pulse) |

### P1.8 — Companion language (Orb)
| # | Initiative | Status |
|---|------------|--------|
| **P1.8** | Orb Language v1 (face + coach voice; Focus tips after check) | **Shipped** (`ORB_LANGUAGE.md`) |

### P2 — Habit / identity (selective)
| # | Initiative | Note | Status |
|---|------------|------|--------|
| **P2.1** | Certificates more identity-forward | Skill claim + evidence + credential ID | **Shipped** |
| **P2.2** | Soft XP / ranks on top of orbs | Readable level strip (derived XP) | **Shipped** |
| P2.3 | Widgets / richer notifications | After daily goal is stable | Open |
| P2.4 | Selective social only if it reinforces practice | Duels later; not a core pillar | Open |

### P3 — Growth
| # | Initiative | Status |
|---|------------|--------|
| **P3.1** | App Store one-liner on welcome + Focus density (ROI #9) | **Shipped** |
| **P3.2** | Free vs Pro: Lab AI grades, certificates — not wall lesson 1 | **In PR** (soft gates + Profile plan strip; no IAP) |

---

## Top 10 ROI moves (impact / build cost)

1. End-of-session skill summary — high / low  
2. Visible skill win every lesson end — high / low  
3. Prompt Lab → one clear improvement path — high / medium  
4. Daily challenge, one clear job — high / low  
5. Wrong-answer coaching (why + next) — high / medium  
6. Identity-forward certificates — medium-high / low  
7. Home progress = competence — high / medium  
8. Instant feedback settlement + micro-motion — medium-high / medium  
9. Focus/Playful changes density, not just color — medium / medium  
10. Selective social — medium / high  

---

## Recommended next 30 days (only 3)

Aligned with Perplexity Jul 2026:

1. ~~Daily challenge / one-clear-job~~ **done** (P1.3)  
2. ~~Prompt Lab feedback tightening~~ **done** (P1.5)  
3. ~~Wrong-answer coaching + settle pulse~~ **done** (P1.6–P1.7)  
4. Auto skill-tag banners (P1.2/P1.4) **removed** — glossary heuristics were inaccurate  

Shipped recently: Orb Language (P1.8), identity certificates (P2.1), soft XP/ranks (P2.2), P3.1 store-line + Focus density.  
In flight: P3.2 Free vs Pro framing (soft gates; Block H payments still deferred).  
Next: P0.1 mastery content when `pm-batch-01.json` exists, P0.2 Expo Go retest A–H, P2.3 widgets/notifications.

---

## What we will NOT chase (yet)

- Matching Iro’s content volume or duel/league stack first  
- Prompt-library breadth (PromptPal’s game)  
- Coding IDE / portfolio (Mimo’s moat)  
- Paywall before habit works  

---

## Director rule

After each P1 ship, cold ask:  
> “What did you learn in the last 5 minutes?”  

“I earned orbs” → failed.  
Names a prompting pattern → succeeded.
