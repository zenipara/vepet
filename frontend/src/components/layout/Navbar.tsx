import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/features/auth/services/authService'
import { LogOut, PawPrint, ShieldCheck } from 'lucide-react'

export const Navbar = () => {
  const { user } = useAuthStore()

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/20">
            <PawPrint className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold leading-none">VetCare</span>
            <span className="mt-1 block text-xs text-slate-400">Modern pet clinic platform</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-sm text-slate-300 hover:text-white">Tentang</Link>
          <Link to="/support" className="text-sm text-slate-300 hover:text-white">Bantuan</Link>
          <Link to="/contact" className="text-sm text-slate-300 hover:text-white">Kontak</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 md:flex">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span className="max-w-48 truncate">{user.email}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="shadow-lg shadow-emerald-950/20">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
