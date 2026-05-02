# VetCare Database Setup Guide

**Last Updated**: May 2, 2026  
**Status**: Local PostgreSQL (No Supabase dependency)

---

## 📋 Overview

VetCare now uses a local PostgreSQL database (no longer Supabase-dependent). This guide covers:
1. **Local Setup** - PostgreSQL on your machine for development
2. **Cloud Setup** - Render.com managed PostgreSQL for production
3. **Running Migrations** - Schema, data, and seed setup

---

## 🛠️ Local Development Setup

### Option 1: Using Docker (Fastest)

```bash
# Start PostgreSQL container
docker run --name vetcare-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vetcare \
  -p 5432:5432 \
  -d postgres:15-alpine

# Verify container is running
docker ps | grep vetcare-db

# Connect to database
psql -U postgres -h localhost -d vetcare
```

### Option 2: Install PostgreSQL Locally

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb vetcare
```

**Windows:**
- Download: https://www.postgresql.org/download/windows/
- Run installer and remember your password
- Use pgAdmin GUI or psql CLI

---

## 🔧 Running Migrations

### Step 1: Connect to Database

```bash
# Set environment variable
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vetcare"

# Or on Windows:
set DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/vetcare

# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

### Step 2: Apply Schema Migration

```bash
# Run the local schema
psql $DATABASE_URL -f database/migrations/001_initial_schema_local.sql

# Verify tables were created
psql $DATABASE_URL -c "\dt"
```

**Expected Output:**
```
                   List of relations
 Schema |           Name            | Type  |  Owner
--------+---------------------------+-------+----------
 public | appointments              | table | postgres
 public | batches                   | table | postgres
 public | blog_posts                | table | postgres
 public | case_photos               | table | postgres
 public | case_updates              | table | postgres
 public | clinic_profile            | table | postgres
 public | doctors                   | table | postgres
 public | inpatient_cases           | table | postgres
 public | medical_records           | table | postgres
 public | pets                      | table | postgres
 public | prescriptions             | table | postgres
 public | products                  | table | postgres
 public | profiles                  | table | postgres
 public | public_pages              | table | postgres
 public | services                  | table | postgres
 public | stock_movements           | table | postgres
 public | testimonials              | table | postgres
 public | treatments                | table | postgres
 public | users                     | table | postgres
 public | vendors                   | table | postgres
```

### Step 3: Seed Test Data

```bash
# Insert sample data
psql $DATABASE_URL -f database/seed_local.sql

# Verify data was inserted
psql $DATABASE_URL -c "SELECT count(*) FROM users; SELECT count(*) FROM pets; SELECT count(*) FROM services;"
```

**Expected Output:**
```
 count
-------
     7
(1 row)

 count
-------
     5
(1 row)

 count
-------
     5
(1 row)
```

---

## ☁️ Production Setup on Render.com

### Step 1: Create PostgreSQL Instance on Render

1. Go to https://render.com
2. Sign up/Login
3. Click "New" → "PostgreSQL"
4. Fill in details:
   - **Database Name**: `vetcare`
   - **User**: `vetcare_user`
   - **Region**: Choose closest to you (e.g., Singapore)
   - **IPAllowList**: Leave empty for now (or add your IP)

5. Click "Create Database"
6. Wait 2-3 minutes for provisioning
7. Copy the **Internal Database URL** (not External URL)

### Step 2: Connect to Render Database

```bash
# Set your Render DATABASE_URL
export DATABASE_URL="postgresql://vetcare_user:PASSWORD@dpg-xxxx.xxx.render.com:5432/vetcare"

# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

### Step 3: Apply Migrations on Render

```bash
# Run migrations against Render database
psql $DATABASE_URL -f database/migrations/001_initial_schema_local.sql

# Seed data
psql $DATABASE_URL -f database/seed_local.sql

# Verify
psql $DATABASE_URL -c "SELECT count(*) FROM users;"
```

### Step 4: Update Backend .env

Update `/backend/.env.local` or production `.env`:

```env
DATABASE_URL=postgresql://vetcare_user:PASSWORD@dpg-xxxx.xxx.render.com:5432/vetcare
```

---

## 📊 Database Schema

### Core Tables (23 total)

**Authentication & Access**
- `users` - User accounts (id, email, password_hash, role)
- `profiles` - Extended user info (full_name, phone, address)
- `doctors` - Doctor specializations (license_number, specialization)

**Pet & Appointment Management**
- `pets` - Pet records (owner_id, species, breed, birth_date)
- `services` - Available services (price, duration)
- `appointments` - Bookings (pet_id, doctor_id, scheduled_at, status)

**Medical Records**
- `medical_records` - Visit records (chief_complaint, diagnosis)
- `treatments` - Medical treatments (medicine, dosage)
- `prescriptions` - Prescriptions (medicine, dosage, frequency)

**Inpatient Care**
- `inpatient_cases` - Hospital stays (admit_date, status, severity)
- `case_updates` - Progress updates (vitals, stage)
- `case_photos` - Medical photos (photo_url, caption)

**Inventory Management**
- `products` - Inventory items (sku, price_buy, price_sell, stock_qty)
- `vendors` - Suppliers (name, contact, email)
- `batches` - Product batches (batch_number, expiry_date)
- `stock_movements` - Stock transactions (type, quantity, date)

**Content Management**
- `clinic_profile` - Clinic info (name, address, phone)
- `public_pages` - Website pages (slug, content)
- `blog_posts` - Blog articles (title, content, status)
- `testimonials` - Customer reviews (rating, content)

### Key Features

✅ **UUIDs** - Primary keys use gen_random_uuid()  
✅ **Indexes** - Performance optimized with strategic indexes  
✅ **Triggers** - Automatic updated_at timestamps  
✅ **Relationships** - Foreign key constraints with CASCADE  
✅ **Validations** - CHECK constraints for data integrity  
✅ **JSONB** - Flexible data for clinic hours, vitals, etc.  

---

## 🔐 Security

### Password Hashing

All passwords are hashed with bcryptjs before storage:

```javascript
// Backend code (server.ts)
const hash = await bcrypt.hash(password, 10);
// Store hash in users.password_hash
```

### Test Credentials

Sample users created during seeding:

```
Email: admin@vetcare.local
Password: password (hashed)

