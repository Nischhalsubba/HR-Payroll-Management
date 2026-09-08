import { z } from 'zod'
import type { AppSettings } from '../types/settings'
import { wait } from '../utils/helpers'
import { readCanonicalLocalStorage } from '../utils/persistedState'

const STORAGE_KEY = 'atlashr_settings'

const defaults: AppSettings = {
  orgName: 'AtlasHR Workspace',
  timezone: 'America/Los_Angeles',
  dateFormat: 'MMM d, yyyy',
  security: {
    sessionTimeoutMinutes: 45,
    twoFactorEnabled: true,
  },
  notifications: {
    emailDigest: true,
    inAppAlerts: true,
    leaveAlerts: true,
    payrollAlerts: true,
  },
  appearance: {
    density: 'comfortable',
    accent: 'blue',
  },
}

const settingsPatchSchema = z.object({
  orgName: z.string().trim().min(1).optional(),
  timezone: z.string().trim().min(1).optional(),
  dateFormat: z.enum(['MMM d, yyyy', 'dd/MM/yyyy', 'MM/dd/yyyy']).optional(),
  security: z
    .object({
      sessionTimeoutMinutes: z.number().int().min(1).max(24 * 60).optional(),
      twoFactorEnabled: z.boolean().optional(),
    })
    .optional(),
  notifications: z
    .object({
      emailDigest: z.boolean().optional(),
      inAppAlerts: z.boolean().optional(),
      leaveAlerts: z.boolean().optional(),
      payrollAlerts: z.boolean().optional(),
    })
    .optional(),
  appearance: z
    .object({
      density: z.enum(['comfortable', 'compact']).optional(),
      accent: z.enum(['blue', 'orange']).optional(),
    })
    .optional(),
})

function load(): AppSettings {
  return readCanonicalLocalStorage(
    STORAGE_KEY,
    (value) => {
      const parsed = settingsPatchSchema.safeParse(value)
      if (!parsed.success) {
        return null
      }
      return {
        ...defaults,
        ...parsed.data,
        security: { ...defaults.security, ...parsed.data.security },
        notifications: { ...defaults.notifications, ...parsed.data.notifications },
        appearance: { ...defaults.appearance, ...parsed.data.appearance },
      }
    },
    () => structuredClone(defaults),
  )
}

function save(next: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export async function getSettings(): Promise<AppSettings> {
  await wait(170)
  return load()
}

export async function updateSettings(next: AppSettings): Promise<AppSettings> {
  await wait(220)
  save(next)
  return next
}

export async function resetSettings(): Promise<AppSettings> {
  await wait(220)
  save(defaults)
  return structuredClone(defaults)
}
