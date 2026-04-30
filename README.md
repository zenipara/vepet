🧑‍💻 VetCare System — Full Developer Guide

Stack: Supabase (Backend) + GitHub Pages (Frontend Hosting)

---

🧠 Overview

VetCare System adalah platform manajemen klinik hewan + petshop berbasis web dengan pendekatan serverless architecture.

Dirancang untuk:

- Skalabilitas tinggi tanpa server manual
- Real-time update (Recovery Journey)
- Integrasi medis + inventory + customer experience

---

🏗️ System Architecture

Frontend (React / Vite / Next Static)
        ↓
Supabase (BaaS)
 ├── Auth (JWT)
 ├── PostgreSQL (Relational DB)
 ├── Realtime (WebSocket)
 ├── Storage (File & Media)

---

🛠️ Tech Stack

Frontend

- React (Vite recommended)
- TailwindCSS
- React Query (data fetching)
- Zustand (state management)

Backend (Supabase)

- PostgreSQL
- Supabase Auth
- Supabase Realtime
- Supabase Storage

DevOps

- GitHub
- GitHub Pages
- gh-pages CLI

---

⚙️ Environment Setup

1. Environment Variables

VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

---

🗄️ Database Design (Production Ready)

1. Users (Extend Supabase Auth)

create table profiles (
  id uuid primary key references auth.users(id),
  name text,
  role text check (role in ('admin','doctor','staff','customer')),
  phone text,
  created_at timestamp default now()
);

---

2. Pets

create table pets (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id),
  name text,
  species text,
  breed text,
  gender text,
  birth_date date,
  weight numeric,
  created_at timestamp default now()
);

---

3. Appointments

create table appointments (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references pets(id),
  service text,
  doctor_id uuid,
  schedule timestamp,
  status text check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamp default now()
);

---

4. Medical Records (EMR Core)

create table medical_records (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references pets(id),
  doctor_id uuid,
  diagnosis text,
  notes text,
  status text,
  created_at timestamp default now()
);

---

5. Treatments

create table treatments (
  id uuid primary key default uuid_generate_v4(),
  medical_record_id uuid references medical_records(id),
  treatment_name text,
  cost numeric,
  created_at timestamp default now()
);

---

6. Medications & Usage

create table medications (
  id uuid primary key default uuid_generate_v4(),
  name text,
  stock int,
  unit text
);

create table medication_usage (
  id uuid primary key default uuid_generate_v4(),
  treatment_id uuid references treatments(id),
  medication_id uuid references medications(id),
  quantity int
);

---

7. Inventory System (Advanced)

create table inventory_items (
  id uuid primary key default uuid_generate_v4(),
  name text,
  category text,
  stock int,
  min_stock int,
  expiry_date date,
  created_at timestamp default now()
);

create table stock_movements (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid references inventory_items(id),
  type text check (type in ('in','out')),
  quantity int,
  reference text,
  created_at timestamp default now()
);

---

8. Recovery Tracking (Realtime Feature)

create table recovery_logs (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references pets(id),
  status text,
  notes text,
  created_at timestamp default now()
);

---

🔐 Row Level Security (RLS)

Enable RLS

alter table pets enable row level security;

---

Policy: Customer hanya bisa lihat pet miliknya

create policy "Owner access"
on pets
for select
using (auth.uid() = owner_id);

---

Policy: Doctor bisa akses semua medical record

create policy "Doctor access"
on medical_records
for select
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'doctor'
  )
);

---

🔄 Core Business Logic

1. Booking Flow

Customer → pilih layanan → pilih pet → pilih jadwal → create appointment
→ status: pending → staff confirm → confirmed

---

2. Treatment Flow

Check-in → buat medical_record
→ tambah treatment
→ tambah medication_usage
→ insert stock_movements (type: out)
→ update recovery_logs

---

3. Inventory Flow

Barang masuk → stock_movements (in)
Barang dipakai → stock_movements (out)
Stock = SUM(in) - SUM(out)

👉 Jangan pernah update stock manual.

---

🔌 Supabase Client Setup

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

---

🔑 Auth Example

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({ email, password })
}

---

📡 Realtime (Recovery Journey)

supabase
  .channel('recovery')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'recovery_logs' },
    payload => {
      console.log('Recovery update:', payload)
    }
  )
  .subscribe()

---

🖼️ File Upload (Pet Photos)

export async function uploadPhoto(file) {
  return await supabase.storage
    .from('pet-photos')
    .upload(`public/${Date.now()}-${file.name}`, file)
}

---

📁 Project Structure

src/
├── components/
├── pages/
├── layouts/
├── services/
│   ├── supabase.js
│   ├── auth.js
│   ├── pets.js
│   ├── booking.js
│   ├── medical.js
│   └── inventory.js
├── hooks/
├── store/
├── utils/

---

🌐 Deployment (GitHub Pages)

1. Build

npm run build

---

2. Install gh-pages

npm install gh-pages --save-dev

---

3. Setup package.json

"homepage": "https://username.github.io/vetcare-system",
"scripts": {
  "deploy": "gh-pages -d dist"
}

---

4. Deploy

npm run deploy

---

⚠️ Production Best Practices

- Gunakan UUID untuk semua ID
- Aktifkan RLS di semua tabel
- Gunakan audit log (stock_movements, medical_records)
- Pisahkan environment (dev / prod)
- Backup database rutin

---

🔐 Security Checklist

- [ ] RLS aktif
- [ ] API key tidak di-hardcode
- [ ] Validasi input frontend & backend
- [ ] HTTPS only
- [ ] Storage access policy

---

🧪 Testing Strategy

- Unit test (Vitest)
- Integration test (API)
- Manual QA (workflow medis wajib)

---

🚀 Roadmap Advanced

- [ ] Payment Gateway
- [ ] WhatsApp Notification
- [ ] Multi-branch clinic
- [ ] Telemedicine (video call)
- [ ] AI diagnosis assistant

---

📦 Scaling Strategy

Jika traffic meningkat:

- Gunakan Edge Functions (Supabase)
- Tambahkan Redis (cache)
- Pisahkan service (microservices)

---

🤝 Contribution

- Fork repo
- Buat branch feature
- Pull request

---

📄 License

MIT License

---

📌 Final Note

Sistem ini dirancang untuk:

«⚡ Build cepat (MVP)
📈 Scale mudah
🧠 Maintainable jangka panjang»

Fokus utama developer:

- Jangan over-engineering di awal
- Pastikan flow medis berjalan benar
- Inventory harus akurat (no compromise)

---
