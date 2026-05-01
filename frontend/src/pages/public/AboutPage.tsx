import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const AboutPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Badge variant="info">Tentang VetCare</Badge>

      <div className="mt-6 space-y-6">
        <h1 className="text-3xl font-bold">Visi kami</h1>
        <p className="text-slate-700 leading-7">
          VetCare dibangun untuk membantu klinik hewan memberikan layanan yang lebih cepat,
          transparan, dan terstruktur. Kami percaya bahwa perawatan hewan yang baik dimulai
          dari data yang jelas dan alur kerja yang rapi.
        </p>

        <Card className="border-slate-200 bg-white">
          <div className="p-6">
            <h2 className="text-xl font-semibold">Misi</h2>
            <ul className="mt-3 list-disc pl-5 text-slate-700">
              <li>Menyediakan alat manajemen klinik yang mudah dipakai.</li>
              <li>Meningkatkan komunikasi antar tim klinik dan pemilik hewan.</li>
              <li>Memastikan rekam medis tersimpan rapi dan dapat diakses sesuai kebutuhan.</li>
            </ul>
            <div className="mt-6">
              <Link to="/contact">
                <Button variant="ghost">Hubungi tim kami</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AboutPage
