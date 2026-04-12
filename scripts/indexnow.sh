#!/bin/bash
# IndexNow — notify search engines of updated pages after deploy
# Usage: bash scripts/indexnow.sh

KEY="59c9c53775874ba8b35667b15cfc3780"
HOST="calks.uk"

# Collect all HTML pages from dist/
URLS=$(find dist -name 'index.html' | sed "s|dist|https://${HOST}|" | sed 's|/index.html||' | sed 's|$|/|' | sort)

# Build JSON payload
URL_ARRAY=$(echo "$URLS" | head -500 | jq -R -s 'split("\n") | map(select(length > 0))')

curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"${HOST}\",
    \"key\": \"${KEY}\",
    \"urlList\": ${URL_ARRAY}
  }" && echo " IndexNow: submitted $(echo "$URLS" | wc -l | tr -d ' ') URLs"
