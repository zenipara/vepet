# VetCare System

**VetCare** is a production-ready veterinary clinic management platform with a custom-built backend (Node.js + Go + PostgreSQL).

> **🚀 Getting Started?** Start with [START_HERE.md](START_HERE.md)  
> **📚 Need Docs?** All guides at [DOCS.md](DOCS.md)

## Overview

- **Frontend**: React SPA (GitHub Pages)
- **API**: Node.js + Express (Render)
- **Realtime**: Go + WebSocket (Render)
- **Database**: PostgreSQL (Render)
- **Storage**: Cloudflare R2

Key design principles:
- Clear separation between API Gateway and specialized services
- PostgreSQL as single source of truth
- Realtime via dedicated WebSocket service
- Secure file uploads with signed URLs

## Architecture

```
[Browser/React] → [GitHub Pages]
     ↓ REST API
[Node.js API Gateway] → [PostgreSQL] + [Cloudflare R2]
     ↓ WebSocket
[Go Realtime Service] ↔ [PostgreSQL]
```

**API Gateway** (Node.js): Authentication, request validation, API routing, signed URLs  
**Services** (Go): Realtime WebSocket, background workers, high-throughput processing  
**Database** (PostgreSQL): All persistent data  
**Storage** (Cloudflare R2): Files, images, backups

## 3. Tech Stack

- Node.js (API layer — Express or Fastify)
- Go (services & workers)
- PostgreSQL (Render Managed DB)
- Cloudflare R2 (S3-compatible object storage)
- Render (host for web services and managed Postgres)
- GitHub Pages (frontend hosting for the static SPA)

## 4. Feature Mapping

| Old (Supabase) | New System |
|---|---|
| Supabase Auth | Custom JWT Auth (Node.js) |
| Supabase DB | PostgreSQL (Render Managed) |
| Supabase Realtime | Go WebSocket Service (Render) |
| Supabase Storage | Cloudflare R2 (signed uploads) |
| Edge Functions | Node.js / Go Services (Render) |

## 5. Backend Architecture

API Gateway Pattern
- A single Node.js API gateway exposes REST and GraphQL endpoints to the frontend. It handles authentication, authorization, request validation, rate-limiting, and acts as a composition layer for aggregating data from multiple Go services and the database.

Service Layer (Go)
- Small, specialized Go services implement resource-intensive logic: realtime notifications, background jobs, analytics processing, and any CPU-bound workloads. Services communicate with the database and can publish/subscribe to a messaging layer (future).

Clean Architecture
- Controller → Service → Repository pattern
	- Controller: HTTP handlers, authentication/middleware, request validation
	- Service: business logic, orchestration among repositories and other services
	- Repository: database access, SQL queries, transactions

## 6. Authentication System

- JWT-based authentication with access and refresh tokens.
	- Access token: short-lived (e.g., 15m) JWT signed with `JWT_SECRET`.
	- Refresh token: long-lived, stored securely (httpOnly cookie or secure storage) and rotated on use.
- Role-based access control (RBAC) implemented through claims in JWT and middleware checks.
- Security via middleware for route protection, input validation, and rate limiting.

Recommended endpoints and flow
- `POST /auth/login` → validates credentials, returns access + refresh tokens
- `POST /auth/refresh` → exchanges a refresh token for new tokens
- `POST /auth/logout` → revoke refresh token
- `GET /me` → returns user profile (protected endpoint)

## 7. Database Design

- PostgreSQL is the single source of truth. Use normalized relational schema for core entities (users, clinics, patients, appointments, records, inventory, media references).
- Use UUID primary keys for portability and sharding-readiness.
- Basic indexing strategy:
	- Index foreign keys used in joins
	- Index columns used in WHERE filters (status, created_at, clinic_id)
	- Use partial indexes for high-cardinality soft-delete flags
	- Add composite indexes for common multi-column query patterns

Migration and schema management
- Store raw SQL migrations in `supabase/migrations/` (if currently present) or migrate to a `migrations/` folder compatible with `golang-migrate` / `node-pg-migrate` and run them during deployment.

## 8. File Storage

- Use Cloudflare R2 (S3-compatible) for storing user uploaded files.
- Flow:
	1. Frontend requests an upload URL from Node.js: `POST /uploads/signed-url`
	2. Node.js generates a signed URL (short TTL) for R2 and returns it
	3. Frontend uploads file directly to R2 using the signed URL
	4. After successful upload, frontend informs backend with file metadata to persist reference in PostgreSQL

Only the backend has R2 credentials. The application must never embed secret keys into the frontend.

## 9. Realtime System

- Implement a Go WebSocket service responsible for:
	- Client connection management and authentication (token-based)
	- Broadcasting notifications and live updates (appointment status, recovery journey)
	- Room/namespace support for clinic and patient scoped streams

Design notes
- Keep the WebSocket hub stateless where possible; use Redis or a message broker for cross-instance pub/sub if scaling horizontally.

