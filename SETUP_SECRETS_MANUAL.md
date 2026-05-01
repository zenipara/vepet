# 🔐 GitHub Secrets Configuration - MANUAL SETUP

## ⚠️ Security Note

Credentials sudah disimpan di file ini untuk reference saat setup. Setelah setup:
- ✅ Delete file ini
- ✅ Credentials aman tersimpan di GitHub Secrets (encrypted)
- ✅ Tidak akan terlihat di logs atau file apapun

---

## Credentials yang Akan di-Register

```
VITE_API_URL:
   https://api.yourdomain.com

VITE_API_ANON_KEY:
   your-api-anon-key

DATABASE_URL:
   postgresql://postgres:<PASSWORD>@<host>:5432/postgres
```

---

## 📋 Step-by-Step Setup

### STEP 1: Go to Repository Settings

1. Open: https://github.com/zenipara/VetCare
2. Click **Settings** tab (top navigation)
3. In left sidebar: **Secrets and variables** → **Actions**

### STEP 2: Add First Secret (VITE_API_URL)

1. Click **"New repository secret"** (green button)
2. Fill in:
   ```
   Name:  VITE_API_URL
   Value: https://api.yourdomain.com
   ```
3. Click **"Add secret"**

✅ Secret 1 created!

---

### STEP 3: Add Second Secret (VITE_API_ANON_KEY — optional)

1. Click **"New repository secret"** (green button)
2. Fill in:
   ```
   Name:  VITE_API_ANON_KEY
   Value: your-api-anon-key
   ```
3. Click **"Add secret"**

✅ Secret 2 created!

---

### STEP 4: Add Third Secret (DATABASE_URL)

1. Click **"New repository secret"** (green button)
2. Fill in:
   ```
   Name:  DATABASE_URL
   Value: postgresql://postgres:<PASSWORD>@<host>:5432/postgres
   ```
3. Click **"Add secret"**

✅ Secret 3 created!

---

## ✅ Verification

After all 3 secrets added, you should see:

```
🔒 DATABASE_URL (created just now)
🔒 VITE_API_ANON_KEY (created just now)
🔒 VITE_API_URL (created just now)
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
