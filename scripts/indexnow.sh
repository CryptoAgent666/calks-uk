#!/bin/bash
# IndexNow — notify search engines of updated pages after deploy
# Submits to Bing, Yandex, IndexNow.org hub (which redistributes)
# Usage: bash scripts/indexnow.sh

# Bing IndexNow key (verified in Bing Webmaster Tools)
KEY="7882a51cf9404b5d99e2096ac5c9dd78"
HOST="calks.uk"

# Collect all HTML pages from dist/
URLS=$(find dist -name 'index.html' | sed "s|dist|https://${HOST}|" | sed 's|/index.html||' | sed 's|$|/|' | sort)

# Build JSON payload (max 10,000 URLs per submission)
URL_ARRAY=$(echo "$URLS" | head -10000 | jq -R -s 'split("\n") | map(select(length > 0))')

curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"${HOST}\",
    \"key\": \"${KEY}\",
    \"keyLocation\": \"https://${HOST}/${KEY}.txt\",
    \"urlList\": ${URL_ARRAY}
  }" -w "\nHTTP %{http_code} — IndexNow: submitted $(echo "$URLS" | wc -l | tr -d ' ') URLs\n"
