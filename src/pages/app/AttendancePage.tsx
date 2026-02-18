import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'

type AttendanceStatus = 'on-time' | 'late' | 'absence'
type AttendanceView = 'grid' | 'list' | 'detail'

interface AttendanceRow {
  id: string
  name: string
  email: string
  location: 'Remote' | 'Onsite'
  position: string
  checkIn: string
  checkOut: string
  status: AttendanceStatus
}

interface ActivityRow {
  type: string
  collaborator: string
  description: string
  status: 'Done' | 'In-Progress'
}

const rows: AttendanceRow[] = [
  {
    id: '5242',
    name: 'Arlene McCoy',
    email: 'ar@hrminds.com',
    location: 'Remote',
    position: 'Graphic Designer',
    checkIn: '08.00 AM',
    checkOut: '17.00 PM',
    status: 'on-time',
  },
  {
    id: '5541',
    name: 'Herna Marwis',
    email: 'he@hrminds.com',
    location: 'Onsite',
    position: 'Marketing Staff',
    checkIn: '08.30 AM',
    checkOut: '17.00 PM',
    status: 'late',
  },
  {
    id: '7931',
    name: 'Joanda David',
    email: 'jo@hrminds.com',
    location: 'Onsite',
    position: 'Video Editor',
    checkIn: '00.00 AM',
    checkOut: '00.00 PM',
    status: 'absence',
  },
  {
    id: '9514',
    name: 'Anna Davana',
    email: 'an@hrminds.com',
    location: 'Remote',
    position: 'UX Writer',
    checkIn: '08.10 AM',
    checkOut: '17.00 PM',
    status: 'late',
  },
]

const detailActivity: ActivityRow[] = [
  { type: 'Meeting', collaborator: '4 participant', description: 'Catch-Up Creative', status: 'In-Progress' },
  { type: 'Attendance', collaborator: 'Me', description: 'Daily attendance', status: 'Done' },
  { type: 'Meeting', collaborator: '25 participant', description: 'Monthly Evaluation', status: 'Done' },
  { type: 'Meeting', collaborator: '5 participant', description: 'Stand Up', status: 'Done' },
  { type: 'Retro', collaborator: '74 participant', description: 'Card session', status: 'Done' },
  { type: 'Meeting', collaborator: '46 participant', description: 'Catch-Up Creative', status: 'Done' },
]

function statusLabel(status: AttendanceStatus): string {
  if (status === 'on-time') {
    return 'On-time'
  }

  if (status === 'late') {
    return 'Late'
  }

  return 'Absence'
}

function statusClass(status: AttendanceStatus): string {
  if (status === 'on-time') {
    return 'att-status ontime'
  }

  if (status === 'late') {
    return 'att-status late'
  }

  return 'att-status absence'
}

function AttendanceFilterRow({ onAction }: { onAction: (message: string) => void }) {
  return (
    <div className="attendance-filters">
      <button type="button" className="chip-btn" onClick={() => onAction('Latest 3 Days selected.')}>Latest 3 Days</button>
      <button type="button" className="chip-btn" onClick={() => onAction('Date range filter opened.')}>3 Jan - 6 Jan</button>
      <button type="button" className="chip-btn" onClick={() => onAction('Filter panel opened.')}>Filter</button>
      <button type="button" className="chip-btn" onClick={() => onAction('Sort panel opened.')}>Short by</button>
    </div>
  )
}

