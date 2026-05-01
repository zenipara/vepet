# 🐾 VetCare System — Panduan Pengembangan Lengkap

> **Versi Dokumen:** 1.0.0  
│   │   │   │
│   │   │   ├── cms/
│   │   │   │   ├── components/
│   │   │   │   │   ├── PageEditor.tsx
│   │   │   │   │   ├── ServiceManager.tsx
│   │   │   │   │   ├── TestimonialManager.tsx
│   │   │   │   │   └── BlogEditor.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useCMS.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── cmsService.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   └── notifications/
│   │   │       ├── components/
│   │   │       │   └── NotificationPanel.tsx
│   │   │       ├── hooks/
│   │   │       │   └── useNotifications.ts
│   │   │       ├── services/
│   │   │       │   └── notificationService.ts
│   │   │       └── types.ts
│   │   │
│   │   ├── lib/                     # Core services & config
│   │   │   ├── supabaseClient.ts    # Supabase instance
│   │   │   ├── api.ts               # Generic API helpers
│   │   │   └── config.ts            # App config constants
│   │   │
│   │   ├── hooks/                   # Global custom hooks
│   │   │   ├── useUser.ts
│   │   │   ├── useRole.ts
│   │   │   ├── useFeatureFlag.ts
│   │   │   └── useRealtime.ts
│   │   │
│   │   ├── store/                   # Zustand global state
│   │   │   ├── authStore.ts
│   │   │   ├── petStore.ts
│   │   │   └── notificationStore.ts
│   │   │
│   │   ├── utils/                   # Helper functions
│   │   │   ├── formatDate.ts
│   │   │   ├── formatCurrency.ts
│   │   │   ├── roleGuard.ts
│   │   │   └── validation.ts
│   │   │
│   │   ├── types/                   # Global TypeScript types
│   │   │   ├── supabase.ts          # Generated from Supabase
│   │   │   ├── roles.ts
│   │   │   └── global.ts
│   │   │
│   │   └── styles/
│   │       └── globals.css          # TailwindCSS base
│   │
│   ├── .env.local                   # Local env vars (jangan di-commit)
│   ├── .env.example                 # Template env vars
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── supabase/                        # Backend config
│   ├── migrations/                  # SQL schema versioning
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_functions.sql
│   │   └── 004_triggers.sql
│   ├── seed/
│   │   ├── seed_profiles.sql
│   │   ├── seed_services.sql
│   │   └── seed_cms.sql
│   ├── functions/                   # Supabase Edge Functions
│   │   ├── booking/
│   │   │   └── index.ts
│   │   ├── inventory/
│   │   │   └── index.ts
│   │   └── notifications/
│   │       └── index.ts
│   ├── policies/                    # RLS SQL files
│   │   ├── profiles.sql
│   │   ├── pets.sql
│   │   ├── appointments.sql
│   │   ├── emr.sql
│   │   └── cms.sql
│   └── config.toml
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── ui.md
│   └── deployment.md
│
├── scripts/
│   ├── setup.sh
│   ├── migrate.sh
│   ├── seed.sh
│   └── deploy.sh
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── README.md
├── PANDUAN_PENGEMBANGAN.md          # File ini
├── .env.example
└── LICENSE
```

---

## 5. Setup & Instalasi

### 5.1 Prerequisites

Pastikan tools berikut sudah terinstal:

```bash
node --version   # >= 18.x
npm --version    # >= 9.x
git --version    # >= 2.x
```

Install Supabase CLI (opsional, untuk local dev):

```bash
npm install -g supabase
supabase --version
```

### 5.2 Clone & Install

```bash
# Clone repository
git clone https://github.com/your-username/vetcare-system.git
cd vetcare-system/frontend

# Install dependencies
npm install
```

### 5.3 Environment Variables

Buat file `.env.local` di folder `frontend/`:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Config
VITE_APP_NAME=VetCare System
VITE_APP_VERSION=1.0.0
```

> ⚠️ **JANGAN** commit `.env.local` ke repository. File `.env.example` tersedia sebagai template.

### 5.4 Supabase Client Setup

`src/lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
```

### 5.5 Run Development

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

### 5.6 Build Production

```bash
npm run build
# Output: frontend/dist/
```

### 5.7 Supabase Database Setup

```bash
# Login ke Supabase CLI
supabase login

# Link ke project
supabase link --project-ref YOUR_PROJECT_REF

# Jalankan semua migrations
supabase db push

# Seed data awal
supabase db seed
```

---

## 6. Database Schema Lengkap

### 6.1 Core Tables

