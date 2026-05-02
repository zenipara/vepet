# 🚀 VetCare Production Deployment Checklist (Consolidated)

Panduan checklist deployment ini telah digabungkan ke `DEPLOYMENT_GUIDE.md` (lihat bagian "Checklist Produksi").

Jika Anda ingin checklist yang berdiri sendiri tetap ada, saya bisa mengembalikan versi ringkas sebagai `PRODUCTION_DEPLOYMENT_CHECKLIST.md`; sekarang file ini mengarahkan ke panduan terpadu.
  ```bash
  git status
  git add -A
  git commit -m "Ready for production deployment"
  git push origin main
  ```

- [ ] **Create Render.com account**
  - Go to https://render.com
  - Sign up with GitHub
  - Create dashboard

---

## 🗄️ PHASE 1: Infrastructure Setup (45 minutes)

### 1.1️⃣ PostgreSQL Database

**Steps:**
1. [ ] Go to Render.com Dashboard
2. [ ] Click "+ New ▼" → "PostgreSQL"
3. [ ] Configure:
   - **Name**: `vetcare-db`
   - **Database**: `vetcare`
   - **User**: `postgres` (default)
   - **Region**: Choose closest to you
   - **Plan**: Standard ($7/month or Starter for testing)
4. [ ] Click "Create Database"
5. [ ] Wait for creation (~5 mins)
6. [ ] Copy connection string (looks like):
   ```
   postgresql://user:password@host:5432/vetcare
   ```

**Verification:**
```bash
# Test connection
psql "postgresql://user:password@host:5432/vetcare" -c "SELECT 1"

# Should return:
#  ?column?
# ----------
#        1
```

---

## 🔧 PHASE 2: Deploy API Gateway (30 minutes)

### 2.1️⃣ Create Render Service

1. [ ] In Render Dashboard, click "+ New ▼" → "Web Service"
2. [ ] Connect your GitHub repo
   - Select: `zenipara/VetCare`
   - Authorization: Allow access

### 2.2️⃣ Configure Service

1. [ ] **Basic Settings**
   - Name: `vetcare-api`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Region: Same as database
   - Branch: `main`

2. [ ] **Build & Start Commands**
   - Build: `npm install && npm run build`
   - Start: `npm start`

3. [ ] **Environment Variables**
   - Click "Add Secret File" → paste from `backend/.env.example`
   - Update these values:
     ```
     NODE_ENV=production
     PORT=4000
     DATABASE_URL=<your PostgreSQL connection string>
     JWT_SECRET=<generated secret>
     JWT_REFRESH_SECRET=<generated secret>
     CLOUDFLARE_R2_ACCESS_KEY=<your R2 key>
     CLOUDFLARE_R2_SECRET_KEY=<your R2 secret>
     R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
     R2_BUCKET_NAME=vetcare
     CORS_ORIGIN=https://zenipara.github.io/VetCare,http://localhost:5173
     ```

4. [ ] Click "Create Web Service"
5. [ ] Wait for deployment (~3-5 mins)

### 2.3️⃣ Test API Gateway

**After deployment completes:**

1. [ ] Get API URL from Render (e.g., `https://vetcare-api.onrender.com`)

2. [ ] Test health endpoint:
   ```bash
   curl https://vetcare-api.onrender.com/health
   
   # Expected: {"status":"ok","timestamp":"..."}
   ```

3. [ ] Test sign up:
   ```bash
   curl -X POST https://vetcare-api.onrender.com/api/auth/sign-up \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@vetcare.local",
       "password": "Test12345!",
       "full_name": "Test Vet"
     }'
   ```

---

## 🌐 PHASE 3: Database Migrations (15 minutes)

### 3.1️⃣ Apply Migrations

**Connect to Render PostgreSQL and apply migrations:**

```bash
# Set your database URL
export DATABASE_URL="postgresql://user:password@host:5432/vetcare"

# Apply migrations in order
psql "$DATABASE_URL" < database/migrations/001_initial_schema.sql
psql "$DATABASE_URL" < database/migrations/002_functions_and_triggers.sql
psql "$DATABASE_URL" < database/migrations/003_rls_policies.sql

# Optional: seed sample data
psql "$DATABASE_URL" < database/seed.sql
```

---

## 🔌 PHASE 4: Deploy Realtime Service (20 minutes)

### 4.1️⃣ Create Render Background Worker

1. [ ] In Render Dashboard, click "+ New ▼" → "Background Worker"
2. [ ] Connect GitHub repo (same as above)
3. [ ] **Basic Settings**
   - Name: `vetcare-realtime`
   - Root Directory: `services/realtime`
   - Runtime: `Go`
   - Region: Same as database
   - Branch: `main`

---

## 🎨 PHASE 5: Deploy Frontend (20 minutes)

### 5.1️⃣ Set GitHub Secrets

1. [ ] Go to GitHub: https://github.com/zenipara/VetCare
2. [ ] Settings → Secrets and variables → Actions
3. [ ] New repository secret:
   - Name: `VITE_API_URL`
   - Value: `https://vetcare-api.onrender.com`

---

## ✅ Checklist Complete

This file was archived because its checklist content is consolidated into `DEPLOYMENT_GUIDE.md`.
