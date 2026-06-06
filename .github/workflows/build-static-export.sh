#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUT="$PROJECT_ROOT/static-export"

cd "$PROJECT_ROOT"

export VERCEL_GIT_COMMIT_SHA="$(git rev-parse HEAD)"
export VERCEL_GIT_COMMIT_MESSAGE="$(git log -1 --pretty=%B)"
export NEXT_PUBLIC_FAKE_STATIC_EXPORT=true
export NEXT_PUBLIC_FORCE_PROJECT=osmapp.org
export NEXT_PUBLIC_OG_IMAGE_FETCHER_HOST=https://osmapp-preview.vercel.app

yarn build

rm -rf "$OUT"
cp -r public "$OUT"
mkdir -p "$OUT/_next"
cp -r .next/static "$OUT/_next"

if lsof -iTCP:3000 -sTCP:LISTEN -t > /dev/null 2>&1; then
  echo "Error: port 3000 is already in use." >&2
  exit 1
fi

yarn start &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT

echo "Waiting for server to start..."
for i in $(seq 1 20); do
  curl -sf http://localhost:3000 > /dev/null 2>&1 && break
  sleep 1
done

curl --cookie "hideHomepage=yes" http://localhost:3000 > "$OUT/index.html"
curl --cookie "hideHomepage=yes" http://localhost:3000 > "$OUT/404.html"

for lang in $(node --input-type=module <<<'import { LANGUAGES } from "./src/config.mjs"; process.stdout.write(Object.keys(LANGUAGES).join("\n")+"\n");'); do
  mkdir -p "$OUT/$lang"
  curl --cookie "hideHomepage=yes; lang=$lang" http://localhost:3000 > "$OUT/$lang/index.html"
done

mkdir -p "$OUT/node/1601837931"
curl --cookie "hideHomepage=yes" http://localhost:3000/node/1601837931 > "$OUT/node/1601837931/index.html"

echo "Done. Output in: $OUT"
