const SESSION_KEY = 'atlashr_session'
const ONBOARDING_KEY = 'atlashr_onboarding_done'
const RESET_CONTEXT_KEY = 'atlashr_reset_context'

export interface ResetContext {
  email: string
  requestId: string
  resetToken?: string
}

export function saveSession(value: string): void {
  sessionStorage.setItem(SESSION_KEY, value)
  // Retire the older persistent demo-session path. The prototype must not
  // silently restore an authenticated state after the browser session ends.
  localStorage.removeItem(SESSION_KEY)
}

export function loadSession(): string | null {
  localStorage.removeItem(SESSION_KEY)
  return sessionStorage.getItem(SESSION_KEY)
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
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
    const value = JSON.parse(raw) as Partial<ResetContext>
    if (typeof value.email !== 'string' || typeof value.requestId !== 'string') {
      sessionStorage.removeItem(RESET_CONTEXT_KEY)
      return null
    }
    if (value.resetToken !== undefined && typeof value.resetToken !== 'string') {
      sessionStorage.removeItem(RESET_CONTEXT_KEY)
      return null
    }
    return value as ResetContext
  } catch {
    sessionStorage.removeItem(RESET_CONTEXT_KEY)
    return null
  }
}

export function clearResetContext(): void {
  sessionStorage.removeItem(RESET_CONTEXT_KEY)
}
