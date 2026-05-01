import { ArrowRight, Mail, MapPin, PawPrint, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/20">
                <PawPrint className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-semibold leading-none">VetCare</p>
                <p className="mt-1 text-sm text-slate-400">Manajemen klinik hewan modern</p>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Platform untuk booking, rekam medis, dan operasional klinik yang dirancang agar lebih
              jelas, cepat, dan profesional bagi pemilik hewan maupun tim medis.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Alamat</p>
                <p className="mt-3 text-sm text-slate-200">Klinik digital untuk layanan hewan yang lebih rapi</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Telepon</p>
                <p className="mt-3 text-sm text-slate-200">Hubungi klinik melalui dashboard layanan</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
                <p className="mt-3 text-sm text-slate-200">support@vetcare.app</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Produk</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link to="/register" className="flex items-center gap-2 transition-colors hover:text-white"><ArrowRight className="h-4 w-4 text-emerald-400" /> Booking Appointment</Link></li>
                <li><Link to="/login" className="flex items-center gap-2 transition-colors hover:text-white"><ArrowRight className="h-4 w-4 text-emerald-400" /> Rekam Medis Digital</Link></li>
                <li><a href="#" className="flex items-center gap-2 transition-colors hover:text-white"><ArrowRight className="h-4 w-4 text-emerald-400" /> Recovery Tracking</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Kontak</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-400" /> Indonesia</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-400" /> +62 812-0000-0000</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-400" /> support@vetcare.app</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 VetCare. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link to="/register">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Coba Sekarang
              </Button>
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
              Tentang
            </Link>
            <Link to="/support" className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
              Bantuan
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