```sql
-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
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
CREATE TABLE pets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES profiles(id),
  name        TEXT NOT NULL,
  species     TEXT NOT NULL,         -- dog, cat, rabbit, dll
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
CREATE TABLE doctors (
  id              UUID PRIMARY KEY REFERENCES profiles(id),
  specialization  TEXT,
  license_number  TEXT UNIQUE,
  bio             TEXT,
  consultation_fee DECIMAL(10,2),
  is_available    BOOLEAN DEFAULT true
);

-- ============================================
-- SERVICES (layanan klinik)
-- ============================================
CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  category    TEXT,                   -- grooming, medical, dental, dll
  price       DECIMAL(10,2),
  duration_min INTEGER,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS (booking / janji temu)
-- ============================================
CREATE TABLE appointments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id        UUID NOT NULL REFERENCES pets(id),
  owner_id      UUID NOT NULL REFERENCES profiles(id),
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
```

### 6.2 Medical Tables

```sql
-- ============================================
-- MEDICAL RECORDS (rekam medis per kunjungan)
-- ============================================
CREATE TABLE medical_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id          UUID NOT NULL REFERENCES pets(id),
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
CREATE TABLE treatments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id       UUID NOT NULL REFERENCES medical_records(id),
  product_id      UUID REFERENCES products(id),  -- obat / alkes
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
CREATE TABLE prescriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id   UUID NOT NULL REFERENCES medical_records(id),
  product_id  UUID REFERENCES products(id),
  medicine    TEXT NOT NULL,
  dosage      TEXT NOT NULL,
  frequency   TEXT NOT NULL,
  duration    TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.3 Recovery / Inpatient Tables

```sql
-- ============================================
-- INPATIENT CASES (rawat inap)
-- ============================================
CREATE TABLE inpatient_cases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id        UUID NOT NULL REFERENCES pets(id),
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
CREATE TABLE case_updates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID NOT NULL REFERENCES inpatient_cases(id),
  author_id   UUID NOT NULL REFERENCES profiles(id),
  stage       TEXT NOT NULL
              CHECK (stage IN ('check_in', 'lab_test', 'observation', 'recovery', 'discharge')),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  vitals      JSONB,               -- { weight, temperature, heart_rate, notes }
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CASE PHOTOS (foto kondisi hewan)
-- ============================================
CREATE TABLE case_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID NOT NULL REFERENCES inpatient_cases(id),
  update_id   UUID REFERENCES case_updates(id),
  uploader_id UUID NOT NULL REFERENCES profiles(id),
  photo_url   TEXT NOT NULL,
  caption     TEXT,
  taken_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.4 Inventory Tables

