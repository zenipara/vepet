import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

import SEO from '@/components/seo/SEO'

const faqs = [
  {
    q: 'Bagaimana cara mendaftar klinik?',
    a: 'Hubungi tim kami melalui form kontak atau email, kami akan membantu proses pendaftaran dan onboarding.',
  },
  {
    q: 'Apakah ada panduan penggunaan?',
    a: 'Ya—setiap akun mendapatkan akses ke panduan digital dan materi pelatihan singkat.',
  },
  {
    q: 'Bagaimana keamanan data pasien?',
    a: 'Data disimpan dengan enkripsi dan kontrol akses per peran untuk menjaga privasi pasien dan pemilik hewan.',
  },
]

export const SupportPage = () => {
  return (
    <div className="public-page-shell">
      <div className="public-page-container">
        <SEO title="Bantuan — VetCare" description="Pusat bantuan dan FAQ untuk pengguna VetCare." />
        <Badge variant="secondary">Bantuan & Dukungan</Badge>

        <div className="public-reveal mt-6 space-y-6">
          <h1 className="public-page-headline">Pusat bantuan</h1>
          <p className="public-page-subtitle">Temukan jawaban cepat untuk pertanyaan umum tentang penggunaan VetCare.</p>

          <div className="grid gap-4">
            {faqs.map((f) => (
              <Card key={f.q} className="public-surface-card">
                <div className="p-4">
                  <div className="font-semibold text-slate-900">{f.q}</div>
                  <div className="mt-2 text-slate-700">{f.a}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportPage
