#!/usr/bin/env bash
# Stable Expo Go serving: local Metro + Cloudflare quick tunnel + auto-restart.
# (Expo's free ngrok tunnel drops often; Cloudflare+proxy URL is more durable here.)
set -euo pipefail
cd /workspace

LOG=/tmp/expo-stable.log
CF_LOG=/tmp/cf-tunnel.log
URL_FILE=/tmp/expo-url.txt
HTTPS_FILE=/tmp/expo-https-url.txt
WATCH_LOG=/tmp/expo-watchdog.log
echo $$ > /tmp/expo-watchdog.pid

log() { echo "[watchdog] $* at $(date -Is)" | tee -a "$WATCH_LOG"; }

kill_exact() {
  local pat="$1"
  local p
  for p in $(pgrep -f "$pat" || true); do
    # never kill this watchdog
    if [ "$p" = "$$" ]; then continue; fi
    if [ -f /tmp/expo-watchdog.pid ] && [ "$p" = "$(cat /tmp/expo-watchdog.pid)" ]; then continue; fi
    kill -9 "$p" 2>/dev/null || true
  done
}

start_stack() {
  log "starting stack"
  kill_exact 'node_modules/.bin/expo start'
  kill_exact '/tmp/cloudflared tunnel'
  kill_exact 'ngrok-bin-linux-x64/ngrok'
  sleep 2
  fuser -k 8081/tcp 2>/dev/null || true
  sleep 1
  rm -f "$CF_LOG" "$LOG"

  if [ ! -x /tmp/cloudflared ]; then
    log "missing /tmp/cloudflared"
    return 1
  fi

  nohup /tmp/cloudflared tunnel --protocol http2 --url http://127.0.0.1:8081 > "$CF_LOG" 2>&1 &
  echo $! > /tmp/cf.pid

  local HTTPS=""
  local i
  for i in $(seq 1 45); do
    HTTPS=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare.com' "$CF_LOG" 2>/dev/null | head -1 || true)
    if [ -n "$HTTPS" ]; then
      break
    fi
    sleep 1
  done
  if [ -z "$HTTPS" ]; then
    log "cloudflare URL missing"
    return 1
  fi

  # DNS can lag a few seconds
  for i in $(seq 1 30); do
    if curl -sf -m 5 "$HTTPS/status" >/dev/null 2>&1; then
      break
    fi
    # Metro not up yet is fine; DNS resolve failure means wait
    if curl -sf -m 3 http://127.0.0.1:8081/status >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done

  echo "$HTTPS" > "$HTTPS_FILE"
  echo "exp://${HTTPS#https://}" > "$URL_FILE"

  export CI=1
  export EXPO_NO_DOTENV=1
  export EXPO_NO_TELEMETRY=1
  export EXPO_PACKAGER_PROXY_URL="$HTTPS"
  nohup npx expo start --go --port 8081 > "$LOG" 2>&1 &
  echo $! > /tmp/expo-main.pid

  for i in $(seq 1 60); do
    if curl -sf -m 3 http://127.0.0.1:8081/status >/dev/null 2>&1; then
      # Wait until public DNS resolves before advertising ready
      for j in $(seq 1 40); do
        if curl -sf -m 8 "$HTTPS/status" >/dev/null 2>&1; then
          log "ready $(cat "$URL_FILE")"
          date +%s > /tmp/expo-ready-at
          curl -sS -m 120 -o /dev/null \
            "$HTTPS/node_modules/expo-router/entry.bundle?platform=android&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app" \
            || true
          return 0
        fi
        sleep 2
      done
      log "metro up but public DNS slow; keeping local URL $(cat "$URL_FILE")"
      date +%s > /tmp/expo-ready-at
      return 0
    fi
    sleep 2
  done
  log "metro failed to start"
  return 1
}

health_ok() {
  curl -sf -m 5 http://127.0.0.1:8081/status >/dev/null 2>&1 || return 1
  local HTTPS
  HTTPS=$(cat "$HTTPS_FILE" 2>/dev/null || true)
  [ -n "$HTTPS" ] || return 1
  # Grace period after start — Cloudflare DNS can lag without Metro being dead.
  local ready_at
  ready_at=$(cat /tmp/expo-ready-at 2>/dev/null || echo 0)
  local now
  now=$(date +%s)
  if [ $((now - ready_at)) -lt 90 ]; then
    return 0
  fi
  curl -sf -m 12 "$HTTPS/status" >/dev/null 2>&1 || return 1
  return 0
}

if health_ok; then
  log "adopting healthy existing stack $(cat "$URL_FILE" 2>/dev/null || echo unknown)"
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
  sleep 25
done
