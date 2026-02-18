import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Pagination } from '../../components/ui/Pagination'
import { useToast } from '../../context/ToastContext'

type PayrollStatus = 'paid' | 'pending' | 'processing'

interface PayrollRecord {
  id: string
  employeeCode: string
  employeeName: string
  position: string
  department: string
  baseSalary: number
  bonus: number
  netPay: number
  status: PayrollStatus
}

const tabs: Array<{ label: string; value: 'all' | PayrollStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
]

const initialRows: PayrollRecord[] = [
  { id: '1', employeeCode: '#5242', employeeName: 'Takacs Bianka', position: 'Graphic Designer', department: 'Marketing', baseSalary: 4600, bonus: 400, netPay: 5000, status: 'paid' },
  { id: '2', employeeCode: '#5541', employeeName: 'Kelemen Krisztina', position: 'IT Support', department: 'IT', baseSalary: 4200, bonus: 600, netPay: 4800, status: 'pending' },
  { id: '3', employeeCode: '#7931', employeeName: 'Balla Daniella', position: 'Business Analyst', department: 'Finance', baseSalary: 9000, bonus: 1100, netPay: 10100, status: 'processing' },
  { id: '4', employeeCode: '#9514', employeeName: 'Surany Izabella', position: 'Software Engineer', department: 'Engineering', baseSalary: 15000, bonus: 800, netPay: 15800, status: 'pending' },
  { id: '5', employeeCode: '#9561', employeeName: 'Somogyi Adel', position: 'HR Specialist', department: 'HR', baseSalary: 5100, bonus: 300, netPay: 5400, status: 'paid' },
  { id: '6', employeeCode: '#9562', employeeName: 'Sipos Veronika', position: 'Support Manager', department: 'Operation', baseSalary: 6900, bonus: 500, netPay: 7400, status: 'processing' },
  { id: '7', employeeCode: '#9563', employeeName: 'Molnar Fruzsina', position: 'UX Designer', department: 'IT', baseSalary: 6400, bonus: 550, netPay: 6950, status: 'paid' },
  { id: '8', employeeCode: '#9564', employeeName: 'Illes Eva', position: 'IT Support', department: 'IT', baseSalary: 6000, bonus: 250, netPay: 6250, status: 'pending' },
]

const schema = z.object({
  employeeCode: z.string().min(2),
  employeeName: z.string().min(2),
  position: z.string().min(2),
  department: z.string().min(2),
  baseSalary: z.number().min(1),
  bonus: z.number().min(0),
  status: z.enum(['paid', 'pending', 'processing']),
})

type PayrollForm = z.infer<typeof schema>

function currency(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

function initials(value: string): string {
  const [first = '', second = ''] = value.split(' ')
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
}

function statusClass(value: PayrollStatus): string {
  if (value === 'paid') {
    return 'status-pill paid'
  }
  if (value === 'processing') {
    return 'status-pill processing'
  }
  return 'status-pill pending'
}

function PayrollFormModal({
  open,
  row,
  onClose,
  onSave,
}: {
  open: boolean
  row: PayrollRecord | null
  onClose: () => void
  onSave: (input: PayrollForm) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PayrollForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeCode: '',
      employeeName: '',
      position: '',
      department: '',
      baseSalary: 0,
      bonus: 0,
      status: 'pending',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }
    reset(
      row
        ? {
            employeeCode: row.employeeCode,
            employeeName: row.employeeName,
            position: row.position,
            department: row.department,
            baseSalary: row.baseSalary,
            bonus: row.bonus,
            status: row.status,
          }
        : {
            employeeCode: '',
            employeeName: '',
            position: '',
            department: '',
            baseSalary: 0,
            bonus: 0,
            status: 'pending',
          },
    )
  }, [open, reset, row])

  return (
    <Modal
      open={open}
      title={row ? 'Edit Payroll' : 'Create Payroll'}
      onClose={onClose}
      footer={
        <div className="inline-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="payroll-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      }
    >
      <form
        id="payroll-form"
        className="stack-md"
        onSubmit={handleSubmit((value) => {
          onSave(value)
          onClose()
        })}
      >
        <label className="field-wrap">
          <span className="field-label">Employee Code</span>
          <input className={`field-input ${errors.employeeCode ? 'field-error' : ''}`} {...register('employeeCode')} />
        </label>
        <label className="field-wrap">
          <span className="field-label">Employee Name</span>
          <input className={`field-input ${errors.employeeName ? 'field-error' : ''}`} {...register('employeeName')} />
        </label>
        <label className="field-wrap">
          <span className="field-label">Position</span>
          <input className={`field-input ${errors.position ? 'field-error' : ''}`} {...register('position')} />
        </label>
        <label className="field-wrap">
          <span className="field-label">Department</span>
          <input className={`field-input ${errors.department ? 'field-error' : ''}`} {...register('department')} />
        </label>
        <label className="field-wrap">
          <span className="field-label">Base Salary</span>
          <input
            type="number"
            className={`field-input ${errors.baseSalary ? 'field-error' : ''}`}
            {...register('baseSalary', { valueAsNumber: true })}
          />
        </label>
        <label className="field-wrap">
          <span className="field-label">Bonus</span>
          <input
            type="number"
            className={`field-input ${errors.bonus ? 'field-error' : ''}`}
            {...register('bonus', { valueAsNumber: true })}
          />
        </label>
        <label className="field-wrap">
          <span className="field-label">Status</span>
          <select className="field-input" {...register('status')}>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
          </select>
        </label>
      </form>
    </Modal>
  )
}

