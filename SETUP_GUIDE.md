# VetCare Development Setup Guide

Panduan singkat untuk menyiapkan lingkungan lokal VetCare.

## Prerequisites

- Node.js 18+
- pnpm atau npm
- Git
- Docker (opsional, untuk PostgreSQL lokal)

## 1. Clone dan install

```bash
git clone https://github.com/zenipara/VetCare.git
cd VetCare

cd frontend
pnpm install

cd ../backend
pnpm install

cd ../services/realtime
go mod download
```

## 2. Siapkan environment

Buat file environment berikut:

- `frontend/.env.local`
- `backend/.env`
- `services/realtime/.env`

Contoh minimal frontend:

```env
VITE_API_URL=http://localhost:4000
```

Contoh minimal backend:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
JWT_SECRET=replace_with_strong_secret
JWT_REFRESH_SECRET=replace_with_strong_refresh_secret
```

## 3. Jalankan PostgreSQL dan migrasi

```bash
docker run --name vetcare-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

psql "$DATABASE_URL" -f database/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f database/migrations/002_functions_and_triggers.sql
psql "$DATABASE_URL" -f database/migrations/003_rls_policies.sql
```

Opsional, seed data:

```bash
bash scripts/seed-db.sh
```

## 4. Start services

Jalankan di terminal terpisah:

```bash
cd frontend && pnpm run dev
cd backend && pnpm run dev
cd services/realtime && go run main.go
```

## 5. Troubleshooting cepat

- Frontend tidak bisa akses API: cek `VITE_API_URL`.
- Migrasi gagal: cek `DATABASE_URL` dan urutan file di `database/migrations/`.
- R2 error: pastikan kredensial hanya ada di backend.

## Lihat juga

- [DOCS.md](DOCS.md) - indeks dokumentasi
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - panduan deployment
