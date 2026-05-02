#!/usr/bin/env bash
set -euo pipefail

# scripts/seed-db.sh
# Run SQL migrations and seed data against a PostgreSQL DATABASE_URL
# Usage: DATABASE_URL=postgresql://user:pass@host:5432/db bash scripts/seed-db.sh

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL environment variable is required."
  echo "Usage: DATABASE_URL=postgresql://user:pass@host:5432/db bash scripts/seed-db.sh"
  exit 1
fi

echo "🌱 Applying migrations..."
psql "$DATABASE_URL" -f database/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f database/migrations/002_functions_and_triggers.sql
psql "$DATABASE_URL" -f database/migrations/003_rls_policies.sql

echo "🌱 Applying seed data (database/seed.sql)..."
psql "$DATABASE_URL" -f database/seed.sql

echo "✅ Seed completed. Note: user accounts (auth) are managed by the API; create test users via the backend admin endpoint or manually if needed." 
