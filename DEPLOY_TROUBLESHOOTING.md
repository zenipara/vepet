# GitHub Pages Deploy - Troubleshooting Guide

## 🔴 Status: Deploy Gagal

Workflow sudah di-update dengan perbaikan untuk GitHub Pages deployment. Namun masih ada hal yang perlu di-verify.

## 🎯 Action Items (TO-DO)

### CRITICAL - Harus dikerjakan:

#### 1. ⚠️ Configure Secrets di GitHub Repository
**Path**: Repository Settings → Secrets and variables → Actions

Tambahkan **2 secrets** berikut dengan nilai dari Supabase project Anda:

```
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJ.... (paste anon key dari Supabase)
```

**Jika secrets tidak ada**, app akan tetap build ($Vite menggunakan fallback), tapi Supabase client tidak akan terauth dan fitur real-time akan fail.

#### 2. ✅ Enable GitHub Pages (Jika belum)
**Path**: Repository Settings → Pages

- Set **Source** ke: "GitHub Actions"

GitHub akan menampilkan URL Pages setelah job deploy sukses.

#### 3. 🔍 Check Workflow Run Logs
**Path**: Repository → Actions → Latest "Build & Deploy VetCare System"

Cari error di steps berikut (dalam order):
1. "Build production" step - jika ada error TypeScript/Vite
2. "Verify dist folder" step - cek if dist/ tercipta dengan files
3. "Deploy to GitHub Pages" step - cek if deploy action berjalan

## 📋 Perubahan yang Sudah Dilakukan

### ✅ Fixed in Latest Commit:

1. **Added Permissions Block** ke workflow
   ```yaml
   permissions:
     pages: write         # Perlu untuk GitHub Pages
     id-token: write      # Perlu untuk OIDC trust
   ```

2. **Added Base Path Configuration** untuk GitHub Pages
   ```javascript
   // vite.config.ts
   base: process.env.GITHUB_PAGES === 'true' ? '/VetCare/' : '/'
   ```
   - Lokal development: base = `/` (normal)
   - GitHub Pages CI build: base = `/VetCare/` (untuk project repo)

3. **Added Verification Steps** untuk debugging
   - Cek dist/ folder ada dan berisi files
   - Cek environment variables set atau tidak

4. **Added GITHUB_PAGES env var** di build step
   - Memicu conditional base path di Vite

5. **Migrated deploy ke GitHub Actions resmi**
   - Build job meng-upload Pages artifact
   - Deploy job memakai `actions/deploy-pages`

## 🚀 Next Steps

### Immediate (Now):
1. Go to: `https://github.com/zenipara/VetCare/settings/secrets/actions`
2. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
3. Go to: `https://github.com/zenipara/VetCare/settings/pages`
4. Verify Pages source sudah set ke `gh-pages` branch

### Then:
1. Open: `https://github.com/zenipara/VetCare/actions`
2. Click latest "Build & Deploy VetCare System" run
3. Debug output akan terlihat di each step

### If Still Failing:
Check "Verify dist folder" step output untuk lihat:
```
✓ VITE_SUPABASE_URL is set      ← OK
✓ VITE_SUPABASE_ANON_KEY is set ← OK
WARNING: VITE_SUPABASE_URL not set ← PROBLEM
```

Jika ada WARNING, itu berarti secrets tidak tersetting di GitHub.

## 📊 Deployment Architecture

```
Local (MacOS/Windows)
    └─ npm run build
         └─ Creates /frontend/dist/ with base=/

CI/CD (GitHub Actions)
    └─ npm run build (with GITHUB_PAGES=true)
         └─ Creates /frontend/dist/ with base=/VetCare/
       └─ Upload Pages artifact
          └─ GitHub Actions deploy-pages publishes site
             └─ GitHub Pages serves from https://zenipara.github.io/VetCare/
                   ├─ index.html (served at /VetCare/)
                   ├─ assets/... (served at /VetCare/assets/)
                   └─ React Router handles routes from /VetCare/ base
```

## 🔗 Final URL After Deploy Succeeds

```
https://zenipara.github.io/VetCare/
```

(Update this in any documentation or shared links)

## 📞 Support

Jika masih gagal setelah setup:

1. **Buka Actions log** dan screenshot error message
2. **Check build output** di "Build production" step - ada TypeScript error?
3. **Check dist folder** di "Verify dist folder" step - files ada?
4. **Check deploy step** - ada error dari actions/deploy-pages?

---

**Last Updated**: May 1, 2026  
**Workflow**: `.github/workflows/deploy.yml`  
**Config**: `frontend/vite.config.ts`  
**Doc**: `GITHUB_PAGES_SETUP.md`
