import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'
import { PawPrint } from 'lucide-react'

export const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
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
    setSuccessMessage('')
    setLoading(true)

    try {
      await authService.signIn(formData.email, formData.password)
      // Redirect akan ditangani oleh useAuth hook
    } catch (err: any) {
      console.error('Login error:', err)
      setError(
        err?.message || err?.error?.message || JSON.stringify(err) || 'Login gagal. Cek email dan password Anda.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setError('')
    setSuccessMessage('')

    if (!formData.email) {
      setError('Masukkan email untuk menerima link masuk.')
      return
    }

    try {
      setMagicLinkLoading(true)
      const redirectBase = `${window.location.origin}${import.meta.env.BASE_URL}`
      const redirectTo = new URL('login', redirectBase).toString()

      await authService.signInWithMagicLink(formData.email, redirectTo)
      setSuccessMessage('Link masuk telah dikirim. Silakan cek email Anda.')
    } catch (err: any) {
      console.error('Magic link error:', err)
      setError(err?.message || err?.error?.message || JSON.stringify(err) || 'Gagal mengirim link masuk. Coba lagi.')
    } finally {
      setMagicLinkLoading(false)
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

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {successMessage}
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

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            loading={magicLinkLoading}
            onClick={handleMagicLink}
          >
            Kirim Link Masuk via Email
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
