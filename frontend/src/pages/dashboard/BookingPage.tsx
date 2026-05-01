import { usePets } from '@/features/pets/hooks/usePets'
import { useBooking } from '@/features/booking/hooks/useBooking'
import { BookingWizard } from '@/features/booking/components/BookingWizard'
import { BookingCard } from '@/features/booking/components/BookingCard'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import { Calendar, CheckCircle } from 'lucide-react'

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
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Anda perlu menambahkan hewan peliharaan terlebih dahulu</p>
        </div>
      </Card>
    )
  }

  const completedBookings = bookings.filter(b => b.status === 'completed')

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pesan Janji Temu</h1>

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
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Riwayat Booking
          </h2>
          <div className="space-y-4">
            {completedBookings.length === 0 ? (
              <Card className="text-sm text-gray-600 text-center py-8">
                Belum ada riwayat booking yang selesai
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
