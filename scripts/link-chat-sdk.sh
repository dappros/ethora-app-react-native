#!/usr/bin/env bash
# Test @ethora/chat-component-rn changes WITHOUT publishing to npm.
#
#   scripts/link-chat-sdk.sh          # build ../ethora-chat-component-rn and copy it into node_modules
#   scripts/link-chat-sdk.sh restore  # go back to the version from package.json (npm install)
#
# Copies lib/ (built with bob) and src/ into node_modules/@ethora/chat-component-rn.
# Metro picks the change up on the next reload (no re-install, no native rebuild -
# unless the SDK change touches native code or config plugins).
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SDK_DIR="${SDK_DIR:-$APP_DIR/../ethora-chat-component-rn}"
DEST="$APP_DIR/node_modules/@ethora/chat-component-rn"

if [[ "${1:-}" == "restore" ]]; then
  echo "Restoring @ethora/chat-component-rn from package.json..."
  (cd "$APP_DIR" && npm install @ethora/chat-component-rn@"$(node -p "require('./package.json').dependencies['@ethora/chat-component-rn']")" --no-save --silent)
  echo "done: $(node -p "require('$DEST/package.json').version")"
  exit 0
fi

[[ -d "$SDK_DIR/src" ]] || { echo "SDK not found at $SDK_DIR (set SDK_DIR=...)" >&2; exit 1; }

echo "Building $SDK_DIR..."
(cd "$SDK_DIR" && npx bob build >/dev/null)

echo "Copying lib/ and src/ into $DEST..."
rsync -a --delete "$SDK_DIR/lib/" "$DEST/lib/"
rsync -a --delete "$SDK_DIR/src/" "$DEST/src/"
cp "$SDK_DIR/CHANGELOG.md" "$DEST/CHANGELOG.md" 2>/dev/null || true

SDK_VER=$(node -p "require('$SDK_DIR/package.json').version")
echo "Linked local SDK $SDK_VER (package.json still pins $(node -p "require('$APP_DIR/package.json').dependencies['@ethora/chat-component-rn']"))."
echo "Reload the app (r in Metro / shake -> Reload). Run 'scripts/link-chat-sdk.sh restore' to undo."
