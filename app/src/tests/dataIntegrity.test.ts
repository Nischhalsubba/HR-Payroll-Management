import { beforeEach, describe, expect, it } from 'vitest'
import { getEmployees, resetDemoData } from '../mocks/db'
import { createEmployee, deleteEmployee } from '../services/employeeService'
import { listNotifications } from '../services/notificationService'
import { getProfile } from '../services/profileService'
import { getSettings } from '../services/settingsService'

const employeeInput = {
  name: 'Integrity Test User',
  email: 'integrity@example.test',
  workType: 'Hybrid' as const,
  jobTitle: 'QA Engineer',
  department: 'Engineering',
  status: 'active' as const,
}

describe('prototype data-integrity boundaries', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    resetDemoData()
  })

  it('does not reuse an existing employee identifier after deletion', async () => {
    const original = getEmployees().map((employee) => ({ ...employee }))
    const highestOriginalId = Math.max(...original.map((employee) => Number(employee.id)))
    const highestOriginalCode = Math.max(...original.map((employee) => Number(employee.employeeCode.replace('#', ''))))

    await deleteEmployee(original[0].id)
    const created = await createEmployee(employeeInput)

    expect(Number(created.id)).toBeGreaterThan(highestOriginalId)
    expect(Number(created.employeeCode.replace('#', ''))).toBeGreaterThan(highestOriginalCode)

    const current = getEmployees()
    expect(new Set(current.map((employee) => employee.id)).size).toBe(current.length)
    expect(new Set(current.map((employee) => employee.employeeCode)).size).toBe(current.length)
  })

  it('replaces corrupt notification storage with canonical synthetic seed data', async () => {
    localStorage.setItem(
      'atlashr_notifications',
      JSON.stringify([{ id: 'tampered', status: 'administrator', createdAt: 'not-a-date' }]),
    )

    const notifications = await listNotifications()
    expect(notifications).toHaveLength(5)
    expect(notifications.every((item) => item.status === 'read' || item.status === 'unread')).toBe(true)

    const stored = JSON.parse(localStorage.getItem('atlashr_notifications') ?? '[]') as unknown[]
    expect(stored).toHaveLength(5)
  })

  it('strips unknown profile fields while preserving valid editable fields', async () => {
    localStorage.setItem(
      'atlashr_profile',
      JSON.stringify({
        fullName: 'Canonical Demo User',
        email: 'canonical@example.test',
        isAdmin: true,
      }),
    )

    const profile = await getProfile()
    expect(profile.fullName).toBe('Canonical Demo User')
    expect(profile.email).toBe('canonical@example.test')

    const stored = JSON.parse(localStorage.getItem('atlashr_profile') ?? '{}') as Record<string, unknown>
    expect(stored.isAdmin).toBeUndefined()
    expect(stored.role).toBe('HR Operations Manager')
  })

  it('rejects invalid persisted settings and restores the canonical defaults', async () => {
    localStorage.setItem(
      'atlashr_settings',
      JSON.stringify({
        orgName: 'Tampered Workspace',
        security: { sessionTimeoutMinutes: 'forever', twoFactorEnabled: 'yes' },
        appearance: { density: 'ultra-dense', accent: 'red' },
      }),
    )

    const settings = await getSettings()
    expect(settings.orgName).toBe('AtlasHR Workspace')
    expect(settings.security).toEqual({ sessionTimeoutMinutes: 45, twoFactorEnabled: true })
    expect(settings.appearance).toEqual({ density: 'comfortable', accent: 'blue' })

    const stored = JSON.parse(localStorage.getItem('atlashr_settings') ?? '{}')
    expect(stored).toEqual(settings)
  })
})
