import { beforeEach, describe, expect, it } from 'vitest'
import * as authService from '../services/authService'
import { clearSession, loadSession, saveSession } from '../utils/storage'

describe('prototype auth security boundaries', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('keeps the demo session scoped to sessionStorage and retires legacy persistence', () => {
    localStorage.setItem('atlashr_session', 'legacy-session')
    expect(loadSession()).toBeNull()
    expect(localStorage.getItem('atlashr_session')).toBeNull()

    saveSession('current-session')
    expect(sessionStorage.getItem('atlashr_session')).toBe('current-session')
    expect(localStorage.getItem('atlashr_session')).toBeNull()

    clearSession()
    expect(sessionStorage.getItem('atlashr_session')).toBeNull()
  })

  it('rejects forged reset tokens and consumes an issued reset token once', async () => {
    const email = `security-${Date.now()}@example.test`
    await authService.signup({
      name: 'Security Test User',
      email,
      password: 'StartPassword1',
      confirmPassword: 'StartPassword1',
    })

    const request = await authService.requestPasswordReset(email)

    await expect(
      authService.resetPassword({
        email,
        requestId: request.requestId,
        resetToken: 'token_forged',
        password: 'ChangedPassword2',
      }),
    ).rejects.toMatchObject({ code: 'TOKEN_INVALID' })

    const verified = await authService.verifyOtp({
      email,
      requestId: request.requestId,
      code: '157428',
    })

    await expect(
      authService.resetPassword({
        email,
        requestId: request.requestId,
        resetToken: verified.resetToken,
        password: 'ChangedPassword2',
      }),
    ).resolves.toBe(true)

    await expect(
      authService.resetPassword({
        email,
        requestId: request.requestId,
        resetToken: verified.resetToken,
        password: 'ReplayPassword3',
      }),
    ).rejects.toMatchObject({ code: 'TOKEN_INVALID' })

    await expect(authService.login({ email, password: 'ChangedPassword2' })).resolves.toMatchObject({ email })
  })
})
