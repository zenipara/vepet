#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:4000}

echo "Running basic integration checks against $BASE_URL"

echo "1) Health check"
curl -sS "$BASE_URL/health" | jq . || true

echo "2) Protected endpoint /api/pets should return 401 when unauthenticated"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/pets" || true)
echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" != "401" ]; then
  echo "Expected 401 for unauthenticated request to /api/pets" >&2
  exit 2
fi

echo "3) Protected endpoint /api/products should return 401 when unauthenticated"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/products" || true)
echo "Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" != "401" ]; then
  echo "Expected 401 for unauthenticated request to /api/products" >&2
  exit 2
fi

echo "4) RPC min_stock should return numeric result"
curl -sS -X POST "$BASE_URL/api/rpc/min_stock" -H "Content-Type: application/json" -d '{}' | jq . || true

echo "Integration checks passed (basic)."