## 10. Deployment

Hosting targets
- Frontend: GitHub Pages (static SPA built with Vite)
- Node.js API Gateway: Render Web Service (Docker or Node environment)
- Go Services: Render Web Services (each service as an independent service)
- Database: Render Managed PostgreSQL
- Storage: Cloudflare R2

Deployment steps (summary)
1. Create Render services for: `api-gateway`, `realtime-service`, `worker-*`.
2. Provision Render Managed PostgreSQL and configure network and credentials.
3. Configure environment variables and secrets in Render (see env list below).
4. Set up GitHub Actions (optional) to build and push Docker images or deploy direct from repo.
5. Build and publish frontend artifact to GitHub Pages.

Environment variables (example)
- Node.js API (Render):
	- `DATABASE_URL` (Postgres connection)
	- `JWT_SECRET`
	- `JWT_REFRESH_SECRET`
	- `CLOUDFLARE_R2_ENDPOINT`
	- `CLOUDFLARE_R2_ACCESS_KEY`
	- `CLOUDFLARE_R2_SECRET_KEY`
	- `R2_BUCKET` (or bucket name)
	- `SENTRY_DSN` (optional)
- Go Services (Render):
	- `DATABASE_URL`
	- `SERVICE_AUTH_TOKEN` (for internal service communication)
	- `REDIS_URL` (if using Redis)

Secrets management
- Use Render's secret management to store credentials securely. Rotate keys periodically.

## 11. Development Workflow

Local setup (recommended)
1. Clone repo
2. Create local `.env` files for each service (frontend, api, services)
3. Run Postgres locally (e.g., Docker) or use a dedicated dev database on Render
4. Start services independently:

Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

Node.js API (local)
```bash
cd backend/api
pnpm install
pnpm run dev # nodemon / ts-node
```

Go service (local)
```bash
cd backend/realtime
go run ./cmd/realtime
```

Environment variable separation
- Keep separate env files per service: `.env.frontend`, `.env.api`, `.env.realtime`.
- Do not commit env files with secrets. Use `.env.example` to document required variables.

Testing and migrations
- Run migrations locally against a test database. Use a migration tool compatible with both Node and Go teams.

## 12. Future Scalability

- Microservices-ready: services are isolated and can be scaled independently on Render or Kubernetes.
- Message queue: introduce Redis streams / RabbitMQ / Kafka for background job orchestration and decoupling (recommended when worker count grows).
- Horizontal scaling: use a shared pub/sub (Redis) for WebSocket cluster coordination.
- Observability: integrate metrics (Prometheus), traces (OpenTelemetry), and error tracking (Sentry).
- AI integrations: design service interfaces to plug in AI workers for diagnostics, suggestions, or automated tagging.

## Migration Notes (from previous BaaS)

- This project removed external BaaS dependencies. Any previous SQL or migration files should be migrated to the chosen migration tool and executed against the Render Postgres instance.
- Update CI/CD pipelines to remove legacy BaaS deployment steps and add Render deployment steps or Docker image publishing.

## 📚 Documentation

We maintain lean, non-redundant documentation:

| File | Purpose |
|------|---------|
| [START_HERE.md](START_HERE.md) | Quick navigation (choose your path) |
| [DOCS.md](DOCS.md) | Complete documentation index |
| [PRODUCTION_DEPLOYMENT_CHECKLIST.md](PRODUCTION_DEPLOYMENT_CHECKLIST.md) | How to deploy to production |
| [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) | Complete developer reference |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Local environment setup |
| [DEPLOYMENT_ARCHITECTURE.md](DEPLOYMENT_ARCHITECTURE.md) | Architecture overview |

---

## 🚀 Quick Start

**Deploy to production:**
```bash
# Read: PRODUCTION_DEPLOYMENT_CHECKLIST.md
# Follow: 7 phases (2-3 hours)
```

**Local development:**
```bash
# Read: SETUP_GUIDE.md
# Run: bash verify-predeployment.sh
# Code: npm run dev (multiple terminals)
```

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend API**: Node.js, Express, TypeScript
- **Realtime**: Go, Gorilla WebSocket
- **Database**: PostgreSQL
- **Storage**: Cloudflare R2
- **Hosting**: Render.com, GitHub Pages

---

## Contributing

- Follow the code style guide in [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
- Create migrations in `supabase/migrations/` for schema changes
- Document environment variables in `.env.example`
- Test locally before pushing

---

## Support

- **Setup issues?** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Deployment help?** → [PRODUCTION_DEPLOYMENT_CHECKLIST.md](PRODUCTION_DEPLOYMENT_CHECKLIST.md)
- **Questions?** → Check [DOCS.md](DOCS.md) for documentation map

---

**Status**: ✅ Production Ready  
**Last Updated**: May 1, 2026  
**License**: [See LICENSE file]
