# StructAI — Product Integration Roadmap

**Stand:** develop `97377773ee4533aa41a29041d31424f6a520c2aa` (Jul 2026)

Priorisierte Build-Sessions für den Guest-Lernloop. Jeder Sprint = ein Prompt in diesem Ordner, ein Feature-Branch, ein Commit (sofern nicht anders vermerkt).

---

## Abgeschlossen

| Sprint | Thema | Prompt | Status |
|--------|--------|--------|--------|
| 1 | Lesson-Loop, Lock-Guard, Dev-Reset | *(vor Prompt-Dateien)* | ✅ gemergt |
| 2 | Streak, Onboarding-Loop, Guest-Name | `sprint-02-engagement-onboarding-PROMPT.md` | ✅ gemergt |
| 3 | QA-Härtung, Full-Verify | `sprint-03-qa-hardening-PROMPT.md` | ✅ gemergt |
| 4 | First-Run CTA (Home + Loop → pb-1) | `sprint-04-first-run-cta-PROMPT.md` | ✅ gemergt |
| — | Expo-Go Storage, Onboarding-Flow, useLinking | *(Hotfix-Branches)* | ✅ gemergt |

---

## Offen (Priorität)

| Prio | Sprint | Thema | Prompt | Ziel |
|------|--------|--------|--------|------|
| **1** | 5 | Pfad-Freischaltung (lineare Kette) | `sprint-05-path-unlock-PROMPT.md` | Pfade 2–5 gesperrt bis Vorgänger-Pfad vollständig |
| **2** | 6 | QA-Checkliste + Retest C4/D | `sprint-06-qa-checklist-retest-PROMPT.md` | Dokumentation aktuell, Lock-Guard + Streak verifiziert |
| **3** | 7 | 6. Pfad `prompt-mastery` (Scoping) | `sprint-07-prompt-mastery-PROMPT.md` | Erst nach validiertem 5-Pfad-Loop — Ingestion + UI |

---

## Pfad-Reihenfolge (Unlock-Kette)

```
prompt-basics (45)
    ↓ vollständig abgeschlossen
structure-lab (35)
    ↓
context-mastery (35)
    ↓
iteration-loops (35)
    ↓
eval-scoring (35)
```

**Vollständig** = jede Lektion des Templates in `completedLessonIds` (`lib/pathCompletion.ts` → `isPathFullyCompleted`).

---

## Verifikation (jeder Sprint)

```bash
npx tsc --noEmit
npm run verify:lessons
```

Manuelle Tests: Expo Go SDK 57, Guest-Modus, siehe jeweiligen Prompt + `MANUAL-TEST-CHECKLIST.md`.

---

## Branch-Konvention (Build-Cursor)

```bash
git checkout develop && git pull origin develop
git checkout -b feature/product-integration-sprint-0N
# … Arbeit …
git push -u origin feature/product-integration-sprint-0N
```

Cloud Agents: `cursor/<descriptive-name>-fd20` mit Push nach jedem Commit.

**Kein Merge nach develop ohne Freigabe** — außer Director gibt explizit frei.
