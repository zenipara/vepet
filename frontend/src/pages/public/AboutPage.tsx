import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import SEO from '@/components/seo/SEO'

export const AboutPage = () => {
  return (
    <div className="public-page-shell">
      <div className="public-page-container">
        <SEO title="Tentang — VetCare" description="Visi dan misi VetCare untuk klinik hewan modern." />
        <Badge variant="info">Tentang VetCare</Badge>

        <div className="mt-6 space-y-6">
          <h1 className="public-page-headline">Visi kami</h1>
          <p className="public-page-subtitle">
            VetCare dibangun untuk membantu klinik hewan memberikan layanan yang lebih cepat,
            transparan, dan terstruktur. Kami percaya bahwa perawatan hewan yang baik dimulai
            dari data yang jelas dan alur kerja yang rapi.
          </p>

          <Card className="public-surface-card">
            <div className="p-6">
              <span className="public-chip">Misi VetCare</span>
              <h2 className="mt-3 text-xl font-semibold">Misi</h2>
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
    </div>
  )
}

export default AboutPage
