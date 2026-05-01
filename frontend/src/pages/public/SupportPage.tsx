import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

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
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Badge variant="secondary">Bantuan & Dukungan</Badge>

      <div className="mt-6 space-y-6">
        <h1 className="text-2xl font-bold">Pusat bantuan</h1>
        <p className="text-slate-700">Temukan jawaban cepat untuk pertanyaan umum tentang penggunaan VetCare.</p>

        <div className="grid gap-4">
          {faqs.map((f) => (
            <Card key={f.q} className="border-slate-200 bg-white">
              <div className="p-4">
                <div className="font-semibold">{f.q}</div>
                <div className="mt-2 text-slate-700">{f.a}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SupportPage
