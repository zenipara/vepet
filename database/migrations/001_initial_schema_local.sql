-- ============================================
-- VetCare Database Schema - Standalone PostgreSQL
-- Migrated from Supabase to standalone PostgreSQL
-- ============================================

-- ============================================
-- USERS (menggantikan auth.users dari Supabase)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'doctor', 'admin')),
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- PROFILES (extended user info)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- ============================================
-- PETS (hewan milik customer)
-- ============================================
CREATE TABLE IF NOT EXISTS pets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  species     TEXT NOT NULL,
  breed       TEXT,
  gender      TEXT CHECK (gender IN ('male', 'female')),
  birth_date  DATE,
  weight_kg   DECIMAL(5,2),
  color       TEXT,
  chip_number TEXT UNIQUE,
  photo_url   TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_pets_is_active ON pets(is_active);

-- ============================================
-- DOCTORS (profil dokter)
-- ============================================
CREATE TABLE IF NOT EXISTS doctors (
  id              UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialization  TEXT,
  license_number  TEXT UNIQUE,
  bio             TEXT,
  consultation_fee DECIMAL(10,2),
  is_available    BOOLEAN DEFAULT true
);

-- ============================================
-- SERVICES (layanan klinik)
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  category    TEXT,
  price       DECIMAL(10,2),
  duration_min INTEGER,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

-- ============================================
-- APPOINTMENTS (booking / janji temu)
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id        UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  owner_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id     UUID REFERENCES doctors(id),
  service_id    UUID REFERENCES services(id),
  scheduled_at  TIMESTAMPTZ NOT NULL,
  duration_min  INTEGER DEFAULT 30,
  status        TEXT DEFAULT 'pending'
                CHECK (status IN ('pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled')),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_owner_id ON appointments(owner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ============================================
-- MEDICAL RECORDS (rekam medis per kunjungan)
-- ============================================
CREATE TABLE IF NOT EXISTS medical_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id          UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  appointment_id  UUID REFERENCES appointments(id),
  doctor_id       UUID NOT NULL REFERENCES doctors(id),
  visit_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  chief_complaint TEXT NOT NULL,
  symptoms        TEXT[],
  diagnosis       TEXT,
  notes           TEXT,
  follow_up_date  DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_visit_date ON medical_records(visit_date);

-- ============================================
-- TREATMENTS (tindakan medis)
-- ============================================
CREATE TABLE IF NOT EXISTS treatments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id       UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  product_id      UUID,
  name            TEXT NOT NULL,
  description     TEXT,
  quantity        DECIMAL(10,2),
  unit            TEXT,
  price           DECIMAL(10,2),
  administered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_treatments_record_id ON treatments(record_id);

-- ============================================
-- PRESCRIPTIONS (resep obat)
-- ============================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id   UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  product_id  UUID,
  medicine    TEXT NOT NULL,
  dosage      TEXT NOT NULL,
  frequency   TEXT NOT NULL,
  duration    TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_record_id ON prescriptions(record_id);

-- ============================================
-- INPATIENT CASES (rawat inap)
-- ============================================
CREATE TABLE IF NOT EXISTS inpatient_cases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id        UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  record_id     UUID REFERENCES medical_records(id),
  doctor_id     UUID NOT NULL REFERENCES doctors(id),
  admit_date    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  discharge_date TIMESTAMPTZ,
  cage_number   TEXT,
  status        TEXT DEFAULT 'admitted'
                CHECK (status IN ('admitted', 'lab_test', 'observation', 'recovery', 'discharged')),
  severity      TEXT DEFAULT 'normal'
                CHECK (severity IN ('critical', 'serious', 'normal', 'stable')),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inpatient_cases_pet_id ON inpatient_cases(pet_id);
CREATE INDEX IF NOT EXISTS idx_inpatient_cases_doctor_id ON inpatient_cases(doctor_id);
CREATE INDEX IF NOT EXISTS idx_inpatient_cases_status ON inpatient_cases(status);

-- ============================================
-- CASE UPDATES (timeline recovery)
-- ============================================
CREATE TABLE IF NOT EXISTS case_updates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID NOT NULL REFERENCES inpatient_cases(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES profiles(id),
  stage       TEXT NOT NULL
              CHECK (stage IN ('check_in', 'lab_test', 'observation', 'recovery', 'discharge')),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  vitals      JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_updates_case_id ON case_updates(case_id);

-- ============================================
-- CASE PHOTOS (foto kondisi hewan)
-- ============================================
CREATE TABLE IF NOT EXISTS case_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID NOT NULL REFERENCES inpatient_cases(id) ON DELETE CASCADE,
  update_id   UUID REFERENCES case_updates(id),
  uploader_id UUID NOT NULL REFERENCES profiles(id),
  photo_url   TEXT NOT NULL,
  caption     TEXT,
  taken_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_photos_case_id ON case_photos(case_id);

-- ============================================
-- VENDORS (supplier)
-- ============================================
CREATE TABLE IF NOT EXISTS vendors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  contact     TEXT,
  email       TEXT,
  phone       TEXT,
  address     TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON vendors(is_active);

-- ============================================
-- PRODUCTS (obat & produk petshop)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   UUID REFERENCES vendors(id),
  name        TEXT NOT NULL,
  sku         TEXT UNIQUE,
  category    TEXT,
  description TEXT,
  unit        TEXT NOT NULL,
  price_buy   DECIMAL(10,2),
  price_sell  DECIMAL(10,2),
  stock_qty   DECIMAL(10,2) DEFAULT 0,
  min_stock   DECIMAL(10,2) DEFAULT 5,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- ============================================
-- BATCHES (batch & expiry tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS batches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  batch_number  TEXT NOT NULL,
  quantity      DECIMAL(10,2) NOT NULL,
  expiry_date   DATE NOT NULL,
  received_date DATE DEFAULT CURRENT_DATE,
  notes         TEXT
);

CREATE INDEX IF NOT EXISTS idx_batches_product_id ON batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_expiry_date ON batches(expiry_date);

-- ============================================
-- STOCK MOVEMENTS (mutasi stok)
-- ============================================
CREATE TABLE IF NOT EXISTS stock_movements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id),
  batch_id      UUID REFERENCES batches(id),
  type          TEXT NOT NULL
                CHECK (type IN ('in', 'out', 'adjustment', 'expired')),
  quantity      DECIMAL(10,2) NOT NULL,
  reference_id  UUID,
  reference_type TEXT,
  notes         TEXT,
  created_by    UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type);

