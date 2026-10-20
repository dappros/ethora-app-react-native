#!/bin/sh
# Checks the Swift port of callKitUuid against the SDK's JS implementation.
# Usage: modules/ethora-voip/check/run.sh   (needs swiftc and node)
set -e
dir="$(cd "$(dirname "$0")" && pwd)"
out="$(mktemp -d)"
swiftc -o "$out/uuid" "$dir/../ios/CallKitUuid.swift" "$dir/main.swift"
sdk="$dir/../../../node_modules/@ethora/chat-component-rn/lib/commonjs/components/VideoCalls/systemCall.js"
status=0
for seed in "call-1" "6710f0c2a1b3" "" "Ж-звонок-é" "a-very-long-call-id-that-is-longer-than-thirty-two-characters" "😀-emoji"; do
  swift_uuid="$("$out/uuid" "$seed")"
  js_uuid="$(node -e "
    // systemCall.js needs react-native only for Platform.
    const Module = require('module');
    const load = Module._load;
    Module._load = (req, ...rest) =>
      req === 'react-native' ? { Platform: { OS: 'ios' } } : load(req, ...rest);
    const m = require(process.argv[1]);
    console.log(m.callKitUuid(process.argv[2]));
  " "$sdk" "$seed" 2>/dev/null || true)"
  if [ -z "$js_uuid" ]; then
    echo "cannot load $sdk (build and sync the SDK first)"; exit 1
  fi
  if [ "$swift_uuid" = "$js_uuid" ]; then
    echo "ok   '$seed' $swift_uuid"
  else
    echo "FAIL '$seed' swift=$swift_uuid js=$js_uuid"; status=1
  fi
done
rm -rf "$out"
exit $status
