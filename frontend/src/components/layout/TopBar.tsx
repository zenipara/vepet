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
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="relative ml-4 flex items-center gap-3 sm:ml-6 sm:gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-2xl p-2.5 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-600">Tidak ada notifikasi</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`flex cursor-pointer items-start justify-between gap-3 p-4 transition-colors hover:bg-slate-50 ${
                        !notif.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-900">{notif.title}</h4>
                        <p className="mt-1 text-xs text-slate-600">{notif.message}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(notif.created_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteNotification(notif.id)
                        }}
                        className="rounded-lg p-1 hover:bg-slate-200"
                      >
                        <X className="h-4 w-4 text-slate-600" />
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
