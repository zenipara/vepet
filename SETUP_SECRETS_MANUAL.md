# 🔐 GitHub Secrets Configuration - MANUAL SETUP

## ⚠️ Security Note

Credentials sudah disimpan di file ini untuk reference saat setup. Setelah setup:
- ✅ Delete file ini
- ✅ Credentials aman tersimpan di GitHub Secrets (encrypted)
- ✅ Tidak akan terlihat di logs atau file apapun

---

## Credentials yang Akan di-Register

```
VITE_SUPABASE_URL:
  https://mdbositlivrfskbhcdxp.supabase.co

VITE_SUPABASE_ANON_KEY:
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYm9zaXRsaXZyZnNrYmhjZHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MjU1MzYsImV4cCI6MjA5MzIwMTUzNn0.yGRC1MlYJCuzetExRu6BwvUncJoDrvAuf456ZHKgzpk

SUPABASE_DB_URL:
  postgresql://postgres:Kedinasan2020@db.mdbositlivrfskbhcdxp.supabase.co:5432/postgres
```

---

## 📋 Step-by-Step Setup

### STEP 1: Go to Repository Settings

1. Open: https://github.com/zenipara/VetCare
2. Click **Settings** tab (top navigation)
3. In left sidebar: **Secrets and variables** → **Actions**

### STEP 2: Add First Secret (VITE_SUPABASE_URL)

1. Click **"New repository secret"** (green button)
2. Fill in:
   ```
   Name:  VITE_SUPABASE_URL
   Value: https://mdbositlivrfskbhcdxp.supabase.co
   ```
3. Click **"Add secret"**

✅ Secret 1 created!

---

### STEP 3: Add Second Secret (VITE_SUPABASE_ANON_KEY)

1. Click **"New repository secret"** (green button)
2. Fill in:
   ```
   Name:  VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYm9zaXRsaXZyZnNrYmhjZHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MjU1MzYsImV4cCI6MjA5MzIwMTUzNn0.yGRC1MlYJCuzetExRu6BwvUncJoDrvAuf456ZHKgzpk
   ```
3. Click **"Add secret"**

✅ Secret 2 created!

---

### STEP 4: Add Third Secret (SUPABASE_DB_URL)

1. Click **"New repository secret"** (green button)
2. Fill in:
   ```
   Name:  SUPABASE_DB_URL
   Value: postgresql://postgres:Kedinasan2020@db.mdbositlivrfskbhcdxp.supabase.co:5432/postgres
   ```
3. Click **"Add secret"**

✅ Secret 3 created!

---

## ✅ Verification

After all 3 secrets added, you should see:

```
🔒 SUPABASE_DB_URL (created just now)
🔒 VITE_SUPABASE_ANON_KEY (created just now)
🔒 VITE_SUPABASE_URL (created just now)
```

All 3 with green 🔒 icons!

---

## 🚀 Next Steps After Secrets Added

1. **Enable GitHub Pages**
   - Go to: Settings → Pages
   - Set Source to: **GitHub Actions**

2. **Trigger Workflow**
   - Go to: Actions tab
   - Click: "Build & Deploy VetCare System"
   - Click: **"Run workflow"** → main → **"Run workflow"**

3. **Monitor Deployment**
   - Watch workflow steps complete
   - Wait for 🟢 PASSED status

4. **Check Site Live**
   - Go to: Settings → Pages
   - Find your site URL: https://zenipara.github.io/VetCare/
   - Open in browser!

---

**Time Estimate:**
- Secrets: 3 minutes
- Pages setup: 1 minute
- Workflow run: 5-10 minutes
- Total: ~15 minutes

Good luck! 🚀
