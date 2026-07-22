#!/usr/bin/env bash
# Keeps Expo Go tunnel alive: health-check + auto-restart on death.
set -euo pipefail
cd /workspace

LOG=/tmp/expo-stable.log
URL_FILE=/tmp/expo-url.txt
HTTPS_FILE=/tmp/expo-https-url.txt
PID_FILE=/tmp/expo-watchdog.pid
echo $$ > "$PID_FILE"

start_expo() {
  echo "[watchdog] starting expo at $(date -Is)" | tee -a /tmp/expo-watchdog.log
  # Kill previous metro/ngrok by exact binaries only
  for p in $(pgrep -f 'node_modules/.bin/expo start' || true); do
    kill -9 "$p" 2>/dev/null || true
  done
  for p in $(pgrep -f 'ngrok-bin-linux-x64/ngrok' || true); do
    kill -9 "$p" 2>/dev/null || true
  done
  sleep 2
  fuser -k 8081/tcp 2>/dev/null || true
  sleep 1

  export CI=1
  export EXPO_NO_DOTENV=1
  export EXPO_NO_TELEMETRY=1
  nohup npx expo start --go --tunnel --port 8081 > "$LOG" 2>&1 &
  echo $! > /tmp/expo-main.pid

  # Wait for tunnel API
  for i in $(seq 1 60); do
    if curl -sf -m 3 http://127.0.0.1:8081/status >/dev/null 2>&1; then
      break
    fi
    sleep 2
  done

  for i in $(seq 1 45); do
    HTTPS=$(curl -s -m 3 http://127.0.0.1:4040/api/tunnels 2>/dev/null | python3 -c "
import sys,json
try:
  d=json.load(sys.stdin)
  print(next(t['public_url'] for t in d.get('tunnels',[]) if t['public_url'].startswith('https')))
except Exception:
  pass
" 2>/dev/null || true)
    if [ -n "${HTTPS:-}" ]; then
      echo "$HTTPS" > "$HTTPS_FILE"
      echo "exp://${HTTPS#https://}:80" > "$URL_FILE"
      echo "[watchdog] ready $(cat "$URL_FILE")" | tee -a /tmp/expo-watchdog.log
      # Prewarm android bundle so first phone open does not timeout
      curl -sS -m 120 -o /dev/null \
        "$HTTPS/node_modules/expo-router/entry.bundle?platform=android&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app" \
        || true
      return 0
    fi
    sleep 2
  done
  echo "[watchdog] tunnel URL not ready" | tee -a /tmp/expo-watchdog.log
  return 1
}

health_ok() {
  curl -sf -m 5 http://127.0.0.1:8081/status >/dev/null 2>&1 || return 1
  HTTPS=$(cat "$HTTPS_FILE" 2>/dev/null || true)
  if [ -z "$HTTPS" ]; then
    return 1
  fi
  curl -sf -m 10 "$HTTPS/status" >/dev/null 2>&1 || return 1
  return 0
}

# Initial start
start_expo || true

FAILS=0
while true; do
  if health_ok; then
    FAILS=0
    # light keepalive
    curl -s -m 5 -o /dev/null "$(cat "$HTTPS_FILE")/status" || true
  else
    FAILS=$((FAILS + 1))
    echo "[watchdog] health fail count=$FAILS at $(date -Is)" | tee -a /tmp/expo-watchdog.log
    if [ "$FAILS" -ge 2 ]; then
      start_expo || true
      FAILS=0
    fi
  fi
  sleep 20
done
