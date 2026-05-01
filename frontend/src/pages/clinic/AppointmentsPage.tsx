
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, User, Phone, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface Appointment {
  id: string
  petName: string
  ownerName: string
  phone: string
  service: string
  doctor: string
  timeSlot: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  notes?: string
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    petName: 'Fluffy',
    ownerName: 'Budi Santoso',
    phone: '081234567890',
    service: 'Pemeriksaan Rutin',
    doctor: 'Dr. Hendra',
    timeSlot: '09:00 - 09:30',
    status: 'scheduled',
  },
  {
    id: '2',
    petName: 'Max',
    ownerName: 'Siti Nurhaliza',
    phone: '081234567891',
    service: 'Vaksinasi',
    doctor: 'Dr. Rina',
    timeSlot: '10:00 - 10:30',
    status: 'in-progress',
  },
  {
    id: '3',
    petName: 'Bella',
    ownerName: 'Ahmad Riyanto',
    phone: '081234567892',
    service: 'Perawatan Gigi',
    doctor: 'Dr. Hendra',
    timeSlot: '11:00 - 11:45',
    status: 'completed',
  },
]

const statusConfig = {
  scheduled: {
    badge: 'primary',
    icon: Clock,
    label: 'Terjadwal',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-l-blue-500',
    action: 'Mulai',
  },
  'in-progress': {
    badge: 'warning',
    icon: AlertCircle,
    label: 'Sedang Berlangsung',
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-l-amber-500',
    action: 'Selesai',
  },
  completed: {
    badge: 'success',
    icon: CheckCircle,
    label: 'Selesai',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-l-emerald-500',
    action: null,
  },
  cancelled: {
    badge: 'danger',
    icon: AlertCircle,
    label: 'Dibatalkan',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-l-red-500',
    action: null,
  },
}

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const handleUpdateStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt))
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Janji Temu Hari Ini</h1>
            <p className="text-gray-600 text-lg">
              <span className="font-semibold text-emerald-600">
                {appointments.filter(a => a.status !== 'cancelled').length}
              </span>
              {' '}janji temu yang dijadwalkan
            </p>
          </div>

          {/* Status Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { status: 'scheduled' as const, label: 'Terjadwal' },
              { status: 'in-progress' as const, label: 'Sedang Berlangsung' },
              { status: 'completed' as const, label: 'Selesai' },
              { status: 'cancelled' as const, label: 'Dibatalkan' },
            ].map(({ status, label }) => (
              <div key={status} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === status).length}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointments List */}
            <div className="lg:col-span-2">
            <div className="space-y-4">
              {appointments.map(appointment => {
                const config = statusConfig[appointment.status]
                const StatusIcon = config.icon

                return (
                  <Card
                    key={appointment.id}
                    className={`p-6 border-l-4 hover:shadow-lg transition-all cursor-pointer ${
                      appointment.status === 'scheduled' ? 'border-l-blue-500 bg-blue-50' :
                      appointment.status === 'in-progress' ? 'border-l-amber-500 bg-amber-50' :
                      appointment.status === 'completed' ? 'border-l-emerald-500 bg-emerald-50' :
                      'border-l-red-500 bg-red-50'
                    }`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            appointment.status === 'scheduled' ? 'bg-blue-100' :
                            appointment.status === 'in-progress' ? 'bg-amber-100' :
                            appointment.status === 'completed' ? 'bg-emerald-100' :
                            'bg-red-100'
                          }`}>
                            <StatusIcon className={`w-5 h-5 ${
                              appointment.status === 'scheduled' ? 'text-blue-600' :
                              appointment.status === 'in-progress' ? 'text-amber-600' :
                              appointment.status === 'completed' ? 'text-emerald-600' :
                              'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{appointment.petName}</h3>
                            <p className="text-sm text-gray-600">{appointment.ownerName}</p>
                          </div>
                        </div>
                      </div>
                      <Badge variant={config.badge as any} className="whitespace-nowrap">
                        {config.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5 py-4 border-t border-b border-current border-opacity-10">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Waktu</p>
                          <p className="font-semibold text-gray-900 text-sm">{appointment.timeSlot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Layanan</p>
                          <p className="font-semibold text-gray-900 text-sm">{appointment.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Dokter</p>
                          <p className="font-semibold text-gray-900 text-sm">{appointment.doctor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Kontak</p>
                          <p className="font-semibold text-gray-900 text-sm">{appointment.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {appointment.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={e => {
                            e.stopPropagation()
                            handleUpdateStatus(appointment.id, 'in-progress')
                          }}
                          className="flex-1"
                        >
                          Mulai Pemeriksaan
                        </Button>
                      )}
                      {appointment.status === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={e => {
                            e.stopPropagation()
                            handleUpdateStatus(appointment.id, 'completed')
                          }}
                          className="flex-1"
                        >
                          Selesai
                        </Button>
                      )}
                      {(appointment.status === 'scheduled' || appointment.status === 'in-progress') && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={e => {
                            e.stopPropagation()
                            handleUpdateStatus(appointment.id, 'cancelled')
                          }}
                        >
                          Batalkan
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
            </div>

            {/* Details Panel */}
            {selectedAppointment && (
              <Card className="p-8 h-fit sticky top-20 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg">
              <div className="mb-6">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">Detail Janji Temu</p>
                <h3 className="font-bold text-2xl text-gray-900 mb-3">{selectedAppointment.petName}</h3>
                <Badge variant={statusConfig[selectedAppointment.status].badge as any}>
                  {statusConfig[selectedAppointment.status].label}
                </Badge>
              </div>

              <div className="space-y-5 border-t border-emerald-200 pt-6">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Pemilik</p>
                  <p className="text-gray-900 font-semibold text-lg">{selectedAppointment.ownerName}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Kontak</p>
                  <p className="text-gray-900 font-medium cursor-pointer hover:text-emerald-600 transition-colors">
                    {selectedAppointment.phone}
                  </p>
                </div>

                <div className="bg-white/60 rounded-lg p-4 border border-emerald-200">
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Layanan</p>
                    <p className="text-gray-900 font-semibold">{selectedAppointment.service}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Dokter</p>
                    <p className="text-gray-900 font-semibold">Dr. {selectedAppointment.doctor}</p>
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-4 border border-emerald-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Waktu Terjadwal</p>
                  <p className="text-gray-900 font-semibold text-lg">{selectedAppointment.timeSlot}</p>
                </div>

                {selectedAppointment.notes && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide mb-2">Catatan Khusus</p>
                    <p className="text-gray-900 text-sm leading-relaxed">{selectedAppointment.notes}</p>
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    onClick={() => setSelectedAppointment(null)}
                    className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                  >
                    Tutup Detail
                  </button>
                </div>
              </div>
            </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
