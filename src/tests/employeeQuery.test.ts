import { describe, expect, it } from 'vitest'
import { seedEmployees } from '../mocks/employees'
import { applyEmployeeQuery } from '../services/employeeService'
import type { EmployeeQuery } from '../types'

const base: EmployeeQuery = {
  search: '',
  status: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  page: 1,
  perPage: 10,
  datePreset: '30_days',
  dateRange: {},
  departmentFilter: 'all',
}

describe('applyEmployeeQuery', () => {
  it('filters by status and department together', () => {
    const rows = seedEmployees(54)
    const result = applyEmployeeQuery(rows, {
      ...base,
      status: 'active',
      departmentFilter: 'HR',
    })

    expect(result.items.every((item) => item.status === 'active' && item.department === 'HR')).toBe(true)
  })

  it('keeps pagination in valid range after strict filtering', () => {
    const rows = seedEmployees(54)
    const result = applyEmployeeQuery(rows, {
      ...base,
      status: 'inactive',
      page: 50,
      perPage: 20,
    })

    expect(result.page).toBeLessThanOrEqual(result.totalPages)
  })
})
