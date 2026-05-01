import { usePets } from '@/features/pets/hooks/usePets'
import { useBooking } from '@/features/booking/hooks/useBooking'
import { BookingWizard } from '@/features/booking/components/BookingWizard'
import { BookingCard } from '@/features/booking/components/BookingCard'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, CheckCircle, Clock3 } from 'lucide-react'

export const BookingPage = () => {
  const { pets, loading: petsLoading } = usePets()
  const { bookings, services, doctors, loading: bookingsLoading, refetch } = useBooking()

  if (petsLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="py-12 text-center">
          <p className="mb-4 text-slate-600">Anda perlu menambahkan hewan peliharaan terlebih dahulu</p>
        </div>
      </Card>
    )
  }

  const completedBookings = bookings.filter(b => b.status === 'completed')

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <Badge variant="info" className="w-fit">Booking</Badge>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Pesan Janji Temu</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Alur booking disusun agar konsisten dengan tampilan dashboard lain.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-700">
            <Clock3 className="h-4 w-4" />
            Riwayat selesai tersedia di panel kanan
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wizard */}
        <div className="lg:col-span-2">
          <BookingWizard 
            pets={pets} 
            services={services} 
            doctors={doctors}
            onSuccess={() => refetch()} 
          />
        </div>

        {/* Booking History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Riwayat Booking</h2>
          </div>
          <div className="space-y-4">
            {completedBookings.length === 0 ? (
              <Card className="border-slate-200 bg-white text-center shadow-sm">
                <p className="py-8 text-sm text-slate-600">Belum ada riwayat booking yang selesai</p>
              </Card>
            ) : (
              completedBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
