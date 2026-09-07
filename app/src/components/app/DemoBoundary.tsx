import { resetDemoData } from '../../mocks/db'
import { resetDemoStorage } from '../../utils/storage'

const boundaryStyle: React.CSSProperties = {
  alignItems: 'center',
  background: '#fff8e6',
  borderBottom: '1px solid #e6c96e',
  color: '#4d3b00',
  display: 'flex',
  flexWrap: 'wrap',
  fontSize: '0.875rem',
  gap: '0.75rem',
  justifyContent: 'center',
  lineHeight: 1.4,
  padding: '0.6rem 1rem',
  position: 'relative',
  zIndex: 1000,
}

const buttonStyle: React.CSSProperties = {
  background: '#4d3b00',
  border: 0,
  borderRadius: '0.4rem',
  color: '#fff',
  cursor: 'pointer',
  font: 'inherit',
  fontWeight: 700,
  padding: '0.35rem 0.65rem',
}

export function DemoBoundary() {
  const reset = () => {
    resetDemoData()
    resetDemoStorage()
    window.location.replace('/')
  }

  return (
    <aside aria-label="Prototype data notice" role="note" style={boundaryStyle}>
      <strong>Portfolio prototype</strong>
      <span>
        Uses synthetic, temporary browser data only. Do not enter real employee, salary, tax, bank, or identity information.
      </span>
      <button type="button" onClick={reset} style={buttonStyle}>
        Reset demo
      </button>
    </aside>
  )
}
