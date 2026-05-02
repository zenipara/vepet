# GitHub Pages Setup (Consolidated)

Konten GitHub Pages telah digabungkan ke `DEPLOYMENT_GUIDE.md` di bagian frontend/GitHub Pages. Silakan lihat:

[DEPLOYMENT_GUIDE.md#4-frontend-github-pages](DEPLOYMENT_GUIDE.md)

Jika Anda membutuhkan contoh lengkap workflow Actions atau secret list, saya bisa tambahkan contoh lengkap ke `DEPLOYMENT_GUIDE.md`.
- `VITE_SUPABASE_ANON_KEY` - Anon key dari Supabase project
- `SUPABASE_DB_URL` - PostgreSQL connection string untuk deploy migrasi database

```bash
# Cek nilai ini di Supabase Dashboard:
# Project → Settings → API
# - API URL = VITE_API_URL
# - anon[public] key = VITE_SUPABASE_ANON_KEY
```

⚠️ **PENTING**: `GITHUB_TOKEN` adalah built-in secret, tidak perlu dikonfigurasi manual.

### 2. Enable GitHub Pages
Di GitHub repo settings:

**Settings → Pages → Build and deployment**

- Source: `GitHub Actions`

GitHub akan menampilkan URL Pages setelah job deploy sukses.

### 3. Verify Workflow Configuration
File `.github/workflows/deploy.yml` sudah punya:

✅ **Permissions block** (diperlukan untuk deploy ke gh-pages):
```yaml
permissions:
  pages: write
  id-token: write
```

✅ **Base path untuk GitHub Pages** (di `vite.config.ts`):
```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/VetCare/' : '/',
```

✅ **Verification step** untuk debug jika ada masalah:
```yaml
- name: Verify dist folder
  run: |
    ls -lah frontend/dist/
    find frontend/dist -type f | wc -l
```

✅ **Database deploy step** untuk Supabase:
```yaml
- name: Deploy database migrations to Supabase
    run: bash scripts/deploy-db.sh
```

## 🚀 Deployment Flow

Setelah semua di-setup, deployment workflow pada setiap push ke `main`:

```
Push ke main
    ↓
GitHub Actions trigger
    ↓
Install dependencies
    ↓
Type-check & Lint (non-blocking)
    ↓
Build with Vite (menggunakan base=/VetCare/)
    ↓
Verify dist folder berisi files
    ↓
Upload Pages artifact
    ↓
Deploy via GitHub Actions Pages
    ↓
GitHub Pages publish (≈ 1-2 menit)
    ↓
Aplikasi live di: https://zenipara.github.io/VetCare/
```

## 🔍 Troubleshooting

### Jika deploy masih gagal:

1. **Check workflow logs**:
   - Repository → Actions → Latest workflow run
   - Cek step "Deploy to GitHub Pages" untuk error message

2. **Verify dist folder dibuat**:
   - Check "Verify dist folder" step output
   - Pastikan file HTML/JS ada di `frontend/dist/`

3. **Check secrets tersedia**:
   - Step "Verify dist folder" akan print `✓` atau `WARNING`
   - Jika WARNING, berarti secret tidak diset

4. **Verify base path**:
   - Buka console browser (F12) di deployed URL
   - Cek jika ada 404 errors untuk static assets
   - Jika assets loading dari `/assets/...` bukan `/VetCare/assets/...`, base path salah

5. **Verify database deployment**:
    - Pastikan secret `SUPABASE_DB_URL` sudah di-set di GitHub
    - Cek step `Deploy database migrations to Supabase` di Actions log
    - Jika ada error SQL, perbaiki file pada `database/migrations/` lalu push ulang ke `main`

### URL Destination

Aplikasi akan ter-deploy ke:
- **URL**: `https://zenipara.github.io/VetCare/`
- **Repo Pages Settings** akan menunjukkan URL ini setelah deploy sukses

## 📝 Workflow Steps Explained

| Step | Purpose | Failure Impact |
|------|---------|---|
| Checkout code | Clone repo ke runner | Build tidak bisa jalandoes |
| Setup Node.js | Install Node 18 + npm cache | Build gagal (no Node) |
| Install dependencies | `npm install` | Build gagal (missing packages) |
| Type-check | `tsc --noEmit` | ⚠️ Non-blocking (tidak stop deploy) |
| Lint | ESLint check | ⚠️ Non-blocking (tidak stop deploy) |
| **Build production** | `npm run build` → creates `dist/` | ❌ **CRITICAL** - Deploy tidak bisa lanjut |
| Verify dist folder | Check dist exists + debug env vars | ⚠️ Informasional (tidak block deploy) |
| **Deploy to GitHub Pages** | Publish Pages artifact via GitHub Actions | ❌ **CRITICAL** - Aplikasi tidak ter-publish |

## 🎯 Apa yang Terjadi Setelah Deploy Sukses

1. **dist/ folder di-publish sebagai Pages artifact**
    - Build output di-upload sebagai GitHub Pages artifact
    - Tidak ada push manual ke branch `gh-pages`

2. **GitHub Pages serve aplikasi**
   - Build artifacts ter-serve dari `https://zenipara.github.io/VetCare/`  
   - Propagasi ke CDN ≈ 1-2 menit

3. **React Router bekerja dengan base path**
   - Semua routes ter-resolve dari `/VetCare/` base
   - Links dan navigation otomatis menyesuaikan

## 📚 Reference

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Base Path Config](https://vitejs.dev/config/shared-options.html#base)
- [GitHub Actions Pages deployment](https://docs.github.com/en/pages/getting-started-with-github-pages/using-github-actions-to-publish-your-site)
- [React Router Deployment Guide](https://reactrouter.com/start/framework/deployment)

---

**Last Updated**: May 1, 2026  
**Workflow File**: `.github/workflows/deploy.yml`  
**Vite Config**: `frontend/vite.config.ts`
