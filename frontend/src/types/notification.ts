export interface Notification {
  id: string
  user_id: string
  type: 'booking' | 'emr' | 'stock_alert' | 'expiry_alert' | 'recovery_update'
  title: string
  message: string
  read: boolean
  link?: string
  created_at: string
}
