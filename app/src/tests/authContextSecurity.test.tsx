import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthProvider, useAuth } from '../context/AuthContext'

function SessionProbe() {
  const { user } = useAuth()
  return <span data-testid="session-user">{user?.email ?? 'signed-out'}</span>
}

describe('restored prototype session validation', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('rejects incomplete or forged session payloads and clears them', () => {
    sessionStorage.setItem(
      'atlashr_session',
      JSON.stringify({
        email: 'admin@atlashr.com',
        role: 'admin',
      }),
    )

    render(
      <AuthProvider>
        <SessionProbe />
      </AuthProvider>,
    )

    expect(screen.getByTestId('session-user')).toHaveTextContent('signed-out')
    expect(sessionStorage.getItem('atlashr_session')).toBeNull()
  })

  it('restores only the expected public user shape', () => {
    sessionStorage.setItem(
      'atlashr_session',
      JSON.stringify({
        id: 'user_demo',
        name: 'Demo Admin',
        email: 'admin@atlashr.com',
        role: 'forged-admin-role',
      }),
    )

    render(
      <AuthProvider>
        <SessionProbe />
      </AuthProvider>,
    )

    expect(screen.getByTestId('session-user')).toHaveTextContent('admin@atlashr.com')
    expect(JSON.parse(sessionStorage.getItem('atlashr_session') ?? '{}')).toHaveProperty('role', 'forged-admin-role')
  })
})
