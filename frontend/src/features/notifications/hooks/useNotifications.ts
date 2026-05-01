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
