#!/usr/bin/env bash
# Toggle / inspect "platform push delivery" for a workspace without Swagger.
#
#   ETHORA_EMAIL=owner@example.com ETHORA_PASSWORD=secret \
#     scripts/push-platform.sh app.chat-qa.ethora.com status
#   ... scripts/push-platform.sh app.chat-qa.ethora.com enable
#   ... scripts/push-platform.sh app.chat-qa.ethora.com disable
#
# Resolves appId via /v1/apps/get-config, logs in with the owner's email and
# password, then calls GET / PUT /v1/push/platform/:appId.
set -euo pipefail

WORKSPACE="${1:-}"
ACTION="${2:-status}"
if [[ -z "$WORKSPACE" || -z "${ETHORA_EMAIL:-}" || -z "${ETHORA_PASSWORD:-}" ]]; then
  echo "usage: ETHORA_EMAIL=... ETHORA_PASSWORD=... $0 <workspace host> [status|enable|disable]" >&2
  exit 1
fi

DOMAIN_NAME="${WORKSPACE%%.*}"
DOMAIN="${WORKSPACE#*.}"
API="https://api.${DOMAIN}/v1"

APP_ID=$(curl -sf "${API}/apps/get-config?domainName=${DOMAIN_NAME}" \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print((d.get("result") or d.get("data") or d)["_id"])')
echo "workspace: ${WORKSPACE}  appId: ${APP_ID}"

TOKEN=$(curl -sf -X POST "${API}/users/login-with-email" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"${ETHORA_EMAIL}\",\"password\":\"${ETHORA_PASSWORD}\"}" \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["token"])')

case "$ACTION" in
  status)
    curl -s "${API}/push/platform/${APP_ID}" -H "Authorization: Bearer ${TOKEN}"; echo ;;
  enable|disable)
    ENABLED=$([[ "$ACTION" == enable ]] && echo true || echo false)
    curl -s -X PUT "${API}/push/platform/${APP_ID}" \
      -H "Authorization: Bearer ${TOKEN}" -H 'Content-Type: application/json' \
      -d "{\"enabled\":${ENABLED}}"; echo
    curl -s "${API}/push/platform/${APP_ID}" -H "Authorization: Bearer ${TOKEN}"; echo ;;
  *) echo "unknown action: ${ACTION}" >&2; exit 1 ;;
esac
