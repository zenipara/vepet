import { useEffect, useState } from 'react'
import { bookingService } from '../services/bookingService'
import type { Appointment, Service, Pet } from '@/types/global'

interface UseBookingReturn {
  bookings: Appointment[]
  services: Service[]
  doctors: any[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useBooking = (): UseBookingReturn => {
  const [bookings, setBookings] = useState<Appointment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)

    try {
      const [bookingsData, servicesData, doctorsData] = await Promise.all([
        bookingService.getMyBookings(),
        bookingService.getServices(),
        bookingService.getDoctors(),
      ])

      setBookings(bookingsData)
      setServices(servicesData)
      setDoctors(doctorsData)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data booking')
      console.error('Error fetching booking data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return { bookings, services, doctors, loading, error, refetch }
}
