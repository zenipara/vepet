# Backend API Deployment (Consolidated)

Panduan ini telah digabungkan ke `DEPLOYMENT_GUIDE.md`. Untuk instruksi lengkap tentang deployment backend, lihat:

[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

Jika Anda memerlukan petunjuk khusus untuk `backend/README.md` (konfigurasi environment, scripts, atau contoh `systemd`), beri tahu saya dan saya akan tambahkan di sana.

#### Create Web Service

1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repository (zenipara/VetCare)
4. Configure:
   - **Name**: `vetcare-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

#### Set Environment Variables in Render Dashboard

```
# Server Config
PORT=4000
NODE_ENV=production

# Database
DATABASE_URL=<get from Render Postgres instance>

# JWT Secrets (generate strong keys)
JWT_SECRET=<random strong key>
JWT_REFRESH_SECRET=<random strong key>
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=<your account id>
CLOUDFLARE_R2_ACCESS_KEY=<your access key>
CLOUDFLARE_R2_SECRET_KEY=<your secret key>
R2_BUCKET_NAME=vetcare-uploads
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# CORS (allow GitHub Pages)
CORS_ORIGIN=https://zenipara.github.io/VetCare,http://localhost:5173
```

#### Deploy

1. Paste environment variables into Render dashboard
2. Click **Deploy**
3. Wait for build to complete (~3-5 minutes)
4. Get your service URL: `https://vetcare-api.onrender.com`

### 3. Configure Frontend

Update `frontend/.env.local` or GitHub Actions secrets:

```
VITE_API_URL=https://vetcare-api.onrender.com
VITE_API_ANON_KEY=placeholder-or-your-key
```

### 4. Test API

```bash
# Health check
curl https://vetcare-api.onrender.com/health

# Sign up
curl -X POST https://vetcare-api.onrender.com/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "full_name":"Test User"
  }'

# Sign in
curl -X POST https://vetcare-api.onrender.com/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

## Creating Render PostgreSQL Instance

If you don't have a Postgres database:

1. Go to [render.com](https://render.com)
2. Create new **PostgreSQL Render** database
3. Copy the **Internal Database URL**
4. Use this as `DATABASE_URL` in API Gateway environment variables

## Monitoring & Logs

### Render Dashboard

1. Go to your `vetcare-api` service
2. Click **Logs** to see real-time output
3. Check deployment history in **Events**

### Local Testing

```bash
cd backend
cp .env.example .env.local
# Edit .env.local with your values
npm install
npm run dev
```

## Troubleshooting

### Database Connection Error

**Error**: `connect ECONNREFUSED`

**Fix**: Ensure `DATABASE_URL` is correct and Postgres instance is accessible

### JWT Secret Error

**Error**: `JWT secret not configured`

**Fix**: Set `JWT_SECRET` and `JWT_REFRESH_SECRET` in environment variables

### CORS Error

**Error**: `cors policy: no 'access-control-allow-origin' header`

**Fix**: Add frontend URL to `CORS_ORIGIN` environment variable (comma-separated)

### R2 Upload Error

**Error**: `NoSuchBucket` or auth error

**Fix**: Verify Cloudflare R2 credentials and bucket name

## Next Steps

1. ✅ Deploy API Gateway to Render
2. ✅ Set up PostgreSQL database
3. ⏳ Deploy frontend to GitHub Pages with `VITE_API_URL` pointing to API
4. ⏳ Implement Go realtime WebSocket service
5. ⏳ Add monitoring & logging

## Supporting Docs

- Backend README: [backend/README.md](README.md)
- Frontend env setup: [SETUP_GUIDE.md](../SETUP_GUIDE.md)
- Architecture: [README.md](../README.md)
