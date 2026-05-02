import { api } from '@/lib/apiClient'
import type { UserRole } from '@/types/roles'

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await api.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('authService.signIn error:', { error, data })
        throw new Error(error.message || JSON.stringify(error))
      }

      console.info('authService.signIn success:', data)
      return data
    } catch (err) {
      console.error('authService.signIn exception:', err)
      throw err
    }
  },

  async signInWithMagicLink(email: string, redirectTo?: string) {
    const { data, error } = await api.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) throw error
    return data
  },

  async signUp(email: string, password: string, userData: Record<string, any>) {
    const { data, error } = await api.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await api.auth.signOut()
    if (error) throw error
  },

  async getUserRole(userId: string): Promise<UserRole> {
    // Get user to access user_metadata.role from JWT token
    const { data, error } = await api.auth.getUser()
    
    if (error) {
      console.error('Failed to get user:', error)
      throw error
    }

    const role = data.user?.user_metadata?.role || 'customer'
    console.info('getUserRole from metadata:', { userId, role })
    return role as UserRole
  },

  async getSession() {
    const { data } = await api.auth.getSession()
    return data.session
  },

  async getCurrentUser() {
    const { data } = await api.auth.getUser()
    return data.user
  },
}
