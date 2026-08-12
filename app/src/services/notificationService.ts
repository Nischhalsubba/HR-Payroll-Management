import type { NotificationItem, NotificationStatus } from '../types/notification'
import { wait } from '../utils/helpers'

const STORAGE_KEY = 'atlashr_notifications'

const seedData: NotificationItem[] = [
  {
    id: 'n_1',
    title: 'Payroll Run Completed',
    preview: 'March payroll finished successfully for 126 employees.',
    content:
      'The March payroll cycle has been completed. All direct-deposit files were generated and queued for banking.',
    createdAt: new Date('2026-02-19T08:20:00.000Z').toISOString(),
    status: 'unread',
    category: 'payroll',
  },
  {
    id: 'n_2',
    title: 'Late Check-ins Detected',
    preview: '8 employees checked in after the grace period.',
    content:
      'Late arrivals exceeded the configured threshold for today. Review the Attandence section to inspect outliers.',
    createdAt: new Date('2026-02-19T07:15:00.000Z').toISOString(),
    status: 'unread',
    category: 'attendance',
  },
  {
    id: 'n_3',
    title: 'Leave Request Pending',
    preview: 'A leave request from Jordan Mills is awaiting approval.',
    content:
      'Jordan Mills submitted a 2-day leave request for next week. Open Leaves to review and approve the request.',
    createdAt: new Date('2026-02-18T15:45:00.000Z').toISOString(),
    status: 'read',
    category: 'leave',
  },
  {
    id: 'n_4',
    title: 'New Applicant Added',
    preview: 'A new applicant has been added to Frontend Engineer.',
    content:
      'A new profile was submitted for the Frontend Engineer role. Open Applicants to evaluate and schedule the first stage.',
    createdAt: new Date('2026-02-18T10:05:00.000Z').toISOString(),
    status: 'read',
    category: 'recruitment',
  },
  {
    id: 'n_5',
    title: 'System Maintenance Window',
    preview: 'Scheduled maintenance starts at 11:00 PM tonight.',
    content:
      'AtlasHR will run a maintenance window tonight from 11:00 PM to 11:40 PM local time. Some reports may be delayed.',
    createdAt: new Date('2026-02-17T20:30:00.000Z').toISOString(),
    status: 'read',
    category: 'system',
  },
]

function load(): NotificationItem[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
    return [...seedData]
  }

  try {
    const parsed = JSON.parse(raw) as NotificationItem[]
    return Array.isArray(parsed) ? parsed : [...seedData]
  } catch {
    return [...seedData]
  }
}

function save(items: NotificationItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export async function listNotifications(status: 'all' | NotificationStatus = 'all'): Promise<NotificationItem[]> {
  await wait(160)
  const items = load().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  if (status === 'all') {
    return items
  }
  return items.filter((item) => item.status === status)
}

export async function getNotificationById(id: string): Promise<NotificationItem | null> {
  await wait(130)
  return load().find((item) => item.id === id) ?? null
}

export async function markNotificationStatus(id: string, status: NotificationStatus): Promise<boolean> {
  await wait(120)
  const items = load()
  const index = items.findIndex((item) => item.id === id)
  if (index < 0) {
    return false
  }
  items[index] = {
    ...items[index],
    status,
  }
  save(items)
  return true
}

export async function markAllNotificationsRead(): Promise<void> {
  await wait(120)
  save(load().map((item) => ({ ...item, status: 'read' })))
}

export async function removeNotification(id: string): Promise<boolean> {
  await wait(120)
  const items = load()
  const next = items.filter((item) => item.id !== id)
  if (next.length === items.length) {
    return false
  }
  save(next)
  return true
}

export async function clearReadNotifications(): Promise<void> {
  await wait(120)
  save(load().filter((item) => item.status !== 'read'))
}

export async function unreadCount(): Promise<number> {
  await wait(60)
  return load().filter((item) => item.status === 'unread').length
}

