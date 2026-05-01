# 🚀 VetCare Development Setup Guide

## Prerequisites

- Node.js >= 18.x
- pnpm / npm
- Git
- Docker (recommended for local Postgres)
- GitHub account (for deployment)

## Local Development — Overview

This project uses a custom backend architecture: a Node.js API gateway and Go services backed by PostgreSQL and Cloudflare R2. The frontend is a Vite + React SPA served as a static site (GitHub Pages for production).

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/zenipara/VetCare.git
cd VetCare/frontend
pnpm install
```

### Step 2: Run Local PostgreSQL (optional)

Run Postgres locally via Docker for development:

```bash
docker run --name vetcare-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

Set your `DATABASE_URL` environment variable:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

### Step 3: Configure Environment Variables

Create service-specific env files (do not commit secrets):

- Frontend: `frontend/.env.local`
- API: `backend/api/.env`
- Realtime/Workers: `backend/realtime/.env`

Example frontend `.env.local` (local dev):

```env
VITE_API_URL=http://localhost:4000
VITE_R2_UPLOAD_ENABLED=true
```

Example API `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
JWT_SECRET=replace_with_strong_secret
JWT_REFRESH_SECRET=replace_with_strong_refresh_secret
CLOUDFLARE_R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY=your-access-key
CLOUDFLARE_R2_SECRET_KEY=your-secret-key
R2_BUCKET=vetcare-media
```

### Step 4: Apply Migrations

Use your preferred migration tool. Migration SQL files are available in `supabase/migrations/` and can be applied directly with `psql` or migrated into your chosen migration runner.

Example (psql):

```bash
psql "$DATABASE_URL" -f supabase/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/002_functions_and_triggers.sql
psql "$DATABASE_URL" -f supabase/migrations/003_rls_policies.sql
```

### Step 5: Seed Sample Data (Optional)

Run seed SQL files located in `supabase/seed.sql` or use a seed script that targets `DATABASE_URL`.

### Step 6: Start Services Locally

Frontend
```bash
cd frontend
pnpm run dev
```

API (Node.js)
```bash
cd backend/api
pnpm install
pnpm run dev
```

Go Realtime Service
```bash
cd backend/realtime
go run ./cmd/realtime
```

Each service has its own `.env` which must be configured for local development.

## Development Scripts

```bash
# Frontend
pnpm run dev
pnpm run build

# Backend API
pnpm run dev        # in backend/api

# Realtime
go run ./cmd/realtime

# Database
# Apply migrations using psql or migration tool
```

## Troubleshooting

- If the frontend cannot reach the API, verify `VITE_API_URL`.
- If migrations fail, check `DATABASE_URL` and run SQL manually to inspect errors.
- Ensure Cloudflare R2 credentials are set only in backend services; do not expose to frontend.

## Notes

- This repository previously referenced a BaaS. The new architecture uses a custom API + Postgres (Render or local) and Cloudflare R2 for storage. Replace any client-side BaaS usage with calls to the Node.js API gateway.

## Development — Quick Start (consolidated)

The full developer reference is consolidated into this guide. Quick steps to get developing:

1. Clone the repo and install dependencies for each service (frontend, backend, realtime).

```bash
git clone https://github.com/zenipara/VetCare.git
cd VetCare

# Frontend
cd frontend
pnpm install

# Backend
cd ../backend
pnpm install

# Realtime (Go)
cd ../services/realtime
go mod download
```

2. Set environment variables from examples (`.env.example` or `.env.local`) for each service.
3. Apply database migrations (see `supabase/migrations/`).
4. Start services in separate terminals: frontend (`pnpm run dev`), backend (`pnpm run dev`), realtime (`go run main.go`).

This file now contains the canonical local setup and development quick start. If you want, I can now update other documentation files (deployment guides, phase docs) to remove remaining references to the previous BaaS and reflect the new architecture.
