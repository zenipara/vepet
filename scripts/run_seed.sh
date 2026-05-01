#!/usr/bin/env bash
set -euo pipefail

# Helper script to run the seed script with Service Role key safely.
# Usage:
#   SUPABASE_SERVICE_ROLE_KEY=<key> VITE_SUPABASE_URL=https://<ref>.supabase.co ./scripts/run_seed.sh
# or run and follow prompts:
#   ./scripts/run_seed.sh

prompt_for_var() {
  local var_name="$1"
  local silent=${2:-false}
  local val
  if [ -n "${!var_name:-}" ]; then
    return 0
  fi
  if [ "$silent" = true ]; then
    read -rsp "Enter $var_name: " val
    echo
  else
    read -p "Enter $var_name: " val
  fi
  export "$var_name"="$val"
}

if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "SUPABASE_SERVICE_ROLE_KEY not set. I'll prompt for it (input hidden)."
  prompt_for_var SUPABASE_SERVICE_ROLE_KEY true
fi

if [ -z "${VITE_SUPABASE_URL:-}" ]; then
  echo "VITE_SUPABASE_URL not set. I'll prompt for it."
  prompt_for_var VITE_SUPABASE_URL false
fi

echo "Running seed with Supabase URL: $VITE_SUPABASE_URL"

# Run seed script (from repo root)
NODE_ENV=development SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" VITE_SUPABASE_URL="$VITE_SUPABASE_URL" node ./scripts/seed.js

echo "Seed finished."
