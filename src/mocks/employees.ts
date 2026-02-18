import type { Employee, EmployeeStatus } from '../types'

const names = [
  'Wade Warren',
  'Jacob Jones',
  'Leslie Alexander',
  'Esther Howard',
  'Cameron Williamson',
  'Brooklyn Simmons',
  'Devon Lane',
  'Kathryn Murphy',
  'Jane Cooper',
  'Cody Fisher',
  'Bessie Cooper',
  'Ralph Edwards',
  'Kristin Watson',
  'Darrell Steward',
  'Savannah Nguyen',
  'Eleanor Pena',
  'Courtney Henry',
  'Theresa Webb',
]

const titles = [
  'HR Generalist',
  'Sales Executive',
  'Software Engineer',
  'Marketing Manager',
  'Account Specialist',
  'Recruiter',
  'Payroll Analyst',
  'Product Designer',
]

const departments = ['HR', 'Sales', 'Engineering', 'Marketing', 'Finance', 'IT']

const workTypes: Employee['workType'][] = ['Onsite', 'Hybrid', 'Remote']
const statuses: EmployeeStatus[] = ['active', 'on_leave', 'inactive']

function pick<T>(items: T[], index: number): T {
  return items[index % items.length]
}

function dateOffset(days: number): string {
  const base = new Date('2026-02-18T00:00:00Z')
  base.setDate(base.getDate() - days)
  return base.toISOString()
}

export function seedEmployees(count = 54): Employee[] {
  return Array.from({ length: count }, (_, index) => {
    const id = (index + 1).toString()
    const name = pick(names, index)
    const firstName = name.split(' ')[0].toLowerCase()
    const employeeCode = `#${9500 + index}`

    return {
      id,
      employeeCode,
      name,
      email: `${firstName}.${index + 1}@hrminds.com`,
      workType: pick(workTypes, index),
      jobTitle: pick(titles, index),
      department: pick(departments, index),
      status: pick(statuses, index),
      createdAt: dateOffset(index),
    }
  })
}

export const sidebarSections = [
  'dashboard',
  'employees',
  'attendance',
  'payroll',
  'departments',
  'reports',
  'calendar',
  'settings',
  'help',
]