function AttendanceTable({ rows, onRowOpen }: { rows: AttendanceRow[]; onRowOpen: (row: AttendanceRow) => void }) {
  return (
    <div className="table-wrap attendance-table-wrap">
      <table className="employee-table attendance-table">
        <thead>
          <tr>
            <th>ID Employee</th>
            <th>Employee Name</th>
            <th>Email Address</th>
            <th>Location</th>
            <th>Position</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} onClick={() => onRowOpen(row)}>
              <td>#{row.id}</td>
              <td>
                <div className="att-name-cell">
                  <span className="att-avatar" />
                  <span>{row.name}</span>
                </div>
              </td>
              <td>{row.email}</td>
              <td>{row.location}</td>
              <td>{row.position}</td>
              <td>{row.checkIn}</td>
              <td>{row.checkOut}</td>
              <td>
                <span className={statusClass(row.status)}>{statusLabel(row.status)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AttendanceGridView({ onOpenList, onOpenDetail }: { onOpenList: () => void; onOpenDetail: (id: string) => void }) {
  const { push } = useToast()

  return (
    <div className="attendance-grid-view stack-md">
      <section className="attendance-top-grid">
        <div className="attendance-metric-card">
          <div className="attendance-metric-title">
            <strong>Ontime</strong>
            <span>Last Week</span>
          </div>
          <div className="attendance-metric-bottom">
            <strong>120</strong>
            <span>+42 from today</span>
          </div>
        </div>
        <div className="attendance-metric-card">
          <div className="attendance-metric-title">
            <strong>Late</strong>
            <span>Last Week</span>
          </div>
          <div className="attendance-metric-bottom">
            <strong>42</strong>
            <span>+2 from latest day</span>
          </div>
        </div>
        <div className="attendance-metric-card">
          <div className="attendance-metric-title">
            <strong>Absence</strong>
            <span>Last Week</span>
          </div>
          <div className="attendance-metric-bottom">
            <strong>13</strong>
            <span>+1 from today</span>
          </div>
        </div>

        <aside className="attendance-profile-card">
          <div className="attendance-profile-head">
            <span className="att-profile-avatar" />
            <div>
              <strong>David Jack</strong>
              <span>ar@hrminds.com</span>
            </div>
          </div>

          <div className="attendance-profile-info">
            <div><span>Position</span><strong>Graphic Designer</strong></div>
            <div><span>Department</span><strong>Marketing</strong></div>
            <div><span>Total Hours Work</span><strong>158:521.621</strong></div>
            <div><span>Location</span><strong>Remote</strong></div>
            <div><span>Last Active</span><strong>Today, 03.24 PM</strong></div>
          </div>

          <button type="button" className="text-link" onClick={() => onOpenDetail('5242')}>
            See detail employee
          </button>

          <div className="attendance-profile-stats">
            <div><span>Attendance Rate</span><strong>84%</strong></div>
            <div><span>Percentage Day-Off</span><strong>3%</strong></div>
          </div>
        </aside>
      </section>

      <section className="panel stack-md">
        <h2>Percentage Attendance</h2>
        <div className="attendance-percent-bars" aria-label="Percentage attendance bars">
          {Array.from({ length: 26 }, (_, index) => (
            <span key={index} className="percent-bar" />
          ))}
        </div>
        <div className="attendance-percent-cards">
          <div><span>Ontime</span><strong>65%</strong></div>
          <div><span>Late</span><strong>38%</strong></div>
          <div><span>Absence</span><strong>12%</strong></div>
        </div>
      </section>

      <section className="panel stack-md">
        <div className="attendance-header-row">
          <h2>Attendence List</h2>
          <AttendanceFilterRow onAction={(message) => push(message, 'info')} />
          <div className="inline-actions">
            <Button type="button" variant="secondary" onClick={onOpenList}>See Detail</Button>
            <Button type="button" onClick={() => push('Add attendance record clicked.', 'success')}>+ Add</Button>
          </div>
        </div>
        <AttendanceTable rows={rows} onRowOpen={(row) => onOpenDetail(row.id)} />
      </section>
    </div>
  )
}

function AttendanceListView({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const { push } = useToast()
  const extendedRows = useMemo(() => [...rows, ...rows, ...rows], [])

  return (
    <section className="panel stack-md attendance-list-only">
      <div className="attendance-header-row">
        <h2>Attendence List</h2>
        <AttendanceFilterRow onAction={(message) => push(message, 'info')} />
        <div className="inline-actions">
          <Button type="button" variant="secondary" onClick={() => push('Attendance details panel opened.', 'info')}>
            See Detail
          </Button>
          <Button type="button" onClick={() => push('Add attendance record clicked.', 'success')}>
            + Add
          </Button>
        </div>
      </div>

      <AttendanceTable rows={extendedRows} onRowOpen={(row) => onOpenDetail(row.id)} />
    </section>
  )
}

function AttendanceDetailView({ employeeId }: { employeeId: string }) {
  const navigate = useNavigate()
  const { push } = useToast()
  const employee = rows.find((item) => item.id === employeeId) ?? rows[0]

  return (
    <section className="panel attendance-detail-page">
      <aside className="attendance-detail-left">
        <div className="attendance-detail-cover" />
        <span className="attendance-detail-avatar" />
        <div className="attendance-detail-name">
          <h2>David Jack</h2>
          <p>ar@hrminds.com</p>
        </div>

        <div className="attendance-detail-meta">
          <div><span>ID Employee</span><strong>#{employee.id}</strong></div>
          <div><span>Position</span><strong>Graphic Designer</strong></div>
          <div><span>Department</span><strong>Marketing</strong></div>
          <div><span>Total Hours Work</span><strong>158:521.621</strong></div>
          <div><span>Location</span><strong>Remote</strong></div>
          <div><span>Last Active</span><strong>Today, 03.24 PM</strong></div>
          <div><span>Check-In</span><strong>{employee.checkIn}</strong></div>
          <div><span>Check-Out</span><strong>{employee.checkOut}</strong></div>
          <div><span>Employment Status</span><strong>Contract</strong></div>
          <div><span>Day-Off Used</span><strong>24 day</strong></div>
          <div><span>Line Manager</span><strong>McCarry Anderson</strong></div>
        </div>

        <Button type="button" variant="secondary" fullWidth onClick={() => push('Attendance detail exported.', 'success')}>
          Download Report
        </Button>
      </aside>

      <div className="attendance-detail-right">
        <div className="attendance-detail-kpi-row">
          <div className="attendance-ring-card">
            <div className="ring">63%</div>
            <div>
              <strong>Attendance Rate per weekly</strong>
              <span>+4% increase</span>
            </div>
          </div>

          <div className="attendance-ring-card">
            <div className="ring">63%</div>
            <div>
              <strong>Day-Off Rate Percentage</strong>
              <span>+1% increase</span>
            </div>
          </div>
        </div>

        <div className="attendance-recent panel stack-md">
          <div className="attendance-header-row">
            <h2>Recent Activity</h2>
            <div className="attendance-filters">
              <button type="button" className="chip-btn" onClick={() => push('Latest 3 Days selected.', 'info')}>
                Latest 3 Days
              </button>
              <button type="button" className="chip-btn" onClick={() => push('Date range filter opened.', 'info')}>
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
                {detailActivity.map((activity, index) => (
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
            <Button type="button" variant="secondary" onClick={() => navigate('/app/attendance/list')}>
              Back To List
            </Button>
            <Button type="button" onClick={() => push('New activity created.', 'success')}>
              + New Activity
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AttendancePage({ view }: { view: AttendanceView }) {
  const navigate = useNavigate()
  const { employeeId = '5242' } = useParams()

  if (view === 'list') {
    return <AttendanceListView onOpenDetail={(id) => navigate(`/app/attendance/detail/${id}`)} />
  }

  if (view === 'detail') {
    return <AttendanceDetailView employeeId={employeeId} />
  }

  return (
    <AttendanceGridView
      onOpenList={() => navigate('/app/attendance/list')}
      onOpenDetail={(id) => navigate(`/app/attendance/detail/${id}`)}
    />
  )
}

