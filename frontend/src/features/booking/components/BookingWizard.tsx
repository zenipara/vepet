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

  // Step labels for progress indicator
  const stepLabels = ['Hewan', 'Layanan', 'Dokter', 'Tanggal', 'Konfirmasi']

  return (
    <div className="max-w-2xl mx-auto">
      {/* Enhanced Step Indicator with Labels */}
      <div className="mb-10">
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-emerald-600' : 'bg-gray-200'
                }`}
              />
              <p className={`text-xs mt-2 text-center font-medium transition-colors ${
                s <= step ? 'text-emerald-700' : 'text-gray-500'
              }`}>
                {stepLabels[s - 1]}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Langkah {step} dari 5
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-pulse">
          {error}
        </div>
      )}

      {/* Step 1: Select Pet */}
      {step === 1 && (
        <Card className="p-8 border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Pilih Hewan Peliharaan</h3>
            <p className="text-gray-600">Langkah pertama: Tentukan hewan peliharaan Anda</p>
          </div>
          <div className="space-y-3 mb-8">
            {pets.length === 0 ? (
              <p className="text-gray-600 text-center py-12 bg-gray-50 rounded-lg">Belum ada hewan peliharaan terdaftar</p>
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
            className="w-full py-3 text-base font-semibold" 
            onClick={handleStep1Next}
            disabled={!selectedPetId}
          >
            Lanjutkan
          </Button>
        </Card>
      )}

      {/* Step 2: Select Service */}
      {step === 2 && (
        <Card className="p-8 border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Pilih Layanan</h3>
            <p className="text-gray-600">untuk <span className="font-semibold text-gray-900">{selectedPet?.name}</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {services.length === 0 ? (
              <p className="text-gray-600 col-span-2 text-center py-12 bg-gray-50 rounded-lg">Belum ada layanan tersedia</p>
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
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 py-3">
              Kembali
            </Button>
            <Button 
              onClick={handleStep2Next} 
              className="flex-1 py-3"
              disabled={!selectedServiceId}
            >
              Lanjutkan
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Select Doctor */}
      {step === 3 && (
        <Card className="p-8 border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Pilih Dokter</h3>
            <p className="text-gray-600">untuk layanan <span className="font-semibold text-gray-900">{selectedService?.name}</span></p>
          </div>

          <div className="space-y-3 mb-8">
            {doctors.length === 0 ? (
              <p className="text-gray-600 text-center py-12 bg-gray-50 rounded-lg">Belum ada dokter tersedia</p>
            ) : (
              doctors.map(doctor => (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctorId(doctor.id)}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedDoctorId === doctor.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
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
            <Button variant="secondary" onClick={() => setStep(2)} className="flex-1 py-3">
              Kembali
            </Button>
            <Button 
              onClick={handleStep3Next} 
              className="flex-1 py-3"
              disabled={!selectedDoctorId}
            >
              Lanjutkan
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Select Date */}
      {step === 4 && (
        <Card className="p-8 border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Pilih Tanggal</h3>
            <p className="text-gray-600">untuk <span className="font-semibold text-gray-900">Dr. {selectedDoctor?.name}</span></p>
          </div>

          <Input
            label="Tanggal Booking"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            inputProps={{ min: minDate }}
          />

          <div className="flex gap-3 mt-8">
            <Button variant="secondary" onClick={() => setStep(3)} className="flex-1 py-3">
              Kembali
            </Button>
            <Button 
              onClick={handleStep4Next} 
              loading={slotsLoading} 
              className="flex-1 py-3"
              disabled={!selectedDate || slotsLoading}
            >
              Lihat Slot Waktu
            </Button>
          </div>
        </Card>
      )}

      {/* Step 5: Select Slot & Confirm */}
      {step === 5 && (
        <Card className="p-8 border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Pilih Jam Waktu</h3>
            <p className="text-gray-600">Tanggal: <span className="font-semibold text-gray-900">{selectedDate}</span></p>
          </div>

          {availableSlots.length === 0 ? (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              Tidak ada slot waktu yang tersedia pada tanggal ini. Silakan pilih tanggal lain.
            </div>
          ) : (
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-4">Pilih jam waktu konsultasi:</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {availableSlots.map(slot => (
                  <button
                    key={slot.slot}
                    onClick={() => slot.available && setSelectedSlot(slot.slot)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                      selectedSlot === slot.slot
                        ? 'bg-emerald-600 text-white shadow-lg scale-105'
                        : slot.available
                        ? 'border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {slot.slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8 border-t pt-8">
            <label className="block mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Catatan (opsional)</p>
              <textarea
                placeholder="Misal: Alergi atau kondisi khusus"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={3}
              />
            </label>
          </div>

          {/* Order Summary */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-2 border-emerald-200 mb-8">
            <h4 className="font-bold text-lg text-gray-900 mb-5">Ringkasan Booking</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                <span className="text-gray-600">Hewan Peliharaan:</span>
                <span className="font-semibold text-gray-900">{selectedPet?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                <span className="text-gray-600">Layanan:</span>
                <span className="font-semibold text-gray-900">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                <span className="text-gray-600">Dokter:</span>
                <span className="font-semibold text-gray-900">Dr. {selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                <span className="text-gray-600">Tanggal & Jam:</span>
                <span className="font-semibold text-gray-900">
                  {selectedDate} {selectedSlot}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                <span className="text-gray-600">Durasi:</span>
                <span className="font-semibold text-gray-900">{selectedService?.duration_min} menit</span>
              </div>
              <div className="flex justify-between items-center py-3 mt-3 pt-3 border-t-2 border-emerald-300">
                <span className="text-gray-800 font-bold text-base">Total Biaya:</span>
                <span className="font-bold text-lg text-emerald-600">
                  Rp {selectedService?.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(4)} className="flex-1 py-3">
              Kembali
            </Button>
            <Button 
              onClick={handleSubmit} 
              loading={loading} 
              className="flex-1 py-3"
              disabled={!selectedSlot || loading}
            >
              Konfirmasi Booking
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
