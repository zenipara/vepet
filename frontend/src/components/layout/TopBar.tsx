import { Bell, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { useNotificationStore } from '@/features/notifications/store/notificationStore'
import { notificationService } from '@/features/notifications/services/notificationService'
import { Card } from '@/components/ui/Card'

export const TopBar = () => {
  const { notifications, unreadCount } = useNotifications()
  const { markAsRead, removeNotification } = useNotificationStore()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId)
      markAsRead(notificationId)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId)
      removeNotification(notificationId)
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6 relative">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-600">Tidak ada notifikasi</div>
              ) : (
                <div className="divide-y">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-start gap-3 ${
                        !notif.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{notif.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notif.created_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteNotification(notif.id)
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
