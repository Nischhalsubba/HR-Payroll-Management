import { useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'
import { toSentenceCase } from '../../utils/helpers'

export function StubSectionPage() {
  const { section = 'section' } = useParams()
  const { push } = useToast()

  const title = toSentenceCase(section)

  return (
    <div className="panel stack-lg">
      <div>
        <h1>{title}</h1>
        <p>
          This section is interactive in Phase 1 with preview actions while full feature implementation is pending.
        </p>
      </div>

      <div className="cards-grid">
        <button
          type="button"
          className="stat-card"
          onClick={() => push(`${title}: data refresh simulated.`, 'info')}
        >
          <strong>Refresh Data</strong>
          <span>Trigger sync interaction</span>
        </button>
        <button
          type="button"
          className="stat-card"
          onClick={() => push(`${title}: export simulated.`, 'success')}
        >
          <strong>Export Snapshot</strong>
          <span>Generate a section export placeholder</span>
        </button>
        <button
          type="button"
          className="stat-card"
          onClick={() => push(`${title}: workflow opened.`, 'info')}
        >
          <strong>Open Workflow</strong>
          <span>Navigate next action in this section</span>
        </button>
      </div>

      <div className="inline-actions">
        <Button type="button" onClick={() => push(`${title}: primary action clicked.`, 'success')}>
          Primary Action
        </Button>
        <Button type="button" variant="secondary" onClick={() => push(`${title}: secondary action clicked.`, 'info')}>
          Secondary Action
        </Button>
      </div>
    </div>
  )
}
