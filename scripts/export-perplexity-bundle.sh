#!/usr/bin/env bash
# Creates a Perplexity-ready zip: docs + animation-relevant source (no node_modules).
# Usage: ./scripts/export-perplexity-bundle.sh [output-dir]

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-$ROOT/artifacts}"
mkdir -p "$OUT_DIR"

BRANCH="${EXPORT_BRANCH:-develop}"
ZIP="$OUT_DIR/structai-perplexity-bundle.zip"
LOG="$OUT_DIR/RECENT-DEVELOP-LOG.txt"

cd "$ROOT"

git fetch origin "$BRANCH" 2>/dev/null || true
git log "origin/$BRANCH" -30 --oneline > "$LOG" 2>/dev/null || git log "$BRANCH" -30 --oneline > "$LOG"

git archive "$BRANCH" \
  --format=zip \
  --output "$ZIP" \
  -- \
  docs/PERPLEXITY-ANIMATION-BRIEF.md \
  DESIGN_TOKENS.md \
  THEME_MODES.md \
  product-integration/ROADMAP.md \
  app/_layout.tsx \
  app/\(tabs\)/ \
  app/lektion/ \
  app/lernpfad/ \
  app/onboarding/ \
  components/ \
  theme/ \
  hooks/useOrbCompanionState.ts \
  lib/pathProgress.ts \
  lib/pathCapstone.ts \
  lib/pathUnlock.ts \
  store/progressStore.ts \
  package.json \
  tsconfig.json \
  babel.config.js

# Append brief + log into zip root for single-file upload convenience
TMP=$(mktemp -d)
unzip -q "$ZIP" -d "$TMP"
cp "$ROOT/docs/PERPLEXITY-ANIMATION-BRIEF.md" "$TMP/"
cp "$LOG" "$TMP/"
(cd "$TMP" && zip -qr "$ZIP" .)

rm -rf "$TMP"

BYTES=$(wc -c < "$ZIP" | tr -d ' ')
echo ""
echo "✓ Perplexity bundle ready"
echo "  File: $ZIP"
echo "  Size: $BYTES bytes ($(du -h "$ZIP" | cut -f1))"
echo "  Branch: $BRANCH"
echo ""
echo "Upload to Perplexity:"
echo "  1. Open perplexity.ai → New Thread (Pro recommended for file upload)"
echo "  2. Attach: $ZIP"
echo "  3. Paste the prompt from docs/PERPLEXITY-ANIMATION-BRIEF.md section 12"
echo ""
echo "Optional: also attach 3–5 screenshots (Home, Path detail, Lesson complete, Capstone, Playful vs Focus)"
