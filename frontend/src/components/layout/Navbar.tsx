import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/features/auth/services/authService'
import { LogOut, PawPrint } from 'lucide-react'

export const Navbar = () => {
  const { user, role } = useAuthStore()

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
          <PawPrint className="w-6 h-6" />
          VetCare
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
