import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
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

type EmployeeView = 'grid' | 'detail'

const rangeOptions = [
  { value: '3_6_jan', label: '3 Jan - 6 Jan', from: '2026-01-03', to: '2026-01-06' },
  { value: '7_14_jan', label: '7 Jan - 14 Jan', from: '2026-01-07', to: '2026-01-14' },
  { value: '15_30_jan', label: '15 Jan - 30 Jan', from: '2026-01-15', to: '2026-01-30' },
]

const activityRows: Array<{
  type: string
  collaborator: string
  description: string
  status: 'Done' | 'In-Progress'
}> = [
  { type: 'Meeting', collaborator: '4 participant', description: 'Catch-Up Creative', status: 'In-Progress' },
  { type: 'Attendance', collaborator: 'Me', description: 'Daily attendance', status: 'Done' },
  { type: 'Meeting', collaborator: '25 participant', description: 'Monthly Evaluation', status: 'Done' },
  { type: 'Meeting', collaborator: '5 participant', description: 'Stand Up', status: 'Done' },
  { type: 'Retro', collaborator: '74 participant', description: 'Card session', status: 'Done' },
  { type: 'Meeting', collaborator: '46 participant', description: 'Catch-Up Creative', status: 'Done' },
]

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

function toInitials(name: string): string {
  const [first = '', second = ''] = name.split(' ')
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
}

function pseudoHours(id: string): string {
  const value = Number(id) % 24
  return `${150 + value}:${500 + value}.621`
}

