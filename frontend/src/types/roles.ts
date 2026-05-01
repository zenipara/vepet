export type UserRole = 'customer' | 'staff' | 'doctor' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
}

export interface AuthState {
  user: User | null
  role: UserRole | null
  loading: boolean
}
