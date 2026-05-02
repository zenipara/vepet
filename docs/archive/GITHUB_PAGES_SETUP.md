# GitHub Pages Setup (Archive)

Konten mengenai GitHub Pages telah dipindahkan dan diringkas di `DEPLOYMENT_GUIDE.md` (bagian Frontend / GitHub Pages).

Jika Anda membutuhkan contoh workflow Actions lengkap atau daftar secrets, silakan lihat `frontend/` dan `.github/workflows/deploy.yml`.

Ringkasan:
- Aktifkan GitHub Pages via GitHub Actions
- Set `VITE_API_URL` dan `VITE_WS_URL` pada Secrets
- Pastikan `vite.config.ts` menggunakan `base` yang benar saat `GITHUB_PAGES=true`

Untuk troubleshooting lihat `DEPLOYMENT_GUIDE.md` dan `docs/archive/PRODUCTION_DEPLOYMENT_CHECKLIST.md`.
