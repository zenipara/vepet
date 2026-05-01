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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2 font-bold text-emerald-600">
          <PawPrint className="w-6 h-6" />
          VetCare
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-emerald-100 text-emerald-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
