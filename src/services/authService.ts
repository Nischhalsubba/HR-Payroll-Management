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
  getAccounts,
  getOtpRequest,
  markOtpVerified,
  saveOtpRequest,
  toAuthUser,
  upsertAccount,
} from '../mocks/db'
import { wait } from '../utils/helpers'

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
    throw createError('OTP_EXPIRED', 'OTP expired. Please request a new code.')
  }

  if (request.code !== payload.code) {
    throw createError('OTP_INVALID', 'Incorrect OTP code.')
  }

  markOtpVerified(payload.requestId)

  return {
    email: payload.email,
    resetToken: createId('token'),
  }
}

export async function resetPassword(payload: ResetPasswordInput): Promise<boolean> {
  await wait(300)

  const account = getAccounts().find((item) => item.email.toLowerCase() === payload.email.toLowerCase())

  if (!account) {
    throw createError('EMAIL_NOT_FOUND', 'Account not found.')
  }

  if (!payload.resetToken.startsWith('token_')) {
    throw createError('TOKEN_INVALID', 'Reset token is invalid.')
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

  saveOtpRequest({
    ...request,
    expiresAt: Date.now() + 2 * 60 * 1000,
    code: '157428',
    verified: false,
  })

  return {
    expiresAt: Date.now() + 2 * 60 * 1000,
  }
}

export function cleanupResetRequest(requestId: string): void {
  clearOtpRequest(requestId)
}
