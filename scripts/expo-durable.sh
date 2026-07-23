#!/usr/bin/env bash
# Durable Expo Go stack: Metro (LAN) + Cloudflare quick tunnel (http2).
# Restarts Metro and the tunnel independently. Publishes the live exp:// URL
# to /tmp/expo-url.txt. Avoids Expo's flaky built-in ngrok.
set -u
cd /workspace

METRO_LOG=/tmp/expo-stable.log
CF_LOG=/tmp/cf-live.log
WATCH_LOG=/tmp/expo-durable.log
URL_FILE=/tmp/expo-url.txt
HTTPS_FILE=/tmp/expo-https-url.txt
PID_FILE=/tmp/expo-durable.pid

echo $$ > "$PID_FILE"
mkdir -p /tmp

log() { echo "[durable $(date -Is)] $*" | tee -a "$WATCH_LOG"; }

is_self() {
  local p="$1"
  [ "$p" = "$$" ] && return 0
  [ -f "$PID_FILE" ] && [ "$p" = "$(cat "$PID_FILE" 2>/dev/null || true)" ] && return 0
  return 1
}

kill_pat_exact() {
  # Kill processes whose FULL cmdline matches the regex, never this watchdog.
  local regex="$1"
  local p cmd
  for p in $(pgrep -f "$regex" 2>/dev/null || true); do
    is_self "$p" && continue
    cmd=$(ps -p "$p" -o args= 2>/dev/null || true)
    # Skip shells that merely mention the pattern in their argv (tool wrappers).
    case "$cmd" in
      *'/bin/bash -O extglob'*|*cursor*snap*) continue ;;
    esac
    kill -9 "$p" 2>/dev/null || true
  done
}

metro_ok() {
  curl -sf -m 5 http://127.0.0.1:8081/status >/dev/null 2>&1
}

start_metro() {
  log "starting metro --lan :8081"
  kill_pat_exact 'node_modules/.bin/expo start'
  kill_pat_exact 'npm exec expo start'
  fuser -k 8081/tcp >/dev/null 2>&1 || true
  sleep 1
  : > "$METRO_LOG"
  export CI=1
  export EXPO_NO_DOTENV=1
  export EXPO_NO_TELEMETRY=1
  unset EXPO_PACKAGER_PROXY_URL || true
  nohup npx expo start --go --port 8081 --lan > "$METRO_LOG" 2>&1 &
  echo $! > /tmp/expo-main.pid
  local i
  for i in $(seq 1 60); do
    if metro_ok; then
      log "metro ready"
      return 0
    fi
    sleep 2
  done
  log "metro start FAILED — see $METRO_LOG"
  return 1
}

cf_pid() {
  pgrep -f '^/tmp/cloudflared tunnel --url http://127\.0\.0\.1:8081 --protocol http2' | head -1 || true
}

extract_cf_url() {
  python3 - <<'PY'
import re
try:
    text = open("/tmp/cf-live.log", "r", errors="ignore").read()
except OSError:
    raise SystemExit
ms = re.findall(r"https://[a-z0-9-]+\.trycloudflare\.com", text)
print(ms[-1] if ms else "")
PY
}

doh_a() {
  local host="$1"
  curl -s -m 8 "https://cloudflare-dns.com/dns-query?name=${host}&type=A" \
    -H 'accept: application/dns-json' 2>/dev/null | python3 -c '
import sys, json
try:
  d = json.load(sys.stdin)
  ans = d.get("Answer") or []
  print(next((a["data"] for a in ans if a.get("type") == 1), ""))
except Exception:
  pass
'
}

public_ok() {
  local https host ip
  https=$(cat "$HTTPS_FILE" 2>/dev/null || true)
  [ -n "$https" ] || return 1
  host=${https#https://}
  ip=$(doh_a "$host")
  [ -n "$ip" ] || return 1
  curl -sf -m 15 --resolve "${host}:443:${ip}" "${https}/status" >/dev/null 2>&1
}

publish_url() {
  local https="$1"
  [ -n "$https" ] || return 1
  echo "$https" > "$HTTPS_FILE"
  echo "exp://${https#https://}" > "$URL_FILE"
  log "url $(cat "$URL_FILE")"
}

start_cf() {
  log "starting cloudflared http2 quick tunnel"
  kill_pat_exact '^/tmp/cloudflared tunnel --url'
  # also clear legacy cloudflared without protocol flag
  kill_pat_exact '/tmp/cloudflared tunnel --url http://127.0.0.1:8081'
  sleep 1
  : > "$CF_LOG"
  if [ ! -x /tmp/cloudflared ]; then
    log "missing /tmp/cloudflared binary"
    return 1
  fi
  nohup /tmp/cloudflared tunnel --url http://127.0.0.1:8081 --protocol http2 --no-autoupdate \
    > "$CF_LOG" 2>&1 &
  echo $! > /tmp/cf-main.pid
  local i https
  for i in $(seq 1 45); do
    https=$(extract_cf_url)
    if [ -n "$https" ]; then
      publish_url "$https"
      # wait until DOH + status pass
      local j
      for j in $(seq 1 20); do
        if public_ok; then
          log "tunnel public OK"
          return 0
        fi
        sleep 2
      done
      log "tunnel URL issued but public probe still failing — keeping and retrying in loop"
      return 0
    fi
    sleep 2
  done
  log "cloudflared start FAILED — see $CF_LOG"
  return 1
}

ensure_stack() {
  if ! metro_ok; then
    start_metro || true
  fi
  local pid
  pid=$(cf_pid)
  if [ -z "$pid" ]; then
    start_cf || true
    return
  fi
  # Refresh URL from log if process is alive
  local https
  https=$(extract_cf_url)
  if [ -n "$https" ]; then
    publish_url "$https"
  fi
  if ! public_ok; then
    log "public tunnel unhealthy — bouncing cloudflared"
    start_cf || true
  fi
}

log "boot pid=$$"
ensure_stack

# Warm Android bundle once when healthy
if public_ok; then
  HTTPS=$(cat "$HTTPS_FILE")
  HOST=${HTTPS#https://}
  IP=$(doh_a "$HOST")
  if [ -n "$IP" ]; then
    curl -sS -m 120 -o /dev/null --resolve "${HOST}:443:${IP}" \
      "${HTTPS}/node_modules/expo-router/entry.bundle?platform=android&dev=true&hot=false&lazy=true" \
      || true
    log "bundle warm done"
  fi
fi

FAILS=0
while true; do
  if metro_ok && public_ok; then
    FAILS=0
  else
    FAILS=$((FAILS + 1))
    log "health fail count=$FAILS metro=$(metro_ok && echo ok || echo bad) public=$(public_ok && echo ok || echo bad)"
    ensure_stack
  fi
  # Keep URL file fresh
  https=$(extract_cf_url)
  if [ -n "$https" ]; then
    publish_url "$https" >/dev/null
  fi
  sleep 15
done
