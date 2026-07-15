#!/usr/bin/env bash
# Builds ONE copy-paste file for Perplexity (tablet-friendly, no zip).
# Usage: ./scripts/export-perplexity-tablet-prompt.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docs/PERPLEXITY-ANIMATION-PROMPT-FULL.md"
BRIEF="$ROOT/docs/PERPLEXITY-ANIMATION-BRIEF.md"

cat > "$OUT" << 'HEADER'
# StructAI — Perplexity Gesamt-Prompt (Tablet: alles kopieren & einfügen)

**develop-Stand:** siehe git log · **Kein ZIP nötig** — diese eine Datei enthält Prompt + alle Kontext-Texte.

---

## SO NUTZT DU ES AUF DEM TABLET

1. Öffne diese Datei auf GitHub (Raw) oder kopiere sie aus dem Repo.
2. **Alles markieren → Kopieren**
3. Perplexity → Neuer Thread → **Einfügen**
4. Optional: 3–5 Screenshots der App anhängen (Home, Pfad-Detail, Lektion fertig, Capstone)
5. Senden

Falls Perplexity die Länge limitiert: zuerst nur **Abschnitt A (Auftrag)** senden, dann **B + C + D** als Follow-up.

---

# ABSCHNITT A — DEIN AUFTAG AN PERPLEXITY

HEADER

cat >> "$OUT" << 'PROMPT'
Du bist Senior Mobile-UX-Psychologe und Motion Designer. Du reviewst **StructAI**, eine Expo/React-Native-Lern-App (Prompt Engineering, Duolingo-artige Pfade).

Lies **den kompletten Kontext in Abschnitt B–D** dieses Dokuments.

**Problem:** Die App funktioniert, wirkt aber zu **STARR** für ein gamifiziertes Produkt. Celebration-Overlays existieren, aber Peak-Momente (Lektion fertig, Capstone, Pfad-Unlock) landen emotional nicht. Zwischen Interaktionen fühlt es sich wie ein Formular an, nicht wie ein Spiel.

**Deine Aufgabe:** Mit Lern-App-Psychologie (Duolingo, Codecademy, Peak-End-Rule, Endowed Progress, Variable Reward, Flow, Zeigarnik, Loss Aversion) sag uns **EXAKT**:

- **WO** Motion hin muss (Screen + UI-Element)
- **WANN** sie triggert
- **WIE** sie sich anfühlt (Spring/Timing — nur unsere Token aus DESIGN_TOKENS)
- Unterschied **Playful vs. Focus**

**Constraints (bindend):**
- Reanimated 3 only
- Keine neuen Hex-Farben / Spacing erfinden
- Beide Theme-Modi müssen funktionieren
- Keine Emoji als UI-Icons
- 60fps Android (Expo Go)
- Keine neuen Features (Leaderboard, Social) — nur Motion auf bestehendem UI

**Lieferformat:**
1. Executive Summary — Top 5 Quick Wins
2. Tabelle pro Screen (P0–P2, Psychologie-Prinzip, Komplexität S/M/L)
3. Drei Storyboards (ASCII): (a) Lektions-Schritt-Wechsel, (b) Capstone unvollständig, (c) Pfad 100% + nächster Pfad frei

---

PROMPT

echo "" >> "$OUT"
echo "# ABSCHNITT B — PRODUCT & VISUAL BRIEF" >> "$OUT"
echo "" >> "$OUT"
# Strip section 11-12 zip references from brief when embedding
sed '/^## 11\. Key source files/,/^## 12\. Suggested Perplexity prompt/d' "$BRIEF" | sed '/^```$/,/^```$/d' | tail -n +8 >> "$OUT" || tail -n +8 "$BRIEF" >> "$OUT"

cat >> "$OUT" << 'MID'

---

# ABSCHNITT C — DESIGN_TOKENS.md (verbindlich)

MID

cat "$ROOT/DESIGN_TOKENS.md" >> "$OUT"

cat >> "$OUT" << 'MID'

---

# ABSCHNITT D — THEME_MODES.md (Playful vs. Focus)

MID

cat "$ROOT/THEME_MODES.md" >> "$OUT"

cat >> "$OUT" << 'MID'

---

# ABSCHNITT E — ANIMATION CODE-REFERENZ (Ist-Zustand)

## Celebration-Typen (CelebrationOverlay.tsx)
- `orb_gain` — Orbs erhalten
- `lesson_complete` — normale Lektion bestanden (leicht)
- `section_milestone` — Mid-Path Abschlussprojekt (mittel, ~75% Confetti)
- `capstone_complete` — finales Abschlussprojekt, Pfad noch nicht 100% (mittel-stark, ~125% Confetti)
- `path_complete` — Pfad 100% (stark, 2× Confetti, 2× Dauer)
- `streak_milestone` — 7-Tage-Serie

**Playful:** Confetti-Partikel (24–48)
**Focus:** Nur lila Puls-Flash, keine Partikel

## Orb Companion States (useOrbCompanionState.ts)
Priorität: celebrating > attentive > low_energy > sleepy > idle
- `idle`, `attentive`, `happy`, `low_energy`, `celebrating`, `sleepy`
- Playful: volle SVG-Illustration + Glow
- Focus: reduzierter Ring

## Press / Card Feedback
- Button & PathCard: scale 0.97 on press, spring-default zurück

## ProgressBar
- Positional segments: cyan = bestanden, orange = übersprungen
- withTiming only, keine Stagger-Animation

## Completion Screens (3 Stufen)
1. **SectionMilestoneView** — pb-8 etc.
2. **CapstoneIncompleteView** — pb-45 mit offenen Lektionen (State A)
3. **PathCompletionView** — 100% + Zertifikat + „Nächsten Pfad starten“ (State B)

## Bekannte Rigidity-Lücken
- Lektions-Schritte: harter Content-Swap, kein Slide/Fade
- Kapitelliste: keine Status-Wechsel-Animation
- Pfad-Freischaltung: instant, kein Unlock-Reveal
- Orb Companion selten während Lektion sichtbar
- Screen-Transitions: Standard Expo Router Stack

---

*Ende des Perplexity Gesamt-Prompts — StructAI develop*

MID

wc -c "$OUT" | awk '{printf "✓ %s (%d bytes, ~%d KB)\n", "'"$OUT"'", $1, int($1/1024)}'
