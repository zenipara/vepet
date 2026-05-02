-- ============================================
-- VetCare Database - Test Data (Seed)
-- ============================================

-- ============================================
-- Insert Test Users
-- ============================================

-- Admin User
INSERT INTO users (id, email, password_hash, role, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440000'::uuid, 'admin@vetcare.local', '$2a$10$N9qo8uLOickgx2ZMRZoHyO.9YwPXfv.7LXvJ2qVCHVZj5U2VsR5iS', 'admin', true)
ON CONFLICT DO NOTHING;

-- Doctor Users
INSERT INTO users (id, email, password_hash, role, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'doctor1@vetcare.local', '$2a$10$N9qo8uLOickgx2ZMRZoHyO.9YwPXfv.7LXvJ2qVCHVZj5U2VsR5iS', 'doctor', true),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'doctor2@vetcare.local', '$2a$10$N9qo8uLOickgx2ZMRZoHyO.9YwPXfv.7LXvJ2qVCHVZj5U2VsR5iS', 'doctor', true)
ON CONFLICT DO NOTHING;

-- Staff Users
INSERT INTO users (id, email, password_hash, role, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'staff1@vetcare.local', '$2a$10$N9qo8uLOickgx2ZMRZoHyO.9YwPXfv.7LXvJ2qVCHVZj5U2VsR5iS', 'staff', true)
ON CONFLICT DO NOTHING;

