import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePets } from '@/features/pets/hooks/usePets'
import { useBooking } from '@/features/booking/hooks/useBooking'
import { PetCard } from '@/features/pets/components/PetCard'
import { BookingCard } from '@/features/booking/components/BookingCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Plus, Calendar, Heart, PawPrint, Activity, Clock3 } from 'lucide-react'

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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge variant="info" className="w-fit">Ringkasan Dashboard</Badge>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Kelola hewan peliharaan dan booking Anda dalam tampilan yang lebih rapi dan konsisten.</p>
          </div>
        </div>
        <Link to="/dashboard/pets">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Hewan
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Hewan</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{pets.length}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <PawPrint className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Booking Mendatang</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{upcomingBookings.length}</p>
            </div>
            <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Booking</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{bookings.length}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pet Selector */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Hewan Peliharaan</h2>
          </div>
          {pets.length === 0 ? (
            <Card className="border-slate-200 bg-white text-center shadow-sm">
              <p className="py-8 text-slate-600">Anda belum memiliki hewan peliharaan.</p>
              <Link to="/dashboard/pets" className="block px-6 pb-6">
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
        <div className="space-y-6 lg:col-span-2">
          {/* Pet Health Summary */}
          {selectedPet && (
            <Card className="border-slate-200 bg-white shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Ringkasan Kesehatan</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">{selectedPet.name}</h3>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  Aktif
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">Spesies</p>
                  <p className="font-semibold text-slate-900">{selectedPet.species}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">Ras</p>
                  <p className="font-semibold text-slate-900">{selectedPet.breed || '-'}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">Berat</p>
                  <p className="font-semibold text-slate-900">{selectedPet.weight_kg || '-'} kg</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">Jenis Kelamin</p>
                  <p className="font-semibold text-slate-900">
                    {selectedPet.gender === 'male' ? 'Jantan' : 'Betina'}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <Link to="/dashboard/booking" className="flex-1">
                  <Button variant="primary" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Booking Sekarang
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Upcoming Bookings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-600" />
              <h2 className="text-xl font-bold text-slate-900">Booking Mendatang</h2>
            </div>
            {upcomingBookings.length === 0 ? (
              <Card className="border-slate-200 bg-white text-center shadow-sm">
                <p className="mb-4 py-4 text-slate-600">Tidak ada booking yang akan datang</p>
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
