import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'
import { toSentenceCase } from '../../utils/helpers'

interface SectionConfig {
  subtitle: string
  metrics: Array<{ label: string; value: string }>
  actions: string[]
}

const sectionConfigs: Record<string, SectionConfig> = {
  attendance: {
    subtitle: 'Check-in patterns, shift compliance, and late trends.',
    metrics: [
      { label: 'On Time Today', value: '1,126' },
      { label: 'Late Arrivals', value: '87' },
      { label: 'Absence', value: '31' },
    ],
    actions: ['Approve Adjustment', 'Export Attendance', 'Notify Team'],
  },
  payroll: {
    subtitle: 'Salary cycle health, pending payouts, and approvals.',
    metrics: [
      { label: 'This Month', value: '$730,000' },
      { label: 'Pending', value: '$93,000' },
      { label: 'Processed', value: '612' },
    ],
    actions: ['Run Payroll', 'Download Payslips', 'Open Audit'],
  },
  departments: {
    subtitle: 'Headcount distribution and department-level ownership.',
    metrics: [
      { label: 'Total Departments', value: '12' },
      { label: 'Open Roles', value: '38' },
      { label: 'Managers', value: '24' },
    ],
    actions: ['Add Department', 'Assign Lead', 'Sync Org Chart'],
  },
  reports: {
    subtitle: 'KPI snapshots and historical HR analytics.',
    metrics: [
      { label: 'Generated Today', value: '17' },
      { label: 'Scheduled', value: '6' },
      { label: 'Exported', value: '39' },
    ],
    actions: ['Build Report', 'Schedule Report', 'Share Dashboard'],
  },
  calendar: {
    subtitle: 'Events, meetings, holidays, and upcoming deadlines.',
    metrics: [
      { label: 'Events Today', value: '9' },
      { label: 'Interviews', value: '14' },
      { label: 'Leaves Planned', value: '23' },
    ],
    actions: ['Create Event', 'Publish Holiday', 'Send Reminder'],
  },
  settings: {
    subtitle: 'Workspace controls, permissions, and integrations.',
    metrics: [
      { label: 'Active Integrations', value: '8' },
      { label: 'Roles', value: '16' },
      { label: 'Policies', value: '11' },
    ],
    actions: ['Manage Roles', 'Update Policy', 'Connect Tool'],
  },
  help: {
    subtitle: 'Support channels, guides, and resolution tracking.',
    metrics: [
      { label: 'Open Tickets', value: '14' },
      { label: 'Resolved Today', value: '22' },
      { label: 'Avg Response', value: '9m' },
    ],
    actions: ['Open Ticket', 'Contact Support', 'Browse Docs'],
  },
}

export function StubSectionPage() {
  const { section = 'section' } = useParams()
  const { push } = useToast()
  const title = toSentenceCase(section)
  const config = sectionConfigs[section] ?? {
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
      `${title} sync completed`,
      `${title} data refreshed`,
      `${title} summary exported`,
      `${title} notifications delivered`,
    ],
    [title],
  )

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div>
          <h1>{title}</h1>
          <p>{config.subtitle}</p>
        </div>

        <div className="cards-grid">
          {config.metrics.map((metric) => (
            <button
              key={metric.label}
              type="button"
              className="stat-card"
              onClick={() => push(`${title}: ${metric.label} opened.`, 'info')}
            >
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        <div className="tabs-row" role="tablist" aria-label={`${title} actions`}>
          {config.actions.map((action) => (
            <button
              key={action}
              type="button"
              className={activeAction === action ? 'tab-btn active' : 'tab-btn'}
              onClick={() => {
                setActiveAction(action)
                push(`${title}: ${action} triggered.`, 'success')
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
          <Button type="button" onClick={() => push(`${title}: ${activeAction} completed.`, 'success')}>
            Confirm {activeAction}
          </Button>
          <Button type="button" variant="secondary" onClick={() => push(`${title}: preview refreshed.`, 'info')}>
            Refresh Preview
          </Button>
        </div>
      </section>
    </div>
  )
}
