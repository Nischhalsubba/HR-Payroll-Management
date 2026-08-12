import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { NotificationItem } from '../../types/notification'
import * as notificationService from '../../services/notificationService'

interface TopNavNotificationsProps {
  onCountChange: (count: number) => void
  onOpenDetail: (id: string) => void
  onClose: () => void
}

function formatTime(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TopNavNotifications({ onCountChange, onOpenDetail, onClose }: TopNavNotificationsProps) {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  const unreadItems = useMemo(() => items.filter((item) => item.status === 'unread'), [items])
  const readItems = useMemo(() => items.filter((item) => item.status === 'read'), [items])

  async function refresh() {
    setLoading(true)
    const [rows, unread] = await Promise.all([notificationService.listNotifications(), notificationService.unreadCount()])
    setItems(rows)
    onCountChange(unread)
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="notification-dropdown" role="menu" aria-label="Notifications menu">
      <div className="notification-dropdown-head">
        <strong>Notifications</strong>
        <div className="inline-actions">
          <button
            type="button"
            className="text-link"
            onClick={async () => {
              await notificationService.markAllNotificationsRead()
              await refresh()
            }}
          >
            Mark all read
          </button>
          <button
            type="button"
            className="text-link"
            onClick={async () => {
              await notificationService.clearReadNotifications()
              await refresh()
            }}
          >
            Clear read
          </button>
        </div>
      </div>

      {loading ? <p className="notification-muted">Loading...</p> : null}

      {!loading && unreadItems.length === 0 && readItems.length === 0 ? (
        <p className="notification-muted">No notifications yet.</p>
      ) : null}

      {!loading && unreadItems.length > 0 ? (
        <div className="notification-section">
          <span className="notification-section-label">Unread</span>
          {unreadItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="notification-item unread"
              onClick={() => onOpenDetail(item.id)}
              role="menuitem"
            >
              <span className="notification-title">{item.title}</span>
              <span className="notification-preview">{item.preview}</span>
              <span className="notification-time">{formatTime(item.createdAt)}</span>
            </button>
          ))}
        </div>
      ) : null}

      {!loading && readItems.length > 0 ? (
        <div className="notification-section">
          <span className="notification-section-label">Read</span>
          {readItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              type="button"
              className="notification-item"
              onClick={() => onOpenDetail(item.id)}
              role="menuitem"
            >
              <span className="notification-title">{item.title}</span>
              <span className="notification-preview">{item.preview}</span>
              <span className="notification-time">{formatTime(item.createdAt)}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="notification-footer">
        <Link className="text-link" to="/app/notifications" onClick={onClose}>
          View All Notifications
        </Link>
      </div>
    </div>
  )
}

