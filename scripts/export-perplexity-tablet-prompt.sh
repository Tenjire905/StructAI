#!/usr/bin/env bash
# Builds ONE copy-paste file for Perplexity (tablet-friendly, no zip).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docs/PERPLEXITY-ANIMATION-PROMPT-FULL.md"

{
  cat << 'HEADER'
# StructAI — Perplexity Gesamt-Prompt (Tablet: alles kopieren & einfügen)

**Kein ZIP nötig** — diese eine Datei = Auftrag + Brief + DESIGN_TOKENS + THEME_MODES + Code-Referenz.

## Tablet-Anleitung
1. GitHub Raw öffnen (Link unten) **oder** diese Datei im Repo öffnen
2. Alles markieren → Kopieren
3. Perplexity → Neuer Thread → Einfügen
4. Optional: 3–5 App-Screenshots anhängen
5. Senden

**Raw-Link:** https://raw.githubusercontent.com/Tenjire905/StructAI/develop/docs/PERPLEXITY-ANIMATION-PROMPT-FULL.md

Bei Zeichenlimit: erst Abschnitt A senden, dann B–E als zweite Nachricht.

---

# ABSCHNITT A — AUFTAG AN PERPLEXITY

HEADER

  cat << 'PROMPT'
Du bist Senior Mobile-UX-Psychologe und Motion Designer. Du reviewst StructAI (Expo/React Native, Prompt-Lern-App, Duolingo-artige Pfade).

Lies Abschnitt B–E vollständig.

Problem: App funktioniert, wirkt aber zu STARR für Gamification. Celebrations existieren, Peak-Momente landen nicht. Zwischen Taps fühlt es sich wie Formular an, nicht Spiel.

Aufgabe — sag EXAKT: WO / WANN / WIE Motion (Spring/Timing nur aus DESIGN_TOKENS), Playful vs. Focus.

Constraints: Reanimated 3, Design-Tokens only, keine Emoji-UI-Icons, 60fps Android, keine neuen Features.

Lieferung: Top 5 Quick Wins + Tabelle P0–P2 pro Screen + 3 ASCII-Storyboards (Schritt-Wechsel, Capstone incomplete, Pfad 100%).

---

PROMPT

  echo "# ABSCHNITT B — PRODUCT & VISUAL BRIEF"
  echo ""
  sed -n '/^## 1\. What StructAI is/,$p' "$ROOT/docs/PERPLEXITY-ANIMATION-BRIEF.md" | sed '/^## 11\. Tablet/,$d'

  echo ""
  echo "---"
  echo ""
  echo "# ABSCHNITT C — DESIGN_TOKENS.md"
  echo ""
  cat "$ROOT/DESIGN_TOKENS.md"

  echo ""
  echo "---"
  echo ""
  echo "# ABSCHNITT D — THEME_MODES.md"
  echo ""
  cat "$ROOT/THEME_MODES.md"

  cat << 'APPENDIX'

---

# ABSCHNITT E — ANIMATION CODE-REFERENZ

## Celebration-Typen
- orb_gain, lesson_complete, section_milestone, capstone_complete, path_complete, streak_milestone
- Playful: Confetti 24–48 Partikel | Focus: nur Lila-Puls

## Orb Companion States
idle, attentive, happy, low_energy, celebrating, sleepy

## Completion Screens
1. SectionMilestoneView (pb-8) — mittel
2. CapstoneIncompleteView (pb-45 + Skips) — State A
3. PathCompletionView (100%) — State B + Zertifikat

## Rigidity-Lücken
- Lektions-Schritte: kein Slide/Fade
- Kapitelliste: kein Status-Anim
- Pfad-Unlock: instant
- Orb selten in Lektion sichtbar
- Stack-Transitions: Standard Expo Router

*Ende — StructAI develop*

APPENDIX
} > "$OUT"

wc -l "$OUT" | awk '{print "✓ " NR " lines → " "'"$OUT"'"}'
