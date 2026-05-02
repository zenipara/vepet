# Database Assets

This folder contains the SQL assets used by VetCare for database schema, policies, and seed data.

How to use:

1. Point `DATABASE_URL` to a PostgreSQL instance.
2. Apply migrations in order.
3. Apply seed data after the schema is present.

Example:

```bash
psql "$DATABASE_URL" -f database/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f database/migrations/002_functions_and_triggers.sql
psql "$DATABASE_URL" -f database/migrations/003_rls_policies.sql
psql "$DATABASE_URL" -f database/seed.sql
```

Notes:
- These SQL files still include legacy auth-trigger references (`auth.users` and `auth.uid()`) from the earlier Supabase-era schema. Review them before applying to a plain PostgreSQL instance.
- The operational seed script is `scripts/seed-db.sh`.
