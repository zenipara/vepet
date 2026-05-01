export const cmsService = {
  async getClinicProfile() {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('clinic_profile')
      .select('*')
      .single()

    if (error) throw error
    return data
  },

  async updateClinicProfile(payload: Record<string, any>): Promise<void> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { error } = await supabase
      .from('clinic_profile')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', payload.id || '')

    if (error) throw error
  },

  async getPublicPages() {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('public_pages')
      .select('*')
      .eq('is_active', true)

    if (error) throw error
    return data || []
  },

  async updatePage(slug: string, payload: Record<string, any>): Promise<void> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { error } = await supabase
      .from('public_pages')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('slug', slug)

    if (error) throw error
  },

  async getFeatureFlags() {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')

    if (error) throw error
    return data || []
  },

  async toggleFeatureFlag(key: string, enabled: boolean): Promise<void> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { error } = await supabase
      .from('feature_flags')
      .update({ is_enabled: enabled, updated_at: new Date().toISOString() })
      .eq('key', key)

    if (error) throw error
  },
}
