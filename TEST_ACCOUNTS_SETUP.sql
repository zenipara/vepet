-- Test User Accounts Setup untuk VetCare
-- Gunakan script ini untuk membuat test accounts di Supabase

-- ⚠️ IMPORTANT: Supabase Auth users harus dibuat melalui Auth API, bukan SQL langsung
-- Gunakan Supabase UI atau API untuk create auth users

-- OPTION 1: Buat test users melalui Supabase Dashboard (RECOMMENDED)
-- ============================================================
-- 1. Login ke: https://app.supabase.com/
-- 2. Select project: mdbositlivrfskbhcdxp
-- 3. Go to: Authentication → Users
-- 4. Click: "Add user"
-- 5. Create these test accounts:

-- TEST ACCOUNT 1 - CUSTOMER
-- Email: customer@vetcare.com
-- Password: TestPassword123!
-- Confirm password: TestPassword123!

-- TEST ACCOUNT 2 - DOCTOR
-- Email: doctor@vetcare.com
-- Password: TestPassword123!
-- Confirm password: TestPassword123!

-- TEST ACCOUNT 3 - STAFF
-- Email: staff@vetcare.com
-- Password: TestPassword123!
-- Confirm password: TestPassword123!

-- TEST ACCOUNT 4 - ADMIN
-- Email: admin@vetcare.com
-- Password: AdminPassword123!
-- Confirm password: AdminPassword123!

-- ⚠️ After creating auth users, you'll get their UUIDs
-- Then use those UUIDs to insert profiles (see OPTION 2 below)

-- OPTION 2: Insert profiles for test users (after auth users created)
-- ==================================================================

-- Replace UUID_1, UUID_2, etc. with actual user IDs from auth table

-- Customer Profile
-- INSERT INTO profiles (id, full_name, phone, address, avatar_url, role, is_active)
-- VALUES (
--   'UUID_1_REPLACE_WITH_ACTUAL_ID',
--   'Customer Test',
--   '+62-0812-3456-7890',
--   'Jl. Test No. 1',
--   NULL,
--   'customer',
--   true
-- );

-- Doctor Profile
-- INSERT INTO profiles (id, full_name, phone, address, avatar_url, role, is_active)
-- VALUES (
--   'UUID_2_REPLACE_WITH_ACTUAL_ID',
--   'Dr. Vetcare',
--   '+62-0812-3456-7891',
--   'Jl. Test No. 2',
--   NULL,
--   'doctor',
--   true
-- );

-- Staff Profile
-- INSERT INTO profiles (id, full_name, phone, address, avatar_url, role, is_active)
-- VALUES (
--   'UUID_3_REPLACE_WITH_ACTUAL_ID',
--   'Staff Test',
--   '+62-0812-3456-7892',
--   'Jl. Test No. 3',
--   NULL,
--   'staff',
--   true
-- );

-- Admin Profile
-- INSERT INTO profiles (id, full_name, phone, address, avatar_url, role, is_active)
-- VALUES (
--   'UUID_4_REPLACE_WITH_ACTUAL_ID',
--   'Admin VetCare',
--   '+62-0812-3456-7893',
--   'Jl. Test No. 4',
--   NULL,
--   'admin',
--   true
-- );

-- Quick Reference: Test Credentials
-- ==================================

-- CUSTOMER
-- Email: customer@vetcare.com
-- Password: TestPassword123!
-- Role: customer
-- Can: Browse services, make bookings, view own EMR

-- DOCTOR
-- Email: doctor@vetcare.com
-- Password: TestPassword123!
-- Role: doctor
-- Can: View clinic appointments, manage EMR records

-- STAFF
-- Email: staff@vetcare.com
-- Password: TestPassword123!
-- Role: staff
-- Can: Manage clinic operations, appointments

-- ADMIN
-- Email: admin@vetcare.com
-- Password: AdminPassword123!
-- Role: admin
-- Can: Full system access, user management, settings

-- Steps to Test Login
-- ====================
-- 1. Start dev server: npm run dev
-- 2. Go to: http://localhost:5173/login
-- 3. Enter test credentials (from above)
-- 4. Should redirect to appropriate dashboard based on role
