import type { Appointment } from '@/types/global'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, DollarSign, MapPin } from 'lucide-react'

interface BookingCardProps {
  booking: Appointment
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const statusLabel = {
    pending: 'Tertunda',
    confirmed: 'Dikonfirmasi',
    checked_in: 'Check-in',
    in_progress: 'Dalam Proses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }[booking.status]

  const statusVariant = {
    pending: 'warning',
    confirmed: 'success',
    checked_in: 'info',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'danger',
  }[booking.status] as any

  const scheduledDate = new Date(booking.scheduled_at)
  const formattedDate = scheduledDate.toLocaleDateString('id-ID', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const formattedTime = scheduledDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-lg">{booking.pets?.name}</h4>
          <p className="text-sm text-slate-600">{booking.services?.name}</p>
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4" />
          <span>
            {formattedDate} · {formattedTime}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4" />
          <span>{booking.duration_min} menit</span>
        </div>

        {booking.services?.price && (
          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>Rp {booking.services.price.toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>

      {booking.notes && (
        <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 italic border border-slate-200">
          "{booking.notes}"
        </div>
      )}
    </Card>
  )
}
