# Database & Migrations

This folder contains SQL migration and seed files. The repository previously used a BaaS provider; the SQL artifacts remain here for schema and seeding purposes.

How to use:

1. Choose a target PostgreSQL instance (local Docker, or Render Managed Postgres).
2. Apply migrations in order using your migration tool or `psql`.

Example (psql):

```bash
psql "$DATABASE_URL" -f supabase/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/002_functions_and_triggers.sql
psql "$DATABASE_URL" -f supabase/migrations/003_rls_policies.sql
```

Seed data:

```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

Notes:
- The `supabase/` folder is kept for migrations and SQL assets. Apply these SQL files to any PostgreSQL instance you manage (local Docker, Render Managed Postgres, etc.).
- The SQL files include references to Supabase auth triggers (`auth.users`) used by the previous BaaS-based setup. If you are not using Supabase Auth, review `supabase/migrations/002_functions_and_triggers.sql` and `001_initial_schema.sql` before applying to avoid foreign key or trigger errors.
- The old Supabase-based seeding script (`scripts/seed.js`) has been deprecated. Use `scripts/seed-db.sh` to apply the SQL seed. The legacy script is preserved at `scripts/seed-legacy.js` for reference only.
- For production, adopt a migration runner (e.g., `golang-migrate`, `node-pg-migrate`) and include migration steps in CI or deployment processes.
```
