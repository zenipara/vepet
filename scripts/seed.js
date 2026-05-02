#!/usr/bin/env node
console.log('This file has been deprecated.');
console.log('Use `scripts/seed-db.sh` to apply SQL migrations and seed data:');
console.log('  DATABASE_URL=postgresql://user:pass@host:5432/db bash scripts/seed-db.sh');
console.log('If you need the legacy Supabase-based seeding logic, see scripts/seed-legacy.js');

