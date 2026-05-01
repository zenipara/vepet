export interface MedicalRecord {
  id: string
  pet_id: string
  visit_date: string
  chief_complaint: string
  symptoms?: string[]
  diagnosis?: string
  notes?: string
  follow_up_date?: string
}

export interface Treatment {
  id: string
  record_id: string
  product_id?: string
  name: string
  quantity?: number
  unit?: string
  price?: number
  administered_at: string
}

export interface Prescription {
  id: string
  record_id: string
  product_id?: string
  medicine: string
  dosage: string
  frequency: string
  duration?: string
  notes?: string
  created_at: string
}

export interface InpatientCase {
  id: string
  pet_id: string
  admit_date: string
  discharge_date?: string
  cage_number?: string
  status: 'admitted' | 'lab_test' | 'observation' | 'recovery' | 'discharged'
  severity: 'critical' | 'serious' | 'normal' | 'stable'
  notes?: string
}

export interface CaseUpdate {
  id: string
  case_id: string
  stage: 'check_in' | 'lab_test' | 'observation' | 'recovery' | 'discharge'
  title: string
  description: string
  vitals?: {
    weight?: number
    temperature?: number
    heart_rate?: number
    notes?: string
  }
  created_at: string
  author_id: string
}

export interface CasePhoto {
  id: string
  case_id: string
  update_id?: string
  photo_url: string
  caption?: string
  taken_at: string
}
