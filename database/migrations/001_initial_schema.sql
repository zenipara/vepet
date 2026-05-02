-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL CHECK (role IN ('customer', 'staff', 'doctor', 'admin')),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

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

-- ============================================
-- CMS - FEATURE FLAGS
-- ============================================
CREATE TABLE IF NOT EXISTS feature_flags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,
  label       TEXT NOT NULL,
  description TEXT,
  is_enabled  BOOLEAN DEFAULT true,
  updated_by  UUID REFERENCES profiles(id),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX idx_inpatient_cases_pet_id ON inpatient_cases(pet_id);
CREATE INDEX idx_case_updates_case_id ON case_updates(case_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_feature_flags_key ON feature_flags(key);

COMMIT;
