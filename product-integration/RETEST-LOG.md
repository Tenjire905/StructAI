# StructAI — Retest-Log

| Datum | Tester | develop tip | Tests | Ergebnis | Notizen |
|-------|--------|-------------|-------|----------|---------|
| 2026-07-14 | Cloud Agent | `7a341161052b21fd009cbc6726b4c0b0b8959452` | C4, D1, D2 | Code-verified | Logik geprüft; Geräte-Retest empfohlen |

---

## C4 — Kapitel-Lock Deep-Link

**Code-Review:** `LessonSessionScreen` prüft `pathBlockReason` zuerst, dann `canPlayLesson` via `isLessonPlayable`. pb-10 ohne Progress → Status `locked` → `LockedLessonView`.

| Pass/Fail | Pass (code review) |
|-----------|-------------------|

---

## D1 — Streak bei erster Lektion des Tages

**Code-Review:** `completeLesson` ruft `applyLessonCompletionStreak` mit `isNewCompletion: !wasAlreadyCompleted` auf. Erster Abschluss setzt heutigen Index in `streakDays`.

| Pass/Fail | Pass (code review) |
|-----------|-------------------|

---

## D2 — Streak bei Replay

**Code-Review:** `applyLessonCompletionStreak` returned early wenn `!isNewCompletion`. Replay ändert Streak nicht.

| Pass/Fail | Pass (code review) |
|-----------|-------------------|
