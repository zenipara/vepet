# Supabase Setup Instructions

## 1. Create Project
- Buka https://supabase.com
- Buat project baru (atau gunakan existing project)
- Dapatkan `Project URL` dan `Anon Key`

## 2. Setup Environment Variables
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local dengan Project URL dan Anon Key
```

## 3. Run Migrations

Opsi A: Via Supabase Dashboard
- Buka SQL Editor di Supabase Dashboard
- Copy & paste isi dari migration files secara berurutan:
  1. migrations/001_initial_schema.sql
  2. migrations/002_functions_and_triggers.sql
  3. migrations/003_rls_policies.sql

Opsi B: Via CLI
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## 4. Enable Features
- Pergi ke Authentication → Providers → Matikan/nyalakan sesuai kebutuhan
- Setup email configuration di Settings

## 5. Create Storage (opsional)
- Buat bucket `case-photos` untuk Recovery Journey
- Buat bucket `avatars` untuk profil foto

## Test Data
Setelah migration berhasil, Anda bisa tambah test data:

```sql
-- Tambah services
INSERT INTO services (name, description, category, price, duration_min) VALUES
  ('Pemeriksaan Rutin', 'Konsultasi dan pemeriksaan umum', 'medical', 150000, 30),
  ('Vaksinasi', 'Program vaksinasi tahunan', 'medical', 200000, 20),
  ('Grooming', 'Perawatan bulu dan kuku', 'grooming', 250000, 60);

-- Tambah products
INSERT INTO products (name, sku, category, description, unit, price_buy, price_sell, min_stock) VALUES
  ('Antibiotik Amoxicillin', 'AMX-001', 'medicine', 'Obat antibiotik', 'tablet', 5000, 8000, 20),
  ('Saline Solution', 'SAL-001', 'medicine', 'Larutan salin steril', 'ml', 2000, 3500, 10),
  ('Pet Food Premium', 'PF-001', 'food', 'Makanan hewan premium', 'kg', 50000, 75000, 5);

-- Tambah clinic profile
INSERT INTO clinic_profile (name, tagline, description, phone, email, address) VALUES
  ('VetCare - Klinik Hewan Modern',
   'Kesehatan hewan peliharaan, prioritas kami',
   'Klinik hewan modern dengan dokter berpengalaman dan layanan 24/7',
   '+62-0812-3456-7890',
   'info@vetcare.com',
   'Jl. Kesehatan Hewan No. 123, Jakarta Selatan');
```
