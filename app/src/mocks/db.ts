import type { AuthUser, Employee } from '../types'
import { seedEmployees } from './employees'

interface Account {
  id: string
  name: string
  email: string
  password: string
}

interface OtpRequest {
  requestId: string
  email: string
  code: string
  expiresAt: number
  verified: boolean
}

const employees: Employee[] = seedEmployees(54)

const accounts: Account[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@atlashr.com',
    password: 'Password@123',
  },
]

const otpRequests = new Map<string, OtpRequest>()

export function getEmployees(): Employee[] {
  return employees
}

export function getAccounts(): Account[] {
  return accounts
}

export function upsertAccount(account: Account): void {
  const existingIndex = accounts.findIndex((item) => item.email === account.email)
  if (existingIndex >= 0) {
    accounts[existingIndex] = account
    return
  }

  accounts.push(account)
}

export function toAuthUser(account: Account): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
  }
}

export function saveOtpRequest(input: OtpRequest): void {
  otpRequests.set(input.requestId, input)
}

export function getOtpRequest(requestId: string): OtpRequest | undefined {
  return otpRequests.get(requestId)
}

export function markOtpVerified(requestId: string): void {
  const otp = otpRequests.get(requestId)
  if (!otp) {
    return
  }

  otpRequests.set(requestId, {
    ...otp,
    verified: true,
  })
}

export function clearOtpRequest(requestId: string): void {
  otpRequests.delete(requestId)
}
