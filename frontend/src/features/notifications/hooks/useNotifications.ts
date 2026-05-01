import { useEffect, useState } from 'react'
import { notificationService } from '../services/notificationService'
import { useNotificationStore } from '../store/notificationStore'
import type { Notification } from '@/types/notification'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  refetch: () => Promise<void>
}

export const useNotifications = (): UseNotificationsReturn => {
  const { notifications, unreadCount, setNotifications } = useNotificationStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let channel: any = null

    const setupRealtime = async () => {
      const { supabase } = await import('@/lib/supabaseClient')

      channel = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              // add notification
              const { addNotification } = useNotificationStore.getState()
              addNotification(payload.new as Notification)
            } else if (payload.eventType === 'UPDATE') {
              // refresh list (simple approach)
              refetch()
            } else if (payload.eventType === 'DELETE') {
              const { removeNotification } = useNotificationStore.getState()
              removeNotification(payload.old.id)
            }
          }
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) channel.unsubscribe()
    }
  }, [])

  const refetch = async () => {
    setLoading(true)
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return { notifications, unreadCount, loading, refetch }
}
