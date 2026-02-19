import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../context/ToastContext'
import * as notificationService from '../../services/notificationService'
import type { NotificationItem, NotificationStatus } from '../../types/notification'

function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function NotificationsCenterView() {
  const { push } = useToast()
  const navigate = useNavigate()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'all' | NotificationStatus>('all')
  const [search, setSearch] = useState('')

  async function refresh() {
    setLoading(true)
    const rows = await notificationService.listNotifications(status)
    setItems(rows)
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) {
      return items
    }
    return items.filter((item) => [item.title, item.preview, item.category].join(' ').toLowerCase().includes(keyword))
  }, [items, search])

  return (
    <section className="panel stack-md notification-page">
      <div className="employee-grid-head">
        <div className="employee-grid-title">
          <h1>Notifications</h1>
          <p>Track alerts, approvals, and system updates.</p>
        </div>

        <div className="inline-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              await notificationService.markAllNotificationsRead()
              await refresh()
              push('All notifications marked as read.', 'success')
            }}
          >
            Mark all read
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              await notificationService.clearReadNotifications()
              await refresh()
              push('Read notifications cleared.', 'success')
            }}
          >
            Clear read
          </Button>
        </div>
      </div>

      <div className="tabs-row" role="tablist" aria-label="Notification status tabs">
        <button type="button" className={status === 'all' ? 'tab-btn active' : 'tab-btn'} onClick={() => setStatus('all')}>
          All
        </button>
        <button
          type="button"
          className={status === 'unread' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setStatus('unread')}
        >
          Unread
        </button>
        <button type="button" className={status === 'read' ? 'tab-btn active' : 'tab-btn'} onClick={() => setStatus('read')}>
          Read
        </button>
      </div>

      <div className="search-row">
        <input
          className="field-input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notifications..."
          aria-label="Search notifications"
        />
        <Button type="button" variant="secondary" onClick={() => void refresh()}>
          Refresh
        </Button>
      </div>

      {loading ? <div className="status-box">Loading notifications...</div> : null}

      {!loading && filtered.length === 0 ? <div className="status-box">No notifications found.</div> : null}

      {!loading && filtered.length > 0 ? (
        <div className="notification-list">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.status === 'unread' ? 'notification-row unread' : 'notification-row'}
              onClick={() => navigate(`/app/notifications/${item.id}`)}
            >
              <span className="notification-row-title">{item.title}</span>
              <span className="notification-row-preview">{item.preview}</span>
              <span className="notification-row-meta">{formatDate(item.createdAt)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}

function NotificationDetailView() {
  const { notificationId = '' } = useParams()
  const navigate = useNavigate()
  const { push } = useToast()
  const [item, setItem] = useState<NotificationItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function refresh() {
    setLoading(true)
    setError('')
    const found = await notificationService.getNotificationById(notificationId)
    if (!found) {
      setError('Notification not found.')
      setLoading(false)
      return
    }
    setItem(found)
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationId])

  if (loading) {
    return <section className="panel status-box">Loading notification...</section>
  }

  if (!item) {
    return (
      <section className="panel status-box error">
        <p>{error}</p>
        <Button type="button" variant="secondary" onClick={() => void refresh()}>
          Retry
        </Button>
        <Button type="button" onClick={() => navigate('/app/notifications')}>
          Back to Notifications
        </Button>
      </section>
    )
  }

  return (
    <section className="panel notification-detail stack-md">
      <div>
        <h1>{item.title}</h1>
        <p>
          {item.category} {'\u2022'} {formatDate(item.createdAt)}
        </p>
      </div>

      <article className="notification-detail-body">{item.content}</article>

      <div className="inline-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            const nextStatus: NotificationStatus = item.status === 'read' ? 'unread' : 'read'
            await notificationService.markNotificationStatus(item.id, nextStatus)
            await refresh()
            push(`Notification marked as ${nextStatus}.`, 'success')
          }}
        >
          Mark as {item.status === 'read' ? 'Unread' : 'Read'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            push('Notification archived (mock).', 'info')
            navigate('/app/notifications')
          }}
        >
          Archive
        </Button>
        <Button type="button" variant="danger" onClick={() => setConfirmDelete(true)}>
          Delete
        </Button>
        <Button type="button" onClick={() => navigate('/app/notifications')}>
          Back
        </Button>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete Notification"
        footer={
          <div className="inline-actions">
            <Button type="button" variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={async () => {
                await notificationService.removeNotification(item.id)
                push('Notification deleted.', 'success')
                setConfirmDelete(false)
                navigate('/app/notifications')
              }}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>This action cannot be undone.</p>
      </Modal>
    </section>
  )
}

export function NotificationsPage({ view = 'list' }: { view?: 'list' | 'detail' }) {
  if (view === 'detail') {
    return <NotificationDetailView />
  }

  return <NotificationsCenterView />
}
