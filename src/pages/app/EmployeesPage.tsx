import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { Pagination } from '../../components/ui/Pagination'
import { useToast } from '../../context/ToastContext'
import * as employeeService from '../../services/employeeService'
import type { Employee, EmployeeFormInput, EmployeeQuery, EmployeeStatus, Option, PaginatedResult } from '../../types'

const statusTabs: Array<{ label: string; value: EmployeeQuery['status'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'On-Leave', value: 'on_leave' },
  { label: 'In-Active', value: 'inactive' },
]

const employeeSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.email('Valid email required.'),
  workType: z.enum(['Onsite', 'Hybrid', 'Remote']),
  jobTitle: z.string().min(2, 'Job title is required.'),
  department: z.string().min(2, 'Department is required.'),
  status: z.enum(['active', 'on_leave', 'inactive']),
})

const defaultQuery: EmployeeQuery = {
  search: '',
  status: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  page: 1,
  perPage: 10,
  datePreset: '3_days',
  dateRange: {},
  departmentFilter: 'all',
}

function nextStatus(status: EmployeeStatus): EmployeeStatus {
  if (status === 'active') {
    return 'on_leave'
  }
  if (status === 'on_leave') {
    return 'inactive'
  }
  return 'active'
}

function toTitleStatus(status: EmployeeStatus): string {
  return status === 'on_leave' ? 'On-Leave' : status === 'inactive' ? 'In-Active' : 'Active'
}

function EmployeeFormModal({
  open,
  mode,
  employee,
  onClose,
  onSave,
}: {
  open: boolean
  mode: 'create' | 'edit'
  employee: Employee | null
  onClose: () => void
  onSave: (value: EmployeeFormInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      workType: 'Onsite',
      jobTitle: '',
      department: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }

    reset(
      employee
        ? {
            name: employee.name,
            email: employee.email,
            workType: employee.workType,
            jobTitle: employee.jobTitle,
            department: employee.department,
            status: employee.status,
          }
        : {
            name: '',
            email: '',
            workType: 'Onsite',
            jobTitle: '',
            department: '',
            status: 'active',
          },
    )
  }, [employee, open, reset])

  const submit = handleSubmit(async (value) => {
    await onSave(value)
    onClose()
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add Employee' : 'Edit Employee'}
      footer={
        <div className="inline-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="employee-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      }
    >
      <form id="employee-form" className="stack-md" onSubmit={submit}>
        <Field label="Name" id="employee-name" error={errors.name?.message} {...register('name')} />
        <Field label="Email" id="employee-email" type="email" error={errors.email?.message} {...register('email')} />
        <label className="field-wrap">
          <span className="field-label">Work Type</span>
          <select className="field-input" {...register('workType')}>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </label>
        <Field label="Job Title" id="employee-job-title" error={errors.jobTitle?.message} {...register('jobTitle')} />
        <Field
          label="Department"
          id="employee-department"
          error={errors.department?.message}
          {...register('department')}
        />
        <label className="field-wrap">
          <span className="field-label">Status</span>
          <select className="field-input" {...register('status')}>
            <option value="active">Active</option>
            <option value="on_leave">On-Leave</option>
            <option value="inactive">In-Active</option>
          </select>
        </label>
      </form>
    </Modal>
  )
}

