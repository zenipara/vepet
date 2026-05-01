# 🚀 VetCare Deployment Checklist - GitHub Pages & Supabase

## Status Deployment Saat Ini
- ✅ Workflow GitHub Actions sudah configured (`.github/workflows/deploy.yml`)
- ✅ Vite base path sudah configured untuk GitHub Pages (`/VetCare/`)
- ✅ Database migration script siap (`scripts/deploy-supabase-db.sh`)
- ⏳ **MENUNGGU**: GitHub Repository Secrets configuration
- ⏳ **MENUNGGU**: GitHub Pages activation

---

## 📋 STEP 1: Siapkan Supabase Credentials

### Pergi ke Supabase Dashboard
**URL**: https://app.supabase.com/

### Dapatkan 3 nilai berikut dari project Supabase Anda:

#### 1️⃣ VITE_SUPABASE_URL
```
👉 Di Supabase Dashboard:
   Project Settings → API → Project URL
   
   Contoh nilai: https://xxxxxxxx.supabase.co
```

#### 2️⃣ VITE_SUPABASE_ANON_KEY
```
👉 Di Supabase Dashboard:
   Project Settings → API → anon (public) key
   
   Contoh nilai: eyJhbGc....(long string)
```

#### 3️⃣ SUPABASE_DB_URL (untuk database migrations)
```
👉 Di Supabase Dashboard:
   Project Settings → Database → Connection string
   
   Pilih: PostgreSQL
   
   Format: 
   postgresql://postgres:<password>@<host>:5432/postgres?sslmode=require
   
   ⚠️ JANGAN LUPA: Masukkan password database yang benar!
```

**💾 SIMPAN KETIGA NILAI TERSEBUT DI SOMEWHERE AMAN!**

---

## 🔐 STEP 2: Tambahkan Secrets ke GitHub

### Go to GitHub Repository Settings
1. Buka: https://github.com/zenipara/VetCare
2. Klik **Settings** (tab atas)
3. Di sidebar kiri, buka: **Secrets and variables → Actions**

### Tambahkan 3 Secrets Berikut:

#### Secret 1: VITE_SUPABASE_URL
```
Name:  VITE_SUPABASE_URL
Value: (paste nilai dari Supabase dashboard)
Click: Add secret
```

#### Secret 2: VITE_SUPABASE_ANON_KEY
```
Name:  VITE_SUPABASE_ANON_KEY
Value: (paste nilai dari Supabase dashboard)
Click: Add secret
```

#### Secret 3: SUPABASE_DB_URL
```
Name:  SUPABASE_DB_URL
Value: (paste nilai dari Supabase dashboard)
Click: Add secret
```

**✅ Verifikasi**:
Setelah added, harusnya lihat:
- ✓ VITE_SUPABASE_URL
- ✓ VITE_SUPABASE_ANON_KEY
- ✓ SUPABASE_DB_URL

---

## 📄 STEP 3: Enable GitHub Pages

### Go to GitHub Pages Settings
1. Di GitHub repo: https://github.com/zenipara/VetCare
2. Klik **Settings** (tab atas)
3. Di sidebar kiri, buka: **Pages**

### Configure GitHub Pages
```
Build and deployment section:

Source: GitHub Actions
   ↳ Pilih di dropdown

(Jangan pilih "Deploy from a branch")
```

**ℹ️ Catatan**: 
- GitHub akan menampilkan URL Pages setelah deployment sukses
- URL akan menjadi: `https://zenipara.github.io/VetCare/`

---

## 🚀 STEP 4: Trigger Deployment

### Option A: Manual Push
```bash
cd /workspaces/VetCare
git add .
git commit -m "chore: trigger github pages deployment"
git push origin main
```

### Option B: Trigger dari GitHub Actions UI
1. Go to: https://github.com/zenipara/VetCare/actions
2. Select workflow: "Build & Deploy VetCare System"
3. Klik **Run workflow** → main branch → Run workflow

### Workflow akan:
1. ✅ Install dependencies
2. ✅ Run type check & lint
3. ✅ Deploy database migrations ke Supabase
4. ✅ Build production frontend (dengan base=/VetCare/)
5. ✅ Upload Pages artifact
6. ✅ Deploy ke GitHub Pages
7. ✅ Publish di https://zenipara.github.io/VetCare/ (≈1-2 menit)

---

## 🔍 STEP 5: Verifikasi Deployment

### Monitor Workflow Execution
1. Go to: https://github.com/zenipara/VetCare/actions
2. Lihat latest "Build & Deploy VetCare System" run
3. Tunggu sampai:
   - 🟢 **build** job completed
   - 🟢 **deploy** job completed

