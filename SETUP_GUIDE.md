# 🚀 VetCare Development Setup Guide

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Git
- Supabase CLI (`npm install -g supabase`)
- GitHub account (for deployment)

## Phase 1 Setup - Local Development

### Step 1: Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/zenipara/VetCare.git
cd VetCare/frontend

# Install dependencies
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter:
   - **Project Name:** `VetCare` (or any name)
   - **Database Password:** Strong password (save this!)
   - **Region:** Choose nearest to you
4. Wait for project creation (2-3 minutes)

### Step 3: Get API Keys

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "PUBLIC API URL")
   - **Anon Key** (under "Section Anon Key")

### Step 4: Configure Environment Variables

Edit `frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
```

### Step 5: Setup Database Schema

```bash
# Navigate to frontend directory
cd frontend

# Run migrations
npx supabase db push
```

This will:
- ✅ Create all tables (20+ tables)
- ✅ Setup RLS policies
- ✅ Create functions & triggers
- ✅ Setup storage buckets

### Step 6: Seed Sample Data (Optional)

```bash
# Run seed script
npm run seed
```

This will create sample data:
- 5 demo users (customer, staff, doctor, admin)
- 10 demo pets
- 5 demo services
- Test appointment data

### Step 7: Run Development Server

```bash
npm run dev
```

Server akan start di `http://localhost:5173`

---

## Testing Authentication

### Test Credentials for Local Demo

After seeding, gunakan credentials ini:

**Customer Account:**
- Email: `customer@example.com`
- Password: `password123`

**Doctor Account:**
- Email: `doctor@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

### Test Flow

1. Go to `http://localhost:5173`
2. Click **Login**
3. Enter credentials
4. System should:
   - ✅ Authenticate
   - ✅ Fetch user role
   - ✅ Redirect to appropriate dashboard

---

## Database Management

### View Database in Supabase Studio

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Browse tables or write custom queries

### Reset Database (Development Only)

```sql
-- Drop all tables
DROP TABLE IF EXISTS case_photos CASCADE;
DROP TABLE IF EXISTS case_updates CASCADE;
DROP TABLE IF EXISTS inpatient_cases CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS treatments CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS inventory_low_stock CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS public_pages CASCADE;
DROP TABLE IF EXISTS feature_flags CASCADE;
DROP TABLE IF EXISTS clinic_profile CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

Then run migrations again.

### Monitor Realtime Activity

```bash
# Run in terminal to see realtime events
supabase functions logs notifications
```

---

## Development Scripts

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run type-check    # Check TypeScript errors
npm run lint          # Run ESLint

# Database
npm run seed          # Seed sample data
npm run migrations:status  # Check migration status

# Utilities
npm run format        # Format code with Prettier
```

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:** Check `.env.local` file exists and has correct values:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Issue: "Authentication failed"

**Solution:** 
1. Check credentials (case-sensitive)
2. Verify user exists in Supabase (Auth tab)
3. Check RLS policies are enabled

### Issue: "Cannot connect to database"

**Solution:**
1. Verify VITE_SUPABASE_URL is correct format
2. Check internet connection
3. Go to Supabase → Settings → Check project status

### Issue: "RLS policy error"

**Solution:** Run migrations again to recreate policies:
```bash
npx supabase db push --dry-run  # Preview what will run
npx supabase db push            # Apply migrations
```

---

## Next Steps

✅ Phase 1 MVP Features:
- [x] Authentication system
- [ ] Customer Dashboard (in progress)
- [ ] Booking System (in progress)
- [ ] EMR System (in progress)

📋 After Phase 1:
- Phase 2: Recovery Journey, Inventory, CMS
- Phase 3: Multi-klinik, Analytics, AI Assistant
- Phase 4: Mobile App, Telemedicine

---

## Support

- 📖 [Supabase Docs](https://supabase.com/docs)
- 🐛 [Report Issues](https://github.com/zenipara/VetCare/issues)
- 💬 [Discussions](https://github.com/zenipara/VetCare/discussions)
