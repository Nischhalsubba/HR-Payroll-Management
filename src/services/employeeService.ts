import type { Employee, EmployeeFormInput, EmployeeQuery, EmployeeStatus, PaginatedResult } from '../types'
import { getEmployees } from '../mocks/db'
import { wait } from '../utils/helpers'

const store = getEmployees()

function compare(a: string, b: string, direction: 'asc' | 'desc') {
  const order = direction === 'asc' ? 1 : -1
  if (a < b) {
    return -1 * order
  }
  if (a > b) {
    return 1 * order
  }
  return 0
}

function resolveRange(query: EmployeeQuery): { from?: number; to?: number } {
  if (query.datePreset === 'custom') {
    return {
      from: query.dateRange.from ? new Date(query.dateRange.from).getTime() : undefined,
      to: query.dateRange.to ? new Date(query.dateRange.to).getTime() : undefined,
    }
  }

  const now = new Date('2026-02-18T00:00:00Z').getTime()
  const mapping: Record<Exclude<EmployeeQuery['datePreset'], 'custom'>, number> = {
    '3_days': 3,
    '7_days': 7,
    '30_days': 30,
  }
  const days = mapping[query.datePreset]
  return {
    from: now - days * 24 * 60 * 60 * 1000,
    to: now,
  }
}

export function applyEmployeeQuery(items: Employee[], query: EmployeeQuery): PaginatedResult<Employee> {
  const search = query.search.trim().toLowerCase()
  const { from, to } = resolveRange(query)

  const filtered = items.filter((employee) => {
    const createdAt = new Date(employee.createdAt).getTime()

    const searchMatch =
      search.length === 0 ||
      [employee.name, employee.email, employee.department, employee.jobTitle]
        .join(' ')
        .toLowerCase()
        .includes(search)

    const statusMatch = query.status === 'all' || employee.status === query.status
    const departmentMatch = query.departmentFilter === 'all' || employee.department === query.departmentFilter
    const fromMatch = from === undefined || createdAt >= from
    const toMatch = to === undefined || createdAt <= to

    return searchMatch && statusMatch && departmentMatch && fromMatch && toMatch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (query.sortBy === 'createdAt') {
      return compare(a.createdAt, b.createdAt, query.sortDirection)
    }

    if (query.sortBy === 'department') {
      return compare(a.department, b.department, query.sortDirection)
    }

    return compare(a.name, b.name, query.sortDirection)
  })

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / query.perPage))
  const page = Math.min(Math.max(query.page, 1), totalPages)
  const start = (page - 1) * query.perPage
  const itemsPage = sorted.slice(start, start + query.perPage)

  return {
    items: itemsPage,
    page,
    perPage: query.perPage,
    total,
    totalPages,
  }
}

export async function listEmployees(query: EmployeeQuery): Promise<PaginatedResult<Employee>> {
  await wait(300)
  return applyEmployeeQuery(store, query)
}

export async function createEmployee(input: EmployeeFormInput): Promise<Employee> {
  await wait(250)
  const index = store.length + 1
  const employee: Employee = {
    id: String(index),
    employeeCode: `#${9500 + index}`,
    name: input.name,
    email: input.email,
    workType: input.workType,
    jobTitle: input.jobTitle,
    department: input.department,
    status: input.status,
    createdAt: new Date().toISOString(),
  }

  store.unshift(employee)
  return employee
}

export async function updateEmployee(id: string, input: EmployeeFormInput): Promise<Employee> {
  await wait(250)
  const existing = store.find((item) => item.id === id)
  if (!existing) {
    throw new Error('Employee not found')
  }

  const updated = {
    ...existing,
    ...input,
  }

  const idx = store.findIndex((item) => item.id === id)
  store[idx] = updated
  return updated
}

export async function updateEmployeeStatus(id: string, status: EmployeeStatus): Promise<Employee> {
  await wait(180)
  const existing = store.find((item) => item.id === id)
  if (!existing) {
    throw new Error('Employee not found')
  }

  const updated = {
    ...existing,
    status,
  }
  const idx = store.findIndex((item) => item.id === id)
  store[idx] = updated
  return updated
}

export async function deleteEmployee(id: string): Promise<boolean> {
  await wait(180)
  const idx = store.findIndex((item) => item.id === id)
  if (idx < 0) {
    throw new Error('Employee not found')
  }

  store.splice(idx, 1)
  return true
}

export function departments(): string[] {
  return Array.from(new Set(store.map((item) => item.department))).sort((a, b) => a.localeCompare(b))
}
