# StructAI — Success Priorities (Learning Feeling)

**Stand:** Jul 2026 · **Release candidate for founder user review** (develop tip after polish merge)  



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
| **P0.1** | Finish prompt-mastery pm-4…pm-35 | **Done** — pm-4…pm-12 shipped; pm-13…pm-35 shipped (path complete) |
| **P0.2** | Expo Go retest A–H | **Done** (founder verified A–H) |
| P0.3 | Crash/nav + home UX on develop | **Done** on develop (lesson exit/continue/back-path + onboarding nav); retest on device |

### P1 — “I learned something” every session
| # | Initiative | Feeling | Status |
|---|------------|---------|--------|
| **P1.1** | Post-check **Learning Beat** | Pattern to remember under feedback | **Shipped** |
| **P1.2** | End-of-lesson **named skill summary** | Curated “you can do this now” (not glossary heuristics) | **Shipped** (pb-1…pb-6 + generic) |
| **P1.2b** | First-session proof loop | Critique → rewrite → compare → summarize | **Removed** (überfordernd ohne Vorwissen; Flow geht nach erster Lektion direkt zu Profil) |
| **P1.2c** | Prompt Lab “you learned X” | Score result framed as skill practiced | **Shipped** |
| ~~P1.2-old~~ | Glossary-heuristic Skill Card | Auto tags | **Removed** (noisy / inaccurate) |
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
| **P2.3** | Widgets / richer notifications | Evening reminders **founder-verified**; skill-named day-2 body + post-profile goal opt-in | **Partial** (reminders + day-2 copy; widgets deferred) |
| P2.4 | Selective social only if it reinforces practice | Duels later; not a core pillar | Open |

### P3 — Growth
| # | Initiative | Status |
|---|------------|--------|
| **P3.1** | App Store one-liner on welcome + Focus density (ROI #9) | **Shipped** |
| **P3.2** | Free vs Pro paywall (value + pricing) | **Shipped** (`/paywall`, €9.99 / €59.99; Block H billing later) |

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

Aligned with Perplexity Week-1 retention (Jul 2026):

1. ~~First-session proof loop~~ **done** (P1.2b)  
2. ~~Session closure names a skill gain~~ **done** (P1.2; curated pb-1…pb-12)  
3. ~~Prompt Lab “you learned X” + home Lab bridge~~ **done** (P1.2c)  
4. ~~Day-2 comeback cue~~ **done** (skill-named evening reminder + post-profile tagesziel + session “come back tomorrow”)  
5. Honest Pro preview CTA (no fake store charge) — in this polish  

Shipped recently: Week-1 proof, day-2 comeback, paywall honesty, P3.1 store-line, P3.2 paywall framing, pm-4…pm-35, soft XP/ranks, certificates, Orb Language.  
P2.3 evening reminders verified on Android development build.  
Next for release review: cold-install device pass (guest → proof → profil → tagesziel → home → Lab). Defer social / widgets / Block H IAP.

---

## What we will NOT chase (yet)

- Matching Iro’s content volume or duel/league stack first  
- Prompt-library breadth (PromptPal’s game)  
- Coding IDE / portfolio (Mimo’s moat)  
- Social / widgets as retention before session closure is meaningful  
- BYOK as the first meaningful hurdle  
- Relying on XP alone for the learning feeling  
- More curriculum depth past first/second-session proof  
- Paywall before habit works (Block H after proof + habit)  

---

## Director rule

After each P1 ship, cold ask:  
> “What did you learn in the last 5 minutes?”  

“I earned orbs” → failed.  
Names a prompting pattern → succeeded.
