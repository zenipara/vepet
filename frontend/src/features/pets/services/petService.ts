import type { Pet } from '@/types/global'

export interface CreatePetDTO {
  name: string
  species: string
  breed?: string
  gender?: 'male' | 'female'
  birth_date?: string
  weight_kg?: number
  color?: string
  photo_url?: string
}

export interface UpdatePetDTO extends Partial<CreatePetDTO> {
  id: string
}

export const petService = {
  async getMyPets(): Promise<Pet[]> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getPetById(petId: string): Promise<Pet | null> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', petId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  },

  async createPet(payload: CreatePetDTO): Promise<Pet> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('pets')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePet(petId: string, payload: Partial<CreatePetDTO>): Promise<Pet> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('pets')
      .update(payload)
      .eq('id', petId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deletePet(petId: string): Promise<void> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { error } = await supabase
      .from('pets')
      .update({ is_active: false })
      .eq('id', petId)

    if (error) throw error
  },
}
