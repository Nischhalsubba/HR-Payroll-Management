import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { sidebarSections } from '../mocks/employees'
import { useAuth } from '../context/AuthContext'
import { toSentenceCase } from '../utils/helpers'

export function AppLayout() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">HRMinds</div>

        <nav className="sidebar-nav" aria-label="Main">
          {sidebarSections.map((section) => (
            <NavLink
              key={section}
              to={`/app/${section}`}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {toSentenceCase(section)}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="premium-card"
            onClick={() => navigate('/app/reports')}
            aria-label="Open premium report section"
          >
            <strong>Upgrade to Premium</strong>
            <span>Get advanced analytics and payroll automations</span>
          </button>

          <button
            type="button"
            className="premium-card"
            onClick={() => navigate('/app/settings')}
            aria-label="Open account settings"
          >
            <strong>{user?.name ?? 'Team Manager'}</strong>
            <span>{user?.email ?? 'admin@hrminds.com'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={() => {
              signOut()
              navigate('/auth/login')
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <section className="dashboard-content">
        <Outlet />
      </section>
    </div>
  )
}
