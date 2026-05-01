import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { PawPrint, Home, Calendar, Users, FileText, Settings, LogOut } from 'lucide-react'
import { authService } from '@/features/auth/services/authService'
import clsx from 'clsx'

interface SidebarProps {
  role: 'customer' | 'staff' | 'doctor' | 'admin'
}

const menuItems = {
  customer: [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Hewan Peliharaan', href: '/dashboard/pets', icon: PawPrint },
    { label: 'Booking', href: '/dashboard/booking', icon: Calendar },
  ],
  staff: [
    { label: 'Klinik', href: '/clinic', icon: Home },
    { label: 'Janji Temu', href: '/clinic/appointments', icon: Calendar },
    { label: 'Pasien', href: '/clinic/patients', icon: Users },
  ],
  doctor: [
    { label: 'Klinik', href: '/clinic', icon: Home },
    { label: 'Janji Temu', href: '/clinic/appointments', icon: Calendar },
    { label: 'Pasien', href: '/clinic/patients', icon: Users },
    { label: 'Rekam Medis', href: '/clinic/emr', icon: FileText },
  ],
  admin: [
    { label: 'Admin', href: '/admin', icon: Home },
    { label: 'Pengguna', href: '/admin/users', icon: Users },
    { label: 'CMS', href: '/admin/cms', icon: FileText },
    { label: 'Pengaturan', href: '/admin/settings', icon: Settings },
  ],
}

export const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation()
  const { user } = useAuthStore()

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const items = menuItems[role] || []

  return (
    <aside className="relative flex h-screen w-64 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-[0_0_0_1px_rgba(148,163,184,0.08)]">
      {/* Logo */}
      <div className="border-b border-slate-200 px-4 py-5">
        <Link to="/" className="flex items-center gap-3 font-bold text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base">VetCare</span>
            <span className="block text-xs font-medium text-slate-500">Dashboard Klinik</span>
          </span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {items.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200',
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm ring-1 ring-emerald-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="space-y-3 border-t border-slate-200 px-4 py-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Akun aktif</p>
          <p className="mt-1 truncate text-sm font-medium text-slate-700">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
