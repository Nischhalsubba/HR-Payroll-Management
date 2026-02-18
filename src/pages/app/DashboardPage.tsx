import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'

type PayrollStatus = 'paid' | 'pending'

interface PayrollRow {
  id: string
  employeeName: string
  position: string
  baseSalary: string
  bonus: string
  netPay: string
  status: PayrollStatus
}

const metricCards = [
  {
    title: 'Total Employee',
    subtitle: 'Last Week',
    value: '863',
    info: '90% tech staff',
  },
  {
    title: 'Average KPI',
    subtitle: 'Last Week',
    value: '8.2/10',
    info: 'Increase 12%',
  },
  {
    title: 'Payroll Process',
    subtitle: 'Last Week',
    value: '$730,000',
    info: '55% pending',
  },
]

const attendanceBars = [
  { label: 'Jan', onTime: 76, late: 42, absence: 82 },
  { label: 'Feb', onTime: 64, late: 64, absence: 70 },
  { label: 'Mar', onTime: 72, late: 63, absence: 58 },
  { label: 'Jun', onTime: 72, late: 58, absence: 63 },
  { label: 'Jul', onTime: 55, late: 58, absence: 84 },
  { label: 'Aug', onTime: 81, late: 64, absence: 50 },
]

const scheduleItems = [
  { title: 'Training Session', time: '08.00 - 10.00 AM' },
  { title: 'Catch Up Team', time: '10.00 - 10.15 AM' },
  { title: 'Resume Review', time: '11.00 - 11.30 AM' },
  { title: 'Offer Dev Team Process', time: '01.00 - 01.45 PM' },
]

const payrollRows: PayrollRow[] = [
  {
    id: '#5242',
    employeeName: 'Takacs Bianka',
    position: 'Graphic Designer',
    baseSalary: '$4600',
    bonus: '$400',
    netPay: '$5000',
    status: 'paid',
  },
  {
    id: '#5541',
    employeeName: 'Kelemen Krisztina',
    position: 'IT Support',
    baseSalary: '$400',
    bonus: '$600',
    netPay: '$1000',
    status: 'pending',
  },
  {
    id: '#7931',
    employeeName: 'Balla Daniella',
    position: 'Business Analyst',
    baseSalary: '$9000',
    bonus: '$100',
    netPay: '$11000',
    status: 'paid',
  },
  {
    id: '#9514',
    employeeName: 'Surany Izabella',
    position: 'Software Engineer',
    baseSalary: '$15000',
    bonus: '$800',
    netPay: '$23000',
    status: 'pending',
  },
]

export function DashboardPage() {
  const { push } = useToast()
  const [activeTab, setActiveTab] = useState<'all' | PayrollStatus>('all')
  const [datePreset, setDatePreset] = useState('Latest 3 Days')
  const [dateRange, setDateRange] = useState('3 Jan - 6 Jan')

  const rows = useMemo(() => {
    if (activeTab === 'all') {
      return payrollRows
    }

    return payrollRows.filter((item) => item.status === activeTab)
  }, [activeTab])

  return (
    <div className="stack-lg">
      <div className="dashboard-grid">
        <section className="stack-md">
          <div className="metric-grid">
            {metricCards.map((card) => (
              <button
                key={card.title}
                type="button"
                className="metric-card"
                onClick={() => push(`${card.title} details opened.`, 'info')}
              >
                <div className="metric-title-wrap">
                  <strong>{card.title}</strong>
                  <span>{card.subtitle}</span>
                </div>
                <div className="metric-bottom">
                  <strong>{card.value}</strong>
                  <span>{card.info}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="panel attendance-panel stack-md">
            <div className="attendance-header">
              <h2>Attendance Overview</h2>
              <div className="inline-actions">
                <Button type="button" variant="secondary" onClick={() => push('Attendance report downloaded.', 'success')}>
                  Download Report
                </Button>
                <Button type="button" onClick={() => push('Attendance detail opened.', 'info')}>
                  See Detail
                </Button>
              </div>
            </div>

            <div className="attendance-content">
              <div className="attendance-stats stack-sm">
                <div>
                  <strong>1,412</strong>
                  <p>Today Attendance</p>
                </div>
                <div>
                  <strong>84.4%</strong>
                  <p>Attendance Rate</p>
                </div>
                <div className="attendance-legend">
                  <span>65% Ontime</span>
                  <span>38% Late</span>
                  <span>12% Absence</span>
                </div>
              </div>

              <div className="attendance-bars" aria-label="Attendance trend bars">
                {attendanceBars.map((bar) => (
                  <div key={bar.label} className="bar-stack">
                    <div className="bar-segment ontime" style={{ height: `${bar.onTime}%` }} />
                    <div className="bar-segment late" style={{ height: `${bar.late}%` }} />
                    <div className="bar-segment absence" style={{ height: `${bar.absence}%` }} />
                    <span>{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="stack-md">
          <div className="panel stack-md side-card">
            <div className="attendance-header">
              <h2>Schedule</h2>
              <Button type="button" variant="ghost" onClick={() => push('Showing today schedule.', 'info')}>
                Today
              </Button>
            </div>
            <div className="stack-sm">
              {scheduleItems.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  className="schedule-item"
                  onClick={() => push(`${item.title} opened.`, 'info')}
                >
                  <strong>{item.title}</strong>
                  <span>{item.time}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel stack-md side-card">
            <h2>Your Next Agenda</h2>
            <div className="stack-sm">
              <span>08.00 - 10.00 AM</span>
              <strong>Monthly Evaluation</strong>
              <p>43 participants</p>
            </div>
            <Button type="button" fullWidth onClick={() => push('Meeting joined (mock).', 'success')}>
              Join Meeting
            </Button>
          </div>
        </aside>
      </div>

      <section className="panel stack-md payroll-panel">
        <div className="attendance-header">
          <h2>Payroll Overview</h2>
          <Button type="button" onClick={() => push('New payroll opened.', 'success')}>
            + Create Payroll
          </Button>
        </div>

        <div className="inline-actions payroll-controls">
          <button type="button" className="chip-btn" onClick={() => setDatePreset('Latest 3 Days')}>
            {datePreset}
          </button>
          <button type="button" className="chip-btn" onClick={() => setDateRange('3 Jan - 6 Jan')}>
            {dateRange}
          </button>
          <button type="button" className="chip-btn" onClick={() => push('Payroll filter opened.', 'info')}>
            Filter
          </button>
          <button type="button" className="chip-btn" onClick={() => push('Payroll sort opened.', 'info')}>
            Sort by
          </button>
        </div>

        <div className="tabs-row" role="tablist" aria-label="Payroll status tabs">
          <button type="button" className={activeTab === 'all' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('all')}>
            All
          </button>
          <button
            type="button"
            className={activeTab === 'paid' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('paid')}
          >
            Paid
          </button>
          <button
            type="button"
            className={activeTab === 'pending' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </div>

        <div className="table-wrap">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID Employee</th>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Base Salary</th>
                <th>Bonus</th>
                <th>Net Pay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.employeeName}</td>
                  <td>{row.position}</td>
                  <td>{row.baseSalary}</td>
                  <td>{row.bonus}</td>
                  <td>{row.netPay}</td>
                  <td>
                    <span className={row.status === 'paid' ? 'status-pill paid' : 'status-pill pending'}>
                      {row.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
