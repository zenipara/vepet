import { AdminLayout } from '@/app/layouts/AdminLayout'
import { Card } from '@/components/ui/Card'
import { Users, BookOpen, Activity, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export const AdminPage = () => {
  const stats = [
    {
      label: 'Total Pengguna',
      value: '248',
      icon: Users,
      href: '/admin/users',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Total Booking',
      value: '1,234',
      icon: BookOpen,
      href: '#',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pasien Aktif',
      value: '567',
      icon: Activity,
      href: '#',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Total Klinik',
      value: '12',
      icon: Building2,
      href: '#',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Panel administrasi VetCare System</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon
            return (
              <Link key={stat.label} to={stat.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Access */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <Users className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-gray-900">Manajemen Pengguna</p>
                <p className="text-sm text-gray-600">Kelola akun pengguna</p>
              </div>
            </Link>

            <Link
              to="/admin/cms"
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <Building2 className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-gray-900">CMS & Konten</p>
                <p className="text-sm text-gray-600">Kelola konten website</p>
              </div>
            </Link>

            <Link
              to="/admin/inventory"
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <BookOpen className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-gray-900">Inventori</p>
                <p className="text-sm text-gray-600">Kelola stok produk</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
