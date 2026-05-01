import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">403</h1>
        <p className="text-xl text-gray-600 mb-6">Akses Tidak Diizinkan</p>
        <p className="text-gray-500 mb-8">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  )
}
