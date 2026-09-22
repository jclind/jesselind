#!/usr/bin/env bash
# Quick sanity check before deploying: builds the site, serves the build, and
# checks that key pages, the sitemap, the game files and the GA config come
# back as expected. Does not replace a look in the browser.
#
# Usage: npm run smoke
set -uo pipefail
cd "$(dirname "$0")/.."

PORT=4399
BASE="http://localhost:$PORT"
fails=0
pass() { printf '  ok    %s\n' "$1"; }
fail() { printf '  FAIL  %s\n' "$1"; fails=$((fails + 1)); }

node_ok=$(node -p 'const [a, b] = process.versions.node.split(".").map(Number); a > 22 || (a === 22 && b >= 12)')
[ "$node_ok" = true ] && pass "node $(node -v)" || fail "node $(node -v), astro 7 needs >=22.12"

echo "building..."
log=$(npm run build 2>&1) || { echo "$log" | tail -20; fail "build"; exit 1; }
pass "build: $(echo "$log" | grep -o '[0-9]* page(s) built')"
echo "$log" | grep -q '\[WARN\]' && fail "build warnings: $(echo "$log" | grep -c '\[WARN\]')" || pass "no build warnings"

# --ignore-lock runs a private server in the foreground. Without it, astro 7
# reuses (and `preview stop` would kill) any background preview already running.
npx astro preview --port "$PORT" --ignore-lock >/dev/null 2>&1 &
server=$!
trap 'kill "$server" 2>/dev/null' EXIT
for _ in $(seq 20); do curl -s -o /dev/null "$BASE/" && break; sleep 0.5; done

for path in / /contact/ /projects/tridle/ /files/notes/ /files/notes/hello-world/ \
  /files/notes/nurture/ /files/notes/building-a-computer/ /files/media/ \
  /sitemap-index.xml /sitemap-0.xml /game/files.json /robots.txt; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$path")
  [ "$code" = 200 ] && pass "$path" || fail "$path -> $code"
done

urls=$(curl -s "$BASE/sitemap-0.xml" | grep -o '<loc>' | wc -l | tr -d ' ')
[ "$urls" -ge 20 ] && pass "sitemap has $urls URLs" || fail "sitemap has $urls URLs, expected 20+"

curl -s "$BASE/" | grep -q 'const GOOGLE_ANALYTICS_ID = "G-' && pass "GA ID defined in page" || fail "GA ID missing from page"
curl -s "$BASE/" | grep -q '<astro-island' && pass "React islands present" || fail "no React islands on /"

echo
[ "$fails" -eq 0 ] && echo "all checks passed" || { echo "$fails check(s) failed"; exit 1; }
