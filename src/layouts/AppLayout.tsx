import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { TopNavNotifications } from '../components/app/TopNavNotifications'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import * as notificationService from '../services/notificationService'

interface NavItem {
  key: string
  label: string
  icon: string
  path: string
  legacyPaths?: string[]
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/app/dashboard' },
  {
    key: 'attandence',
    label: 'Attandence',
    icon: 'attendance',
    path: '/app/attandence',
    legacyPaths: ['/app/attendance'],
  },
  { key: 'employees', label: 'Employees', icon: 'employee', path: '/app/employees' },
  { key: 'payroll', label: 'Payroll', icon: 'payroll', path: '/app/payroll' },
  { key: 'payslip', label: 'Payslip', icon: 'payslip', path: '/app/payslip' },
  { key: 'payroll-calendar', label: 'Payroll Calendar', icon: 'calendar', path: '/app/payroll-calendar' },
  { key: 'report-analytics', label: 'Report & Analytics', icon: 'report', path: '/app/report-analytics' },
  { key: 'vacancies', label: 'Vacancies', icon: 'vacancies', path: '/app/vacancies' },
  { key: 'applicants', label: 'Applicants', icon: 'applicants', path: '/app/applicants' },
  { key: 'leaves', label: 'Leaves', icon: 'leaves', path: '/app/leaves' },
]

const utilityItems: NavItem[] = [
  { key: 'setting', label: 'Setting', icon: 'setting', path: '/app/setting' },
  { key: 'help-center', label: 'Help Center', icon: 'info', path: '/app/help-center' },
]

