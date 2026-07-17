# StructAI — Product Integration Roadmap

**Stand:** develop `97377773ee4533aa41a29041d31424f6a520c2aa` (Jul 2026)

Priorisierte Build-Sessions für den Guest-Lernloop.  
Jeder Sprint = eine Prompt-Datei in diesem Ordner → Build-Cursor kopiert Prompt → Feature-Branch → ein Commit → Report an Director.

---

## Abgeschlossen

| Sprint | Thema | Prompt-Datei | Status |
|--------|--------|--------------|--------|
| 1 | Lesson-Loop, Lock-Guard, Dev-Reset | — | ✅ gemergt |
| 2 | Streak, Onboarding-Loop, Guest-Name | `sprint-02-engagement-onboarding-PROMPT.md` | ✅ gemergt |
| 3 | QA-Härtung, Full-Verify | `sprint-03-qa-hardening-PROMPT.md` | ✅ gemergt |
| 4 | First-Run CTA (Home + Loop → pb-1) | `sprint-04-first-run-cta-PROMPT.md` | ✅ gemergt |
| — | Expo-Go Storage, Onboarding, useLinking | ✅ gemergt |

## Offen

| Prio | Thema |
|------|--------|
| 0 | **Learning feeling** — siehe `SUCCESS-PRIORITIES.md` (P1.1–P1.7 shipped; next: P0 content + Expo retest) |
| 1 | Content-Ingestion pm-4…pm-35 (`content-ingestion/pm-batch-01-PROMPT.md`) |
| 2 | Geräte-Retest Checkliste A–H auf Expo Go |

**Competitor research prompt (Perplexity):** `docs/PERPLEXITY-COMPETITOR-RESEARCH-PROMPT.md`

---

## So startest du eine Build-Session

1. Prompt-Datei öffnen (z. B. `sprint-05-path-unlock-PROMPT.md`)
2. **Gesamten Inhalt** als Auftrag an Build-Cursor geben
3. Branch laut Prompt anlegen
4. Nach Commit: Report laut Prompt-Sektion „Report zurück an Director"
5. **Merge nur mit Freigabe**

---

## Pfad-Reihenfolge (Unlock-Kette)

```
prompt-basics (45, pb)
    ↓ vollständig
structure-lab (35, sl)
    ↓
context-mastery (35, cm)
    ↓
iteration-loops (35, il)
    ↓
eval-scoring (35, es)
    ↓  (ab Sprint 7)
prompt-mastery (35, pm)
```

**Vollständig** = `isPathFullyCompleted()` in `lib/pathCompletion.ts`.

---

## Verifikation (jeder Sprint)

```bash
npx tsc --noEmit
npm run verify:lessons
```

Manuell: Expo Go SDK 57, Guest, siehe `MANUAL-TEST-CHECKLIST.md` (ab Sprint 6 aktualisiert).

---

## Branch-Konvention

**Lokal / Director:**

```bash
git checkout develop && git pull origin develop
git checkout -b feature/product-integration-sprint-0N
git push -u origin feature/product-integration-sprint-0N
```

**Cloud Agents:**

```bash
git checkout -b cursor/<descriptive-name>-fd20
git push -u origin cursor/<descriptive-name>-fd20
```

Push nach **jedem** Commit. Kein Merge ohne Freigabe — außer Director sagt explizit zu.

---

## Prompt-Dateien (vollständig ausgeschrieben)

| Datei | Inhalt |
|-------|--------|
| `sprint-05-path-unlock-PROMPT.md` | lib/pathUnlock, PathCard locked, 3 Screens, Copy DE/EN/FR/RU |
| `sprint-06-qa-checklist-retest-PROMPT.md` | Vollständige neue Checkliste + RETEST-LOG Template |
| `sprint-07-prompt-mastery-PROMPT.md` | 6. Pfad, pm-1…3, Verify, pm-batch-01-PROMPT |
