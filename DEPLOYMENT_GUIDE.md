# 🚀 VetCare — Deployment Guide

Ringkasan terpadu untuk semua langkah deployment (backend, realtime, dan frontend GitHub Pages).

## Ikhtisar Arsitektur
- Frontend: Vite + React (static site, GitHub Pages)
- API Gateway: Node.js + Express (Render.com atau host lain)
- Realtime: Go WebSocket service (Render.com)
- Database: PostgreSQL (Render Managed atau self-hosted)
- Storage: Cloudflare R2 (opsional untuk file uploads)

## 1. Persiapan Database (migrasi & seed)
Pastikan `DATABASE_URL` mengarah ke instance Postgres tujuan.

Contoh menggunakan `psql`:

```bash
psql "$DATABASE_URL" -f database/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f database/migrations/002_functions_and_triggers.sql
psql "$DATABASE_URL" -f database/migrations/003_rls_policies.sql
```

Jika diperlukan, jalankan seed: `bash scripts/seed-db.sh`.

## 2. Backend (API Gateway) — ringkasan deployment
1. Pastikan environment variables terpasang: `DATABASE_URL`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_R2_BUCKET`, `JWT_SECRET`, dll.
2. Terapkan migrations ke database (lihat bagian 1).
3. Deploy ke Render.com sebagai `Web Service` atau host pilihan Anda.
   - Build: `pnpm --filter backend install && pnpm --filter backend build` (opsional)
   - Start: `node dist/server.js` atau `pnpm --filter backend start`

## 3. Realtime Service (Go)
1. Masuk ke folder `services/realtime`.
2. Build binary Go: `go build -o vetcare-realtime`.
3. Deploy sebagai Background Worker di Render atau service yang mendukung process background.
   - Build command: `go mod download && go build -o vetcare-realtime`
   - Start command: `./vetcare-realtime`

## 4. Frontend (GitHub Pages)
1. Pastikan `vite` build menghasilkan berkas static yang benar.
2. Setup GitHub Actions workflow untuk mem-publish ke Pages; pastikan secrets untuk environment (mis. `VITE_SUPABASE_URL` jika dipakai) dikonfigurasi.
3. Perhatikan `base` atau `homepage` jika repo akan dipublikasikan di subpath.

## 5. Checklist Produksi (ringkas)
- Terapkan migrations dan seed
- Pastikan env vars di production sudah benar
- Jalankan sanity checks: `bash verify-predeployment.sh`
- Deploy backend, realtime, frontend
- Uji end-to-end (login, CRUD utama, upload file, realtime)

---
Jika Anda memerlukan langkah lebih rinci untuk bagian tertentu (mis. konfigurasi Cloudflare R2, setup Render, atau workflow GitHub Actions), lihat file-file folder spesifik seperti `backend/README.md` dan `services/realtime/README.md`.