### Check Workflow Logs
Di setiap step, verifikasi:

#### Step: "Verify dist folder"
```
Seharusnya lihat:
✓ VITE_SUPABASE_URL is set
✓ VITE_SUPABASE_ANON_KEY is set
Total files: 100+

Jika ada WARNING, berarti secrets tidak tersetting.
```

#### Step: "Deploy database migrations to Supabase"
```
Seharusnya lihat:
→ Applying 001_initial_schema.sql
→ Applying 002_functions_and_triggers.sql
→ Applying 003_rls_policies.sql
✓ Supabase database migrations deployed

Jika error, cek SUPABASE_DB_URL dan password database.
```

#### Step: "Deploy to GitHub Pages"
```
Seharusnya lihat:
Deployment successful!
Page deployed to ...

Dengan final URL seperti:
https://zenipara.github.io/VetCare/
```

### Test Live Application
```bash
# Buka di browser:
https://zenipara.github.io/VetCare/

Seharusnya:
✅ Homepage VetCare loading
✅ Navigation links bekerja
✅ Bisa login dengan Supabase
✅ Supabase real-time features aktif
```

---

## 🐛 TROUBLESHOOTING

### ❌ Deployment Gagal - "VITE_SUPABASE_URL not set"

**Penyebab**: Secrets tidak tersetting di GitHub

**Solusi**:
1. Go to: https://github.com/zenipara/VetCare/settings/secrets/actions
2. Pastikan 3 secrets sudah ada:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - SUPABASE_DB_URL
3. Re-run workflow

### ❌ Database Migration Gagal - "psql: could not translate connection string"

**Penyebab**: SUPABASE_DB_URL invalid atau password salah

**Solusi**:
1. Go to Supabase Dashboard → Project Settings → Database
2. Copy connection string baru (pastikan password benar)
3. Update secret SUPABASE_DB_URL
4. Re-run workflow

### ❌ GitHub Pages URL tidak muncul

**Penyebab**: GitHub Pages belum di-enable atau deployment belum selesai

**Solusi**:
1. Check: https://github.com/zenipara/VetCare/settings/pages
2. Pastikan Source sudah set ke "GitHub Actions"
3. Tunggu 2-5 menit setelah deployment sukses
4. URL akan muncul di Pages settings

### ⚠️ Website blank atau 404 di GitHub Pages

**Penyebab**: dist/ folder tidak tercipta atau base path salah

**Solusi**:
1. Check build step di workflow - ada TypeScript error?
2. Pastikan `GITHUB_PAGES=true` env var set saat build
3. Verify dist/ folder ada: `ls frontend/dist/`
4. Check vite.config.ts base path: `base: process.env.GITHUB_PAGES === 'true' ? '/VetCare/' : '/'`

### 🔗 Link relatif error di GitHub Pages

**Penyebab**: Asset path tidak include base path `/VetCare/`

**Solusi**:
- ✅ Vite otomatis handle ini dengan base path configuration
- ✅ React Router juga sudah dikonfigurasi dengan basename
- Jika masih error, cek browser console untuk error messages

---

## 📊 Expected Result After Deployment

```
✅ GitHub Actions Workflow Status:
   - build job: ✅ PASSED
   - deploy job: ✅ PASSED

✅ GitHub Pages:
   - URL: https://zenipara.github.io/VetCare/
   - Status: Active
   - Branch: gh-pages (auto-created)

✅ Live Application:
   - VetCare homepage visible
   - All routes working: /login, /dashboard, /booking, etc.
   - Login functionality working
   - Supabase real-time integration active

✅ Database:
   - All 3 migrations applied to Supabase
   - Tables created: users, pets, bookings, appointments, emr_records, etc.
   - RLS policies active
   - Triggers & functions working

✅ Features Working:
   - User Registration & Login
   - Pet Management
   - Booking Flow
   - EMR Display
   - Clinic Dashboard
   - Admin Panel (jika akses admin)
```

---

## 📞 Quick Summary

**Apa yang perlu dilakukan?**
1. Go to Supabase Dashboard → copy 3 credentials
2. Go to GitHub → Settings → Secrets → add 3 secrets
3. Go to GitHub → Settings → Pages → enable GitHub Actions source
4. Push ke main (atau manual trigger workflow)
5. Wait 2-5 menit
6. Check: https://zenipara.github.io/VetCare/

**Total waktu**: ~5 menit setup + 5 menit deployment = 10 menit

---

**Last Updated**: May 1, 2026  
**Project**: VetCare MVP - Phase 1  
**Status**: Ready for Deployment ✅
