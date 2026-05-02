#!/usr/bin/env bash
set -euo pipefail

# Helper wrapper for scripts/seed-db.sh.
# Usage:
#   DATABASE_URL=postgresql://user:pass@host:5432/db ./scripts/run_seed.sh
# or run and follow the prompt:
#   ./scripts/run_seed.sh

if [ -z "${DATABASE_URL:-}" ]; then
  read -r -p "Enter DATABASE_URL: " DATABASE_URL
  export DATABASE_URL
fi

echo "Running database seed against: $DATABASE_URL"
bash ./scripts/seed-db.sh
echo "Seed finished."
