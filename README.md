# 🐾 VetCare System

> Sistem manajemen klinik hewan berbasis web — modern, efisien, dan transparan.

[![Next.js](https://img.shields.io/badge/Next.js-Static_Export-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Deploy](https://img.shields.io/badge/Deploy-GitHub_Pages-181717?logo=github)](https://pages.github.com/)

---

## 📖 Tentang Proyek

**VetCare System** adalah sistem manajemen klinik hewan berbasis web yang menghubungkan internal klinik (admin, staff, dokter) dengan pemilik hewan (customer) dalam satu platform terintegrasi.

Dibangun di atas **Next.js + Supabase**, sistem ini dirancang sebagai fondasi yang siap berkembang menjadi platform **SaaS multi-klinik**.

---

## 🎯 Tujuan Produk

- ✅ Mendigitalisasi pencatatan pasien dan tindakan medis
- ✅ Meningkatkan efisiensi operasional klinik
- ✅ Memberikan transparansi kepada pemilik hewan
- ✅ Meningkatkan profesionalitas klinik
- ✅ Menjadi fondasi SaaS multi-klinik

---

## 🚀 Fitur Utama

| Modul | Fitur |
|---|---|
| 🏥 **Manajemen Pasien** | Data hewan & pemilik, riwayat kunjungan, profil lengkap |
| 🩺 **Treatment & Medis** | Catatan dokter, status kondisi, riwayat medis |
| 🖼️ **Dokumentasi** | Upload foto kondisi hewan, dokumentasi progres |
| 👤 **Customer Portal** | Monitoring real-time, riwayat medis, akses dokumentasi |
| 📅 **Booking Online** | Pemilihan jadwal, request layanan, konfirmasi klinik |
| 📦 **Inventory** | Manajemen stok, monitoring stok masuk/keluar |
| 👥 **Role Management** | Admin / Dokter / Staff / Customer |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────┐
│              FRONTEND                   │
│   Next.js (Static Export) + Tailwind    │
│         Deploy: GitHub Pages            │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│               BACKEND                   │
│              Supabase                   │
│  ┌──────────┐ ┌──────┐ ┌────────────┐  │
│  │PostgreSQL│ │ Auth │ │  Storage   │  │
│  └──────────┘ └──────┘ └────────────┘  │
│         + Realtime Updates              │
└─────────────────────────────────────────┘
```

---

## ⚙️ Instalasi & Setup

### Prasyarat

- Node.js >= 18
- npm atau yarn
- Akun [Supabase](https://supabase.com)

### 1. Clone Repository

```bash
git clone https://github.com/username/vetcare-system.git
cd vetcare-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment (GitHub Pages)

### Konfigurasi `next.config.js`

```js
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

### Build & Deploy

```bash
npm run build
# Hasil build ada di folder /out
```

Push folder `/out` ke branch `gh-pages`, atau gunakan **GitHub Actions** untuk auto-deploy.

---

## 🔐 Role & Hak Akses

| Role | Akses |
|---|---|
| **Admin** | Full akses ke semua fitur |
| **Dokter** | Data medis, treatment, catatan kondisi |
| **Staff** | Input data pasien dan kunjungan |
| **Customer** | View data hewan milik sendiri |

---

## 🔄 Alur Sistem

```
1. Customer booking / datang ke klinik
        ↓
2. Staff input data pasien
        ↓
3. Dokter lakukan treatment & catat kondisi
        ↓
4. Data tersimpan ke database (Supabase)
        ↓
5. Customer login ke portal
        ↓
6. Customer melihat update kondisi hewan secara real-time
```

---

## ⚠️ Catatan Teknis

> **GitHub Pages** hanya mendukung **static website**.
> - Tidak mendukung Server-Side Rendering (SSR)
> - Semua proses backend ditangani sepenuhnya oleh **Supabase**
> - Gunakan `output: "export"` pada konfigurasi Next.js

---

## 🚀 Roadmap

- [ ] Multi-clinic support (SaaS)
- [ ] Notifikasi WhatsApp (via WhatsApp API)
- [ ] Advanced analytics & reporting
- [ ] Mobile app (Android / iOS)

---

## 📄 Lisensi

Proyek ini menggunakan lisensi [MIT](LICENSE).

---

<p align="center">
  Dibuat dengan ❤️ untuk klinik hewan yang lebih modern
</p>
