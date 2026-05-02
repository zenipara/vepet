import type { Appointment } from '@/types/global'

export interface CreateBookingDTO {
  pet_id: string
  doctor_id?: string
  service_id: string
  scheduled_at: string
  notes?: string
}

export interface UpdateBookingDTO {
  id: string
  status: Appointment['status']
}

export interface AvailableSlot {
  slot: string
  available: boolean
}

export const bookingService = {
  async getMyBookings(): Promise<Appointment[]> {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('appointments')
      .select(
        `
        *,
        pets(name, species, photo_url),
        services(name, duration_min, price)
      `
      )
      .order('scheduled_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getAvailableSlots(doctorId: string, date: string): Promise<AvailableSlot[]> {
    const { api } = await import('@/lib/apiClient')
    const startOfDay = `${date}T00:00:00+00:00`
    const endOfDay = `${date}T23:59:59+00:00`

    const { data: booked, error } = await supabase
      .from('appointments')
      .select('scheduled_at, duration_min')
      .eq('doctor_id', doctorId)
      .gte('scheduled_at', startOfDay)
      .lte('scheduled_at', endOfDay)
      .in('status', ['pending', 'confirmed', 'in_progress'])

    if (error) throw error

    // Generate all slots: 08:00–17:00 per 30 menit
    const slots: AvailableSlot[] = []
    const startHour = 8
    const endHour = 17
    const slotDuration = 30

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

        // Check jika slot terpakai
        const isTaken = booked?.some(b => {
          const bookedTime = new Date(b.scheduled_at).toTimeString().slice(0, 5)
          const slotEndTime = new Date(
            new Date(`${date}T${timeStr}`).getTime() + (b.duration_min || 30) * 60000
          ).toTimeString()

          return bookedTime === timeStr || slotEndTime.slice(0, 5) === bookedTime
        })

        slots.push({ slot: timeStr, available: !isTaken })
      }
    }

    return slots
  },

  async createBooking(payload: CreateBookingDTO): Promise<Appointment> {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('appointments')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateStatus(bookingId: string, status: string): Promise<Appointment> {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getServices() {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  },

  async getDoctors() {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('doctors')
      .select('id, profiles(full_name, avatar_url), specialization')
      .eq('is_available', true)

    if (error) throw error
    return data || []
  },
}
