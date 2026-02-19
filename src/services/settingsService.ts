import type { AppSettings } from '../types/settings'
import { wait } from '../utils/helpers'

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

function load(): AppSettings {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return structuredClone(defaults)
  }

  try {
    const parsed = JSON.parse(raw) as AppSettings
    return {
      ...defaults,
      ...parsed,
      security: { ...defaults.security, ...parsed.security },
      notifications: { ...defaults.notifications, ...parsed.notifications },
      appearance: { ...defaults.appearance, ...parsed.appearance },
    }
  } catch {
    return structuredClone(defaults)
  }
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

