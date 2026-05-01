import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePets } from '@/features/pets/hooks/usePets'
import { useBooking } from '@/features/booking/hooks/useBooking'
import { PetCard } from '@/features/pets/components/PetCard'
import { BookingCard } from '@/features/booking/components/BookingCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Plus, Calendar, Heart } from 'lucide-react'

export const DashboardPage = () => {
  const { pets, loading: petsLoading } = usePets()
  const { bookings, loading: bookingsLoading } = useBooking()
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '')

  const selectedPet = pets.find(p => p.id === selectedPetId)
  const upcomingBookings = bookings.filter(b => new Date(b.scheduled_at) > new Date())

  if (petsLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Kelola hewan peliharaan dan booking Anda</p>
        </div>
        <Link to="/dashboard/pets">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Hewan
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="font-semibold text-gray-700 text-sm">Total Hewan</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{pets.length}</p>
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-700 text-sm">Booking Mendatang</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{upcomingBookings.length}</p>
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-700 text-sm">Total Booking</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">{bookings.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pet Selector */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-600" />
            Hewan Peliharaan
          </h2>
          {pets.length === 0 ? (
            <Card>
              <p className="text-gray-600 text-center py-8">
                Anda belum memiliki hewan peliharaan.
              </p>
              <Link to="/dashboard/pets" className="block">
                <Button className="w-full">Tambah Hewan Pertama</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {pets.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  isSelected={selectedPetId === pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Health Overview & Recent Bookings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pet Health Summary */}
          {selectedPet && (
            <Card>
              <h3 className="text-lg font-bold mb-4">{selectedPet.name} - Ringkasan Kesehatan</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Spesies</p>
                  <p className="font-semibold">{selectedPet.species}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Ras</p>
                  <p className="font-semibold">{selectedPet.breed || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Berat</p>
                  <p className="font-semibold">{selectedPet.weight_kg || '-'} kg</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Jenis Kelamin</p>
                  <p className="font-semibold">
                    {selectedPet.gender === 'male' ? '♂️ Jantan' : '♀️ Betina'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to={`/dashboard/booking`} className="flex-1">
                  <Button variant="primary" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Booking Sekarang
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Upcoming Bookings */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Booking Mendatang
            </h2>
            {upcomingBookings.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-600 mb-4">Tidak ada booking yang akan datang</p>
                <Link to="/dashboard/booking">
                  <Button>Buat Booking</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