-- Customer Users
INSERT INTO users (id, email, password_hash, role, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'customer1@vetcare.local', '$2a$10$N9qo8uLOickgx2ZMRZoHyO.9YwPXfv.7LXvJ2qVCHVZj5U2VsR5iS', 'customer', true),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'customer2@vetcare.local', '$2a$10$N9qo8uLOickgx2ZMRZoHyO.9YwPXfv.7LXvJ2qVCHVZj5U2VsR5iS', 'customer', true),
('550e8400-e29b-41d4-a716-446655440006'::uuid, 'customer3@vetcare.local', '$2a$10$N9qo8uLOickgx2ZMRZoHyO.9YwPXfv.7LXvJ2qVCHVZj5U2VsR5iS', 'customer', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Profiles
-- ============================================

INSERT INTO profiles (id, full_name, phone, address, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Admin User', '081234567890', 'Clinic Address', true),
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Dr. Bambang Setiawan', '081111111111', 'Clinic Address', true),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Dr. Siti Nurhaliza', '081222222222', 'Clinic Address', true),
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Ani Handayani', '081333333333', 'Clinic Address', true),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Budi Santoso', '081444444444', 'Jl. Merdeka No. 10, Jakarta', true),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'Citra Dewi', '081555555555', 'Jl. Sudirman No. 20, Jakarta', true),
('550e8400-e29b-41d4-a716-446655440006'::uuid, 'Doni Hermanto', '081666666666', 'Jl. Ahmad Yani No. 30, Bandung', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Doctors
-- ============================================

INSERT INTO doctors (id, specialization, license_number, bio, consultation_fee, is_available) VALUES 
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Surgical', 'LIC-001-2024', 'Dokter spesialis bedah dengan pengalaman 10 tahun', 500000, true),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Internal Medicine', 'LIC-002-2024', 'Dokter spesialis penyakit dalam, fokus pada diagnosis', 400000, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Services
-- ============================================

INSERT INTO services (id, name, description, category, price, duration_min, is_active) VALUES 
('650e8400-e29b-41d4-a716-446655440001'::uuid, 'Consultation', 'General consultation dengan dokter hewan', 'Consultation', 150000, 30, true),
('650e8400-e29b-41d4-a716-446655440002'::uuid, 'Vaccination', 'Vaksinasi lengkap', 'Preventive', 200000, 15, true),
('650e8400-e29b-41d4-a716-446655440003'::uuid, 'Surgery', 'Operasi bedah', 'Surgery', 1500000, 120, true),
('650e8400-e29b-41d4-a716-446655440004'::uuid, 'Grooming', 'Grooming dan perawatan bulu', 'Grooming', 250000, 60, true),
('650e8400-e29b-41d4-a716-446655440005'::uuid, 'Dental Cleaning', 'Pembersihan gigi', 'Dental', 300000, 45, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Pets
-- ============================================

INSERT INTO pets (id, owner_id, name, species, breed, gender, birth_date, weight_kg, color, is_active) VALUES 
('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'Fluffy', 'cat', 'Persian', 'female', '2020-01-15', 4.5, 'white', true),
('750e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'Max', 'dog', 'Golden Retriever', 'male', '2019-06-20', 28.5, 'golden', true),
('750e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, 'Whiskers', 'cat', 'Siamese', 'male', '2021-03-10', 3.8, 'cream', true),
('750e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid, 'Bella', 'dog', 'Poodle', 'female', '2022-05-05', 8.2, 'apricot', true),
('750e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid, 'Tweety', 'bird', 'Lovebird', 'female', '2023-02-14', 0.05, 'green', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Appointments
-- ============================================

INSERT INTO appointments (id, pet_id, owner_id, doctor_id, service_id, scheduled_at, status, notes) VALUES 
('850e8400-e29b-41d4-a716-446655440001'::uuid, '750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, NOW() + INTERVAL '3 days', 'confirmed', 'Checkup rutin'),
('850e8400-e29b-41d4-a716-446655440002'::uuid, '750e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, NOW() + INTERVAL '1 week', 'pending', 'Vaksinasi tahunan'),
('850e8400-e29b-41d4-a716-446655440003'::uuid, '750e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '650e8400-e29b-41d4-a716-446655440005'::uuid, NOW() + INTERVAL '5 days', 'confirmed', 'Pembersihan gigi'),
('850e8400-e29b-41d4-a716-446655440004'::uuid, '750e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid, NOW() + INTERVAL '2 weeks', 'pending', 'Grooming session')
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Medical Records
-- ============================================

INSERT INTO medical_records (id, pet_id, doctor_id, visit_date, chief_complaint, diagnosis) VALUES 
('950e8400-e29b-41d4-a716-446655440001'::uuid, '750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, CURRENT_DATE - INTERVAL '5 days', 'Batuk-batuk', 'Infeksi saluran pernapasan ringan'),
('950e8400-e29b-41d4-a716-446655440002'::uuid, '750e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, CURRENT_DATE - INTERVAL '10 days', 'Gatal-gatal', 'Alergi kulit (dermatitis)')
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Vendors
-- ============================================

INSERT INTO vendors (id, name, contact, email, phone, address, is_active) VALUES 
('a50e8400-e29b-41d4-a716-446655440001'::uuid, 'PT Pharma Indonesia', 'Budi Santoso', 'contact@pharma.id', '0215555555', 'Jl. Gatot Subroto, Jakarta', true),
('a50e8400-e29b-41d4-a716-446655440002'::uuid, 'CV Medica Petshop', 'Hendra', 'hendra@medica.com', '0227777777', 'Jl. Jati Baru, Jakarta', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Products
-- ============================================

INSERT INTO products (id, vendor_id, name, sku, category, description, unit, price_buy, price_sell, stock_qty, min_stock, is_active) VALUES 
('b50e8400-e29b-41d4-a716-446655440001'::uuid, 'a50e8400-e29b-41d4-a716-446655440001'::uuid, 'Vaccine Combo Inactivated', 'VAC-COMBO-001', 'Vaccine', 'Vaksin gabungan FVRCP', 'vial', 85000, 150000, 50, 10, true),
('b50e8400-e29b-41d4-a716-446655440002'::uuid, 'a50e8400-e29b-41d4-a716-446655440001'::uuid, 'Antibiotic Amoxicillin', 'ABT-AMX-500', 'Medicine', 'Amoxicillin 500mg', 'tablet', 500, 2000, 500, 100, true),
('b50e8400-e29b-41d4-a716-446655440003'::uuid, 'a50e8400-e29b-41d4-a716-446655440002'::uuid, 'Dog Shampoo', 'SHP-DOG-500', 'Grooming', 'Shampo anjing 500ml', 'bottle', 25000, 45000, 100, 20, true),
('b50e8400-e29b-41d4-a716-446655440004'::uuid, 'a50e8400-e29b-41d4-a716-446655440002'::uuid, 'Cat Treats', 'TRT-CAT-100', 'Treats', 'Makanan lezat untuk kucing', 'pack', 8000, 18000, 200, 50, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Clinic Profile
-- ============================================

INSERT INTO clinic_profile (id, name, tagline, description, phone, email, address) VALUES 
('c50e8400-e29b-41d4-a716-446655440001'::uuid, 'VetCare Clinic', 'Kesehatan Hewan Adalah Prioritas Kami', 'Klinik hewan modern dengan dokter berpengalaman dan fasilitas lengkap', '0215432154', 'info@vetcare.clinic', 'Jl. Merpati No. 25, Jakarta')
ON CONFLICT DO NOTHING;

-- ============================================
-- Insert Public Pages
-- ============================================

INSERT INTO public_pages (id, slug, title, content, is_active) VALUES 
('d50e8400-e29b-41d4-a716-446655440001'::uuid, 'tentang-kami', 'Tentang Kami', '{"body":"VetCare adalah klinik hewan terpercaya sejak 2015..."}', true),
('d50e8400-e29b-41d4-a716-446655440002'::uuid, 'layanan', 'Layanan Kami', '{"body":"Kami menyediakan berbagai layanan kesehatan hewan..."}', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Verify Data
-- ============================================

SELECT 'Users:' as entity, count(*) as total FROM users
UNION ALL
SELECT 'Profiles', count(*) FROM profiles
UNION ALL
SELECT 'Pets', count(*) FROM pets
UNION ALL
SELECT 'Doctors', count(*) FROM doctors
UNION ALL
SELECT 'Services', count(*) FROM services
UNION ALL
SELECT 'Appointments', count(*) FROM appointments
UNION ALL
SELECT 'Medical Records', count(*) FROM medical_records
UNION ALL
SELECT 'Vendors', count(*) FROM vendors
UNION ALL
SELECT 'Products', count(*) FROM products;
