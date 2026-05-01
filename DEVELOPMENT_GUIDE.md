# 📖 VetCare Development Guide

**Architecture**: Custom Backend (Node.js + Go + PostgreSQL)  
**Last Updated**: May 1, 2026  
**Status**: Production Ready

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ 
- Go 1.21+
- PostgreSQL 14+ (or use Render managed DB)
- Git

### Setup Local Environment

```bash
# Clone and navigate
git clone https://github.com/zenipara/VetCare.git
cd VetCare

# Frontend setup
cd frontend
cp .env.example .env.local
npm install

# Backend setup (in new terminal)
cd backend
cp .env.example .env
npm install

# Realtime setup (in new terminal)
cd services/realtime
cp .env.example .env
go mod download

# Return to root
cd /path/to/VetCare
```

### Environment Variables

**`frontend/.env.local`** (for local dev):
```env
VITE_API_URL=http://localhost:4000
VITE_API_ANON_KEY=dev-key-12345
```

**`backend/.env`** (for local dev):
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/vetcare
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
CLOUDFLARE_R2_ACCESS_KEY=dummy-for-dev
CLOUDFLARE_R2_SECRET_KEY=dummy-for-dev
R2_ENDPOINT=https://r2.example.com
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**`services/realtime/.env`** (for local dev):
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/vetcare
JWT_SECRET=dev-secret-key-change-in-production
SERVICE_AUTH_TOKEN=dev-service-token
PORT=4001
```

---

## 📁 Project Structure

```
/workspaces/VetCare/
│
├── 📄 README.md                    # Main project overview
├── 📄 SETUP_GUIDE.md               # Installation guide
├── 📄 DEVELOPMENT_GUIDE.md         # This file
│
├── 🎨 frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx             # Main app component
│   │   │   ├── Router.tsx          # Route configuration
│   │   │   └── layouts/            # Layout components
│   │   ├── components/
│   │   │   ├── layout/             # Navbar, Sidebar, etc
│   │   │   ├── ui/                 # Button, Card, Modal, etc
│   │   │   └── seo/                # SEO component
│   │   ├── features/               # Feature modules (auth, booking, etc)
│   │   ├── pages/                  # Page components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── store/                  # Zustand global state
│   │   ├── lib/
│   │   │   ├── supabaseClient.ts   # ⭐ API shim (not Supabase!)
│   │   │   └── config.ts
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Helper functions
│   │   └── styles/                 # TailwindCSS
│   ├── vite.config.ts              # Vite configuration
│   ├── tsconfig.json               # TypeScript config
│   ├── tailwind.config.ts          # TailwindCSS config
│   ├── postcss.config.js           # PostCSS config
│   └── package.json
│
├── 🔧 backend/                     # Node.js Express API
│   ├── src/
│   │   ├── server.ts               # Express app entry point
│   │   ├── controllers/
│   │   │   ├── auth.ts             # Login, signup, refresh token
│   │   │   ├── crud.ts             # Generic CRUD operations
│   │   │   └── upload.ts           # File upload handling
│   │   ├── routes/
│   │   │   ├── auth.ts             # POST /api/auth/*
│   │   │   ├── crud.ts             # GET/POST/PUT/DELETE /api/*
│   │   │   └── upload.ts           # POST /api/upload/*
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT verification
│   │   │   ├── errorHandler.ts     # Error handling
│   │   │   └── cors.ts             # CORS configuration
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   └── request.ts
│   │   └── utils/
│   │       ├── db.ts               # PostgreSQL connection
│   │       ├── jwt.ts              # Token generation/verification
│   │       └── logger.ts           # Logging utility
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── README.md                   # API documentation
│
├── 🌐 services/realtime/           # Go WebSocket Service
│   ├── main.go                     # WebSocket hub & client handling
│   ├── go.mod                      # Go dependencies
│   ├── go.sum
│   ├── .env.example
│   └── README.md
│
├── 🗄️ supabase/                     # Database & Migrations
│   ├── migrations/
│   │   ├── 001_initial_schema.sql       # Tables & columns
│   │   ├── 002_functions_and_triggers.sql  # Stored procedures
│   │   └── 003_rls_policies.sql         # Row-level security
│   ├── seed.sql                    # Sample data
│   └── README.md
│
└── 📚 docs/                        # Deployment & setup docs
    ├── DEPLOYMENT_ARCHITECTURE.md
    ├── BACKEND_DEPLOYMENT_GUIDE.md
    ├── REALTIME_DEPLOYMENT_GUIDE.md
    └── ... other guides
