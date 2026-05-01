export interface Profile {
  id: string
  full_name: string
  phone?: string
  address?: string
  avatar_url?: string
  role: 'customer' | 'staff' | 'doctor' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Pet {
  id: string
  owner_id: string
  name: string
  species: string
  breed?: string
  gender?: 'male' | 'female'
  birth_date?: string
  weight_kg?: number
  color?: string
  photo_url?: string
  is_active: boolean
}

export interface Appointment {
  id: string
  pet_id: string
  owner_id: string
  doctor_id?: string
  service_id?: string
  scheduled_at: string
  duration_min: number
  status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
  // Optional relations
  pets?: Pet
  services?: Service
}

export interface Service {
  id: string
  name: string
  category: string
  price: number
  duration_min: number
  description?: string
  is_active: boolean
}
