import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Halaman Tidak Ditemukan</p>
        <p className="text-gray-500 mb-8">Halaman yang Anda cari tidak ada atau telah dihapus.</p>
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  )
}
