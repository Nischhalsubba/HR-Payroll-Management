export type NotificationStatus = 'read' | 'unread'
export type NotificationCategory = 'attendance' | 'payroll' | 'leave' | 'system' | 'recruitment'

export interface NotificationItem {
  id: string
  title: string
  preview: string
  content: string
  createdAt: string
  status: NotificationStatus
  category: NotificationCategory
}

