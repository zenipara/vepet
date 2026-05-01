# VetCare API Gateway

Express.js backend API gateway for VetCare veterinary clinic system. Provides authentication, CRUD operations, and file uploads to Cloudflare R2.

## Features

- **JWT Authentication** - Access & refresh tokens
- **Generic CRUD API** - Auto-generated endpoints for database tables
- **Cloudflare R2 Integration** - Direct upload support with signed URLs
- **PostgreSQL** - Any Postgres instance (local, Render, RDS, etc.)
- **CORS** - Configurable for GitHub Pages and custom domains
- **TypeScript** - Full type safety

## Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL running
- Cloudflare R2 account (optional, for uploads)

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. **Create database schema** (ensure PostgreSQL migrations have been applied)
```bash
# Apply migrations from supabase/migrations/ to your Postgres instance
psql "$DATABASE_URL" -f ../supabase/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f ../supabase/migrations/002_functions_and_triggers.sql
psql "$DATABASE_URL" -f ../supabase/migrations/003_rls_policies.sql
```

4. **Start development server**
```bash
npm run dev
```

Server will run on `http://localhost:4000`

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/sign-up` - Register new user
  ```json
  { "email": "user@example.com", "password": "123456", "full_name": "John Doe" }
  ```

- `POST /api/auth/sign-in` - Login
  ```json
  { "email": "user@example.com", "password": "123456" }
  ```

- `POST /api/auth/refresh` - Refresh access token
  ```json
  { "refresh_token": "..." }
  ```

- `GET /api/auth/me` - Get current user (requires auth header)

### CRUD Operations (`/api`)

Auto-generated endpoints for tables:
- `/api/pets` - Pet management
- `/api/bookings` - Booking/Appointment management
- `/api/services` - Available services
- `/api/doctors` - Doctor management
- `/api/appointments` - Appointment management
- `/api/medical_records` - EMR records

Operations:
- `GET /api/[table]` - List all
- `GET /api/[table]/:id` - Get by ID
- `POST /api/[table]` - Create new
- `PUT /api/[table]/:id` - Update
- `DELETE /api/[table]/:id` - Delete

All CRUD endpoints require `Authorization: Bearer <access_token>` header.

### File Upload (`/api/upload`)

- `POST /api/upload/signed-url` - Get signed URL for direct R2 upload
  ```json
  { "filename": "photo.jpg", "content_type": "image/jpeg" }
  ```
  Response:
  ```json
  { "signed_url": "...", "object_key": "...", "public_url": "..." }
  ```

- `POST /api/upload/upload` - Server-side upload (base64 encoded)
  ```json
  { "filename": "photo.jpg", "content_type": "image/jpeg", "file_content": "..." }
  ```

## Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgres://postgres:password@localhost:5432/vetcare

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY=your-key
CLOUDFLARE_R2_SECRET_KEY=your-secret
R2_BUCKET_NAME=vetcare-uploads
R2_ENDPOINT=https://...r2.cloudflarestorage.com

# CORS
CORS_ORIGIN=http://localhost:5173,https://zenipara.github.io
```

## Development

### Build
```bash
npm run build
```

### Type checking
```bash
npx tsc --noEmit
```

## Deployment

### To Render.com

1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables in Render dashboard
4. Deploy: `npm install && npm run build && npm start`

### To other platforms

Ensure Node.js >= 18 and PostgreSQL connection string are available.

## Architecture

```
backend/
├── src/
│   ├── server.ts           # Express app entry
│   ├── middleware/
│   │   └── auth.ts         # JWT auth middleware
│   ├── routes/
│   │   ├── auth.ts         # Auth endpoints
│   │   ├── crud.ts         # Generic CRUD
│   │   └── upload.ts       # Upload endpoints
│   ├── controllers/
│   │   ├── auth.ts         # Auth logic
│   │   ├── crud.ts         # CRUD logic
│   │   └── upload.ts       # Upload logic
│   └── utils/
│       ├── db.ts           # Pool & queries
│       └── jwt.ts          # JWT utilities
├── package.json
├── tsconfig.json
└── .env.example
```

## Security Notes

- JWT secrets should be strong and unique in production
- Enable HTTPS/SSL in production
- Use environment variables for all secrets (never commit to git)
- Implement rate limiting for auth endpoints (TODO)
- Validate & sanitize all inputs (basic validation added, extend as needed)
- Use prepared statements for all database queries (implemented)

## Next Steps

- [ ] Add rate limiting
- [ ] Add request validation schemas (Joi/Zod)
- [ ] Add comprehensive error handling
- [ ] Add WebSocket support for realtime
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add logging & monitoring
- [ ] Add database transaction support

## Contributing

This is part of the VetCare project. See main [README.md](../README.md) for overall contribution guidelines.
