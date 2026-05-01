# GitHub Pages & Backend Deploy - Troubleshooting Guide

## 🔴 Status: Deploy Issues

This guide helps troubleshoot GitHub Pages frontend deploys and backend deployments on Render (Postgres and services). The repository no longer depends on a BaaS provider.

## 🎯 Action Items (TO-DO)

### CRITICAL - Harus dikerjakan:

#### 1. ⚠️ Configure Secrets in GitHub & Render
**GitHub Actions (frontend build)**: Repository Settings → Secrets and variables → Actions

Add at least the following secrets for the frontend build (if needed):

```
VITE_API_URL = https://api.yourdomain.com    # Node.js API gateway URL
GITHUB_PAGES = true                          # used to set Vite base path
```

**Render / Backend**: Configure environment & secrets in Render for each service:

```
DATABASE_URL         # Render Postgres connection string
JWT_SECRET
JWT_REFRESH_SECRET
CLOUDFLARE_R2_ENDPOINT
CLOUDFLARE_R2_ACCESS_KEY
CLOUDFLARE_R2_SECRET_KEY
R2_BUCKET
SERVICE_AUTH_TOKEN   # internal service authentication
```

If these secrets are missing, backend services or signed URL flows may fail.

#### 2. ✅ Enable GitHub Pages (If not enabled)
**Path**: Repository Settings → Pages

- Set **Source** to: "GitHub Actions" or the branch used by the deploy workflow.

#### 3. 🔍 Check Workflow Run Logs
**Path**: Repository → Actions → Latest "Build & Deploy VetCare System"

Look for failures in these steps:
1. Frontend Build (`frontend`): TypeScript/Vite errors
2. Verify dist folder: check `frontend/dist/` exists and contains files
3. Upload/Deploy Pages: check `actions/upload-pages-artifact` and `actions/deploy-pages`

If frontend builds but API calls fail in the browser, verify `VITE_API_URL` and CORS configuration on the API.

## 📋 Recent Changes

1. **Removed BaaS deployment steps** from CI and replaced them with guidance for Render-managed services.
2. **Added verification steps** in the workflow to list `frontend/dist/` contents.
3. **Frontend build now relies on `VITE_API_URL`** and `GITHUB_PAGES` for base path configuration.

## 🚀 Next Steps

### Immediate (Now):
1. Go to: `https://github.com/zenipara/VetCare/settings/secrets/actions`
2. Add `VITE_API_URL` (point to your API gateway) and set `GITHUB_PAGES=true` for CI if publishing to a subpath.
3. Configure Render services with the environment variables listed above.

### Then:
1. Open: `https://github.com/zenipara/VetCare/actions`
2. Re-run latest workflow or push a new commit
3. Inspect logs for the exact failing step and error messages

### If Still Failing:
- For frontend build errors: capture the TypeScript/Vite stack trace and fix code issues or dependencies.
- For deploy issues: verify artifact upload step shows files and `actions/deploy-pages` has permissions (`pages: write`, `id-token: write`).
- For API/runtime errors: check Render service logs and ensure `DATABASE_URL` and R2 credentials are correct.

## 📊 Deployment Architecture

```
Local (Dev)
  └─ Frontend: pnpm run dev (Vite)
  └─ API: node backend/api (local)
  └─ Realtime: go run backend/realtime

CI/CD (GitHub Actions)
  └─ Build frontend (Vite) -> upload artifact -> deploy to GitHub Pages

Production Hosting
  ├─ Frontend: GitHub Pages (static)
  ├─ API Gateway: Render Web Service (Node.js)
  ├─ Go Services: Render Web Services (realtime / workers)
  └─ Database: Render Managed PostgreSQL
  └─ Storage: Cloudflare R2 (signed uploads)
```

## 🔗 Final URL After Deploy Succeeds

```
https://zenipara.github.io/VetCare/
```

Update links in docs to point to your production `VITE_API_URL` and Render dashboard.

## 📞 Support

If issues persist:
1. Capture failing workflow step logs (Actions → run → failed step)
2. Check Render service logs for backend errors
3. Verify `DATABASE_URL` and R2 credentials in Render
4. Re-run build after fixing env vars

---

**Last Updated**: May 1, 2026
**Workflow**: `.github/workflows/deploy.yml`
**Config**: `frontend/vite.config.ts`
**Doc**: `DEPLOYMENT_CHECKLIST.md`
