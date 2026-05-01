# 🔐 VetCare Login - Setup & Troubleshooting Guide

## 🎯 QUICK START - Login Testing

### 1. Environment Variables Sekarang Setup ✅

File `.env.local` sudah dibuat dengan kredensial API/backend:

```
VITE_API_URL=https://api.yourdomain.com
DATABASE_URL=postgres://postgres:<PASSWORD>@<host>:5432/postgres
```

✅ Backend API & Postgres sudah connected (pastikan secrets diset di environment)

---

## 2️⃣ BUAT TEST ACCOUNTS

Anda perlu membuat test user accounts (bisa lewat API admin endpoints atau langsung ke database) sebelum bisa login.

### Cara Paling Mudah: Gunakan API Admin atau psql

#### Opsional A — Gunakan API admin endpoint

1. Panggil endpoint admin (mis. `POST /admin/users`) pada `VITE_API_URL` untuk membuat user.
2. Simpan `user_id` yang dikembalikan untuk membuat profile di DB.

#### Opsional B — Masuk langsung ke Postgres (psql/pgAdmin)

1. Sambungkan ke database menggunakan `DATABASE_URL`.
2. Jalankan INSERT ke tabel `auth_users` atau `profiles` (tergantung implementasi).

Contoh psql (masuk ke DB dan jalankan):

```sql
INSERT INTO profiles (id, full_name, phone, role, is_active, email, password_hash)
VALUES
  ('CUSTOMER_UUID_HERE', 'Test Customer', '+62-0812-1111-1111', 'customer', true, 'customer@vetcare.com', '<hashed_password>');
```

Catatan: cara membuat user lewat psql bergantung pada skema auth Anda — untuk alur JWT, Anda mungkin perlu membuat user record dan set password hash sesuai format yang digunakan backend.

---

## 3️⃣ CREATE PROFILES FOR TEST USERS

Setelah auth users created, Anda perlu create profiles di database.

### Mengisikan profiles ke database

Jika Anda membuat users via API admin, gunakan user_id yang dikembalikan untuk membuat profile. Jika langsung ke DB, jalankan SQL via `psql` atau pgAdmin.

Contoh menggunakan `psql`:

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

1. Jika menggunakan API admin, simpan `user_id` yang dikembalikan oleh API.
2. Jika membuat user lewat psql, gunakan UUID yang Anda generate atau ambil dari tabel users.

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
Error: Missing backend environment variables
  → .env.local not set correctly (periksa `VITE_API_URL` dan `DATABASE_URL`)

Error: Invalid credentials
  → Wrong email/password combination

Error: User not found
  → Profile not inserted in database

Error: Network error
  → API gateway not reachable (check internet / API_URL)
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
