import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/authStore'
import { authService } from '../services/authService'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, role, loading, setUser, setRole, setLoading, clearAuth } =
    useAuthStore()

  useEffect(() => {
    // Check existing session
    const checkAuth = async () => {
      try {
        const session = await authService.getSession()
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: 'customer', // default, will be overridden
          })

          const userRole = await authService.getUserRole(session.user.id)
          setRole(userRole)
          redirectByRole(userRole)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: 'customer', // temp
          })

          try {
            const userRole = await authService.getUserRole(session.user.id)
            setRole(userRole)
            redirectByRole(userRole)
          } catch (error) {
            console.error('Failed to get user role:', error)
          }
        } else if (event === 'SIGNED_OUT') {
          clearAuth()
          navigate('/login', { replace: true })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [navigate, setUser, setRole, setLoading, clearAuth])

  const redirectByRole = (userRole: string) => {
    const redirectMap: Record<string, string> = {
      customer: '/dashboard',
      staff: '/clinic',
      doctor: '/clinic',
      admin: '/admin',
    }
    const path = redirectMap[userRole] || '/login'
    navigate(path, { replace: true })
  }

  return { user, role, loading }
}
