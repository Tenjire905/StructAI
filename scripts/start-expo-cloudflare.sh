#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLOUDFLARED="${CLOUDFLARED_BIN:-/tmp/cloudflared}"
PORT="${EXPO_PORT:-8081}"

echo "Note: cloudflared quick tunnels are unreliable in this VM (HTTP 530)." >&2
echo "Use scripts/start-expo-tunnel.sh (Expo exp.direct) instead." >&2
exit 1

tmux -f /exec-daemon/tmux.portal.conf kill-session -t cloudflared-tunnel 2>/dev/null || true
tmux -f /exec-daemon/tmux.portal.conf kill-session -t expo-tunnel-dev 2>/dev/null || true

tmux -f /exec-daemon/tmux.portal.conf new-session -d -s cloudflared-tunnel -c "$ROOT" -- \
  "${SHELL:-bash}" -lc "rm -f /tmp/cloudflared.log; $CLOUDFLARED tunnel --url http://127.0.0.1:$PORT 2>&1 | tee /tmp/cloudflared.log"

HOST=""
for _ in $(seq 1 45); do
  HOST=$(rg -o 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cloudflared.log 2>/dev/null | head -1 | sed 's|https://||')
  if [ -n "$HOST" ]; then
    break
  fi
  sleep 1
done

if [ -z "$HOST" ]; then
  echo "cloudflared hostname not ready" >&2
  tail -20 /tmp/cloudflared.log >&2 || true
  exit 1
fi

EXP_PRIMARY="exp+https://${HOST}"
EXP_FALLBACK="exp://${HOST}"
echo "$EXP_PRIMARY" > /tmp/expo-tunnel-url.txt

tmux -f /exec-daemon/tmux.portal.conf new-session -d -s expo-tunnel-dev -c "$ROOT" -- \
  "${SHELL:-bash}" -lc "REACT_NATIVE_PACKAGER_HOSTNAME=${HOST} EXPO_PACKAGER_PROXY_URL=https://${HOST} EXPO_DEV_SERVER_ORIGIN=https://${HOST} npx expo start --port ${PORT} --clear"

for _ in $(seq 1 90); do
  if curl -sf "http://127.0.0.1:${PORT}/status" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "Pre-warming Android bundle (may take ~30s)..."
curl -sf --max-time 240 \
  "https://${HOST}/node_modules/expo-router/entry.bundle?platform=android&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app&unstable_transformProfile=hermes-stable" \
  -o /dev/null

node "$ROOT/scripts/print-expo-qr.mjs" "$EXP_PRIMARY"

echo "Expo primary URL:   $EXP_PRIMARY"
echo "Expo fallback URL:  $EXP_FALLBACK"
echo "HTTPS manifest OK:  https://${HOST}"
