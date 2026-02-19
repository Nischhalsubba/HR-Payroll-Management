import { Outlet, useLocation } from 'react-router-dom'

export function AuthLayout() {
  const location = useLocation()

  return (
    <div className="auth-shell">
      <aside className="auth-visual" aria-hidden="true">
        <div className="auth-brand">AtlasHR</div>
        <div className="auth-dots">
          <span />
          <span />
          <span />
        </div>
        <p className="auth-tagline">Manage your team with confidence, speed, and clarity.</p>

        <div className="auth-visual-board">
          <div className="auth-chip-card">
            <div className="auth-summary-title">Attendance</div>
            <div className="auth-summary-value">97.8%</div>
          </div>
          <div className="auth-chip-card">
            <div className="auth-summary-title">Pending Leaves</div>
            <div className="auth-summary-value">12</div>
          </div>
          <div className="auth-summary-card">
            <div>
              <div className="auth-summary-title">Payroll Run</div>
              <strong>In Progress</strong>
            </div>
            <strong>74%</strong>
          </div>
          <div className="auth-mini-card">
            <div className="auth-summary-title">Remote</div>
            <strong>45 Team Members</strong>
          </div>
          <div className="auth-mini-card">
            <div className="auth-summary-title">On Site</div>
            <strong>81 Team Members</strong>
          </div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="route-fade" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
