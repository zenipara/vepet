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

  // Blog posts
  async getBlogPosts() {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createBlogPost(payload: { title: string; content: string; category?: string; status?: string; author_id?: string }) {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ ...payload, published_at: payload.status === 'published' ? new Date().toISOString() : null })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateBlogPost(id: string, payload: Record<string, any>) {
    const { supabase } = await import('@/lib/supabaseClient')
    const { error } = await supabase
      .from('blog_posts')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },

  async deleteBlogPost(id: string) {
    const { supabase } = await import('@/lib/supabaseClient')
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Testimonials
  async getTestimonials() {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createTestimonial(payload: { person_name: string; pet_name: string; content: string; rating: number; status?: string }) {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('testimonials')
      .insert({ ...payload })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTestimonial(id: string, payload: Record<string, any>) {
    const { supabase } = await import('@/lib/supabaseClient')
    const { error } = await supabase
      .from('testimonials')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },
}
