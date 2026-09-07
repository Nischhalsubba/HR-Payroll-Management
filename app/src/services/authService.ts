import type {
  ApiError,
  LoginInput,
  PasswordResetRequest,
  ResetPasswordInput,
  SignupInput,
  VerifyOtpInput,
  VerifyOtpResult,
} from '../types'
import {
  clearOtpRequest,
  consumeResetToken,
  getAccounts,
  getOtpRequest,
  issueResetToken,
  markOtpVerified,
  saveOtpRequest,
  toAuthUser,
  upsertAccount,
} from '../mocks/db'
import { wait } from '../utils/helpers'

const RESET_TOKEN_TTL_MS = 10 * 60 * 1000

function createError(code: string, message: string): ApiError {
  return { code, message }
}

function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export async function login(payload: LoginInput) {
  await wait(350)
  const account = getAccounts().find((item) => item.email.toLowerCase() === payload.email.toLowerCase())

  if (!account || account.password !== payload.password) {
    throw createError('INVALID_CREDENTIALS', 'Invalid email or password.')
  }

  return toAuthUser(account)
}

export async function signup(payload: SignupInput) {
  await wait(400)
  const existing = getAccounts().find((item) => item.email.toLowerCase() === payload.email.toLowerCase())

  if (existing) {
    throw createError('EMAIL_EXISTS', 'Email is already registered.')
  }

  upsertAccount({
    id: createId('user'),
    name: payload.name,
    email: payload.email,
    password: payload.password,
  })

  return true
}

export async function requestPasswordReset(email: string): Promise<PasswordResetRequest> {
  await wait(300)
  const account = getAccounts().find((item) => item.email.toLowerCase() === email.toLowerCase())

  if (!account) {
    throw createError('EMAIL_NOT_FOUND', 'No account found for this email.')
  }

  const requestId = createId('reset')
  saveOtpRequest({
    requestId,
    email,
    code: '157428',
    expiresAt: Date.now() + 2 * 60 * 1000,
    verified: false,
  })

  return {
    requestId,
    email,
  }
}

export async function verifyOtp(payload: VerifyOtpInput): Promise<VerifyOtpResult> {
  await wait(250)
  const request = getOtpRequest(payload.requestId)

  if (!request || request.email.toLowerCase() !== payload.email.toLowerCase()) {
    throw createError('RESET_CONTEXT_INVALID', 'Password reset session is invalid.')
  }

  if (Date.now() > request.expiresAt) {
    clearOtpRequest(payload.requestId)
    throw createError('OTP_EXPIRED', 'OTP expired. Please request a new code.')
  }

  if (request.code !== payload.code) {
    throw createError('OTP_INVALID', 'Incorrect OTP code.')
  }

  markOtpVerified(payload.requestId)
  const resetToken = createId('token')
  const issued = issueResetToken(payload.requestId, resetToken, Date.now() + RESET_TOKEN_TTL_MS)
  if (!issued) {
    throw createError('RESET_CONTEXT_INVALID', 'Password reset session is invalid.')
  }

  return {
    email: payload.email,
    resetToken,
  }
}

export async function resetPassword(payload: ResetPasswordInput): Promise<boolean> {
  await wait(300)

  const account = getAccounts().find((item) => item.email.toLowerCase() === payload.email.toLowerCase())

  if (!account) {
    throw createError('EMAIL_NOT_FOUND', 'Account not found.')
  }

  const authorized = consumeResetToken(payload.requestId, payload.email, payload.resetToken)
  if (!authorized) {
    throw createError('TOKEN_INVALID', 'Reset token is invalid or expired.')
  }

  upsertAccount({
    ...account,
    password: payload.password,
  })

  return true
}

export async function resendOtp(requestId: string): Promise<{ expiresAt: number }> {
  await wait(220)
  const request = getOtpRequest(requestId)

  if (!request) {
    throw createError('RESET_CONTEXT_INVALID', 'Password reset session is invalid.')
  }

  const expiresAt = Date.now() + 2 * 60 * 1000
  saveOtpRequest({
    requestId: request.requestId,
    email: request.email,
    expiresAt,
    code: '157428',
    verified: false,
  })

  return {
    expiresAt,
  }
}

export function cleanupResetRequest(requestId: string): void {
  clearOtpRequest(requestId)
}
