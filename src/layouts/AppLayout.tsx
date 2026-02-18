import { useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { sidebarSections } from '../mocks/employees'
import { toSentenceCase } from '../utils/helpers'

const sectionDescriptions: Record<string, string> = {
  dashboard: 'Key HR metrics and employee activity.',
  employees: 'Manage employee records and updates.',
  attendance: 'Track attendance status and check-ins.',
  payroll: 'Process salary, bonuses, and payouts.',
  departments: 'Organize teams and department ownership.',
  reports: 'Review analytics and export insights.',
  calendar: 'Monitor events, shifts, and deadlines.',
  settings: 'Control workspace and account preferences.',
  help: 'Find support resources and documentation.',
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { push } = useToast()
  const { user, signOut } = useAuth()
  const [search, setSearch] = useState('')

  const section = location.pathname.split('/')[2] ?? 'dashboard'
  const title = toSentenceCase(section)
  const subtitle = sectionDescriptions[section] ?? 'Manage your HR operations.'

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    push(search.trim() ? `Search for "${search.trim()}" triggered.` : 'Enter a keyword to search.', 'info')
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">HRMinds</div>

        <nav className="sidebar-nav" aria-label="Main">
          {sidebarSections.map((item) => (
            <NavLink
              key={item}
              to={`/app/${item}`}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {toSentenceCase(item)}
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
        <header className="dashboard-top-nav">
          <div className="top-nav-title">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="top-nav-actions">
            <form className="top-nav-search" onSubmit={onSearchSubmit}>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search app"
                placeholder="Search here..."
              />
              <button type="submit" aria-label="Submit search">
                Search
              </button>
            </form>

            <button type="button" className="icon-btn" onClick={() => push('Notifications opened.', 'info')}>
              Notifications
            </button>
            <button type="button" className="icon-btn" onClick={() => push('Inbox opened.', 'info')}>
              Messages
            </button>
            <button type="button" className="top-avatar" onClick={() => navigate('/app/settings')} aria-label="Open profile">
              {user?.name?.[0] ?? 'A'}
            </button>
          </div>
        </header>

        <div className="dashboard-body">
          <Outlet />
        </div>
      </section>
    </div>
  )
}
