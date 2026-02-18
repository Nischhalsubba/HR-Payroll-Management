import { useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'attendance', label: 'Attendance', icon: 'attendance' },
  { key: 'employees', label: 'Employee', icon: 'employee' },
  { key: 'payroll', label: 'Payroll', icon: 'payroll' },
  { key: 'calendar', label: 'People Calendar', icon: 'calendar' },
  { key: 'reports', label: 'Training', icon: 'training' },
  { key: 'departments', label: 'Recruitment', icon: 'recruitment' },
  { key: 'help', label: 'Application', icon: 'application' },
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

function AppIcon({ name, className }: { name: string; className?: string }) {
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M16.1 16.4L21 21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'notification') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path
          d="M7 10.2a5 5 0 0 1 10 0v4.1l1.5 2.1H5.5L7 14.3zM10.3 18.2a1.8 1.8 0 0 0 3.4 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'message') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path d="M4.5 6.5h15v10h-8l-3.5 3v-3h-3.5z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }

  if (name === 'slider') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="4" width="7" height="4" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="10" width="7" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (name === 'attendance') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 3v4M16 3v4M4 10h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'employee') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <circle cx="12" cy="8.3" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 19a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'payroll') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <rect x="4.5" y="5" width="15" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10h8M8 14h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 10h16M8 3v4M16 3v4M8 14h2M12 14h2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (name === 'training') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path d="M5 7l7-3 7 3-7 3zM5 7v6l7 3 7-3V7" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (name === 'recruitment') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14.2 14.2L20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { push } = useToast()
  const { signOut, user } = useAuth()
  const [search, setSearch] = useState('')

  const section = location.pathname.split('/')[2] ?? 'dashboard'
  const title = navItems.find((item) => item.key === section)?.label ?? 'Dashboard'
  const subtitle = sectionDescriptions[section] ?? 'Manage your HR operations.'
  const initials = user?.name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    push(search.trim() ? `Search for "${search.trim()}" triggered.` : 'Enter a keyword to search.', 'info')
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand-wrap dashboard-shell-border">
          <div className="sidebar-brand-logo">
            <svg viewBox="0 0 31 32" aria-hidden="true" className="logo-mark">
              <path
                d="M7.3 6.3h16.4l-7.2 19.2H8.8l4.9-13.2h-6.4z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="sidebar-brand">HRMinds</div>
          <button type="button" className="sidebar-slider-btn" onClick={() => push('Sidebar toggled.', 'info')} aria-label="Toggle sidebar">
            <AppIcon name="slider" className="icon-svg" />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={`/app/${item.key}`}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <span className="sidebar-link-icon">
                <AppIcon name={item.icon} className="icon-svg" />
              </span>
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
                <AppIcon name="search" className="icon-svg" />
              </button>
            </form>

            <button
              type="button"
              className="icon-btn"
              onClick={() => push('Notifications opened.', 'info')}
              aria-label="Notifications"
            >
              <AppIcon name="notification" className="icon-svg" />
            </button>
            <button type="button" className="icon-btn" onClick={() => push('Inbox opened.', 'info')} aria-label="Messages">
              <AppIcon name="message" className="icon-svg" />
            </button>
            <button type="button" className="top-avatar" onClick={() => navigate('/app/settings')} aria-label="Open profile">
              {initials}
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
