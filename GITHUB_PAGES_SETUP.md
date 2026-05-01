# GitHub Pages Deployment Setup untuk VetCare

Panduan ini menjelaskan langkah-langkah untuk setup GitHub Pages deployment otomatis untuk aplikasi VetCare.

## ❌ Penyebab Deployment Gagal (Common Issues)

1. **Secrets tidak dikonfigurasi** - Workflow memerlukan env vars untuk build Vite
2. **GitHub Pages branch tidak ter-setup** - Repository perlu mengaktifkan GitHub Pages
3. **Permissions tidak tepat** - Workflow memerlukan `contents: write` dan `pages: write`
4. **Base path salah** - GitHub Pages project repo butuh base path `/VetCare/`

## ✅ Setup Checklist

### 1. Configure Repository Secrets
Di GitHub repo settings, tambahkan 2 secrets dengan nilai Supabase project tamu:

**Settings → Secrets and variables → Actions**

Tambahkan:
- `VITE_SUPABASE_URL` - URL project Supabase Anda (misal: `https://xxx.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` - Anon key dari Supabase project

```bash
# Cek nilai ini di Supabase Dashboard:
# Project → Settings → API
# - Project URL = VITE_SUPABASE_URL
# - anon[public] key = VITE_SUPABASE_ANON_KEY
```

⚠️ **PENTING**: `GITHUB_TOKEN` adalah built-in secret, tidak perlu dikonfigurasi manual.

### 2. Enable GitHub Pages
Di GitHub repo settings:

**Settings → Pages → Build and deployment**

- Source: `Deploy from a branch`
- Branch: `gh-pages` / root
- Folder: `/` (root)

Atau jika branch belum ada, workflow akan membuatnya otomatis saat first deploy.

### 3. Verify Workflow Configuration
File `.github/workflows/deploy.yml` sudah punya:

✅ **Permissions block** (diperlukan untuk deploy ke gh-pages):
```yaml
permissions:
  contents: write
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
Deploy ke gh-pages branch
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
| **Deploy to GitHub Pages** | Push dist/ ke gh-pages branch | ❌ **CRITICAL** - Aplikasi tidak ter-publish |

## 🎯 Apa yang Terjadi Setelah Deploy Sukses

1. **dist/ folder di-publish ke gh-pages branch**
   - `gh-pages` branch dibuat otomatis jika belum ada
   - Hanya file build yang ter-push (bukan source code)

2. **GitHub Pages serve aplikasi**
   - Build artifacts ter-serve dari `https://zenipara.github.io/VetCare/`  
   - Propagasi ke CDN ≈ 1-2 menit

3. **React Router bekerja dengan base path**
   - Semua routes ter-resolve dari `/VetCare/` base
   - Links dan navigation otomatis menyesuaikan

## 📚 Reference

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Base Path Config](https://vitejs.dev/config/shared-options.html#base)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [React Router Deployment Guide](https://reactrouter.com/start/framework/deployment)

---

**Last Updated**: May 1, 2026  
**Workflow File**: `.github/workflows/deploy.yml`  
**Vite Config**: `frontend/vite.config.ts`