export function PayrollPage() {
  const { push } = useToast()
  const [rows, setRows] = useState(initialRows)
  const [activeTab, setActiveTab] = useState<'all' | PayrollStatus>('all')
  const [datePreset, setDatePreset] = useState('Latest 3 Days')
  const [dateRange, setDateRange] = useState('3 Jan - 6 Jan')
  const [department, setDepartment] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'pay'>('newest')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [editRow, setEditRow] = useState<PayrollRecord | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [openActionsFor, setOpenActionsFor] = useState<string | null>(null)

  const departments = useMemo(() => ['all', ...Array.from(new Set(rows.map((row) => row.department))).sort()], [rows])

  const filtered = useMemo(() => {
    let data = [...rows]

    if (activeTab !== 'all') {
      data = data.filter((row) => row.status === activeTab)
    }
    if (department !== 'all') {
      data = data.filter((row) => row.department === department)
    }
    if (search.trim()) {
      const keyword = search.trim().toLowerCase()
      data = data.filter((row) => [row.employeeCode, row.employeeName, row.position, row.department].join(' ').toLowerCase().includes(keyword))
    }

    if (sortBy === 'name') {
      data.sort((a, b) => a.employeeName.localeCompare(b.employeeName))
    } else if (sortBy === 'pay') {
      data.sort((a, b) => b.netPay - a.netPay)
    } else {
      data.sort((a, b) => Number(b.id) - Number(a.id))
    }

    return data
  }, [activeTab, department, rows, search, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const visibleRows = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  const saveForm = (input: PayrollForm) => {
    if (editRow) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editRow.id
            ? {
                ...row,
                ...input,
                netPay: input.baseSalary + input.bonus,
              }
            : row,
        ),
      )
      push('Payroll updated.', 'success')
      return
    }

    const id = String(Date.now())
    setRows((prev) => [
      {
        id,
        employeeCode: input.employeeCode,
        employeeName: input.employeeName,
        position: input.position,
        department: input.department,
        baseSalary: input.baseSalary,
        bonus: input.bonus,
        netPay: input.baseSalary + input.bonus,
        status: input.status,
      },
      ...prev,
    ])
    setPage(1)
    push('Payroll created.', 'success')
  }

  const deleteRow = () => {
    if (!deleteId) {
      return
    }
    setRows((prev) => prev.filter((row) => row.id !== deleteId))
    setDeleteId(null)
    push('Payroll deleted.', 'success')
  }

  return (
    <section className="panel payroll-page stack-md">
      <div className="employee-grid-head">
        <div className="employee-grid-title">
          <h1>Payroll Overview</h1>
          <p>{filtered.length} payroll records matched</p>
        </div>

        <div className="employee-grid-controls">
          <Button
            type="button"
            className="employee-add-button"
            onClick={() => {
              setEditRow(null)
              setOpenForm(true)
            }}
          >
            + Create Payroll
          </Button>

          <div className="employee-filter-pills">
            <label className="employee-filter-pill">
              <select
                value={datePreset}
                onChange={(event) => {
                  setDatePreset(event.target.value)
                  push(`${event.target.value} selected.`, 'info')
                }}
              >
                <option value="Latest 3 Days">Latest 3 Days</option>
                <option value="Latest 7 Days">Latest 7 Days</option>
                <option value="Latest 30 Days">Latest 30 Days</option>
              </select>
            </label>
            <label className="employee-filter-pill">
              <select
                value={dateRange}
                onChange={(event) => {
                  setDateRange(event.target.value)
                  push(`${event.target.value} selected.`, 'info')
                }}
              >
                <option value="3 Jan - 6 Jan">3 Jan - 6 Jan</option>
                <option value="7 Jan - 14 Jan">7 Jan - 14 Jan</option>
                <option value="15 Jan - 30 Jan">15 Jan - 30 Jan</option>
              </select>
            </label>
            <label className="employee-filter-pill">
              <select value={department} onChange={(event) => setDepartment(event.target.value)}>
                {departments.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'Filter' : option}
                  </option>
                ))}
              </select>
            </label>
            <label className="employee-filter-pill">
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'newest' | 'name' | 'pay')}>
                <option value="newest">Short by: Newest</option>
                <option value="name">Short by: Name</option>
                <option value="pay">Short by: Net Pay</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="tabs-row" role="tablist" aria-label="Payroll status tabs">
        {tabs.map((tab) => (
          <button key={tab.value} type="button" className={activeTab === tab.value ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab(tab.value)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="search-row">
        <input
          className="field-input"
          placeholder="Search employee code, name, position..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          aria-label="Search payroll"
        />
        <Button type="button" variant="secondary" onClick={() => push('Payroll list refreshed.', 'info')}>
          Refresh
        </Button>
      </div>

      {visibleRows.length === 0 ? (
        <div className="status-box">
          <p>No payroll records found for this filter set.</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setActiveTab('all')
              setDepartment('all')
              setSearch('')
              setSortBy('newest')
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="employee-table employee-figma-table">
            <thead>
              <tr>
                <th>ID Employee</th>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Base Salary</th>
                <th>Bonus</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => {
                const menuOpen = openActionsFor === row.id
                return (
                  <tr key={row.id}>
                    <td>{row.employeeCode}</td>
                    <td>
                      <span className="employee-name-cell">
                        <span className="employee-avatar">{initials(row.employeeName)}</span>
                        <span>{row.employeeName}</span>
                      </span>
                    </td>
                    <td>{row.position}</td>
                    <td>{row.department}</td>
                    <td>{currency(row.baseSalary)}</td>
                    <td>{currency(row.bonus)}</td>
                    <td>{currency(row.netPay)}</td>
                    <td>
                      <span className={statusClass(row.status)}>
                        {row.status === 'paid' ? 'Paid' : row.status === 'processing' ? 'Processing' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="action-menu-wrap">
                        <Button
                          type="button"
                          variant="ghost"
                          className="action-trigger"
                          onClick={() => setOpenActionsFor((prev) => (prev === row.id ? null : row.id))}
                          aria-expanded={menuOpen}
                          aria-haspopup="menu"
                        >
                          Actions
                        </Button>
                        {menuOpen ? (
                          <div className="action-menu" role="menu">
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setEditRow(row)
                                setOpenForm(true)
                                setOpenActionsFor(null)
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setRows((prev) =>
                                  prev.map((item) =>
                                    item.id === row.id
                                      ? {
                                          ...item,
                                          status: item.status === 'paid' ? 'pending' : 'paid',
                                        }
                                      : item,
                                  ),
                                )
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
                                setDeleteId(row.id)
                                setOpenActionsFor(null)
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="table-footer">
        <label className="inline-actions">
          <span>Show per page</span>
          <select
            value={perPage}
            onChange={(event) => {
              setPerPage(Number(event.target.value))
              setPage(1)
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </label>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </div>

      <PayrollFormModal open={openForm} row={editRow} onClose={() => setOpenForm(false)} onSave={saveForm} />

      <Modal
        open={Boolean(deleteId)}
        title="Delete Payroll"
        onClose={() => setDeleteId(null)}
        footer={
          <div className="inline-actions">
            <Button type="button" variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={deleteRow}>
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
