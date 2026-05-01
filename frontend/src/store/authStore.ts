import { create } from 'zustand'
import type { User, UserRole } from '@/types/roles'

interface AuthStore {
  user: User | null
  role: UserRole | null
  loading: boolean
  setUser: (user: User | null) => void
  setRole: (role: UserRole | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  role: null,
  loading: true,
  setUser: user => set({ user }),
  setRole: role => set({ role }),
  setLoading: loading => set({ loading }),
  clearAuth: () => set({ user: null, role: null }),
}))
