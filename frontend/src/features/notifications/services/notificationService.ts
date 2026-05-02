export const notificationService = {
  async getNotifications() {
    const { api } = await import('@/lib/apiClient')
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
  },

  async markAllAsRead(): Promise<void> {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false)

    if (error) throw error
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const { api } = await import('@/lib/apiClient')
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) throw error
  },
}
