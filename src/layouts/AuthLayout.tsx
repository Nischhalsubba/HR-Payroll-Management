import { Outlet } from 'react-router-dom'

const messages = [
  'Your smart HR platform for work, time, and people.',
  'Track your time with one tap anytime, anywhere.',
  'Request and track leave in seconds.',
]

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <aside className="auth-visual">
        <div className="auth-brand">HRMinds</div>
        <div className="auth-dots">
          <span />
          <span />
          <span />
        </div>
        <p>{messages[new Date().getSeconds() % messages.length]}</p>
      </aside>
      <main className="auth-main">
        <Outlet />
      </main>
    </div>
  )
}
