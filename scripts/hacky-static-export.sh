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
# Killing only the yarn wrapper ($SERVER_PID) leaves the actual `next-server`
# listener orphaned on port 3000. A stale server then keeps answering and makes
# the SSR check below validate outdated output on the next run. So also kill
# whatever is really listening on the port, plus its render-worker children.
cleanup() {
  local listener
  listener="$(lsof -tiTCP:3000 -sTCP:LISTEN 2>/dev/null | head -n1 || true)"
  if [ -n "$listener" ]; then
    pkill -P "$listener" 2>/dev/null || true
    kill "$listener" 2>/dev/null || true
  fi
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT
for i in $(seq 1 5); do curl -sf localhost:3000/node/6 > /dev/null 2>&1 && break; sleep 5; done

echo "> Checking SSR..."
# Capture the whole response before grepping: piping curl into `grep -q` makes
# grep close the pipe on its first match, so curl gets SIGPIPE and exits non-zero
# while still writing the body. Under `set -o pipefail` that fails the pipeline
# and reports "SSR FAILED" even though the string was found (passes when run by
# hand without pipefail). A here-string avoids the pipe entirely.
SSR_HTML="$(curl --silent --fail localhost:3000/node/6 || true)"
if grep -q "Originally Detonátor route (this message used for SSR check)" <<< "$SSR_HTML"; then
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
