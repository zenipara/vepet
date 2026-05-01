-- Enable RLS pada semua tabel
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inpatient_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROFILES
-- =====================
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (get_user_role() = 'admin');

-- =====================
-- PETS
-- =====================
DROP POLICY IF EXISTS "pets_owner_select" ON pets;
CREATE POLICY "pets_owner_select" ON pets
  FOR SELECT USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "pets_owner_insert" ON pets;
CREATE POLICY "pets_owner_insert" ON pets
  FOR INSERT WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "pets_owner_update" ON pets;
CREATE POLICY "pets_owner_update" ON pets
  FOR UPDATE USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "pets_clinic_select" ON pets;
CREATE POLICY "pets_clinic_select" ON pets
  FOR SELECT USING (get_user_role() IN ('staff', 'doctor', 'admin'));

-- =====================
-- APPOINTMENTS
-- =====================
DROP POLICY IF EXISTS "appointments_owner_select" ON appointments;
CREATE POLICY "appointments_owner_select" ON appointments
  FOR SELECT USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "appointments_owner_insert" ON appointments;
CREATE POLICY "appointments_owner_insert" ON appointments
  FOR INSERT WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "appointments_clinic_all" ON appointments;
CREATE POLICY "appointments_clinic_all" ON appointments
  FOR ALL USING (get_user_role() IN ('staff', 'doctor', 'admin'));

-- =====================
-- MEDICAL RECORDS
-- =====================
DROP POLICY IF EXISTS "emr_doctor_all" ON medical_records;
CREATE POLICY "emr_doctor_all" ON medical_records
  FOR ALL USING (get_user_role() IN ('doctor', 'admin'));

DROP POLICY IF EXISTS "emr_owner_select" ON medical_records;
CREATE POLICY "emr_owner_select" ON medical_records
  FOR SELECT USING (
    pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid())
  );

-- =====================
-- TREATMENTS & PRESCRIPTIONS
-- =====================
DROP POLICY IF EXISTS "treatments_doctor_all" ON treatments;
CREATE POLICY "treatments_doctor_all" ON treatments
  FOR ALL USING (
    record_id IN (
      SELECT id FROM medical_records
      WHERE doctor_id = auth.uid() OR auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
      )
    )
  );

DROP POLICY IF EXISTS "prescriptions_doctor_all" ON prescriptions;
CREATE POLICY "prescriptions_doctor_all" ON prescriptions
  FOR ALL USING (
    record_id IN (
      SELECT id FROM medical_records
      WHERE doctor_id = auth.uid() OR auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
      )
    )
  );

-- =====================
-- INPATIENT CASES
-- =====================
DROP POLICY IF EXISTS "inpatient_clinic_all" ON inpatient_cases;
CREATE POLICY "inpatient_clinic_all" ON inpatient_cases
  FOR ALL USING (get_user_role() IN ('staff', 'doctor', 'admin'));

DROP POLICY IF EXISTS "inpatient_owner_select" ON inpatient_cases;
CREATE POLICY "inpatient_owner_select" ON inpatient_cases
  FOR SELECT USING (
    pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid())
  );

-- =====================
-- CASE UPDATES & PHOTOS
-- =====================
DROP POLICY IF EXISTS "case_updates_clinic_all" ON case_updates;
CREATE POLICY "case_updates_clinic_all" ON case_updates
  FOR ALL USING (get_user_role() IN ('staff', 'doctor', 'admin'));

DROP POLICY IF EXISTS "case_updates_owner_select" ON case_updates;
CREATE POLICY "case_updates_owner_select" ON case_updates
  FOR SELECT USING (
    case_id IN (
      SELECT ic.id FROM inpatient_cases ic
      JOIN pets p ON p.id = ic.pet_id
      WHERE p.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "case_photos_clinic_all" ON case_photos;
CREATE POLICY "case_photos_clinic_all" ON case_photos
  FOR ALL USING (get_user_role() IN ('staff', 'doctor', 'admin'));

DROP POLICY IF EXISTS "case_photos_owner_select" ON case_photos;
CREATE POLICY "case_photos_owner_select" ON case_photos
  FOR SELECT USING (
    case_id IN (
      SELECT ic.id FROM inpatient_cases ic
      JOIN pets p ON p.id = ic.pet_id
      WHERE p.owner_id = auth.uid()
    )
  );

-- =====================
-- INVENTORY
-- =====================
DROP POLICY IF EXISTS "products_staff_select" ON products;
CREATE POLICY "products_staff_select" ON products
  FOR SELECT USING (get_user_role() IN ('staff', 'doctor', 'admin'));

DROP POLICY IF EXISTS "products_admin_all" ON products;
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (get_user_role() IN ('admin', 'staff'));

DROP POLICY IF EXISTS "stock_movements_staff_select" ON stock_movements;
CREATE POLICY "stock_movements_staff_select" ON stock_movements
  FOR SELECT USING (get_user_role() IN ('staff', 'admin'));

DROP POLICY IF EXISTS "stock_movements_admin_insert" ON stock_movements;
CREATE POLICY "stock_movements_admin_insert" ON stock_movements
  FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'staff'));

-- =====================
-- CMS (public read, admin write)
-- =====================
DROP POLICY IF EXISTS "clinic_profile_public_read" ON clinic_profile;
CREATE POLICY "clinic_profile_public_read" ON clinic_profile
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "clinic_profile_admin_write" ON clinic_profile;
CREATE POLICY "clinic_profile_admin_write" ON clinic_profile
  FOR ALL USING (get_user_role() = 'admin');

DROP POLICY IF EXISTS "blog_published_public_read" ON blog_posts;
CREATE POLICY "blog_published_public_read" ON blog_posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "blog_admin_all" ON blog_posts;
CREATE POLICY "blog_admin_all" ON blog_posts
  FOR ALL USING (get_user_role() = 'admin');

DROP POLICY IF EXISTS "feature_flags_public_read" ON feature_flags;
CREATE POLICY "feature_flags_public_read" ON feature_flags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "feature_flags_admin_write" ON feature_flags;
CREATE POLICY "feature_flags_admin_write" ON feature_flags
  FOR ALL USING (get_user_role() = 'admin');

DROP POLICY IF EXISTS "services_public_read" ON services;
CREATE POLICY "services_public_read" ON services
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "testimonials_public_published" ON testimonials;
CREATE POLICY "testimonials_public_published" ON testimonials
  FOR SELECT USING (status = 'published');

COMMIT;
