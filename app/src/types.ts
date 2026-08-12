export type EmployeeStatus = 'active' | 'on_leave' | 'inactive'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface SessionState {
  user: AuthUser | null
  isAuthenticated: boolean
}

export interface ApiError {
  code: string
  message: string
}

export interface OtpState {
  value: string
  expiresAt: number
  resendAvailableAt: number
}

export interface Employee {
  id: string
  employeeCode: string
  name: string
  email: string
  workType: 'Onsite' | 'Hybrid' | 'Remote'
  jobTitle: string
  department: string
  status: EmployeeStatus
  createdAt: string
}

export interface EmployeeFormInput {
  name: string
  email: string
  workType: Employee['workType']
  jobTitle: string
  department: string
  status: EmployeeStatus
}

export interface DateRange {
  from?: string
  to?: string
}

export interface EmployeeQuery {
  search: string
  status: 'all' | EmployeeStatus
  sortBy: 'createdAt' | 'name' | 'department'
  sortDirection: 'asc' | 'desc'
  page: number
  perPage: number
  datePreset: '3_days' | '7_days' | '30_days' | 'custom'
  dateRange: DateRange
  departmentFilter: string | 'all'
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface LoginInput {
  email: string
  password: string
}

export interface SignupInput {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface PasswordResetRequest {
  requestId: string
  email: string
}

export interface VerifyOtpInput {
  email: string
  requestId: string
  code: string
}

export interface VerifyOtpResult {
  resetToken: string
  email: string
}

export interface ResetPasswordInput {
  email: string
  resetToken: string
  password: string
}

export interface Option {
  label: string
  value: string
}

export interface AppNavItemConfig {
  label: string
  path: string
  icon: string
  matchMode: 'prefix' | 'exact'
  legacyPaths?: string[]
}
