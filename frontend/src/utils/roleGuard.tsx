import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { role, user } = useAuthStore()

  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(role || '')) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
