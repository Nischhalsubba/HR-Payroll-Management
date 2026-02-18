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
        <p>Interactive placeholder page. Use quick actions to validate click flows.</p>
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
          <span>Trigger export interaction</span>
        </button>
        <button
          type="button"
          className="stat-card"
          onClick={() => push(`${title}: report opened.`, 'info')}
        >
          <strong>Open Report</strong>
          <span>Trigger navigation interaction</span>
        </button>
      </div>

      <div className="inline-actions">
        <Button type="button" onClick={() => push('Primary action clicked.', 'success')}>
          Primary Action
        </Button>
        <Button type="button" variant="secondary" onClick={() => push('Secondary action clicked.', 'info')}>
          Secondary Action
        </Button>
      </div>
    </div>
  )
}
