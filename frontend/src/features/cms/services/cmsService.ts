export const cmsService = {
  async getClinicProfile() {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('clinic_profile')
      .select('*')
      .single()

    if (error) throw error
    return data
  },

  async updateClinicProfile(payload: Record<string, any>): Promise<void> {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('clinic_profile')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', payload.id || '')

    if (error) throw error
  },

  async getPublicPages() {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('public_pages')
      .select('*')
      .eq('is_active', true)

    if (error) throw error
    return data || []
  },

  async updatePage(slug: string, payload: Record<string, any>): Promise<void> {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('public_pages')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('slug', slug)

    if (error) throw error
  },

  async getFeatureFlags() {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')

    if (error) throw error
    return data || []
  },

  async toggleFeatureFlag(key: string, enabled: boolean): Promise<void> {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('feature_flags')
      .update({ is_enabled: enabled, updated_at: new Date().toISOString() })
      .eq('key', key)

    if (error) throw error
  },

  // Blog posts
  async getBlogPosts() {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createBlogPost(payload: { title: string; content: string; category?: string; status?: string; author_id?: string }) {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ ...payload, published_at: payload.status === 'published' ? new Date().toISOString() : null })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateBlogPost(id: string, payload: Record<string, any>) {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('blog_posts')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },

  async deleteBlogPost(id: string) {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Testimonials
  async getTestimonials() {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createTestimonial(payload: { person_name: string; pet_name: string; content: string; rating: number; status?: string }) {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('testimonials')
      .insert({ ...payload })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTestimonial(id: string, payload: Record<string, any>) {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('testimonials')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },
}
