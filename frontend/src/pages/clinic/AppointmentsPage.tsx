import { ClinicLayout } from '@/app/layouts/ClinicLayout'
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
    action: 'Mulai',
  },
  'in-progress': {
    badge: 'warning',
    icon: AlertCircle,
    label: 'Sedang Berlangsung',
    action: 'Selesai',
  },
  completed: {
    badge: 'success',
    icon: CheckCircle,
    label: 'Selesai',
    action: null,
  },
  cancelled: {
    badge: 'danger',
    icon: AlertCircle,
    label: 'Dibatalkan',
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
    <ClinicLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Janji Temu Hari Ini</h1>
          <p className="text-gray-600 mt-2">
            {appointments.filter(a => a.status !== 'cancelled').length} janji temu yang dijadwalkan
          </p>
        </div>

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
                    className="p-4 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{appointment.petName}</h3>
                        <p className="text-sm text-gray-600">{appointment.ownerName}</p>
                      </div>
                      <Badge variant={config.badge as any}>{config.label}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{appointment.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{appointment.service}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{appointment.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{appointment.phone}</span>
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
            <Card className="p-6 h-fit sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Detail Janji Temu</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Hewan Peliharaan</p>
                  <p className="text-gray-900 font-medium">{selectedAppointment.petName}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Pemilik</p>
                  <p className="text-gray-900 font-medium">{selectedAppointment.ownerName}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Kontak</p>
                  <p className="text-gray-900 font-medium">{selectedAppointment.phone}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Layanan</p>
                  <p className="text-gray-900 font-medium">{selectedAppointment.service}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Dokter</p>
                  <p className="text-gray-900 font-medium">{selectedAppointment.doctor}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Waktu</p>
                  <p className="text-gray-900 font-medium">{selectedAppointment.timeSlot}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <Badge variant={statusConfig[selectedAppointment.status].badge as any}>
                    {statusConfig[selectedAppointment.status].label}
                  </Badge>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Catatan</p>
                    <p className="text-gray-900">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </ClinicLayout>
  )
}
