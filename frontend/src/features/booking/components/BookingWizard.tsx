import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { bookingService } from '../services/bookingService'
import type { Pet, Service } from '@/types/global'
import type { AvailableSlot } from '../services/bookingService'
import { ServiceCard } from './ServiceCard'
import { PetCard } from '@/features/pets/components/PetCard'
import { User, Stethoscope } from 'lucide-react'

interface BookingWizardProps {
  pets: Pet[]
  services: Service[]
  doctors: any[]
  onSuccess?: () => void
}

export const BookingWizard = ({ pets, services, doctors, onSuccess }: BookingWizardProps) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step data
  const [selectedPetId, setSelectedPetId] = useState<string>('')
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [notes, setNotes] = useState<string>('')

  const selectedPet = pets.find(p => p.id === selectedPetId)
  const selectedService = services.find(s => s.id === selectedServiceId)
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId)

  // Step 1: Validate & Move to Step 2
  const handleStep1Next = () => {
    if (!selectedPetId) {
      setError('Pilih hewan peliharaan terlebih dahulu')
      return
    }
    setError('')
    setStep(2)
  }

  // Step 2: Validate & Move to Step 3
  const handleStep2Next = () => {
    if (!selectedServiceId) {
      setError('Pilih layanan terlebih dahulu')
      return
    }
    setError('')
    setStep(3)
  }

  // Step 3: Validate & Move to Step 4
  const handleStep3Next = () => {
    if (!selectedDoctorId) {
      setError('Pilih dokter terlebih dahulu')
      return
    }
    setError('')
    setStep(4)
  }

  // Step 4: Load slots & move to Step 5
  const handleStep4Next = async () => {
    if (!selectedDate) {
      setError('Pilih tanggal terlebih dahulu')
      return
    }

    setSlotsLoading(true)
    setError('')

    try {
      const slots = await bookingService.getAvailableSlots(selectedDoctorId, selectedDate)
      setAvailableSlots(slots)
      setStep(5)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat slot waktu')
    } finally {
      setSlotsLoading(false)
    }
  }

  // Step 5: Submit booking
  const handleSubmit = async () => {
    if (!selectedSlot) {
      setError('Pilih jam waktu terlebih dahulu')
      return
    }

    setLoading(true)
    setError('')

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedSlot}:00`).toISOString()

      await bookingService.createBooking({
        pet_id: selectedPetId!,
        doctor_id: selectedDoctorId,
        service_id: selectedServiceId!,
        scheduled_at: scheduledAt,
        notes: notes || undefined,
      })

      onSuccess?.()
      setStep(1)
      setSelectedPetId('')
      setSelectedServiceId('')
      setSelectedDoctorId('')
      setSelectedDate('')
      setSelectedSlot('')
      setNotes('')
    } catch (err: any) {
      setError(err.message || 'Gagal membuat booking')
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map(s => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full transition-colors ${
              s <= step ? 'bg-emerald-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Select Pet */}
      {step === 1 && (
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-6">Pilih Hewan Peliharaan</h3>
          <div className="space-y-3 mb-6">
            {pets.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Belum ada hewan peliharaan terdaftar</p>
            ) : (
              pets.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  isSelected={selectedPetId === pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                />
              ))
            )}
          </div>
          <Button 
            className="w-full" 
            onClick={handleStep1Next}
            disabled={!selectedPetId}
          >
            Lanjutkan
          </Button>
        </Card>
      )}

      {/* Step 2: Select Service */}
      {step === 2 && (
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-2">Pilih Layanan</h3>
          <p className="text-gray-600 mb-6">untuk {selectedPet?.name}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {services.length === 0 ? (
              <p className="text-gray-600 col-span-2 text-center py-8">Belum ada layanan tersedia</p>
            ) : (
              services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedServiceId === service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                />
              ))
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
              Kembali
            </Button>
            <Button 
              onClick={handleStep2Next} 
              className="flex-1"
              disabled={!selectedServiceId}
            >
              Lanjutkan
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Select Doctor */}
      {step === 3 && (
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-2">Pilih Dokter</h3>
          <p className="text-gray-600 mb-6">{selectedService?.name}</p>

          <div className="space-y-3 mb-6">
            {doctors.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Belum ada dokter tersedia</p>
            ) : (
              doctors.map(doctor => (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctorId(doctor.id)}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedDoctorId === doctor.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                    {selectedDoctorId === doctor.id && (
                      <Badge>Dipilih</Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
              Kembali
            </Button>
            <Button 
              onClick={handleStep3Next} 
              className="flex-1"
              disabled={!selectedDoctorId}
            >
              Lanjutkan
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Select Date */}
      {step === 4 && (
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-2">Pilih Tanggal</h3>
          <p className="text-gray-600 mb-6">untuk {selectedDoctor?.name}</p>

          <Input
            label="Tanggal Booking"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            inputProps={{ min: minDate }}
          />

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={() => setStep(3)} className="flex-1">
              Kembali
            </Button>
            <Button 
              onClick={handleStep4Next} 
              loading={slotsLoading} 
              className="flex-1"
              disabled={!selectedDate}
            >
              Lihat Slot Waktu
            </Button>
          </div>
        </Card>
      )}

      {/* Step 5: Select Slot & Confirm */}
      {step === 5 && (
        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-2">Pilih Jam Waktu</h3>
          <p className="text-gray-600 mb-6">Tanggal: {selectedDate}</p>

          {availableSlots.length === 0 ? (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              Tidak ada slot waktu yang tersedia pada tanggal ini
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-2 mb-6">
              {availableSlots.map(slot => (
                <button
                  key={slot.slot}
                  onClick={() => slot.available && setSelectedSlot(slot.slot)}
                  disabled={!slot.available}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSlot === slot.slot
                      ? 'bg-emerald-600 text-white'
                      : slot.available
                      ? 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.slot}
                </button>
              ))}
            </div>
          )}

          <Input
            label="Catatan (opsional)"
            placeholder="Misal: Alergi atau kondisi khusus"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          {/* Order Summary */}
          <Card className="mt-6 bg-gray-50 p-4">
            <h4 className="font-semibold mb-4">Ringkasan Booking</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Hewan Peliharaan:</span>
                <span className="font-semibold">{selectedPet?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Layanan:</span>
                <span className="font-semibold">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dokter:</span>
                <span className="font-semibold">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal & Jam:</span>
                <span className="font-semibold">
                  {selectedDate} {selectedSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durasi:</span>
                <span className="font-semibold">{selectedService?.duration_min} menit</span>
              </div>
              <div className="pt-3 border-t border-gray-300 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-800 font-bold">Total Biaya:</span>
                  <span className="font-bold text-emerald-600">
                    Rp {selectedService?.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={() => setStep(4)} className="flex-1">
              Kembali
            </Button>
            <Button 
              onClick={handleSubmit} 
              loading={loading} 
              className="flex-1"
              disabled={!selectedSlot}
            >
              Konfirmasi Booking
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
