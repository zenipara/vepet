import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { PawPrint, Heart, Zap, Users } from 'lucide-react'

export const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Kesehatan Hewan Peliharaan Anda, Prioritas Kami</h1>
          <p className="text-xl text-emerald-100 mb-8">
            Platform manajemen klinik hewan yang transparan, digital, dan terpercaya
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Mulai Sekarang</Button>
            </Link>
            <Link to="/emergency">
              <Button size="lg" variant="ghost">
                Darurat
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: PawPrint,
                title: 'Manajemen Hewan',
                desc: 'Kelola semua data hewan peliharaan Anda dengan mudah',
              },
              {
                icon: Heart,
                title: 'Rekam Medis Digital',
                desc: 'Akses riwayat kesehatan kapan saja, di mana saja',
              },
              {
                icon: Zap,
                title: 'Booking Instan',
                desc: 'Pesan janji temu dengan mudah dan cepat',
              },
              {
                icon: Users,
                title: 'Tim Profesional',
                desc: 'Dokter hewan berpengalaman siap melayani',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <Icon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap untuk melayani hewan peliharaan Anda?</h2>
          <p className="text-emerald-100 mb-6">Bergabunglah dengan ribuan pemilik hewan yang puas</p>
          <Link to="/register">
            <Button size="lg" variant="ghost">
              Daftar Gratis Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