const sectionDescriptions: Record<string, string> = {
  dashboard: 'Key HR metrics and employee activity.',
  attandence: 'Track employee attendance and daily schedules.',
  employees: 'Manage employee records and updates.',
  payroll: 'Process salary, bonuses, and payouts.',
  payslip: 'Review payroll slips and payout details.',
  'payroll-calendar': 'Plan pay cycles and payroll milestones.',
  'report-analytics': 'Track trends, exports, and metrics.',
  vacancies: 'Manage open job positions and hiring needs.',
  applicants: 'Review applicants and progression stages.',
  leaves: 'Handle leave requests and team availability.',
  setting: 'Control workspace and account preferences.',
  'help-center': 'Review support resources and guides.',
  notifications: 'Recent updates across payroll, attendance, and requests.',
  profile: 'Manage your account details and security.',
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
        <rect x="3.8" y="4.2" width="16.4" height="15.4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10h8M8 14h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

  if (name === 'payslip') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <rect x="5" y="4.5" width="14" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10h8M8 14h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 10h16M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (name === 'report') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <rect x="4.5" y="5" width="15" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="8" y="12" width="2.5" height="4" rx="0.6" fill="currentColor" />
        <rect x="11.8" y="9" width="2.5" height="7" rx="0.6" fill="currentColor" />
        <rect x="15.6" y="11" width="2.5" height="5" rx="0.6" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'vacancies') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14.2 14.2L20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'applicants') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path d="M6 7h9l3 3v7.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (name === 'leaves') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path d="M12 4l6.5 3.8v8.4L12 20 5.5 16.2V7.8z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 4v16M5.5 7.8L12 12l6.5-4.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    )
  }

  if (name === 'setting') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M19.4 15l1-1.8-1-1.8-2.1-.4-.9-2-1.9-.8-1.7 1.1-1.7-1.1-1.9.8-.9 2-2.1.4-1 1.8 1 1.8 2.1.4.9 2 1.9.8 1.7-1.1 1.7 1.1 1.9-.8.9-2z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    )
  }

  if (name === 'logout') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14 8l4 4-4 4M9 12h9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v6M12 17h.01" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { push } = useToast()
  const { signOut, user } = useAuth()
  const [sidebarCompact, setSidebarCompact] = useState<boolean>(() => {
    try {
      return localStorage.getItem('atlashr_sidebar_compact') === 'true'
    } catch {
      return false
    }
  })
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const searchWrapRef = useRef<HTMLFormElement | null>(null)
  const notificationWrapRef = useRef<HTMLDivElement | null>(null)

  const section = location.pathname.split('/')[2] ?? 'dashboard'
  const activeTitle =
    [...navItems, ...utilityItems].find((item) => location.pathname.startsWith(item.path))?.label ??
    (section === 'notifications' ? 'Notifications' : section === 'profile' ? 'Profile' : 'Dashboard')
  const subtitle = sectionDescriptions[section] ?? 'Manage your HR operations.'
  const initials = user?.name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  const searchTargets = useMemo(
    () => [
      ...navItems.map((item) => ({ label: item.label, path: item.path })),
      ...utilityItems.map((item) => ({ label: item.label, path: item.path })),
      { label: 'Notifications', path: '/app/notifications' },
      { label: 'Profile', path: '/app/profile' },
    ],
    [],
  )

  const searchMatches = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) {
      return []
    }
    return searchTargets.filter((target) => target.label.toLowerCase().includes(value)).slice(0, 6)
  }, [search, searchTargets])

  useEffect(() => {
    void notificationService.unreadCount().then(setUnreadCount)
  }, [])

  useEffect(() => {
    localStorage.setItem('atlashr_sidebar_compact', sidebarCompact ? 'true' : 'false')
  }, [sidebarCompact])

  useEffect(() => {
    if (!mobileNavOpen) {
      return
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileNavOpen])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (notificationWrapRef.current && !notificationWrapRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false)
        setShowSearchSuggestions(false)
        setMobileNavOpen(false)
      }
    }

    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = search.trim().toLowerCase()
    if (!value) {
      push('Enter a keyword to search.', 'info')
      return
    }

    const match = searchTargets.find((item) => item.label.toLowerCase().includes(value))
    if (!match) {
      push(`No result found for "${search.trim()}".`, 'error')
      return
    }
    navigate(match.path)
    push(`Opened ${match.label}.`, 'success')
    setShowSearchSuggestions(false)
    setSearch('')
    setMobileNavOpen(false)
    setShowNotifications(false)
  }

  return (
    <div className={`dashboard-shell${sidebarCompact ? ' sidebar-compact' : ''}${mobileNavOpen ? ' mobile-nav-open' : ''}`}>
      <button
        type="button"
        className="sidebar-mobile-overlay"
        onClick={() => setMobileNavOpen(false)}
        aria-label="Close sidebar"
      />
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
          <div className="sidebar-brand">AtlasHR</div>
          <button
            type="button"
            className="sidebar-slider-btn"
            onClick={() => setSidebarCompact((value) => !value)}
            aria-label="Toggle sidebar"
            aria-pressed={sidebarCompact}
          >
            <AppIcon name="slider" className="icon-svg" />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
              onClick={() => {
                setMobileNavOpen(false)
                setShowNotifications(false)
                setShowSearchSuggestions(false)
              }}
            >
              <span className="sidebar-link-icon">
                <AppIcon name={item.icon} className="icon-svg" />
              </span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="premium-card"
            onClick={() => navigate('/app/report-analytics')}
            aria-label="Open premium report section"
          >
            <strong>More Feature With AtlasHR Premium</strong>
            <span>Upgrade your workspace to unlock more controls</span>
            <span className="premium-cta">Upgrade Pro</span>
          </button>

          <div className="sidebar-utility">
            {utilityItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={location.pathname.startsWith(item.path) ? 'sidebar-utility-btn active' : 'sidebar-utility-btn'}
                onClick={() => {
                  navigate(item.path)
                  setMobileNavOpen(false)
                  setShowNotifications(false)
                  setShowSearchSuggestions(false)
                }}
                aria-label={item.label}
                title={item.label}
              >
                <span className="sidebar-link-icon">
                  <AppIcon name={item.icon} className="icon-svg" />
                </span>
                <span className="sidebar-link-label">{item.label}</span>
              </button>
            ))}
            <button
              type="button"
              className="sidebar-utility-btn"
              onClick={() => {
                signOut()
                navigate('/auth/login')
                setMobileNavOpen(false)
                setShowNotifications(false)
                setShowSearchSuggestions(false)
              }}
              aria-label="Log Out"
              title="Log Out"
            >
              <span className="sidebar-link-icon">
                <AppIcon name="logout" className="icon-svg" />
              </span>
              <span className="sidebar-link-label">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-top-nav">
          <div className="top-nav-title">
            <button
              type="button"
              className="mobile-menu-btn icon-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open sidebar menu"
            >
              <AppIcon name="slider" className="icon-svg" />
            </button>
            <h1>{activeTitle}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="top-nav-actions">
            <form ref={searchWrapRef} className="top-nav-search" onSubmit={onSearchSubmit}>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setShowSearchSuggestions(true)
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                aria-label="Search app"
                placeholder="Search here.."
              />
              <button type="submit" aria-label="Submit search">
                <AppIcon name="search" className="icon-svg" />
              </button>
              {showSearchSuggestions && searchMatches.length > 0 ? (
                <div className="search-suggestions">
                  {searchMatches.map((match) => (
                    <button
                      key={match.path}
                      type="button"
                      onClick={() => {
                        navigate(match.path)
                        setShowSearchSuggestions(false)
                        setSearch('')
                        setMobileNavOpen(false)
                        setShowNotifications(false)
                      }}
                    >
                      {match.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </form>

            <div ref={notificationWrapRef} className="notification-wrap">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowNotifications((value) => !value)}
                aria-label="Notifications"
                aria-haspopup="menu"
                aria-expanded={showNotifications}
              >
                <AppIcon name="notification" className="icon-svg" />
                {unreadCount > 0 ? <span className="notification-badge">{Math.min(unreadCount, 99)}</span> : null}
              </button>

              {showNotifications ? (
                <TopNavNotifications
                  onClose={() => setShowNotifications(false)}
                  onCountChange={setUnreadCount}
                  onOpenDetail={(id) => {
                    navigate(`/app/notifications/${id}`)
                    setShowNotifications(false)
                  }}
                />
              ) : null}
            </div>

            <button
              type="button"
              className="icon-btn"
              onClick={() => push('Messages center opened (mock).', 'info')}
              aria-label="Messages"
            >
              <AppIcon name="message" className="icon-svg" />
            </button>
            <button type="button" className="top-avatar" onClick={() => navigate('/app/profile')} aria-label="Open profile">
              {initials}
            </button>
          </div>
        </header>

        <div className="dashboard-body">
          <div className="route-fade" key={location.pathname}>
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  )
}
