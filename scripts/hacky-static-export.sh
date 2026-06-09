#!/usr/bin/env bash
set -euo pipefail

if lsof -iTCP:3000 -sTCP:LISTEN -t > /dev/null 2>&1; then
  echo "Error: port 3000 is already in use." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT="$PROJECT_ROOT/static-export"

cd "$PROJECT_ROOT"

export VERCEL_GIT_COMMIT_SHA="$(git rev-parse HEAD)"
export VERCEL_GIT_COMMIT_MESSAGE="$(git log -1 --pretty=%B)"
export NEXT_PUBLIC_FAKE_STATIC_EXPORT=true
export NEXT_PUBLIC_FORCE_PROJECT=osmapp.org
export NEXT_PUBLIC_OG_IMAGE_FETCHER_HOST=https://osmapp-preview.vercel.app
export NEXT_PUBLIC_API_KEY_MAPTILER=yd6CSMQpAwnAcPVZwWQ6

yarn build

rm -rf "$OUT"
cp -r public "$OUT"
mkdir -p "$OUT/_next"
cp -r .next/static "$OUT/_next"

yarn start > /dev/null 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT
for i in $(seq 1 5); do curl -sf localhost:3000/node/6 > /dev/null 2>&1 && break; sleep 5; done

echo "> Checking SSR..."
if curl --silent --fail localhost:3000/node/6 | grep -q "Originally Detonátor route (this message used for SSR check)"; then
    echo "SSR OK"
else
    echo "SSR FAILED"; exit 1
fi

echo "> Get index.html and 404.html..."
curl -s --cookie "hideHomepage=yes" localhost:3000 > "$OUT/index.html"
curl -s --cookie "hideHomepage=yes" localhost:3000 > "$OUT/404.html"

for lang in $(node --input-type=module <<<'import { LANGUAGES } from "./src/config.mjs"; process.stdout.write(Object.keys(LANGUAGES).join("\n")+"\n");'); do
  echo "> Get language $lang..."
  mkdir -p "$OUT/$lang"
  curl -s --cookie "hideHomepage=yes; lang=$lang" localhost:3000 > "$OUT/$lang/index.html"
done

echo "> Get Prague node page..."
mkdir -p "$OUT/node/1601837931"
curl -s --cookie "hideHomepage=yes" localhost:3000/node/1601837931 > "$OUT/node/1601837931/index.html"

echo ""
echo "Output in: $OUT"
