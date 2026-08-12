const SESSION_KEY = 'atlashr_session'
const ONBOARDING_KEY = 'atlashr_onboarding_done'
const RESET_CONTEXT_KEY = 'atlashr_reset_context'

export interface ResetContext {
  email: string
  requestId: string
  resetToken?: string
}

export function saveSession(value: string): void {
  localStorage.setItem(SESSION_KEY, value)
}

export function loadSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function saveOnboardingDone(): void {
  localStorage.setItem(ONBOARDING_KEY, 'true')
}

export function isOnboardingDone(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true'
}

export function saveResetContext(context: ResetContext): void {
  sessionStorage.setItem(RESET_CONTEXT_KEY, JSON.stringify(context))
}

export function loadResetContext(): ResetContext | null {
  const raw = sessionStorage.getItem(RESET_CONTEXT_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as ResetContext
  } catch {
    return null
  }
}

export function clearResetContext(): void {
  sessionStorage.removeItem(RESET_CONTEXT_KEY)
}
