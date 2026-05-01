# 🔐 VetCare Login - Setup & Troubleshooting Guide

## 🎯 QUICK START - Login Testing

### 1. Environment Variables Sekarang Setup ✅

File `.env.local` sudah dibuat dengan Supabase credentials:

```
VITE_SUPABASE_URL=https://mdbositlivrfskbhcdxp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYm9zaXRsaXZyZnNrYmhjZHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MjU1MzYsImV4cCI6MjA5MzIwMTUzNn0.yGRC1MlYJCuzetExRu6BwvUncJoDrvAuf456ZHKgzpk
```

✅ Supabase sudah connected

---

## 2️⃣ BUAT TEST ACCOUNTS

Anda perlu membuat test user accounts di Supabase sebelum bisa login.

### Cara Paling Mudah: Gunakan Supabase Dashboard

#### Open Supabase Auth Dashboard

1. **Go to**: https://app.supabase.com/
2. **Select Project**: mdbositlivrfskbhcdxp
3. **Go to**: Authentication → Users (di left sidebar)
4. **Click**: "Add user" (tombol atas kanan)

#### Buat Test User #1 (Customer)

```
Email:              customer@vetcare.com
Password:           TestPassword123!
Confirm password:   TestPassword123!
Auto generate password: (uncheck jika ada option ini)
```

**Click**: "Create user"

📝 **COPY User ID** (UUID) yang muncul - Anda perlu ini nanti!

#### Buat Test User #2 (Doctor)

```
Email:              doctor@vetcare.com
Password:           TestPassword123!
Confirm password:   TestPassword123!
```

**Click**: "Create user"

📝 **COPY User ID** (UUID)

#### Buat Test User #3 (Staff)

```
Email:              staff@vetcare.com
Password:           TestPassword123!
Confirm password:   TestPassword123!
```

**Click**: "Create user"

📝 **COPY User ID** (UUID)

#### Buat Test User #4 (Admin)

```
Email:              admin@vetcare.com
Password:           AdminPassword123!
Confirm password:   AdminPassword123!
```

**Click**: "Create user"

📝 **COPY User ID** (UUID)

---

## 3️⃣ CREATE PROFILES FOR TEST USERS

Setelah auth users created, Anda perlu create profiles di database.

### Open Supabase SQL Editor

1. **Go to**: https://app.supabase.com/
2. **Select Project**: mdbositlivrfskbhcdxp
3. **Go to**: SQL Editor (di left sidebar)
4. **Click**: "New query"

### Paste & Update SQL

```sql
-- Replace UUIDs with actual values from previous step
-- customer_uuid, doctor_uuid, staff_uuid, admin_uuid

INSERT INTO profiles (id, full_name, phone, role, is_active)
VALUES
  ('CUSTOMER_UUID_HERE', 'Test Customer', '+62-0812-1111-1111', 'customer', true),
  ('DOCTOR_UUID_HERE', 'Dr. Vetcare', '+62-0812-2222-2222', 'doctor', true),
  ('STAFF_UUID_HERE', 'Staff Test', '+62-0812-3333-3333', 'staff', true),
  ('ADMIN_UUID_HERE', 'Admin VetCare', '+62-0812-4444-4444', 'admin', true);
```

### How to get UUIDs:

1. Go to: Authentication → Users di Supabase
2. Click each user
3. Copy the "User ID" field (looks like: `12345678-1234-1234-1234-123456789012`)

**Example**:
```sql
INSERT INTO profiles (id, full_name, phone, role, is_active)
VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Test Customer', '+62-0812-1111-1111', 'customer', true),
  ('550e8400-e29b-41d4-a716-446655440000', 'Dr. Vetcare', '+62-0812-2222-2222', 'doctor', true),
  ...
```

---

## 4️⃣ START DEVELOPMENT SERVER

```bash
cd /workspaces/VetCare/frontend
npm run dev
```

Expected output:
```
  VITE v5.4.21  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Dev server running

---

## 5️⃣ TEST LOGIN

### Go to Application

**URL**: http://localhost:5173/

You should see VetCare homepage.

### Click Login

**URL**: http://localhost:5173/login

### Enter Test Credentials

```
Email:    customer@vetcare.com
Password: TestPassword123!
```

**Click**: Masuk

---

## 🎯 Expected Results

### If Login Successful ✅

```
1. Form submits
2. Redirects to: http://localhost:5173/dashboard
3. Shows: Customer Dashboard
4. No console errors
5. Sidebar visible with navigation
```

### If Login Failed ❌

**Check browser console**: Press F12 → Console tab

**Look for errors**:

```
Error: Missing Supabase environment variables
  → .env.local not set correctly

