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
- The `supabase/` folder is kept for historical migrations and SQL assets. It is **not** an instruction to host on a specific BaaS. Apply these SQL files to any PostgreSQL instance you manage.
- For production, consider adopting a migration runner (e.g., `golang-migrate`, `node-pg-migrate`) and include migration steps in CI or deployment processes.
-- Tambah clinic profile
INSERT INTO clinic_profile (name, tagline, description, phone, email, address) VALUES
  ('VetCare - Klinik Hewan Modern',
   'Kesehatan hewan peliharaan, prioritas kami',
   'Klinik hewan modern dengan dokter berpengalaman dan layanan 24/7',
   '+62-0812-3456-7890',
   'info@vetcare.com',
   'Jl. Kesehatan Hewan No. 123, Jakarta Selatan');
```