-- ============================================
-- CMS - CLINIC PROFILE
-- ============================================
CREATE TABLE IF NOT EXISTS clinic_profile (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  tagline       TEXT,
  description   TEXT,
  address       TEXT,
  phone         TEXT,
  email         TEXT,
  whatsapp      TEXT,
  maps_url      TEXT,
  logo_url      TEXT,
  cover_url     TEXT,
  open_hours    JSONB,
  social_media  JSONB,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CMS - PUBLIC PAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public_pages (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug      TEXT UNIQUE NOT NULL,
  title     TEXT NOT NULL,
  content   JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_pages_slug ON public_pages(slug);
CREATE INDEX IF NOT EXISTS idx_public_pages_is_active ON public_pages(is_active);

-- ============================================
-- CMS - BLOG POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   UUID REFERENCES profiles(id),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  excerpt     TEXT,
  content     TEXT NOT NULL,
  cover_url   TEXT,
  tags        TEXT[],
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- ============================================
-- CMS - TESTIMONIALS
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id),
  pet_name    TEXT,
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  content     TEXT NOT NULL,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);

-- ============================================
-- Create trigger function for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Apply updated_at triggers to tables
-- ============================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pets_updated_at ON pets;
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inpatient_cases_updated_at ON inpatient_cases;
CREATE TRIGGER update_inpatient_cases_updated_at BEFORE UPDATE ON inpatient_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