```

---

## 🏃 Local Development Workflow

### 1. Start PostgreSQL (if local)

```bash
# Using Docker
docker run --name vetcare-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vetcare \
  -p 5432:5432 \
  -d postgres:15

# Or use existing local PostgreSQL
psql postgres
```

### 2. Apply Database Migrations

```bash
# Connect to database
psql "postgresql://user:pass@localhost:5432/vetcare"

# Run migrations in order
\i supabase/migrations/001_initial_schema.sql
\i supabase/migrations/002_functions_and_triggers.sql
\i supabase/migrations/003_rls_policies.sql

# Optional: seed sample data
\i supabase/seed.sql
```

### 3. Start Backend API Gateway

```bash
cd backend

# Install dependencies
npm install

# Start development server (auto-reload)
npm run dev

# Or run with TypeScript watch
npm run dev:watch
```

Expected output:
```
✅ Server running on http://localhost:4000
✅ Database connected
✅ CORS enabled for http://localhost:5173
```

### 4. Start Realtime Service (separate terminal)

```bash
cd services/realtime

# Download Go dependencies
go mod download

# Run development server
go run main.go

# Or build & run
go build -o main .
./main
```

Expected output:
```
🚀 WebSocket server running on :4001
✅ Health check: GET /health
```

### 5. Start Frontend (separate terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press 'h' to show help
```

### 6. Test the Full Stack

**Register a user:**
```bash
curl -X POST http://localhost:4000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@test.com",
    "password": "Test12345!",
    "full_name": "Dev Tester"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@test.com",
    "password": "Test12345!"
  }'
# Copy the access_token from response
```

**Fetch data (e.g., pets):**
```bash
curl http://localhost:4000/api/pets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Visit frontend:**
```
http://localhost:5173/
```

---

## 🛠️ Development Commands

### Frontend

```bash
cd frontend

npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript types
npm run format          # Format code with Prettier
```

### Backend

```bash
cd backend

npm run dev             # Start dev server with auto-reload
npm run build           # Build TypeScript
npm start               # Start production server
npm run dev:watch       # Watch TypeScript changes
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run db:migrate      # Run migrations
npm test                # Run tests (if available)
```

### Realtime Service

```bash
cd services/realtime

go run main.go          # Run directly
go build -o main .      # Build binary
go test ./...           # Run tests
go fmt ./...            # Format code
go vet ./...            # Run static analysis
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/sign-up        Register new user
POST   /api/auth/sign-in        Login user
POST   /api/auth/refresh        Refresh JWT token
GET    /api/auth/me             Get current user profile
```

### CRUD Operations (Generic)
```
GET    /api/[table]             Fetch all records
GET    /api/[table]/:id         Fetch single record
POST   /api/[table]             Create new record
PUT    /api/[table]/:id         Update record
DELETE /api/[table]/:id         Delete record
```

**Supported Tables**: `pets`, `bookings`, `services`, `doctors`, `appointments`, `medical_records`, `users`, `clinics`

### File Upload
```
POST   /api/upload/signed-url   Get Cloudflare R2 signed URL
POST   /api/upload/upload       Server-side upload (base64)
```

### Health Checks
```
GET    /health                  API Gateway health
GET    /health                  Realtime service health (on :4001)
```

---

## 📝 Coding Standards

### TypeScript Configuration
- Use strict mode (enabled in `tsconfig.json`)
- Avoid `any` type - use proper typing
- Use interfaces/types for all objects
- Enable strict null checks

### Code Style
- Use 2-space indentation
- Use `const` by default, `let` when reassignment needed
- Avoid `var` completely
- Use arrow functions: `() => {}`
- Use template literals for strings

### Naming Conventions
- Files: `camelCase.ts` or `PascalCase.tsx` for components
- Variables: `camelCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Functions: `camelCase()`
- Database tables: `snake_case`

### Folder Organization
- Components: `features/[featureName]/components/`
- Hooks: `features/[featureName]/hooks/` or `hooks/`
- Services: `features/[featureName]/services/`
- Types: `types/` at root level
- Utils: `utils/` at root level

---

## 🗄️ Database Operations

### Connect to Local Database
```bash
psql "postgresql://user:pass@localhost:5432/vetcare"
```

### Common Commands
```sql
-- List all tables
\dt

-- Describe table
\d [table_name]

-- View data
SELECT * FROM [table_name] LIMIT 10;

-- Count records
SELECT COUNT(*) FROM [table_name];

-- Clear table data (keep schema)
DELETE FROM [table_name];

-- Drop table
DROP TABLE [table_name];
```

