import type { Medical Record, Treatment, Prescription } from '@/types/global'

export interface MedicalRecordWithDetails {
  id: string
  pet_id: string
  visit_date: string
  chief_complaint: string
  symptoms?: string[]
  diagnosis?: string
  notes?: string
  follow_up_date?: string
  treatments?: Treatment[]
  prescriptions?: Prescription[]
  doctor_name?: string
}

export const emrService = {
  async getPetMedicalHistory(petId: string): Promise<MedicalRecordWithDetails[]> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        treatments(*),
        prescriptions(*),
        doctors(profiles(full_name))
      `)
      .eq('pet_id', petId)
      .order('visit_date', { ascending: false })

    if (error) throw error
    return (data || []).map(r => ({
      ...r,
      doctor_name: r.doctors?.profiles?.full_name,
    }))
  },

  async createMedicalRecord(payload: {
    pet_id: string
    chief_complaint: string
    symptoms?: string[]
    diagnosis?: string
    notes?: string
    follow_up_date?: string
  }): Promise<MedicalRecordWithDetails> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data: user } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('medical_records')
      .insert({
        ...payload,
        doctor_id: user?.user?.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async addTreatment(payload: {
    record_id: string
    name: string
    quantity?: number
    unit?: string
    price?: number
  }): Promise<Treatment> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('treatments')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async addPrescription(payload: {
    record_id: string
    medicine: string
    dosage: string
    frequency: string
    duration?: string
    notes?: string
  }): Promise<Prescription> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('prescriptions')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
