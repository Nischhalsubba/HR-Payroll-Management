import { createContext, useContext, useMemo, useState } from 'react'
import type { AuthUser } from '../types'
import { clearSession, isOnboardingDone, loadSession, saveOnboardingDone, saveSession } from '../utils/storage'

interface AuthContextValue {
  user: AuthUser | null
  onboardingDone: boolean
  signIn: (user: AuthUser) => void
  signOut: () => void
  completeOnboarding: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function initUser(): AuthUser | null {
  const raw = loadSession()
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(initUser)
  const [onboardingDone, setOnboardingDone] = useState<boolean>(isOnboardingDone)

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      onboardingDone,
      signIn(nextUser) {
        setUser(nextUser)
        saveSession(JSON.stringify(nextUser))
      },
      signOut() {
        setUser(null)
        clearSession()
      },
      completeOnboarding() {
        setOnboardingDone(true)
        saveOnboardingDone()
      },
    }
  }, [onboardingDone, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used in AuthProvider')
  }

  return ctx
}
