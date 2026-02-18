import { useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'D' },
  { key: 'attendance', label: 'Attendance', icon: 'A' },
  { key: 'employees', label: 'Employee', icon: 'E' },
  { key: 'payroll', label: 'Payroll', icon: 'P' },
  { key: 'calendar', label: 'People Calendar', icon: 'C' },
  { key: 'reports', label: 'Training', icon: 'T' },
  { key: 'departments', label: 'Recruitment', icon: 'R' },
  { key: 'help', label: 'Application', icon: 'Ap' },
]

const sectionDescriptions: Record<string, string> = {
  dashboard: 'Key HR metrics and employee activity.',
  employees: 'Manage employee records and updates.',
  attendance: 'Track employe attendance and manage daily.',
  payroll: 'Process salary, bonuses, and payouts.',
  departments: 'Manage hiring pipeline and teams.',
  reports: 'Plan training and track progress.',
  calendar: 'Handle people calendar and schedules.',
  settings: 'Control workspace and account preferences.',
  help: 'Review application and help center.',
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { push } = useToast()
  const { signOut } = useAuth()
  const [search, setSearch] = useState('')

  const section = location.pathname.split('/')[2] ?? 'dashboard'
  const title = section === 'attendance' ? 'Attendance' : navItems.find((item) => item.key === section)?.label ?? 'Dashboard'
  const subtitle = sectionDescriptions[section] ?? 'Manage your HR operations.'

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    push(search.trim() ? `Search for "${search.trim()}" triggered.` : 'Enter a keyword to search.', 'info')
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand-wrap">
          <div className="sidebar-brand-logo">H</div>
          <div className="sidebar-brand">HRMinds</div>
        </div>

        <nav className="sidebar-nav" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={`/app/${item.key}`}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
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
            <strong>More Feature With HRMindsPro</strong>
            <span>Upgrade your workspace to unlock more controls</span>
            <span className="premium-cta">Upgrade Pro</span>
          </button>

          <div className="sidebar-utility">
            <button type="button" className="sidebar-utility-btn" onClick={() => navigate('/app/settings')}>
              Setting
            </button>
            <button
              type="button"
              className="sidebar-utility-btn"
              onClick={() => {
                signOut()
                navigate('/auth/login')
              }}
            >
              Log Out
            </button>
          </div>
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
                placeholder="Search here.."
              />
              <button type="submit" aria-label="Submit search">
                <span>S</span>
              </button>
            </form>

            <button type="button" className="icon-btn" onClick={() => push('Notifications opened.', 'info')} aria-label="Notifications">
              N
            </button>
            <button type="button" className="icon-btn" onClick={() => push('Inbox opened.', 'info')} aria-label="Messages">
              M
            </button>
            <button type="button" className="top-avatar" onClick={() => navigate('/app/settings')} aria-label="Open profile">
              U
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