function pseudoManager(id: string): string {
  const managers = ['Jackson Hubner', 'Maria Anders', 'Dwayne Ford', 'Olivia James']
  return managers[Number(id) % managers.length]
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

function EmployeeGridView() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [query, setQuery] = useState<EmployeeQuery>(defaultQuery)
  const [rangeKey, setRangeKey] = useState(rangeOptions[0].value)
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
  const [openActionsFor, setOpenActionsFor] = useState<string | null>(null)

  const departmentOptions = useMemo<Option[]>(() => {
    return employeeService.departments().map((value) => ({
      label: value,
      value,
    }))
  }, [])

  useEffect(() => {
    if (!openActionsFor) {
      return
    }

    const onWindowClick = () => setOpenActionsFor(null)
    window.addEventListener('click', onWindowClick)

    return () => {
      window.removeEventListener('click', onWindowClick)
    }
  }, [openActionsFor])

  async function fetchData(nextQuery: EmployeeQuery) {
    setLoading(true)
    setError('')

    try {
      const data = await employeeService.listEmployees(nextQuery)
      setResult(data)
      setQuery((prev) => ({ ...prev, ...nextQuery, page: data.page, perPage: data.perPage }))
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
    <section className="panel employee-grid-page stack-md">
      <div className="employee-grid-head">
        <div className="employee-grid-title">
          <h1>Employee List</h1>
          <p>{result.total} employees matched</p>
        </div>

        <div className="employee-grid-controls">
          <Button
            type="button"
            className="employee-add-button"
            onClick={() => {
              setEditEmployee(null)
              setOpenModal(true)
            }}
          >
            + Add Employee
          </Button>

          <div className="employee-filter-pills">
            <label className="employee-filter-pill">
              <select
                aria-label="Date preset"
                value={query.datePreset}
                onChange={(event) => updateQuery({ datePreset: event.target.value as EmployeeQuery['datePreset'] })}
              >
                <option value="3_days">Latest 3 Days</option>
                <option value="7_days">Latest 7 Days</option>
                <option value="30_days">Latest 30 Days</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            <label className="employee-filter-pill">
              <select
                aria-label="Date range"
                value={rangeKey}
                onChange={(event) => {
                  setRangeKey(event.target.value)
                  const selected = rangeOptions.find((item) => item.value === event.target.value)
                  if (!selected) {
                    return
                  }
                  updateQuery({
                    datePreset: 'custom',
                    dateRange: {
                      from: selected.from,
                      to: selected.to,
                    },
                  })
                }}
              >
                {rangeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="employee-filter-pill">
              <select
                aria-label="Filter department"
                value={query.departmentFilter}
                onChange={(event) => updateQuery({ departmentFilter: event.target.value })}
              >
                <option value="all">Filter</option>
                {departmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="employee-filter-pill">
              <select
                aria-label="Sort employees"
                value={`${query.sortBy}:${query.sortDirection}`}
                onChange={(event) => {
                  const [sortBy, sortDirection] = event.target.value.split(':') as [
                    EmployeeQuery['sortBy'],
                    EmployeeQuery['sortDirection'],
                  ]
                  updateQuery({ sortBy, sortDirection })
                }}
              >
                <option value="createdAt:desc">Short by: Newest</option>
                <option value="createdAt:asc">Short by: Oldest</option>
                <option value="name:asc">Short by: Name A-Z</option>
                <option value="name:desc">Short by: Name Z-A</option>
                <option value="department:asc">Short by: Department</option>
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
          <table className="employee-table employee-figma-table">
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
              {result.items.map((employee) => {
                const menuOpen = openActionsFor === employee.id

                return (
                  <tr key={employee.id} onClick={() => navigate(`/app/employees/detail/${employee.id}`)}>
                    <td>{employee.employeeCode}</td>
                    <td>
                      <span className="employee-name-cell">
                        <span className="employee-avatar">{toInitials(employee.name)}</span>
                        <span>{employee.name}</span>
                      </span>
                    </td>
                    <td>{employee.email}</td>
                    <td>{employee.workType}</td>
                    <td>{employee.jobTitle}</td>
                    <td>{employee.department}</td>
                    <td>
                      <span className={`badge ${employee.status}`}>{toTitleStatus(employee.status)}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <div className="action-menu-wrap">
                          <Button
                            type="button"
                            variant="ghost"
                            className="action-trigger"
                            onClick={(event) => {
                              event.stopPropagation()
                              setOpenActionsFor((prev) => (prev === employee.id ? null : employee.id))
                            }}
                            aria-expanded={menuOpen}
                            aria-haspopup="menu"
                          >
                            Actions
                          </Button>

                          {menuOpen ? (
                            <div className="action-menu" role="menu" onClick={(event) => event.stopPropagation()}>
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setEditEmployee(employee)
                                  setOpenModal(true)
                                  setOpenActionsFor(null)
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  void onCycleStatus(employee)
                                  setOpenActionsFor(null)
                                }}
                              >
                                Change Status
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className="danger"
                                onClick={() => {
                                  setDeleteEmployeeId(employee.id)
                                  setOpenActionsFor(null)
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
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
    </section>
  )
}

function EmployeeDetailView() {
  const { employeeId = '' } = useParams()
  const navigate = useNavigate()
  const { push } = useToast()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openEdit, setOpenEdit] = useState(false)

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await employeeService.listEmployees({
          ...defaultQuery,
          search: '',
          status: 'all',
          page: 1,
          perPage: 200,
          datePreset: 'custom',
          dateRange: {},
          departmentFilter: 'all',
        })
        const found = data.items.find((item) => item.id === employeeId)
        if (!found) {
          setError('Employee not found.')
          setEmployee(null)
          return
        }
        setEmployee(found)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load employee.')
      } finally {
        setLoading(false)
      }
    }

    void fetchEmployee()
  }, [employeeId])

  async function onSaveEmployee(value: EmployeeFormInput) {
    if (!employee) {
      return
    }

    try {
      await employeeService.updateEmployee(employee.id, value)
      const updated = { ...employee, ...value }
      setEmployee(updated)
      push('Employee updated.', 'success')
    } catch (err) {
      push(err instanceof Error ? err.message : 'Unable to update employee.', 'error')
    }
  }

  async function onCycleStatus() {
    if (!employee) {
      return
    }

    try {
      const updated = await employeeService.updateEmployeeStatus(employee.id, nextStatus(employee.status))
      setEmployee(updated)
      push('Employee status updated.', 'success')
    } catch (err) {
      push(err instanceof Error ? err.message : 'Unable to update status.', 'error')
    }
  }

  if (loading) {
    return (
      <section className="panel status-box">
        <p>Loading employee detail...</p>
      </section>
    )
  }

  if (error || !employee) {
    return (
      <section className="panel status-box error">
        <p>{error || 'Employee not found.'}</p>
        <Button type="button" onClick={() => navigate('/app/employees')}>
          Back to Employee List
        </Button>
      </section>
    )
  }

  return (
    <section className="panel employee-detail-page">
      <aside className="employee-detail-left">
        <div className="employee-detail-cover" />
        <span className="employee-detail-avatar">{toInitials(employee.name)}</span>
        <div className="employee-detail-name">
          <h2>{employee.name}</h2>
          <p>{employee.email}</p>
        </div>

        <div className="employee-detail-meta">
          <div>
            <span>ID Employee</span>
            <strong>{employee.employeeCode}</strong>
          </div>
          <div>
            <span>Position</span>
            <strong>{employee.jobTitle}</strong>
          </div>
          <div>
            <span>Department</span>
            <strong>{employee.department}</strong>
          </div>
          <div>
            <span>Total Hours Work</span>
            <strong>{pseudoHours(employee.id)}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{employee.workType}</strong>
          </div>
          <div>
            <span>Last Active</span>
            <strong>Today, 03.24 PM</strong>
          </div>
          <div>
            <span>Check-In</span>
            <strong>08.00 AM</strong>
          </div>
          <div>
            <span>Check-Out</span>
            <strong>17.00 PM</strong>
          </div>
          <div>
            <span>Employement Status</span>
            <strong>{toTitleStatus(employee.status)}</strong>
          </div>
          <div>
            <span>Day-Off Used</span>
            <strong>{18 + (Number(employee.id) % 8)} day</strong>
          </div>
          <div>
            <span>Line Manager</span>
            <strong>{pseudoManager(employee.id)}</strong>
          </div>
        </div>

        <Button type="button" variant="secondary" fullWidth onClick={() => setOpenEdit(true)}>
          Edit Employee
        </Button>
        <Button type="button" variant="ghost" fullWidth onClick={() => void onCycleStatus()}>
          Change Status
        </Button>
      </aside>

      <div className="employee-detail-right">
        <div className="employee-detail-kpi-row">
          <article className="employee-graph-card">
            <div className="employee-graph-head">
              <strong>Performance Rate</strong>
              <span>+4% increase</span>
            </div>
            <div className="employee-graph-bars" aria-label="Performance rate bars">
              {Array.from({ length: 11 }, (_, index) => (
                <span
                  key={index}
                  className="employee-graph-bar"
                  style={{ height: `${22 + ((index * 7) % 48)}px` }}
                />
              ))}
            </div>
          </article>

          <article className="employee-ring-card">
            <div className="ring">63%</div>
            <div>
              <strong>Completed Task by Sprint</strong>
              <span>4 pending task</span>
            </div>
          </article>
        </div>

        <article className="employee-recent-card">
          <div className="employee-recent-head">
            <h3>Recent Activity</h3>
            <div className="employee-filter-pills">
              <button type="button" className="chip-btn" onClick={() => push('Latest 3 Days selected.', 'info')}>
                Latest 3 Days
              </button>
              <button type="button" className="chip-btn" onClick={() => push('Date range selected.', 'info')}>
                3 Jan - 6 Jan
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Type Activity</th>
                  <th>Collaborator</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activityRows.map((activity, index) => (
                  <tr key={`${activity.description}-${index}`}>
                    <td>{activity.type}</td>
                    <td>{activity.collaborator}</td>
                    <td>{activity.description}</td>
                    <td>
                      <span className={activity.status === 'Done' ? 'att-status ontime' : 'att-status pending'}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="inline-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/app/employees')}>
              Back to Employee List
            </Button>
            <Button type="button" onClick={() => push('New activity created.', 'success')}>
              + New Activity
            </Button>
          </div>
        </article>
      </div>

      <EmployeeFormModal
        open={openEdit}
        mode="edit"
        employee={employee}
        onClose={() => setOpenEdit(false)}
        onSave={onSaveEmployee}
      />
    </section>
  )
}

export function EmployeesPage({ view = 'grid' }: { view?: EmployeeView }) {
  if (view === 'detail') {
    return <EmployeeDetailView />
  }

  return <EmployeeGridView />
}
