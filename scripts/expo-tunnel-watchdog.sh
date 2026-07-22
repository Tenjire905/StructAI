#!/usr/bin/env bash
# Expo Go tunnel watchdog using Expo's official ngrok (*.exp.direct).
# Auto-restarts when Metro or the public tunnel dies.
set -euo pipefail
cd /workspace

LOG=/tmp/expo-stable.log
URL_FILE=/tmp/expo-url.txt
HTTPS_FILE=/tmp/expo-https-url.txt
WATCH_LOG=/tmp/expo-watchdog.log
echo $$ > /tmp/expo-watchdog.pid

log() { echo "[watchdog] $* at $(date -Is)" | tee -a "$WATCH_LOG"; }

kill_pat() {
  local pat="$1"
  local p
  for p in $(pgrep -f "$pat" || true); do
    if [ "$p" = "$$" ]; then continue; fi
    if [ -f /tmp/expo-watchdog.pid ] && [ "$p" = "$(cat /tmp/expo-watchdog.pid)" ]; then continue; fi
    kill -9 "$p" 2>/dev/null || true
  done
}

read_https() {
  curl -s -m 3 http://127.0.0.1:4040/api/tunnels 2>/dev/null | python3 -c "
import sys,json
try:
  d=json.load(sys.stdin)
  print(next(t['public_url'] for t in d.get('tunnels',[]) if t['public_url'].startswith('https')))
except Exception:
  pass
" 2>/dev/null || true
}

start_stack() {
  log "starting expo --tunnel"
  kill_pat 'node_modules/.bin/expo start'
  kill_pat 'ngrok-bin-linux-x64/ngrok'
  kill_pat '/tmp/cloudflared tunnel'
  sleep 2
  fuser -k 8081/tcp 2>/dev/null || true
  sleep 1
  rm -f "$LOG"

  export CI=1
  export EXPO_NO_DOTENV=1
  export EXPO_NO_TELEMETRY=1
  unset EXPO_PACKAGER_PROXY_URL || true
  nohup npx expo start --go --tunnel --port 8081 > "$LOG" 2>&1 &
  echo $! > /tmp/expo-main.pid

  local HTTPS=""
  local i
  for i in $(seq 1 90); do
    if curl -sf -m 3 http://127.0.0.1:8081/status >/dev/null 2>&1; then
      HTTPS=$(read_https)
      if [ -n "$HTTPS" ]; then
        echo "$HTTPS" > "$HTTPS_FILE"
        echo "exp://${HTTPS#https://}:80" > "$URL_FILE"
        if curl -sf -m 12 "$HTTPS/status" >/dev/null 2>&1; then
          log "ready $(cat "$URL_FILE")"
          date +%s > /tmp/expo-ready-at
          curl -sS -m 120 -o /dev/null \
            "$HTTPS/node_modules/expo-router/entry.bundle?platform=android&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app" \
            || true
          return 0
        fi
      fi
    fi
    sleep 2
  done
  log "start failed — see $LOG"
  return 1
}

health_ok() {
  curl -sf -m 5 http://127.0.0.1:8081/status >/dev/null 2>&1 || return 1
  local HTTPS
  HTTPS=$(cat "$HTTPS_FILE" 2>/dev/null || true)
  # Refresh URL from ngrok API if available
  local LIVE
  LIVE=$(read_https)
  if [ -n "$LIVE" ]; then
    HTTPS=$LIVE
    echo "$HTTPS" > "$HTTPS_FILE"
    echo "exp://${HTTPS#https://}:80" > "$URL_FILE"
  fi
  [ -n "$HTTPS" ] || return 1
  local ready_at now
  ready_at=$(cat /tmp/expo-ready-at 2>/dev/null || echo 0)
  now=$(date +%s)
  if [ $((now - ready_at)) -lt 120 ]; then
    return 0
  fi
  curl -sf -m 12 "$HTTPS/status" >/dev/null 2>&1 || return 1
  return 0
}

if health_ok; then
  log "adopting healthy stack $(cat "$URL_FILE" 2>/dev/null || true)"
  date +%s > /tmp/expo-ready-at
else
  start_stack || true
fi

FAILS=0
while true; do
  if health_ok; then
    FAILS=0
    curl -s -m 8 -o /dev/null "$(cat "$HTTPS_FILE")/status" || true
  else
    FAILS=$((FAILS + 1))
    log "health fail count=$FAILS"
    if [ "$FAILS" -ge 3 ]; then
      start_stack || true
      FAILS=0
    fi
  fi
  sleep 30
done