### Check Migrations Status
```sql
-- Migrations are applied directly, not tracked in a table
-- Verify by checking if tables exist:
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

---

## 🐛 Debugging Tips

### Frontend Issues
- Open DevTools: `F12` or `Ctrl+Shift+I`
- Check Network tab for API calls
- Check Console for errors
- Use `console.log()` for debugging
- Use React DevTools browser extension

### Backend Issues
- Check logs: `npm run dev` shows console output
- Use `console.log()` for debugging
- Check environment variables: `cat .env` (don't commit!)
- Test endpoints with cURL or Postman
- Enable SQL query logging (see backend README)

### Database Issues
- Connect with `psql` and run queries directly
- Check for connection errors in backend logs
- Verify migrations applied: `\dt` in psql
- Check for permission issues

### Realtime Issues
- Test WebSocket connection: `websocat wss://localhost:4001/ws` (install websocat)
- Check Go server logs
- Verify JWT token is valid
- Test with browser console:
  ```javascript
  ws = new WebSocket('ws://localhost:4001/ws');
  ws.onopen = () => console.log('Connected');
  ws.onmessage = (e) => console.log('Message:', e.data);
  ```

---

## 🚀 Building for Production

### Frontend
```bash
cd frontend
npm run build

# Output: dist/ folder ready for GitHub Pages
# Preview: npm run preview
```

### Backend
```bash
cd backend
npm run build

# Output: dist/ folder ready for deployment
# Start: NODE_ENV=production npm start
```

### Realtime
```bash
cd services/realtime
go build -o vetcare-realtime .

# Output: vetcare-realtime binary ready for deployment
```

---

## 📦 Dependencies

### Frontend Key Packages
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool
- TailwindCSS - Styling
- React Router - Routing
- Zustand - State management
- Axios - HTTP client

### Backend Key Packages
- Express.js - Web framework
- PostgreSQL (pg) - Database driver
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- @aws-sdk/client-s3 - Cloudflare R2 client
- TypeScript - Type safety
- dotenv - Environment variables

### Realtime Key Packages
- github.com/gorilla/websocket - WebSocket library
- github.com/joho/godotenv - Environment variables
- github.com/lib/pq - PostgreSQL driver

---

## 🔒 Security Checklist

### Frontend
- [ ] Never commit `.env.local`
- [ ] No API keys directly in code
- [ ] Validate user input
- [ ] Use HTTPS in production
- [ ] Sanitize user-generated content

### Backend
- [ ] Use strong JWT secrets (32+ chars)
- [ ] Hash passwords with bcryptjs
- [ ] Validate all inputs
- [ ] Use prepared statements (pg library does this)
- [ ] Enable CORS only for trusted origins
- [ ] Implement rate limiting (future)
- [ ] Log security events

### Database
- [ ] Use strong passwords
- [ ] Enable SSL/TLS connections
- [ ] Use Row-Level Security (RLS policies)
- [ ] Regular backups
- [ ] Monitor access logs

---

## 📚 Additional Resources

### Documentation
- [README.md](README.md) - Project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation guide
- [backend/README.md](backend/README.md) - API documentation
- [services/realtime/README.md](services/realtime/README.md) - Realtime docs

### External Docs
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Gorilla WebSocket](https://pkg.go.dev/github.com/gorilla/websocket)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Editor
- [Git](https://git-scm.com/) - Version control

---

## 💬 Common Questions

**Q: How do I change an API endpoint?**  
A: Edit `backend/src/routes/` files and restart dev server.

**Q: How do I add a new database table?**  
A: Create a migration in `supabase/migrations/` and apply it.

**Q: How do I update the frontend?**  
A: Edit files in `frontend/src/` - Vite auto-reloads.

**Q: How do I debug the database?**  
A: Connect with `psql` and run SQL queries directly.

**Q: Can I use Supabase anymore?**  
A: No - the project has been fully migrated away from Supabase to custom backend.

**Q: How do I test WebSocket connections?**  
A: See "Realtime Issues" debugging section above.

---

## 🎯 Next Steps

1. **Setup**: Follow "Quick Start" section above
2. **Explore**: Read through backend/README.md and frontend code
3. **Code**: Start implementing features
4. **Test**: Test locally before pushing
5. **Deploy**: Follow DEPLOYMENT_NEXT_STEPS_FINAL.md when ready

---

**Questions? Errors?** Check DOCUMENTATION_STATUS.md for help resources.

**Last Updated**: May 1, 2026  
**Maintained By**: VetCare Development Team
