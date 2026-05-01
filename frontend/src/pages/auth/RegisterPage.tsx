import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'
import { PawPrint } from 'lucide-react'

export const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
      })
      setSuccess(true)
      setFormData({ email: '', password: '', fullName: '', phone: '' })
    } catch (err: any) {
      setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card className="mb-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <PawPrint className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold">VetCare System</h1>
          <p className="text-gray-600 text-sm mt-2">Buat akun baru</p>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="No. Telepon"
            name="phone"
            type="tel"
            placeholder="+62-0812-3456-7890"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Daftar
          </Button>
        </form>
      </Card>

      <div className="text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Masuk di sini
        </Link>
      </div>
    </div>
  )
}
