import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'
import { PawPrint } from 'lucide-react'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      await authService.signIn(formData.email, formData.password)
      // Redirect akan ditangani oleh useAuth hook
    } catch (err: any) {
      setError(err.message || 'Login gagal. Cek email dan password Anda.')
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
          <p className="text-gray-600 text-sm mt-2">Masuk ke akun Anda</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Masuk
          </Button>
        </form>
      </Card>

      <div className="text-center text-sm text-gray-600">
        Belum punya akun?{' '}
        <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Daftar di sini
        </Link>
      </div>
    </div>
  )
}
