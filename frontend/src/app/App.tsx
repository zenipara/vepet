import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'

export const App = () => {
  const { loading } = useAuth()
  const { user } = useAuthStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Memuat VetCare System...</p>
        </div>
      </div>
    )
  }

  return null
}
