import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'

interface SectionConfig {
  title: string
  subtitle: string
  metrics: Array<{ label: string; value: string }>
  actions: string[]
}

const sectionConfigs: Record<string, SectionConfig> = {
  payslip: {
    title: 'Payslip',
    subtitle: 'Review and export employee payslip documents.',
    metrics: [
      { label: 'Generated This Month', value: '126' },
      { label: 'Pending Delivery', value: '14' },
      { label: 'Downloaded', value: '98' },
    ],
    actions: ['Generate Batch', 'Export PDF', 'Send Reminder'],
  },
  'payroll-calendar': {
    title: 'Payroll Calendar',
    subtitle: 'Track payroll milestones and processing checkpoints.',
    metrics: [
      { label: 'Upcoming Deadlines', value: '7' },
      { label: 'Cycles This Quarter', value: '3' },
      { label: 'Tasks Completed', value: '18' },
    ],
    actions: ['Add Milestone', 'Reschedule', 'Sync Team'],
  },
  'report-analytics': {
    title: 'Report & Analytics',
    subtitle: 'Analyze workforce trends and export key operational reports.',
    metrics: [
      { label: 'Reports Generated', value: '42' },
      { label: 'Scheduled Jobs', value: '9' },
      { label: 'CSV Exports', value: '27' },
    ],
    actions: ['Build Report', 'Schedule Export', 'Share Dashboard'],
  },
  vacancies: {
    title: 'Vacancies',
    subtitle: 'Manage open positions, priorities, and hiring progress.',
    metrics: [
      { label: 'Open Positions', value: '15' },
      { label: 'High Priority', value: '6' },
      { label: 'Hiring Managers', value: '11' },
    ],
    actions: ['Create Vacancy', 'Assign Owner', 'Publish'],
  },
  applicants: {
    title: 'Applicants',
    subtitle: 'Track candidates across sourcing and interview stages.',
    metrics: [
      { label: 'New This Week', value: '34' },
      { label: 'Interview Scheduled', value: '21' },
      { label: 'Offers Sent', value: '5' },
    ],
    actions: ['Move Stage', 'Schedule Interview', 'Archive'],
  },
  leaves: {
    title: 'Leaves',
    subtitle: 'Review leave requests and monitor team availability.',
    metrics: [
      { label: 'Pending Approvals', value: '8' },
      { label: 'Approved This Week', value: '19' },
      { label: 'Rejected', value: '2' },
    ],
    actions: ['Approve Batch', 'Export Calendar', 'Notify Team'],
  },
  'help-center': {
    title: 'Help Center',
    subtitle: 'Browse support resources and quick solutions.',
    metrics: [
      { label: 'Open Tickets', value: '12' },
      { label: 'Resolved Today', value: '17' },
      { label: 'SLA Met', value: '98%' },
    ],
    actions: ['Open Ticket', 'Contact Support', 'Browse Guides'],
  },
}

export function StubSectionPage() {
  const { section = 'section' } = useParams()
  const navigate = useNavigate()
  const { push } = useToast()
  const config = sectionConfigs[section] ?? {
    title: section,
    subtitle: 'Interactive section preview.',
    metrics: [
      { label: 'Primary KPI', value: '124' },
      { label: 'Secondary KPI', value: '93%' },
      { label: 'Pending Items', value: '12' },
    ],
    actions: ['Primary Action', 'Secondary Action', 'Export'],
  }

  const [activeAction, setActiveAction] = useState(config.actions[0])

  const timeline = useMemo(
    () => [
      `${config.title} synchronized`,
      `${config.title} refreshed`,
      `${config.title} export completed`,
      `${config.title} notifications delivered`,
    ],
    [config.title],
  )

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div>
          <h1>{config.title}</h1>
          <p>{config.subtitle}</p>
        </div>

        <div className="cards-grid">
          {config.metrics.map((metric) => (
            <button
              key={metric.label}
              type="button"
              className="stat-card"
              onClick={() => push(`${config.title}: ${metric.label} opened.`, 'info')}
            >
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <div className="tabs-row" role="tablist" aria-label={`${config.title} actions`}>
          {config.actions.map((action) => (
            <button
              key={action}
              type="button"
              className={activeAction === action ? 'tab-btn active' : 'tab-btn'}
              onClick={() => {
                setActiveAction(action)
                push(`${config.title}: ${action} triggered.`, 'success')
              }}
            >
              {action}
            </button>
          ))}
        </div>

        <div className="cards-grid">
          {timeline.map((entry) => (
            <button key={entry} type="button" className="stat-card" onClick={() => push(entry, 'info')}>
              <strong>{entry}</strong>
              <span>Click to inspect event details</span>
            </button>
          ))}
        </div>

        <div className="inline-actions">
          <Button type="button" onClick={() => push(`${config.title}: ${activeAction} completed.`, 'success')}>
            Confirm {activeAction}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/app/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </section>
    </div>
  )
}

