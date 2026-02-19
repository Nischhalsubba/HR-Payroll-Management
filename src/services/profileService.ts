import type { PasswordChangeInput, UserProfile } from '../types/profile'
import { wait } from '../utils/helpers'

const STORAGE_KEY = 'atlashr_profile'

const defaultProfile: UserProfile = {
  fullName: 'Admin User',
  email: 'admin@atlashr.com',
  role: 'HR Operations Manager',
  phone: '+1 (555) 010-2213',
  location: 'San Francisco, CA',
  bio: 'People operations, payroll coordination, and workforce planning.',
  avatarLabel: 'AU',
}

function load(): UserProfile {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile))
    return { ...defaultProfile }
  }

  try {
    return {
      ...defaultProfile,
      ...(JSON.parse(raw) as UserProfile),
    }
  } catch {
    return { ...defaultProfile }
  }
}

function save(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export async function getProfile(): Promise<UserProfile> {
  await wait(180)
  return load()
}

export async function updateProfile(next: UserProfile): Promise<UserProfile> {
  await wait(220)
  save(next)
  return next
}

export async function changePassword(input: PasswordChangeInput): Promise<boolean> {
  await wait(220)
  if (input.nextPassword !== input.confirmPassword) {
    throw new Error('Password confirmation does not match.')
  }

  if (input.nextPassword.length < 8) {
    throw new Error('Password must be at least 8 characters.')
  }

  return true
}

export async function updateAvatar(avatarLabel: string): Promise<UserProfile> {
  await wait(160)
  const profile = {
    ...load(),
    avatarLabel: avatarLabel.slice(0, 2).toUpperCase(),
  }
  save(profile)
  return profile
}