export function EmployeesPage() {
  const { push } = useToast()
  const [query, setQuery] = useState<EmployeeQuery>(defaultQuery)
  const [result, setResult] = useState<PaginatedResult<Employee>>({
    items: [],
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null)

  const departmentOptions = useMemo<Option[]>(() => {
    return employeeService.departments().map((value) => ({
      label: value,
      value,
    }))
  }, [])

  async function fetchData(nextQuery: EmployeeQuery) {
    setLoading(true)
    setError('')

    try {
      const data = await employeeService.listEmployees(nextQuery)
      setResult(data)
      setQuery((prev) => ({ ...nextQuery, page: data.page, perPage: data.perPage, status: prev.status }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load employees.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData(query)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.search,
    query.status,
    query.page,
    query.perPage,
    query.sortBy,
    query.sortDirection,
    query.datePreset,
    query.dateRange.from,
    query.dateRange.to,
    query.departmentFilter,
  ])

  const updateQuery = (patch: Partial<EmployeeQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...patch,
      page: patch.page ?? 1,
    }))
  }

  async function onSaveEmployee(value: EmployeeFormInput) {
    try {
      if (editEmployee) {
        await employeeService.updateEmployee(editEmployee.id, value)
        push('Employee updated.', 'success')
      } else {
        await employeeService.createEmployee(value)
        push('Employee created.', 'success')
      }
      await fetchData({ ...query, page: 1 })
      setEditEmployee(null)
    } catch (err) {
      push(err instanceof Error ? err.message : 'Unable to save employee.', 'error')
    }
  }

  async function onDeleteEmployee() {
    if (!deleteEmployeeId) {
      return
    }

    try {
      await employeeService.deleteEmployee(deleteEmployeeId)
      push('Employee deleted.', 'success')
      setDeleteEmployeeId(null)
      await fetchData({ ...query, page: 1 })
    } catch (err) {
      push(err instanceof Error ? err.message : 'Unable to delete employee.', 'error')
    }
  }

  async function onCycleStatus(employee: Employee) {
    try {
      await employeeService.updateEmployeeStatus(employee.id, nextStatus(employee.status))
      push('Status updated.', 'success')
      await fetchData(query)
    } catch (err) {
      push(err instanceof Error ? err.message : 'Unable to update status.', 'error')
    }
  }

  return (
    <div className="panel stack-lg">
      <div className="employees-header">
        <div>
          <h1>Employee List</h1>
          <p>{result.total} employees matched</p>
        </div>

        <div className="employees-actions">
          <Button
            type="button"
            onClick={() => {
              setEditEmployee(null)
              setOpenModal(true)
            }}
          >
            + Add Employee
          </Button>

          <div className="filters-row">
            <label>
              <span>Date Preset</span>
              <select
                value={query.datePreset}
                onChange={(event) => updateQuery({ datePreset: event.target.value as EmployeeQuery['datePreset'] })}
              >
                <option value="3_days">Latest 3 Days</option>
                <option value="7_days">Latest 7 Days</option>
                <option value="30_days">Latest 30 Days</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            <label>
              <span>Range Start</span>
              <input
                type="date"
                value={query.dateRange.from ?? ''}
                onChange={(event) =>
                  updateQuery({
                    datePreset: 'custom',
                    dateRange: {
                      ...query.dateRange,
                      from: event.target.value || undefined,
                    },
                  })
                }
              />
            </label>

            <label>
              <span>Range End</span>
              <input
                type="date"
                value={query.dateRange.to ?? ''}
                onChange={(event) =>
                  updateQuery({
                    datePreset: 'custom',
                    dateRange: {
                      ...query.dateRange,
                      to: event.target.value || undefined,
                    },
                  })
                }
              />
            </label>

            <label>
              <span>Filter</span>
              <select
                value={query.departmentFilter}
                onChange={(event) => updateQuery({ departmentFilter: event.target.value })}
              >
                <option value="all">All Departments</option>
                {departmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Sort by</span>
              <select
                value={`${query.sortBy}:${query.sortDirection}`}
                onChange={(event) => {
                  const [sortBy, sortDirection] = event.target.value.split(':') as [
                    EmployeeQuery['sortBy'],
                    EmployeeQuery['sortDirection'],
                  ]
                  updateQuery({ sortBy, sortDirection })
                }}
              >
                <option value="createdAt:desc">Newest</option>
                <option value="createdAt:asc">Oldest</option>
                <option value="name:asc">Name A-Z</option>
                <option value="name:desc">Name Z-A</option>
                <option value="department:asc">Department A-Z</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="tabs-row" role="tablist" aria-label="Employee status tabs">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={query.status === tab.value ? 'tab-btn active' : 'tab-btn'}
            onClick={() => updateQuery({ status: tab.value })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="search-row">
        <input
          className="field-input"
          placeholder="Search employee name, email, job title..."
          value={query.search}
          onChange={(event) => updateQuery({ search: event.target.value })}
          aria-label="Search employees"
        />
        <Button type="button" variant="secondary" onClick={() => fetchData(query)}>
          Refresh
        </Button>
      </div>

      {loading ? <div className="status-box">Loading employees...</div> : null}
      {error ? (
        <div className="status-box error">
          <p>{error}</p>
          <Button type="button" onClick={() => fetchData(query)}>
            Retry
          </Button>
        </div>
      ) : null}

      {!loading && !error && result.items.length === 0 ? (
        <div className="status-box">
          <p>No employees found for this filter set.</p>
          <Button type="button" variant="secondary" onClick={() => setQuery(defaultQuery)}>
            Clear filters
          </Button>
        </div>
      ) : null}

      {!loading && !error && result.items.length > 0 ? (
        <div className="table-wrap">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Work Type</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.employeeCode}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.workType}</td>
                  <td>{employee.jobTitle}</td>
                  <td>{employee.department}</td>
                  <td>
                    <span className={`badge ${employee.status}`}>{toTitleStatus(employee.status)}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setEditEmployee(employee)
                          setOpenModal(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => onCycleStatus(employee)}>
                        Change Status
                      </Button>
                      <Button type="button" variant="danger" onClick={() => setDeleteEmployeeId(employee.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="table-footer">
        <label className="inline-actions">
          <span>Show per page</span>
          <select
            value={query.perPage}
            onChange={(event) => updateQuery({ perPage: Number(event.target.value), page: 1 })}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </label>

        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          onChange={(next) => updateQuery({ page: next })}
        />
      </div>

      <EmployeeFormModal
        open={openModal}
        mode={editEmployee ? 'edit' : 'create'}
        employee={editEmployee}
        onClose={() => {
          setOpenModal(false)
          setEditEmployee(null)
        }}
        onSave={onSaveEmployee}
      />

      <Modal
        open={Boolean(deleteEmployeeId)}
        onClose={() => setDeleteEmployeeId(null)}
        title="Delete Employee"
        footer={
          <div className="inline-actions">
            <Button type="button" variant="secondary" onClick={() => setDeleteEmployeeId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={onDeleteEmployee}>
              Delete
            </Button>
          </div>
        }
      >
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  )
}
