import type { Treatment, Prescription } from '@/types/medical'

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
    const { api } = await import('@/lib/apiClient')
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
    const { api } = await import('@/lib/apiClient')
    const { data: user } = await api.auth.getUser()

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
    product_id?: string
    batch_id?: string
  }): Promise<Treatment> {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('treatments')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    // Auto-deduct inventory if product_id provided
    try {
      if (payload.product_id && payload.quantity && payload.quantity > 0) {
        const { inventoryService } = await import('@/features/inventory/services/inventoryService')
        await inventoryService.consumeFromBatch(payload.product_id, payload.batch_id, payload.quantity, { id: data.id, type: 'treatment' })
      }
    } catch (err) {
      console.error('Gagal auto-deduct inventory for treatment:', err)
    }

    return data
  },

  async addPrescription(payload: {
    record_id: string
    medicine: string
    dosage: string
    frequency: string
    duration?: string
    notes?: string
    product_id?: string
    batch_id?: string
  }): Promise<Prescription> {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('prescriptions')
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    // Auto-deduct inventory if product_id provided
    try {
      if ((payload as any).product_id) {
        const qty = 1 // default consume 1 unit per prescription unless specified elsewhere
        const { inventoryService } = await import('@/features/inventory/services/inventoryService')
        await inventoryService.consumeFromBatch((payload as any).product_id, (payload as any).batch_id, qty, { id: data.id, type: 'prescription' })
      }
    } catch (err) {
      console.error('Gagal auto-deduct inventory for prescription:', err)
    }

    return data
  },
}
