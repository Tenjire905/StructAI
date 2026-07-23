#!/usr/bin/env bash
# Durable Expo Go stack: Metro (LAN) + Cloudflare quick tunnel (http2).
# Critical: EXPO_PACKAGER_PROXY_URL must be the public https origin WITHOUT :8081,
# otherwise Expo Go fetches launchAsset from host:8081 and fails through Cloudflare.
set -u
cd /workspace

METRO_LOG=/tmp/expo-stable.log
CF_LOG=/tmp/cf-live.log
WATCH_LOG=/tmp/expo-durable.log
URL_FILE=/tmp/expo-url.txt
HTTPS_FILE=/tmp/expo-https-url.txt
PID_FILE=/tmp/expo-durable.pid
PROXY_FILE=/tmp/expo-proxy-url.txt

echo $$ > "$PID_FILE"

log() { echo "[durable $(date -Is)] $*" | tee -a "$WATCH_LOG"; }

is_self() {
  local p="$1"
  [ "$p" = "$$" ] && return 0
  [ -f "$PID_FILE" ] && [ "$p" = "$(cat "$PID_FILE" 2>/dev/null || true)" ] && return 0
  return 1
}

kill_pat_exact() {
  local regex="$1"
  local p cmd
  for p in $(pgrep -f "$regex" 2>/dev/null || true); do
    is_self "$p" && continue
    cmd=$(ps -p "$p" -o args= 2>/dev/null || true)
    case "$cmd" in
      *'/bin/bash -O extglob'*|*dump_bash_state*) continue ;;
    esac
    kill -9 "$p" 2>/dev/null || true
  done
}

metro_ok() {
  curl -sf -m 5 http://127.0.0.1:8081/status >/dev/null 2>&1
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

publish_url() {
  local https="$1"
  [ -n "$https" ] || return 1
  echo "$https" > "$HTTPS_FILE"
  # Expo Go must use HTTPS scheme against Cloudflare (TLS on 443).
  echo "exps://${https#https://}" > "$URL_FILE"
  echo "$https" > "$PROXY_FILE"
  log "url $(cat "$URL_FILE")"
}

public_status_ok() {
  local https host ip
  https=$(cat "$HTTPS_FILE" 2>/dev/null || true)
  [ -n "$https" ] || return 1
  host=${https#https://}
  ip=$(doh_a "$host")
  [ -n "$ip" ] || return 1
  curl -sf -m 15 --resolve "${host}:443:${ip}" "${https}/status" >/dev/null 2>&1
}

# Manifest must advertise bundle URLs on :443 (no :8081).
manifest_port_ok() {
  local https host ip body
  https=$(cat "$HTTPS_FILE" 2>/dev/null || true)
  [ -n "$https" ] || return 1
  host=${https#https://}
  ip=$(doh_a "$host")
  [ -n "$ip" ] || return 1
  body=$(curl -s -m 20 --resolve "${host}:443:${ip}" \
    -H 'accept: application/expo+json' \
    -H 'expo-platform: android' \
    "${https}/" 2>/dev/null || true)
  [ -n "$body" ] || return 1
  python3 - "$body" "$https" <<'PY'
import json, sys
raw, origin = sys.argv[1], sys.argv[2]
try:
  m = json.loads(raw)
except Exception:
  raise SystemExit(1)
url = (m.get("launchAsset") or {}).get("url") or ""
# Fail if Metro leaked LAN port 8081 into the public URL.
if ":8081" in url:
  raise SystemExit(2)
if not url.startswith(origin):
  # Allow origin with no trailing path differences
  if not url.startswith(origin.rstrip("/") ):
    raise SystemExit(3)
raise SystemExit(0)
PY
}

start_metro() {
  local proxy="${1:-}"
  log "starting metro --lan :8081 proxy=${proxy:-none}"
  kill_pat_exact 'node_modules/.bin/expo start'
  kill_pat_exact 'npm exec expo start'
  fuser -k 8081/tcp >/dev/null 2>&1 || true
  sleep 1
  : > "$METRO_LOG"
  export CI=1
  export EXPO_NO_DOTENV=1
  export EXPO_NO_TELEMETRY=1
  if [ -n "$proxy" ]; then
    export EXPO_PACKAGER_PROXY_URL="$proxy"
    export REACT_NATIVE_PACKAGER_HOSTNAME="${proxy#https://}"
  else
    unset EXPO_PACKAGER_PROXY_URL || true
    unset REACT_NATIVE_PACKAGER_HOSTNAME || true
  fi
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

start_cf() {
  log "starting cloudflared http2 quick tunnel"
  kill_pat_exact '^/tmp/cloudflared tunnel --url'
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
      local j
      for j in $(seq 1 20); do
        if public_status_ok; then
          log "tunnel public OK"
          return 0
        fi
        sleep 2
      done
      log "tunnel URL issued but public probe still failing"
      return 0
    fi
    sleep 2
  done
  log "cloudflared start FAILED — see $CF_LOG"
  return 1
}

ensure_metro_proxy() {
  local https desired current
  https=$(cat "$HTTPS_FILE" 2>/dev/null || true)
  [ -n "$https" ] || return 0
  desired="$https"
  current=$(cat "$PROXY_FILE" 2>/dev/null || true)
  # Always restart metro if proxy env may be missing or manifest still has :8081
  if ! manifest_port_ok; then
    log "manifest has bad packager URL — restarting metro with EXPO_PACKAGER_PROXY_URL=$desired"
    start_metro "$desired" || true
    return
  fi
  # Keep PROXY_FILE in sync
  echo "$desired" > "$PROXY_FILE"
}

ensure_stack() {
  if ! metro_ok; then
    local proxy
    proxy=$(cat "$HTTPS_FILE" 2>/dev/null || true)
    start_metro "${proxy:-}" || true
  fi

  local pid
  pid=$(cf_pid)
  if [ -z "$pid" ]; then
    start_cf || true
  else
    local https
    https=$(extract_cf_url)
    if [ -n "$https" ]; then
      publish_url "$https"
    fi
    if ! public_status_ok; then
      log "public tunnel unhealthy — bouncing cloudflared"
      start_cf || true
    fi
  fi

  ensure_metro_proxy
}

log "boot pid=$$"
: > "$WATCH_LOG"
log "boot pid=$$"
ensure_stack

# Warm + verify
if public_status_ok && manifest_port_ok; then
  HTTPS=$(cat "$HTTPS_FILE")
  HOST=${HTTPS#https://}
  IP=$(doh_a "$HOST")
  if [ -n "$IP" ]; then
    curl -sS -m 120 -o /dev/null --resolve "${HOST}:443:${IP}" \
      "${HTTPS}/node_modules/expo-router/entry.bundle?platform=android&dev=true&hot=false&lazy=true" \
      || true
    log "bundle warm done"
  fi
  log "READY $(cat "$URL_FILE")"
else
  log "stack not fully ready yet — loop will repair"
fi

FAILS=0
while true; do
  if metro_ok && public_status_ok && manifest_port_ok; then
    FAILS=0
  else
    FAILS=$((FAILS + 1))
    log "health fail count=$FAILS metro=$(metro_ok && echo ok || echo bad) public=$(public_status_ok && echo ok || echo bad) manifest=$(manifest_port_ok && echo ok || echo bad)"
    # Require 2 consecutive fails before bouncing tunnel to reduce URL churn
    if [ "$FAILS" -ge 2 ]; then
      ensure_stack
      FAILS=0
    fi
  fi
  https=$(extract_cf_url)
  if [ -n "$https" ]; then
    publish_url "$https" >/dev/null
  fi
  sleep 15
done