```sql
-- ============================================
-- VENDORS (supplier)
-- ============================================
CREATE TABLE vendors (
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
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   UUID REFERENCES vendors(id),
  name        TEXT NOT NULL,
  sku         TEXT UNIQUE,
  category    TEXT,                -- medicine, supplement, food, grooming, dll
  description TEXT,
  unit        TEXT NOT NULL,       -- tablet, ml, sachet, dll
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
CREATE TABLE batches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id),
  batch_number  TEXT NOT NULL,
  quantity      DECIMAL(10,2) NOT NULL,
  expiry_date   DATE NOT NULL,
  received_date DATE DEFAULT CURRENT_DATE,
  notes         TEXT
);

-- ============================================
-- STOCK MOVEMENTS (mutasi stok)
-- ============================================
CREATE TABLE stock_movements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id),
  batch_id      UUID REFERENCES batches(id),
  type          TEXT NOT NULL
                CHECK (type IN ('in', 'out', 'adjustment', 'expired')),
  quantity      DECIMAL(10,2) NOT NULL,
  reference_id  UUID,               -- treatment_id, purchase_id, dll
  reference_type TEXT,              -- 'treatment', 'purchase', 'adjustment'
  notes         TEXT,
  created_by    UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.5 CMS Tables

```sql
-- ============================================
-- CLINIC PROFILE (profil klinik)
-- ============================================
CREATE TABLE clinic_profile (
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
  open_hours    JSONB,              -- { mon: "08:00-17:00", ... }
  social_media  JSONB,              -- { instagram, facebook, tiktok }
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PUBLIC PAGES (konten halaman publik)
-- ============================================
CREATE TABLE public_pages (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug      TEXT UNIQUE NOT NULL,  -- 'home', 'about', 'services'
  title     TEXT NOT NULL,
  content   JSONB NOT NULL,        -- flexible content blocks
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS (artikel edukasi)
-- ============================================
CREATE TABLE blog_posts (
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
-- TESTIMONIALS (ulasan pelanggan)
-- ============================================
CREATE TABLE testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id),
  pet_name    TEXT,
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  content     TEXT NOT NULL,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FEATURE FLAGS (toggle fitur ON/OFF)
-- ============================================
CREATE TABLE feature_flags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL, -- 'booking', 'emergency', 'blog'
  label       TEXT NOT NULL,
  description TEXT,
  is_enabled  BOOLEAN DEFAULT true,
  updated_by  UUID REFERENCES profiles(id),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Supabase RLS & Security

### 7.1 Enable RLS pada semua tabel

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inpatient_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
```

### 7.2 Helper Function: Get Role

```sql
-- Function untuk cek role user yang sedang login
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### 7.3 RLS Policies

```sql
-- =====================
-- PROFILES
-- =====================
-- User hanya bisa lihat & edit profil sendiri
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Admin bisa lihat semua profil
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (get_user_role() = 'admin');

-- =====================
-- PETS
-- =====================
-- Customer hanya lihat hewan miliknya
CREATE POLICY "pets_owner_select" ON pets
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "pets_owner_insert" ON pets
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "pets_owner_update" ON pets
  FOR UPDATE USING (owner_id = auth.uid());

-- Staff & Doctor & Admin bisa lihat semua hewan
CREATE POLICY "pets_clinic_select" ON pets
  FOR SELECT USING (get_user_role() IN ('staff', 'doctor', 'admin'));

-- =====================
-- APPOINTMENTS
-- =====================
CREATE POLICY "appointments_owner_select" ON appointments
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "appointments_owner_insert" ON appointments
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "appointments_clinic_all" ON appointments
  FOR ALL USING (get_user_role() IN ('staff', 'doctor', 'admin'));

-- =====================
-- MEDICAL RECORDS (hanya doctor & admin)
-- =====================
CREATE POLICY "emr_doctor_all" ON medical_records
  FOR ALL USING (get_user_role() IN ('doctor', 'admin'));

-- Customer bisa READ rekam medis hewan miliknya
CREATE POLICY "emr_owner_select" ON medical_records
  FOR SELECT USING (
    pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid())
  );

-- =====================
-- INPATIENT CASES
-- =====================
CREATE POLICY "inpatient_clinic_all" ON inpatient_cases
  FOR ALL USING (get_user_role() IN ('staff', 'doctor', 'admin'));

-- Customer READ untuk hewan miliknya
CREATE POLICY "inpatient_owner_select" ON inpatient_cases
  FOR SELECT USING (
    pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid())
  );

-- =====================
-- CASE UPDATES & PHOTOS (realtime)
-- =====================
CREATE POLICY "case_updates_clinic_all" ON case_updates
  FOR ALL USING (get_user_role() IN ('staff', 'doctor', 'admin'));

CREATE POLICY "case_updates_owner_select" ON case_updates
  FOR SELECT USING (
    case_id IN (
      SELECT ic.id FROM inpatient_cases ic
      JOIN pets p ON p.id = ic.pet_id
      WHERE p.owner_id = auth.uid()
    )
  );

-- =====================
-- INVENTORY (staff & admin only)
-- =====================
CREATE POLICY "products_staff_select" ON products
  FOR SELECT USING (get_user_role() IN ('staff', 'doctor', 'admin'));

CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (get_user_role() IN ('admin', 'staff'));

-- =====================
-- CMS (public read, admin write)
-- =====================
CREATE POLICY "clinic_profile_public_read" ON clinic_profile
  FOR SELECT USING (true);

CREATE POLICY "clinic_profile_admin_write" ON clinic_profile
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "blog_published_public_read" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "blog_admin_all" ON blog_posts
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "feature_flags_public_read" ON feature_flags
  FOR SELECT USING (true);

CREATE POLICY "feature_flags_admin_write" ON feature_flags
  FOR ALL USING (get_user_role() = 'admin');
```

---

## 8. Sistem Autentikasi & Role

### 8.1 Flow Login

```
User input email + password
    ↓
supabase.auth.signInWithPassword()
    ↓
Supabase Auth → JWT Token
    ↓
Fetch profiles table → get role
    ↓
Redirect berdasarkan role:
  customer → /dashboard
  staff    → /clinic
  doctor   → /clinic
  admin    → /admin
```

### 8.2 Auth Service

`src/features/auth/services/authService.ts`:

```typescript
import { supabase } from '@/lib/supabaseClient'
import type { UserRole } from '@/types/roles'

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getUserRole(userId: string): Promise<UserRole> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data.role as UserRole
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },
}
```

### 8.3 Auth Hook

`src/features/auth/hooks/useAuth.ts`:

```typescript
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, role, setUser, setRole, clearAuth } = useAuthStore()

  useEffect(() => {
    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user)
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (data) {
            setRole(data.role)
            redirectByRole(data.role)
          }
        } else if (event === 'SIGNED_OUT') {
          clearAuth()
          navigate('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const redirectByRole = (role: string) => {
    const redirectMap: Record<string, string> = {
      customer: '/dashboard',
      staff: '/clinic',
      doctor: '/clinic',
      admin: '/admin',
    }
    navigate(redirectMap[role] || '/login')
  }

  return { user, role }
}
```

### 8.4 Route Guard

`src/utils/roleGuard.ts`:

```typescript
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { role, user } = useAuthStore()

  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />

  return <>{children}</>
}
```

### 8.5 Router Definition

`src/app/Router.tsx`:

```typescript
import { createBrowserRouter } from 'react-router-dom'
import { RoleGuard } from '@/utils/roleGuard'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/dashboard',
    element: (
      <RoleGuard allowedRoles={['customer']}>
        <DashboardPage />
      </RoleGuard>
    ),
  },
  {
    path: '/clinic',
    element: (
      <RoleGuard allowedRoles={['staff', 'doctor']}>
        <ClinicPage />
      </RoleGuard>
    ),
  },
  {
    path: '/admin',
    element: (
      <RoleGuard allowedRoles={['admin']}>
        <AdminPage />
      </RoleGuard>
    ),
  },
])
```

---

## 9. Feature Modules

Setiap feature adalah **independent module** dengan struktur:

```
features/{feature}/
├── components/     → UI components spesifik fitur
├── hooks/          → Custom React hooks
├── services/       → Semua Supabase calls
├── store/          → Zustand local state (opsional)
├── types.ts        → TypeScript types untuk fitur ini
└── utils.ts        → Helper functions spesifik fitur
```

### 9.1 Booking Service (Contoh Lengkap)

`src/features/booking/services/bookingService.ts`:

```typescript
import { supabase } from '@/lib/supabaseClient'
import type { Booking, CreateBookingDTO } from '../types'

export const bookingService = {
  // Ambil semua booking milik customer yang login
  async getMyBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        pets(name, species, photo_url),
        doctors(profiles(full_name)),
        services(name, duration_min, price)
      `)
      .order('scheduled_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Cek slot dokter tersedia (anti double booking)
  async getAvailableSlots(doctorId: string, date: string) {
    const startOfDay = `${date}T00:00:00`
    const endOfDay = `${date}T23:59:59`

    const { data: booked, error } = await supabase
      .from('appointments')
      .select('scheduled_at, duration_min')
      .eq('doctor_id', doctorId)
      .gte('scheduled_at', startOfDay)
      .lte('scheduled_at', endOfDay)
      .in('status', ['pending', 'confirmed', 'in_progress'])

    if (error) throw error

    // Generate all slots (08:00–17:00 per 30 menit)
    const allSlots = generateTimeSlots('08:00', '17:00', 30)

    // Filter slot yang sudah terpakai
    const bookedTimes = booked.map(b =>
      new Date(b.scheduled_at).toTimeString().slice(0, 5)
    )

    return allSlots.filter(slot => !bookedTimes.includes(slot))
  },

  // Buat booking baru
  async createBooking(payload: CreateBookingDTO): Promise<Booking> {
    const { data, error } = await supabase
      .from('appointments')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update status booking (untuk staff)
  async updateStatus(bookingId: string, status: string) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
```

### 9.2 EMR Service

`src/features/emr/services/emrService.ts`:

```typescript
import { supabase } from '@/lib/supabaseClient'

export const emrService = {
  // Riwayat rekam medis lengkap satu hewan
  async getPetMedicalHistory(petId: string) {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        doctors(profiles(full_name)),
        treatments(*),
        prescriptions(*)
      `)
      .eq('pet_id', petId)
      .order('visit_date', { ascending: false })

    if (error) throw error
    return data
  },

  // Buat rekam medis baru
  async createRecord(payload: CreateRecordDTO) {
    const { data, error } = await supabase
      .from('medical_records')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Input treatment → auto deduct stock
  async addTreatment(payload: CreateTreatmentDTO) {
    const { data, error } = await supabase
      .from('treatments')
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    // Auto deduct stok jika ada product_id
    if (payload.product_id && payload.quantity) {
      await supabase.rpc('deduct_product_stock', {
        p_product_id: payload.product_id,
        p_quantity: payload.quantity,
        p_reference_id: data.id,
        p_reference_type: 'treatment',
      })
    }

    return data
  },
}
```

### 9.3 Inpatient Service

`src/features/inpatient/services/inpatientService.ts`:

```typescript
import { supabase } from '@/lib/supabaseClient'

export const inpatientService = {
  // Daftar semua pasien rawat inap aktif
  async getActiveCases() {
    const { data, error } = await supabase
      .from('inpatient_cases')
      .select(`
        *,
        pets(name, species, photo_url, breed),
        doctors(profiles(full_name)),
        case_updates(*)
      `)
      .neq('status', 'discharged')
      .order('admit_date', { ascending: false })

    if (error) throw error
    return data
  },

  // Tambah update/progress recovery
  async addUpdate(caseId: string, payload: CreateUpdateDTO) {
    const { data, error } = await supabase
      .from('case_updates')
      .insert({ ...payload, case_id: caseId })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Upload foto kondisi hewan
  async uploadPhoto(caseId: string, file: File, caption: string) {
    const fileName = `${caseId}/${Date.now()}_${file.name}`

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('case-photos')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase
      .storage
      .from('case-photos')
      .getPublicUrl(fileName)

    const { data, error } = await supabase
      .from('case_photos')
      .insert({
        case_id: caseId,
        photo_url: publicUrl,
        caption,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },
}
```

---

## 10. Dashboard per Role

### 10.1 Customer Dashboard (`/dashboard`)

**Komponen utama:**

| Komponen | Deskripsi | Data Source |
|----------|-----------|-------------|
| `HealthOverview` | Berat, aktivitas, wellness score hewan | `pets` table |
| `PetSelector` | Pilih hewan aktif | `pets` table |
| `BookingQuick` | Tombol buat janji + status booking | `appointments` table |
| `RecoveryJourney` | Timeline rawat inap real-time | `inpatient_cases` + `case_updates` (Realtime) |
| `NotificationFeed` | Hasil lab, jadwal vaksin, reminder | `notifications` table |
| `MedicalHistory` | Riwayat kunjungan & diagnosis | `medical_records` table |

**Booking 4-Step Wizard:**

```
Step 1: Pilih Hewan
    ↓
Step 2: Pilih Layanan
    ↓
Step 3: Pilih Dokter & Slot Waktu
    ↓
Step 4: Konfirmasi & Submit
```

### 10.2 Staff Dashboard (`/clinic`)

**Komponen utama:**

| Komponen | Deskripsi |
|----------|-----------|
| `AppointmentMonitor` | List janji hari ini + status |
| `CheckInSystem` | Input kedatangan + assign dokter |
| `InpatientBoard` | Daftar rawat inap + kondisi |
| `InventoryQuick` | Stok kritis + notifikasi reorder |
| `TaskLog` | Log aktivitas staf |

### 10.3 Doctor Dashboard (`/clinic`)

**Komponen utama (view berbeda dengan Staff via role check):**

| Komponen | Deskripsi |
|----------|-----------|
| `PatientQueue` | Antrian pasien hari ini |
| `EMRViewer` | Rekam medis + riwayat lengkap |
| `TreatmentInput` | Form tindakan medis + resep |
| `RecoveryUpdate` | Update status + foto pasien rawat inap |
| `ScheduleView` | Jadwal praktik + slot booking |

### 10.4 Admin Dashboard (`/admin`)

**Komponen utama:**

| Komponen | Deskripsi |
|----------|-----------|
| `SystemStats` | Total pasien, booking, performa |
| `UserManager` | CRUD user + assign role |
| `CMSEditor` | Edit konten landing page |
| `ServiceManager` | Kelola layanan & harga |
| `FeatureFlags` | Toggle fitur ON/OFF |
| `InventoryManager` | Full manajemen stok |
| `ReportsPanel` | Laporan sistem |

---

## 11. Realtime Engine

### 11.1 Realtime Setup Hook

`src/hooks/useRealtime.ts`:

```typescript
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface RealtimeOptions {
  table: string
  filter?: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
}

export const useRealtime = ({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: RealtimeOptions) => {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
          filter,
        },
        (payload) => onInsert?.(payload.new)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter,
        },
        (payload) => onUpdate?.(payload.new)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
        },
        (payload) => onDelete?.(payload.old)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter])
}
```

### 11.2 Penggunaan di Recovery Journey

```typescript
// Di RecoveryPage.tsx (Customer)
const [updates, setUpdates] = useState<CaseUpdate[]>([])

// Listen real-time updates untuk case tertentu
useRealtime({
  table: 'case_updates',
  filter: `case_id=eq.${activeCaseId}`,
  onInsert: (newUpdate) => {
    setUpdates(prev => [newUpdate, ...prev])
    showToast('Update baru dari klinik! 🐾')
  },
})

// Listen status perubahan inpatient case
useRealtime({
  table: 'inpatient_cases',
  filter: `id=eq.${activeCaseId}`,
  onUpdate: (updatedCase) => {
    setActiveCase(updatedCase)
  },
})
```

---

## 12. CMS System

### 12.1 Feature Flag Hook

```typescript
// src/hooks/useFeatureFlag.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export const useFeatureFlag = (key: string): boolean => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fetchFlag = async () => {
      const { data } = await supabase
        .from('feature_flags')
        .select('is_enabled')
        .eq('key', key)
        .single()

      setEnabled(data?.is_enabled ?? false)
    }

    fetchFlag()
  }, [key])

  return enabled
}
```

### 12.2 Penggunaan Feature Flag

```typescript
// Di BookingPage.tsx
const isBookingEnabled = useFeatureFlag('booking')

if (!isBookingEnabled) {
  return <DisabledFeatureBanner message="Booking sedang tidak tersedia" />
}

// Di HomePage.tsx
const isEmergencyEnabled = useFeatureFlag('emergency')
const isBlogEnabled = useFeatureFlag('blog')
```

### 12.3 CMS Service

```typescript
// src/features/cms/services/cmsService.ts
export const cmsService = {
  async getClinicProfile() {
    const { data, error } = await supabase
      .from('clinic_profile')
      .select('*')
      .single()
    if (error) throw error
    return data
  },

  async updateClinicProfile(payload: Partial<ClinicProfile>) {
    const { data, error } = await supabase
      .from('clinic_profile')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', payload.id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getPublishedPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    if (error) throw error
    return data
  },

  async toggleFeatureFlag(key: string, enabled: boolean) {
    const { error } = await supabase
      .from('feature_flags')
      .update({ is_enabled: enabled, updated_at: new Date().toISOString() })
      .eq('key', key)
    if (error) throw error
  },
}
```

---

## 13. Inventory & Business Logic

### 13.1 Auto Stock Deduction via Database Function

```sql
-- Supabase Edge Function / DB Function
CREATE OR REPLACE FUNCTION deduct_product_stock(
  p_product_id UUID,
  p_quantity DECIMAL,
  p_reference_id UUID,
  p_reference_type TEXT
) RETURNS VOID AS $$
BEGIN
  -- Update stok produk
  UPDATE products
  SET
    stock_qty = stock_qty - p_quantity,
    updated_at = NOW()
  WHERE id = p_product_id;

  -- Catat mutasi stok
  INSERT INTO stock_movements (
    product_id, type, quantity,
    reference_id, reference_type, created_by
  ) VALUES (
    p_product_id, 'out', p_quantity,
    p_reference_id, p_reference_type, auth.uid()
  );

  -- Alert jika stok di bawah minimum
  IF (SELECT stock_qty FROM products WHERE id = p_product_id)
     < (SELECT min_stock FROM products WHERE id = p_product_id) THEN
    INSERT INTO notifications (
      type, title, message, target_role
    ) VALUES (
      'stock_alert',
      'Stok Kritis!',
      (SELECT name FROM products WHERE id = p_product_id) || ' hampir habis',
      'admin'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 13.2 Expiry Alert Trigger

```sql
-- Trigger: cek expiry setiap hari (via pg_cron atau Edge Function scheduled)
CREATE OR REPLACE FUNCTION check_expiry_alerts()
RETURNS VOID AS $$
BEGIN
  -- Insert notifikasi untuk batch yang expired dalam 30 hari
  INSERT INTO notifications (type, title, message, target_role)
  SELECT
    'expiry_alert',
    'Produk Mendekati Expired',
    p.name || ' - Batch ' || b.batch_number || ' expired ' || b.expiry_date,
    'admin'
  FROM batches b
  JOIN products p ON p.id = b.product_id
  WHERE b.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
    AND b.expiry_date > CURRENT_DATE
    AND b.quantity > 0;
END;
$$ LANGUAGE plpgsql;
```

### 13.3 Anti Double Booking Logic

```typescript
// Validasi di frontend sebelum submit
const validateSlot = async (
  doctorId: string,
  scheduledAt: string,
  durationMin: number
) => {
  const slotEnd = new Date(
    new Date(scheduledAt).getTime() + durationMin * 60000
  ).toISOString()

  const { data: conflicts } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', doctorId)
    .in('status', ['pending', 'confirmed', 'in_progress'])
    .lt('scheduled_at', slotEnd)
    .gt('scheduled_at', scheduledAt) // overlap check

  return conflicts?.length === 0
}
```

---

## 14. CI/CD & Deployment

### 14.1 GitHub Actions Workflow

`.github/workflows/deploy.yml`:

```yaml
name: Deploy VetCare System

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run type check
        working-directory: ./frontend
        run: npm run type-check

      - name: Run linter
        working-directory: ./frontend
        run: npm run lint

      - name: Build production
        working-directory: ./frontend
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./frontend/dist

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 14.2 Setup GitHub Secrets

Tambahkan di **GitHub Repo → Settings → Secrets and Variables → Actions**:

| Secret Name | Value |
|-------------|-------|
| `VITE_SUPABASE_URL` | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key Supabase |

### 14.3 Vite Config untuk GitHub Pages

`frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/vetcare-system/',  // ganti dengan nama repo GitHub
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
})
```

### 14.4 Deploy Supabase Migrations

```bash
# Di setiap kali ada perubahan schema
supabase db push --linked

# Generate TypeScript types dari schema terbaru
supabase gen types typescript --linked > frontend/src/types/supabase.ts
```

---

## 15. Konvensi Kode

### 15.1 Naming Convention

| Element | Convention | Contoh |
|---------|-----------|--------|
| File component | PascalCase | `BookingForm.tsx` |
| File hook | camelCase + `use` prefix | `useBooking.ts` |
| File service | camelCase + `Service` suffix | `bookingService.ts` |
| CSS class | TailwindCSS utility | `className="flex items-center gap-4"` |
| Constant | UPPER_SNAKE_CASE | `MAX_BOOKING_PER_DAY` |
| Type/Interface | PascalCase | `type BookingStatus = ...` |

### 15.2 Service Pattern (Wajib)

**Semua query Supabase HARUS melalui service layer, TIDAK boleh langsung di komponen:**

```typescript
// ✅ BENAR - melalui service
const bookings = await bookingService.getMyBookings()

// ❌ SALAH - query langsung di komponen
const { data } = await supabase.from('appointments').select('*')
```

### 15.3 Error Handling Pattern

```typescript
// Di service: throw error
async getMyBookings() {
  const { data, error } = await supabase.from('appointments').select('*')
  if (error) throw error  // lempar ke caller
  return data
}

// Di komponen/hook: tangkap error
try {
  const bookings = await bookingService.getMyBookings()
  setBookings(bookings)
} catch (error) {
  console.error('Failed to fetch bookings:', error)
  toast.error('Gagal memuat data booking')
}
```

### 15.4 TypeScript Types Pattern

```typescript
// src/features/booking/types.ts

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface Booking {
  id: string
  pet_id: string
  owner_id: string
  doctor_id: string | null
  service_id: string | null
  scheduled_at: string
  duration_min: number
  status: BookingStatus
  notes: string | null
  created_at: string
  // Relations (from .select with join)
  pets?: { name: string; species: string; photo_url: string | null }
  doctors?: { profiles: { full_name: string } }
  services?: { name: string; duration_min: number; price: number }
}

export interface CreateBookingDTO {
  pet_id: string
  doctor_id: string
  service_id: string
  scheduled_at: string
  notes?: string
}
```

---

## 16. Anti-Pattern & Best Practice

### ❌ Hindari (Anti-Pattern)

```typescript
// ❌ Query langsung di JSX
const Component = () => {
  const { data } = useQuery(() => supabase.from('pets').select('*'))
  // Langgar separation of concerns
}

// ❌ Hardcode role sebagai string
if (user.role === 'adm1n') { ... }  // typo prone

// ❌ Tidak pakai RLS → semua user bisa akses semua data
// Wajib aktifkan RLS di setiap tabel

// ❌ Logic di komponen UI
const PetCard = () => {
  // JANGAN taruh business logic di sini
  const deductStock = async () => { ... }
}

// ❌ Semua state di satu global store
// Pisahkan per domain: authStore, petStore, bookingStore
```

### ✅ Best Practice

```typescript
// ✅ Selalu pakai service layer
const pets = await petsService.getMyPets()

// ✅ Type-safe role enum
type UserRole = 'customer' | 'staff' | 'doctor' | 'admin'

// ✅ Feature-based separation
// Setiap fitur punya folder sendiri dengan components, hooks, services

// ✅ Supabase sebagai single source of truth
// Tidak ada logic duplikat di client & server

// ✅ RLS aktif di semua tabel sensitif

// ✅ Generated TypeScript types dari Supabase schema
import type { Database } from '@/types/supabase'
type Appointment = Database['public']['Tables']['appointments']['Row']
```

---

## 17. Roadmap Pengembangan

### Phase 1 — MVP (Current)

- [x] Auth system (login + role redirect)
- [ ] Customer dashboard (health overview, multi-pet)
- [ ] Booking system (4-step wizard + slot management)
- [ ] Basic EMR (rekam medis, treatment input)

### Phase 2 — Core Features

- [ ] Recovery Journey real-time (Supabase Realtime)
- [ ] Inventory system (stok, batch, expiry alert)
- [ ] CMS admin panel (landing page editor, feature flags)
- [ ] Notifikasi in-app

### Phase 3 — Advanced

- [ ] Multi-klinik support (tenant isolation via `clinic_id`)
- [ ] Analytics dashboard & laporan
- [ ] AI health assistant (integrasi LLM)
- [ ] Payment gateway (Midtrans / Xendit)

### Phase 4 — Scale

- [ ] Mobile App (React Native + Expo)
- [ ] Telemedicine (video call dokter)
- [ ] IoT pet monitoring
- [ ] White-label SaaS

---

## 18. FAQ Developer

**Q: Kenapa pakai Supabase bukan custom Express/Fastify backend?**  
A: Karena Supabase menyediakan PostgreSQL + Auth + Realtime + Storage + Edge Functions dalam satu platform, sehingga tidak perlu manage server sendiri. Cocok untuk MVP dan SaaS awal.

**Q: Bagaimana cara regenerate TypeScript types setelah ubah schema?**
```bash
supabase gen types typescript --linked > frontend/src/types/supabase.ts
```

**Q: Bagaimana cara membuat fitur baru?**  
A: Buat folder baru di `src/features/{nama-fitur}/` dengan struktur `components/`, `hooks/`, `services/`, `types.ts`. Daftarkan route di `Router.tsx` dengan `RoleGuard` yang sesuai.

**Q: Bagaimana cara test RLS secara lokal?**
```sql
-- Test sebagai user tertentu di Supabase SQL Editor
SET LOCAL role = 'authenticated';
SET LOCAL request.jwt.claims = '{"sub": "USER_UUID_DISINI"}';
SELECT * FROM pets;
```

**Q: Kenapa ada dua layout berbeda di `/clinic` untuk Staff dan Doctor?**  
A: Route `/clinic` sama, namun komponen yang ditampilkan berbeda berdasarkan `role` dari `authStore`. Staff melihat check-in & inventory, Doctor melihat patient queue & EMR. Gunakan conditional rendering berdasarkan role.

**Q: Bagaimana cara deploy perubahan Supabase functions?**
```bash
supabase functions deploy booking
supabase functions deploy inventory
supabase functions deploy notifications
```

---

## 📦 Package.json Reference

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "zustand": "^4.x",
    "chart.js": "^4.x",
    "react-chartjs-2": "^5.x",
    "lucide-react": "^0.x",
    "date-fns": "^3.x",
    "tailwindcss": "^3.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "eslint": "^8.x",
    "@typescript-eslint/eslint-plugin": "^7.x",
    "prettier": "^3.x"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "type-check": "tsc --noEmit",
    "format": "prettier --write src/"
  }
}
```

---

## 📌 Kesimpulan

VetCare System dibangun di atas prinsip:

| Prinsip | Implementasi |
|---------|-------------|
| **Separation of Concerns** | Feature-based architecture, service layer terpisah dari UI |
| **Type Safety** | TypeScript + generated Supabase types |
| **Security First** | RLS aktif di semua tabel, role-based access di frontend |
| **Real-time First** | Supabase Realtime untuk Recovery Journey & notifikasi |
| **CMS Driven** | Konten publik dikelola via database, tanpa redeploy |
| **SaaS Ready** | Struktur siap untuk multi-klinik dengan `clinic_id` isolation |

---

> 📌 **Untuk GitHub Copilot / Codespace:**  
> Selalu ikuti pola service layer, gunakan TypeScript strict, aktifkan RLS untuk setiap tabel baru, dan buat setiap fitur sebagai independent module di `src/features/`.  
> Lihat `src/features/booking/` sebagai referensi implementasi module yang lengkap.
