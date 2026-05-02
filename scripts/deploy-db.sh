#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "$script_dir/.." && pwd)"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "❌ DATABASE_URL is required"
  exit 1
fi

echo "🐾 Deploying database migrations..."

for migration in "$project_root"/database/migrations/*.sql; do
  echo "→ Applying $(basename "$migration")"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$migration"
done

echo "✓ Database migrations deployed"
