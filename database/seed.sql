INSERT INTO services (name, description, category, price, duration_min, is_active)
VALUES
  ('Pemeriksaan Rutin', 'Konsultasi dan pemeriksaan umum kesehatan hewan', 'medical', 150000, 30, true),
  ('Vaksinasi', 'Program vaksinasi tahunan (DHPP/FVRCP)', 'medical', 200000, 20, true),
  ('Pembersihan Gigi', 'Scaling dan pembersihan plak gigi', 'medical', 250000, 45, true),
  ('Grooming Dasar', 'Mandi, potong kuku, potong bulu', 'grooming', 250000, 60, true),
  ('Grooming Premium', 'Grooming lengkap + styling khusus', 'grooming', 450000, 120, true),
  ('Konsultasi Nutrisi', 'Konsultasi tentang pakan dan diet hewan', 'consultation', 100000, 30, true);

INSERT INTO products (name, sku, category, unit, price_buy, price_sell, min_stock, stock_qty, is_active)
VALUES
  ('Antibiotik Amoxicillin 250mg', 'AMX-250', 'medicine', 'tablet', 3000, 5000, 20, 50, true),
  ('Paracetamol Anak 125mg', 'PCT-125', 'medicine', 'ml', 2000, 3500, 30, 100, true),
  ('Saline Solution Steril', 'SAL-100ML', 'medicine', 'ml', 5000, 7500, 15, 40, true),
  ('Pet Food Premium Beef', 'PETFOOD-BEEF-5KG', 'food', 'kg', 45000, 65000, 5, 15, true),
  ('Pet Food Premium Chicken', 'PETFOOD-CHK-5KG', 'food', 'kg', 42000, 60000, 5, 20, true),
  ('Pet Supplements Calcium', 'SUPP-CAL-250', 'supplement', 'tablet', 8000, 12000, 10, 30, true);

INSERT INTO clinic_profile (name, tagline, description, phone, email, address)
VALUES
  (
    'VetCare System - Klinik Hewan Modern',
    'Kesehatan hewan peliharaan, prioritas kami',
    'Klinik hewan modern dengan dokter berpengalaman, layanan 24/7, dan teknologi terkini. Kami berkomitmen memberikan perawatan terbaik untuk kesehatan dan kesejahteraan hewan peliharaan Anda.',
    '+62-0812-3456-7890',
    'info@vetcare.com',
    'Jl. Kesehatan Hewan No. 123, Jakarta Selatan'
  );

INSERT INTO feature_flags (key, label, description, is_enabled)
VALUES
  ('booking', 'Booking System', 'Fitur pemesanan janji temu online', true),
  ('recovery_journey', 'Recovery Journey', 'Fitur transparansi kondisi hewan realtime', true),
  ('inventory_management', 'Inventory Management', 'Sistem manajemen stok obat dan produk', false),
  ('blog', 'Blog & Articles', 'Blog artikel edukasi kesehatan hewan', false),
  ('emergency_hotline', 'Emergency Hotline', 'Layanan darurat 24/7', true);
