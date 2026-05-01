import { ClinicLayout } from '@/app/layouts/ClinicLayout'
import { Card } from '@/components/ui/Card'
import { Calendar, Users, FileText, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ClinicPage = () => {
  const stats = [
    {
      label: 'Janji Hari Ini',
      value: '8',
      icon: Calendar,
      href: '/clinic/appointments',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pasien Aktif',
      value: '12',
      icon: Users,
      href: '/clinic/patients',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Rekam Medis',
      value: '45',
      icon: FileText,
      href: '/clinic/emr',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Stok Kritis',
      value: '3',
      icon: AlertCircle,
      href: '/admin/inventory',
      color: 'bg-red-100 text-red-600',
    },
  ]

  return (
    <ClinicLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dasbor Klinik</h1>
          <p className="text-gray-600 mt-2">Kelola janji temu dan rekam medis pasien</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/clinic/appointments"
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <Calendar className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-gray-900">Janji Temu Hari Ini</p>
                <p className="text-sm text-gray-600">Lihat dan kelola janji</p>
              </div>
            </Link>

            <Link
              to="/clinic/patients"
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <Users className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-gray-900">Data Pasien</p>
                <p className="text-sm text-gray-600">Kelola informasi pasien</p>
              </div>
            </Link>

            <Link
              to="/clinic/emr"
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <FileText className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-gray-900">Rekam Medis</p>
                <p className="text-sm text-gray-600">Akses dan update rekam medis</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </ClinicLayout>
  )
}
