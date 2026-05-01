# VetCare System

Platform manajemen klinik hewan dan petshop berbasis web yang modern, transparan, dan scalable.

## 🎯 Fitur Utama

- **Manajemen Appointment** - Booking janji temu dengan sistem slot otomatis
- **Electronic Medical Record (EMR)** - Rekam medis digital lengkap setiap hewan
- **Recovery Journey Real-time** - Transparansi kondisi hewan ke pemilik via live updates
- **Inventory Management** - Manajemen stok obat dengan batch tracking dan expiry alerts
- **CMS System** - Editor konten landing page tanpa redeploy
- **Role-based Access** - Customer, Staff, Doctor, Admin dengan permission terpisah
- **Multi-klinik Ready** - Arsitektur siap untuk ekspansi multi-tenant

## 🛠️ Tech Stack

- **Frontend**: Vite + React 18 + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Deployment**: GitHub Pages + Supabase Cloud
- **CI/CD**: GitHub Actions

## 📦 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/zenipara/vetcare-system.git
cd vetcare-system
bash scripts/setup.sh
```

### 2. Setup Supabase

- Buka https://supabase.com dan buat project baru
- Copy `Project URL` dan `Anon Key`
- Edit `frontend/.env.local` dengan credentials
- Jalankan migrations dari `supabase/migrations/` di Supabase Dashboard

### 3. Run Development

```bash
cd frontend
npm run dev
# Buka http://localhost:5173
```

## 📁 Struktur Project

```
vetcare-system/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── app/                # Routing & layouts
│   │   ├── features/           # Feature modules
│   │   ├── components/         # Reusable components
│   │   └── styles/
│   └── package.json
├── supabase/                    # Database & backend config
│   ├── migrations/              # SQL schema versioning
│   ├── policies/                # RLS policies
│   └── config.toml
├── docs/                        # Documentation
├── scripts/                     # Setup & deploy scripts
└── PANDUAN_PENGEMBANGAN.md     # Development guide (Indonesian)
```

## 🔐 Authentication

- Login via email + password
- Role-based redirect ke dashboard
- Supabase RLS untuk data security
- Session persistence

## 🐾 User Roles

| Role | Access |
|------|--------|
| **Customer** | Dashboard pribadi, booking, riwayat medis hewan |
| **Staff** | Check-in, appointment management, inventory |
| **Doctor** | EMR editing, treatment input, recovery updates |
| **Admin** | User management, CMS, feature flags, reports |

## 📖 Dokumentasi

Lihat [PANDUAN_PENGEMBANGAN.md](./PANDUAN_PENGEMBANGAN.md) untuk:
- Database schema lengkap
- API documentation
- Feature modules architecture
- Best practices & konvensi code
- Roadmap pengembangan

## 🚀 Deployment

### Frontend (GitHub Pages)
```bash
npm run build
# Automatically deployed via GitHub Actions on push to main
```

### Backend (Supabase Cloud)
Semua database & auth dikelola oleh Supabase. Saat push ke `main`, GitHub Actions menjalankan migrasi SQL dari `supabase/migrations/` ke database Supabase, lalu melanjutkan build dan deploy GitHub Pages.

Secrets repository yang dibutuhkan:
- `SUPABASE_DB_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contributing

Ikuti konvensi code di [PANDUAN_PENGEMBANGAN.md](./PANDUAN_PENGEMBANGAN.md).

## 📄 License

MIT

## 👨‍💻 Development

Project ini diinisialisasi dengan struktur lengkap Phase 1 MVP. Ikuti roadmap di PANDUAN_PENGEMBANGAN.md untuk fase berikutnya:

- **Phase 2**: Recovery Journey real-time, Advanced Inventory
- **Phase 3**: Multi-klinik support, Analytics
- **Phase 4**: Mobile App, Telemedicine, IoT

---

Made with 🐾 for pet lovers and veterinarians
