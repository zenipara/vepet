import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/features/auth/services/authService'
import { LogOut, PawPrint, ShieldCheck, Menu, X } from 'lucide-react'
import { useState } from 'react'

type NavbarProps = {
  theme?: 'soft' | 'vivid'
  onToggleTheme?: () => void
}

export const Navbar = ({ theme = 'vivid', onToggleTheme }: NavbarProps) => {
  const { user } = useAuthStore()

  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="public-navbar">
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
          <Link to="/about" className="text-sm text-slate-300 transition-colors hover:text-white">Tentang</Link>
          <Link to="/support" className="text-sm text-slate-300 transition-colors hover:text-white">Bantuan</Link>
          <Link to="/contact" className="text-sm text-slate-300 transition-colors hover:text-white">Kontak</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 md:inline-flex"
          >
            Tema: {theme === 'vivid' ? 'Vivid' : 'Soft'}
          </button>

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
              <div className="hidden md:flex items-center gap-3">
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
              </div>

              <button
                aria-label={open ? 'Tutup menu' : 'Buka menu'}
                onClick={() => setOpen((s) => !s)}
                className="inline-flex items-center justify-center rounded-md bg-white/5 p-2 text-slate-200 hover:bg-white/10 md:hidden"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>

        {open && (
          <div className="absolute left-0 right-0 top-full z-40 border-t border-white/10 bg-slate-950/95 md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onToggleTheme?.()
                  }}
                  className="w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  Tema: {theme === 'vivid' ? 'Vivid' : 'Soft'}
                </button>
                <Link to="/about" onClick={() => setOpen(false)} className="text-slate-200">Tentang</Link>
                <Link to="/support" onClick={() => setOpen(false)} className="text-slate-200">Bantuan</Link>
                <Link to="/contact" onClick={() => setOpen(false)} className="text-slate-200">Kontak</Link>
                <div className="pt-2">
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full">Daftar</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
