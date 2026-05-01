import { Button } from '@/components/ui/Button'
import { AlertCircle, Phone } from 'lucide-react'

export const EmergencyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <div className="flex gap-4 mb-6">
          <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-red-900 mb-2">Layanan Darurat 24/7</h1>
            <p className="text-red-700">
              Hubungi kami segera jika hewan peliharaan Anda mengalami keadaan darurat
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Telepon Darurat</h3>
            <a href="tel:+6281234567890" className="flex items-center gap-2 text-2xl font-bold text-red-600 hover:text-red-700">
              <Phone className="w-6 h-6" />
              +62-0812-3456-7890
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">WhatsApp Darurat</h3>
            <a href="https://wa.me/6281234567890" className="text-2xl font-bold text-green-600 hover:text-green-700">
              Hubungi WA
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Gejala Darurat yang Memerlukan Penanganan Segera:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Kesulitan bernafas atau bersengal</li>
            <li>✓ Pendarahan aktif atau cedera parah</li>
            <li>✓ Ketidaksadaran atau kejang</li>
            <li>✓ Muntah atau diare berlebihan</li>
            <li>✓ Tidak bisa buang air kecil</li>
            <li>✓ Tangisan ekstrem atau kesakitan parah</li>
            <li>✓ Keracunan atau menelan benda asing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
