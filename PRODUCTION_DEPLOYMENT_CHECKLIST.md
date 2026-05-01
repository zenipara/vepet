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

### 1.2️⃣ Environment Variables

**Store these securely** (you'll need them multiple times):
- [ ] PostgreSQL Connection String: `_______________________`
- [ ] JWT Secret (generate): `_______________________`
- [ ] JWT Refresh Secret (generate): `_______________________`
- [ ] Cloudflare R2 Access Key: `_______________________`
- [ ] Cloudflare R2 Secret Key: `_______________________`
- [ ] Cloudflare R2 Endpoint: `_______________________`
- [ ] Cloudflare R2 Bucket Name: `_______________________`

**Generate strong secrets:**
```bash
# Generate a secure 32-char secret
openssl rand -hex 16
```

### 1.3️⃣ Cloudflare R2 (Optional but recommended)

**If using Cloudflare R2 for file storage:**

1. [ ] Go to https://www.cloudflare.com/products/r2/
2. [ ] Create account → Create R2 bucket
3. [ ] Generate authentication tokens:
   - Go to Account Settings → R2 API Token
   - Create API Token with permissions: `All permissions`
4. [ ] Write down:
   - Access Key ID
   - Secret Access Key (save securely!)
   - Account ID (use in endpoint URL)

**Endpoint Format**:
```
https://ACCOUNT_ID.r2.cloudflarestorage.com
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
   
   # Expected: {"user": {...}, "access_token": "...", "refresh_token": "..."}
   ```

4. [ ] ✅ **NOTE**: Save this API URL - you'll need it for frontend and realtime

---

## 🌐 PHASE 3: Database Migrations (15 minutes)

### 3.1️⃣ Apply Migrations

**Connect to Render PostgreSQL and apply migrations:**

```bash
# Set your database URL
export DATABASE_URL="postgresql://user:password@host:5432/vetcare"

# Apply migrations in order
psql "$DATABASE_URL" < supabase/migrations/001_initial_schema.sql
psql "$DATABASE_URL" < supabase/migrations/002_functions_and_triggers.sql
psql "$DATABASE_URL" < supabase/migrations/003_rls_policies.sql

# Optional: seed sample data
psql "$DATABASE_URL" < supabase/seed.sql
```

### 3.2️⃣ Verify Migrations

```bash
psql "$DATABASE_URL" -c "SELECT tablename FROM pg_tables WHERE schemaname='public';"

# Expected: Should see tables like: users, clinics, pets, bookings, etc.
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

### 4.2️⃣ Configure Background Worker

1. [ ] **Build & Start Commands**
   - Build: `go mod download && go build -o main .`
   - Start: `./main`

2. [ ] **Environment Variables**
   ```
   DATABASE_URL=<your PostgreSQL connection string>
   JWT_SECRET=<same as API Gateway>
   SERVICE_AUTH_TOKEN=<generated token>
   PORT=4001
   ```

3. [ ] Click "Create Background Worker"
4. [ ] Wait for deployment (~3-5 mins)

### 4.3️⃣ Get WebSocket URL

**After deployment:**

1. [ ] Get service URL from Render (e.g., `vetcare-realtime.onrender.com`)
2. [ ] WebSocket URL will be: `wss://vetcare-realtime.onrender.com/ws`
3. [ ] ✅ **NOTE**: Save this URL for frontend configuration

### 4.4️⃣ Test Realtime Service

```bash
# Install websocat (WebSocket client)
# macOS: brew install websocat
# Linux: cargo install websocat
# Or skip this test for now

# Test connection (optional)
websocat wss://vetcare-realtime.onrender.com/ws

# Should connect successfully
```

---

## 🎨 PHASE 5: Deploy Frontend (20 minutes)

### 5.1️⃣ Set GitHub Secrets

1. [ ] Go to GitHub: https://github.com/zenipara/VetCare
2. [ ] Settings → Secrets and variables → Actions
3. [ ] New repository secret:
   - Name: `VITE_API_URL`
   - Value: `https://vetcare-api.onrender.com`
4. [ ] New repository secret:
   - Name: `VITE_API_ANON_KEY`
   - Value: `vetcare-public-key`
5. [ ] New repository secret:
   - Name: `VITE_WS_URL`
   - Value: `wss://vetcare-realtime.onrender.com`

### 5.2️⃣ Trigger GitHub Actions Deployment

1. [ ] Update `frontend/.env.local` to use prod URLs:
   ```env
   VITE_API_URL=https://vetcare-api.onrender.com
   VITE_API_ANON_KEY=vetcare-public-key
   VITE_WS_URL=wss://vetcare-realtime.onrender.com
   ```

2. [ ] Commit and push:
   ```bash
   git add -A
   git commit -m "Configure production environment"
   git push origin main
   ```

3. [ ] GitHub Actions auto-deploys to `https://zenipara.github.io/VetCare/`
4. [ ] Check Actions tab to see deployment progress

### 5.3️⃣ Verify Frontend Deployment

- [ ] Visit: `https://zenipara.github.io/VetCare/`
- [ ] Should see login page
- [ ] Open DevTools (F12) → Network tab
- [ ] Click login button
- [ ] Verify API requests go to `https://vetcare-api.onrender.com`
- [ ] No CORS errors should appear in Console

---

## ✅ PHASE 6: End-to-End Testing (30 minutes)

### 6.1️⃣ Test User Registration

1. [ ] Visit frontend: `https://zenipara.github.io/VetCare/`
2. [ ] Click "Register" or "Sign Up"
3. [ ] Fill form:
   - Email: `vet+test@example.com`
   - Password: `Test12345!`
   - Full Name: `Test Veterinarian`
4. [ ] Submit
5. [ ] ✅ Should successfully register and redirect to dashboard

### 6.2️⃣ Test Login

1. [ ] Go to login page
2. [ ] Enter credentials from above
3. [ ] Click "Login"
4. [ ] ✅ Should successfully login and show dashboard

### 6.3️⃣ Test Core Features

- [ ] **View Pets**: Navigate to pets list
- [ ] **Create Booking**: Try to create appointment
- [ ] **View EMR**: Check medical records
- [ ] **Upload Image**: Try to upload a pet photo

### 6.4️⃣ Check Logs

**Monitor Render logs for errors:**

API Gateway:
```
Render Dashboard → vetcare-api → Logs tab
Should see: "Server running on port 4000"
```

Realtime:
```
Render Dashboard → vetcare-realtime → Logs tab
Should see: "WebSocket server running on :4001"
```

---

## 🎯 PHASE 7: Production Hardening (Optional - Do Later)

### 7.1️⃣ Security

- [ ] [ ] Implement rate limiting on `/api/auth/*` endpoints
  - Prevent brute force attacks
  - Limit: 5 attempts per 15 mins

- [ ] [ ] Add input validation (Zod/Joi schemas)
  - Validate all POST/PUT request bodies
  - Return 400 for invalid input

- [ ] [ ] Enable HTTPS everywhere
  - ✅ Already enabled on Render

- [ ] [ ] Set up error logging
  - Send errors to logging service
  - Monitor 5xx errors

### 7.2️⃣ Monitoring

- [ ] [ ] Set up Uptime monitoring
  - Monitor `/health` endpoint
  - Alert if down

- [ ] [ ] Set up Database monitoring
  - Check connection pool status
  - Monitor query performance

- [ ] [ ] Enable Render alerts
  - Alert on deployment failures
  - Alert on high memory usage

### 7.3️⃣ Backup & Recovery

- [ ] [ ] Enable PostgreSQL automated backups
  - Render → Database → Backups
  - Create daily backups

- [ ] [ ] Document recovery procedure
  - How to restore from backup
  - How to rollback deployment

---

## 📊 Deployment Status Tracker

```
PHASE 1: Infrastructure       [ ] Postgres  [ ] R2  [ ] Secrets
PHASE 2: API Gateway          [ ] Deployed  [ ] Tests Pass
PHASE 3: Database             [ ] Migrated  [ ] Tables Exist
PHASE 4: Realtime Service     [ ] Deployed  [ ] WebSocket Works
PHASE 5: Frontend             [ ] Deployed  [ ] Loads
PHASE 6: End-to-End Tests     [ ] Register  [ ] Login  [ ] Features
PHASE 7: Production Ready     [ ] Monitoring  [ ] Backups  [ ] Docs
```

---

## 🆘 Troubleshooting

### API Gateway Won't Deploy
```
Check Render logs:
- npm install failed?
- Database connection string wrong?
- Missing environment variables?

Solution:
1. View logs in Render dashboard
2. Fix issue
3. Render auto-redeploys
```

### Database Connection Error
```
Error: "connect ECONNREFUSED"

Causes:
- DATABASE_URL not set
- Wrong password
- Database not created
- IP not whitelisted (Render whitelists automatically)

Solution:
1. Verify DATABASE_URL is correct
2. Test locally: psql "$DATABASE_URL" -c "SELECT 1"
3. Restart Render service if connection pooling issue
```

### Frontend Shows Blank Page
```
Most likely:
- VITE_API_URL not set to correct Render URL
- Frontend built without production env vars

Solution:
1. Check GitHub Secrets are set
2. Check .env.local has prod URLs
3. Re-trigger GitHub Actions deployment
4. Clear browser cache and hard refresh (Ctrl+Shift+R)
```

### WebSocket Connection Fails
```
Error: "WebSocket connection failed"

Likely causes:
- Realtime service not deployed
- Firewall blocking WebSocket
- CORS configuration

Solution:
1. Check Render logs for realtime service
2. Verify JWT_SECRET matches API Gateway
3. Check browser console for specific error
```

### 500 Error from API
```
Error: "Internal Server Error"

Causes:
- Database query error
- Missing environment variable
- Unhandled exception

Solution:
1. Check Render API Gateway logs
2. Check database connection
3. Test endpoint locally first
```

---

## 🎉 Success Indicators

✅ **Production is Live When:**
- [ ] API Gateway responds to health check
- [ ] Frontend loads from GitHub Pages
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can view clinic data
- [ ] Can upload files (if R2 configured)
- [ ] WebSocket connection established
- [ ] No console errors in browser
- [ ] No 5xx errors in backend logs
- [ ] System stable for 24+ hours

---

## 📋 Post-Deployment Tasks

After successful deployment:

1. [ ] **Notify stakeholders**
   - System is live in production
   - Share URL: https://zenipara.github.io/VetCare/

2. [ ] **Monitor for issues**
   - Check logs daily
   - Monitor performance
   - Collect user feedback

3. [ ] **Create test accounts**
   - One admin account
   - One vet account
   - One receptionist account

4. [ ] **Document login credentials**
   - Store in secure password manager
   - Share with team

5. [ ] **Plan future improvements**
   - Rate limiting
   - Advanced logging
   - Performance optimization
   - Advanced features (payments, etc)

---

## 📞 Support & Resources

**If Something Goes Wrong:**
1. Check troubleshooting sections above
2. Check Render logs
3. Check backend/README.md
4. Check BACKEND_DEPLOYMENT_GUIDE.md
5. Check REALTIME_DEPLOYMENT_GUIDE.md

**Render Support**: https://render.com/support

**Team Contact**: Check README.md for team info

---

## ✨ Congratulations!

When you complete all phases, you'll have:
✅ Production-ready VetCare system  
✅ Scalable backend infrastructure  
✅ Real-time WebSocket service  
✅ Live frontend on GitHub Pages  
✅ PostgreSQL database with migrations  
✅ File storage integration  
✅ Comprehensive monitoring capability  

**System is now LIVE! 🚀**

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Notes**: _______________________________________________________

---

**Last Updated**: May 1, 2026  
**Status**: Production Ready ✨
