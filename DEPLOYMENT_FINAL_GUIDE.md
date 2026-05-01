# ⚡ VetCare Deployment - Final Configuration Guide

## 📊 Current Status

✅ **Database Connection**: VERIFIED  
✅ **Supabase Project**: mdbositlivrfskbhcdxp (https://mdbositlivrfskbhcdxp.supabase.co)  
✅ **Code**: Pushed to GitHub (all TypeScript errors fixed)  
✅ **Workflow**: Ready in `.github/workflows/deploy.yml`  
✅ **Migrations**: Ready in `supabase/migrations/`  

⏳ **Pending**: Add GitHub secrets & enable GitHub Pages

---

## 🔐 PART 1: Add GitHub Secrets (3 Secrets)

### Go to GitHub Repository Settings

**URL**: https://github.com/zenipara/VetCare/settings/secrets/actions

Expected to see interface with "New repository secret" button.

---

### Secret 1️⃣: VITE_SUPABASE_URL

**When prompted:**
```
Name:  VITE_SUPABASE_URL
Value: https://mdbositlivrfskbhcdxp.supabase.co
```

**Then**: Click "Add secret"

---
# ⚡ VetCare Deployment - Final Configuration Guide

## Goal

Complete migration from BaaS-based docs to custom backend deployment using Render (services & Postgres), Cloudflare R2 for storage, and GitHub Pages for the frontend.

## 📊 Current Status

✅ **Code**: Pushed to GitHub (TypeScript checks present)  
✅ **Workflow**: `.github/workflows/deploy.yml` handles frontend build & pages deploy  
✅ **Migrations**: SQL files present in `supabase/migrations/` for database schema (can be applied to Render Postgres)

⏳ **Pending**: Configure Render services and update CI to run any DB migration tool you choose (psql, golang-migrate, etc.).

---

## 🔐 PART 1: Configure Hosting & Secrets

### Render (Backend Services & Database)

On Render, create the following services:

- `api-gateway` (Node.js service)
- `realtime-service` (Go WebSocket service)
- `worker-*` (optional background workers)
- Managed PostgreSQL instance (Render Managed DB)

In each service's environment settings, add the required secrets:

```
DATABASE_URL
JWT_SECRET
JWT_REFRESH_SECRET
CLOUDFLARE_R2_ENDPOINT
CLOUDFLARE_R2_ACCESS_KEY
CLOUDFLARE_R2_SECRET_KEY
R2_BUCKET
SERVICE_AUTH_TOKEN
```

### GitHub Actions (Frontend)

Add the following repository Actions secrets if your build requires them:

```
VITE_API_URL    # e.g. https://api.yourdomain.com
GITHUB_PAGES    # set to 'true' if building for GitHub Pages path
```

---

## 📄 PART 2: Enable GitHub Pages

1. Go to: `https://github.com/zenipara/VetCare/settings/pages`
2. Set **Source** to **GitHub Actions** (if using `actions/deploy-pages`).

---

## 🚀 PART 3: Trigger Deployment

Trigger the existing workflow by pushing to `main` or run the workflow manually in GitHub Actions. The job builds the frontend and publishes to GitHub Pages.

If you want backend services deployed via GitHub Actions, configure separate workflows to build/push Docker images or use Render's GitHub integration.

---

## 📈 PART 4: Monitor Deployment

Check both GitHub Actions and Render dashboard:

- GitHub Actions: frontend build logs and `actions/deploy-pages` steps
- Render: service build logs, startup logs, health checks, and Postgres instance status

Common checks:
- Frontend build: TypeScript errors, missing imports
- `frontend/dist/` contains built assets
- API reachable at `VITE_API_URL`
- Render service logs for runtime errors

---

## 🎯 PART 5: Verify Deployment Success

Frontend:

1. Visit `https://zenipara.github.io/VetCare/` and verify homepage loads
2. Open browser console and confirm API calls are made to `VITE_API_URL`

Backend:

1. Check Render service health and logs
2. Verify database connectivity from services (no connection errors)
3. Confirm signed URL flows for uploads to Cloudflare R2 work end-to-end

---

## 🧪 PART 6: Test Core Features

1. Authentication (login / refresh token flow)
2. Booking creation and status updates
3. EMR create/read
4. File upload using signed URL (R2)
5. Realtime notifications via WebSocket (Reatime Go service)

---

## 📋 Deployment Checklist

```
GITHUB CONFIGURATION
☑️ VITE_API_URL set in repository secrets
☑️ GitHub Pages enabled (source: GitHub Actions)

RENDER CONFIGURATION
☑️ API gateway created and configured
☑️ Realtime & worker services created
☑️ Managed Postgres provisioned and DATABASE_URL set
☑️ Cloudflare R2 credentials set for services

WORKFLOW EXECUTION
☑️ Frontend build succeeded
☑️ Artifact uploaded and Pages deployed

APPLICATION LIVE
☑️ Site URL active: https://zenipara.github.io/VetCare/
☑️ Frontend can call API gateway and receive valid responses
```

---

## 🐛 Troubleshooting

- If frontend build fails: inspect the TypeScript/Vite error in Actions logs and fix dependencies.
- If API calls fail in browser: verify `VITE_API_URL` and CORS policy on the API.
- If database migrations fail: run migrations manually against Render Postgres using `psql` or your migration runner and check for SQL errors.
- If signed URL uploads fail: verify Cloudflare R2 keys and bucket name.

---

## 📞 Need Help?

- Check GitHub Actions logs: https://github.com/zenipara/VetCare/actions
- Check Render service logs in the Render dashboard
- Check your Cloudflare R2 dashboard for storage issues

---

**Repository**: https://github.com/zenipara/VetCare  
**Live Site**: https://zenipara.github.io/VetCare/ (after deployment)  
**Last Updated**: May 1, 2026
1. Go to: https://app.supabase.com/
