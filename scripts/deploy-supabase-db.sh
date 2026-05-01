#!/bin/bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "$script_dir/.." && pwd)"

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "❌ SUPABASE_DB_URL is required"
  exit 1
fi

echo "🐾 Deploying Supabase database migrations..."

for migration in "$project_root"/supabase/migrations/*.sql; do
  echo "→ Applying $(basename "$migration")"
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$migration"
done

echo "✓ Supabase database migrations deployed"
