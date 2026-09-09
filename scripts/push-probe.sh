#!/usr/bin/env bash
# Owner-side push probe for one workspace user, no Swagger needed.
#   ETHORA_EMAIL=owner@x ETHORA_PASSWORD=... scripts/push-probe.sh example.chat-qa.ethora.com <receiver xmpp username>
# Prints: platform toggle + quota before, POST /push/user result, quota after.
set -euo pipefail
WS="${1:?workspace host}"; JID="${2:?receiver xmpp username}"
DOMAIN_NAME="${WS%%.*}"; DOMAIN="${WS#*.}"; API="https://api.${DOMAIN}/v1"
APP_ID=$(curl -sf "${API}/apps/get-config?domainName=${DOMAIN_NAME}" | python3 -c 'import json,sys; print(json.load(sys.stdin)["result"]["_id"])')
TOKEN=$(curl -sf -X POST "${API}/users/login-with-email" -H 'Content-Type: application/json' \
  -d "{\"email\":\"${ETHORA_EMAIL}\",\"password\":\"${ETHORA_PASSWORD}\"}" | python3 -c 'import json,sys; print(json.load(sys.stdin)["token"])')
echo "appId: ${APP_ID}"
echo "before: $(curl -s "${API}/push/platform/${APP_ID}" -H "Authorization: Bearer ${TOKEN}")"
echo "send:   $(curl -s -X POST "${API}/push/user/${APP_ID}" -H "Authorization: Bearer ${TOKEN}" -H 'Content-Type: application/json' -d "{\"jid\":\"${JID}\",\"title\":\"probe\",\"text\":\"push probe $(date +%H:%M:%S)\"}")"
sleep 3
echo "after:  $(curl -s "${API}/push/platform/${APP_ID}" -H "Authorization: Bearer ${TOKEN}")"
