#!/usr/bin/env bash
# Expo Go tunnel via Expo ws-tunnel (boltexpo.dev).
# ngrok/exp.direct is unavailable here (shared token session limit).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${EXPO_PORT:-8081}"

pkill -f cloudflared 2>/dev/null || true
tmux kill-session -t cloudflared-tunnel 2>/dev/null || true
tmux kill-session -t expo-tunnel-dev 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
sleep 2

rm -f /tmp/expo-dev.log

tmux new-session -d -s expo-tunnel-dev -c "$ROOT" -- \
  "${SHELL:-bash}" -lc "EXPO_FORCE_WEBCONTAINER_ENV=true npx expo start --port ${PORT} --tunnel --clear 2>&1 | tee /tmp/expo-dev.log"

for _ in $(seq 1 90); do
  if curl -sf "http://127.0.0.1:${PORT}/status" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

EXP_URL=""
for _ in $(seq 1 90); do
  HOST=$(rg -o '[a-z0-9]+\.boltexpo\.dev' /tmp/expo-dev.log 2>/dev/null | head -1 || true)
  if [ -n "$HOST" ]; then
    EXP_URL="exp://${HOST}"
    break
  fi
  sleep 2
done

if [ -z "$EXP_URL" ]; then
  echo "Expo tunnel URL not ready — check tmux session expo-tunnel-dev" >&2
  tail -40 /tmp/expo-dev.log >&2 || true
  exit 1
fi

BUNDLE_URL=$(curl -sf -H "expo-platform: android" "http://127.0.0.1:${PORT}/" \
  | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).launchAsset.url")
echo "Pre-warming bundle..."
curl -sf --max-time 240 "$BUNDLE_URL" -o /dev/null

echo "$EXP_URL" > /tmp/expo-tunnel-url.txt

if node "$ROOT/scripts/print-expo-qr.mjs" "$EXP_URL" 2>/dev/null; then
  :
else
  echo "Expo Go URL: $EXP_URL"
fi

echo "Expo Go URL: $EXP_URL"
