import { supabase } from '@/lib/supabaseClient'
import type { UserRole } from '@/types/roles'

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signUp(email: string, password: string, userData: Record<string, any>) {
    const { data, error } = await supabase.auth.signUp({
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
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getUserRole(userId: string): Promise<UserRole> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data.role as UserRole
  },

  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser()
    return data.user
  },
}