Email: doctor1@vetcare.local
Password: password (hashed)

Email: customer1@vetcare.local
Password: password (hashed)
```

**To reset passwords**, hash new password with bcryptjs:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('newpassword', 10))"
```

### Row Level Security (Future)

Current schema supports RLS implementation:
```sql
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_pets" ON pets
  FOR SELECT USING (owner_id = current_user_id);
```

---

## 🧪 Testing Database

### Check Database Health

```bash
# Total records
psql $DATABASE_URL -c "
  SELECT 
    (SELECT count(*) FROM users) as users,
    (SELECT count(*) FROM pets) as pets,
    (SELECT count(*) FROM appointments) as appointments,
    (SELECT count(*) FROM medical_records) as medical_records
;"

# Find tables
psql $DATABASE_URL -c "\dt"

# Check sequences
psql $DATABASE_URL -c "\ds"

# Check functions
psql $DATABASE_URL -c "\df"
```

### Database Backups

**Local:**
```bash
# Backup
pg_dump -U postgres vetcare > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres vetcare < backup_20260502.sql
```

**Render.com:**
```bash
# Render provides automatic backups
# Download from Dashboard → Backups
```

---

## 🐛 Troubleshooting

### Connection Issues

```bash
# Test connection
psql -h localhost -U postgres -d vetcare -c "SELECT 1;"

# Check PostgreSQL status
sudo systemctl status postgresql

# Check open connections
psql -U postgres -d vetcare -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"
```

### Migration Errors

```bash
# If migration failed partway, check what was created
psql $DATABASE_URL -c "\dt"

# Drop and restart (CAREFUL - deletes all data)
psql $DATABASE_URL -c "
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
"
# Then re-run migration
psql $DATABASE_URL -f database/migrations/001_initial_schema_local.sql
```

### Version Issues

```bash
# Check PostgreSQL version
psql --version

# Required: PostgreSQL 12+
# Tested with: PostgreSQL 15
```

---

## 📝 Backup & Restore Procedures

### Automated Backups (Render)

Render provides:
- Daily automated backups (7-day retention)
- Point-in-time recovery
- Downloadable backup files

### Manual Backup

```bash
# Full database backup
pg_dump --verbose --clean --no-password \
  --username=postgres \
  --host=localhost \
  --port=5432 \
  vetcare > vetcare_backup.sql

# Compressed backup
pg_dump --format=custom \
  --file=vetcare_backup.dump \
  --dbname=postgresql://user:pass@host:5432/vetcare

# Restore from backup
psql -U postgres vetcare < vetcare_backup.sql
```

---

## 🔄 Schema Updates (Migrations)

When adding new tables/changes:

1. **Create new migration file:**
   ```bash
   touch database/migrations/002_add_new_feature.sql
   ```

2. **Add SQL changes:**
   ```sql
   CREATE TABLE new_table (...);
   CREATE INDEX idx_name ON new_table(...);
   ```

3. **Apply to database:**
   ```bash
   psql $DATABASE_URL -f database/migrations/002_add_new_feature.sql
   ```

4. **Test changes:**
   ```bash
   psql $DATABASE_URL -c "\dt"
   ```

---

## 🚀 Next Steps

1. **Choose Setup Method:**
   - Local: Docker or native PostgreSQL
   - Cloud: Render.com managed instance

2. **Apply Migrations:**
   ```bash
   psql $DATABASE_URL -f database/migrations/001_initial_schema_local.sql
   psql $DATABASE_URL -f database/seed_local.sql
   ```

3. **Update Backend:**
   - Set `DATABASE_URL` in `.env`
   - Run `npm run dev`
   - Backend will use database immediately

4. **Test Endpoints:**
   - Use Postman collection
   - Create user via `/api/auth/sign-up`
   - Create pet via `/api/pets`
   - Run full test suite

---

## 📞 Support

For database issues:
1. Check migration files in `database/migrations/`
2. Review seed data in `database/seed_local.sql`
3. Test connection with psql
4. Check backend logs for database errors

---

**Status**: ✅ **Database Setup Ready**

Proceed to backend deployment once database is running!
