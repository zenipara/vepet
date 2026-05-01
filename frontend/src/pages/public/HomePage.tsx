import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import SEO from '@/components/seo/SEO'
import { analyticsService } from '@/features/analytics/services/analyticsService'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  HeartPulse,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  Users,
  Cat,
  Dog,
  Bird,
  Rabbit,
  Sparkles,
  Heart,
} from 'lucide-react'
import { Accordion } from '@/components/ui/Accordion'

export const HomePage = () => {
  const [hideStickyCta, setHideStickyCta] = useState(false)

  useEffect(() => {
    const footer = document.getElementById('public-footer')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideStickyCta(entry.isIntersecting)
      },
      { root: null, threshold: 0.08 }
    )

    observer.observe(footer)

    return () => {
      observer.disconnect()
    }
  }, [])

  const highlights = [
    {
      value: '24/7',
      label: 'Akses info darurat dan booking cepat',
    },
    {
      value: '100%',
      label: 'Data hewan, jadwal, dan riwayat dalam satu tempat',
    },
    {
      value: '4.9/5',
      label: 'Pengalaman layanan yang fokus pada kenyamanan pemilik',
    },
  ]

  const features = [
    {
      icon: PawPrint,
      title: 'Manajemen Hewan',
      desc: 'Simpan profil, jadwal vaksin, alergi, dan catatan penting setiap hewan dengan rapi.',
    },
    {
      icon: HeartPulse,
      title: 'Rekam Medis Digital',
      desc: 'Pantau riwayat pemeriksaan, tindakan, dan obat tanpa harus mencari berkas manual.',
    },
    {
      icon: CalendarDays,
      title: 'Booking Terjadwal',
      desc: 'Atur janji temu secara cepat dengan alur yang jelas dan minim friksi.',
    },
    {
      icon: Users,
      title: 'Tim Profesional',
      desc: 'Layanan dari dokter hewan dan staf klinik yang siap memberi arahan yang tepat.',
    },
  ]

  const steps = [
    {
      title: 'Daftarkan hewan',
      desc: 'Masukkan profil dasar, kebutuhan khusus, dan kontak utama pemilik.',
    },
    {
      title: 'Pilih layanan',
      desc: 'Tentukan konsultasi, vaksinasi, rawat inap, atau layanan darurat sesuai kebutuhan.',
    },
    {
      title: 'Pantau hasilnya',
      desc: 'Lihat update medis, jadwal tindak lanjut, dan status perawatan dalam satu dashboard.',
    },
  ]

  const servicePoints = [
    'Konsultasi medis yang terjadwal dan transparan',
    'Informasi obat, tindakan, dan follow-up yang mudah dipahami',
    'Alur layanan yang membantu klinik bekerja lebih cepat dan tertib',
  ]

  const testimonials = [
    {
      name: 'Dr. Rina',
      role: 'Kepala Klinik, Klinik Harapan Hewan',
      text: 'Integrasi rekam medis dan booking membuat alur kerja tim kami jauh lebih cepat.',
      petType: 'dog',
      petIcon: Dog,
      emoji: '🐕‍🦺',
    },
    {
      name: 'Budi',
      role: 'Pemilik hewan peliharaan',
      text: 'Mudah mendaftar dan melihat riwayat kesehatan kucing saya dalam satu tempat.',
      petType: 'cat',
      petIcon: Cat,
      emoji: '😺',
    },
    {
      name: 'Sari',
      role: 'Perawat klinik',
      text: 'Tampilan dashboardnya intuitif — memudahkan penjadwalan dan follow-up.',
      petType: 'bird',
      petIcon: Bird,
      emoji: '🦜',
    },
  ]

  const trusted = [
    'Klinik Harapan',
    'PetCare Center',
    'VetPrima',
    'Klinik Sehat',
    'Dr. Hewan Solo',
    'Klinik Ceria',
  ]

  const faqs = [
    {
      id: 'q1',
      title: 'Bagaimana cara mendaftar sebagai klinik?',
      content: 'Anda dapat menghubungi tim sales lewat form kontak atau daftar langsung untuk memulai trial dan onboarding.',
    },
    {
      id: 'q2',
      title: 'Apakah data pasien aman?',
      content: 'Semua data terenkripsi dan akses dibatasi berdasarkan peran pengguna di dalam platform.',
    },
    {
      id: 'q3',
      title: 'Apakah ada biaya bulanan?',
      content: 'Kami menawarkan paket trial dan beberapa tier langganan, hubungi tim kami untuk penawaran khusus.',
    },
  ]

  // Pet illustration with animated floating pets
  const PetIllustration = () => (
    <div className="relative h-64 w-full max-w-sm">
      {/* Floating pet icons background */}
      <div className="absolute -left-8 top-8 pet-float">
        <Dog className="h-12 w-12 text-emerald-400 opacity-80" />
      </div>
      <div className="absolute right-0 top-0 pet-float-slow">
        <Cat className="h-16 w-16 text-teal-400 opacity-70" />
      </div>
      <div className="absolute bottom-8 left-12 pet-bob">
        <Rabbit className="h-10 w-10 text-emerald-300 opacity-75" />
      </div>
      <div className="absolute right-8 bottom-12 pet-bounce">
        <Bird className="h-12 w-12 text-cyan-300 opacity-70" />
      </div>

      {/* Main SVG illustration */}
      <svg
        viewBox="0 0 600 400"
        fill="none"
        aria-hidden="true"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="600" height="400" rx="24" fill="url(#g)" />
        <g transform="translate(80,60) scale(0.9)">
          <circle cx="120" cy="80" r="48" fill="#10B981" opacity="0.12" />
          <circle cx="220" cy="40" r="32" fill="#06B6D4" opacity="0.14" />
          <path d="M40 220c30-40 80-58 130-40s80 64 120 72" stroke="#34D399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.18" />
          {/* Happy dog face */}
          <g transform="translate(40,40)">
            <circle cx="80" cy="120" r="40" fill="#fff" opacity="0.1" />
            <path d="M70 105c0 0 6-12 25-12s25 12 25 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
            <circle cx="32" cy="32" r="8" fill="#34D399" />
            <circle cx="56" cy="32" r="8" fill="#34D399" />
            <circle cx="44" cy="48" r="8" fill="#34D399" />
          </g>
        </g>
      </svg>

      {/* Sparkle elements */}
      <div className="absolute top-1/4 left-1/4 pet-shimmer">
        <Sparkles className="h-6 w-6 text-emerald-300 opacity-60" />
      </div>
    </div>
  )

  return (
    <div className="bg-slate-50 pb-24 text-slate-900 md:pb-0">
      <SEO
        title="VetCare — Platform Klinik Hewan"
        description="Satu platform untuk booking, rekam medis, dan operasional klinik hewan."
      />
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_42%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
          <div className="space-y-8">
            <Badge variant="success" className="bg-white/10 text-emerald-100 ring-1 ring-white/10">
              Platform klinik hewan modern
            </Badge>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Satu platform untuk layanan hewan yang lebih cepat, rapi, dan terpercaya.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                VetCare membantu klinik dan pemilik hewan mengelola booking, rekam medis, serta
                follow-up perawatan dalam pengalaman yang jelas dan profesional.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                aria-label="Daftar akun VetCare"
                onClick={() => analyticsService.trackCTAClick('Hero CTA', 'Register')}
              >
                <Button size="lg" className="group w-full sm:w-auto focus-visible:ring-4 focus-visible:ring-emerald-300">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link
                to="/emergency"
                aria-label="Buka halaman darurat VetCare"
                onClick={() => analyticsService.trackCTAClick('Hero CTA', 'Emergency')}
              >
                <Button size="lg" variant="ghost" className="w-full border border-white/20 text-white hover:bg-white/10 sm:w-auto focus-visible:ring-4 focus-visible:ring-white/20">
                  Bantuan Darurat
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-semibold">{item.value}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-6">
            <div className="hidden lg:block">
              <PetIllustration />
            </div>
            <Card className="relative overflow-hidden border-white/10 bg-slate-950/70 p-0 text-white shadow-2xl backdrop-blur-sm w-full max-w-md">
              <div className="border-b border-white/10 bg-white/5 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Dashboard ringkas</p>
                    <h2 className="text-xl font-semibold">Operasional klinik yang lebih terkontrol</h2>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Janji hari ini</p>
                    <p className="mt-2 text-3xl font-semibold">18</p>
                    <p className="mt-1 text-sm text-emerald-300">+22% dari minggu lalu</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Tindak lanjut aktif</p>
                    <p className="mt-2 text-3xl font-semibold">7</p>
                    <p className="mt-1 text-sm text-cyan-300">Semua tercatat rapi</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  {[
                    'Pemeriksaan rutin kucing - 09.00',
                    'Vaksinasi anjing - 11.30',
                    'Kontrol pasca tindakan - 15.15',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pet Types Showcase */}
      <section className="public-reveal public-section public-divider bg-gradient-to-b from-emerald-50 to-transparent">
        <div className="mb-10 text-center">
          <Badge variant="info" className="mx-auto">Jenis Hewan</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Mendukung semua jenis hewan peliharaan</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">VetCare dirancang untuk klinik yang melayani berbagai jenis hewan peliharaan</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animating-pets">
          {[
            { icon: Dog, name: 'Anjing (Dog)', color: 'from-amber-100 to-amber-50', iconColor: 'text-amber-600' },
            { icon: Cat, name: 'Kucing (Cat)', color: 'from-orange-100 to-orange-50', iconColor: 'text-orange-600' },
            { icon: Rabbit, name: 'Kelinci (Rabbit)', color: 'from-pink-100 to-pink-50', iconColor: 'text-pink-600' },
            { icon: Bird, name: 'Burung (Bird)', color: 'from-cyan-100 to-cyan-50', iconColor: 'text-cyan-600' },
          ].map(({ icon: Icon, name, color, iconColor }) => (
            <Card key={name} className={`group relative border-0 bg-gradient-to-br ${color} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2 cursor-pointer`}>
              <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center h-full min-h-40">
                {/* Animated pet icon */}
                <div className="relative">
                  <div className={`p-4 rounded-2xl bg-white/60 group-hover:bg-white transition-colors ${iconColor}`}>
                    <Icon className="h-10 w-10 pet-bounce group-hover:pet-bounce" />
                  </div>
                  {/* Sparkle on hover */}
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>

                {/* Pet name */}
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{name}</h3>
                  <p className="text-sm text-slate-600 mt-1">Dukungan penuh untuk perawatan kesehatan</p>
                </div>

                {/* Hover indicator */}
                <div className="transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <Badge variant="success" className="bg-emerald-500 text-white border-0">Didukung ✓</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="public-reveal public-section public-divider">
        <div className="mb-8">
          <Badge variant="info">Suara Pengguna</Badge>
          <h2 className="mt-3 text-2xl font-bold">Apa kata mereka tentang VetCare</h2>
          <p className="max-w-2xl text-slate-600">Testimonial singkat dari pemilik dan tim klinik yang sudah memakai VetCare.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => {
            const PetIcon = t.petIcon
            return (
              <Card key={t.name} className="public-surface-card h-full border-slate-200 hover:shadow-lg hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-emerald-200 overflow-hidden group">
                <div className="space-y-4 p-5">
                  {/* Pet avatar */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 px-3 py-1">
                      <PetIcon className="h-4 w-4 text-emerald-600 pet-bounce" />
                      <span className="text-xs font-semibold text-emerald-700 capitalize">{t.petType}</span>
                    </div>
                    <span className="text-2xl group-hover:scale-125 transition-transform">{t.emoji}</span>
                  </div>

                  {/* Rating stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="h-3.5 w-3.5 fill-red-400 text-red-400 group-hover:animate-pulse" />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="leading-6 text-slate-700 text-sm">"{t.text}"</p>

                  {/* Name & role */}
                  <div className="border-t border-slate-200 pt-3">
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="public-reveal public-reveal-delay-1 public-section public-divider">
        <div className="mb-8">
          <Badge variant="info">Trusted by</Badge>
          <h2 className="mt-3 text-2xl font-bold">Klinik yang sudah memakai VetCare</h2>
          <p className="max-w-2xl text-slate-600">Beberapa klinik mitra yang mempercayakan operasional mereka pada VetCare.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {trusted.map((name) => (
            <div key={name} className="public-trusted-card">
              {name}
            </div>
          ))}
        </div>
      </section>

      <section className="public-reveal public-reveal-delay-2 public-section public-divider">
        <div className="mb-8">
          <Badge variant="secondary">Pertanyaan</Badge>
          <h2 className="mt-3 text-2xl font-bold">Pertanyaan yang sering diajukan</h2>
          <p className="max-w-2xl text-slate-600">Jika pertanyaan Anda tidak tercantum, hubungi kami melalui halaman kontak.</p>
        </div>

        <Accordion items={faqs} />
      </section>

      <section className="public-reveal public-section public-divider !py-20">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <Badge variant="info">Kenapa VetCare</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dirancang untuk pengalaman yang lebih profesional di klinik hewan
            </h2>
          </div>
          <p className="max-w-xl text-slate-600">
            Setiap bagian home page ini menekankan kejelasan layanan, kemudahan akses, dan rasa
            percaya sejak kunjungan pertama.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon

            return (
              <Card 
                key={feature.title} 
                className="group h-full border-slate-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 overflow-hidden"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div className="space-y-4 p-6 relative overflow-hidden">
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  
                  {/* Icon with animation */}
                  <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                    <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Title and description */}
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{feature.title}</h3>
                  <p className="leading-7 text-slate-600 group-hover:text-slate-700 transition-colors">{feature.desc}</p>

                  {/* Floating accent */}
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="public-reveal public-divider border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-4">
            <Badge variant="secondary">Alur layanan</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sederhana untuk pemilik, efisien untuk tim klinik</h2>
            <p className="text-slate-600 leading-7">
              Tampilan yang baik bukan hanya menarik, tapi juga membantu orang bergerak dari satu
              langkah ke langkah berikutnya tanpa kebingungan.
            </p>

            <div className="space-y-3 pt-2">
              {servicePoints.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <p className="text-sm leading-6 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <Card key={step.title} className="border-slate-200 bg-slate-50">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-semibold text-white">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{step.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="public-reveal public-section public-divider !py-20">
        <div className="grid gap-6 rounded-[2rem] bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-10 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div className="space-y-3">
            <Badge variant="success" className="bg-white/10 text-emerald-50 ring-1 ring-white/10">
              Siap digunakan
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Bawa pengalaman klinik hewan ke level yang lebih meyakinkan</h2>
            <p className="max-w-2xl text-emerald-50 leading-7">
              VetCare memberi kesan modern sejak halaman pertama, lalu meneruskan pengalaman itu ke
              booking, rekam medis, dan layanan operasional.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              to="/register"
              onClick={() => analyticsService.trackCTAClick('Finale CTA', 'Register')}
            >
              <Button size="lg" variant="ghost" className="w-full bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto">
                Daftar Gratis
              </Button>
            </Link>
            <Link
              to="/login"
              onClick={() => analyticsService.trackCTAClick('Finale CTA', 'Login')}
            >
              <Button size="lg" variant="ghost" className="w-full border border-white/20 text-white hover:bg-white/10 sm:w-auto">
                Masuk ke Akun
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div
        className={`public-sticky-cta transition-all duration-300 ${
          hideStickyCta ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-7xl gap-3">
          <Link
            to="/register"
            className="w-full"
            onClick={() => analyticsService.trackCTAClick('Sticky CTA', 'Register')}
          >
            <Button className="w-full">Daftar Gratis</Button>
          </Link>
          <Link
            to="/login"
            className="w-full"
            onClick={() => analyticsService.trackCTAClick('Sticky CTA', 'Login')}
          >
            <Button variant="ghost" className="w-full border border-slate-200 text-slate-700 hover:bg-slate-100">
              Masuk
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