Error: Invalid credentials
  → Wrong email/password combination

Error: User not found
  → Profile not inserted in database

Error: Network error
  → Supabase not reachable (check internet)
```

---

## 🧪 Test All Roles

After customer login works, test other roles:

### Doctor Login
```
Email:    doctor@vetcare.com
Password: TestPassword123!

Expected redirect: /clinic/appointments
```

### Staff Login
```
Email:    staff@vetcare.com
Password: TestPassword123!

Expected redirect: /clinic
```

### Admin Login
```
Email:    admin@vetcare.com
Password: AdminPassword123!

Expected redirect: /admin
```

---

## 🐛 TROUBLESHOOTING

### ❌ Error: "Missing Supabase environment variables"

**Check**:
1. File `.env.local` exists in `frontend/` folder
2. Contains both:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. No typos

**Fix**:
```bash
cd /workspaces/VetCare/frontend
# Verify file exists
cat .env.local

# Should show both variables
```

**Restart dev server**: Ctrl+C and `npm run dev`

---

### ❌ Error: "Invalid credentials"

**Cause**: Email/password wrong

**Fix**:
1. Double-check typing (case-sensitive!)
2. Verify user created in Supabase
3. Try another user

---

### ❌ Error: "User not found" or "No profile"

**Cause**: Auth user created but profile not inserted

**Fix**:
1. Go to Supabase → SQL Editor
2. Run INSERT query to create profile (see step 3 above)
3. Verify profile inserted: 
   ```sql
   SELECT * FROM profiles WHERE id='USER_UUID';
   ```

---

### ❌ Blank page or console errors

**Check**:
1. Press F12 → Console tab
2. Look for red errors
3. Check network tab for failed requests

**Common issues**:
- CORS errors → Supabase URL mismatch
- 404 on API calls → Environment variables wrong
- White page → JavaScript error in app

---

### ❌ "Unexpected token in JSON"

**Cause**: Supabase key invalid or corrupted

**Fix**:
1. Verify anon key copied correctly (very long string)
2. No spaces before/after
3. All special characters intact

**Test**: Go to Supabase dashboard and verify key value

---

## 📋 Verification Checklist

After successful login test, verify:

```
FRONTEND
☐ Homepage loads
☐ Login page accessible
☐ Can submit form
☐ No JavaScript errors (F12 console)

SUPABASE CONNECTION
☐ Credentials set in .env.local
☐ Auth users created in Supabase dashboard
☐ Profiles inserted in database
☐ Can login with test account

DASHBOARD AFTER LOGIN
☐ Redirects to appropriate page (customer/clinic/admin)
☐ User info displays correctly
☐ Navigation menu works
☐ Session persistence (refresh = still logged in)

FEATURES
☐ Can view pet list (if customer)
☐ Can create booking (if customer)
☐ Can view appointments (if doctor/staff)
☐ Can access admin (if admin)
```

---

## 🚀 NEXT STEPS

After login working locally:

1. **Test other features**:
   - Pet management
   - Booking flow
   - EMR records
   - Dashboard features

2. **Deploy to GitHub Pages**:
   - Add GitHub secrets
   - Enable GitHub Pages
   - Run workflow

3. **Production users**:
   - Create real user accounts
   - Setup role-based access
   - Configure email verification

---

## 📞 Need Help?

**Development**:
- Dev server issues: Check `npm run dev` output
- Login page: Inspect `src/pages/auth/LoginPage.tsx`
- Auth service: Check `src/features/auth/services/authService.ts`

**Supabase**:
- Dashboard: https://app.supabase.com/
- Auth users: Authentication → Users
- SQL queries: SQL Editor
- Logs: Database → Logs (untuk errors)

**Environment**:
- Variables: `.env.local` file
- Docs: See `VITE_SUPABASE_URL` docs in supabase SDK

---

## 📚 Reference

**Test Credentials Summary**:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Customer | customer@vetcare.com | TestPassword123! | Dashboard, Booking |
| Doctor | doctor@vetcare.com | TestPassword123! | Clinic, Appointments |
| Staff | staff@vetcare.com | TestPassword123! | Clinic operations |
| Admin | admin@vetcare.com | AdminPassword123! | Full admin access |

**Important Files**:
- `.env.local` - Environment variables
- `TEST_ACCOUNTS_SETUP.sql` - Account setup guide
- `src/pages/auth/LoginPage.tsx` - Login UI
- `src/features/auth/services/authService.ts` - Auth logic

---

**Status**: 🟢 Ready for Login Testing  
**Dependencies**: ✅ Supabase connected  
**Next**: Create test accounts → Test login locally → Deploy

Good luck! 🚀
